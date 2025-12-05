import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash, Edit } from "lucide-react";
import Sidebar from "./Sidebar";
const API_URL = import.meta.env.VITE_API_URL;

const AdminGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const userId = localStorage.getItem("adminId");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios
        .get(`${API_URL}
/api/users/admin/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("No userId or token found in localStorage");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}
/api/gallery`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGallery(res.data);
        } else {
          console.warn("Unexpected gallery data format:", res.data);
          setGallery([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setGallery([]);
      });
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAboutChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description || !user) {
      alert("Please add a description and ensure user data is available.");
      return;
    }

    try {
      const formData = new FormData();
      if (file) {
        formData.append("image", file); // Add new image if there's one
      }
      formData.append("description", description); // Add the description
      formData.append("uploader", userId); // The uploader's ID
      formData.append("uploaderName", user.name); // The uploader's name
      formData.append("uploaderAvatar", user.profile); // Profile picture

      // If editId is set, use PUT to update the existing gallery item, else use POST for new gallery item
      const response = await axios({
        method: editId ? "PUT" : "POST", // Change to PUT when editing an existing gallery item
        url: `${API_URL}
/api/gallery${editId ? `/${editId}` : ""}`, // Add editId if available
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Successfully uploaded or updated");

        if (editId) {
          // If it's an update, replace the edited gallery item in the array
          setGallery(
            gallery.map((item) =>
              item._id === editId ? response.data.galleryItem : item
            )
          );
        } else {
          // If it's a new upload, append the new gallery item
          setGallery([response.data.galleryItem, ...gallery]);
        }

        setFile(null);
        setDescription("");
        setEditId(null); // Clear edit state
      } else {
        alert("An error occurred while uploading. Please try again.");
      }
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert("An error occurred while uploading.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}
/api/gallery/${id}`
      );
      setGallery(gallery.filter((item) => item._id !== id));
      alert(response.data.message || "Deleted successfully");
    } catch (error) {
      alert("An error occurred while deleting.");
      console.error("Delete Error:", error);
    }
  };

  const shortenAboutText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text || "";
  };

  const handleEdit = (imagePath, about, id) => {
    setFile(imagePath);
    setDescription(about);
    setEditId(id); // Store the ID for the edit
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem="Gallery" />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6  pb-3">
          Admin Gallery
        </h1>

        {/* Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4 max-w-xl"
        >
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Select Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border text-gray-700 rounded-md p-2"
              accept="image/*"
              defaultValue={file} // Default value for editing
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={handleAboutChange}
              className="w-full border text-gray-700 rounded-md p-2"
              placeholder="Enter description..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {file ? "Update" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setDescription("");
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Gallery Table */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Gallery List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-300">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-2 text-center border border-gray-300">
                    #
                  </th>
                  <th className="px-4 py-2 text-center border border-gray-300">
                    Image
                  </th>
                  <th className="px-4 py-2 text-center border border-gray-300">
                    About
                  </th>
                  <th className="px-4 py-2 text-center border border-gray-300 w-24">
                    Action
                  </th>{" "}
                  {/* Reduced width for Action column */}
                </tr>
              </thead>
              <tbody>
                {gallery.map((galleryItem, index) => (
                  <tr
                    key={galleryItem._id || index}
                    className="border-t border-gray-300"
                  >
                    <td className="text-center text-gray-700 px-4 py-2 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="flex justify-center px-4 py-2 border border-gray-300">
                      <img
                        src={`${API_URL}
${galleryItem.imageUrl}`}
                        alt="img"
                        className="h-15 w-15 object-cover rounded"
                      />
                    </td>
                    <td
                      className="px-4 text-center text-gray-700 py-2 border border-gray-300"
                      title={galleryItem.description}
                    >
                      {galleryItem.description
                        ? galleryItem.description
                        : "No description available"}
                    </td>
                    <td className="text-center border border-gray-300">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() =>
                            handleEdit(
                              galleryItem.imageUrl,
                              galleryItem.description,
                              galleryItem._id
                            )
                          }
                          className="btn btn-lg btn-primary bg-green-500 text-white px-5 py-2 rounded-md flex items-center justify-center border"
                          type="button"
                        >
                          Edit {/* Text-based button */}
                        </button>
                        <button
                          onClick={() => handleDelete(galleryItem._id)}
                          className="btn btn-lg btn-danger bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center border"
                          type="button"
                        >
                          Delete {/* Text-based button */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
