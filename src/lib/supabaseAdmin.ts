import { createClient } from "@supabase/supabase-js";

// Server-only client using the service_role key — full database access,
// bypasses Row Level Security. NEVER import this file from a "use client"
// component or anything that ends up in the browser bundle.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "Supabase admin env vars are missing. Set SUPABASE_SERVICE_ROLE_KEY in .env.local (server-only, no NEXT_PUBLIC_ prefix)."
  );
}

export const supabaseAdmin = createClient(supabaseUrl ?? "", serviceRoleKey ?? "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
