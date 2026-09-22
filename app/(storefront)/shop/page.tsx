import Link from "next/link";
import { CampaignBanner } from "@/components/storefront/campaign-banner";
import { ProductGrid } from "@/components/storefront/product-grid";
import { getCategories, getProducts } from "@/lib/data/storefront";

export const metadata = {
  title: "Shop",
  description: "Shop DYT graphic tees, oversized shirts, sleeveless cuts, and streetwear drops."
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; color?: string; size?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(params), getCategories()]);
  const sizes = ["S", "M", "L", "XL", "2XL"];
  const colors = ["Black", "White", "Red"];

  return (
    <>
      <CampaignBanner
        desktop="/banners/catalogue-desktop.png"
        mobile="/banners/catalogue-mobile.png"
        alt="DYT catalogue featuring T-shirts, oversized fits, sleeveless tees, and long sleeves"
        priority
      />

      <div className="container-pad py-12">
        <h1 className="sr-only">Shop all DYT streetwear</h1>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-8">
            <FilterBlock title="Categories">
              <FilterLink href="/shop" active={!params.category}>
                All Products
              </FilterLink>
              {categories.map((category) => (
                <FilterLink key={category.id} href={`/shop?category=${category.slug}`} active={params.category === category.slug}>
                  {category.name}
                </FilterLink>
              ))}
            </FilterBlock>
            <FilterBlock title="Size">
              {sizes.map((size) => (
                <FilterLink key={size} href={`/shop?${new URLSearchParams({ ...params, size }).toString()}`} active={params.size === size}>
                  {size}
                </FilterLink>
              ))}
            </FilterBlock>
            <FilterBlock title="Color">
              {colors.map((color) => (
                <FilterLink
                  key={color}
                  href={`/shop?${new URLSearchParams({ ...params, color }).toString()}`}
                  active={params.color === color}
                >
                  {color}
                </FilterLink>
              ))}
            </FilterBlock>
          </aside>

          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-bold text-ink/60">Showing {products.length} product{products.length === 1 ? "" : "s"}</p>
              <div className="flex flex-wrap gap-2">
                <FilterLink href={`/shop?${new URLSearchParams({ ...params, sort: "newest" }).toString()}`} active={params.sort === "newest"}>
                  Newest
                </FilterLink>
                <FilterLink href={`/shop?${new URLSearchParams({ ...params, sort: "price-asc" }).toString()}`} active={params.sort === "price-asc"}>
                  Price Low
                </FilterLink>
                <FilterLink href={`/shop?${new URLSearchParams({ ...params, sort: "price-desc" }).toString()}`} active={params.sort === "price-desc"}>
                  Price High
                </FilterLink>
              </div>
            </div>
            <ProductGrid products={products} />
          </section>
        </div>
      </div>
    </>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-ink/45">{title}</h2>
      <div className="flex flex-wrap gap-2 lg:flex-col">{children}</div>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`border px-3 py-2 text-sm font-bold transition ${
        active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink"
      }`}
    >
      {children}
    </Link>
  );
}
