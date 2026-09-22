"use client";

import { Check, Copy, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createOrder } from "@/app/actions/checkout";
import { useCart } from "@/lib/cart/cart-store";
import type { StoreSettings } from "@/lib/types";
import { formatMoney } from "@/lib/utils";

export function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const cart = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = settings.free_shipping_threshold && subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_charge;
  const total = subtotal + shipping;

  function submit(formData: FormData) {
    setMessage("");
    startTransition(async () => {
      const result = await createOrder({
        fullName: String(formData.get("fullName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        notes: String(formData.get("notes") ?? ""),
        paymentMethod,
        items: cart.items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }))
      });

      if (!result.ok) {
        setMessage(result.error);
        document.getElementById("checkout-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      cart.clear();
      router.push(`/order-confirmation?token=${encodeURIComponent(result.confirmationToken)}`);
    });
  }

  async function copyBankDetails() {
    const details = [settings.bank_name, settings.bank_account_title, settings.bank_account_number, settings.bank_iban].filter(Boolean).join("\n");
    await navigator.clipboard.writeText(details);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (!cart.hydrated) return <div className="h-96 animate-pulse border border-ink/10 bg-white" aria-label="Loading checkout" />;

  if (!cart.items.length) {
    return <div className="border border-ink bg-white px-5 py-12 text-center"><ShoppingBag className="mx-auto text-ink/25" size={38} /><h2 className="mt-5 text-2xl font-black uppercase">Your cart is empty</h2><p className="mt-2 text-sm text-ink/55">Add a product before starting checkout.</p><Link href="/shop" className="mt-6 inline-grid min-h-12 place-items-center bg-ink px-7 text-sm font-black uppercase tracking-[0.14em] text-white">Shop Products</Link></div>;
  }

  const summary = <OrderSummary cart={cart} subtotal={subtotal} shipping={shipping} total={total} />;

  return (
    <form action={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">
      <div className="order-2 space-y-5 lg:order-1">
        <CheckoutSection number="1" title="Contact">
          <div className="grid gap-4 sm:grid-cols-2"><Field name="fullName" label="Full Name" required autoComplete="name" /><Field name="phone" label="Phone" required type="tel" inputMode="tel" autoComplete="tel" /></div>
          <Field name="email" label="Email (optional)" type="email" inputMode="email" autoComplete="email" />
        </CheckoutSection>

        <CheckoutSection number="2" title="Delivery Address">
          <Field name="address" label="Full Address" required textarea autoComplete="street-address" />
          <div className="grid gap-4 sm:grid-cols-2"><Field name="city" label="City" required autoComplete="address-level2" /><Field name="postalCode" label="Postal Code (optional)" inputMode="numeric" autoComplete="postal-code" /></div>
          <Field name="notes" label="Order Notes (optional)" textarea />
        </CheckoutSection>

        <CheckoutSection number="3" title="Payment">
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentOption label="Cash on Delivery" detail="Pay when your order arrives" value="cod" selected={paymentMethod} setSelected={setPaymentMethod} />
            <PaymentOption label="Bank Transfer" detail="Verification required" value="bank_transfer" selected={paymentMethod} setSelected={setPaymentMethod} />
          </div>
          {paymentMethod === "bank_transfer" && (
            <div className="mt-4 border border-ink/15 bg-bone p-4 text-sm">
              <div className="flex items-center justify-between gap-3"><p className="font-black uppercase tracking-[0.1em]">Bank Details</p><button type="button" onClick={copyBankDetails} className="focus-ring flex min-h-10 items-center gap-2 border border-ink bg-white px-3 text-xs font-black uppercase"><Copy size={15} />{copied ? "Copied" : "Copy"}</button></div>
              <dl className="mt-4 grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 leading-6"><dt className="text-ink/50">Bank</dt><dd className="font-bold break-words">{settings.bank_name ?? "Contact DYT"}</dd><dt className="text-ink/50">Title</dt><dd className="font-bold break-words">{settings.bank_account_title ?? "Contact DYT"}</dd><dt className="text-ink/50">Account</dt><dd className="font-bold break-all">{settings.bank_account_number ?? "Contact DYT"}</dd><dt className="text-ink/50">IBAN</dt><dd className="font-bold break-all">{settings.bank_iban ?? "Contact DYT"}</dd></dl>
              <p className="mt-4 border-t border-ink/10 pt-3 text-xs leading-5 text-ink/55">Your order will be held with payment status Pending Verification. DYT will contact you for transfer proof if needed.</p>
            </div>
          )}
        </CheckoutSection>

        {message && <p id="checkout-error" role="alert" className="border border-blood/30 bg-blood/10 p-4 text-sm font-bold text-blood">{message}</p>}
        <button disabled={isPending} className="focus-ring min-h-14 w-full bg-blood px-4 text-sm font-black uppercase tracking-[0.13em] text-white hover:bg-ink disabled:cursor-wait disabled:bg-ink/40 lg:hidden">{isPending ? <span className="inline-flex items-center gap-2"><Loader2 size={17} className="animate-spin" /> Placing Order</span> : `Place Order — ${formatMoney(total)}`}</button>
        <p className="text-center text-xs leading-5 text-ink/45 lg:hidden">Final price and stock are verified securely when you place the order.</p>
      </div>

      <aside className="order-1 lg:order-2 lg:sticky lg:top-28">
        <details className="border border-ink bg-white lg:hidden" open><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 font-black uppercase"><span>4. Order Summary</span><span>{formatMoney(total)}</span></summary><div className="border-t border-ink/15 p-4">{summary}</div></details>
        <div className="hidden border border-ink bg-white p-6 lg:block"><h2 className="text-2xl font-black uppercase">4. Order Summary</h2><div className="mt-5">{summary}</div><button disabled={isPending} className="focus-ring mt-6 min-h-14 w-full bg-blood px-3 text-sm font-black uppercase tracking-[0.11em] text-white hover:bg-ink disabled:cursor-wait disabled:bg-ink/40">{isPending ? <span className="inline-flex items-center gap-2"><Loader2 size={17} className="animate-spin" /> Placing Order</span> : `Place Order — ${formatMoney(total)}`}</button><p className="mt-3 text-center text-xs leading-5 text-ink/45">Final price and stock are verified securely.</p></div>
      </aside>
    </form>
  );
}

function CheckoutSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <section className="border border-ink/15 bg-white p-4 sm:p-6"><h2 className="mb-5 text-xl font-black uppercase"><span className="mr-2 text-blood">{number}.</span>{title}</h2><div className="space-y-4">{children}</div></section>;
}

function Field({ name, label, type = "text", required, textarea, inputMode, autoComplete }: { name: string; label: string; type?: string; required?: boolean; textarea?: boolean; inputMode?: "text" | "tel" | "email" | "numeric"; autoComplete?: string }) {
  const className = "mt-2 min-h-12 w-full border border-ink/20 bg-white px-4 py-3 text-base outline-none focus:border-blood";
  return <label className="block text-xs font-black uppercase tracking-[0.12em]">{label}{textarea ? <textarea name={name} required={required} rows={3} autoComplete={autoComplete} className={className} /> : <input name={name} type={type} required={required} inputMode={inputMode} autoComplete={autoComplete} className={className} />}</label>;
}

function PaymentOption({ label, detail, value, selected, setSelected }: { label: string; detail: string; value: "cod" | "bank_transfer"; selected: "cod" | "bank_transfer"; setSelected: (value: "cod" | "bank_transfer") => void }) {
  const active = selected === value;
  return <button type="button" onClick={() => setSelected(value)} className={`focus-ring flex min-h-20 items-center gap-3 border px-4 text-left ${active ? "border-ink bg-ink text-white" : "border-ink/20"}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? "border-white bg-blood" : "border-ink/30"}`}>{active && <Check size={13} />}</span><span><span className="block text-sm font-black uppercase">{label}</span><span className={`mt-1 block text-xs ${active ? "text-white/65" : "text-ink/50"}`}>{detail}</span></span></button>;
}

function OrderSummary({ cart, subtotal, shipping, total }: { cart: ReturnType<typeof useCart>; subtotal: number; shipping: number; total: number }) {
  return <><div className="space-y-4">{cart.items.map((item) => <div key={item.variantId} className="grid grid-cols-[58px_1fr_auto] gap-3 text-sm"><div className="relative aspect-[4/5] overflow-hidden bg-ink">{item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="58px" className="object-cover" />}</div><div className="min-w-0"><p className="line-clamp-2 font-black uppercase leading-5">{item.name}</p><p className="mt-1 text-xs text-ink/50">{item.color} / {item.size}</p><div className="mt-2 flex h-8 w-fit border border-ink/15"><button type="button" disabled={item.quantity <= 1} onClick={() => cart.setQuantity(item.variantId, item.quantity - 1)} className="grid w-8 place-items-center disabled:opacity-25" aria-label="Decrease quantity"><Minus size={13} /></button><span className="grid w-7 place-items-center border-x border-ink/10 text-xs font-black">{item.quantity}</span><button type="button" disabled={item.quantity >= item.maxStock} onClick={() => cart.setQuantity(item.variantId, item.quantity + 1)} className="grid w-8 place-items-center disabled:opacity-25" aria-label="Increase quantity"><Plus size={13} /></button></div></div><span className="font-black">{formatMoney(item.unitPrice * item.quantity)}</span></div>)}</div><div className="mt-5 space-y-3 border-t border-ink/15 pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{formatMoney(subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span className="font-bold">{shipping ? formatMoney(shipping) : "Free"}</span></div><div className="flex justify-between border-t border-ink pt-4 text-lg font-black"><span>Total</span><span>{formatMoney(total)}</span></div></div></>;
}
