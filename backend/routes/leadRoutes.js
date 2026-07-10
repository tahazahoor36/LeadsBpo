// routes/leadRoutes.js
// Public route for submitting consultation / contact form leads.

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { createLead } = require("../controllers/leadController");
const { validate } = require("../middleware/validateMiddleware");

// Validation rules for lead form submissions
const leadValidation = [
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

  body("companyName")
    .trim()
    .optional()
    .isLength({ max: 150 }).withMessage("Company name cannot exceed 150 characters."),

  body("serviceNeeded")
    .trim()
    .notEmpty().withMessage("Please specify the service you need.")
    .isLength({ max: 150 }).withMessage("Service field cannot exceed 150 characters."),

  body("message")
    .trim()
    .optional()
    .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters."),
];

// POST /api/leads
router.post("/", leadValidation, validate, createLead);

module.exports = router;
