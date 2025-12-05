const express = require("express");
const router = express.Router();
const Forum = require("../models/Forum");
const Comment = require("../models/Comment");
const User = require("../models/User");
const mongoose = require("mongoose");
const authenticateUser = require("../middleware/authMiddleware");

// Get all forums with comment count and creator name
router.get("/forums", async (req, res) => {
  try {
    const forums = await Forum.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "topic_id",
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" },
          created_by: { $arrayElemAt: ["$creator.name", 0] },
          creator_avatar: {
            $cond: [
              { $gt: [{ $size: "$creator" }, 0] },
              { $concat: ["http://localhost:5000", { $arrayElemAt: ["$creator.avatar", 0] }] },
              "/default-avatar.png"
            ]
          }
        }
        
      },
      {
        $sort: { _id: -1 }
      }
    ]);
    res.json(forums);
  } catch (err) {
    console.error("Error fetching forums:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch forums created by a specific user
router.get("/forum/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const forums = await Forum.aggregate([
      { 
        $match: { user_id: new mongoose.Types.ObjectId(userId) } // Match forums by user_id
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id", 
          foreignField: "topic_id", 
          as: "comments" 
        }
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" } 
        }
      }
    ]);

    res.json(forums); 
  } catch (err) {
    console.error("Error fetching forums by user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch a specific forum by ID
router.get("/forums/:id", async (req, res) => {
  try {
    const forum = await Forum.aggregate([
      { 
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) } 
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "topic_id",
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $addFields: {
          comments_count: { $size: "$comments" },
          created_by: { $arrayElemAt: ["$creator.name", 0] },
          creator_avatar: {
            $cond: [
              { $gt: [{ $size: "$creator" }, 0] },
              { $concat: ["http://localhost:5000", { $arrayElemAt: ["$creator.avatar", 0] }] },
              "/default-avatar.png"
            ]
          }
        }
      }
    ]);

    if (!forum || forum.length === 0) {
      return res.status(404).json({ error: "Forum not found" });
    }

    res.json(forum[0]); 
  } catch (err) {
    console.error("Error fetching forum:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Update forum status 
router.put("/forum/status/:id", async (req, res) => {
    const { status } = req.body;
    try {
      const updatedForum = await Forum.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (updatedForum) {
        res.json({ message: "Forum status updated", forum: updatedForum });
      } else {
        res.status(404).json({ error: "Forum not found" });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
   
// Create a new forum topic
router.post("/manageforum", authenticateUser, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
  
    try {
      const forum = new Forum({ title, description, user_id: userId });
      await forum.save();
      res.json({ message: "Forum created", forumId: forum._id });
    } catch (err) {
      res.status(500).json({ error: "Database Error" });
    }
  });

// Update forum topic
router.put("/manageforum", async (req, res) => {
  const { id, title, description } = req.body;
  try {
    await Forum.findByIdAndUpdate(id, { title, description });
    res.json({ message: "Forum Topic Updated Successfully" });
  } catch (err) {
    console.error("Error updating forum:", err);
    res.status(500).json({ error: "Database Error" });
  }
});

// Delete forum topic
router.delete("/forum/:id", async (req, res) => {
  try {
    await Forum.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ topic_id: req.params.id }); 
    res.json({ message: "Forum Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting forum:", err);
    res.status(500).json({ error: "Query Error" });
  }
});





// /////////////////////////////////////////////////////////////////////////////////////////////////


//  COMMENTS 


//////////////////////////////////////////////////////////////////////////////////////////////////
// fetch forums by user id with comements
router.get("/forums/:id/comments", async (req, res) => {
  const topicId = req.params.id;
  try {
      const comments = await Comment.aggregate([
          { 
              $match: { topic_id: new mongoose.Types.ObjectId(topicId) } 
          },
          {
              $lookup: {
                  from: "users", 
                  localField: "user_id", 
                  foreignField: "_id",
                  as: "author"
              }
          },
          {
              $addFields: {
                  authorName: { $arrayElemAt: ["$author.name", 0] },
                  authorAvatar: {
                      $cond: [
                          { $gt: [{ $size: "$author" }, 0] },
                          { $concat: ["http://localhost:5000", { $arrayElemAt: ["$author.avatar", 0] }] },
                          "/default-avatar.png" 
                      ]
                  }
              }
          }
      ]);

      res.json(comments);
  } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ error: "Server error" });
  }
});

// Fetch comments made by a  user with populated topic title
router.get("/comment/user/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ user_id: req.params.id })
      .populate('topic_id', 'title');  // Populate the 'title' field of the topic
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments by user:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// fetch topic and comment for edit forum in admin pannel
router.post("/topiccomments", async (req, res) => {
  const { topic_id } = req.body;
  try {
      const allComments = await Comment.aggregate([
          { 
              $match: { topic_id: new mongoose.Types.ObjectId(topic_id) } 
          },
          {
              $lookup: {
                  from: "users",
                  localField: "user_id", 
                  foreignField: "_id", 
                  as: "user" 
              }
          },
          {
              $addFields: {
                  authorName: { $arrayElemAt: ["$user.name", 0] }, 
                  authorAvatar: {
                      $cond: [
                          { $gt: [{ $size: "$user" }, 0] },
                          { $concat: ["http://localhost:5000", { $arrayElemAt: ["$user.avatar", 0] }] },
                          "/default-avatar.png" 
                      ]
                  }
              }
          },
          { $sort: { createdAt: 1 } } 
      ]);

      const commentMap = {};
      allComments.forEach(c => {
          c.replies = [];
          commentMap[c._id] = {
              ...c,
              authorName: c.authorName,
              authorAvatar: c.authorAvatar
          };
      });
      
      const rootComments = [];
      allComments.forEach(c => {
          if (c.parent_comment) {
              commentMap[c.parent_comment]?.replies.push(c);
          } else {
              rootComments.push(c);
          }
      });

      res.json(rootComments);
  } catch (err) {
      console.error("Error getting nested comments:", err);
      res.status(500).json({ error: "Server Error" });
  }
});

// Add comment to a topic
router.post("/view_forum", authenticateUser, async (req, res) => {
    const { c, topic_id } = req.body;
    const user_id = req.user.id;
  
    try {
      const newComment = new Comment({
        comment: c,
        topic_id,
        user_id
      });
      await newComment.save();
      res.json(newComment);
    } catch (err) {
      res.status(500).json({ error: "Query Error" });
    }
  });
  

// Update comment
router.put("/view_forum/:id", async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    await Comment.findByIdAndUpdate(id, { comment });
    res.json({ message: "Comment Updated Successfully" });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: "Query Error" });
  }
});
// Add reply
router.post("/reply", authenticateUser, async (req, res) => {
  const { comment, topic_id, parent_comment } = req.body;
  const userId = req.user.id; // Comes from auth middleware

  try {
    const newComment = new Comment({
      comment,
      topic_id,
      parent_comment: parent_comment || null,
      user_id: userId // THIS MUST BE SET
    });

    await newComment.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).json({ error: "Database error" });
  }
});
  
// Delete comment
router.delete("/view_forum/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Query Error" });
  }
});
module.exports = router;
