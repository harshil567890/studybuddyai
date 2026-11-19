const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
const RatingAndReview = require("../models/RatingandReview");

// Get Global Platform Analytics
exports.getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, categories, reviews] = await Promise.all([
      User.find({}),
      Course.find({}),
      Category.find({}),
      RatingAndReview.find({}),
    ]);

    const totalStudents = totalUsers.filter((u) => u.accountType === "Student").length;
    const totalInstructors = totalUsers.filter((u) => u.accountType === "Instructor").length;
    const totalAdmins = totalUsers.filter((u) => u.accountType === "Admin").length;

    const publishedCourses = totalCourses.filter((c) => c.status === "Published").length;
    const draftCourses = totalCourses.filter((c) => c.status === "Draft").length;

    let totalRevenue = 0;
    totalCourses.forEach((c) => {
      const enrollments = c.studentsEnrolled?.length || 0;
      totalRevenue += enrollments * (c.price || 0);
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers.length,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses: totalCourses.length,
        publishedCourses,
        draftCourses,
        totalCategories: categories.length,
        totalReviews: reviews.length,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users with Search
exports.getAllUsers = async (req, res) => {
  try {
    const { search = "", role = "" } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["Student", "Instructor", "Admin"].includes(role)) {
      query.accountType = role;
    }

    const users = await User.find(query)
      .select("-password")
      .populate("additionalDetails")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    if (!["Student", "Instructor", "Admin"].includes(newRole)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accountType: newRole },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: `User role updated to ${newRole}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle User Status (Active / Inactive)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const nextActive = user.active !== false ? false : true;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { active: nextActive },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `User status changed to ${updatedUser.active ? "Active" : "Suspended"}`,
      active: updatedUser.active,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Courses Admin
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { search = "" } = req.query;
    let query = {};
    if (search) {
      query.courseName = { $regex: search, $options: "i" };
    }

    const courses = await Course.find(query)
      .populate({ path: "instructor", select: "firstName lastName email" })
      .populate("category")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Course Publish Status
exports.toggleCoursePublishStatus = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.status = course.status === "Published" ? "Draft" : "Published";
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course status changed to ${course.status}`,
      status: course.status,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Category Management
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }
    const category = await Category.create({ name, description });
    return res.status(201).json({ success: true, data: category, message: "Category created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId, name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );
    return res.status(200).json({ success: true, data: updated, message: "Category updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await Category.findByIdAndDelete(categoryId);
    return res.status(200).json({ success: true, message: "Category removed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
