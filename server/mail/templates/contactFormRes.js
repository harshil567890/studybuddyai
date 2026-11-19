exports.contactUsEmail = (
  email,
  firstname,
  lastname,
  message,
  phoneNo,
  countrycode
) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Contact Verification - StudyBuddy AI</title>
  </head>
  <body style="background-color: #0b0f19; font-family: sans-serif; color: #e2e8f0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #111827; padding: 24px; border-radius: 8px;">
      <h2 style="color: #8b5cf6;">StudyBuddy AI Support</h2>
      <p>Dear ${firstname} ${lastname},</p>
      <p>Thank you for contacting StudyBuddy AI. We have received your inquiry:</p>
      <blockquote style="background: rgba(255,255,255,0.05); padding: 12px; border-left: 3px solid #8b5cf6;">
        ${message}
      </blockquote>
      <p>Our academic support team will respond within 24 hours.</p>
    </div>
  </body>
  </html>`;
};
