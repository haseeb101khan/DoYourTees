import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, OrderSummary, Product, StoreSettings } from "@/lib/types";

const productSelect = `
  *,
  category:categories(*),
  product_images(*),
  product_variants(*)
`;

export async function requireAdmin() {
  if (!hasSupabaseEnv()) return { configured: false as const, user: null };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin/login?error=not-admin");

  return { configured: true as const, user };
}

export async function getAdminStats() {
  if (!hasSupabaseEnv()) {
    return { products: 0, orders: 0, pendingOrders: 0, lowStock: 0 };
  }
  const supabase = await createSupabaseServerClient();
  const [products, orders, pendingOrders, lowStock] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).is("archived_at", null),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
    supabase.from("product_variants").select("id", { count: "exact", head: true }).lte("stock", 3)
  ]);

  return {
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    pendingOrders: pendingOrders.count ?? 0,
    lowStock: lowStock.count ?? 0
  };
}

export async function getAdminProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select(productSelect).order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select(productSelect).eq("id", id).single();
  return (data as Product | null) ?? null;
}

export async function getAdminCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAdminOrders(): Promise<OrderSummary[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  return (data as OrderSummary[]) ?? [];
}

export async function getAdminOrder(id: string) {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).single();
  return data;
}

export async function getAdminSettings(): Promise<StoreSettings | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();
  return data;
}
