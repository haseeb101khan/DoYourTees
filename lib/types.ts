export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string | null;
  color_name: string;
  color_value: string | null;
  size: string;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  material: string | null;
  fit: string | null;
  regular_price: number;
  sale_price: number | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  archived_at: string | null;
  category?: Category | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type StoreSettings = {
  store_name: string;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  shipping_charge: number;
  free_shipping_threshold: number | null;
  bank_name: string | null;
  bank_account_title: string | null;
  bank_account_number: string | null;
  bank_iban: string | null;
  delivery_information: string | null;
  exchange_information: string | null;
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  imageUrl: string;
  color: string;
  size: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

export type OrderSummary = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  payment_method: "cod" | "bank_transfer";
  payment_status: "pending" | "pending_verification" | "paid" | "failed" | "rejected";
  order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};
