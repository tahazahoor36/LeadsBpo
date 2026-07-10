// config/supabase.js
// Creates and exports the Supabase client using the service role key.
// The service role key bypasses Row Level Security (RLS) — keep it secret.

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // We manage our own JWT auth — disable Supabase Auth session persistence
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const connectDB = async () => {
  try {
    // Quick connectivity test — ping the admins table
    const { error } = await supabase.from("admins").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
      // PGRST116 = table empty — that's fine
      throw error;
    }
    console.log("✅ Supabase connected successfully");
  } catch (error) {
    console.error("❌ Supabase connection error:", error.message);
    console.error("   Check SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env");
    process.exit(1);
  }
};

module.exports = { supabase, connectDB };
