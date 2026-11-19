const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getAllCoursesAdmin,
  toggleCoursePublishStatus,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminController");

// Protect all admin endpoints
router.use(auth);
router.use(isAdmin);

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.put("/user/role", updateUserRole);
router.put("/user/status", toggleUserStatus);
router.delete("/user/:userId", deleteUser);

router.get("/courses", getAllCoursesAdmin);
router.put("/course/status", toggleCoursePublishStatus);

router.post("/category", createCategory);
router.put("/category", updateCategory);
router.delete("/category/:categoryId", deleteCategory);

module.exports = router;
