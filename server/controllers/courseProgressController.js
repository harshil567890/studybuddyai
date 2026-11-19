const SubSection = require("../models/Subsection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [subsectionId],
      });
      return res.status(200).json({ success: true, message: "Course progress initialized" });
    }

    const isAlreadyCompleted =
      courseProgress.completedVideos &&
      courseProgress.completedVideos.some(
        (id) => id.toString() === subsectionId.toString()
      );

    if (isAlreadyCompleted) {
      return res.status(200).json({ success: true, message: "Subsection already completed" });
    }

    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    return res.status(200).json({ success: true, message: "Course progress updated" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
