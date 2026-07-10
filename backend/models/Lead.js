// models/Lead.js
// Lead (consultation/contact) database operations using Supabase.

const { supabase } = require("../config/supabase");

const TABLE = "leads";

const Lead = {
  /**
   * Create a new lead record.
   */
  async create({ fullName, email, phone, companyName, serviceNeeded, message }) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        full_name: fullName,
        email: email.toLowerCase().trim(),
        phone,
        company_name: companyName || "",
        service_needed: serviceNeeded,
        message: message || "",
        status: "new",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all leads, sorted newest first, with optional status filter and pagination.
   */
  async findAll({ status, page = 1, limit = 20 } = {}) {
    let query = supabase
      .from(TABLE)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq("status", status);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, count };
  },

  /**
   * Get a single lead by ID.
   */
  async findById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  /**
   * Update lead status.
   */
  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a lead by ID.
   */
  async deleteById(id) {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * Count documents, optionally by status.
   */
  async count(status) {
    let query = supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true });

    if (status) query = query.eq("status", status);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },
};

module.exports = Lead;
