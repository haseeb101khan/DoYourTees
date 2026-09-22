import { CampaignBanner } from "@/components/storefront/campaign-banner";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ShopFilters } from "@/components/storefront/shop-filters";
import { getCategories, getProducts } from "@/lib/data/storefront";

export const metadata = {
  title: "Shop",
  description: "Shop DYT graphic tees, oversized shirts, sleeveless cuts, and streetwear drops."
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; color?: string; size?: string; sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(params), getCategories()]);

  return (
    <>
      <CampaignBanner
        desktop="/banners/catalogue-desktop.png"
        mobile="/banners/catalogue-mobile.png"
        alt="DYT catalogue featuring T-shirts, oversized fits, sleeveless tees, and long sleeves"
        priority
      />

      <div className="container-pad py-8 sm:py-12">
        <h1 className="sr-only">Shop all DYT streetwear</h1>
        <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
          <ShopFilters categories={categories} params={params} count={products.length} />
          <section aria-label="Products">
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-sm font-bold text-ink/60">Showing {products.length} product{products.length === 1 ? "" : "s"}</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/45">DYT Catalogue</p>
            </div>
            <ProductGrid products={products} />
          </section>
        </div>
      </div>
    </>
  );
}
