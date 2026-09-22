import { Footer } from "@/components/storefront/footer";
import { Header } from "@/components/storefront/header";
import { getCategories, getStoreSettings } from "@/lib/data/storefront";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getCategories(), getStoreSettings()]);

  return (
    <div className="min-h-screen bg-bone text-ink">
      <Header categories={categories} settings={settings} />
      <main>{children}</main>
      <Footer categories={categories} settings={settings} />
    </div>
  );
}
