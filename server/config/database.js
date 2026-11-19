const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/studybuddyai";

exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully: StudyBuddy AI"))
    .catch((err) => {
      console.error("Database connection warning/error:", err.message);
    });
};
