import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderConfirmation } from "@/lib/data/storefront";
import { formatMoney } from "@/lib/utils";

export const metadata = { title: "Order Confirmation" };

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const order = token ? await getOrderConfirmation(token) : null;

  if (!order) {
    return <div className="container-pad py-16 sm:py-20"><div className="mx-auto max-w-xl border border-ink bg-white p-6 text-center sm:p-10"><h1 className="text-3xl font-black uppercase">Confirmation unavailable</h1><p className="mt-4 leading-7 text-ink/60">This confirmation link is incomplete or no longer available. Contact DYT if you need help with an order.</p><Link href="/shop" className="mt-7 inline-grid min-h-12 place-items-center bg-ink px-6 text-sm font-black uppercase tracking-[0.14em] text-white">Return to Shop</Link></div></div>;
  }

  const bankTransfer = order.payment_method === "bank_transfer";
  return (
    <div className="container-pad py-10 sm:py-16">
      <div className="mx-auto max-w-3xl overflow-hidden border border-ink bg-white">
        <div className="bg-ink px-5 py-8 text-white sm:px-10 sm:py-10"><CheckCircle2 size={38} className="text-blood" /><p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-white/55">Order received</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-5xl">Thank you</h1><p className="mt-4 max-w-xl leading-7 text-white/70">Your order has been placed successfully. {bankTransfer ? "Payment will be verified before fulfillment." : "DYT will contact you to confirm delivery."}</p></div>
        <div className="p-5 sm:p-10">
          <div className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
            <Detail label="Order Number" value={order.order_number} />
            <Detail label="Total" value={formatMoney(order.total)} />
            <Detail label="Payment Method" value={bankTransfer ? "Bank Transfer" : "Cash on Delivery"} />
            <Detail label="Customer Phone" value={order.customer_phone} />
            <Detail label="Order Status" value={humanize(order.order_status)} />
            <Detail label="Payment Status" value={humanize(order.payment_status)} accent={order.payment_status === "pending_verification"} />
          </div>
          <div className="mt-7 border-l-4 border-blood bg-bone p-5"><h2 className="font-black uppercase">What happens next</h2><p className="mt-2 text-sm leading-6 text-ink/60">{bankTransfer ? "Keep your transfer receipt ready. DYT will verify the payment and contact you on the phone number above before dispatch." : "DYT will confirm the order using the phone number above, then prepare it for delivery. Payment remains pending until delivery."}</p></div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/shop" className="grid min-h-12 flex-1 place-items-center bg-ink px-6 text-sm font-black uppercase tracking-[0.14em] text-white">Continue Shopping</Link><Link href="/" className="grid min-h-12 flex-1 place-items-center border border-ink px-6 text-sm font-black uppercase tracking-[0.14em]">Back to Home</Link></div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="bg-white p-4 sm:p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-ink/45">{label}</p><p className={`mt-2 break-words font-black ${accent ? "text-blood" : ""}`}>{value}</p></div>;
}

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
