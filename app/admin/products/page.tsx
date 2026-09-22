import Link from "next/link";
import { archiveProduct } from "@/app/actions/admin";
import { getAdminProducts } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-black uppercase">Products</h1>
        <Link href="/admin/products/new" className="bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
          Add Product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto border border-ink bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-ink text-xs uppercase tracking-[0.14em] text-ink/45">
            <tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Status</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = product.product_variants?.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;
              return (
                <tr key={product.id} className="border-b border-ink/10">
                  <td className="p-4 font-black uppercase">{product.name}</td>
                  <td>{product.category?.name ?? "Uncategorized"}</td>
                  <td>{formatMoney(product.sale_price ?? product.regular_price)}</td>
                  <td>{product.archived_at ? "Archived" : product.is_active ? "Published" : "Draft"}</td>
                  <td>{stock}</td>
                  <td className="flex gap-2 p-4">
                    <Link href={`/admin/products/${product.id}`} className="border border-ink px-3 py-2 font-bold">Edit</Link>
                    <form action={archiveProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button className="border border-blood px-3 py-2 font-bold text-blood">Archive</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
