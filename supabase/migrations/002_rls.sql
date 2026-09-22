alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.store_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Profiles are self readable" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Admins manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active categories" on public.categories
  for select using (is_active = true or public.is_admin());

create policy "Admins manage categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active products" on public.products
  for select using ((is_active = true and archived_at is null) or public.is_admin());

create policy "Admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads images for active products" on public.product_images
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.products
      where products.id = product_images.product_id
      and products.is_active = true
      and products.archived_at is null
    )
  );

create policy "Admins manage images" on public.product_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active variants" on public.product_variants
  for select using (
    public.is_admin()
    or (
      is_active = true
      and exists (
        select 1 from public.products
        where products.id = product_variants.product_id
        and products.is_active = true
        and products.archived_at is null
      )
    )
  );

create policy "Admins manage variants" on public.product_variants
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads settings" on public.store_settings
  for select using (true);

create policy "Admins update settings" on public.store_settings
  for update using (public.is_admin()) with check (public.is_admin());

create policy "Admins read orders" on public.orders
  for select using (public.is_admin());

create policy "Admins update orders" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "Admins read order items" on public.order_items
  for select using (public.is_admin());

create policy "Authenticated admins insert order items" on public.order_items
  for insert with check (public.is_admin());
