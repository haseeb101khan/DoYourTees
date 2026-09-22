import { getAdminProducts } from "@/lib/data/admin";

export default async function AdminInventoryPage() {
  const products = await getAdminProducts();
  const variants = products.flatMap((product) =>
    (product.product_variants ?? []).map((variant) => ({ ...variant, productName: product.name }))
  );

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Inventory</h1>
      <div className="mt-6 overflow-x-auto border border-ink bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-ink text-xs uppercase tracking-[0.14em] text-ink/45">
            <tr><th className="p-4">Product</th><th>SKU</th><th>Color</th><th>Size</th><th>Stock</th><th>Status</th></tr>
          </thead>
          <tbody>
            {variants.map((variant) => {
              const status = variant.stock === 0 ? "Out of Stock" : variant.stock <= variant.low_stock_threshold ? "Low Stock" : "In Stock";
              return (
                <tr key={variant.id} className="border-b border-ink/10">
                  <td className="p-4 font-black uppercase">{variant.productName}</td>
                  <td>{variant.sku}</td>
                  <td>{variant.color_name}</td>
                  <td>{variant.size}</td>
                  <td>{variant.stock}</td>
                  <td className={variant.stock <= variant.low_stock_threshold ? "font-black text-blood" : "font-bold"}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
