// middleware/authMiddleware.js
// Protects admin routes by verifying the JWT token in the request headers.

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

/**
 * Middleware to protect admin-only routes.
 * Expects: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // findById returns admin without password (safe to attach to req)
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found. Token may be invalid.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = { protect };
