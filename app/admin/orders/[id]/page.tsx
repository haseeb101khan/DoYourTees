import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/admin";
import { getAdminOrder } from "@/lib/data/admin";
import { formatMoney } from "@/lib/utils";

const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "rejected"];

type AdminOrderItem = {
  id: string;
  product_name: string;
  color_name: string;
  size: string;
  quantity: number;
  line_total: number;
};

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">{order.order_number}</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="border border-ink bg-white p-5">
          <h2 className="text-2xl font-black uppercase">Items</h2>
          <div className="mt-4 divide-y divide-ink/10">
            {(order.order_items as AdminOrderItem[]).map((item) => (
              <div key={item.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black uppercase">{item.product_name}</p>
                  <p className="text-sm text-ink/55">{item.color_name} / {item.size} x {item.quantity}</p>
                </div>
                <p className="font-black">{formatMoney(item.line_total)}</p>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-5">
          <div className="border border-ink bg-white p-5">
            <h2 className="text-xl font-black uppercase">Customer</h2>
            <div className="mt-3 text-sm leading-7 text-ink/70">
              <p>{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p>{order.customer_email}</p>
              <p>{order.address}, {order.city}</p>
              {order.notes && <p>Notes: {order.notes}</p>}
            </div>
          </div>
          <form action={updateOrderStatus} className="border border-ink bg-white p-5">
            <input type="hidden" name="id" value={order.id} />
            <h2 className="text-xl font-black uppercase">Status</h2>
            <label className="mt-4 block text-sm font-black uppercase tracking-[0.14em]">
              Order
              <select name="order_status" defaultValue={order.order_status} className="mt-2 w-full border border-ink/20 px-3 py-3">
                {orderStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-black uppercase tracking-[0.14em]">
              Payment
              <select name="payment_status" defaultValue={order.payment_status} className="mt-2 w-full border border-ink/20 px-3 py-3">
                {paymentStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <div className="mt-5 border-t border-ink/15 pt-4 text-sm">
              <p>Subtotal: {formatMoney(order.subtotal)}</p>
              <p>Shipping: {formatMoney(order.shipping_charge)}</p>
              <p className="text-lg font-black">Total: {formatMoney(order.total)}</p>
            </div>
            <button className="mt-5 w-full bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">Save Status</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
