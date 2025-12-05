import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Discussion = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [childReply, setChildReply] = useState("");
  const navigate = useNavigate();
  const bgColors = ["bg-orange-100", "bg-orange-50", "bg-orange-200"];
  const [collapsedReplies, setCollapsedReplies] = useState({});
  const [isAdmin, setIsAdmin] = useState(false); 

  const fetchDiscussion = async () => {
    try {
      const response = await axios.get(
        `${API_URL}
/api/forums/${id}`
      );
      const formattedTopic = {
        ...response.data,
        author: response.data.created_by || "Unknown",
        avatar: response.data.creator_avatar?.startsWith("http")
          ? response.data.creator_avatar
          : `${API_URL}
${response.data.creator_avatar}`,
      };
      setTopic(formattedTopic);
    } catch (err) {
      console.error("Error fetching topic:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${API_URL}
/api/forums/${id}/comments`
      );

      const formattedComments = res.data.map((comment) => ({
        ...comment,
        author: comment.authorName || "Anonymous",
        avatar: comment.authorAvatar || "/default-avatar.png",
        user_id: comment.user_id, 
      }));

      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    fetchDiscussion();
    fetchComments();

    // Check if the user is an admin
    const token = localStorage.getItem("token");
    if (token) {
      // Assuming the token has a payload with a user role or ID indicating admin
      const userRole = JSON.parse(atob(token.split('.')[1]))?.role; 
      if (userRole === "admin") {
        setIsAdmin(true); // Set the admin status
      }
    }
  }, [id]);

  const handleViewProfile = (authorId) => {
    // Navigate to the author's profile page using their unique id
    navigate(`/alumni/${authorId}`);
  };

  const handleNewComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to post a comment!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}
/api/reply`,
        {
          comment: newComment,
          topic_id: id,
          parent_comment: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  };

  const handleNestedReply = async (parentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to reply!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}
/api/reply`,
        {
          comment: childReply,
          topic_id: id,
          parent_comment: parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChildReply("");
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error submitting nested reply:", err);
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    }
  };

  const toggleCollapse = (commentId) => {
    setCollapsedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You need to be logged in to delete a comment!");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `${API_URL}
/api/view_forum/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments(); // Refresh comments after deletion
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const renderReplies = (parentId, depth = 1) => {
    const replies = comments.filter((c) => c.parent_comment === parentId);
    if (replies.length === 0) return null;

    return replies.map((reply) => (
      <div
        key={reply._id}
        className={`ml-6 mt-3 pl-4 border-l-2 border-orange-300 rounded ${
          bgColors[depth % bgColors.length]
        }`}
      >
        <div className="flex items-center gap-2">
          <img
            src={reply.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
          <div
            className="text-sm font-semibold text-gray-700 cursor-pointer"
            onClick={() => handleViewProfile(reply.user_id)} // Handle profile navigation for replies
          >
            {reply.author || "Anonymous"}
          </div>
        </div>
        <div className="text-gray-900">{reply.comment}</div>
        <div className="text-xs text-gray-500">
          {new Date(reply.createdAt).toLocaleString()}
        </div>

        {isAdmin && (
          <button
            onClick={() => handleDelete(reply._id)} // Show delete comment option for admin
            className="mt-2 text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        )}

        {replyingTo === reply._id ? (
          <div className="mt-2 ">
            <textarea
              className="w-full p-2 border text-black rounded-md"
              value={childReply}
              onChange={(e) => setChildReply(e.target.value)}
              placeholder="Reply..."
            />
            <button
              onClick={() => handleNestedReply(reply._id)}
              className="mt-1 px-3 py-1 bg-orange-600 text-white rounded"
            >
              Post Reply
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => setReplyingTo(reply._id)}
              className="text-sm text-orange-600 mt-1 hover:underline"
            >
              Reply
            </button>

            {/* Collapsible Toggle */}
            <button
              onClick={() => toggleCollapse(reply._id)}
              className="text-sm text-gray-500 mt-1 hover:underline"
            >
              {collapsedReplies[reply._id]
                ? "Expand Replies"
                : "Collapse Replies"}
            </button>
          </div>
        )}

        {!collapsedReplies[reply._id] && renderReplies(reply._id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-orange-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          ← Go Back
        </button>

        {topic ? (
          <>
            <div className="flex items-center mb-4">
              <img
                src={topic.avatar || "/default-avatar.png"} 
                alt="avatar"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div className="text-lg font-semibold text-gray-800">
                {topic.author || "Anonymous"}
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {topic.title}
            </h1>
            <p className="text-gray-700 mb-6">{topic.description}</p>

            <div className="mb-6">
              <textarea
                className="w-full p-3 border text-gray-800 rounded-md"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                onClick={handleNewComment}
                className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Post Comment
              </button>
            </div>

            <div className="space-y-6">
              {comments
                .filter((c) => c.parent_comment === null)
                .map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-orange-100 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={comment.avatar || "/default-avatar.png"} 
                        alt="avatar"
                        className="w-6 h-6 rounded-full"
                      />
                      <div
                        className="text-sm font-semibold text-gray-700 cursor-pointer"
                        onClick={() => handleViewProfile(comment.user_id)}
                      >
                        {comment.author || "Anonymous"}
                      </div>
                    </div>

                    <p className="text-gray-900">{comment.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(comment._id)} // Show delete comment option for admin 
                        className="mt-2 text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    )}

                    {replyingTo === comment._id ? (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border text-black rounded"
                          value={childReply}
                          onChange={(e) => setChildReply(e.target.value)}
                          placeholder="Reply..."
                        />
                        <button
                          onClick={() => handleNestedReply(comment._id)}
                          className="mt-1 px-3 py-1 bg-orange-600 text-white rounded"
                        >
                          Post Reply
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(comment._id)}
                        className="text-sm text-orange-600 mt-1 hover:underline"
                      >
                        Reply
                      </button>
                    )}

                    {renderReplies(comment._id)}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <p>Loading topic...</p>
        )}
      </div>
    </div>
  );
};

export default Discussion;
