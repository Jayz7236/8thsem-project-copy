const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User"); // Ensure correct path

//  GET all students
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }); // Fetch only students
    console.log("Fetched Students:", students); // Debugging log
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a single student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select(
      "name email enrollmentNumber batch branch phoneNumber avatar status"
    );

    if (!student || student.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    // If avatar is stored as a relative path, prepend the base URL
    if (student.avatar) {
      student.avatar = `http://localhost:5000/${student.avatar}`;
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  Approve Student (PATCH)
router.patch("/:id/approve", async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Error approving student:", err);
    res.status(500).json({ message: err.message });
  }
});

//  Delete Student (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
