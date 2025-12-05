const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//  Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//  Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

//  Serve uploaded images statically
router.use("/uploads", express.static(uploadDir));

/* -------------------------------------------
   ADMIN ROUTES
--------------------------------------------*/

//  Get Admin Profile
router.get("/admin/:id", async (req, res) => {
  try {
    const admin = await User.findById(req.params.id).select("-password");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  Update Admin Profile (name, avatar, password)
router.put("/admin/:id", upload.single("avatar"), async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (req.file) updateFields.avatar = `/uploads/${req.file.filename}`;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedAdmin) return res.status(404).json({ error: "Admin not found" });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  Update Admin Avatar only
router.put("/admin/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.avatar = `/uploads/${req.file.filename}`;
    await admin.save();

    res.json({ message: "Avatar updated", avatar: admin.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------
   GENERAL USER ROUTES (Alumni / Student)
--------------------------------------------*/

//  Get User Profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "alumni" && user.role !== "student") {
      return res.status(403).json({ message: "Access denied: Invalid role" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error.message);
    res.status(400).json({ message: "Invalid user ID format" });
  }
});

//  Update User Profile (name, phone, avatar path from frontend)
router.put("/:id", async (req, res) => {
  try {
    console.log("📩 Received Data:", req.body);

    const { email, role, avatar, ...updateData } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email)
      return res.status(403).json({ message: "Email cannot be changed" });

    if (role && role !== user.role)
      return res.status(403).json({ message: "Role cannot be changed" });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { ...updateData, avatar: avatar || user.avatar } },
      { new: true, runValidators: true }
    );

    console.log("✅ Updated User:", updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Update Error:", error.message);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

//  Upload Avatar via Multer
router.put("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    console.log("✅ Avatar Updated:", user.avatar);
    res.json({ message: "Avatar updated successfully!", avatar: user.avatar });
  } catch (error) {
    console.error("❌ Avatar Upload Error:", error.message);
    res.status(500).json({ message: "Error uploading avatar", error: error.message });
  }
});

//  Update User Password
router.put("/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
});

module.exports = router;
