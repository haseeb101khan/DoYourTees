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
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-ink text-5xl font-black text-white">DYT</div>
        )}
        <div className="absolute left-2 top-2 flex gap-1 sm:left-3 sm:top-3 sm:gap-2">
          {product.is_new_arrival && <span className="bg-white px-2 py-1 text-[10px] font-black uppercase">New</span>}
          {product.sale_price && <span className="bg-blood px-2 py-1 text-[10px] font-black uppercase text-white">Sale</span>}
        </div>
      </div>
      <div className="mt-3 sm:mt-4 sm:flex sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-xs font-black uppercase leading-4 tracking-tight sm:text-base sm:leading-normal">
            {product.name}
          </h3>
          <p className="mt-1 truncate text-[11px] text-ink/55 sm:text-sm">{product.category?.name}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 text-xs font-black sm:mt-0 sm:block sm:text-right sm:text-sm">
          {product.sale_price && (
            <div className="text-[10px] text-ink/40 line-through sm:text-xs">{formatMoney(product.regular_price)}</div>
          )}
          <div>{formatMoney(activePrice(product))}</div>
        </div>
      </div>
      {colors.length > 0 && (
        <div className="mt-2 flex gap-1.5 sm:mt-3 sm:gap-2">
          {colors.slice(0, 5).map((variant) => (
            <span
              key={variant.color_name}
              className="h-3.5 w-3.5 border border-ink/25 sm:h-4 sm:w-4"
              title={variant.color_name}
              style={{ background: variant.color_value ?? variant.color_name }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}
