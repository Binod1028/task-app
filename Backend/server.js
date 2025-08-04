const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "../Frontend")));

// ---- MongoDB Connection ----
mongoose.connect("mongodb://localhost:27017/TaskDB")
.then(() => console.log("Connected to TaskDB database"))
.catch(err => console.error("MongoDB connection error:", err));

// ---- Mongoose Schema & Model ----
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Task = mongoose.model("Task", taskSchema);

// ---- Routes ----

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new task (POST)
app.post("/api/tasks", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Task name required" });
  }

  try {
    const newTask = new Task({ name });
    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit existing task (PUT)
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Task name required" });
  }

  try {
    const task = await Task.findByIdAndUpdate(id, { name }, { new: true });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ---- Test DB connection ----
app.get("/api/test-db", (req, res) => {
  mongoose.connection.db.admin().ping((err, result) => {
    if (err) {
      res.status(500).json({ message: "MongoDB connection failed", error: err.message });
    } else {
      res.json({ message: "Connected to TaskDB database successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
