const Flashcard = require("../models/Flashcard");
const Quiz = require("../models/Quiz");
const Document = require("../models/Document");
const Course = require("../models/Course");
const SubSection = require("../models/Subsection");
const ChatHistory = require("../models/ChatHistory");
const geminiService = require("../utils/geminiService");
const { findRelevantChunks } = require("../utils/textChunker");

// Generate Flashcards
exports.generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 5, title, topicText } = req.body;
    let sourceText = topicText || "";

    let document = null;
    if (documentId) {
      document = await Document.findOne({
        _id: documentId,
        userId: req.user.id,
      });
      if (document) {
        sourceText = document.extractedText;
      }
    }

    if (!sourceText) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a documentId or topic text",
      });
    }

    const cards = await geminiService.generateFlashcards(sourceText, parseInt(count));

    const flashcardSet = await Flashcard.create({
      userId: req.user.id,
      documentId: document ? document._id : undefined,
      title: title || (document ? `${document.title} Deck` : "AI Study Deck"),
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || "medium",
        reviewCount: 0,
        isStarred: false,
      })),
    });

    return res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully",
    });
  } catch (error) {
    console.error("AI flashcards error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Quiz
exports.generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title, topicText, courseId } = req.body;
    let sourceText = topicText || "";

    let document = null;
    if (documentId) {
      document = await Document.findOne({
        _id: documentId,
        userId: req.user.id,
      });
      if (document) {
        sourceText = document.extractedText;
      }
    }

    if (!sourceText) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a documentId, courseId or topic text",
      });
    }

    const questions = await geminiService.generateQuiz(
      sourceText,
      parseInt(numQuestions)
    );

    const quiz = await Quiz.create({
      userId: req.user.id,
      documentId: document ? document._id : undefined,
      courseId: courseId || undefined,
      title: title || (document ? `${document.title} Quiz` : "AI Mastery Quiz"),
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    return res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz generated successfully",
    });
  } catch (error) {
    console.error("AI quiz error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Summary
exports.generateSummary = async (req, res, next) => {
  try {
    const { documentId, text } = req.body;
    let sourceText = text;

    if (documentId) {
      const doc = await Document.findOne({ _id: documentId, userId: req.user.id });
      if (doc) sourceText = doc.extractedText;
    }

    if (!sourceText) {
      return res.status(400).json({ success: false, message: "Provide documentId or text" });
    }

    const summary = await geminiService.generateSummary(sourceText);

    if (documentId) {
      await Document.findByIdAndUpdate(documentId, { summary });
    }

    return res.status(200).json({
      success: true,
      data: { summary },
      message: "Summary generated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lecture Copilot: Summarize Video / Lesson
exports.summarizeLecture = async (req, res) => {
  try {
    const { lectureTitle, lectureDescription, courseTitle } = req.body;

    const promptContext = `Course: ${courseTitle || "Advanced Technology"}\nLecture: ${
      lectureTitle || "Core Module"
    }\nOverview/Notes: ${lectureDescription || "Comprehensive lesson video stream."}`;

    const summary = await geminiService.generateSummary(promptContext);

    return res.status(200).json({
      success: true,
      data: {
        lectureTitle,
        summary,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Lecture Copilot: Generate Lecture Quiz
exports.generateLectureQuiz = async (req, res) => {
  try {
    const { lectureTitle, lectureDescription, courseId, numQuestions = 3 } = req.body;

    const promptContext = `Topic: ${lectureTitle}\nDetails: ${lectureDescription}`;
    const questions = await geminiService.generateQuiz(promptContext, parseInt(numQuestions));

    const quiz = await Quiz.create({
      userId: req.user.id,
      courseId: courseId || undefined,
      title: `${lectureTitle} Quick Check`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    return res.status(201).json({
      success: true,
      data: quiz,
      message: "Lecture quiz ready",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Universal Copilot Chat
exports.chatWithCopilot = async (req, res, next) => {
  try {
    const { question, documentId, courseId, lectureContext } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: "Provide a question" });
    }

    let relevantChunks = [];
    if (documentId) {
      const document = await Document.findOne({ _id: documentId, userId: req.user.id });
      if (document && document.chunks) {
        relevantChunks = findRelevantChunks(document.chunks, question, 3);
      }
    } else if (lectureContext) {
      relevantChunks = [{ content: lectureContext, chunkIndex: 0 }];
    }

    const answer = await geminiService.chatWithContext(question, relevantChunks);

    // Save to chat history if documentId or courseId present
    let history = await ChatHistory.findOne({
      userId: req.user.id,
      ...(documentId ? { documentId } : {}),
      ...(courseId ? { courseId } : {}),
    });

    if (!history) {
      history = await ChatHistory.create({
        userId: req.user.id,
        documentId,
        courseId,
        messages: [],
      });
    }

    history.messages.push(
      { role: "user", contents: question, timestamp: new Date() },
      { role: "assistant", contents: answer, timestamp: new Date() }
    );
    await history.save();

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        chatHistoryId: history._id,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Explain Concept
exports.explainConcept = async (req, res, next) => {
  try {
    const { concept, context = "" } = req.body;
    if (!concept) {
      return res.status(400).json({ success: false, message: "Provide concept" });
    }

    const explanation = await geminiService.explainConcept(concept, context);

    return res.status(200).json({
      success: true,
      data: { concept, explanation },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Chat History
exports.getChatHistory = async (req, res) => {
  try {
    const { documentId, courseId } = req.query;
    const history = await ChatHistory.findOne({
      userId: req.user.id,
      ...(documentId ? { documentId } : {}),
      ...(courseId ? { courseId } : {}),
    });

    return res.status(200).json({
      success: true,
      data: history?.messages || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// AI Course Architect (Curriculum & Syllabus Generator)
exports.generateCourseCurriculum = async (req, res) => {
  try {
    const { topic, level = "All Levels", targetAudience = "Software Engineers & Tech Learners" } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: "Please provide a course topic" });
    }

    const aiCurriculum = await geminiService.generateCourseCurriculum(topic, level, targetAudience);
    return res.status(200).json({
      success: true,
      data: aiCurriculum,
      message: "AI Course Architecture synthesized successfully with Gemini",
    });
  } catch (error) {
    console.error("Course curriculum error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate course curriculum from Gemini" });
  }
};

// Extract Key Concepts from Lecture
exports.extractKeyConcepts = async (req, res) => {
  try {
    const { lectureTitle, lectureDescription, courseTitle } = req.body;

    const aiConcepts = await geminiService.extractKeyConcepts(lectureTitle, lectureDescription, courseTitle);
    return res.status(200).json({
      success: true,
      data: aiConcepts,
      message: "Key concepts extracted successfully with Gemini",
    });
  } catch (error) {
    console.error("Extract key concepts error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to extract key concepts from Gemini" });
  }
};

// Generate Cognitive Study Plan / Timetable
exports.generateStudyPlan = async (req, res) => {
  try {
    const { topic, days = 7, duration, subject, goal } = req.body;
    const targetTopic = (topic || subject || goal || "Full-Stack Software Engineering").trim();
    const numDays = Math.max(1, Math.min(30, parseInt(days || duration) || 7));

    const aiPlan = await geminiService.generateStudyPlan(targetTopic, numDays);
    return res.status(200).json({
      success: true,
      data: {
        planTitle: aiPlan.planTitle || `${targetTopic} Mastery Roadmap`,
        planName: aiPlan.planTitle || `${targetTopic} Mastery Roadmap`,
        topic: targetTopic,
        totalDays: numDays,
        milestones: aiPlan.milestones.map((m, idx) => ({
          day: m.day || `Day ${idx + 1}`,
          dayNumber: m.dayNumber || idx + 1,
          estimatedMinutes: m.estimatedMinutes || 60,
          title: m.title || `Focus Area (Day ${idx + 1})`,
          goal: m.goal || `Mastery objective for Day ${idx + 1}`,
          actions: m.actions || "Review study concepts and practice active recall.",
          goals: Array.isArray(m.goals) ? m.goals : [m.goal || `Mastery of ${targetTopic}`],
        })),
      },
      message: "Study plan generated successfully with Gemini",
    });
  } catch (error) {
    console.error("Generate study plan error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to generate study plan from Gemini" });
  }
};
