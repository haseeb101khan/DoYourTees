"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-store";

export function Header({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = (
    <>
      <Link href="/shop" className="text-sm font-bold uppercase tracking-[0.18em] hover:text-blood">
        Shop
      </Link>
      {categories.slice(0, 4).map((category) => (
        <Link
          key={category.id}
          href={`/shop?category=${category.slug}`}
          className="text-sm font-bold uppercase tracking-[0.18em] hover:text-blood"
        >
          {category.name}
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/95 backdrop-blur">
      <div className="container-pad flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-end gap-3" aria-label="DYT home">
          <span className="text-4xl font-black leading-none tracking-tight">DYT</span>
          <span className="mb-1 hidden text-xs font-bold uppercase tracking-[0.22em] text-ink/55 sm:block">
            Do Your Tee
          </span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">{nav}</nav>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="focus-ring relative inline-flex h-11 w-11 items-center justify-center border border-ink bg-ink text-white transition hover:bg-blood"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center bg-blood px-1 text-xs font-black text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-ink lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-ink text-white lg:hidden">
          <div className="container-pad flex h-20 items-center justify-between">
            <span className="text-4xl font-black">DYT</span>
            <button
              className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-white"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="container-pad mt-10 flex flex-col gap-7" onClick={() => setOpen(false)}>
            {nav}
            <Link href="/checkout" className="mt-8 bg-blood px-5 py-4 text-center text-sm font-black uppercase tracking-[0.22em]">
              Checkout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
