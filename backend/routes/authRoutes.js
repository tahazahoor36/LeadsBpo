// routes/authRoutes.js
// Authentication routes for admin login.

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const { loginAdmin, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// Validation rules for login
const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required.")
    .isEmail().withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
];

// POST /api/auth/login
router.post("/login", loginValidation, validate, loginAdmin);

// GET /api/auth/me  (protected — requires valid JWT)
router.get("/me", protect, getMe);

module.exports = router;
