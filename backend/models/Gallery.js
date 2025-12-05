const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true }, // Ensure consistent field naming (imageUrl, not imageURL)
    description: { type: String, trim: true, maxlength: 300 }, // Limit description length
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure only registered users (alumni) can upload
    },
    uploaderName: { type: String, required: true, trim: true }, // Store uploader's name for quick access
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
