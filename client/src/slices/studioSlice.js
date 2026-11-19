import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [],
  activeDocument: null,
  flashcardDecks: [],
  activeDeck: null,
  quizzes: [],
  activeQuiz: null,
  analytics: null,
  lectureCopilot: {
    isOpen: false,
    summary: "",
    quiz: null,
    chatMessages: [],
    loading: false,
  },
  loading: false,
};

const studioSlice = createSlice({
  name: "studio",
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    setActiveDocument: (state, action) => {
      state.activeDocument = action.payload;
    },
    setFlashcardDecks: (state, action) => {
      state.flashcardDecks = action.payload;
    },
    setActiveDeck: (state, action) => {
      state.activeDeck = action.payload;
    },
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setActiveQuiz: (state, action) => {
      state.activeQuiz = action.payload;
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setLectureCopilotOpen: (state, action) => {
      state.lectureCopilot.isOpen = action.payload;
    },
    setLectureSummary: (state, action) => {
      state.lectureCopilot.summary = action.payload;
    },
    setLectureQuiz: (state, action) => {
      state.lectureCopilot.quiz = action.payload;
    },
    addCopilotChatMessage: (state, action) => {
      state.lectureCopilot.chatMessages.push(action.payload);
    },
    setCopilotChatMessages: (state, action) => {
      state.lectureCopilot.chatMessages = action.payload;
    },
    setStudioLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setDocuments,
  setActiveDocument,
  setFlashcardDecks,
  setActiveDeck,
  setQuizzes,
  setActiveQuiz,
  setAnalytics,
  setLectureCopilotOpen,
  setLectureSummary,
  setLectureQuiz,
  addCopilotChatMessage,
  setCopilotChatMessages,
  setStudioLoading,
} = studioSlice.actions;

export default studioSlice.reducer;
