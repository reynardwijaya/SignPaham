import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client using the service_role key — full database access,
// bypasses Row Level Security. NEVER import this file from a "use client"
// component or anything that ends up in the browser bundle.
//
// Created lazily (on first actual use) rather than at module load, so a
// missing env var only breaks the specific request that needs it instead of
// crashing the whole build during Next.js's page-data-collection step.
let cached: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase admin env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only, no NEXT_PUBLIC_ prefix on the latter)."
    );
  }

  cached = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return cached;
}

// Proxy so existing call sites (`supabaseAdmin.auth...`, `supabaseAdmin.from...`)
// keep working unchanged while the real client is only built on first access.
// Functions are bound to the real client (not the proxy) so supabase-js's
// internal `this` references keep working.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
