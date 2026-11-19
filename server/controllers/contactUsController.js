const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;
  try {
    await mailSender(
      email,
      "Your Message Received - StudyBuddy AI",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    return res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};
