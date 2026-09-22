"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-store";
import type { StoreSettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export function CartDrawer({ open, onClose, settings }: { open: boolean; onClose: () => void; settings: StoreSettings }) {
  const cart = useCart();
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const remaining = Math.max(0, (settings.free_shipping_threshold ?? 0) - subtotal);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" className="absolute inset-0 bg-ink/60" aria-label="Close cart" onClick={onClose} />
      <section className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col bg-bone shadow-2xl sm:inset-y-0 sm:left-auto sm:h-full sm:max-h-none sm:w-[440px]">
        <header className="flex items-center justify-between border-b border-ink/15 px-5 py-4">
          <div className="flex items-center gap-3"><ShoppingBag size={20} /><h2 className="text-xl font-black uppercase">Your Cart</h2><span className="text-sm font-bold text-ink/45">({cart.items.length})</span></div>
          <button type="button" onClick={onClose} aria-label="Close cart" className="focus-ring grid h-11 w-11 place-items-center border border-ink/20 bg-white"><X size={21} /></button>
        </header>

        {cart.items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 py-14 text-center">
            <div><ShoppingBag size={36} className="mx-auto text-ink/25" /><h3 className="mt-5 text-2xl font-black uppercase">Your cart is empty</h3><p className="mt-2 text-sm text-ink/55">Pick a tee and make it yours.</p><Link href="/shop" onClick={onClose} className="mt-6 inline-grid min-h-12 place-items-center bg-ink px-6 text-sm font-black uppercase tracking-[0.14em] text-white">Continue Shopping</Link></div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
              {cart.items.map((item) => (
                <article key={item.variantId} className="grid grid-cols-[84px_1fr] gap-3 border border-ink/15 bg-white p-3">
                  <Link href={`/product/${item.slug}`} onClick={onClose} className="relative aspect-[4/5] overflow-hidden bg-ink">{item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill sizes="84px" className="object-cover" />}</Link>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-2"><Link href={`/product/${item.slug}`} onClick={onClose} className="line-clamp-2 text-sm font-black uppercase leading-5">{item.name}</Link><button type="button" onClick={() => cart.removeItem(item.variantId)} aria-label={`Remove ${item.name}`} className="focus-ring grid h-9 w-9 shrink-0 place-items-center text-ink/45 hover:text-blood"><Trash2 size={17} /></button></div>
                    <p className="mt-1 text-xs font-bold text-ink/50">{item.color} / {item.size}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex h-10 border border-ink/20"><button type="button" disabled={item.quantity <= 1} onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)} className="grid w-10 place-items-center disabled:opacity-25" aria-label="Decrease quantity"><Minus size={15} /></button><span className="grid w-9 place-items-center border-x border-ink/15 text-sm font-black">{item.quantity}</span><button type="button" disabled={item.quantity >= item.maxStock} onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)} className="grid w-10 place-items-center disabled:opacity-25" aria-label="Increase quantity"><Plus size={15} /></button></div>
                      <p className="text-sm font-black">{formatMoney(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="border-t border-ink/15 bg-white px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-center justify-between text-lg font-black"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
              <p className="mt-2 text-xs leading-5 text-ink/55">{settings.free_shipping_threshold && remaining > 0 ? `Add ${formatMoney(remaining)} more for free shipping.` : settings.free_shipping_threshold ? "You qualify for free shipping." : "Shipping is calculated at checkout."}</p>
              <Link href="/checkout" onClick={onClose} className="mt-4 grid min-h-14 place-items-center bg-blood text-sm font-black uppercase tracking-[0.16em] text-white">Checkout</Link>
              <button type="button" onClick={onClose} className="mt-2 min-h-12 w-full text-sm font-black uppercase tracking-[0.12em] underline underline-offset-4">Continue Shopping</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
