const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getUserQuizzes,
  getQuizById,
  submitQuizAnswer,
  deleteQuiz,
} = require("../controllers/quizController");

router.get("/my-quizzes", auth, getUserQuizzes);
router.get("/:id", auth, getQuizById);
router.post("/submit", auth, submitQuizAnswer);
router.delete("/:id", auth, deleteQuiz);

module.exports = router;
