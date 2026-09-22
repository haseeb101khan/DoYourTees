import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { CookieOptions } from "@supabase/ssr";
import { getSupabaseUrl } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl()!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server components cannot write cookies; middleware/actions can.
          }
        }
      }
    }
  );
}

export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl()!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
