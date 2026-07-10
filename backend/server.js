// server.js
// Entry point for the Leads BPO backend API server (Supabase edition).

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { connectDB } = require("./config/supabase");
const { verifyEmailConnection } = require("./config/email");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ─────────────────────────────────────────────
// INITIALIZE APP
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// CONNECT TO SUPABASE & EMAIL
// ─────────────────────────────────────────────
connectDB();
verifyEmailConnection();

// ─────────────────────────────────────────────
// SECURITY MIDDLEWARE
// ─────────────────────────────────────────────

// Helmet sets secure HTTP headers (CSP disabled so external CDN scripts and media load correctly)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS — allow requests only from the frontend origin
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// General rate limiter — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

// Stricter limiter for public form submission endpoints (prevent spam)
const formSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions from this IP. Please try again after 1 hour.",
  },
});

// Stricter limiter for login endpoint (prevent brute-force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

app.use(generalLimiter);

// ─────────────────────────────────────────────
// BODY PARSING MIDDLEWARE
// ─────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─────────────────────────────────────────────
// HEALTH CHECK ROUTES
// ─────────────────────────────────────────────


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy.",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────
app.use("/api/auth", loginLimiter, authRoutes);
app.use("/api/leads", formSubmitLimiter, leadRoutes);
app.use("/api/applications", formSubmitLimiter, applicationRoutes);
app.use("/api/admin", adminRoutes);

// ─────────────────────────────────────────────
// SERVE STATIC FRONTEND
// ─────────────────────────────────────────────
const path = require("path");
// Serve the parent directory where index.html and assets are located
app.use(express.static(path.join(__dirname, "../")));

// Any route that isn't an API route should serve the index.html file
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api/")) {
    res.sendFile(path.join(__dirname, "../index.html"));
  } else {
    res.status(404).json({ success: false, message: "API endpoint not found" });
  }
});

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE (must be last)
// ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Leads BPO API (Supabase) running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}\n`);
});
