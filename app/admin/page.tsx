import Link from "next/link";
import { getAdminOrders, getAdminStats } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value={stats.products} />
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Pending Orders" value={stats.pendingOrders} />
        <Stat label="Low Stock" value={stats.lowStock} />
      </div>
      <section className="mt-8 border border-ink bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-black uppercase tracking-[0.14em] underline">View all</Link>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/15 text-xs uppercase tracking-[0.14em] text-ink/45">
              <tr><th className="py-3">Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order.id} className="border-b border-ink/10">
                  <td className="py-3 font-black">{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{formatMoney(order.total)}</td>
                  <td>{order.order_status}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
    </div>
  );
}
