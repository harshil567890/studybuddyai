const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// generate reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: `This Email: ${email} is not registered with us`,
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const url = `${clientUrl}/update-password/${token}`;

    await mailSender(
      email,
      "Password Reset - StudyBuddy AI",
      `Your password reset link is: <a href="${url}">${url}</a>. Valid for 1 hour.`
    );

    res.json({
      success: true,
      message: "Email sent successfully, please check your email to continue",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: "Something went wrong while sending reset password email",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (confirmPassword && password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: "Token is expired, please regenerate your token",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword, token: null, resetPasswordExpires: null },
      { new: true }
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: "Some error occurred while updating the password",
    });
  }
};
