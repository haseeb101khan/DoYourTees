"use client";

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
        items: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        }))
      });

      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      cart.clear();
      router.push(`/order-confirmation?order=${encodeURIComponent(result.orderNumber)}`);
    });
  }

  return (
    <form action={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <Field name="fullName" label="Full Name" required />
        <Field name="phone" label="Phone Number" required />
        <Field name="email" label="Email" type="email" />
        <Field name="address" label="Address" required textarea />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="city" label="City" required />
          <Field name="postalCode" label="Postal Code" />
        </div>
        <Field name="notes" label="Order Notes" textarea />
      </div>
      <aside className="h-fit border border-ink bg-white p-6">
        <h2 className="text-2xl font-black uppercase">Your Order</h2>
        <div className="mt-5 space-y-3 border-b border-ink/15 pb-5">
          {cart.items.map((item) => (
            <div key={item.variantId} className="flex justify-between gap-4 text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-bold">{formatMoney(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatMoney(shipping)}</span></div>
          <div className="flex justify-between border-t border-ink pt-4 text-lg font-black"><span>Total</span><span>{formatMoney(total)}</span></div>
        </div>
        <div className="mt-6 space-y-3">
          <PaymentOption label="Cash on Delivery" value="cod" selected={paymentMethod} setSelected={setPaymentMethod} />
          <PaymentOption label="Bank Transfer" value="bank_transfer" selected={paymentMethod} setSelected={setPaymentMethod} />
        </div>
        {paymentMethod === "bank_transfer" && (
          <div className="mt-5 border border-ink/15 bg-bone p-4 text-sm leading-6">
            <p className="font-black uppercase">Bank Details</p>
            <p>Bank: {settings.bank_name ?? "Configure in Admin"}</p>
            <p>Title: {settings.bank_account_title ?? "Configure in Admin"}</p>
            <p>Account: {settings.bank_account_number ?? "Configure in Admin"}</p>
            <p>IBAN: {settings.bank_iban ?? "Configure in Admin"}</p>
          </div>
        )}
        {message && <p className="mt-4 bg-blood/10 p-3 text-sm font-bold text-blood">{message}</p>}
        <button
          disabled={isPending || cart.items.length === 0}
          className="mt-6 h-14 w-full bg-blood text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-ink disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          {isPending ? "Placing Order" : "Place Order"}
        </button>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className = "mt-2 w-full border border-ink/20 bg-white px-4 py-3 outline-none focus:border-blood";
  return (
    <label className="block text-sm font-black uppercase tracking-[0.14em]">
      {label}
      {textarea ? (
        <textarea name={name} required={required} rows={4} className={className} />
      ) : (
        <input name={name} type={type} required={required} className={className} />
      )}
    </label>
  );
}

function PaymentOption({
  label,
  value,
  selected,
  setSelected
}: {
  label: string;
  value: "cod" | "bank_transfer";
  selected: "cod" | "bank_transfer";
  setSelected: (value: "cod" | "bank_transfer") => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setSelected(value)}
      className={`w-full border px-4 py-3 text-left text-sm font-black uppercase ${
        selected === value ? "border-ink bg-ink text-white" : "border-ink/20"
      }`}
    >
      {label}
    </button>
  );
}
