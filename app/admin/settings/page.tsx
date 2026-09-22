import { updateSettings } from "@/app/actions/admin";
import { getAdminSettings } from "@/lib/data/admin";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div>
      <h1 className="text-4xl font-black uppercase">Store Settings</h1>
      <form action={updateSettings} className="mt-6 grid max-w-4xl gap-4 border border-ink bg-white p-5 sm:grid-cols-2">
        <Field name="store_name" label="Store Name" defaultValue={settings?.store_name ?? "DYT"} />
        <Field name="whatsapp" label="WhatsApp" defaultValue={settings?.whatsapp} />
        <Field name="phone" label="Phone" defaultValue={settings?.phone} />
        <Field name="email" label="Email" defaultValue={settings?.email} />
        <Field name="instagram" label="Instagram" defaultValue={settings?.instagram} />
        <Field name="shipping_charge" label="Shipping Charge" type="number" defaultValue={settings?.shipping_charge ?? 0} />
        <Field name="free_shipping_threshold" label="Free Shipping Threshold" type="number" defaultValue={settings?.free_shipping_threshold ?? ""} />
        <Field name="bank_name" label="Bank Name" defaultValue={settings?.bank_name} />
        <Field name="bank_account_title" label="Bank Account Title" defaultValue={settings?.bank_account_title} />
        <Field name="bank_account_number" label="Account Number" defaultValue={settings?.bank_account_number} />
        <Field name="bank_iban" label="IBAN" defaultValue={settings?.bank_iban} />
        <button className="bg-ink px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-white sm:col-span-2">Save Settings</button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number | null;
}) {
  return (
    <label className="block text-sm font-black uppercase tracking-[0.14em]">
      {label}
      <input name={name} type={type} defaultValue={defaultValue ?? ""} className="mt-2 w-full border border-ink/20 px-4 py-3 outline-none focus:border-blood" />
    </label>
  );
}
