import { unstable_noStore as noStore } from "next/cache";
import { demoCategories, demoProducts, demoSettings } from "@/lib/demo-data";
import { hasServiceRoleEnv, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product, StoreSettings } from "@/lib/types";

const productSelect = `
  *,
  category:categories(*),
  product_images(*),
  product_variants(*)
`;

function visibleProducts(products: Product[]) {
  return products.filter((product) => product.is_active && !product.archived_at);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  noStore();

  if (!hasSupabaseEnv()) return demoSettings;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();

  return data ?? demoSettings;
}

export async function getCategories(): Promise<Category[]> {
  noStore();

  if (!hasSupabaseEnv()) return demoCategories;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getProducts(options?: {
  category?: string;
  color?: string;
  size?: string;
  q?: string;
  sort?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newest?: boolean;
  limit?: number;
}): Promise<Product[]> {
  noStore();
  const searchTerm = options?.q?.trim().replace(/[,()%]/g, " ").slice(0, 80);

  if (!hasSupabaseEnv()) {
    let products = visibleProducts(demoProducts);
    if (options?.category) products = products.filter((product) => product.category?.slug === options.category);
    if (options?.color) {
      products = products.filter((product) =>
        product.product_variants?.some((variant) => variant.color_name.toLowerCase() === options.color?.toLowerCase())
      );
    }
    if (options?.size) {
      products = products.filter((product) => product.product_variants?.some((variant) => variant.size === options.size));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      products = products.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(term));
    }
    if (options?.featured) products = products.filter((product) => product.is_featured);
    if (options?.bestSeller) products = products.filter((product) => product.is_best_seller);
    if (options?.newest) products = products.filter((product) => product.is_new_arrival);
    if (options?.sort === "price-asc") products = [...products].sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
    if (options?.sort === "price-desc") products = [...products].sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
    return products.slice(0, options?.limit ?? products.length);
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .is("archived_at", null);

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.bestSeller) query = query.eq("is_best_seller", true);
  if (options?.newest) query = query.eq("is_new_arrival", true);
  if (options?.category) {
    const categories = await getCategories();
    const category = categories.find((item) => item.slug === options.category);
    if (category) query = query.eq("category_id", category.id);
  }
  if (searchTerm) query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

  if (options?.sort === "price-asc") query = query.order("sale_price", { ascending: true, nullsFirst: false });
  else if (options?.sort === "price-desc") query = query.order("sale_price", { ascending: false, nullsFirst: false });
  else query = query.order("created_at", { ascending: false });

  if (options?.limit) query = query.limit(options.limit);

  const { data } = await query;
  let products = (data ?? []) as Product[];

  if (options?.color) {
    products = products.filter((product) =>
      product.product_variants?.some((variant) => variant.color_name.toLowerCase() === options.color?.toLowerCase())
    );
  }
  if (options?.size) {
    products = products.filter((product) => product.product_variants?.some((variant) => variant.size === options.size));
  }
  if (options?.sort === "price-asc") {
    products.sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price));
  }
  if (options?.sort === "price-desc") {
    products.sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price));
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  noStore();

  if (!hasSupabaseEnv()) {
    return visibleProducts(demoProducts).find((product) => product.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .is("archived_at", null)
    .single();

  return (data as Product | null) ?? null;
}

export async function getRelatedProducts(product: Product) {
  const products = await getProducts({ category: product.category?.slug, limit: 4 });
  return products.filter((item) => item.id !== product.id).slice(0, 3);
}

export async function getOrderConfirmation(token: string) {
  noStore();
  if (!hasServiceRoleEnv() || !/^[0-9a-f-]{36}$/i.test(token)) return null;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("order_number, customer_phone, total, payment_method, payment_status, order_status, created_at")
    .eq("confirmation_token", token)
    .maybeSingle();
  return data;
}
