"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";

const key = "dyt-cart";
const cartEvent = "dyt-cart-updated";

function persist(items: CartLine[]) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(cartEvent));
}

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]") as CartLine[];
    return parsed.map((item) => {
      const maxStock = Math.max(0, Number(item.maxStock ?? 20));
      return { ...item, maxStock, quantity: Math.max(1, Math.min(item.quantity, maxStock || 1)) };
    });
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    setHydrated(true);
    window.addEventListener(cartEvent, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(cartEvent, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return useMemo(
    () => ({
      items,
      hydrated,
      addItem(line: CartLine) {
        const current = readCart();
        const existing = current.find((item) => item.variantId === line.variantId);
        const next = existing
          ? current.map((item) =>
              item.variantId === line.variantId
                ? { ...item, maxStock: line.maxStock, quantity: Math.min(item.quantity + line.quantity, line.maxStock) }
                : item
            )
          : [...current, line];
        persist(next);
        setItems(next);
      },
      removeItem(variantId: string) {
        const next = readCart().filter((item) => item.variantId !== variantId);
        persist(next);
        setItems(next);
      },
      setQuantity(variantId: string, quantity: number) {
        const next = readCart().map((item) => item.variantId === variantId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxStock)) }
          : item);
        persist(next);
        setItems(next);
      },
      clear() {
        persist([]);
        setItems([]);
      }
    }),
    [hydrated, items]
  );
}
