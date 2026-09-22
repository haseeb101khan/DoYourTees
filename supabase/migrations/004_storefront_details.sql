alter type public.payment_status add value if not exists 'pending_verification' after 'pending';

alter table public.products
  add column if not exists material text,
  add column if not exists fit text;

alter table public.store_settings
  add column if not exists delivery_information text,
  add column if not exists exchange_information text;

alter table public.orders
  add column if not exists confirmation_token uuid not null default gen_random_uuid();

create unique index if not exists orders_confirmation_token_idx
  on public.orders (confirmation_token);

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
