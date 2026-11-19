const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Execute Gemini model generation with automatic model fallback & retry
 */
const safeGenerate = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server/.env. Please configure your key.");
  }

  const candidateModels = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
  let lastError = null;

  // 1. GoogleGenerativeAI SDK
  const client = getGenAI();
  if (client) {
    for (const modelName of candidateModels) {
      try {
        const model = client.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini SDK (${modelName}) notice: ${err.message}`);
      }
    }
  }

  // 2. Direct REST API fallback
  for (const modelName of candidateModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await res.json();
      if (data.error) {
        lastError = new Error(data.error.message || `API Error on ${modelName}`);
        continue;
      }
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (e) {
      lastError = e;
      console.warn(`Gemini REST (${modelName}) notice: ${e.message}`);
    }
  }

  throw new Error(`Google Gemini API generation failed: ${lastError ? lastError.message : "No response received"}`);
};

/**
 * Helper to clean and parse JSON from Gemini response
 */
const parseGeminiJson = (text) => {
  if (!text) return null;
  try {
    const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    const matchArray = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (matchArray) {
      try {
        return JSON.parse(matchArray[0]);
      } catch (e2) {}
    }
    const matchObj = text.match(/\{[\s\S]*\}/);
    if (matchObj) {
      try {
        return JSON.parse(matchObj[0]);
      } catch (e3) {}
    }
    return null;
  }
};

/**
 * Generate 100% Gemini flashcards from text or topic
 */
exports.generateFlashcards = async (text, count = 5) => {
  const targetCount = Math.max(1, parseInt(count) || 5);
  const prompt = `You are an elite academic tutor creating active recall flashcards.
Analyze the following study material and generate EXACTLY ${targetCount} distinct, high-yield flashcards.

STRICT RULES:
1. Every flashcard MUST test a distinct concept, term, definition, or mechanism directly from the study material.
2. The "question" MUST be a clear, concise question testing comprehension (STRICTLY under 25 words). NEVER paste whole paragraphs or large text blocks into the question.
3. The "answer" MUST be a concise, direct explanation (1-3 sentences).
4. "difficulty" must be "easy", "medium", or "hard".
5. Return ONLY a valid JSON array of objects with keys: "question", "answer", "difficulty".

Study Material:
${(text || "").substring(0, 15000)}`;

  const generated = await safeGenerate(prompt);
  const parsed = parseGeminiJson(generated);
  const list = Array.isArray(parsed) ? parsed : parsed?.flashcards || parsed?.cards || [];

  const flashcards = [];
  for (const item of list) {
    if (item.question && item.answer) {
      let q = String(item.question).trim().replace(/^[\d.)\s*#]+/, "");
      if (q.length > 180) {
        const sentence = q.split(/[.?!]\s/)[0];
        q = (sentence.length > 160 ? sentence.slice(0, 155) + "..." : sentence) + "?";
      }
      let a = String(item.answer).trim().replace(/^[\d.)\s*#]+/, "");
      if (a.length > 600) {
        a = a.slice(0, 590) + "...";
      }
      flashcards.push({
        question: q,
        answer: a,
        difficulty: (item.difficulty || "medium").toLowerCase(),
      });
    }
  }

  if (flashcards.length === 0) {
    throw new Error("Gemini AI did not return structured flashcards. Please try again with more specific material.");
  }

  return flashcards.slice(0, targetCount);
};

/**
 * Generate 100% Gemini multiple choice quiz questions
 */
exports.generateQuiz = async (text, numQuestions = 5) => {
  const targetCount = Math.max(1, parseInt(numQuestions) || 5);
  const prompt = `You are an expert exam creator.
Analyze the following study material and generate EXACTLY ${targetCount} multiple-choice questions.

STRICT RULES:
1. Every question MUST be based directly on the provided study material.
2. Provide exactly 4 options for each question.
3. "correctAnswer" must be the exact text of the correct option.
4. "explanation" must explain why that option is correct.
5. "difficulty" must be "easy", "medium", or "hard".
6. Return ONLY a valid JSON array of objects with keys: "question", "options" (array of 4 strings), "correctAnswer", "explanation", "difficulty".

Study Material:
${(text || "").substring(0, 15000)}`;

  const generated = await safeGenerate(prompt);
  const parsed = parseGeminiJson(generated);
  const list = Array.isArray(parsed) ? parsed : parsed?.questions || [];

  const questions = [];
  for (const item of list) {
    if (item.question && Array.isArray(item.options) && item.options.length >= 2) {
      const opts = item.options.map((o) => String(o).trim());
      while (opts.length < 4) {
        opts.push(`Alternative Option ${opts.length + 1}`);
      }
      const correct = String(item.correctAnswer || opts[0]).trim();
      questions.push({
        question: String(item.question).trim(),
        options: opts.slice(0, 4),
        correctAnswer: opts.includes(correct) ? correct : opts[0],
        explanation: String(item.explanation || "Derived directly from study content.").trim(),
        difficulty: (item.difficulty || "medium").toLowerCase(),
      });
    }
  }

  if (questions.length === 0) {
    throw new Error("Gemini AI did not return structured quiz questions. Please try again.");
  }

  return questions.slice(0, targetCount);
};

/**
 * Generate 100% Gemini concise summary
 */
exports.generateSummary = async (text) => {
  const prompt = `You are an expert academic tutor.
Provide a comprehensive, structured educational summary of the following content.
Include:
• Core Learning Objectives
• Key Concepts & Architecture
• Practical Application & Takeaways
Use clean formatting with bullet points and bold headers.

Content:
${(text || "").substring(0, 12000)}`;

  const generated = await safeGenerate(prompt);
  if (!generated) {
    throw new Error("Gemini AI was unable to generate summary.");
  }
  return generated;
};

/**
 * Extract 100% Gemini key concepts from lecture module
 */
exports.extractKeyConcepts = async (lectureTitle, lectureDescription, courseTitle) => {
  const prompt = `You are an elite technical educator.
Analyze this lecture module and extract 3 to 5 core technical concepts that a student must master.
Course: ${courseTitle || "Course"}
Lecture: ${lectureTitle || "Lecture Module"}
Description: ${lectureDescription || "Technical Overview"}

For each concept provide:
- "title": Concept name
- "difficulty": "Easy", "Medium", or "Hard"
- "explanation": Concise, clear technical explanation
- "example": Practical real-world code snippet or concrete example
- "keyTakeaway": Single critical insight

Return STRICTLY a JSON array of objects with keys: "title", "difficulty", "explanation", "example", "keyTakeaway".`;

  const generated = await safeGenerate(prompt);
  const parsed = parseGeminiJson(generated);
  const list = Array.isArray(parsed) ? parsed : parsed?.concepts || [];

  if (!list || list.length === 0) {
    throw new Error("Gemini AI was unable to extract key concepts.");
  }
  return list;
};

/**
 * 100% Gemini Universal Copilot Chat
 */
exports.chatWithContext = async (question, chunks) => {
  const context = (chunks || []).map((c) => c.content || c.text || "").filter(Boolean).join("\n\n");
  const prompt = `You are StudyBuddy AI, an intelligent, encouraging academic copilot.
Answer the student's question accurately, concisely, and educationally using the lesson context provided.

Lesson Context:
${context ? context.substring(0, 8000) : "No specific document context provided. Use verified academic principles."}

Student's Question:
${question}

Answer:`;

  const generated = await safeGenerate(prompt);
  if (!generated) {
    throw new Error("Gemini AI was unable to answer the question.");
  }
  return generated;
};

/**
 * 100% Gemini Concept Explanation
 */
exports.explainConcept = async (concept, context) => {
  const prompt = `You are an expert tutor explaining complex topics simply and memorably.
Explain the following concept thoroughly with an intuitive real-world analogy, step-by-step mechanism, and a practical application.

Concept: "${concept}"
Context: ${(context || "").substring(0, 4000)}

Explanation:`;

  const generated = await safeGenerate(prompt);
  if (!generated) {
    throw new Error("Gemini AI was unable to explain this concept.");
  }
  return generated;
};

/**
 * 100% Gemini Course Architect (Curriculum & Syllabus)
 */
exports.generateCourseCurriculum = async (topic, level = "All Levels", targetAudience = "Learners") => {
  const prompt = `You are a world-class curriculum architect.
Create a comprehensive, production-grade course architecture for: "${topic}".
Skill Level: ${level}
Target Audience: ${targetAudience}

Return STRICTLY a JSON object with this schema:
{
  "courseTitle": "${topic}: Complete Masterclass",
  "courseDescription": "A comprehensive 2-3 sentence overview.",
  "whatYouWillLearn": [
    "Outcome 1",
    "Outcome 2",
    "Outcome 3",
    "Outcome 4"
  ],
  "suggestedPrice": 499,
  "sections": [
    {
      "sectionName": "1. Foundations & Mental Models",
      "lectures": [
        { "title": "Lecture 1 Title", "description": "Lecture 1 description" },
        { "title": "Lecture 2 Title", "description": "Lecture 2 description" },
        { "title": "Lecture 3 Title", "description": "Lecture 3 description" }
      ]
    },
    {
      "sectionName": "2. Core Implementation & Production Patterns",
      "lectures": [
        { "title": "Lecture 4 Title", "description": "Lecture 4 description" },
        { "title": "Lecture 5 Title", "description": "Lecture 5 description" },
        { "title": "Lecture 6 Title", "description": "Lecture 6 description" }
      ]
    },
    {
      "sectionName": "3. Advanced Optimization & Flagship Capstone",
      "lectures": [
        { "title": "Lecture 7 Title", "description": "Lecture 7 description" },
        { "title": "Lecture 8 Title", "description": "Lecture 8 description" },
        { "title": "Lecture 9 Title", "description": "Lecture 9 description" }
      ]
    }
  ],
  "quizQuestions": [
    {
      "question": "Question on ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why Option A is correct"
    },
    {
      "question": "Second question on ${topic}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why Option A is correct"
    }
  ]
}`;

  const generated = await safeGenerate(prompt);
  const parsed = parseGeminiJson(generated);
  if (!parsed || !parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new Error("Gemini AI did not return a valid curriculum structure.");
  }
  return parsed;
};

/**
 * 100% Gemini Study Plan / Timetable
 */
exports.generateStudyPlan = async (topic, days = 7) => {
  const targetTopic = (topic || "Software Engineering").trim();
  const numDays = Math.max(1, Math.min(30, parseInt(days) || 7));

  const prompt = `You are an elite cognitive learning coach.
Create an adaptive ${numDays}-day study schedule and cognitive timetable for mastering: "${targetTopic}".
For each day, provide a structured milestone tailored to ${targetTopic}.

Return STRICTLY a JSON object with this schema:
{
  "planTitle": "${targetTopic} Mastery Roadmap",
  "milestones": [
    {
      "day": "Day 1",
      "dayNumber": 1,
      "estimatedMinutes": 60,
      "title": "Specific focus area for Day 1",
      "goal": "Clear learning objective for Day 1",
      "actions": "Actionable tasks: reading, practice, active recall",
      "goals": ["Specific goal 1", "Specific goal 2"]
    }
  ]
}`;

  const generated = await safeGenerate(prompt);
  const parsed = parseGeminiJson(generated);
  if (!parsed || !parsed.milestones || !Array.isArray(parsed.milestones) || parsed.milestones.length === 0) {
    throw new Error("Gemini AI did not return a valid study plan structure.");
  }
  return parsed;
};
