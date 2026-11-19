const Quiz = require("../models/Quiz");
const User = require("../models/User");

exports.getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .populate("documentId", "title")
      .populate("courseId", "courseName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ _id: id, userId: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    return res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitQuizAnswer = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findOne({ _id: quizId, userId: req.user.id });

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    let correctCount = 0;
    const evaluatedAnswers = quiz.questions.map((q, idx) => {
      const userSelected = answers ? answers[idx] : null;
      const isCorrect =
        userSelected &&
        userSelected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) correctCount++;

      return {
        questionIndex: idx,
        selectedAnswer: userSelected || "",
        isCorrect: !!isCorrect,
      };
    });

    const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100);

    quiz.userAnswers = evaluatedAnswers;
    quiz.score = scorePercentage;
    quiz.completed = true;
    await quiz.save();

    // Update user study stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { "studyStats.totalQuizzesTaken": 1 },
    });

    return res.status(200).json({
      success: true,
      data: {
        score: scorePercentage,
        correctCount,
        totalQuestions: quiz.questions.length,
        userAnswers: evaluatedAnswers,
      },
      message: "Quiz submitted and graded successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findOneAndDelete({ _id: id, userId: req.user.id });
    return res.status(200).json({ success: true, message: "Quiz deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

