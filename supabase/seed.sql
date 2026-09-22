insert into public.categories (name, slug, description, sort_order)
values
  ('T-Shirts', 't-shirts', 'Everyday DYT graphic tees.', 1),
  ('Oversized T-Shirts', 'oversized-t-shirts', 'Relaxed streetwear fits.', 2),
  ('Sleeveless', 'sleeveless', 'Summer-ready cuts.', 3),
  ('Long Sleeve', 'long-sleeve', 'Layered graphics and premium long sleeves.', 4),
  ('New Arrivals', 'new-arrivals', 'Latest drops from DYT.', 5)
on conflict (slug) do nothing;

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
