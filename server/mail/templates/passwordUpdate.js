exports.passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Password Update - StudyBuddy AI</title>
  </head>
  <body style="background-color: #0b0f19; font-family: sans-serif; color: #e2e8f0; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #111827; padding: 24px; border-radius: 8px;">
      <h2 style="color: #8b5cf6;">StudyBuddy AI Security Notice</h2>
      <p>Hello ${name || email},</p>
      <p>Your StudyBuddy AI account password was successfully updated.</p>
      <p>If you did not make this change, please reset your password immediately or contact our security team.</p>
    </div>
  </body>
  </html>`;
};
