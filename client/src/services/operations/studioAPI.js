import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { studioEndpoints } from "../apis";
import {
  setDocuments,
  setFlashcardDecks,
  setQuizzes,
  setAnalytics,
  setStudioLoading,
} from "../../slices/studioSlice";

const {
  UPLOAD_DOCUMENT_API,
  GET_USER_DOCUMENTS_API,
  GET_DOCUMENT_TEXT_API,
  RENAME_DOCUMENT_API,
  DELETE_DOCUMENT_API,
  GENERATE_FLASHCARDS_API,
  GET_FLASHCARD_DECKS_API,
  CREATE_MANUAL_DECK_API,
  ADD_MANUAL_CARD_API,
  TOGGLE_STAR_FLASHCARD_API,
  REVIEW_FLASHCARD_API,
  DELETE_FLASHCARD_SET_API,
  GENERATE_QUIZ_API,
  GET_USER_QUIZZES_API,
  SUBMIT_QUIZ_API,
  DELETE_QUIZ_API,
  GET_ANALYTICS_API,
} = studioEndpoints;

export const fetchUserDocuments = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_USER_DOCUMENTS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setDocuments(response.data.data));
      }
    } catch (error) {
      console.log("FETCH_DOCUMENTS_ERROR", error);
    }
  };
};

export const fetchDocumentText = async (documentId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${GET_DOCUMENT_TEXT_API}/${documentId}/text`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("FETCH_DOCUMENT_TEXT_ERROR", error);
  }
  return null;
};

export const uploadDocument = (formData, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Analyzing & processing document with AI...");
    dispatch(setStudioLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        UPLOAD_DOCUMENT_API,
        formData,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      );
      if (response.data.success) {
        toast.success("Document processed successfully!");
        dispatch(fetchUserDocuments(token));
      }
    } catch (error) {
      console.log("UPLOAD_DOCUMENT_ERROR", error);
      toast.error(error?.response?.data?.message || "Failed to upload document");
    }
    dispatch(setStudioLoading(false));
    toast.dismiss(toastId);
  };
};

export const renameDocument = (documentId, title, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "PUT",
        `${RENAME_DOCUMENT_API}/${documentId}/rename`,
        { title },
        { Authorization: `Bearer ${token}` }
      );
      if (response.data.success) {
        toast.success("Document renamed");
        dispatch(fetchUserDocuments(token));
      }
    } catch (error) {
      toast.error("Failed to rename document");
    }
  };
};

export const deleteDocument = (documentId, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting document...");
    try {
      const response = await apiConnector(
        "DELETE",
        `${DELETE_DOCUMENT_API}/${documentId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (response.data.success) {
        toast.success("Document removed");
        dispatch(fetchUserDocuments(token));
      }
    } catch (error) {
      toast.error("Failed to delete document");
    }
    toast.dismiss(toastId);
  };
};

export const fetchFlashcardDecks = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_FLASHCARD_DECKS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setFlashcardDecks(response.data.data));
      }
    } catch (error) {
      console.log("FETCH_FLASHCARDS_ERROR", error);
    }
  };
};

export const generateFlashcards = (payload, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Generating AI Flashcards...");
    dispatch(setStudioLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        GENERATE_FLASHCARDS_API,
        payload,
        { Authorization: `Bearer ${token}` }
      );
      if (response.data.success) {
        toast.success("Flashcard deck generated!");
        dispatch(fetchFlashcardDecks(token));
        return response.data.data;
      }
    } catch (error) {
      toast.error("Could not generate flashcards");
    } finally {
      dispatch(setStudioLoading(false));
      toast.dismiss(toastId);
    }
    return null;
  };
};

export const createManualDeck = (title, cards, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "POST",
        CREATE_MANUAL_DECK_API,
        { title, cards },
        { Authorization: `Bearer ${token}` }
      );
      if (response.data.success) {
        toast.success("Custom deck created!");
        dispatch(fetchFlashcardDecks(token));
        return response.data.data;
      }
    } catch (error) {
      toast.error("Could not create deck");
    }
    return null;
  };
};

export const addManualCard = (deckId, question, answer, difficulty, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "POST",
        ADD_MANUAL_CARD_API,
        { deckId, question, answer, difficulty },
        { Authorization: `Bearer ${token}` }
      );
      if (response.data.success) {
        toast.success("Flashcard added!");
        dispatch(fetchFlashcardDecks(token));
        return response.data.data;
      }
    } catch (error) {
      toast.error("Could not add card");
    }
    return null;
  };
};

export const toggleStarFlashcard = (deckId, cardId, token) => {
  return async (dispatch) => {
    try {
      await apiConnector(
        "POST",
        TOGGLE_STAR_FLASHCARD_API,
        { deckId, cardId },
        { Authorization: `Bearer ${token}` }
      );
      dispatch(fetchFlashcardDecks(token));
    } catch (error) {
      console.log("STAR_CARD_ERROR", error);
    }
  };
};

export const reviewFlashcard = (deckId, cardId, knewAnswer, token) => {
  return async (dispatch) => {
    try {
      await apiConnector(
        "POST",
        REVIEW_FLASHCARD_API,
        { deckId, cardId, knewAnswer },
        { Authorization: `Bearer ${token}` }
      );
      dispatch(fetchFlashcardDecks(token));
    } catch (error) {
      console.log("REVIEW_CARD_ERROR", error);
    }
  };
};

export const deleteFlashcardDeck = (deckId, token) => {
  return async (dispatch) => {
    try {
      await apiConnector(
        "DELETE",
        `${DELETE_FLASHCARD_SET_API}/${deckId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Deck deleted");
      dispatch(fetchFlashcardDecks(token));
    } catch (error) {
      toast.error("Failed to delete deck");
    }
  };
};

export const fetchUserQuizzes = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_USER_QUIZZES_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setQuizzes(response.data.data));
      }
    } catch (error) {
      console.log("FETCH_QUIZZES_ERROR", error);
    }
  };
};

export const generateAIQuiz = (payload, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Synthesizing AI Quiz Questions...");
    dispatch(setStudioLoading(true));
    try {
      const response = await apiConnector("POST", GENERATE_QUIZ_API, payload, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        toast.success("AI Quiz created!");
        dispatch(fetchUserQuizzes(token));
        return response.data.data;
      }
    } catch (error) {
      toast.error("Failed to generate quiz");
    } finally {
      dispatch(setStudioLoading(false));
      toast.dismiss(toastId);
    }
    return null;
  };
};

export const submitQuiz = async (quizId, answers, token) => {
  const toastId = toast.loading("Submitting & Grading Quiz...");
  try {
    const response = await apiConnector(
      "POST",
      SUBMIT_QUIZ_API,
      { quizId, answers },
      { Authorization: `Bearer ${token}` }
    );
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success(`Scored: ${response.data.data.score}%`);
      return response.data.data;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Could not submit quiz");
  }
  return null;
};

export const deleteQuizById = (quizId, token) => {
  return async (dispatch) => {
    try {
      await apiConnector(
        "DELETE",
        `${DELETE_QUIZ_API}/${quizId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Quiz removed");
      dispatch(fetchUserQuizzes(token));
    } catch (error) {
      toast.error("Could not delete quiz");
    }
  };
};

export const fetchCognitiveAnalytics = (token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_ANALYTICS_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setAnalytics(response.data.data));
      }
    } catch (error) {
      console.log("FETCH_ANALYTICS_ERROR", error);
    }
  };
};
