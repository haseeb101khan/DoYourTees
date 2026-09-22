import type { Category, Product, StoreSettings } from "@/lib/types";

export const demoCategories: Category[] = [
  { id: "cat-tees", name: "T-Shirts", slug: "t-shirts", description: "Everyday graphic tees in classic and regular fits.", image_url: "/catalog/half-sleeve-3.jpeg", is_active: true, sort_order: 1 },
  { id: "cat-oversized", name: "Drop Shoulders", slug: "drop-shoulders", description: "Relaxed drop-shoulder tees with front-and-back artwork.", image_url: "/catalog/drop-shoulder-1.jpeg", is_active: true, sort_order: 2 },
  { id: "cat-sleeveless", name: "Sleeveless", slug: "sleeveless", description: "Cut-off graphic tees for hot city days.", image_url: "/catalog/sleeveless-1.jpeg", is_active: true, sort_order: 3 },
  { id: "cat-long-sleeves", name: "Full Sleeves", slug: "full-sleeves", description: "Full-sleeve statement layers with all-over graphics.", image_url: "/catalog/full-sleeve-1.jpeg", is_active: true, sort_order: 4 }
];

type CatalogEntry = {
  code: string;
  categoryId: string;
  categoryIndex: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  colorName: string;
  colorValue: string;
  sizes: string[];
  featured?: boolean;
  bestSeller?: boolean;
};

function catalogProduct(entry: CatalogEntry, index: number): Product {
  const id = `prod-${entry.slug}`;

  return {
    id,
    category_id: entry.categoryId,
    name: entry.name,
    slug: entry.slug,
    description: entry.description,
    material: "Premium combed cotton jersey",
    fit: entry.categoryId === "cat-oversized" ? "Relaxed drop-shoulder fit" : "Comfortable regular fit",
    regular_price: entry.price,
    sale_price: entry.salePrice ?? null,
    is_featured: entry.featured ?? false,
    is_new_arrival: true,
    is_best_seller: entry.bestSeller ?? false,
    is_active: true,
    archived_at: null,
    category: demoCategories[entry.categoryIndex],
    product_images: [{ id: `img-${entry.slug}`, product_id: id, url: entry.image, alt: `${entry.name} in ${entry.colorName}`, sort_order: 0 }],
    product_variants: entry.sizes.map((size, sizeIndex) => ({
      id: `var-${entry.slug}-${size.toLowerCase()}`,
      product_id: id,
      sku: `DYT-${entry.code}-${size}`,
      color_name: entry.colorName,
      color_value: entry.colorValue,
      size,
      stock: 6 + ((index + sizeIndex) % 7),
      low_stock_threshold: 3,
      is_active: true
    }))
  };
}

const catalog: CatalogEntry[] = [
  { code: "SM06", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Webline Sleeveless Tee", slug: "webline-sleeveless-tee", description: "Black sleeveless graphic tee with a sharp monochrome web illustration.", price: 1899, salePrice: 1699, image: "/catalog/sleeveless-1.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"], featured: true },
  { code: "SM03", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Night Panther Sleeveless Tee", slug: "night-panther-sleeveless-tee", description: "Black cut-off tee finished with a tonal purple panther graphic.", price: 1899, image: "/catalog/sleeveless-2.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"] },
  { code: "SM09", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Thunder Mark Sleeveless Tee", slug: "thunder-mark-sleeveless-tee", description: "A black sleeveless cut with a vivid red and yellow thunder-cat inspired print.", price: 1899, image: "/catalog/sleeveless-3.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"], bestSeller: true },
  { code: "SM22", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Merc Print Sleeveless Tee", slug: "merc-print-sleeveless-tee", description: "Black sleeveless tee with a red character poster graphic at the chest.", price: 1899, image: "/catalog/sleeveless-4.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"] },
  { code: "SM21", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Gotham Logo Sleeveless Tee", slug: "gotham-logo-sleeveless-tee", description: "A clean black muscle tee with a distressed white bat emblem.", price: 1899, image: "/catalog/sleeveless-5.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"] },
  { code: "SM11", categoryId: "cat-sleeveless", categoryIndex: 2, name: "Worthy Shield Sleeveless Tee", slug: "worthy-shield-sleeveless-tee", description: "Black sleeveless tee with a vintage shield-and-hammer chest print.", price: 1999, image: "/catalog/sleeveless-6.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"], featured: true },
  { code: "NWO12", categoryId: "cat-tees", categoryIndex: 0, name: "Wander Graphic Tee", slug: "wander-graphic-tee", description: "White classic-fit tee with a mountain trail graphic in soft blue and black.", price: 1999, image: "/catalog/half-sleeve-1.jpeg", colorName: "White", colorValue: "#f7f7f5", sizes: ["S", "M", "L", "XL"], featured: true },
  { code: "NWO17", categoryId: "cat-tees", categoryIndex: 0, name: "One Man Army Tee", slug: "one-man-army-tee", description: "Olive green regular-fit tee with a bold military stencil graphic.", price: 1999, image: "/catalog/half-sleeve-2.jpeg", colorName: "Olive", colorValue: "#4b4d2e", sizes: ["S", "M", "L", "XL"] },
  { code: "NWO37", categoryId: "cat-tees", categoryIndex: 0, name: "Rise Above Tee", slug: "rise-above-tee", description: "Black regular-fit tee with crisp alpine artwork and a minimal Rise Above line.", price: 1999, image: "/catalog/half-sleeve-3.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"], bestSeller: true },
  { code: "NWO14", categoryId: "cat-tees", categoryIndex: 0, name: "Wild Moon Tee", slug: "wild-moon-tee", description: "White graphic tee featuring a wolf portrait and night-moon detail.", price: 1999, image: "/catalog/half-sleeve-4.jpeg", colorName: "White", colorValue: "#f7f7f5", sizes: ["S", "M", "L", "XL"] },
  { code: "NWO56", categoryId: "cat-tees", categoryIndex: 0, name: "Hold It Together Tee", slug: "hold-it-together-tee", description: "Black graphic tee with a distressed taped-type illustration.", price: 1999, salePrice: 1799, image: "/catalog/half-sleeve-5.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"] },
  { code: "SOF18", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "Dark Knight Full Sleeve", slug: "dark-knight-full-sleeve", description: "Black full-sleeve tee with comic-panel artwork across the front.", price: 2599, image: "/catalog/full-sleeve-1.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"], featured: true },
  { code: "SOF07", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "Gamma Strike Full Sleeve", slug: "gamma-strike-full-sleeve", description: "Black full-sleeve statement tee with a high-impact green character graphic.", price: 2599, image: "/catalog/full-sleeve-2.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"] },
  { code: "SOF05", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "City Bat Full Sleeve", slug: "city-bat-full-sleeve", description: "All-over full-sleeve tee with a yellow bat crest on a dark city field.", price: 2599, image: "/catalog/full-sleeve-3.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"] },
  { code: "SOF20", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "Thunder Crest Full Sleeve", slug: "thunder-crest-full-sleeve", description: "Black full-sleeve tee featuring a large distressed red thunder crest.", price: 2599, image: "/catalog/full-sleeve-4.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["S", "M", "L", "XL"], bestSeller: true },
  { code: "SOO60", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "Web Armor Full Sleeve", slug: "web-armor-full-sleeve", description: "Red and black full-sleeve tee with an armor-inspired web pattern.", price: 2699, image: "/catalog/full-sleeve-5.jpeg", colorName: "Red", colorValue: "#7b1717", sizes: ["S", "M", "L", "XL"] },
  { code: "SOF02", categoryId: "cat-long-sleeves", categoryIndex: 3, name: "Venom Ink Full Sleeve", slug: "venom-ink-full-sleeve", description: "Black-and-white full-sleeve tee with a vivid red tongue graphic.", price: 2699, image: "/catalog/full-sleeve-6.jpeg", colorName: "Black / White", colorValue: "#202020", sizes: ["S", "M", "L", "XL"] },
  { code: "ROV29", categoryId: "cat-oversized", categoryIndex: 1, name: "Batwing Drop Shoulder Tee", slug: "batwing-drop-shoulder-tee", description: "Oversized black tee with a small front mark and oversized gold back artwork.", price: 2499, image: "/catalog/drop-shoulder-1.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"], featured: true },
  { code: "ROV32", categoryId: "cat-oversized", categoryIndex: 1, name: "Inferno Drop Shoulder Tee", slug: "inferno-drop-shoulder-tee", description: "Oversized black tee with a small front logo and fiery masked back graphic.", price: 2499, image: "/catalog/drop-shoulder-2.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"], bestSeller: true },
  { code: "ROV21", categoryId: "cat-oversized", categoryIndex: 1, name: "Night Owl Drop Shoulder Tee", slug: "night-owl-drop-shoulder-tee", description: "Relaxed black tee with a tonal front mark and owl artwork across the back.", price: 2499, image: "/catalog/drop-shoulder-3.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"] },
  { code: "ROV25", categoryId: "cat-oversized", categoryIndex: 1, name: "Monochrome Stage Drop Shoulder Tee", slug: "monochrome-stage-drop-shoulder-tee", description: "Black oversized tee with a compact chest patch and monochrome stage print at the back.", price: 2499, image: "/catalog/drop-shoulder-4.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"] },
  { code: "ROV12", categoryId: "cat-oversized", categoryIndex: 1, name: "Heartbreaker Drop Shoulder Tee", slug: "heartbreaker-drop-shoulder-tee", description: "Oversized black tee with a small front wordmark and bold red back illustration.", price: 2499, image: "/catalog/drop-shoulder-5.jpeg", colorName: "Black", colorValue: "#111111", sizes: ["M", "L", "XL"], featured: true }
];

export const demoProducts: Product[] = catalog.map(catalogProduct);

export const demoSettings: StoreSettings = {
  store_name: "DYT",
  whatsapp: "+92 300 0000000",
  phone: "+92 300 0000000",
  email: "hello@doyourtee.com",
  instagram: "https://instagram.com/dyt",
  shipping_charge: 250,
  free_shipping_threshold: 6000,
  bank_name: "Configure in Admin",
  bank_account_title: "DYT",
  bank_account_number: "Configure in Admin",
  bank_iban: "Configure in Admin",
  delivery_information: "Estimated delivery in 3-5 working days across Pakistan.",
  exchange_information: "Exchange requests are accepted within 7 days for unworn items with original tags and packaging."
};
