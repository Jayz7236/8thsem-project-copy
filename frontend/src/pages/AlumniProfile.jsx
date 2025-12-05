import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditJobForm from "../components/EditJobForm";
import EditGalleryModal from "../components/EditGallery";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  BookOpen,
  Linkedin,
  Building2,
  Settings,
  Calendar,
  MapPin,
  PartyPopper,
  Edit,
  Trash2,
} from "lucide-react";
const AlumniProfile = () => {
  const [alumni, setAlumni] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    enrollmentNumber: "",
    degree: "",
    experience: "",
    branch: "",
    graduationYear: "",
    skills: "",
    areasOfInterest: "",
    socialLinks: { linkedin: "" },
    avatar: "",
    company: "",
    jobTitle: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    enrollmentNumber: "",
    degree: "",
    experience: "",
    branch: "",
    graduationYear: "",
    skills: "",
    areasOfInterest: "",
    socialLinks: { linkedin: "" },
  });
const API_URL = import.meta.env.VITE_API_URL;

  const isStudent = alumni?.role === "student";

  const [selectedFile, setSelectedFile] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editPhoto, setEditPhoto] = useState({
    imageFile: null,
    previewUrl: "",
    description: "",
  });
  const [userTopics, setUserTopics] = useState([]);
  const [userComments, setUserComments] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}
/api/users/${id}`);
      setAlumni({
        ...res.data,
        graduationYear: res.data.graduationYear || "",
        areasOfInterest: res.data.areasOfInterest || "",
        socialLinks: res.data.socialLinks || { linkedin: "" },
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchJoinedEvents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}
/api/events/joined-events/${id}`
      );
      setJoinedEvents(
        (response.data || [])
          .filter((item) => item.eventId && item.eventId.date)
          .sort((a, b) => new Date(a.eventId.date) - new Date(b.eventId.date))
      );
    } catch (error) {
      console.error("Error fetching joined events:", error);
    }
  };
  const fetchJobs = async () => {
    try {
      // Fetch the user and their jobs at the same time
      const res = await axios.get(
        `${API_URL}
/api/job/profile/${id}`
      );
      setAlumni(res.data.user); // Set the alumni profile data
      setJobs(res.data.jobs); // Set the posted jobs data
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const fetchGalleryItem = async () => {
    try {
      console.log("Gallery Item ID:", id);
      const response = await axios.get(
        `${API_URL}
/api/gallery/${id}`
      );
      console.log("Gallery Response:", response.data);
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Error fetching gallery item:", error);
    }
  };
  const fetchUserTopics = async () => {
    try {
      const res = await axios.get(`${API_URL}
/api/forum/user/${id}`);
      setUserTopics(res.data || []); // Set topics created by the user
    } catch (error) {
      console.error("Error fetching user topics:", error);
    }
  };

  const fetchUserComments = async () => {
    try {
      const res = await axios.get(
        `${API_URL}
/api/comment/user/${id}`
      );
      console.log("Fetched comments:", res.data);
      setUserComments(res.data || []); // Set comments made by the user
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
      fetchJoinedEvents();
      fetchJobs();
      fetchGalleryItem();
      fetchUserTopics();
      fetchUserComments();
    }
  }, [id]);

  // for leave the event
  const handleLeaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to leave an event.");
        return;
      }
      await axios.delete(`${API_URL}
/api/events/leave/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJoinedEvents(); // Refresh the list of joined events
      alert("Successfully left the event!");
    } catch (error) {
      alert("Failed to leave the event!");
      console.error("Error leaving event:", error);
    }
  };
  // for edit the job post
  const handleEditClick = (job) => {
    setEditingJob(job); // Set the job to be edited
  };
  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`${API_URL}
/api/job/${jobId}`);
      alert("Job deleted successfully!");
      fetchJobs(); // Re-fetch the jobs after deletion
    } catch (error) {
      alert("Failed to delete the job!");
      console.error("Error deleting job:", error);
    }
  };
  // gallery edit component  open
  const openEditModal = (item) => {
    setEditItem(item);
    setEditPhoto({
      imageFile: null,
      previewUrl: `${API_URL}
${item.imageUrl}`,
      description: item.description,
    });
  };

  const handleEditSave = async () => {
    if (!editItem) return;

    const formData = new FormData();
    formData.append("description", editPhoto.description);
    if (editPhoto.imageFile) {
      formData.append("image", editPhoto.imageFile);
    }

    try {
      const response = await fetch(
        `${API_URL}
/api/gallery/${editItem._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Photo updated successfully!");
        setEditItem(null);
        fetchGalleryItem(); // Refresh the list of gallery item
      } else {
        console.error("Failed to update photo");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
    }
  };

  // Delete gallery image
  const deleteGalleryItem = async (imageId) => {
    try {
      const res = await axios.delete(
        `${API_URL}
/api/gallery/${imageId}`
      );
      console.log(res.data.message);
      fetchGalleryItem();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  // for delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}
/api/view_forum/${commentId}`);
      fetchUserComments(); // After delete, refetch comments
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      const response = await fetch(
        `${API_URL}
/api/forum/${topicId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete forum topic.");
      }

      // Remove the deleted topic from UI
      setUserTopics((prevTopics) =>
        prevTopics.filter((topic) => topic._id !== topicId)
      );

      alert("Topic deleted successfully!");
    } catch (error) {
      console.error(error.message);
      alert("Failed to delete the topic. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingJob({
      ...editingJob,
      [name]: value, // Update the job data when an input field changes
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission ( send data to the backend)
  };
  const handleFormClose = () => {
    setEditingJob(null); // close the form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for each field
    let error = "";

    if (
      name === "name" ||
      name === "degree" ||
      name === "branch" ||
      name === "skills" ||
      name === "company"
    ) {
      if (/[^a-zA-Z\s.,-]/.test(value)) {
        error =
          "Only alphabetic characters, spaces, commas, periods, and hyphens are allowed.";
      }
    }

    if (
      name === "phoneNumber" ||
      name === "enrollmentNumber" ||
      name === "graduationYear" ||
      name === "experience"
    ) {
      if (/[^0-9]/.test(value)) {
        error = "Only numbers are allowed.";
      }
    }

    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Invalid email format.";
      }
    }

    // Handle social links
    if (name.includes("socialLinks.")) {
      const field = name.split(".")[1];
      setAlumni((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
    } else {
      setAlumni((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAlumni((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await axios.put(
        `${API_URL}
/api/users/${id}/avatar`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Avatar updated successfully!");
      fetchUser();
    } catch (error) {
      alert("Failed to upload avatar!");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData = { ...alumni };
      if (!selectedFile) delete updateData.avatar;
      await axios.put(`${API_URL}
/api/users/${id}`, updateData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Profile updated successfully!");
      fetchUser();
    } catch (error) {
      alert("Failed to update profile!");
    }
  };

  const fields = [
    {
      icon: <User size={18} />,
      label: "Name",
      name: "name",
      placeholder: "Enter your full name",
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      name: "email",
      readOnly: true,
      placeholder: "example@domain.com",
    },
    {
      icon: <Phone size={18} />,
      label: "Phone Number",
      name: "phoneNumber",
      placeholder: "Enter your phone number",
    },
    {
      icon: <GraduationCap size={18} />,
      label: "Degree",
      name: "degree",
      placeholder: "e.g. B.Tech in Computer Science",
    },
    {
      icon: <BookOpen size={18} />,
      label: "Branch",
      name: "branch",
      placeholder: "e.g. Computer Science",
    },
    {
      icon: <GraduationCap size={18} />,
      label: "Graduation Year",
      name: "graduationYear",
      placeholder: "e.g. 2021–2025",
    },
    !isStudent && {
      icon: <Building2 size={18} />,
      label: "Company",
      name: "company",
      placeholder: "e.g. Google",
    },
    !isStudent && {
      icon: <Briefcase size={18} />,
      label: "Job Title",
      name: "jobTitle",
      placeholder: "e.g. Software Engineer",
    },
    !isStudent && {
      icon: <Briefcase size={18} />,
      label: "Experience",
      name: "experience",
      placeholder: "e.g. Software Engineer",
    },
    {
      icon: <Settings size={18} />,
      label: "Skills",
      name: "skills",
      placeholder: "e.g. JavaScript, React, Node.js",
    },
    {
      icon: <Linkedin size={18} />,
      label: "LinkedIn Username",
      name: "socialLinks.linkedin",
      placeholder: "e.g. john-doe",
    },
    {
      icon: <BookOpen size={18} />,
      label: "Areas of Interest",
      name: "areasOfInterest",
      placeholder: "e.g. Web Development, AI, Data Science",
    },
    isStudent && {
      icon: <User size={18} />,
      label: "Enrollment Number",
      name: "enrollmentNumber",
      placeholder: "e.g. 1234567890",
    },
  ].filter(Boolean);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 pt-24 px-4 ">
        <div className="w-full max-w-3xl p-6 mx-auto flex-grow bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-semibold text-center text-amber-700 mb-6">
            Alumni Profile
          </h2>
          {/* Avatar Upload */}
          <div className="flex justify-center mb-6">
            <label htmlFor="avatarUpload" className="cursor-pointer relative">
              <img
                src={
                  alumni.avatar
                    ? `${API_URL}
${alumni.avatar}`
                    : "default-avatar.png"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <span className="text-white text-sm">Change Photo</span>
              </div>
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(({ label, name, readOnly, placeholder, icon }) => (
              <div key={name}>
                <label className=" text-gray-700 font-medium mb-1 flex items-center gap-1">
                  {icon}
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={
                    name.includes("socialLinks.")
                      ? alumni?.socialLinks?.[name.split(".")[1]] || ""
                      : alumni?.[name] || ""
                  }
                  onChange={handleChange}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-gray-800 ${
                    readOnly ? "bg-gray-200" : "bg-gray-100"
                  } ${errors[name] ? "border-red-500" : ""}`}
                />
                {errors[name] && (
                  <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
          {/* Events Section */}
          <div className="mt-10 mb-4">
            <h3 className="text-xl font-semibold text-amber-700 mb-4">
              Events Participated
            </h3>

            {joinedEvents.length > 0 ? (
              <div className="space-y-4 border-l-2 border-amber-300 pl-4">
                {joinedEvents.map(
                  ({ eventId }) =>
                    eventId ? (
                      <div
                        key={eventId._id}
                        className="relative pl-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="absolute left-0 top-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                          <p className="text-gray-800 font-medium flex items-center gap-2">
                            <PartyPopper className="text-amber-600" size={18} />
                            {eventId.name}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <Calendar className="text-gray-500" size={16} />
                            {new Date(eventId.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="text-gray-500" size={16} />
                            {eventId.location}
                          </p>
                        </div>
                        {/* Check if the event date has passed */}
                        {new Date(eventId.date) > new Date() && (
                          <button
                            onClick={() => handleLeaveEvent(eventId._id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            Leave
                          </button>
                        )}
                      </div>
                    ) : null // If eventId is null, render nothing
                )}
              </div>
            ) : (
              <p className="text-gray-500">No event participation found.</p>
            )}
          </div>

          {/* Job Post Section */}

          {!isStudent && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">
                Jobs Posted
              </h3>

              {jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="border-b-2 border-amber-300 pb-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg text-gray-800">
                          Title: {job.title}
                        </h4>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditClick(job)} // Handle edit click
                            className="text-blue-500 hover:text-blue-700 flex items-center"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteJob(job._id)} // Handle delete job
                            className="text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="w-5 h-5" size={20} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        Description: {job.description}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-sm mt-2">
                        Company: {job.company}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No jobs posted by this alumni.</p>
              )}

              {/* EditJobForm Modal */}
              {editingJob && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <EditJobForm
                      formData={editingJob} // Pass the selected job as formData
                      handleChange={handleInputChange}
                      handleSubmit={handleSubmit}
                      onCancel={handleFormClose}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Contributions Overview */}
          {!isStudent && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">
                Contributions Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-700">
                    Jobs Posted
                  </h4>
                  <p className="text-2xl text-amber-600 font-bold">
                    {jobs.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Section */}
          {!isStudent && (
            <div className="gallery-section mt-8">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryItems.length > 0 ? (
                  galleryItems.map((item) => (
                    <div
                      key={item._id}
                      className="gallery-item bg-white p-4 rounded-lg shadow-md"
                    >
                      <img
                        src={`${API_URL}
${item.imageUrl}`}
                        alt={item.description || "Gallery Item"}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                        onClick={() => setSelectedImage(item)} // Set selected image on click
                      />
                      <p className="text-gray-700 text-sm">
                        {item.description}
                      </p>
                      <div className="flex justify-end space-x-4 mt-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
                        >
                          <Edit size={18} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => deleteGalleryItem(item._id)}
                          className="text-red-600 hover:text-red-800 flex items-center space-x-2"
                        >
                          <Trash2 size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No gallery items found.</p>
                )}
              </div>
            </div>
          )}

          {/* Image Preview Modal */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-transparent p-4 rounded-lg shadow-lg relative max-w-5xl w-full mx-4">
                <button
                  className="absolute top-2 right-1 text-white hover:text-red-400 z-10"
                  onClick={() => setSelectedImage(null)} // Close the modal by resetting selectedImage
                >
                  ✖
                </button>
                <img
                  src={`${API_URL}
${selectedImage.imageUrl}`} // Use selectedImage instead of item
                  alt={selectedImage.description || "Gallery Item"}
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />

                {selectedImage.description && (
                  <p className="text-white mt-2 text-center">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Edit Gallery Modal */}
          <EditGalleryModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            editPhoto={editPhoto} // Pass the selected gallery data in formData
            setEditPhoto={setEditPhoto}
            handleEditSave={handleEditSave}
          />

          {/* Topics Section */}
          {!isStudent && (
            <div className="mb-8 mt-10">
              <h3 className="text-amber-700 text-lg font-semibold mb-4">
                Topics Created
              </h3>
              {userTopics.length > 0 ? (
                <ul>
                  {userTopics.map((topic, index) => (
                    <li
                      key={index}
                      className="mb-3 p-3 bg-amber-100 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-amber-600 font-medium">
                            {topic.title}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {topic.comments_count} Comments
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeleteTopic(topic._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Display the topic creation date */}
                      {topic.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Created on:{" "}
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No topics created yet.</p>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 className="text-amber-700 text-lg font-semibold mb-4">
              Comments
            </h3>
            {userComments.length > 0 ? (
              <ul>
                {userComments.map((comment) => (
                  <li
                    key={comment._id}
                    className="mb-3 p-3 bg-gray-100 rounded-lg shadow-sm"
                  >
                    <div className="p-3 bg-gray-100 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-amber-700">
                          Topic: {comment.topic_id?.title || "Unknown Topic"}
                        </p>
                        <p className="text-gray-700">{comment.comment}</p>

                        {/* Display the comment date */}
                        {comment.createdAt && (
                          <p className="text-sm text-gray-500 mt-2">
                            Commented on:{" "}
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 flex items-center ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
          {/* Save Button */}
          <div className="mt-6 flex justify-between items-center">
            <button
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AlumniProfile;
