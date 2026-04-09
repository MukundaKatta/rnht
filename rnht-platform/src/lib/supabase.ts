import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// When env vars are missing (e.g. static builds), supabase is null.
// All consuming code should handle this gracefully.
const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Export typed as non-null for convenience; consumers that run during
// build (stores, pages) already catch errors via try/catch.
export const supabase = supabaseClient as NonNullable<typeof supabaseClient>;

export function getServiceSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return null as unknown as ReturnType<typeof createClient>;
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
