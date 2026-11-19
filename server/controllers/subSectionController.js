const Section = require("../models/Section");
const SubSection = require("../models/Subsection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files?.video;

    if (!sectionId || !title || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let uploadDetails = {
      secure_url:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 300,
    };

    if (video) {
      uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME || "studybuddy"
      );
    }

    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration || 300}`,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({ success: false, message: "SubSection not found" });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    if (req.files && req.files.video) {
      const uploadDetails = await uploadImageToCloudinary(
        req.files.video,
        process.env.FOLDER_NAME || "studybuddy"
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration || 300}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.json({ success: true, data: updatedSection });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $pull: { subSection: subSectionId } }
    );
    await SubSection.findByIdAndDelete({ _id: subSectionId });

    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.json({ success: true, data: updatedSection, message: "SubSection deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};
