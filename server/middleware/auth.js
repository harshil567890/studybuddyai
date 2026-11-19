const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    let token =
      req.cookies?.token ||
      req.body?.token ||
      (req.headers?.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "studybuddy_jwt_secret_key_default"
      );
      // Ensure both .id and ._id are present for compatibility
      decoded._id = decoded.id || decoded._id;
      decoded.id = decoded._id;
      req.user = decoded;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid or expired" });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating authentication token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails || userDetails.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User role cannot be verified" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails || userDetails.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admins",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User role cannot be verified" });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails || userDetails.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructors",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "User role cannot be verified" });
  }
};
