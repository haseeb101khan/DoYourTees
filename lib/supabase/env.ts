export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "");
}

export function hasSupabaseEnv() {
  return Boolean(getSupabaseUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasServiceRoleEnv() {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
