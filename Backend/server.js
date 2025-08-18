const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const taskRoute = require("./routes/taskRouter");
const categoryRoute = require("./routes/categoryRouter");

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../Frontend")));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to TaskDB database"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

app.use("/api/tasks", taskRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
