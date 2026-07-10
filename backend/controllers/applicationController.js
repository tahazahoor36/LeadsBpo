// controllers/applicationController.js
// Handles public career / job application form submissions — saves to Supabase.

const Application = require("../models/Application");
const { sendNewApplicationEmail } = require("../utils/sendEmail");

/**
 * @desc    Submit a new career / job application
 * @route   POST /api/applications
 * @access  Public
 */
const createApplication = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      positionApplied,
      experience,
      message,
      resumeUrl,
    } = req.body;

    const application = await Application.create({
      fullName,
      email,
      phone,
      positionApplied,
      experience,
      message,
      resumeUrl,
    });

    // Send admin email notification (non-blocking)
    await sendNewApplicationEmail({
      fullName: application.full_name,
      email: application.email,
      phone: application.phone,
      positionApplied: application.position_applied,
      experience: application.experience,
      message: application.message,
      resumeUrl: application.resume_url,
      createdAt: application.created_at,
    });

    res.status(201).json({
      success: true,
      message:
        "Thank you for applying! Your application has been received. We will review it and get back to you soon.",
      data: {
        id: application.id,
        fullName: application.full_name,
        email: application.email,
        positionApplied: application.position_applied,
        status: application.status,
        createdAt: application.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createApplication };
