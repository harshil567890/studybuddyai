const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.log(`[Mail Mock] To: ${email} | Subject: ${title}`);
      console.log(`[Mail Notice] Real email was NOT sent because MAIL_USER and MAIL_PASS are not configured in .env.`);
      return { response: "Mock email delivered (no credentials configured)" };
    }

    const host = process.env.MAIL_HOST || "smtp.gmail.com";
    const isGmail = host.toLowerCase().includes("gmail");

    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: "gmail",
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          }
        : {
            host: host,
            port: process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_PORT == 465,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          }
    );

    let info = await transporter.sendMail({
      from: `"StudyBuddy AI" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(`[Mail Sent] Successfully delivered to ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("mailSender error:", error.message);
    if (error.code === "EAUTH") {
      console.error("[Mail Error] Authentication failed. If using Gmail, you MUST use a 16-character Google 'App Password' (not your normal Gmail password). Enable 2-Step Verification on Google Account -> App Passwords.");
    }
    return null;
  }
};

module.exports = mailSender;
