const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }

    const category = new Category({ categoryName });
    await category.save();

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Categories
exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const category = await Category.findByIdAndUpdate(id, { categoryName }, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
