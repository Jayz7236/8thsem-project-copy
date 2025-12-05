const mongoose = require("mongoose");

const joinedEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventName: String,      
  eventDate: Date,  
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: String, 
  graduationYear: String, 
  phoneNumber: String,
  joinedAt: { type: Date, default: Date.now },
});

const JoinedEvent = mongoose.model("JoinedEvent", joinedEventSchema);
module.exports = JoinedEvent;
