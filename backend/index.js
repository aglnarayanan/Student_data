const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  // useNewUrlParser and useUnifiedTopology no longer needed in newer versions
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Schema + Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

// Get All Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Add a Student
app.post("/students", async (req, res) => {
  const { name, age, course } = req.body;
  try {
    const newStudent = new Student({ name, age, course });
    await newStudent.save();
    res.json({ message: "Student added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

// Update a Student
app.put("/students/:id", async (req, res) => {
  const { name, age, course } = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, course },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// Delete a Student
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
