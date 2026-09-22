import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/admin";

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
