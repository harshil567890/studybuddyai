import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sparkles,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Send,
  CheckCircle2,
  XCircle,
  RotateCw,
  Zap,
  Copy,
  Layers,
  BrainCircuit,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  summarizeLecture,
  generateLectureQuiz,
  sendCopilotMessage,
  fetchKeyConcepts,
} from "../../../services/operations/aiCopilotAPI";
import { generateFlashcards } from "../../../services/operations/studioAPI";

export default function AILectureCopilot({ currentSection, currentSubSection, courseName }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { lectureCopilot } = useSelector((state) => state.studio);

  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'summary' | 'concepts' | 'quiz' | 'flashcards'
  const [chatInput, setChatInput] = useState("");
  const [summaryMode, setSummaryMode] = useState("takeaways"); // 'short' | 'detailed' | 'takeaways' | 'definitions'
  const [concepts, setConcepts] = useState([]);
  const [conceptsLoading, setConceptsLoading] = useState(false);

  // Quiz state
  const [numQuizQuestions, setNumQuizQuestions] = useState(5);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Flashcards state
  const [lectureDeck, setLectureDeck] = useState(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);

  const lectureTitle = currentSubSection?.title || "Active Lecture";
  const lectureDescription = currentSubSection?.description || "In-depth video module.";

  // Reset when lecture changes
  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setCardIdx(0);
    setIsCardFlipped(false);
  }, [currentSubSection?._id]);

  // Load Key Concepts when tab opened
  useEffect(() => {
    if (activeTab === "concepts" && concepts.length === 0) {
      loadConcepts();
    }
  }, [activeTab, currentSubSection?._id]);

  const loadConcepts = async () => {
    setConceptsLoading(true);
    const data = await fetchKeyConcepts(
      { lectureTitle, lectureDescription, courseTitle: courseName },
      token
    );
    if (data && data.length > 0) {
      setConcepts(data);
    }
    setConceptsLoading(false);
  };

  const handleGenerateSummary = () => {
    dispatch(
      summarizeLecture(
        {
          lectureTitle,
          lectureDescription,
          courseTitle: courseName,
        },
        token
      )
    );
  };

  const handleGenerateQuiz = (count) => {
    const qCount = count || numQuizQuestions;
    setSelectedAnswers({});
    setQuizSubmitted(false);
    dispatch(
      generateLectureQuiz(
        {
          lectureTitle,
          lectureDescription,
          numQuestions: qCount,
        },
        token
      )
    );
  };

  const handleGenerateLectureCards = async () => {
    setCardsLoading(true);
    const newDeck = await dispatch(
      generateFlashcards(
        {
          topicText: `${lectureTitle}. ${lectureDescription}`,
          title: `${lectureTitle} Quick Deck`,
          count: 5,
        },
        token
      )
    );
    if (newDeck) {
      setLectureDeck(newDeck);
      setCardIdx(0);
      setIsCardFlipped(false);
    }
    setCardsLoading(false);
  };

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    dispatch(
      sendCopilotMessage(
        {
          question: chatInput,
          lectureContext: `Lecture: ${lectureTitle}. Details: ${lectureDescription}. Course: ${courseName}`,
        },
        token
      )
    );
    setChatInput("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const calculateScore = () => {
    if (!lectureCopilot?.quiz?.questions) return 0;
    let correct = 0;
    lectureCopilot.quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });
    return Math.round((correct / lectureCopilot.quiz.questions.length) * 100);
  };

  return (
    <div className="flex h-full flex-col bg-slate-950/90 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3.5 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4 w-4 text-cyan-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Lecture Copilot
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.2 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
              {lectureTitle}
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline-block">
          Context-Aware
        </span>
      </div>

      {/* 5-Tab Navigation Bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-900/30 px-2 overflow-x-auto scrollbar-none">
        {[
          { id: "chat", label: "Ask AI", icon: MessageSquare },
          { id: "summary", label: "Summarize", icon: BookOpen },
          { id: "concepts", label: "Key Concepts", icon: BrainCircuit },
          { id: "quiz", label: "Quiz", icon: HelpCircle },
          { id: "flashcards", label: "Flashcards", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {/* 1. ASK AI TAB */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-full justify-between space-y-3">
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 p-3 text-xs text-indigo-200 flex items-center justify-between">
                <span>🎯 <b>Context Bound:</b> Answering queries specifically grounded in this video lecture.</span>
              </div>

              {lectureCopilot.chatMessages.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-4">
                  <MessageSquare className="h-10 w-10 text-slate-600 mx-auto" />
                  <p className="text-xs">
                    Need instant clarification on this lecture's topic or code?
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Explain the core concept simply",
                      "Provide a production code example",
                      "What are the common edge cases?",
                      "How does this connect to real-world architectures?",
                    ].map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => setChatInput(prompt)}
                        className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:text-white transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                lectureCopilot.chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.contents}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-800/80">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this lecture..."
                className="flex-1 rounded-xl bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-white hover:opacity-90 disabled:opacity-40 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* 2. SUMMARIZE TAB */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {[
                  { id: "takeaways", label: "Key Takeaways" },
                  { id: "detailed", label: "Detailed Notes" },
                  { id: "definitions", label: "Definitions" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSummaryMode(mode.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      summaryMode === mode.id
                        ? "bg-indigo-600 text-white font-semibold"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateSummary}
                className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
              >
                <Zap className="h-3.5 w-3.5" />
                {lectureCopilot.summary ? "Regenerate" : "Summarize Lecture"}
              </button>
            </div>

            {lectureCopilot.summary ? (
              <div className="rounded-2xl bg-slate-900/60 p-5 border border-slate-800 space-y-3 relative group">
                <button
                  onClick={() => copyToClipboard(lectureCopilot.summary)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Lecture Intelligence Brief
                </h4>
                <div className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                  {lectureCopilot.summary}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 space-y-3">
                <BookOpen className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Generate instant structured lecture takeaways, code patterns, and core principles.
                </p>
                <button
                  onClick={handleGenerateSummary}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                >
                  Synthesize Summary Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. KEY CONCEPTS TAB */}
        {activeTab === "concepts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Extracted Architectural Primitives
              </span>
              <button
                onClick={loadConcepts}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                Refresh Concepts
              </button>
            </div>

            {conceptsLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <div className="spinner mx-auto mb-3" />
                Extracting key concepts & code patterns...
              </div>
            ) : concepts.length > 0 ? (
              <div className="space-y-3">
                {concepts.map((concept, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{concept.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          concept.difficulty === "Easy"
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                            : concept.difficulty === "Hard"
                            ? "bg-rose-950/40 text-rose-400 border border-rose-500/30"
                            : "bg-amber-950/40 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {concept.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {concept.explanation}
                    </p>
                    {concept.example && (
                      <div className="rounded-xl bg-slate-950 p-2.5 font-mono text-[11px] text-cyan-300 border border-slate-800">
                        <pre className="overflow-x-auto">{concept.example}</pre>
                      </div>
                    )}
                    <p className="text-[11px] text-indigo-300 font-medium">
                      💡 <b>Takeaway:</b> {concept.keyTakeaway}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                <p className="text-xs">No key concepts loaded yet.</p>
                <button
                  onClick={loadConcepts}
                  className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition"
                >
                  Extract Concepts
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Knowledge Check
                </span>
                <select
                  value={numQuizQuestions}
                  onChange={(e) => setNumQuizQuestions(Number(e.target.value))}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-0.5 text-[11px] text-white focus:outline-none"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <button
                onClick={() => handleGenerateQuiz()}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                {lectureCopilot?.quiz ? "New Quiz" : "Generate Quiz"}
              </button>
            </div>

            {lectureCopilot?.quiz ? (
              <div className="space-y-4">
                {lectureCopilot.quiz.questions.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="rounded-2xl bg-slate-900/70 p-4 border border-slate-800 space-y-2.5"
                  >
                    <p className="text-xs font-bold text-slate-100">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === opt;
                        const isCorrect = q.correctAnswer === opt;
                        let btnStyle =
                          "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800";

                        if (quizSubmitted) {
                          if (isCorrect)
                            btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium";
                          else if (isSelected && !isCorrect)
                            btnStyle = "bg-rose-950/40 border-rose-500 text-rose-300";
                        } else if (isSelected) {
                          btnStyle = "bg-indigo-600/30 border-indigo-500 text-white font-medium";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setSelectedAnswers((prev) => ({ ...prev, [qIdx]: opt }));
                              }
                            }}
                            className={`w-full text-left rounded-xl p-2.5 text-xs border transition flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && q.explanation && (
                      <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      toast.success(`Scored: ${calculateScore()}%`);
                    }}
                    disabled={
                      Object.keys(selectedAnswers).length < lectureCopilot.quiz.questions.length
                    }
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition"
                  >
                    Submit & Evaluate
                  </button>
                ) : (
                  <div className="rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-3.5 text-center">
                    <span className="text-xs text-slate-300">Your Score: </span>
                    <span className="text-base font-extrabold text-cyan-300">
                      {calculateScore()}%
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Attempt recorded in Cognitive Analytics.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 space-y-3">
                <HelpCircle className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Reinforce comprehension by testing yourself immediately after watching.
                </p>
                <button
                  onClick={() => handleGenerateQuiz()}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                >
                  Generate Practice Check
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. FLASHCARDS TAB */}
        {activeTab === "flashcards" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Spaced Repetition Deck
              </span>
              <button
                onClick={handleGenerateLectureCards}
                className="text-xs font-semibold text-indigo-400 hover:underline"
              >
                {lectureDeck ? "Regenerate Deck" : "Create Deck"}
              </button>
            </div>

            {cardsLoading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                <div className="spinner mx-auto mb-3" />
                Generating educational flashcards...
              </div>
            ) : lectureDeck && lectureDeck.cards?.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Card {cardIdx + 1} of {lectureDeck.cards.length}</span>
                  <span className="text-[11px] text-cyan-400">Saved to Studio Decks</span>
                </div>

                {/* Flip Card */}
                <div
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="cursor-pointer relative h-48 w-full rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/50 p-6 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-400">
                    <span>{isCardFlipped ? "Answer" : "Question"}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <RotateCw className="h-3 w-3" /> Click to flip
                    </span>
                  </div>

                  <div className="text-center my-auto px-2">
                    <p className="text-sm font-semibold text-white leading-relaxed">
                      {isCardFlipped
                        ? lectureDeck.cards[cardIdx].answer
                        : lectureDeck.cards[cardIdx].question}
                    </p>
                  </div>

                  <div className="text-[10px] text-slate-500 text-right">
                    Difficulty: {lectureDeck.cards[cardIdx].difficulty}
                  </div>
                </div>

                {/* Navigation & Recall Feedback */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCardIdx((prev) => (prev + 1) % lectureDeck.cards.length);
                    }}
                    className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-300 transition"
                  >
                    Needs Review
                  </button>
                  <button
                    onClick={() => {
                      setIsCardFlipped(false);
                      setCardIdx((prev) => (prev + 1) % lectureDeck.cards.length);
                      toast.success("Card marked mastered!");
                    }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-xs font-bold text-white shadow-md transition"
                  >
                    I Know This
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400 space-y-3">
                <Layers className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-xs">
                  Generate interactive flashcards from this lecture to review later in your Study Studio.
                </p>
                <button
                  onClick={handleGenerateLectureCards}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                >
                  Generate Lecture Flashcards
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
