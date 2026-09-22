"use server";

import { revalidatePath } from "next/cache";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout";
import { hasServiceRoleEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Result = { ok: true; orderNumber: string; confirmationToken: string } | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<Result> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid checkout details" };
  if (!hasServiceRoleEnv()) return { ok: false, error: "Supabase service role is not configured yet." };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: parsed.data.fullName,
    p_customer_phone: parsed.data.phone,
    p_customer_email: parsed.data.email || "",
    p_address: parsed.data.address,
    p_city: parsed.data.city,
    p_postal_code: parsed.data.postalCode || "",
    p_notes: parsed.data.notes || "",
    p_payment_method: parsed.data.paymentMethod,
    p_items: parsed.data.items
  });

  const result = data as { orderNumber?: string; confirmationToken?: string } | null;
  if (error || !result?.orderNumber || !result.confirmationToken) {
    return { ok: false, error: error?.message ?? "Unable to create order." };
  }

  revalidatePath("/admin/orders");
  return { ok: true, orderNumber: result.orderNumber, confirmationToken: result.confirmationToken };
}
