// scripts/seedAdmin.js
// Run this ONCE to create the first admin user in the Supabase database.
// Usage: npm run seed

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const Admin = require("../models/Admin");
const { connectDB } = require("../config/supabase");

const seedAdmin = async () => {
  try {
    console.log("🔄 Connecting to Supabase...");
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env file."
      );
      process.exit(1);
    }

    // Check if admin already exists (idempotent)
    const existing = await Admin.findByEmail(email);
    if (existing) {
      console.log(`⚠️  Admin already exists with email: ${email}`);
      console.log("   No changes were made.");
      process.exit(0);
    }

    // Create the admin — password is hashed inside Admin.create()
    const admin = await Admin.create({
      email,
      password,
      name: "Super Admin",
    });

    console.log("✅ Admin created successfully!");
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID:    ${admin.id}`);
    console.log("\n🔐 You can now log in at POST /api/auth/login");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
