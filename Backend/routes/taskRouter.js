const express = require("express");
const {
  createTask,
  getAllTask,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", getAllTask);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/complete", completeTask); // <-- new

module.exports = router;
