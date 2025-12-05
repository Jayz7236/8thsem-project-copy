const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");

const router = express.Router();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer errors (like size limit)
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Unknown errors (like invalid file type)
      return res.status(400).json({ error: err.message });
    }
    next(); // No error, proceed to next
  });
};
router.use("/uploads", express.static(uploadDir));

// Get All Gallery Images
router.get("/", async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    if (!galleries.length) {
      return res.json({ message: "No images found." });
    }
    return res.json(galleries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});
//  Upload Image to Gallery
router.post("/", uploadSingleImage, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const { description, uploader, uploaderName } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;

    if (!mongoose.Types.ObjectId.isValid(uploader)) {
      return res.status(400).json({ error: "Invalid uploader ID" });
    }

    const newPhoto = new Gallery({
      imageUrl: imagePath,
      description,
      uploadedBy: uploader,
      uploaderName: uploaderName || "Unknown",
    });

    await newPhoto.save();
    res.status(201).json({ message: "Image uploaded successfully", galleryItem: newPhoto });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

//  Get Gallery Image by ID (with image URL and description)
router.get("/:id", async (req, res) => {
  try {
    const galleryItems = await Gallery.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });
    if (!galleryItems.length) {
      return res.status(404).json({ message: "No images found." });
    }
    return res.status(200).json(galleryItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

//  Update Gallery Image
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { description, uploader, uploaderName,  } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;  

    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) return res.status(404).json({ error: "Image not found" });

    // Update image if new file is provided, otherwise keep old image
    if (imagePath) {
      const oldImagePath = path.join(__dirname, "..", galleryItem.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);  // Remove old image
      }
      galleryItem.imageUrl = imagePath;
    }

    // Update other fields
    galleryItem.description = description || galleryItem.description;
    galleryItem.uploaderName = uploaderName || galleryItem.uploaderName;

    await galleryItem.save();
    res.status(200).json({ message: "Gallery item updated successfully", galleryItem });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ Delete Gallery Image
router.delete("/:id", async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ error: "Image not found" });

    // Only delete from server if you are saving files locally
    const imagePath = path.join(__dirname, "..", photo.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await photo.deleteOne(); 
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

module.exports = router;
