const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  date: String,
  location: String,
  description: String,
  status: { type: String, default: "Upcoming" },
  image: { type: String, default: 'default-avatar.png' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
