// controllers/adminController.js
// All protected admin dashboard endpoints using Supabase models.

const Lead = require("../models/Lead");
const Application = require("../models/Application");

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    // Run all count queries in parallel for best performance
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      closedLeads,
      totalApplications,
      newApplications,
      reviewedApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      Lead.count(),
      Lead.count("new"),
      Lead.count("contacted"),
      Lead.count("closed"),
      Application.count(),
      Application.count("new"),
      Application.count("reviewed"),
      Application.count("accepted"),
      Application.count("rejected"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          contacted: contactedLeads,
          closed: closedLeads,
        },
        applications: {
          total: totalApplications,
          new: newApplications,
          reviewed: reviewedApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────

const getAllLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { data, count } = await Lead.findAll({
      status,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const lead = await Lead.updateStatus(req.params.id, status);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }

    res.status(200).json({
      success: true,
      message: `Lead status updated to "${status}".`,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found." });
    }
    await Lead.deleteById(req.params.id);
    res.status(200).json({ success: true, message: "Lead deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────────

const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { data, count } = await Application.findAll({
      status,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "reviewed", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.updateStatus(req.params.id, status);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    res.status(200).json({
      success: true,
      message: `Application status updated to "${status}".`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }
    await Application.deleteById(req.params.id);
    res.status(200).json({ success: true, message: "Application deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
