import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, UserCircle, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { motion } from "framer-motion";

const Forums = () => {
  const [search, setSearch] = useState("");
  const [forums, setForums] = useState([]);
  const [newTopic, setNewTopic] = useState({
    topic: "",
    description: "",
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isStudent = user.role === "student";
  const navigate = useNavigate(); // Added navigate hook

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/forums");
        const formatted = response.data.map((forum) => ({
          id: forum._id,
          topic: forum.title,
          description: forum.description,
          author: forum.created_by || "Unknown",
          avatar: forum.creator_avatar?.startsWith("http")
            ? forum.creator_avatar
            : `http://localhost:5000${forum.creator_avatar}`,
        }));
        console.log(formatted); // Add this to verify the avatar URLs
        setForums(formatted);
      } catch (error) {
        console.error("Failed to fetch forums", error);
      }
    };

    fetchForums();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axios.post(
      "http://localhost:5000/api/upload",
      formData
    );
    const imageUrl = response.data.url;

    setNewTopic({ ...newTopic, avatar: imageUrl });
  };

  const handleCreateTopic = async () => {
    if (!newTopic.topic) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const author = user.name;
    const avatar = user.avatar
      ? `http://localhost:5000${user.avatar}`
      : "/default-avatar.png";

    try {
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
          author,
          avatar,
        },
        ...forums,
      ]);

      setNewTopic({ topic: "", description: "" });
      document.getElementById("createTopicModal").close();
    } catch (error) {
      console.error("Failed to create topic:", error);
    }
  };

  // Handle profile navigation
  const handleViewProfile = (author) => {
    // Navigate to the author's profile page
    navigate(`/alumni/${author}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 pt-22">
      <Navbar />
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/acadamic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center"
          >
            Discussion Forums
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-3 text-lg text-center text-gray-200 max-w-2xl px-4 mx-auto"
          >
            Share knowledge, ask questions, and stay connected with alumni and
            students.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 mb-10 p-4 sm:p-6 bg-white shadow-lg rounded-xl border border-gray-300">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border border-gray-300 p-4 rounded-lg shadow-sm w-full justify-between">
          <div className="flex items-center gap-3 flex-1 w-full">
            <Search className="text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Topic or Author..."
              className="w-full sm:min-w-[400px] p-3 bg-gray-100 text-gray-900 rounded-lg outline-none border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {!isStudent && (
            <button
              className="bg-yellow-400 text-gray-900 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition font-semibold whitespace-nowrap mt-4 sm:mt-0"
              onClick={() =>
                document.getElementById("createTopicModal").showModal()
              }
            >
              <Plus className="h-4 w-4" /> Create Topic
            </button>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6 pb-6">
          {forums.length > 0 ? (
            forums
              .filter(
                (forum) =>
                  forum.topic.toLowerCase().includes(search.toLowerCase()) ||
                  forum.author.toLowerCase().includes(search.toLowerCase())
              )
              .map((forum) => (
                <Link
                  to={`/forums/${forum.id}`}
                  key={forum.id}
                  className="block w-full max-w-full p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={forum.avatar}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full border"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-yellow-700">
                        {forum.topic}
                      </h2>
                      <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                        {forum.description}
                      </p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <UserCircle className="mr-1 w-4 h-4" />
                        <span
                          className="text-gray-600 cursor-pointer hover:text-yellow-500"
                          onClick={() => handleViewProfile(forum.author)} // Click to view profile
                        >
                          {forum.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          ) : (
            <p className="text-center text-red-600 mt-4">No Forums Available</p>
          )}
        </div>
      </div>
      {/* Create Topic Forum */}
      {!isStudent && (
        <dialog
          id="createTopicModal"
          className="fixed left-40 top-50 max-h-[60vh] bg-white shadow-lg p-6 transform translate-x-full transition-transform ease-in-out duration-300 w-full sm:w-96 max-w-[95%]"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Create New Topic
          </h2>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Topic Title
          </label>
          <input
            type="text"
            placeholder="Topic Title"
            className="w-full p-3 border border-gray-300 rounded-md mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newTopic.topic}
            onChange={(e) =>
              setNewTopic({ ...newTopic, topic: e.target.value })
            }
          />
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description
          </label>
          <textarea
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded-md mb-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            value={newTopic.description}
            onChange={(e) =>
              setNewTopic({ ...newTopic, description: e.target.value })
            }
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCreateTopic}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Create
            </button>
            <button
              onClick={() =>
                document.getElementById("createTopicModal").close()
              }
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </dialog>
      )}

      <Footer />
    </div>
  );
};

export default Forums;
