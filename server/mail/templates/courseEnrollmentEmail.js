exports.courseEnrollmentEmail = (courseName, name) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Course Enrollment Confirmation - StudyBuddy AI</title>
    <style>
      body { background-color: #0b0f19; font-family: sans-serif; color: #e2e8f0; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; padding: 32px; background: #111827; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; }
      .brand { font-size: 24px; font-weight: 700; color: #8b5cf6; margin-bottom: 20px; }
      .highlight { color: #38bdf8; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="brand">StudyBuddy AI</div>
      <h2>Welcome to the course, ${name}!</h2>
      <p>You have successfully enrolled in <span class="highlight">${courseName}</span>.</p>
      <p>Log into your StudyBuddy AI dashboard to start streaming lectures, interact with the AI Lecture Copilot, and test your skills with dynamic quizzes.</p>
    </div>
  </body>
  </html>`;
};
