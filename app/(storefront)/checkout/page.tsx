import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getStoreSettings } from "@/lib/data/storefront";

export const metadata = {
  title: "Checkout"
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <div className="container-pad py-12">
      <div className="mb-10 border-b border-ink pb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blood">Secure order</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight sm:text-6xl">Checkout</h1>
      </div>
      <CheckoutForm settings={settings} />
    </div>
  );
}
