// controllers/leadController.js
// Handles public consultation/contact form submissions — saves to Supabase.

const Lead = require("../models/Lead");
const { sendNewLeadEmail } = require("../utils/sendEmail");

/**
 * @desc    Submit a new consultation / contact lead
 * @route   POST /api/leads
 * @access  Public
 */
const createLead = async (req, res, next) => {
  try {
    const { fullName, email, phone, companyName, serviceNeeded, message } = req.body;

    const lead = await Lead.create({
      fullName,
      email,
      phone,
      companyName,
      serviceNeeded,
      message,
    });

    // Send admin email notification (non-blocking)
    await sendNewLeadEmail({
      fullName: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.company_name,
      serviceNeeded: lead.service_needed,
      message: lead.message,
      createdAt: lead.created_at,
    });

    res.status(201).json({
      success: true,
      message:
        "Thank you! Your consultation request has been received. We will contact you within 24 hours.",
      data: {
        id: lead.id,
        fullName: lead.full_name,
        email: lead.email,
        status: lead.status,
        createdAt: lead.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead };
