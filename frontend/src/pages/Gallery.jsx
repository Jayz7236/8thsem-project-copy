import React, { useState, useEffect, Fragment } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PlusCircle, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({
    imageFile: null,
    previewUrl: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isStudent = user?.role === "student";
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const updatedPhotos = data.map((photo) => {
            if (
              photo.uploaderAvatar &&
              !photo.uploaderAvatar.startsWith("http")
            ) {
              photo.uploaderAvatar = `http://localhost:5000${photo.uploaderAvatar}`;
            }
            return photo;
          });
          setPhotos(updatedPhotos);
        }
      })
      .catch((err) => console.error("Failed to fetch gallery:", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto({
          ...newPhoto,
          imageFile: file,
          previewUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (newPhoto.imageFile && newPhoto.description) {
      const formData = new FormData();
      formData.append("image", newPhoto.imageFile);
      formData.append("description", newPhoto.description);
      formData.append("uploader", user._id || user.id);
      formData.append("uploaderName", user.name || "Unknown");
      try {
        const res = await fetch("http://localhost:5000/api/gallery", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (res.ok) {
          setPhotos([data.galleryItem, ...photos]);
          setNewPhoto({ imageFile: null, previewUrl: "", description: "" });
          setIsOpen(false);
        } else {
          console.error("Upload failed:", data.error);
        }
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
  };
  return (
    <div className="bg-gray-100 pt-22">
      <Navbar />

      {/* Background Section */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/acadamic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold drop-shadow-lg"
          >
            Alumni Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg mt-2 max-w-2xl mx-auto text-gray-300"
          >
            Discover memories shared by our alumni across batches and events!
          </motion.p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-semibold text-gray-800">
            Our Precious Alumni Moments
          </h2>
          {!isStudent && (
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 flex items-center"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircle className="mr-2" /> Upload Photo
            </button>
          )}
        </div>

        {/* Gallery Section */}
        {photos.length === 0 ? (
          <p className="text-center text-gray-600">No photos available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer "
              >
                <img
                  src={`http://localhost:5000${photo.imageUrl}`}
                  alt={photo.description || "Alumni Photo"}
                  className="w-full h-56 object-cover rounded-t-md"
                  onClick={() =>
                    setSelectedImage(`http://localhost:5000${photo.imageUrl}`)
                  }
                  onError={(e) => (e.target.src = "/images/university.jpg")}
                />

                <div className="p-4">
                  <p className="text-gray-800 text-base italic mb-2">
                    {photo.description || "No description available"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      onClick={() => {
                        // Check if uploader is admin by name
                        if (photo.uploaderName !== "Admin") {
                          // Navigate to alumni profile if not uploaded by admin
                          navigate(`/alumni/${photo.uploadedBy}`);
                        }
                      }}
                      className={`text-sm font-medium ${
                        photo.uploaderName === "Admin"
                          ? "text-gray-500 italic cursor-default" // Disable cursor for admin
                          : "text-blue-600 hover:underline cursor-pointer" // Enable cursor for alumni
                      }`}
                    >
                      {photo.uploaderName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Photo Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0  bg-black/50 backdrop-blur-md  flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>

              <Dialog.Title className="text-xl font-semibold text-gray-700 mb-4">
                Upload a New Photo
              </Dialog.Title>

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-lg mb-3 text-black"
                onChange={handleFileChange}
              />

              {/* Preview Image */}
              {newPhoto.previewUrl && (
                <img
                  src={newPhoto.previewUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-md mb-3 "
                />
              )}

              {/* Description Input */}
              <input
                type="text"
                className="w-full p-2 border rounded-lg mb-3 text-black"
                placeholder="Photo Description"
                value={newPhoto.description}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, description: e.target.value })
                }
              />

              {/* Upload Button */}
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleUpload}
                  disabled={!newPhoto.imageFile || !newPhoto.description}
                >
                  Upload
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={!!selectedImage} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setSelectedImage(null)}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <Dialog.Panel className="relative max-w-4xl w-full bg-transparent rounded-lg">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white hover:text-red-400 z-10"
              >
                <X size={28} />
              </button>
              <img
                src={selectedImage}
                alt="Full Size"
                className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      <Footer />
    </div>
  );
};

export default Gallery;
