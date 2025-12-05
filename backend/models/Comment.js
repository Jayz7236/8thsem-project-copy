const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum' },
    parent_comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
  });


module.exports = mongoose.model("Comment", commentSchema);
