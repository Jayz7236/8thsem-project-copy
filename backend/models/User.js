const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  phoneNumber: { type: String, default: " N/A " },
  enrollmentNumber: { type: String , default: ""}, // Only for students
  degree: { type: String },
  branch: { type: String,default: "" },
  graduationYear: { type: String , default: null},
  skills: [{ type: String }], 
  areasOfInterest: [{ type: String, default: "" }], 
  jobTitle: { type: String, default: "" },// only for alumni
  experience: { type: Number, default: 0 },// only for alumni
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, 
  socialLinks: {
    linkedin: { type: String },
    website: { type: String },
  },
  company: { type: String, default: "" }, // Only for alumni
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
