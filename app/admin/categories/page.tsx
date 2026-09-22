import { archiveCategory, saveCategory } from "@/app/actions/admin";
import { getAdminCategories } from "@/lib/data/admin";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Categories</h1>
      <form action={saveCategory} className="mt-6 grid gap-4 border border-ink bg-white p-5 lg:grid-cols-5">
        <input name="name" required placeholder="Name" className="border border-ink/20 px-4 py-3" />
        <input name="slug" placeholder="Slug" className="border border-ink/20 px-4 py-3" />
        <input name="image_url" placeholder="Image URL" className="border border-ink/20 px-4 py-3" />
        <input name="sort_order" type="number" placeholder="Sort" className="border border-ink/20 px-4 py-3" />
        <label className="flex items-center gap-2 font-bold"><input name="is_active" type="checkbox" defaultChecked /> Active</label>
        <textarea name="description" placeholder="Description" className="border border-ink/20 px-4 py-3 lg:col-span-4" />
        <button className="bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Add Category</button>
      </form>
      <div className="mt-6 grid gap-4">
        {categories.map((category) => (
          <form key={category.id} action={saveCategory} className="grid gap-3 border border-ink/15 bg-white p-4 lg:grid-cols-5">
            <input type="hidden" name="id" value={category.id} />
            <input name="name" defaultValue={category.name} className="border border-ink/20 px-3 py-2 font-bold" />
            <input name="slug" defaultValue={category.slug} className="border border-ink/20 px-3 py-2" />
            <input name="image_url" defaultValue={category.image_url ?? ""} className="border border-ink/20 px-3 py-2" />
            <input name="sort_order" type="number" defaultValue={category.sort_order} className="border border-ink/20 px-3 py-2" />
            <label className="flex items-center gap-2 font-bold"><input name="is_active" type="checkbox" defaultChecked={category.is_active} /> Active</label>
            <textarea name="description" defaultValue={category.description ?? ""} className="border border-ink/20 px-3 py-2 lg:col-span-3" />
            <button className="border border-ink px-4 py-2 font-bold">Save</button>
            <button formAction={archiveCategory} className="border border-blood px-4 py-2 font-bold text-blood">Archive</button>
          </form>
        ))}
      </div>
    </div>
  );
}
