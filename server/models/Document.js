const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema({
  content: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  pageNumber: { type: Number, default: 0 },
});

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    chunks: [chunkSchema],
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
