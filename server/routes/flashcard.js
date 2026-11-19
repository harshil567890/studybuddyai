const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getUserFlashcards,
  getFlashcardById,
  toggleStarCard,
  updateReviewCount,
  deleteFlashcardSet,
  createManualDeck,
  addManualCard,
} = require("../controllers/flashcardController");

router.get("/my-decks", auth, getUserFlashcards);
router.post("/create-deck", auth, createManualDeck);
router.post("/add-card", auth, addManualCard);
router.get("/:id", auth, getFlashcardById);
router.post("/toggle-star", auth, toggleStarCard);
router.post("/review", auth, updateReviewCount);
router.delete("/:id", auth, deleteFlashcardSet);

module.exports = router;
