begin;

insert into public.categories (name, slug, description, image_url, sort_order, is_active)
values
  ('T-Shirts', 't-shirts', 'Everyday graphic tees in classic and regular fits.', '/catalog/half-sleeve-3.jpeg', 1, true),
  ('Drop Shoulders', 'drop-shoulders', 'Relaxed drop-shoulder tees with front-and-back artwork.', '/catalog/drop-shoulder-1.jpeg', 2, true),
  ('Sleeveless', 'sleeveless', 'Cut-off graphic tees for hot city days.', '/catalog/sleeveless-1.jpeg', 3, true),
  ('Full Sleeves', 'full-sleeves', 'Full-sleeve statement layers with all-over graphics.', '/catalog/full-sleeve-1.jpeg', 4, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

create temporary table dyt_catalog_seed (
  code text not null,
  category_slug text not null,
  name text not null,
  slug text not null,
  description text not null,
  regular_price integer not null,
  sale_price integer,
  image_url text not null,
  color_name text not null,
  color_value text not null,
  sizes text[] not null,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false
) on commit drop;

insert into dyt_catalog_seed (
  code, category_slug, name, slug, description, regular_price, sale_price,
  image_url, color_name, color_value, sizes, is_featured, is_best_seller
)
values
  ('SM06', 'sleeveless', 'Webline Sleeveless Tee', 'webline-sleeveless-tee', 'Black sleeveless graphic tee with a sharp monochrome web illustration.', 1899, 1699, '/catalog/sleeveless-1.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], true, false),
  ('SM03', 'sleeveless', 'Night Panther Sleeveless Tee', 'night-panther-sleeveless-tee', 'Black cut-off tee finished with a tonal purple panther graphic.', 1899, null, '/catalog/sleeveless-2.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, false),
  ('SM09', 'sleeveless', 'Thunder Mark Sleeveless Tee', 'thunder-mark-sleeveless-tee', 'A black sleeveless cut with a vivid red and yellow thunder-cat inspired print.', 1899, null, '/catalog/sleeveless-3.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, true),
  ('SM22', 'sleeveless', 'Merc Print Sleeveless Tee', 'merc-print-sleeveless-tee', 'Black sleeveless tee with a red character poster graphic at the chest.', 1899, null, '/catalog/sleeveless-4.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, false),
  ('SM21', 'sleeveless', 'Gotham Logo Sleeveless Tee', 'gotham-logo-sleeveless-tee', 'A clean black muscle tee with a distressed white bat emblem.', 1899, null, '/catalog/sleeveless-5.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, false),
  ('SM11', 'sleeveless', 'Worthy Shield Sleeveless Tee', 'worthy-shield-sleeveless-tee', 'Black sleeveless tee with a vintage shield-and-hammer chest print.', 1999, null, '/catalog/sleeveless-6.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], true, false),
  ('NWO12', 't-shirts', 'Wander Graphic Tee', 'wander-graphic-tee', 'White classic-fit tee with a mountain trail graphic in soft blue and black.', 1999, null, '/catalog/half-sleeve-1.jpeg', 'White', '#f7f7f5', array['S', 'M', 'L', 'XL'], true, false),
  ('NWO17', 't-shirts', 'One Man Army Tee', 'one-man-army-tee', 'Olive green regular-fit tee with a bold military stencil graphic.', 1999, null, '/catalog/half-sleeve-2.jpeg', 'Olive', '#4b4d2e', array['S', 'M', 'L', 'XL'], false, false),
  ('NWO37', 't-shirts', 'Rise Above Tee', 'rise-above-tee', 'Black regular-fit tee with crisp alpine artwork and a minimal Rise Above line.', 1999, null, '/catalog/half-sleeve-3.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, true),
  ('NWO14', 't-shirts', 'Wild Moon Tee', 'wild-moon-tee', 'White graphic tee featuring a wolf portrait and night-moon detail.', 1999, null, '/catalog/half-sleeve-4.jpeg', 'White', '#f7f7f5', array['S', 'M', 'L', 'XL'], false, false),
  ('NWO56', 't-shirts', 'Hold It Together Tee', 'hold-it-together-tee', 'Black graphic tee with a distressed taped-type illustration.', 1999, 1799, '/catalog/half-sleeve-5.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, false),
  ('SOF18', 'full-sleeves', 'Dark Knight Full Sleeve', 'dark-knight-full-sleeve', 'Black full-sleeve tee with comic-panel artwork across the front.', 2599, null, '/catalog/full-sleeve-1.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], true, false),
  ('SOF07', 'full-sleeves', 'Gamma Strike Full Sleeve', 'gamma-strike-full-sleeve', 'Black full-sleeve statement tee with a high-impact green character graphic.', 2599, null, '/catalog/full-sleeve-2.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, false),
  ('SOF05', 'full-sleeves', 'City Bat Full Sleeve', 'city-bat-full-sleeve', 'All-over full-sleeve tee with a yellow bat crest on a dark city field.', 2599, null, '/catalog/full-sleeve-3.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, false),
  ('SOF20', 'full-sleeves', 'Thunder Crest Full Sleeve', 'thunder-crest-full-sleeve', 'Black full-sleeve tee featuring a large distressed red thunder crest.', 2599, null, '/catalog/full-sleeve-4.jpeg', 'Black', '#111111', array['S', 'M', 'L', 'XL'], false, true),
  ('SOO60', 'full-sleeves', 'Web Armor Full Sleeve', 'web-armor-full-sleeve', 'Red and black full-sleeve tee with an armor-inspired web pattern.', 2699, null, '/catalog/full-sleeve-5.jpeg', 'Red', '#7b1717', array['S', 'M', 'L', 'XL'], false, false),
  ('SOF02', 'full-sleeves', 'Venom Ink Full Sleeve', 'venom-ink-full-sleeve', 'Black-and-white full-sleeve tee with a vivid red tongue graphic.', 2699, null, '/catalog/full-sleeve-6.jpeg', 'Black / White', '#202020', array['S', 'M', 'L', 'XL'], false, false),
  ('ROV29', 'drop-shoulders', 'Batwing Drop Shoulder Tee', 'batwing-drop-shoulder-tee', 'Oversized black tee with a small front mark and oversized gold back artwork.', 2499, null, '/catalog/drop-shoulder-1.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], true, false),
  ('ROV32', 'drop-shoulders', 'Inferno Drop Shoulder Tee', 'inferno-drop-shoulder-tee', 'Oversized black tee with a small front logo and fiery masked back graphic.', 2499, null, '/catalog/drop-shoulder-2.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, true),
  ('ROV21', 'drop-shoulders', 'Night Owl Drop Shoulder Tee', 'night-owl-drop-shoulder-tee', 'Relaxed black tee with a tonal front mark and owl artwork across the back.', 2499, null, '/catalog/drop-shoulder-3.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, false),
  ('ROV25', 'drop-shoulders', 'Monochrome Stage Drop Shoulder Tee', 'monochrome-stage-drop-shoulder-tee', 'Black oversized tee with a compact chest patch and monochrome stage print at the back.', 2499, null, '/catalog/drop-shoulder-4.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], false, false),
  ('ROV12', 'drop-shoulders', 'Heartbreaker Drop Shoulder Tee', 'heartbreaker-drop-shoulder-tee', 'Oversized black tee with a small front wordmark and bold red back illustration.', 2499, null, '/catalog/drop-shoulder-5.jpeg', 'Black', '#111111', array['M', 'L', 'XL'], true, false);

insert into public.products (
  category_id, name, slug, description, regular_price, sale_price,
  is_featured, is_new_arrival, is_best_seller, is_active, archived_at
)
select
  categories.id,
  seed.name,
  seed.slug,
  seed.description,
  seed.regular_price,
  seed.sale_price,
  seed.is_featured,
  true,
  seed.is_best_seller,
  true,
  null
from dyt_catalog_seed seed
join public.categories on categories.slug = seed.category_slug
on conflict (slug) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  regular_price = excluded.regular_price,
  sale_price = excluded.sale_price,
  is_featured = excluded.is_featured,
  is_new_arrival = excluded.is_new_arrival,
  is_best_seller = excluded.is_best_seller,
  is_active = excluded.is_active,
  archived_at = null;

delete from public.product_images
using public.products
where product_images.product_id = products.id
  and products.slug in (select slug from dyt_catalog_seed);

insert into public.product_images (product_id, url, alt, sort_order)
select
  products.id,
  seed.image_url,
  seed.name || ' in ' || seed.color_name,
  0
from dyt_catalog_seed seed
join public.products on products.slug = seed.slug;

insert into public.product_variants (
  product_id, sku, color_name, color_value, size, stock,
  low_stock_threshold, is_active
)
select
  products.id,
  'DYT-' || seed.code || '-' || size.value,
  seed.color_name,
  seed.color_value,
  size.value,
  10,
  3,
  true
from dyt_catalog_seed seed
join public.products on products.slug = seed.slug
cross join lateral unnest(seed.sizes) as size(value)
on conflict (product_id, color_name, size) do update set
  sku = excluded.sku,
  color_value = excluded.color_value,
  is_active = excluded.is_active;

insert into public.store_settings (
  id,
  store_name,
  whatsapp,
  phone,
  email,
  instagram,
  shipping_charge,
  free_shipping_threshold,
  bank_name,
  bank_account_title,
  bank_account_number,
  bank_iban
)
values (
  1,
  'DYT',
  '+92 300 0000000',
  '+92 300 0000000',
  'hello@doyourtee.com',
  'https://instagram.com/dyt',
  250,
  6000,
  'Configure in Admin',
  'DYT',
  'Configure in Admin',
  'Configure in Admin'
)
on conflict (id) do update set store_name = excluded.store_name;

update public.products
set
  material = coalesce(material, 'Premium combed cotton jersey'),
  fit = coalesce(
    fit,
    case
      when category_id = (select id from public.categories where slug = 'drop-shoulders' limit 1)
        then 'Relaxed drop-shoulder fit'
      else 'Comfortable regular fit'
    end
  );

update public.store_settings
set
  delivery_information = coalesce(delivery_information, 'Estimated delivery in 3-5 working days across Pakistan.'),
  exchange_information = coalesce(exchange_information, 'Exchange requests are accepted within 7 days for unworn items with original tags and packaging.')
where id = 1;

commit;
