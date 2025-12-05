require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const API_URL = import.meta.env.VITE_API_URL;
const app = express();

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const jobRoutes = require("./routes/jobRoutes");
const forumRoutes = require("./routes/forumRoutes");

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173", // for development
  "https://8thsem-project-copy-123.vercel.app", // replace with your actual Vercel domain
  `${API_URL}
`
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
}));

// //  CORS Fix
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PATCH",  "PUT", "DELETE"],
// }));

//  Serve Static Files (Uploads)
app.use('/uploads', express.static('uploads'));

// ✅ MongoDB Connection with Retry Logic
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file!");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "alumniDB",
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    setTimeout(connectDB, 5000); // Retry connection after 5 sec
  }
};
connectDB();

// Define Routes in Correct Order
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/job", jobRoutes);
app.use("/api", forumRoutes);


//  Debugging Route for API Testing
app.get("/api/check", (req, res) => {
  res.json({ message: "API is working fine!" });
});

//  Protected Route Example
const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have access to this route", user: req.user });
});

//  Default Route
app.get("/", (req, res) => {
  res.send("Alumni Authentication API is running...");
});

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
