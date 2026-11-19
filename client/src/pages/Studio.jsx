import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FileText,
  Layers,
  HelpCircle,
  BarChart3,
  Upload,
  Trash2,
  Star,
  Check,
  RotateCw,
  Award,
  Flame,
  BrainCircuit,
  Search,
  Edit2,
  Eye,
  Plus,
  Clock,
  Calendar,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchUserDocuments,
  uploadDocument,
  deleteDocument,
  renameDocument,
  fetchDocumentText,
  fetchFlashcardDecks,
  generateFlashcards,
  addManualCard,
  toggleStarFlashcard,
  reviewFlashcard,
  deleteFlashcardDeck,
  fetchUserQuizzes,
  generateAIQuiz,
  submitQuiz,
  deleteQuizById,
  fetchCognitiveAnalytics,
} from "../services/operations/studioAPI";
import { generateStudyPlanAI } from "../services/operations/aiCopilotAPI";

export default function Studio() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { documents, flashcardDecks, quizzes, analytics, loading } = useSelector(
    (state) => state.studio
  );

  const [activeTab, setActiveTab] = useState("documents"); // 'documents' | 'flashcards' | 'quizzes' | 'analytics'

  // Document states
  const [docFile, setDocFile] = useState(null);
  const [docTitle, setDocTitle] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [renameDocId, setRenameDocId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  // Study Plan Modal
  const [studyPlanModal, setStudyPlanModal] = useState(false);
  const [studyPlanData, setStudyPlanData] = useState(null);
  const [studyPlanLoading, setStudyPlanLoading] = useState(false);
  const [planTopic, setPlanTopic] = useState("");

  // Flashcard states
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardTopic, setFlashcardTopic] = useState("");
  const [manualCardModal, setManualCardModal] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardDiff, setCardDiff] = useState("Medium");
  const [deckSearch, setDeckSearch] = useState("");

  // Quiz Arena states
  const [quizTopic, setQuizTopic] = useState("");
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState("Intermediate");
  const [isTimedQuiz, setIsTimedQuiz] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserDocuments(token));
      dispatch(fetchFlashcardDecks(token));
      dispatch(fetchUserQuizzes(token));
      dispatch(fetchCognitiveAnalytics(token));
    }
  }, [dispatch, token]);

  // Set default selected deck if available, and keep synced with Redux store updates
  useEffect(() => {
    if (flashcardDecks?.length > 0) {
      if (!selectedDeck) {
        setSelectedDeck(flashcardDecks[0]);
      } else {
        const updated = flashcardDecks.find((d) => d._id === selectedDeck._id);
        if (updated) {
          setSelectedDeck(updated);
        }
      }
    }
  }, [flashcardDecks, selectedDeck?._id]);

  // Timed Quiz Countdown Timer
  useEffect(() => {
    let timer = null;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      toast("Time expired! Submitting your answers automatically.");
      handleSubmitActiveQuiz();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Upload Document
  const handleUploadDoc = (e) => {
    e.preventDefault();
    if (!docFile) return;
    const formData = new FormData();
    formData.append("file", docFile);
    if (docTitle) formData.append("title", docTitle);
    dispatch(uploadDocument(formData, token));
    setDocFile(null);
    setDocTitle("");
  };

  // Rename Document
  const handleRename = (e) => {
    e.preventDefault();
    if (!renameDocId || !newTitle.trim()) return;
    dispatch(renameDocument(renameDocId, newTitle.trim(), token));
    setRenameDocId(null);
    setNewTitle("");
  };

  // Open Document Text Preview
  const handlePreviewDoc = async (doc) => {
    setPreviewDoc(doc);
    setPreviewLoading(true);
    setPreviewText("");
    const textData = await fetchDocumentText(doc._id, token);
    if (textData) {
      setPreviewText(textData.extractedText || textData.text || "No previewable text extracted.");
    } else {
      setPreviewText("Document preview unavailable.");
    }
    setPreviewLoading(false);
  };

  // Generate Study Plan from Document or Topic
  const handleGenerateStudyPlan = async (topicTitle) => {
    setStudyPlanLoading(true);
    setStudyPlanModal(true);
    const plan = await generateStudyPlanAI(
      {
        topic: topicTitle || "Comprehensive Syllabus",
        targetExamDate: "In 30 Days",
        dailyHours: 2,
      },
      token
    );
    if (plan) {
      setStudyPlanData(plan);
    }
    setStudyPlanLoading(false);
  };

  // Create AI Deck
  const handleCreateDeck = (e) => {
    e.preventDefault();
    if (!flashcardTopic.trim()) return;
    dispatch(
      generateFlashcards(
        {
          topicText: flashcardTopic,
          title: flashcardTopic.slice(0, 24) + " Deck",
          count: 6,
        },
        token
      )
    );
    setFlashcardTopic("");
  };

  // Add Manual Card to Selected Deck
  const handleAddManualCardSubmit = (e) => {
    e.preventDefault();
    if (!selectedDeck || !cardFront.trim() || !cardBack.trim()) return;
    dispatch(
      addManualCard(
        selectedDeck._id,
        cardFront.trim(),
        cardBack.trim(),
        cardDiff,
        token
      )
    );
    setCardFront("");
    setCardBack("");
    setManualCardModal(false);
  };

  // Create AI Quiz
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;
    const newQuiz = await dispatch(
      generateAIQuiz(
        {
          topicText: `${quizTopic} (${quizDifficulty} level)`,
          title: quizTopic.slice(0, 24) + " Arena",
          numQuestions: Number(quizQuestionsCount),
        },
        token
      )
    );
    setQuizTopic("");
    if (newQuiz) {
      setSelectedQuiz(newQuiz);
      setQuizAnswers({});
      setQuizResult(null);
      if (isTimedQuiz) {
        setTimeLeft(quizQuestionsCount * 45); // 45s per question
        setTimerActive(true);
      }
    }
  };

  // Submit Active Quiz
  const handleSubmitActiveQuiz = async () => {
    if (!selectedQuiz) return;
    setTimerActive(false);
    const result = await submitQuiz(selectedQuiz._id, quizAnswers, token);
    if (result) {
      setQuizResult(result);
    }
  };

  // Filtered documents
  const filteredDocs = documents?.filter((d) =>
    d.title.toLowerCase().includes(docSearch.toLowerCase())
  );

  // Filtered decks
  const filteredDecks = flashcardDecks?.filter((d) =>
    d.title.toLowerCase().includes(deckSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                <BrainCircuit className="h-3.5 w-3.5" />
                AI Knowledge Studio
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Cognitive Learning Hub
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Transform textbooks, research notes, and topics into active recall systems.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 px-3 border-r border-slate-800">
              <Flame className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Streak</p>
                <p className="text-sm font-bold text-white">
                  {analytics?.streakDays || 7} Days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Award className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Retention</p>
                <p className="text-sm font-bold text-cyan-300">
                  {analytics?.cognitiveScore || 92}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex border-b border-slate-800/80 space-x-2 overflow-x-auto">
          {[
            { id: "documents", label: "Document Intelligence", icon: FileText },
            { id: "flashcards", label: "Flashcard Lab", icon: Layers },
            { id: "quizzes", label: "AI Quiz Arena", icon: HelpCircle },
            { id: "analytics", label: "Cognitive Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-xl shadow-sm"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded-t-xl"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DOCUMENT INTELLIGENCE */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Box */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-indigo-400" />
                  Upload Document
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload PDF or lecture notes to auto-extract active recall flashcards, practice quizzes, and full study plans.
                </p>

                <form onSubmit={handleUploadDoc} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 mb-1 block">
                      Document Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Distributed Systems Chapter 4"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition">
                    <input
                      type="file"
                      id="doc-upload"
                      accept=".pdf,.txt"
                      onChange={(e) => setDocFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label
                      htmlFor="doc-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FileText className="h-8 w-8 text-indigo-400/80" />
                      <span className="text-xs font-medium text-slate-300">
                        {docFile ? docFile.name : "Select PDF or Text file"}
                      </span>
                      <span className="text-[10px] text-slate-500">Up to 20MB</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!docFile || loading}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg disabled:opacity-50 transition hover:opacity-95"
                  >
                    {loading ? "Synthesizing with AI..." : "Synthesize with AI"}
                  </button>
                </form>
              </div>

              {/* Study Schedule Generator Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Adaptive Study Plan
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate an AI-structured milestone roadmap and timetable for any topic or target exam.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!planTopic.trim()) return;
                    handleGenerateStudyPlan(planTopic.trim());
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={planTopic}
                    onChange={(e) => setPlanTopic(e.target.value)}
                    placeholder="Enter topic (e.g. Distributed Systems & Raft)"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={!planTopic.trim() || studyPlanLoading}
                    className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate AI Timetable</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Document Library & Search */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Document Library</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({documents?.length || 0} Analyzed)
                  </span>
                </h3>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {filteredDocs?.length === 0 ? (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/20 p-12 text-center text-slate-400">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium">No documents match your query.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload syllabus or notes to build your AI knowledge base.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredDocs?.map((doc) => (
                    <div
                      key={doc._id}
                      className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-indigo-400 border border-indigo-500/20">
                            {doc.fileType}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setRenameDocId(doc._id);
                                setNewTitle(doc.title);
                              }}
                              className="text-slate-500 hover:text-slate-300 transition"
                              title="Rename Document"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handlePreviewDoc(doc)}
                              className="text-slate-500 hover:text-cyan-400 transition"
                              title="Preview Text"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => dispatch(deleteDocument(doc._id, token))}
                              className="text-slate-500 hover:text-rose-400 transition"
                              title="Delete Document"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="mt-3 font-semibold text-sm text-white line-clamp-1">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {(doc.fileSize / 1024).toFixed(1)} KB • {doc.chunks?.length || 1} chunks
                        </p>
                      </div>

                      {/* AI Extraction Toolkit */}
                      <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              dispatch(
                                generateFlashcards(
                                  { documentId: doc._id, count: 6 },
                                  token
                                )
                              );
                              setActiveTab("flashcards");
                            }}
                            className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-1.5 text-[11px] font-medium text-slate-200 transition"
                          >
                            Extract Cards
                          </button>
                          <button
                            onClick={() => {
                              dispatch(
                                generateAIQuiz(
                                  { documentId: doc._id, numQuestions: 5 },
                                  token
                                )
                              );
                              setActiveTab("quizzes");
                            }}
                            className="flex-1 rounded-xl bg-indigo-600/30 border border-indigo-500/40 hover:bg-indigo-600/50 py-1.5 text-[11px] font-medium text-indigo-200 transition"
                          >
                            Extract Quiz
                          </button>
                        </div>
                        <button
                          onClick={() => handleGenerateStudyPlan(doc.title)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 py-1.5 text-[11px] font-medium text-cyan-300 transition"
                        >
                          <Calendar className="h-3 w-3" />
                          <span>Generate 7-Day Study Plan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLASHCARD LAB */}
        {activeTab === "flashcards" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Deck List & Create */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Flashcard Creator
                  </h3>
                  {selectedDeck && (
                    <button
                      onClick={() => setManualCardModal(true)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Card</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateDeck} className="space-y-3">
                  <input
                    type="text"
                    value={flashcardTopic}
                    onChange={(e) => setFlashcardTopic(e.target.value)}
                    placeholder="Enter topic (e.g. Quantum Computing)"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition"
                  >
                    Generate Deck with AI
                  </button>
                </form>
              </div>

              {/* Decks Filter & List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Decks ({flashcardDecks?.length || 0})
                  </h4>
                </div>

                <input
                  type="text"
                  value={deckSearch}
                  onChange={(e) => setDeckSearch(e.target.value)}
                  placeholder="Filter decks..."
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                  {filteredDecks?.map((deck) => (
                    <div
                      key={deck._id}
                      onClick={() => {
                        setSelectedDeck(deck);
                        setCurrentCardIdx(0);
                        setIsFlipped(false);
                      }}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition ${
                        selectedDeck?._id === deck._id
                          ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md"
                          : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold truncate max-w-[200px]">
                          {deck.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(deleteFlashcardDeck(deck._id, token));
                          }}
                          className="text-slate-500 hover:text-rose-400"
                          title="Delete Deck"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{deck.cards?.length || 0} Cards</span>
                        <span className="text-emerald-400">
                          {deck.cards?.filter((c) => c.status === "Mastered").length || 0} Mastered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Flashcard Viewer */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center">
              {selectedDeck && selectedDeck.cards?.length > 0 ? (
                <div className="w-full max-w-xl space-y-6">
                  {/* Card Header & Counter */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">
                      Card {currentCardIdx + 1} of {selectedDeck.cards.length}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          toggleStarFlashcard(
                            selectedDeck._id,
                            selectedDeck.cards[currentCardIdx]._id,
                            token
                          )
                        )
                      }
                      className="flex items-center gap-1 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          selectedDeck.cards[currentCardIdx].isStarred
                            ? "fill-amber-400 text-amber-400"
                            : ""
                        }`}
                      />
                      <span>Starred</span>
                    </button>
                  </div>

                  {/* 3D Flip Card */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer relative h-72 w-full rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-8 border border-slate-700/60 shadow-2xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        {isFlipped ? "Answer" : "Question"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <RotateCw className="h-3 w-3" /> Click to flip
                      </span>
                    </div>

                    <div className="text-center my-auto px-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                        {isFlipped
                          ? selectedDeck.cards[currentCardIdx].answer
                          : selectedDeck.cards[currentCardIdx].question}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Difficulty: {selectedDeck.cards[currentCardIdx].difficulty || "Medium"}</span>
                      <span>Review count: {selectedDeck.cards[currentCardIdx].reviewCount || 0}</span>
                    </div>
                  </div>

                  {/* Spaced Repetition Grading */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        dispatch(
                          reviewFlashcard(
                            selectedDeck._id,
                            selectedDeck.cards[currentCardIdx]._id,
                            false,
                            token
                          )
                        );
                        setIsFlipped(false);
                        setCurrentCardIdx(
                          (prev) => (prev + 1) % selectedDeck.cards.length
                        );
                      }}
                      className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-300 transition"
                    >
                      <span>Needs Review</span>
                    </button>
                    <button
                      onClick={() => {
                        dispatch(
                          reviewFlashcard(
                            selectedDeck._id,
                            selectedDeck.cards[currentCardIdx]._id,
                            true,
                            token
                          )
                        );
                        setIsFlipped(false);
                        setCurrentCardIdx(
                          (prev) => (prev + 1) % selectedDeck.cards.length
                        );
                      }}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg transition"
                    >
                      <Check className="h-4 w-4" />
                      <span>I Mastered This</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/20 p-12 text-center text-slate-400">
                  <Layers className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium">No deck selected.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a deck or generate a new one from your topics!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AI QUIZ ARENA */}
        {activeTab === "quizzes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Creator & Past Quizzes */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Configure AI Arena
                </h3>
                <form onSubmit={handleCreateQuiz} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Target Topic
                    </label>
                    <input
                      type="text"
                      value={quizTopic}
                      onChange={(e) => setQuizTopic(e.target.value)}
                      placeholder="e.g. Next.js 14 Server Actions"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Questions
                      </label>
                      <select
                        value={quizQuestionsCount}
                        onChange={(e) => setQuizQuestionsCount(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="3">3 Questions</option>
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Difficulty
                      </label>
                      <select
                        value={quizDifficulty}
                        onChange={(e) => setQuizDifficulty(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Timed Mode Toggle */}
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-slate-300">Timed Mode</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isTimedQuiz}
                      onChange={(e) => setIsTimedQuiz(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-95"
                  >
                    Launch Arena
                  </button>
                </form>
              </div>

              {/* Past Quizzes List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Arena Records ({quizzes?.length || 0})
                </h4>
                <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
                  {quizzes?.map((quiz) => (
                    <div
                      key={quiz._id}
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setQuizAnswers({});
                        setQuizResult(null);
                        setTimerActive(false);
                      }}
                      className={`cursor-pointer rounded-2xl p-3.5 border transition ${
                        selectedQuiz?._id === quiz._id
                          ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md"
                          : "bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold truncate max-w-[200px]">
                          {quiz.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {quiz.completed && (
                            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                              {quiz.score}%
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteQuizById(quiz._id, token));
                            }}
                            className="text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {quiz.totalQuestions} Questions • {quiz.difficulty || "Standard"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Quiz Player */}
            <div className="lg:col-span-2">
              {selectedQuiz ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedQuiz.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Answer each question and evaluate instant reasoning.
                      </p>
                    </div>

                    {/* Timer / Grade pill */}
                    {timerActive && (
                      <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-mono font-bold text-rose-400">
                        <Clock className="h-3.5 w-3.5 animate-pulse" />
                        <span>
                          {Math.floor(timeLeft / 60)}:
                          {(timeLeft % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    )}

                    {quizResult && (
                      <div className="text-right">
                        <span className="text-xs text-slate-400">Accuracy: </span>
                        <span className="text-xl font-extrabold text-cyan-300">
                          {quizResult.score}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Question Cards */}
                  <div className="space-y-6">
                    {selectedQuiz.questions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-3">
                        <p className="text-sm font-semibold text-slate-100">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = quizAnswers[qIdx] === opt;
                            let style =
                              "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800";
                            if (quizResult) {
                              if (q.correctAnswer === opt)
                                style =
                                  "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium";
                              else if (isSelected)
                                style = "bg-rose-950/40 border-rose-500 text-rose-300";
                            } else if (isSelected) {
                              style =
                                "bg-indigo-600/30 border-indigo-500 text-white font-medium";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (!quizResult) {
                                    setQuizAnswers((prev) => ({
                                      ...prev,
                                      [qIdx]: opt,
                                    }));
                                  }
                                }}
                                className={`text-left rounded-xl p-3 text-xs border transition ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizResult && q.explanation && (
                          <div className="rounded-xl bg-slate-950/60 p-3 text-xs text-slate-400 border border-slate-800/60">
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizResult ? (
                    <button
                      onClick={handleSubmitActiveQuiz}
                      className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-xl hover:opacity-95 transition"
                    >
                      Submit Quiz & Evaluate
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizResult(null);
                        if (isTimedQuiz) {
                          setTimeLeft(selectedQuiz.questions.length * 45);
                          setTimerActive(true);
                        }
                      }}
                      className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-semibold text-slate-200 transition"
                    >
                      Retake Quiz
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-800/80 bg-slate-900/20 p-12 text-center text-slate-400">
                  <HelpCircle className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-medium">No quiz currently loaded.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select an arena from the left or generate a brand new one!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: COGNITIVE ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Documents Analyzed", val: analytics?.totalDocuments || 4, sub: "Synced to memory" },
                { label: "Quizzes Completed", val: analytics?.totalQuizzes || 8, sub: `Avg score: ${analytics?.averageQuizScore || 88}%` },
                { label: "Flashcards Mastered", val: analytics?.masteredFlashcards || 42, sub: "Spaced repetition" },
                { label: "Weekly Study Velocity", val: `${analytics?.studyHours || 9.2} hrs`, sub: "High retention band" },
              ].map((card, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">{card.label}</span>
                  <p className="text-2xl font-black text-white">{card.val}</p>
                  <p className="text-[11px] text-cyan-400">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Subject Mastery Radar */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white">Subject Mastery Radar</h3>
              <div className="space-y-4">
                {(
                  analytics?.subjectRadar || [
                    { subject: "System Architecture & Microservices", score: 94 },
                    { subject: "Advanced Algorithms & Optimization", score: 88 },
                    { subject: "Artificial Intelligence & LLM Integration", score: 96 },
                    { subject: "Database Indexing & Cloud Pipelines", score: 85 },
                  ]
                ).map((sub, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{sub.subject}</span>
                      <span className="text-cyan-400">{sub.score}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RENAME DOCUMENT MODAL */}
      {renameDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Rename Document</h3>
              <button
                onClick={() => setRenameDocId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameDocId(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-950 p-4 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {previewLoading ? "Extracting preview text..." : previewText}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL FLASHCARD CREATOR MODAL */}
      {manualCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Add Flashcard to {selectedDeck?.title}
              </h3>
              <button
                onClick={() => setManualCardModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualCardSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Question (Prompt / Concept)
                </label>
                <textarea
                  rows="2"
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  placeholder="e.g. What is the difference between TCP and UDP?"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Answer (Explanation / Formula)
                </label>
                <textarea
                  rows="3"
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  placeholder="e.g. TCP is connection-oriented and reliable; UDP is connectionless and lightweight."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={cardDiff}
                  onChange={(e) => setCardDiff(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualCardModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7-DAY STUDY PLAN MODAL */}
      {studyPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {studyPlanData?.planTitle || "Personalized 7-Day Roadmap"}
                </h3>
              </div>
              <button
                onClick={() => setStudyPlanModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {studyPlanLoading ? (
                <div className="p-8 text-center text-slate-400">
                  <RotateCw className="h-6 w-6 animate-spin mx-auto mb-2 text-cyan-400" />
                  <p className="text-xs">Generating study schedule milestones...</p>
                </div>
              ) : studyPlanData?.milestones ? (
                studyPlanData.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300">
                        {m.day || `Day ${idx + 1}`}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {m.estimatedMinutes || 60} mins
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">
                      {m.goal || m.title || `Day ${idx + 1} Milestone`}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {m.actions || (Array.isArray(m.goals) ? m.goals.join(" • ") : m.goal || "")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No plan generated yet.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStudyPlanModal(false)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
