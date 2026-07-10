// utils/sendEmail.js
// Helper function to send email notifications via Nodemailer.

const { transporter } = require("../config/email");

/**
 * Sends an email using the configured Nodemailer transporter.
 *
 * @param {Object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html    - HTML body content
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Leads BPO System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
  } catch (error) {
    // Log the error but do NOT throw — email failure should not break the main API response
    console.error("❌ Email sending failed:", error.message);
  }
};

/**
 * Builds and sends a "New Lead" notification email to the admin.
 * @param {Object} lead - The lead document from MongoDB
 */
const sendNewLeadEmail = async (lead) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #0A192F, #1B4DFF); padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎯 New Consultation Request</h1>
        <p style="color: #b9c7e4; margin: 8px 0 0;">Leads BPO - Admin Notification</p>
      </div>
      <div style="padding: 24px; background: #f7f9fb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d; width: 40%;">👤 Full Name:</td>
            <td style="padding: 10px; color: #191c1e;">${lead.fullName}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📧 Email:</td>
            <td style="padding: 10px; color: #191c1e;"><a href="mailto:${lead.email}" style="color: #1B4DFF;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📞 Phone:</td>
            <td style="padding: 10px; color: #191c1e;">${lead.phone}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d;">🏢 Company:</td>
            <td style="padding: 10px; color: #191c1e;">${lead.companyName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">🛠️ Service Needed:</td>
            <td style="padding: 10px; color: #191c1e;">${lead.serviceNeeded}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d; vertical-align: top;">💬 Message:</td>
            <td style="padding: 10px; color: #191c1e;">${lead.message || "No message provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">🕒 Submitted At:</td>
            <td style="padding: 10px; color: #191c1e;">${new Date(lead.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #75777e; font-size: 13px;">This is an automated notification from the Leads BPO website.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Consultation Request - Leads BPO",
    html,
  });
};

/**
 * Builds and sends a "New Job Application" notification email to the admin.
 * @param {Object} application - The application document from MongoDB
 */
const sendNewApplicationEmail = async (application) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #0A192F, #10B981); padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">💼 New Job Application</h1>
        <p style="color: #b9c7e4; margin: 8px 0 0;">Leads BPO - Admin Notification</p>
      </div>
      <div style="padding: 24px; background: #f7f9fb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d; width: 40%;">👤 Full Name:</td>
            <td style="padding: 10px; color: #191c1e;">${application.fullName}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📧 Email:</td>
            <td style="padding: 10px; color: #191c1e;"><a href="mailto:${application.email}" style="color: #10B981;">${application.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📞 Phone:</td>
            <td style="padding: 10px; color: #191c1e;">${application.phone}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d;">🎯 Position Applied:</td>
            <td style="padding: 10px; color: #191c1e;">${application.positionApplied}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📋 Experience:</td>
            <td style="padding: 10px; color: #191c1e;">${application.experience || "Not specified"}</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d; vertical-align: top;">💬 Message:</td>
            <td style="padding: 10px; color: #191c1e;">${application.message || "No message provided"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #44474d;">📄 Resume URL:</td>
            <td style="padding: 10px; color: #191c1e;">${
              application.resumeUrl
                ? `<a href="${application.resumeUrl}" style="color: #10B981;">View Resume</a>`
                : "Not provided"
            }</td>
          </tr>
          <tr style="background: #eceef0;">
            <td style="padding: 10px; font-weight: bold; color: #44474d;">🕒 Submitted At:</td>
            <td style="padding: 10px; color: #191c1e;">${new Date(application.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; text-align: center;">
          <p style="color: #75777e; font-size: 13px;">This is an automated notification from the Leads BPO website.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "New Job Application - Leads BPO",
    html,
  });
};

module.exports = { sendEmail, sendNewLeadEmail, sendNewApplicationEmail };
