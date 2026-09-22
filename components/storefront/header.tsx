"use client";

import Link from "next/link";
import { ChevronRight, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category, StoreSettings } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-store";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export function Header({ categories, settings }: { categories: Category[]; settings: StoreSettings }) {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = open || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, cartOpen]);

  useEffect(() => {
    const showCart = () => setCartOpen(true);
    window.addEventListener("dyt-cart-open", showCart);
    return () => window.removeEventListener("dyt-cart-open", showCart);
  }, []);

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
    <>
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
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="focus-ring relative inline-flex h-11 w-11 items-center justify-center border border-ink bg-ink text-white transition hover:bg-blood"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center bg-blood px-1 text-xs font-black text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-ink lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] min-h-[100dvh] overflow-y-auto bg-[#080808] text-white lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
          <div className="flex min-h-[100dvh] flex-col">
            <div className="container-pad flex h-20 shrink-0 items-center justify-between border-b border-white/15">
              <Link href="/" onClick={() => setOpen(false)} className="text-4xl font-black leading-none" aria-label="DYT home">DYT</Link>
              <button
                className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-white/70 bg-white/5"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={23} />
              </button>
            </div>

            <nav className="container-pad flex-1 py-7" onClick={() => setOpen(false)} aria-label="Mobile navigation">
              <MobileNavLink href="/shop" label="Shop All" index="01" />
              {categories.slice(0, 4).map((category, index) => (
                <MobileNavLink key={category.id} href={`/shop?category=${category.slug}`} label={category.name} index={`0${index + 2}`} />
              ))}
            </nav>

            <div className="container-pad shrink-0 pb-[calc(24px+env(safe-area-inset-bottom))]">
              <Link href="/checkout" onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between bg-blood px-5 text-sm font-black uppercase tracking-[0.2em]">
                Checkout <ChevronRight size={20} aria-hidden="true" />
              </Link>
              <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Do Your Tee</p>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} settings={settings} />
    </>
  );
}

function MobileNavLink({ href, label, index }: { href: string; label: string; index: string }) {
  return (
    <Link href={href} className="group flex min-h-16 items-center gap-4 border-b border-white/15 py-4">
      <span className="w-7 font-mono text-xs font-bold text-blood">{index}</span>
      <span className="flex-1 text-xl font-black uppercase tracking-[0.06em]">{label}</span>
      <ChevronRight size={20} className="text-white/45 transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden="true" />
    </Link>
  );
}
