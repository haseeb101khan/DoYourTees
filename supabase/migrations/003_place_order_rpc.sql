create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_address text,
  p_city text,
  p_postal_code text,
  p_notes text,
  p_payment_method public.payment_method,
  p_items jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal integer := 0;
  v_shipping integer := 0;
  v_total integer := 0;
  v_free_shipping_threshold integer;
  v_item jsonb;
  v_variant public.product_variants%rowtype;
  v_product public.products%rowtype;
  v_quantity integer;
  v_unit_price integer;
  v_line_total integer;
  v_image_url text;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  select shipping_charge, free_shipping_threshold
  into v_shipping, v_free_shipping_threshold
  from public.store_settings
  where id = 1;

  v_shipping := coalesce(v_shipping, 0);

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity is null or v_quantity < 1 or v_quantity > 20 then
      raise exception 'Invalid quantity';
    end if;

    select *
    into v_variant
    from public.product_variants
    where id = (v_item->>'variantId')::uuid
    and is_active = true
    for update;

    if not found then
      raise exception 'Variant is unavailable';
    end if;

    if v_variant.stock < v_quantity then
      raise exception 'Insufficient stock for % / %', v_variant.color_name, v_variant.size;
    end if;

    select *
    into v_product
    from public.products
    where id = v_variant.product_id
    and is_active = true
    and archived_at is null;

    if not found then
      raise exception 'Product is unavailable';
    end if;

    v_unit_price := coalesce(v_product.sale_price, v_product.regular_price);
    v_subtotal := v_subtotal + (v_unit_price * v_quantity);
  end loop;

  if v_free_shipping_threshold is not null and v_subtotal >= v_free_shipping_threshold then
    v_shipping := 0;
  end if;

  v_total := v_subtotal + v_shipping;
  v_order_number := public.next_order_number();

  insert into public.orders (
    order_number,
    customer_name,
    customer_phone,
    customer_email,
    address,
    city,
    postal_code,
    notes,
    subtotal,
    shipping_charge,
    total,
    payment_method,
    payment_status,
    order_status
  )
  values (
    v_order_number,
    p_customer_name,
    p_customer_phone,
    nullif(p_customer_email, ''),
    p_address,
    p_city,
    nullif(p_postal_code, ''),
    nullif(p_notes, ''),
    v_subtotal,
    v_shipping,
    v_total,
    p_payment_method,
    'pending',
    'pending'
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;

    select *
    into v_variant
    from public.product_variants
    where id = (v_item->>'variantId')::uuid
    for update;

    select *
    into v_product
    from public.products
    where id = v_variant.product_id;

    select url
    into v_image_url
    from public.product_images
    where product_id = v_product.id
    order by sort_order asc
    limit 1;

    v_unit_price := coalesce(v_product.sale_price, v_product.regular_price);
    v_line_total := v_unit_price * v_quantity;

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      product_slug,
      image_url,
      color_name,
      size,
      unit_price,
      quantity,
      line_total
    )
    values (
      v_order_id,
      v_product.id,
      v_variant.id,
      v_product.name,
      v_product.slug,
      v_image_url,
      v_variant.color_name,
      v_variant.size,
      v_unit_price,
      v_quantity,
      v_line_total
    );

    update public.product_variants
    set stock = stock - v_quantity
    where id = v_variant.id;
  end loop;

  return v_order_number;
end;
$$;
