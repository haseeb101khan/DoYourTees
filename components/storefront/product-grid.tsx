import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/storefront/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="border border-ink/15 bg-white p-10 text-center">
        <h2 className="text-xl font-black uppercase">No products found</h2>
        <p className="mt-2 text-sm text-ink/60">Try another category, size, color, or sorting option.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
