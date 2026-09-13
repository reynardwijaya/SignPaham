import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Created lazily (on first actual use, e.g. inside a useEffect) rather than
// at module load, so a missing env var never crashes server-side prerendering
// of "use client" components — it only surfaces when something in the browser
// actually tries to talk to Supabase.
let cached: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  cached = createClient(supabaseUrl, supabaseAnonKey);
  return cached;
}

// Proxy so existing call sites (`supabase.auth...`, `supabase.from...`) keep
// working unchanged while the real client is only built on first access.
// Functions are bound to the real client (not the proxy) so supabase-js's
// internal `this` references keep working.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
