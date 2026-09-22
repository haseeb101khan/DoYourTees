import Link from "next/link";
import { signOutAdmin } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/data/admin";

export const metadata = {
  title: "Admin | DYT"
};

export const dynamic = "force-dynamic";

const nav = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Orders", "/admin/orders"],
  ["Inventory", "/admin/inventory"],
  ["Store Settings", "/admin/settings"]
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  if (!admin.configured) {
    return (
      <div className="min-h-screen bg-bone p-6 text-ink">
        <div className="mx-auto mt-16 max-w-2xl border border-ink bg-white p-8">
          <h1 className="text-4xl font-black uppercase">Supabase setup needed</h1>
          <p className="mt-4 leading-7 text-ink/65">
            Add Supabase environment variables from `.env.example`, run the migrations, then create your first admin
            user. The storefront can run with demo data meanwhile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone text-ink lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-ink bg-ink p-5 text-white lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link href="/admin" className="text-4xl font-black">DYT</Link>
        <nav className="mt-8 flex flex-wrap gap-2 lg:flex-col">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="border border-white/15 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] hover:bg-white hover:text-ink">
              {label}
            </Link>
          ))}
        </nav>
        <form action={signOutAdmin} className="mt-8">
          <button className="w-full border border-white/30 px-4 py-3 text-sm font-black uppercase tracking-[0.14em]">Logout</button>
        </form>
      </aside>
      <main className="p-5 lg:p-8">{children}</main>
    </div>
  );
}
