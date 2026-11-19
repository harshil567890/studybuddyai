const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  reviewCount: { type: Number, default: 0 },
  isStarred: { type: Boolean, default: false },
});

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      default: "Flashcard Set",
    },
    cards: [cardSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
