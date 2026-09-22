"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { hasServiceRoleEnv, hasSupabaseEnv } from "@/lib/supabase/env";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  if (!hasSupabaseEnv()) throw new Error("Supabase is not configured.");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Unauthorized");
}

export async function signInAdmin(_previousState: { error: string } | null, formData: FormData) {
  if (!hasSupabaseEnv()) return { error: "Supabase env vars are missing." };
  const supabase = await createSupabaseServerClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function signOutAdmin() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function saveCategory(formData: FormData) {
  await assertAdmin();
  if (!hasServiceRoleEnv()) throw new Error("Service role key missing.");
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const payload = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    description: String(formData.get("description") ?? ""),
    image_url: String(formData.get("image_url") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on"
  };
  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function archiveCategory(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("categories").update({ is_active: false }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/categories");
}

export async function saveProduct(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const payload = {
    name,
    slug: String(formData.get("slug") || slugify(name)),
    description: String(formData.get("description") ?? ""),
    material: String(formData.get("material") ?? "") || null,
    fit: String(formData.get("fit") ?? "") || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    regular_price: Math.round(Number(formData.get("regular_price") ?? 0)),
    sale_price: formData.get("sale_price") ? Math.round(Number(formData.get("sale_price"))) : null,
    is_featured: formData.get("is_featured") === "on",
    is_new_arrival: formData.get("is_new_arrival") === "on",
    is_best_seller: formData.get("is_best_seller") === "on",
    is_active: formData.get("is_active") === "on",
    archived_at: null
  };

  const result = id
    ? await supabase.from("products").update(payload).eq("id", id).select("id").single()
    : await supabase.from("products").insert(payload).select("id").single();
  const productId = result.data?.id ?? id;

  const imageUrls = String(formData.get("image_urls") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const imageFiles = formData
    .getAll("image_files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const uploadedUrls: string[] = [];
  for (const file of imageFiles) {
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false
    });
    if (!uploadError) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploadedUrls.push(data.publicUrl);
    }
  }

  const finalImageUrls = [...uploadedUrls, ...imageUrls];
  if (productId && finalImageUrls.length) {
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_images").insert(
      finalImageUrls.map((url, index) => ({
        product_id: productId,
        url,
        alt: name,
        sort_order: index
      }))
    );
  }

  const variants = String(formData.get("variants") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [color_name, color_value, size, stock, sku] = line.split(",").map((item) => item.trim());
      return {
        product_id: productId,
        color_name,
        color_value: color_value || null,
        size,
        stock: Number(stock ?? 0),
        sku: sku || null,
        is_active: true
      };
    })
    .filter((variant) => variant.product_id && variant.color_name && variant.size);

  if (productId && variants.length) {
    await supabase.from("product_variants").delete().eq("product_id", productId);
    await supabase.from("product_variants").insert(variants);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function archiveProduct(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase.from("products").update({ archived_at: new Date().toISOString(), is_active: false }).eq("id", String(formData.get("id")));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function updateOrderStatus(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("orders")
    .update({
      order_status: String(formData.get("order_status")),
      payment_status: String(formData.get("payment_status"))
    })
    .eq("id", String(formData.get("id")));
  revalidatePath("/admin/orders");
}

export async function updateSettings(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseAdminClient();
  await supabase
    .from("store_settings")
    .update({
      store_name: String(formData.get("store_name") ?? "DYT"),
      whatsapp: String(formData.get("whatsapp") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      instagram: String(formData.get("instagram") ?? "") || null,
      shipping_charge: Number(formData.get("shipping_charge") ?? 0),
      free_shipping_threshold: formData.get("free_shipping_threshold")
        ? Number(formData.get("free_shipping_threshold"))
        : null,
      bank_name: String(formData.get("bank_name") ?? "") || null,
      bank_account_title: String(formData.get("bank_account_title") ?? "") || null,
      bank_account_number: String(formData.get("bank_account_number") ?? "") || null,
      bank_iban: String(formData.get("bank_iban") ?? "") || null,
      delivery_information: String(formData.get("delivery_information") ?? "") || null,
      exchange_information: String(formData.get("exchange_information") ?? "") || null
    })
    .eq("id", 1);
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}
