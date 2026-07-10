// middleware/errorMiddleware.js
// Central error handling middleware — catches all errors passed via next(err).

/**
 * 404 Not Found handler.
 * Triggered when no route matches the incoming request.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler.
 * Formats error responses consistently and avoids leaking stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  // If response headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Default to 500 if no status code was set, but avoid accidentally returning 200 for errors
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
    // Only expose the stack trace in development — never in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
