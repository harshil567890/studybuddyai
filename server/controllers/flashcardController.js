const Flashcard = require("../models/Flashcard");
const User = require("../models/User");

exports.getUserFlashcards = async (req, res) => {
  try {
    const flashcardSets = await Flashcard.find({ userId: req.user.id })
      .populate("documentId", "title")
      .populate("courseId", "courseName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: flashcardSets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFlashcardById = async (req, res) => {
  try {
    const { id } = req.params;
    const flashcard = await Flashcard.findOne({ _id: id, userId: req.user.id });

    if (!flashcard) {
      return res.status(404).json({ success: false, message: "Flashcard deck not found" });
    }

    return res.status(200).json({ success: true, data: flashcard });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleStarCard = async (req, res) => {
  try {
    const { deckId, cardId } = req.body;
    const deck = await Flashcard.findOne({ _id: deckId, userId: req.user.id });

    if (!deck) {
      return res.status(404).json({ success: false, message: "Deck not found" });
    }

    const card = deck.cards.id(cardId);
    if (card) {
      card.isStarred = !card.isStarred;
      await deck.save();
    }

    return res.status(200).json({ success: true, data: deck });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReviewCount = async (req, res) => {
  try {
    const { deckId, cardId, knewAnswer } = req.body;
    const deck = await Flashcard.findOne({ _id: deckId, userId: req.user.id });

    if (!deck) {
      return res.status(404).json({ success: false, message: "Deck not found" });
    }

    const card = deck.cards.id(cardId);
    if (card) {
      card.reviewCount += 1;
      if (knewAnswer && card.difficulty === "hard") card.difficulty = "medium";
      else if (knewAnswer && card.difficulty === "medium") card.difficulty = "easy";
      await deck.save();

      await User.findByIdAndUpdate(req.user.id, {
        $inc: { "studyStats.flashcardsMastered": 1 },
      });
    }

    return res.status(200).json({ success: true, data: deck });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFlashcardSet = async (req, res) => {
  try {
    const { id } = req.params;
    await Flashcard.findOneAndDelete({ _id: id, userId: req.user.id });
    return res.status(200).json({ success: true, message: "Deck deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createManualDeck = async (req, res) => {
  try {
    const { title, cards = [] } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Deck title required" });
    }

    const deck = await Flashcard.create({
      userId: req.user.id,
      title: title.trim(),
      cards: cards.map((c) => ({
        question: c.question,
        answer: c.answer,
        difficulty: c.difficulty || "medium",
        reviewCount: 0,
        isStarred: false,
      })),
    });

    return res.status(201).json({ success: true, data: deck, message: "Deck created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addManualCard = async (req, res) => {
  try {
    const { deckId, question, answer, difficulty = "medium" } = req.body;
    if (!deckId || !question || !answer) {
      return res.status(400).json({ success: false, message: "Deck, question, and answer required" });
    }

    const deck = await Flashcard.findOne({ _id: deckId, userId: req.user.id });
    if (!deck) {
      return res.status(404).json({ success: false, message: "Deck not found" });
    }

    deck.cards.push({
      question: question.trim(),
      answer: answer.trim(),
      difficulty,
      reviewCount: 0,
      isStarred: false,
    });

    await deck.save();

    return res.status(200).json({ success: true, data: deck, message: "Card added" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

