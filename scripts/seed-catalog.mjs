import { readFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { createClient } from "@supabase/supabase-js";
import ts from "typescript";

process.loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local");
}

const demoSource = await readFile(new URL("../lib/demo-data.ts", import.meta.url), "utf8");
const compiledDemo = ts.transpileModule(demoSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022
  }
}).outputText;
const demoModuleUrl = `data:text/javascript;base64,${Buffer.from(compiledDemo).toString("base64")}`;
const { demoCategories, demoProducts, demoSettings } = await import(demoModuleUrl);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function fail(label, error) {
  if (error) throw new Error(`${label}: ${error.message}`);
}

const categoryRows = demoCategories.map(({ id: _id, ...category }) => category);
const { data: categories, error: categoriesError } = await supabase
  .from("categories")
  .upsert(categoryRows, { onConflict: "slug" })
  .select("id, slug");
fail("Categories", categoriesError);

const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
const productRows = demoProducts.map((product) => ({
  category_id: categoryIds.get(product.category?.slug),
  name: product.name,
  slug: product.slug,
  description: product.description,
  material: product.material,
  fit: product.fit,
  regular_price: product.regular_price,
  sale_price: product.sale_price,
  is_featured: product.is_featured,
  is_new_arrival: product.is_new_arrival,
  is_best_seller: product.is_best_seller,
  is_active: product.is_active,
  archived_at: null
}));

const { data: products, error: productsError } = await supabase
  .from("products")
  .upsert(productRows, { onConflict: "slug" })
  .select("id, slug");
fail("Products", productsError);

const productIds = new Map(products.map((product) => [product.slug, product.id]));
const seededProductIds = products.map((product) => product.id);

const { error: imagesDeleteError } = await supabase.from("product_images").delete().in("product_id", seededProductIds);
fail("Existing product images", imagesDeleteError);

const imageRows = demoProducts.flatMap((product) =>
  (product.product_images ?? []).map((image) => ({
    product_id: productIds.get(product.slug),
    url: image.url,
    alt: image.alt,
    sort_order: image.sort_order
  }))
);
const { error: imagesError } = await supabase.from("product_images").insert(imageRows);
fail("Product images", imagesError);

const variantRows = demoProducts.flatMap((product) =>
  (product.product_variants ?? []).map((variant) => ({
    product_id: productIds.get(product.slug),
    sku: variant.sku,
    color_name: variant.color_name,
    color_value: variant.color_value,
    size: variant.size,
    stock: variant.stock,
    low_stock_threshold: variant.low_stock_threshold,
    is_active: variant.is_active
  }))
);
const { error: variantsError } = await supabase
  .from("product_variants")
  .upsert(variantRows, { onConflict: "product_id,color_name,size" });
fail("Product variants", variantsError);

const { error: settingsError } = await supabase.from("store_settings").upsert({ id: 1, ...demoSettings });
fail("Store settings", settingsError);

console.log(
  `Seeded ${categories.length} categories, ${products.length} products, ${imageRows.length} images, and ${variantRows.length} variants.`
);
