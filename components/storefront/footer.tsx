import Link from "next/link";
import type { Category, StoreSettings } from "@/lib/types";

export function Footer({ categories, settings }: { categories: Category[]; settings: StoreSettings }) {
  return (
    <footer className="border-t border-ink bg-ink text-white">
      <div className="container-pad grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-5xl font-black tracking-tight">DYT</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            Pakistani streetwear for graphic tee people. Bold prints, hard silhouettes, and everyday wear with a point
            of view.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Shop</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/shop">All Products</Link>
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Contact</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            {settings.phone && <span>{settings.phone}</span>}
            {settings.email && <span>{settings.email}</span>}
            {settings.instagram && <span>{settings.instagram}</span>}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white/45">Newsletter</h3>
          <form className="mt-4 flex border border-white/25">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/35"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-white px-4 text-xs font-black uppercase tracking-[0.16em] text-ink">Join</button>
          </form>
        </div>
      </div>
      <div className="container-pad border-t border-white/15 py-5 text-xs uppercase tracking-[0.18em] text-white/45">
        © {new Date().getFullYear()} DYT. All rights reserved.
      </div>
    </footer>
  );
}
