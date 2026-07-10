// controllers/authController.js
// Handles admin login and JWT token generation using Supabase.

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * Generate a signed JWT token for a given admin ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * @desc    Admin Login
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Fetch admin with password (findById strips it for security)
    const admin = await Admin.findByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    const isMatch = await Admin.comparePassword(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: generateToken(admin.id),
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      id: req.admin.id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

module.exports = { loginAdmin, getMe };
