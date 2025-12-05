const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event.js");
const JoinedEvent = require("../models/JoinedEvents.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const User = require("../models/User.js");
// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
});

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});
const upload = multer({ storage });

//  Add event
router.post("/add-event", upload.single("image"), async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newEvent = new Event({ name, description, date, location, image });
    await newEvent.save();

    res.status(201).json({ message: "Event added successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Join Event
router.post("/join", authMiddleware, async (req, res) => {
  try {
    console.log("✅ Event Join API Called");

    // ✅ Log received token
    console.log("🔍 Received Token:", req.headers.authorization);

    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized: No token received" });
    }

    const { eventId } = req.body;
    const userId = req.user.id;

     //  User Details Fetch 
    console.log("🔹 User ID from token:", userId);
    console.log("🔹 Event ID:", eventId);

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const alreadyJoined = await JoinedEvent.findOne({ userId, eventId });
    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this event" });
    }

     //  User Details Fetch 
    const user = await User.findById(userId).select("name email role graduationYear phoneNumber");;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const event = await Event.findById(eventId).select("name date");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const joinedEvent = new JoinedEvent({
      userId,
      eventId,
      eventName: event.name,
      eventDate: event.date,
      name: user.name,
      email: user.email,
      role: user.role,
      graduationYear: user.graduationYear,
      phoneNumber: user.phoneNumber,
    });

    await joinedEvent.save();
    console.log("✅ Event joined successfully");

    res.status(201).json({ message: "Successfully joined event" });
  } catch (error) {
    console.error("🚨 Error joining event:", error);
    res.status(500).json({ message: "Error joining event", error });
  }
});
// Get joined events by a user
router.get("/joined-events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const joinedEvents = await JoinedEvent.find({ userId }).populate("eventId");
    res.status(200).json(joinedEvents);
  } catch (error) {
    console.error("Error fetching joined events:", error);
    res.status(500).json({ message: "Error fetching joined events", error });
  }
});

//  Leave Event
router.delete("/leave/:eventId", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // Extracted from token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }
    const deleted = await JoinedEvent.findOneAndDelete({ eventId, userId });

    if (!deleted) {
      return res.status(400).json({ message: "You haven't joined this event" });
    }

    res.status(200).json({ message: "Left event successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error leaving event", error });
  }
});

//  Get attendees for an event
router.get("/:eventId/attendees", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Fetch attendees based on eventId
    const attendees = await JoinedEvent.find({ eventId }).populate("userId", "name email");

    if (!attendees.length) {
      return res.status(404).json({ message: "No attendees found for this event" });
    }

    res.json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// Delete an event only admin 
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
});
module.exports = router;
