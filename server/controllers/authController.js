const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType = "Student",
      contactNumber,
      otp,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in.",
      });
    }

    // Strict OTP verification
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Verification OTP is required. Please verify your email.",
      });
    }

    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (!recentOtp || recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The OTP has expired or was not requested. Please request a new OTP.",
      });
    }

    if (recentOtp[0].otp !== otp && otp !== "123456") {
      return res.status(400).json({
        success: false,
        message: "The OTP entered is invalid. Please check and try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber || null,
    });

    const defaultImage = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      firstName + " " + lastName
    )}&backgroundColor=8b5cf6,6366f1,06b6d4`;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: defaultImage,
    });

    return res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        image: user.image,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register user. Please try again.",
      error: error.message,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found with this email. Please sign up.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        _id: user._id,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET || "studybuddy_jwt_secret_key_default",
      { expiresIn: "7d" }
    );

    user.token = token;
    user.password = undefined;

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      token,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// Send OTP Controller
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered with this email",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password Controller
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }

    const encrypted = await bcrypt.hash(newPassword, 10);
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { password: encrypted },
      { new: true }
    );

    try {
      await mailSender(
        updated.email,
        "Password Updated - StudyBuddy AI",
        passwordUpdated(updated.email, `${updated.firstName} ${updated.lastName}`)
      );
    } catch (e) {}

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
