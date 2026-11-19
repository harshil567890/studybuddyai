import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { aiEndpoints } from "../apis";
import {
  setLectureSummary,
  setLectureQuiz,
  addCopilotChatMessage,
  setCopilotChatMessages,
} from "../../slices/studioSlice";

const {
  SUMMARIZE_LECTURE_API,
  LECTURE_QUIZ_API,
  KEY_CONCEPTS_API,
  COPILOT_CHAT_API,
  GET_CHAT_HISTORY_API,
  COURSE_ARCHITECT_API,
  STUDY_PLAN_API,
} = aiEndpoints;

export const summarizeLecture = (lectureData, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("AI Copilot synthesizing lecture takeaways...");
    try {
      const response = await apiConnector("POST", SUMMARIZE_LECTURE_API, lectureData, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setLectureSummary(response.data.data.summary));
        toast.success("Lecture summarized!");
        return response.data.data.summary;
      }
    } catch (error) {
      toast.error("Could not summarize lecture");
    } finally {
      toast.dismiss(toastId);
    }
    return null;
  };
};

export const generateLectureQuiz = (lectureData, token) => {
  return async (dispatch) => {
    const toastId = toast.loading("Generating instant practice quiz...");
    try {
      const response = await apiConnector("POST", LECTURE_QUIZ_API, lectureData, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(setLectureQuiz(response.data.data));
        toast.success("Practice quiz ready!");
        return response.data.data;
      }
    } catch (error) {
      toast.error("Could not generate quiz");
    } finally {
      toast.dismiss(toastId);
    }
    return null;
  };
};

export const fetchKeyConcepts = async (lectureData, token) => {
  try {
    const response = await apiConnector("POST", KEY_CONCEPTS_API, lectureData, {
      Authorization: `Bearer ${token}`,
    });
    if (response.data.success) {
      return response.data.data;
    }
  } catch (error) {
    console.log("FETCH_KEY_CONCEPTS_ERROR", error);
  }
  return [];
};

export const sendCopilotMessage = (payload, token) => {
  return async (dispatch) => {
    dispatch(
      addCopilotChatMessage({
        role: "user",
        contents: payload.question,
        timestamp: new Date().toISOString(),
      })
    );

    try {
      const response = await apiConnector("POST", COPILOT_CHAT_API, payload, {
        Authorization: `Bearer ${token}`,
      });
      if (response.data.success) {
        dispatch(
          addCopilotChatMessage({
            role: "assistant",
            contents: response.data.data.answer,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (error) {
      dispatch(
        addCopilotChatMessage({
          role: "assistant",
          contents: "I ran into a temporary hiccup processing that question. Please try again!",
          timestamp: new Date().toISOString(),
        })
      );
    }
  };
};

export const fetchChatHistory = (params, token) => {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_CHAT_HISTORY_API, null, {
        Authorization: `Bearer ${token}`,
      }, params);
      if (response.data.success) {
        dispatch(setCopilotChatMessages(response.data.data));
      }
    } catch (error) {
      console.log("FETCH_CHAT_ERROR", error);
    }
  };
};

export const generateCourseCurriculumAI = async (payload, token) => {
  const toastId = toast.loading("AI Course Architect designing curriculum...");
  try {
    const response = await apiConnector("POST", COURSE_ARCHITECT_API, payload, {
      Authorization: `Bearer ${token}`,
    });
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success("Course architecture generated!");
      return response.data.data;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Could not generate curriculum");
  }
  return null;
};

export const generateStudyPlanAI = async (payload, token) => {
  const toastId = toast.loading("Creating 7-Day Mastery Roadmap...");
  try {
    const response = await apiConnector("POST", STUDY_PLAN_API, payload, {
      Authorization: `Bearer ${token}`,
    });
    toast.dismiss(toastId);
    if (response.data.success) {
      toast.success("Study plan generated!");
      return response.data.data;
    }
  } catch (error) {
    toast.dismiss(toastId);
    toast.error("Could not generate study plan");
  }
  return null;
};
