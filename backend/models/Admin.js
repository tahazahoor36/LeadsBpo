// models/Admin.js
// Admin database operations using Supabase (PostgreSQL).
// Passwords are still hashed with bcrypt before storage.

const { supabase } = require("../config/supabase");
const bcrypt = require("bcryptjs");

const TABLE = "admins";

const Admin = {
  /**
   * Find an admin by email address.
   * @param {string} email
   * @returns {Object|null} admin row or null
   */
  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  /**
   * Find an admin by their UUID.
   * @param {string} id
   * @returns {Object|null}
   */
  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, email, name, role, created_at")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  /**
   * Create a new admin, hashing the password before saving.
   * @param {{ email, password, name }} fields
   * @returns {Object} created admin row (without password)
   */
  async create({ email, password, name = "Admin" }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name,
        role: "admin",
      })
      .select("id, email, name, role, created_at")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Check if a plain-text password matches a stored hash.
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {boolean}
   */
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  /**
   * Check whether any admin already exists in the table.
   * @returns {boolean}
   */
  async exists() {
    const { count, error } = await supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return count > 0;
  },
};

module.exports = Admin;
