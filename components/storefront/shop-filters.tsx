"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/types";

type Params = { category?: string; color?: string; size?: string; sort?: string; q?: string };

const sizes = ["S", "M", "L", "XL", "2XL"];
const colors = ["Black", "White", "Olive", "Red", "Black / White"];
const sorts = [
  ["newest", "Newest"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"]
] as const;

function hrefFor(params: Params, changes: Partial<Record<keyof Params, string | undefined>>) {
  const next = new URLSearchParams();
  Object.entries({ ...params, ...changes }).forEach(([key, value]) => {
    if (value) next.set(key, value);
  });
  const query = next.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function ShopFilters({ categories, params, count }: { categories: Category[]; params: Params; count: number }) {
  const [open, setOpen] = useState(false);
  const active = [
    params.q ? { key: "q" as const, label: `"${params.q}"` } : null,
    params.category ? { key: "category" as const, label: categories.find((item) => item.slug === params.category)?.name ?? params.category } : null,
    params.size ? { key: "size" as const, label: `Size ${params.size}` } : null,
    params.color ? { key: "color" as const, label: params.color } : null,
    params.sort ? { key: "sort" as const, label: sorts.find(([value]) => value === params.sort)?.[1] ?? params.sort } : null
  ].filter(Boolean) as { key: keyof Params; label: string }[];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const filters = (closeOnSelect = false) => (
    <div className="space-y-7">
      <FilterGroup title="Category">
        <Choice href={hrefFor(params, { category: undefined })} active={!params.category} onClick={closeOnSelect ? () => setOpen(false) : undefined}>All Products</Choice>
        {categories.map((category) => (
          <Choice key={category.id} href={hrefFor(params, { category: category.slug })} active={params.category === category.slug} onClick={closeOnSelect ? () => setOpen(false) : undefined}>{category.name}</Choice>
        ))}
      </FilterGroup>
      <FilterGroup title="Size">
        {sizes.map((size) => <Choice key={size} href={hrefFor(params, { size })} active={params.size === size} onClick={closeOnSelect ? () => setOpen(false) : undefined}>{size}</Choice>)}
      </FilterGroup>
      <FilterGroup title="Color">
        {colors.map((color) => <Choice key={color} href={hrefFor(params, { color })} active={params.color === color} onClick={closeOnSelect ? () => setOpen(false) : undefined}>{color}</Choice>)}
      </FilterGroup>
      <FilterGroup title="Sort">
        {sorts.map(([value, label]) => <Choice key={value} href={hrefFor(params, { sort: value })} active={params.sort === value} onClick={closeOnSelect ? () => setOpen(false) : undefined}>{label}</Choice>)}
      </FilterGroup>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <SearchForm params={params} />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-ink/60">{count} product{count === 1 ? "" : "s"}</p>
          <button type="button" onClick={() => setOpen(true)} className="focus-ring flex min-h-11 items-center gap-2 border border-ink bg-white px-4 text-sm font-black uppercase tracking-[0.12em]">
            <SlidersHorizontal size={17} aria-hidden="true" /> Filter & Sort{active.length ? ` (${active.length})` : ""}
          </button>
        </div>
        <ActiveChips active={active} params={params} />
      </div>

      <aside className="hidden space-y-7 lg:block">
        <SearchForm params={params} />
        <ActiveChips active={active} params={params} />
        {filters()}
      </aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter and sort products">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto bg-bone px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5 shadow-2xl">
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between border-b border-ink/15 bg-bone pb-4">
              <div><h2 className="text-xl font-black uppercase">Filter & Sort</h2><p className="mt-1 text-sm text-ink/55">{count} products match</p></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="focus-ring grid h-11 w-11 place-items-center border border-ink/20 bg-white"><X size={22} /></button>
            </div>
            {filters(true)}
            <div className="sticky bottom-0 mt-8 grid grid-cols-2 gap-3 bg-bone pt-4">
              <Link href="/shop" onClick={() => setOpen(false)} className="grid min-h-12 place-items-center border border-ink text-sm font-black uppercase tracking-[0.12em]">Clear All</Link>
              <button type="button" onClick={() => setOpen(false)} className="min-h-12 bg-ink text-sm font-black uppercase tracking-[0.12em] text-white">View {count}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchForm({ params }: { params: Params }) {
  return (
    <form action="/shop" className="relative">
      {Object.entries(params).filter(([key, value]) => key !== "q" && value).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
      <label className="sr-only" htmlFor="shop-search">Search products</label>
      <input id="shop-search" name="q" type="search" defaultValue={params.q} placeholder="Search DYT products" className="h-12 w-full border border-ink/20 bg-white pl-4 pr-12 text-base outline-none focus:border-ink" />
      <button type="submit" aria-label="Search" className="focus-ring absolute right-0 top-0 grid h-12 w-12 place-items-center"><Search size={20} /></button>
    </form>
  );
}

function ActiveChips({ active, params }: { active: { key: keyof Params; label: string }[]; params: Params }) {
  if (!active.length) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {active.map((item) => <Link key={item.key} href={hrefFor(params, { [item.key]: undefined })} className="focus-ring flex min-h-9 items-center gap-2 border border-ink/20 bg-white px-3 text-xs font-bold">{item.label}<X size={13} aria-hidden="true" /></Link>)}
      <Link href="/shop" className="px-2 py-2 text-xs font-black uppercase text-blood underline underline-offset-4">Clear All</Link>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h2 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-ink/45">{title}</h2><div className="flex flex-wrap gap-2">{children}</div></div>;
}

function Choice({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick?: () => void }) {
  return <Link href={href} onClick={onClick} className={`focus-ring grid min-h-11 place-items-center border px-4 text-sm font-bold transition ${active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink"}`}>{children}</Link>;
}
