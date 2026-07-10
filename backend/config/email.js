// config/email.js
// Creates and exports the Nodemailer transporter instance.

const nodemailer = require("nodemailer");

// Create the transporter using Gmail SMTP.
// For other providers, update the 'service' field or use 'host'/'port' directly.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use an App Password if 2FA is enabled on Gmail
  },
});

/**
 * Verify the transporter connection on startup.
 * Logs a warning if credentials are missing or wrong.
 */
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email transporter is ready");
  } catch (error) {
    console.warn("⚠️  Email transporter not verified:", error.message);
    console.warn("   Email notifications will be disabled until this is fixed.");
  }
};

module.exports = { transporter, verifyEmailConnection };
