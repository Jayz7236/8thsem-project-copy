const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User"); 
const Forum = require("../models/Forum");
const Job = require("../models/Job");
const Event = require("../models/Event");
const Gallery = require("../models/Gallery");

// GET all alumni
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching alumni...");
    
    const alumni = await User.find({ role: "alumni" });

    if (!alumni.length) {
      console.log("❌ No alumni found.");
      return res.status(404).json({ message: "No alumni found" });
    }

    console.log("✅ Alumni fetched:", alumni);
    res.json(alumni);
  } catch (error) {
    console.error("🔥 Error fetching alumni:", error);
    res.status(500).json({ message: error.message });
  }
});
/// admin dashboard count api 
router.get("/counts", async (req, res) => {
  try {
    const alumniCount = await User.countDocuments({ role: "alumni" });
    const studentCount = await User.countDocuments({ role: "student" });
    const forumCount = await Forum.countDocuments();
    const jobCount = await Job.countDocuments();
    const eventCount = await Event.countDocuments();
    const galleryCount = await Gallery.countDocuments();

    res.status(200).json({
      alumniCount,
      studentCount,
      forumCount,
      jobCount,
      eventCount,
      galleryCount,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard counts:", error);
    res.status(500).json({ message: "Error fetching dashboard counts" });
  }
});

// GET a single alumnus by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Alumni ID" });
    }

    const alumnus = await User.findById(req.params.id).select(
      "name email graduationYear degree branch company jobTitle experience phoneNumber socialLinks avatar status"
    );

    if (!alumnus || alumnus.role !== "alumni") {
      return res.status(404).json({ message: "Alumnus not found" });
    }

    res.json(alumnus);
  } catch (error) {
    console.error("🔥 Error fetching alumnus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Approve Alumnus (PATCH)
router.patch("/:id/approve", async (req, res) => {
  try {
    const alumnus = await User.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );
    if (!alumnus) return res.status(404).json({ message: "Alumnus not found" });
    res.json(alumnus);
  } catch (err) {
    console.error("🔥 Error approving alumnus:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete Alumnus (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const alumnus = await User.findByIdAndDelete(req.params.id);
    if (!alumnus) return res.status(404).json({ message: "Alumnus not found" });
    res.json({ message: "Alumnus deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting alumnus:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
