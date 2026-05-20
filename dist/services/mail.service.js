"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRsvpConfirmation = exports.sendContactConfirmation = exports.sendAdminRegistrationAlert = exports.sendCertificateIssued = exports.sendApplicationRejected = exports.sendApplicationEnrolled = exports.sendApplicationAccepted = exports.sendApplicationConfirmation = void 0;
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const send = async (options) => {
    try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": config_1.config.brevo.API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: config_1.config.brevo.FROM_NAME,
                    email: config_1.config.brevo.FROM,
                },
                to: [{ email: options.to }],
                subject: options.subject,
                htmlContent: options.html,
            }),
        });
        if (!res.ok) {
            console.error("Brevo email error", {
                status: res.status,
                body: await res.text(),
            });
            return false;
        }
        logger_1.logger.info(`Email sent to ${options.to}: ${options.subject}`);
        return true;
    }
    catch (error) {
        logger_1.logger.error(`Email failed to ${options.to}: ${error.message}`);
        // Don't throw — email failure should not break the request
        return false;
    }
};
const baseLayout = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 32px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: #0f172a; padding: 28px 32px; text-align: center; }
    .header h1 { color: #F97316; margin: 0; font-size: 20px; }
    .header p  { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; color: #334155; line-height: 1.6; }
    .body h2 { color: #0f172a; margin-top: 0; }
    .highlight { background: #fff7ed; border-left: 4px solid #F97316; padding: 14px 18px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .btn { display: inline-block; background: #F97316; color: white; padding: 12px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; margin: 16px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
    .ref { font-family: monospace; background: #f1f5f9; padding: 6px 12px; border-radius: 6px; font-size: 14px; color: #F97316; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Adele Empowerment Foundation</h1>
      <p>Skills Training · Empowerment · Opportunity</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>${config_1.config.foundation.NAME} &nbsp;|&nbsp; ${config_1.config.foundation.WEBSITE}</p>
      <p>This is an automated message. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>`;
// ── Application submitted ─────────────────────────────────────────────────────
const sendApplicationConfirmation = async (to, name, referenceNumber, programTitle, centerName) => {
    await send({
        to,
        subject: `Application Received — ${programTitle}`,
        html: baseLayout(`
      <h2>Application Received</h2>
      <p>Dear ${name},</p>
      <p>We have received your application for the <strong>${programTitle}</strong> program at our <strong>${centerName}</strong>.</p>
      <div class="highlight">
        <strong>Your Reference Number</strong><br>
        <span class="ref">${referenceNumber}</span>
        <p style="margin-top:8px;font-size:13px;color:#64748b">Save this — you'll need it to log in and check your status.</p>
      </div>
      <p>Our team will review your application and update your dashboard. This typically takes 3–5 business days.</p>
      <a href="${config_1.config.foundation.WEBSITE}/login" class="btn">Check Your Status</a>
      <p>Thank you for choosing Adele Empowerment Foundation.</p>
    `),
    });
};
exports.sendApplicationConfirmation = sendApplicationConfirmation;
// ── Application accepted ──────────────────────────────────────────────────────
const sendApplicationAccepted = async (to, name, programTitle, centerName, centerAddress, deadline) => {
    const deadlineStr = deadline.toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    await send({
        to,
        subject: `Congratulations — You've Been Accepted`,
        html: baseLayout(`
      <h2>🎉 You've Been Accepted!</h2>
      <p>Dear ${name},</p>
      <p>Congratulations! Your application for <strong>${programTitle}</strong> has been reviewed and accepted.</p>
      <div class="highlight">
        <strong>Action Required — Biometric Verification</strong>
        <p>To secure your slot, you must complete your biometric (fingerprint) verification at our training center by:</p>
        <p style="font-size:18px;font-weight:bold;color:#F97316;">${deadlineStr}</p>
        <p><strong>Center Address:</strong><br>${centerAddress}</p>
        <p style="font-size:13px;color:#64748b">Please bring a valid government-issued ID (NIN slip, National ID card, or International Passport).</p>
      </div>
      <p>⚠️ Failure to complete verification by this date will result in your slot being released.</p>
      <a href="${config_1.config.foundation.WEBSITE}/dashboard" class="btn">View Dashboard</a>
    `),
    });
};
exports.sendApplicationAccepted = sendApplicationAccepted;
// ── Application enrolled ──────────────────────────────────────────────────────
const sendApplicationEnrolled = async (to, name, programTitle, cohortName, startDate, centerName, centerAddress) => {
    const startStr = startDate.toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    await send({
        to,
        subject: `You're Enrolled — Training Begins Soon`,
        html: baseLayout(`
      <h2>Welcome to ${cohortName}!</h2>
      <p>Dear ${name},</p>
      <p>You are now officially enrolled in the <strong>${programTitle}</strong> program.</p>
      <div class="highlight">
        <strong>Training Details</strong><br>
        <p><strong>Program:</strong> ${programTitle}</p>
        <p><strong>Cohort:</strong> ${cohortName}</p>
        <p><strong>Start Date:</strong> ${startStr}</p>
        <p><strong>Center:</strong> ${centerName}</p>
        <p><strong>Address:</strong> ${centerAddress}</p>
      </div>
      <p>Please report to the center on your first day by <strong>8:00 AM</strong>. Bring a valid ID and a notepad.</p>
      <a href="${config_1.config.foundation.WEBSITE}/dashboard" class="btn">View Dashboard</a>
      <p>We look forward to seeing you!</p>
    `),
    });
};
exports.sendApplicationEnrolled = sendApplicationEnrolled;
// ── Application rejected ──────────────────────────────────────────────────────
const sendApplicationRejected = async (to, name, programTitle) => {
    await send({
        to,
        subject: `Application Update — ${programTitle}`,
        html: baseLayout(`
      <h2>Application Update</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your interest in our <strong>${programTitle}</strong> program.</p>
      <p>After careful review, we are unable to offer you a place in the current cohort. This may be due to high demand or limited availability.</p>
      <p>We encourage you to apply again when the next cohort opens. You can monitor announcements on your dashboard.</p>
      <a href="${config_1.config.foundation.WEBSITE}/dashboard" class="btn">View Dashboard</a>
      <p>We appreciate your interest in the Adele Empowerment Foundation.</p>
    `),
    });
};
exports.sendApplicationRejected = sendApplicationRejected;
// ── Certificate issued ────────────────────────────────────────────────────────
const sendCertificateIssued = async (to, name, programTitle, certId, pdfUrl, pdfBuffer) => {
    await send({
        to,
        subject: `Your Certificate — ${programTitle}`,
        html: baseLayout(`
      <h2>Congratulations, ${name}! 🎓</h2>
      <p>Your certificate for successfully completing the <strong>${programTitle}</strong> program has been issued.</p>
      <div class="highlight">
        <strong>Certificate ID</strong><br>
        <span class="ref">${certId}</span>
      </div>
      <p>Your certificate is attached to this email as a PDF. You can also download it and verify its authenticity at any time:</p>
      <a href="${pdfUrl}" class="btn">Download Certificate</a>
      <a href="${config_1.config.foundation.WEBSITE}/verify/${certId}" style="display:inline-block;margin-left:12px;color:#F97316;font-weight:bold;">Verify Online →</a>
      <p style="margin-top:24px;font-size:13px;color:#64748b">This certificate is a formal credential issued by the Adele Empowerment Foundation and can be verified by any employer using the link above.</p>
    `),
        attachments: [
            {
                filename: `Certificate-${certId}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    });
};
exports.sendCertificateIssued = sendCertificateIssued;
// ── New registration alert to admin ──────────────────────────────────────────
const sendAdminRegistrationAlert = async (adminEmail, applicantName, programTitle, centerName, refNumber) => {
    await send({
        to: adminEmail,
        subject: `New Application — ${applicantName} (${programTitle})`,
        html: baseLayout(`
      <h2>New Application Received</h2>
      <p>A new program application has been submitted.</p>
      <div class="highlight">
        <p><strong>Applicant:</strong> ${applicantName}</p>
        <p><strong>Program:</strong> ${programTitle}</p>
        <p><strong>Center:</strong> ${centerName}</p>
        <p><strong>Reference:</strong> <span class="ref">${refNumber}</span></p>
      </div>
      <a href="${config_1.config.app.ADMIN_URL}/programs/registrations" class="btn">Review Application</a>
    `),
    });
};
exports.sendAdminRegistrationAlert = sendAdminRegistrationAlert;
// ── Contact form confirmation ─────────────────────────────────────────────────
const sendContactConfirmation = async (to, name) => {
    await send({
        to,
        subject: "We received your message",
        html: baseLayout(`
      <h2>Message Received</h2>
      <p>Dear ${name},</p>
      <p>Thank you for contacting the Adele Empowerment Foundation. We have received your message and will get back to you within <strong>1–2 business days</strong>.</p>
      <p>In the meantime, you can explore our programs and latest news on our website.</p>
      <a href="${config_1.config.foundation.WEBSITE}" class="btn">Visit Our Website</a>
    `),
    });
};
exports.sendContactConfirmation = sendContactConfirmation;
// ── RSVP confirmation ─────────────────────────────────────────────────────────
const sendRsvpConfirmation = async (to, name, eventTitle, eventDate, eventTime, eventLocation, seats) => {
    await send({
        to,
        subject: `RSVP Confirmed — ${eventTitle}`,
        html: baseLayout(`
      <h2>RSVP Confirmed ✅</h2>
      <p>Dear ${name},</p>
      <p>Your RSVP for <strong>${eventTitle}</strong> has been confirmed.</p>
      <div class="highlight">
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>
        <p><strong>Seats reserved:</strong> ${seats}</p>
      </div>
      <p>We look forward to seeing you there!</p>
    `),
    });
};
exports.sendRsvpConfirmation = sendRsvpConfirmation;
//# sourceMappingURL=mail.service.js.map