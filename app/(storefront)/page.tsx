import Link from "next/link";
import { CampaignBanner } from "@/components/storefront/campaign-banner";
import { ProductGrid } from "@/components/storefront/product-grid";
import { getCategories, getProducts } from "@/lib/data/storefront";

export default async function HomePage() {
  const [featured, newest, categories] = await Promise.all([
    getProducts({ featured: true, limit: 4 }),
    getProducts({ newest: true, limit: 4 }),
    getCategories()
  ]);

  return (
    <>
      <h1 className="sr-only">DYT - Do Your Tee Pakistani Streetwear</h1>
      <CampaignBanner
        desktop="/banners/homepage-desktop.png"
        mobile="/banners/homepage-mobile.png"
        alt="DYT Wear What You're Into streetwear campaign"
        href="/shop?sort=newest"
        priority
      />

      <section className="container-pad py-16">
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blood">Featured</p>
            <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">Our Picks</h2>
          </div>
          <Link href="/shop" className="hidden text-sm font-black uppercase tracking-[0.18em] underline sm:block">
            View all
          </Link>
        </div>
        <ProductGrid products={featured.length ? featured : newest} />
      </section>

      <section className="border-y border-ink bg-ink py-14 text-white">
        <div className="container-pad grid gap-7 md:grid-cols-[1fr_1.2fr] md:items-end">
          <p className="text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">
            Graphic tees. Harder attitude.
          </p>
          <p className="max-w-xl text-lg leading-8 text-white/70">
            DYT is built for first drops, late nights, basement shows, chai runs, and anywhere a plain tee feels too
            quiet.
          </p>
        </div>
      </section>

      <section className="container-pad py-16">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blood">Browse</p>
          <h2 className="mt-2 text-4xl font-black uppercase tracking-tight">Shop by Category</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group min-h-56 border border-ink bg-white p-6 transition hover:bg-ink hover:text-white"
            >
              <span className="font-mono text-sm text-blood">0{index + 1}</span>
              <h3 className="mt-14 text-3xl font-black uppercase">{category.name}</h3>
              <p className="mt-3 text-sm leading-6 opacity-65">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
