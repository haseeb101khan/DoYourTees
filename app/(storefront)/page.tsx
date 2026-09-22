import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative isolate aspect-[4/5] overflow-hidden border border-ink bg-ink text-white"
            >
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={`${category.name} collection`}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-20 object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="absolute inset-0 -z-20 bg-ink" />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-10 min-w-10 place-items-center bg-blood px-2 font-mono text-sm font-bold text-white">
                    0{index + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center border border-white/60 bg-black/55 transition-colors group-hover:border-blood group-hover:bg-blood">
                    <ArrowUpRight size={19} aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/65">Explore Collection</p>
                  <h3 className="text-3xl font-black uppercase leading-none sm:text-4xl xl:text-3xl">{category.name}</h3>
                  <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-white/80">{category.description}</p>
                  <span className="mt-5 block h-1 w-12 bg-blood transition-[width] duration-300 group-hover:w-24" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
