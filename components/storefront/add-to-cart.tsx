"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart/cart-store";
import type { Product } from "@/lib/types";
import { activePrice } from "@/lib/utils";

export function AddToCart({ product }: { product: Product }) {
  const cart = useCart();
  const variants = useMemo(
    () => product.product_variants?.filter((variant) => variant.is_active) ?? [],
    [product.product_variants]
  );
  const colors = [...new Set(variants.map((variant) => variant.color_name))];
  const [color, setColor] = useState(colors[0] ?? "");
  const sizes = [...new Set(variants.filter((variant) => variant.color_name === color).map((variant) => variant.size))];
  const [size, setSize] = useState(sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const image = product.product_images?.[0]?.url ?? "";

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.color_name === color && variant.size === size),
    [color, size, variants]
  );

  function chooseColor(value: string) {
    setColor(value);
    const firstSize = variants.find((variant) => variant.color_name === value)?.size ?? "";
    setSize(firstSize);
  }

  function add() {
    if (!selectedVariant || selectedVariant.stock < quantity) return;
    cart.addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      name: product.name,
      imageUrl: image,
      color,
      size,
      unitPrice: activePrice(product),
      quantity
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-ink/50">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((item) => {
            const variant = variants.find((entry) => entry.color_name === item);
            return (
              <button
                key={item}
                onClick={() => chooseColor(item)}
                className={`focus-ring flex items-center gap-2 border px-3 py-2 text-sm font-bold ${
                  color === item ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"
                }`}
              >
                <span className="h-4 w-4 border border-ink/20" style={{ background: variant?.color_value ?? item }} />
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-ink/50">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => {
            const variant = variants.find((entry) => entry.color_name === color && entry.size === item);
            const disabled = !variant || variant.stock <= 0;
            return (
              <button
                key={item}
                disabled={disabled}
                onClick={() => setSize(item)}
                className={`focus-ring min-w-12 border px-4 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-30 ${
                  size === item ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-14 border border-ink">
          <button className="w-12 text-xl" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
            -
          </button>
          <span className="grid w-12 place-items-center border-x border-ink font-black">{quantity}</span>
          <button className="w-12 text-xl" onClick={() => setQuantity(Math.min(20, quantity + 1))} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button
          onClick={add}
          disabled={!selectedVariant || selectedVariant.stock < quantity}
          className="focus-ring inline-flex h-14 flex-1 items-center justify-center gap-3 bg-blood px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          <ShoppingBag size={18} />
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
      <p className="text-sm font-bold text-ink/65">
        {selectedVariant ? `${selectedVariant.stock} in stock for ${color} / ${size}` : "Select an available variant"}
      </p>
      {image && <Image src={image} alt="" width={1} height={1} className="hidden" />}
    </div>
  );
}
