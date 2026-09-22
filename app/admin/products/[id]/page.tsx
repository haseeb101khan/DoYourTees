import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProduct } from "@/lib/data/admin";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategories()]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
