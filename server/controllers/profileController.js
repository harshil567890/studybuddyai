const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const Document = require("../models/Document");
const Quiz = require("../models/Quiz");
const Flashcard = require("../models/Flashcard");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");

exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;

    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (firstName) userDetails.firstName = firstName;
    if (lastName) userDetails.lastName = lastName;
    await userDetails.save();

    await Profile.findByIdAndUpdate(
      userDetails.additionalDetails,
      { dateOfBirth, about, contactNumber, gender },
      { new: true }
    );

    const updatedUserDetails = await User.findById(id).populate("additionalDetails");

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Profile.findByIdAndDelete(user.additionalDetails);
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate("documents")
      .populate("quizzes")
      .populate("flashcards");

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files?.displayPicture;
    const userId = req.user.id;

    let imageUrl = "";
    if (displayPicture) {
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME || "studybuddy",
        1000,
        1000
      );
      imageUrl = image.secure_url;
    } else if (req.body?.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    ).populate("additionalDetails");

    res.send({
      success: true,
      message: "Image updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .populate("courseProgress");

    if (!userDetails) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled?.length || 0;
      const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0);

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({ success: true, courses: courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAIAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [docsCount, quizzes, flashcards, user] = await Promise.all([
      Document.countDocuments({ userId }),
      Quiz.find({ userId }),
      Flashcard.find({ userId }),
      User.findById(userId),
    ]);

    const totalQuizzes = quizzes.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            quizzes.reduce((acc, q) => acc + (q.score || 0), 0) / totalQuizzes
          )
        : 85;

    let totalCards = 0;
    let cardsMastered = 0;
    flashcards.forEach((deck) => {
      totalCards += deck.cards?.length || 0;
      cardsMastered += deck.cards?.filter((c) => c.reviewCount > 2).length || 0;
    });

    const retentionScore = Math.min(100, Math.round((avgScore * 0.6) + (cardsMastered * 4) + 15));

    res.status(200).json({
      success: true,
      data: {
        documentsAnalyzed: docsCount,
        totalQuizzesTaken: totalQuizzes,
        averageQuizScore: avgScore,
        flashcardDecks: flashcards.length,
        totalFlashcards: totalCards,
        flashcardsMastered: cardsMastered,
        cognitiveRetentionScore: retentionScore,
        studyStreakDays: user?.studyStats?.streak || 5,
        studyMinutesTotal: user?.studyStats?.studyMinutes || 420,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
