# DYT Store

Full-stack Next.js ecommerce store for DYT (Do Your Tee), using Supabase for PostgreSQL, Auth, and Storage.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Create a Supabase project.
3. Run the SQL files in `supabase/migrations` in order.
4. Create public Storage buckets named `product-images` and `payment-proofs`.
5. Add the Supabase URL, anon key, and service role key to `.env.local`.
6. Install dependencies and run the app:

```bash
npm install
npm run dev
```

## First Admin

Create a user in Supabase Auth, then update their profile:

```sql
update profiles set role = 'admin' where id = '<auth-user-id>';
```

Admin portal: `/admin`.
