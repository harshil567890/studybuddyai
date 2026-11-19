const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/courseController");

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/categoryController");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/sectionController");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSectionController");

const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/ratingAndReviewController");

const { updateCourseProgress } = require("../controllers/courseProgressController");

const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth");

// Course routes
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Category routes
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// Rating & Reviews
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
