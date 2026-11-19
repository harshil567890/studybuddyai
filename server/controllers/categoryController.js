const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const CategoryDetails = await Category.create({ name, description });
    return res.status(200).json({ success: true, message: "Category created successfully", data: CategoryDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    let allCategories = await Category.find();
    if (allCategories.length === 0) {
      // Seed initial high-tech categories
      const defaults = [
        { name: "Artificial Intelligence & ML", description: "Deep learning, LLMs, Computer Vision" },
        { name: "Full-Stack Web Engineering", description: "React, Node, Next.js, Cloud Architectures" },
        { name: "Cloud Computing & DevOps", description: "Kubernetes, AWS, CI/CD Pipelines" },
        { name: "Data Science & Analytics", description: "Python, Big Data, Predictive Modeling" },
      ];
      allCategories = await Category.insertMany(defaults);
    }
    res.status(200).json({ success: true, data: allCategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const differentCategory = await Category.findOne({
      _id: { $ne: categoryId },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    const allCategories = await Category.find().populate({
      path: "courses",
      match: { status: "Published" },
      populate: { path: "instructor" },
    });

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
