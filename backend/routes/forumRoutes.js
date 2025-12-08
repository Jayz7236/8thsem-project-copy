const express = require("express");
const router = express.Router();
const Forum = require("../models/Forum");
const Comment = require("../models/Comment");
const User = require("../models/User");
const mongoose = require("mongoose");
const authenticateUser = require("../middleware/authMiddleware");

// ----------------------- GET ALL FORUMS -----------------------
router.get("/forums", async (req, res) => {
  try {
    const forums = await Forum.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "topic_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" },
          created_by: { $arrayElemAt: ["$creator.name", 0] },
          creator_avatar: {
            $cond: [
              { $gt: [{ $size: "$creator" }, 0] },
              { $arrayElemAt: ["$creator.avatar", 0] },
              "/default-avatar.png",
            ],
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(forums);
  } catch (err) {
    console.error("Error fetching forums:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------- GET FORUMS BY USER -----------------------
router.get("/forum/user/:id", async (req, res) => {
  try {
    const forums = await Forum.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "topic_id",
          as: "comments",
        },
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" },
        },
      },
    ]);

    res.json(forums);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------- GET SINGLE FORUM -----------------------
router.get("/forums/:id", async (req, res) => {
  try {
    const forum = await Forum.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "topic_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "creator",
        },
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" },
          created_by: { $arrayElemAt: ["$creator.name", 0] },
          creator_avatar: {
            $cond: [
              { $gt: [{ $size: "$creator" }, 0] },
              { $arrayElemAt: ["$creator.avatar", 0] },
              "/default-avatar.png",
            ],
          },
        },
      },
    ]);

    if (!forum.length) return res.status(404).json({ error: "Forum not found" });

    res.json(forum[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------- UPDATE STATUS -----------------------
router.put("/forum/status/:id", async (req, res) => {
  try {
    const updated = await Forum.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Forum not found" });

    res.json({ message: "Status updated", forum: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------- CREATE FORUM -----------------------
router.post("/manageforum", authenticateUser, async (req, res) => {
  try {
    const newForum = new Forum({
      title: req.body.title,
      description: req.body.description,
      user_id: req.user.id,
    });

    await newForum.save();
    res.json({ message: "Forum created", forumId: newForum._id });
  } catch (err) {
    res.status(500).json({ error: "Database Error" });
  }
});

// ----------------------- UPDATE FORUM -----------------------
router.put("/manageforum", async (req, res) => {
  try {
    await Forum.findByIdAndUpdate(req.body.id, {
      title: req.body.title,
      description: req.body.description,
    });

    res.json({ message: "Forum updated" });
  } catch (err) {
    res.status(500).json({ error: "Database Error" });
  }
});

// ----------------------- DELETE FORUM -----------------------
router.delete("/forum/:id", async (req, res) => {
  try {
    await Forum.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ topic_id: req.params.id });
    res.json({ message: "Forum deleted" });
  } catch (err) {
    res.status(500).json({ error: "Query Error" });
  }
});

// ----------------------- GET COMMENTS -----------------------
router.get("/forums/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      {
        $match: { topic_id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields: {
          authorName: { $arrayElemAt: ["$author.name", 0] },
          authorAvatar: {
            $cond: [
              { $gt: [{ $size: "$author" }, 0] },
              { $arrayElemAt: ["$author.avatar", 0] },
              "/default-avatar.png",
            ],
          },
        },
      },
    ]);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------- ADD COMMENT -----------------------
router.post("/view_forum", authenticateUser, async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.c,
      topic_id: req.body.topic_id,
      user_id: req.user.id,
    });

    await newComment.save();
    res.json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Query Error" });
  }
});

// ----------------------- UPDATE COMMENT -----------------------
router.put("/view_forum/:id", async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { comment: req.body.comment });
    res.json({ message: "Comment updated" });
  } catch (err) {
    res.status(500).json({ error: "Query Error" });
  }
});

// ----------------------- ADD REPLY -----------------------
router.post("/reply", authenticateUser, async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      topic_id: req.body.topic_id,
      parent_comment: req.body.parent_comment || null,
      user_id: req.user.id,
    });

    await newComment.save();
    res.json({ message: "Reply added" });
  } catch (err) {
    res.status(500).json({ error: "Query Error" });
  }
});

// ----------------------- DELETE COMMENT -----------------------
router.delete("/view_forum/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Query Error" });
  }
});

module.exports = router;
