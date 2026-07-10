// routes/adminRoutes.js
// All protected admin dashboard routes — require valid JWT.

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getDashboard,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/adminController");

// Apply the protect middleware to ALL routes in this router
router.use(protect);

// ── Dashboard ──────────────────────────────────────
// GET /api/admin/dashboard
router.get("/dashboard", getDashboard);

// ── Lead Routes ────────────────────────────────────
// GET    /api/admin/leads
router.get("/leads", getAllLeads);

// GET    /api/admin/leads/:id
router.get("/leads/:id", getLeadById);

// PATCH  /api/admin/leads/:id/status
router.patch("/leads/:id/status", updateLeadStatus);

// DELETE /api/admin/leads/:id
router.delete("/leads/:id", deleteLead);

// ── Application Routes ─────────────────────────────
// GET    /api/admin/applications
router.get("/applications", getAllApplications);

// GET    /api/admin/applications/:id
router.get("/applications/:id", getApplicationById);

// PATCH  /api/admin/applications/:id/status
router.patch("/applications/:id/status", updateApplicationStatus);

// DELETE /api/admin/applications/:id
router.delete("/applications/:id", deleteApplication);

module.exports = router;
