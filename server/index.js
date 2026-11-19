const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// Import Route Handlers
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/course");
const paymentRoutes = require("./routes/payment");
const contactRoutes = require("./routes/contact");
const aiRoutes = require("./routes/ai");
const documentRoutes = require("./routes/document");
const quizRoutes = require("./routes/quiz");
const flashcardRoutes = require("./routes/flashcard");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/admin");

const os = require("os");

const PORT = process.env.PORT || 4000;

// Initialize Database & Cloud Services
database.connect();
cloudinaryConnect();

// Express Middlewares
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  })
);

// Serve uploaded documents statically if needed
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount Unified API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/flashcards", flashcardRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);

// System Health Check
app.get("/", (req, res) => {
  return res.json({
    success: true,
    platform: "StudyBuddy AI Enterprise Gateway",
    version: "2.0.0",
    status: "Operational",
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`StudyBuddy AI Server running on PORT ${PORT}`);
  });
}

module.exports = app;
