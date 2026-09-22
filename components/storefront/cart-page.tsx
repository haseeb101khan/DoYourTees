"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-store";
import { formatMoney } from "@/lib/utils";

export function CartPage() {
  const cart = useCart();
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  if (cart.hydrated && cart.items.length === 0) {
    return (
      <div className="container-pad py-16">
        <h1 className="text-6xl font-black uppercase tracking-tight">Cart</h1>
        <div className="mt-10 border border-ink bg-white p-10">
          <p className="text-lg font-bold">Your cart is empty.</p>
          <Link href="/shop" className="mt-6 inline-flex bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pad py-12">
      <h1 className="text-6xl font-black uppercase tracking-tight">Cart</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.variantId} className="grid grid-cols-[96px_1fr] gap-4 border border-ink/15 bg-white p-3 sm:grid-cols-[120px_1fr_auto]">
              <div className="relative aspect-square bg-ink">
                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill sizes="120px" className="object-cover" />}
              </div>
              <div>
                <Link href={`/product/${item.slug}`} className="text-lg font-black uppercase">{item.name}</Link>
                <p className="mt-1 text-sm text-ink/55">{item.color} / {item.size}</p>
                <p className="mt-2 text-sm font-black">{formatMoney(item.unitPrice)}</p>
                <div className="mt-4 inline-flex border border-ink">
                  <button className="h-10 w-10" onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)}>-</button>
                  <span className="grid h-10 w-10 place-items-center border-x border-ink font-black">{item.quantity}</span>
                  <button disabled={item.quantity >= item.maxStock} className="h-10 w-10 disabled:opacity-30" onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button
                onClick={() => cart.removeItem(item.variantId)}
                className="inline-flex h-10 w-10 items-center justify-center border border-ink/20 hover:bg-ink hover:text-white"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit border border-ink bg-white p-6">
          <h2 className="text-2xl font-black uppercase">Summary</h2>
          <div className="mt-6 flex justify-between border-b border-ink/15 pb-4 text-sm font-bold">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <p className="mt-4 text-sm text-ink/55">Shipping is calculated at checkout from store settings.</p>
          <Link href="/checkout" className="mt-6 flex h-14 items-center justify-center bg-blood text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-ink">
            Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
