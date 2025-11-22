import { createClient } from '@supabase/supabase-js';

/**
 * Get Supabase admin client
 * Creates client lazily to avoid errors during build when env vars are not set
 */
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Server-side Supabase admin client
 * Use this ONLY in API routes and server-side code
 * This client bypasses Row Level Security (RLS) policies
 * NEVER expose the service role key to the client
 */
export const supabaseAdmin = new Proxy(
  {} as ReturnType<typeof getSupabaseAdmin>,
  {
    get(_target, prop) {
      const client = getSupabaseAdmin();
      const value = client[prop as keyof typeof client];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);
