const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  summarizeLecture,
  generateLectureQuiz,
  chatWithCopilot,
  explainConcept,
  getChatHistory,
  generateCourseCurriculum,
  extractKeyConcepts,
  generateStudyPlan,
} = require("../controllers/aiController");

router.post("/flashcards", auth, generateFlashcards);
router.post("/quiz", auth, generateQuiz);
router.post("/summary", auth, generateSummary);
router.post("/lecture/summarize", auth, summarizeLecture);
router.post("/lecture/quiz", auth, generateLectureQuiz);
router.post("/lecture/key-concepts", auth, extractKeyConcepts);
router.post("/copilot/chat", auth, chatWithCopilot);
router.post("/explain", auth, explainConcept);
router.get("/chat-history", auth, getChatHistory);
router.post("/course-architect", auth, generateCourseCurriculum);
router.post("/study-plan", auth, generateStudyPlan);

module.exports = router;
