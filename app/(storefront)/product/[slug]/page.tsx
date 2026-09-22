import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/storefront/add-to-cart";
import { ProductGrid } from "@/components/storefront/product-grid";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/storefront";
import { activePrice, formatMoney } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const image = product.product_images?.[0]?.url;
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [image] : []
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];

  return (
    <div className="container-pad py-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: images.map((image) => image.url),
            offers: {
              "@type": "Offer",
              priceCurrency: "PKR",
              price: activePrice(product),
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {images.length ? (
            images.map((image, index) => (
              <div key={image.id} className={index === 0 ? "relative aspect-[4/5] bg-white md:col-span-2" : "relative aspect-square bg-white"}>
                <Image src={image.url} alt={image.alt ?? product.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority={index === 0} />
              </div>
            ))
          ) : (
            <div className="grid aspect-[4/5] place-items-center bg-ink text-7xl font-black text-white md:col-span-2">DYT</div>
          )}
        </div>

        <section className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blood">{product.category?.name}</p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none tracking-tight">{product.name}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            {product.sale_price && <span className="text-lg font-bold text-ink/35 line-through">{formatMoney(product.regular_price)}</span>}
            <span className="text-2xl font-black">{formatMoney(activePrice(product))}</span>
          </div>
          <p className="mt-6 text-base leading-8 text-ink/65">{product.description}</p>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
          <div className="mt-8 grid gap-3 border-t border-ink/15 pt-6 text-sm text-ink/65">
            <p><strong className="text-ink">Shipping:</strong> Standard delivery across Pakistan. Final charge appears at checkout.</p>
            <p><strong className="text-ink">Returns:</strong> Exchange requests are accepted for unworn items with original packaging.</p>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-4xl font-black uppercase tracking-tight">Related Products</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
