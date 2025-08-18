const mongoose = require("mongoose");
const Task = require("../models/taskModel");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { taskName, categoryId } = req.body;
    if (!taskName || !taskName.trim()) {
      return res.status(400).json({ success: false, message: "Task name required" });
    }

    const task = new Task({ taskName, categoryId: categoryId || null });
    await task.save();

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks
exports.getAllTask = async (req, res) => {
  try {
    const tasks = await Task.find(); // Filter in frontend
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, categoryId } = req.body;

    if (!taskName || !taskName.trim()) {
      return res.status(400).json({ success: false, message: "Task name required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { taskName, categoryId: categoryId || null },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndUpdate(id, { trashed: true }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task moved to trash" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as Completed
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findByIdAndUpdate(id, { completed: true }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
