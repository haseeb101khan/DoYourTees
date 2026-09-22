import Link from "next/link";

export const metadata = {
  title: "Order Confirmation"
};

export default async function OrderConfirmationPage({
  searchParams
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="container-pad py-20">
      <div className="max-w-2xl border border-ink bg-white p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blood">Order received</p>
        <h1 className="mt-3 text-5xl font-black uppercase tracking-tight">Thank you</h1>
        <p className="mt-5 text-lg leading-8 text-ink/65">
          Your order {order ? <strong className="text-ink">{order}</strong> : null} has been placed. DYT will contact
          you to confirm fulfillment and payment details.
        </p>
        <Link href="/shop" className="mt-8 inline-flex bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
