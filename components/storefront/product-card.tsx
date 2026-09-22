import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { activePrice, formatMoney } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0];
  const colors = [...new Map(product.product_variants?.map((variant) => [variant.color_name, variant]) ?? []).values()];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-ink text-5xl font-black text-white">DYT</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.is_new_arrival && <span className="bg-white px-2 py-1 text-[10px] font-black uppercase">New</span>}
          {product.sale_price && <span className="bg-blood px-2 py-1 text-[10px] font-black uppercase text-white">Sale</span>}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black uppercase tracking-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-ink/55">{product.category?.name}</p>
        </div>
        <div className="text-right text-sm font-black">
          {product.sale_price && <div className="text-xs text-ink/40 line-through">{formatMoney(product.regular_price)}</div>}
          <div>{formatMoney(activePrice(product))}</div>
        </div>
      </div>
      {colors.length > 0 && (
        <div className="mt-3 flex gap-2">
          {colors.slice(0, 5).map((variant) => (
            <span
              key={variant.color_name}
              className="h-4 w-4 border border-ink/25"
              title={variant.color_name}
              style={{ background: variant.color_value ?? variant.color_name }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
