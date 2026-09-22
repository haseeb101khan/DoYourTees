"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart/cart-store";
import type { Product } from "@/lib/types";
import { activePrice, formatMoney } from "@/lib/utils";

const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export function AddToCart({ product }: { product: Product }) {
  const cart = useCart();
  const variants = useMemo(() => product.product_variants?.filter((variant) => variant.is_active) ?? [], [product.product_variants]);
  const colors = [...new Set(variants.map((variant) => variant.color_name))];
  const sizes = [...new Set([...sizeOrder.slice(1, 6), ...variants.map((variant) => variant.size)])].sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex);
  });
  const firstAvailable = variants.find((variant) => variant.stock > 0);
  const [color, setColor] = useState(firstAvailable?.color_name ?? colors[0] ?? "");
  const [size, setSize] = useState(firstAvailable?.size ?? sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const image = product.product_images?.[0]?.url ?? "";

  const selectedVariant = variants.find((variant) => variant.color_name === color && variant.size === size);
  const available = Boolean(selectedVariant && selectedVariant.stock > 0);

  useEffect(() => {
    setQuantity((current) => Math.max(1, Math.min(current, selectedVariant?.stock ?? 1)));
  }, [selectedVariant?.id, selectedVariant?.stock]);

  function chooseColor(value: string) {
    setColor(value);
    const next = variants.find((variant) => variant.color_name === value && variant.stock > 0)
      ?? variants.find((variant) => variant.color_name === value);
    setSize(next?.size ?? "");
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
      quantity,
      maxStock: selectedVariant.stock
    });
    setAdded(true);
    window.dispatchEvent(new Event("dyt-cart-open"));
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-ink/50">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((item) => {
            const colorVariants = variants.filter((entry) => entry.color_name === item);
            const variant = colorVariants[0];
            const disabled = !colorVariants.some((entry) => entry.stock > 0);
            return (
              <button key={item} type="button" disabled={disabled} onClick={() => chooseColor(item)} className={`focus-ring flex min-h-11 items-center gap-2 border px-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35 ${color === item ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"}`}>
                <span className="h-4 w-4 border border-ink/20" style={{ background: variant?.color_value ?? item }} />{item}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/50">Size</p>
          <button type="button" onClick={() => setGuideOpen(true)} className="focus-ring text-xs font-black uppercase text-blood underline underline-offset-4">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((item) => {
            const variant = variants.find((entry) => entry.color_name === color && entry.size === item);
            const disabled = !variant || variant.stock <= 0;
            return (
              <button key={item} type="button" disabled={disabled} onClick={() => setSize(item)} aria-label={disabled ? `${item} unavailable in ${color}` : `Select size ${item}`} className={`focus-ring min-h-12 min-w-12 border px-4 text-sm font-black disabled:cursor-not-allowed disabled:bg-ink/5 disabled:text-ink/25 disabled:line-through ${size === item && !disabled ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"}`}>
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Quantity value={quantity} max={selectedVariant?.stock ?? 0} onChange={setQuantity} />
        <AddButton available={available} added={added} onClick={add} />
      </div>
      <p className="text-sm font-bold text-ink/65" role="status">
        {selectedVariant ? (selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock for ${color} / ${size}` : `${color} / ${size} is sold out`) : "This size is unavailable in the selected color"}
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/15 bg-bone/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0"><p className="truncate text-xs font-bold text-ink/55">{color} / {size || "Select size"}</p><p className="font-black">{formatMoney(activePrice(product))}</p></div>
          <AddButton available={available} added={added} onClick={add} compact />
        </div>
      </div>

      {guideOpen && <SizeGuide onClose={() => setGuideOpen(false)} />}
      {image && <Image src={image} alt="" width={1} height={1} className="hidden" />}
    </div>
  );
}

function Quantity({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) {
  return <div className="flex h-14 border border-ink"><button type="button" disabled={value <= 1} className="w-12 text-xl disabled:opacity-30" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">-</button><span className="grid w-12 place-items-center border-x border-ink font-black">{value}</span><button type="button" disabled={!max || value >= max} className="w-12 text-xl disabled:opacity-30" onClick={() => onChange(value + 1)} aria-label="Increase quantity">+</button></div>;
}

function AddButton({ available, added, onClick, compact = false }: { available: boolean; added: boolean; onClick: () => void; compact?: boolean }) {
  return <button type="button" onClick={onClick} disabled={!available} className={`focus-ring inline-flex h-14 flex-1 items-center justify-center gap-2 bg-blood px-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink/30 ${compact ? "min-w-0" : ""}`}><ShoppingBag size={18} />{added ? "Added" : available ? "Add to Cart" : "Unavailable"}</button>;
}

function SizeGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end bg-ink/60 sm:place-items-center" role="dialog" aria-modal="true" aria-label="Size guide">
      <div className="w-full max-w-lg bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] sm:p-7">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-black uppercase">Size Guide</h2><button type="button" onClick={onClose} aria-label="Close size guide" className="grid h-11 w-11 place-items-center border border-ink/20"><X size={20} /></button></div>
        <p className="mt-3 text-sm leading-6 text-ink/60">Garment measurements in inches. For an easy fit, compare these with a tee you already own.</p>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[360px] border-collapse text-left text-sm"><thead><tr className="bg-ink text-white"><th className="p-3">Size</th><th className="p-3">Chest</th><th className="p-3">Length</th><th className="p-3">Shoulder</th></tr></thead><tbody>{[["S","38","27","17"],["M","40","28","18"],["L","42","29","19"],["XL","44","30","20"],["2XL","46","31","21"]].map((row) => <tr key={row[0]} className="border-b border-ink/15">{row.map((cell) => <td key={cell} className="p-3 font-bold">{cell}</td>)}</tr>)}</tbody></table></div>
      </div>
    </div>
  );
}
