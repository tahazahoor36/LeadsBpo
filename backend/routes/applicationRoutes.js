// routes/applicationRoutes.js
// Public route for submitting career / job applications.

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { createApplication } = require("../controllers/applicationController");
const { validate } = require("../middleware/validateMiddleware");

// Validation rules for job application form submissions
const applicationValidation = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required.")
    .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters."),

  body("email")
    .trim()
    .notEmpty().withMessage("Email address is required.")
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required.")
    .isLength({ max: 20 }).withMessage("Phone number cannot exceed 20 characters."),

  body("positionApplied")
    .trim()
    .notEmpty().withMessage("Position applied for is required.")
    .isLength({ max: 150 }).withMessage("Position name cannot exceed 150 characters."),

  body("experience")
    .trim()
    .optional()
    .isLength({ max: 500 }).withMessage("Experience field cannot exceed 500 characters."),

  body("message")
    .trim()
    .optional()
    .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters."),

  body("resumeUrl")
    .trim()
    .optional()
    .isURL().withMessage("Resume URL must be a valid URL (e.g., a Google Drive link)."),
];

// POST /api/applications
router.post("/", applicationValidation, validate, createApplication);

module.exports = router;
