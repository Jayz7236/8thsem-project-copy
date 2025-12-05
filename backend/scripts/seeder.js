const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db"); // Import DB connection
const Job = require("../models/Job");
const Forum = require("../models/Forum");
const Event = require("../models/Event");
const Gallery = require("../models/Gallery");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Sample data
const importData = async () => {
    try {
      await Event.insertMany([
        { title: "Tech Conference", description: "A gathering of tech enthusiasts.", date: "2025-04-15", location: "New York" },
        { title: "Startup Meetup", description: "A networking event for startup founders.", date: "2025-05-10", location: "San Francisco" },
      ]);
  
      console.log("✅ Data Imported Successfully!");
      process.exit();
    } catch (error) {
      console.error("❌ Error Importing Data:", error);
      process.exit(1);
    }
  };
  
  
// Run the function
importData();
