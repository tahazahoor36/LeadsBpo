/**
 * supabase-config.js
 * ------------------
 * Supabase browser client configuration for Leads BPO.
 *
 * SECURITY NOTE:
 * The anon/public key below is intentionally public-facing.
 * It is safe to expose in browser code because:
 *   - It only allows operations permitted by Row Level Security (RLS) policies.
 *   - Anonymous visitors can only INSERT form submissions.
 *   - Anonymous visitors CANNOT read, update, or delete any records.
 *   - Admin access requires Supabase Auth sign-in + presence in admin_users table.
 *
 * NEVER put the service_role key, database password, JWT secret,
 * or any backend secrets in this file or any browser-loaded file.
 */

// ─────────────────────────────────────────────────────────────────
// CONFIGURATION — paste your values below
// ─────────────────────────────────────────────────────────────────

const SUPABASE_URL  = 'https://afcgwoxvgmlekeuxnmns.supabase.co';

// ↓ PASTE YOUR SUPABASE ANON/PUBLIC KEY HERE (from Supabase Dashboard → Settings → API)
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// ─────────────────────────────────────────────────────────────────
// Create and export the single reusable browser client
// ─────────────────────────────────────────────────────────────────

// Guard: warn clearly if the key has not been configured
if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn(
    '[Leads BPO] ⚠️  Supabase anon key is not configured.\n' +
    'Open supabase-config.js and replace YOUR_SUPABASE_ANON_KEY_HERE with your real key.\n' +
    'Find it at: Supabase Dashboard → Settings → API → Project API keys → anon / public'
  );
}

const { createClient } = supabase; // supabase global from CDN script
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
