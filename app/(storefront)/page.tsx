import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
      <section className="border-b border-ink">
        <div className="container-pad grid min-h-[calc(100vh-80px)] items-stretch gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center py-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blood">Do Your Tee / Pakistan</p>
            <h1 className="mt-6 max-w-4xl text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-8xl lg:text-[9rem]">
              Wear the drop before it cools down.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink/68">
              DYT turns graphic tees into everyday armor: sharp artwork, easy fits, and pieces made to move through the
              city.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="focus-ring inline-flex h-14 items-center gap-3 bg-ink px-7 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-blood"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop?category=drop-shoulders"
                className="focus-ring inline-flex h-14 items-center border border-ink px-7 text-sm font-black uppercase tracking-[0.18em] transition hover:bg-white"
              >
                Oversized Fits
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden bg-white text-white">
            <Image
              src="/catalog/drop-shoulder-5.jpeg"
              alt="Heartbreaker Drop Shoulder Tee"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-8 bottom-8 border border-white/30 bg-ink/80 p-6 backdrop-blur-sm">
              <p className="text-sm font-black uppercase tracking-[0.24em]">New drop</p>
              <p className="mt-3 text-4xl font-black uppercase leading-none">Graphic essentials</p>
            </div>
          </div>
        </div>
      </section>

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
