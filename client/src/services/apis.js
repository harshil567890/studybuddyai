const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
  GET_AI_ANALYTICS_API: BASE_URL + "/profile/getAIAnalytics",
};

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};

// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

// AI COPILOT & ARCHITECT ENDPOINTS
export const aiEndpoints = {
  SUMMARIZE_LECTURE_API: BASE_URL + "/ai/lecture/summarize",
  LECTURE_QUIZ_API: BASE_URL + "/ai/lecture/quiz",
  KEY_CONCEPTS_API: BASE_URL + "/ai/lecture/key-concepts",
  COPILOT_CHAT_API: BASE_URL + "/ai/copilot/chat",
  EXPLAIN_CONCEPT_API: BASE_URL + "/ai/explain",
  GET_CHAT_HISTORY_API: BASE_URL + "/ai/chat-history",
  COURSE_ARCHITECT_API: BASE_URL + "/ai/course-architect",
  STUDY_PLAN_API: BASE_URL + "/ai/study-plan",
};

// AI KNOWLEDGE STUDIO ENDPOINTS
export const studioEndpoints = {
  UPLOAD_DOCUMENT_API: BASE_URL + "/documents/upload",
  GET_USER_DOCUMENTS_API: BASE_URL + "/documents/my-documents",
  GET_DOCUMENT_API: BASE_URL + "/documents",
  GET_DOCUMENT_TEXT_API: BASE_URL + "/documents",
  RENAME_DOCUMENT_API: BASE_URL + "/documents",
  DELETE_DOCUMENT_API: BASE_URL + "/documents",
  GENERATE_FLASHCARDS_API: BASE_URL + "/ai/flashcards",
  GET_FLASHCARD_DECKS_API: BASE_URL + "/flashcards/my-decks",
  GET_FLASHCARD_DECK_API: BASE_URL + "/flashcards",
  CREATE_MANUAL_DECK_API: BASE_URL + "/flashcards/create-deck",
  ADD_MANUAL_CARD_API: BASE_URL + "/flashcards/add-card",
  TOGGLE_STAR_FLASHCARD_API: BASE_URL + "/flashcards/toggle-star",
  REVIEW_FLASHCARD_API: BASE_URL + "/flashcards/review",
  DELETE_FLASHCARD_SET_API: BASE_URL + "/flashcards",
  GENERATE_QUIZ_API: BASE_URL + "/ai/quiz",
  GET_USER_QUIZZES_API: BASE_URL + "/quizzes/my-quizzes",
  GET_QUIZ_API: BASE_URL + "/quizzes",
  SUBMIT_QUIZ_API: BASE_URL + "/quizzes/submit",
  DELETE_QUIZ_API: BASE_URL + "/quizzes",
  GET_ANALYTICS_API: BASE_URL + "/analytics/metrics",
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  GET_ADMIN_STATS_API: BASE_URL + "/admin/stats",
  GET_ALL_USERS_API: BASE_URL + "/admin/users",
  UPDATE_USER_ROLE_API: BASE_URL + "/admin/user/role",
  TOGGLE_USER_STATUS_API: BASE_URL + "/admin/user/status",
  DELETE_USER_API: BASE_URL + "/admin/user",
  GET_ADMIN_COURSES_API: BASE_URL + "/admin/courses",
  TOGGLE_COURSE_STATUS_API: BASE_URL + "/admin/course/status",
  CREATE_CATEGORY_API: BASE_URL + "/admin/category",
  UPDATE_CATEGORY_API: BASE_URL + "/admin/category",
  DELETE_CATEGORY_API: BASE_URL + "/admin/category",
};
