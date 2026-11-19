const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>OTP Verification Email - StudyBuddy AI</title>
    <style>
      body {
        background-color: #0b0f19;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #e2e8f0;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 32px;
        background: #111827;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        text-align: center;
      }
      .brand {
        font-size: 26px;
        font-weight: 700;
        color: #8b5cf6;
        letter-spacing: -0.5px;
        margin-bottom: 24px;
      }
      .message {
        font-size: 18px;
        font-weight: 600;
        color: #f8fafc;
        margin-bottom: 16px;
      }
      .body {
        font-size: 15px;
        color: #94a3b8;
        margin-bottom: 24px;
      }
      .highlight {
        font-size: 32px;
        font-weight: 800;
        letter-spacing: 6px;
        color: #38bdf8;
        background: rgba(56, 189, 248, 0.1);
        padding: 12px 24px;
        border-radius: 8px;
        display: inline-block;
        margin: 16px 0;
      }
      .footer {
        font-size: 12px;
        color: #64748b;
        margin-top: 32px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">StudyBuddy AI</div>
      <div class="message">Verify Your Account</div>
      <div class="body">
        Thank you for joining StudyBuddy AI. Please use the following One-Time Password (OTP) to complete your verification. This code is valid for 5 minutes.
      </div>
      <div class="highlight">${otp}</div>
      <div class="body">
        If you did not request this verification, you can safely ignore this email.
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} StudyBuddy AI Ecosystem. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
};

module.exports = otpTemplate;
