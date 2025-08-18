const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  completed: { type: Boolean, default: false },
  trashed: { type: Boolean, default: false } // Soft delete
});

module.exports = mongoose.model("Task", taskSchema);
