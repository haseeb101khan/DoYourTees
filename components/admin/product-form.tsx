import { saveProduct } from "@/app/actions/admin";
import type { Category, Product } from "@/lib/types";

export function ProductForm({ product, categories }: { product?: Product | null; categories: Category[] }) {
  const images = product?.product_images?.sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url).join("\n") ?? "";
  const variants =
    product?.product_variants
      ?.map((variant) => [variant.color_name, variant.color_value ?? "", variant.size, variant.stock, variant.sku ?? ""].join(", "))
      .join("\n") ?? "Black, #080808, M, 5, DYT-SKU-M";

  return (
    <form action={saveProduct} className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="space-y-4">
        <Field name="name" label="Product Name" defaultValue={product?.name} required />
        <Field name="slug" label="Slug" defaultValue={product?.slug} />
        <Field name="description" label="Description" defaultValue={product?.description} textarea required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="material" label="Fabric / Material" defaultValue={product?.material} />
          <Field name="fit" label="Fit" defaultValue={product?.fit} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="regular_price" label="Regular Price" type="number" defaultValue={product?.regular_price} required />
          <Field name="sale_price" label="Sale Price" type="number" defaultValue={product?.sale_price ?? ""} />
        </div>
        <label className="block text-sm font-black uppercase tracking-[0.14em]">
          Upload Images
          <input
            name="image_files"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 outline-none focus:border-blood"
          />
          <span className="mt-2 block text-xs normal-case tracking-normal text-ink/50">
            Files upload to the Supabase `product-images` bucket when the product is saved.
          </span>
        </label>
        <label className="block text-sm font-black uppercase tracking-[0.14em]">
          Image URLs
          <textarea name="image_urls" rows={5} defaultValue={images} className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 outline-none focus:border-blood" />
          <span className="mt-2 block text-xs normal-case tracking-normal text-ink/50">
            Optional fallback: paste one public URL per line.
          </span>
        </label>
        <label className="block text-sm font-black uppercase tracking-[0.14em]">
          Variants
          <textarea name="variants" rows={6} defaultValue={variants} className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-blood" />
          <span className="mt-2 block text-xs normal-case tracking-normal text-ink/50">
            One per line: color, hex, size, stock, sku. Example: Black, #080808, M, 5, DYT-BLK-M
          </span>
        </label>
      </div>
      <aside className="h-fit border border-ink bg-white p-5">
        <label className="block text-sm font-black uppercase tracking-[0.14em]">
          Category
          <select name="category_id" defaultValue={product?.category_id ?? ""} className="mt-2 w-full border border-ink/20 px-4 py-3">
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <div className="mt-5 grid gap-3 text-sm font-bold">
          <Check name="is_active" label="Published" defaultChecked={product?.is_active} />
          <Check name="is_featured" label="Featured" defaultChecked={product?.is_featured} />
          <Check name="is_new_arrival" label="New Arrival" defaultChecked={product?.is_new_arrival} />
          <Check name="is_best_seller" label="Best Seller" defaultChecked={product?.is_best_seller} />
        </div>
        <button className="mt-6 h-13 w-full bg-ink px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white">
          Save Product
        </button>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  textarea
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  textarea?: boolean;
}) {
  const className = "mt-2 w-full border border-ink/20 bg-white px-4 py-3 outline-none focus:border-blood";
  return (
    <label className="block text-sm font-black uppercase tracking-[0.14em]">
      {label}
      {textarea ? (
        <textarea name={name} required={required} rows={6} defaultValue={defaultValue ?? ""} className={className} />
      ) : (
        <input name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className={className} />
      )}
    </label>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-5 w-5 accent-blood" />
      {label}
    </label>
  );
}
