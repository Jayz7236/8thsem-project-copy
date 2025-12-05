import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const AdminForums = () => {
  const [forums, setForums] = useState([]);
  const [newTopic, setNewTopic] = useState({
    topic: "",
    description: "",
    author: "", 
    avatar: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({
    topic: false,
    description: false,
    author: false,
  });

  const navigate = useNavigate();

  // Fetch forums on mount
  useEffect(() => {
    // Fetch the admin's name (e.g., from localStorage or API)
    const adminName = localStorage.getItem("adminName") || "Admin"; // Example from localStorage
    setNewTopic((prev) => ({ ...prev, author: adminName }));

    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/forums");
      const formatted = response.data.map((forum) => ({
        id: forum._id,
        title: forum.title,
        author: forum.created_by || "Unknown",
        status: forum.status || "Pending",
      }));
      setForums(formatted);
    } catch (err) {
      console.error("Error fetching forums:", err);
    }
  };

  const approveForum = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/forum/status/${id}`, {
        status: "Approved",
      });
      fetchForums();
    } catch (err) {
      console.error("Error approving forum:", err);
    }
  };

  const deleteForum = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/forum/${id}`);
      fetchForums();
    } catch (err) {
      console.error("Error deleting forum:", err);
    }
  };

  const handleView = (forum) => {
    navigate(`/forums/${forum.id}`);
  };

  // const handleFileUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setNewTopic({ ...newTopic, avatar: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleCreateTopic = async () => {
    const newErrors = {
      topic: !newTopic.topic,
      description: !newTopic.description,
      author: !newTopic.author,
    };
    setErrors(newErrors);

    // If no errors, proceed with creating the topic
    if (!newErrors.topic && !newErrors.description && !newErrors.author) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:5000/api/manageforum",
          {
            title: newTopic.topic,
            description: newTopic.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForums([
          {
            id: response.data.forumId,
            topic: newTopic.topic,
            description: newTopic.description,
            author: newTopic.author,
            avatar: newTopic.avatar,
          },
          ...forums,
        ]);

        setNewTopic({ topic: "", description: "", author: "", avatar: "" });
        setShowForm(false);
      } catch (error) {
        console.error("Failed to create topic:", error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Forum Management</h1>

        {/* Create Topic Button */}
        <button
          className="mb-4 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-800 transition font-semibold"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4" /> Create Topic
        </button>

        {/* Inline Create Topic Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Create New Topic
            </h2>

            {/* Topic Title Field */}
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Topic Title
            </label>
            <input
              type="text"
              placeholder="Topic Title"
              className={`w-full p-3 border rounded-md mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.topic ? "border-red-500" : "border-gray-300"
              }`}
              value={newTopic.topic}
              onChange={(e) =>
                setNewTopic({ ...newTopic, topic: e.target.value })
              }
            />
            {errors.topic && (
              <p className="text-red-500 text-sm">Topic title is required</p>
            )}

            {/* Description Field */}
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <textarea
              placeholder="Description"
              className={`w-full p-3 border rounded-md mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              value={newTopic.description}
              onChange={(e) =>
                setNewTopic({ ...newTopic, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-sm">Description is required</p>
            )}

            {/* Author Field (Pre-filled with admin's name and read-only) */}
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-md mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newTopic.author}
              readOnly
            />

            {/* <input
              type="file"
              accept="image/*"
              className="mb-3 text-gray-700"
              onChange={handleFileUpload}
            />
            {newTopic.avatar && (
              <img
                src={newTopic.avatar}
                alt="Uploaded Avatar"
                className="w-16 h-16 rounded-full mb-3"
              />
            )} */}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCreateTopic}
                className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition ${
                  !newTopic.topic || !newTopic.description || !newTopic.author
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={!newTopic.topic || !newTopic.description || !newTopic.author}
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Forum Table */}
        <div className="bg-white text-black p-6 shadow-lg rounded-lg">
          {forums.length > 0 ? (
            <table className="w-full border text-black border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left text-gray-700">
                  <th className="border p-3 w-2/5">Title</th>
                  <th className="border p-3 w-1/5">Author</th>
                  <th className="border p-3 w-1/5 text-center">Status</th>
                  <th className="border p-3 w-1/5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {forums.map((forum) => (
                  <tr key={forum.id} className="hover:bg-gray-100">
                    <td className="text-black border p-3">{forum.title}</td>
                    <td className="text-black border p-3">{forum.author}</td>
                    <td className="text-black border p-3 text-center">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          forum.status === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {forum.status}
                      </span>
                    </td>
                    <td className="text-black border p-3 text-center space-x-2">
                      <button
                        onClick={() => handleView(forum)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => approveForum(forum.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => deleteForum(forum.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">No forums available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForums;
