import Link from "next/link";
import { getAdminOrders } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Orders</h1>
      <div className="mt-6 overflow-x-auto border border-ink bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink text-xs uppercase tracking-[0.14em] text-ink/45">
            <tr><th className="p-4">Order #</th><th>Customer</th><th>Phone</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-ink/10">
                <td className="p-4 font-black">{order.order_number}</td>
                <td>{order.customer_name}</td>
                <td>{order.customer_phone}</td>
                <td>{formatMoney(order.total)}</td>
                <td>{order.payment_method} / {order.payment_status}</td>
                <td>{order.order_status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td><Link href={`/admin/orders/${order.id}`} className="border border-ink px-3 py-2 font-bold">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
