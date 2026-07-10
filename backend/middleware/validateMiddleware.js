// middleware/validateMiddleware.js
// Reads express-validator results and returns 400 if any validation errors exist.

const { validationResult } = require("express-validator");

/**
 * Call this middleware AFTER express-validator check() chains.
 * If validation fails, it immediately returns a 400 response with the error list.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed. Please check your input.",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next(); // No errors — proceed to the controller
};

module.exports = { validate };
