import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", avatar: "" });
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");
      console.log("Admin ID:", adminId);
      if (!token || !adminId) {
        console.error("No token or admin ID found!");
        return;
      }

      const res = await axios.get(
        `${API_URL}
/api/users/admin/${adminId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdmin(res.data);
      setNewName(res.data.name);
    } catch (error) {
      console.error("❌ Error fetching admin profile:", error);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // ✅ Handle Avatar Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewAvatar(file); // Or setSelectedFile if you're sticking with that

    // Instant preview
    setAdmin((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));

    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");

    try {
      const response = await axios.put(
        `${API_URL}
/api/users/admin/${adminId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Avatar Upload Response:", response.data);
      alert("✅ Avatar updated successfully!");
      fetchAdminProfile(); // Refresh with backend data
    } catch (error) {
      console.error("❌ Avatar upload failed:", error);
      alert("❌ Failed to upload avatar!");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const adminId = localStorage.getItem("adminId");

      if (password && password !== confirmPassword) {
        alert("❌ Passwords do not match");
        return;
      }

      const formData = new FormData();
      formData.append("name", newName);
      if (newAvatar) formData.append("avatar", newAvatar);
      if (password) formData.append("password", password);

      const res = await axios.put(
        `${API_URL}
/api/users/admin/${adminId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setAdmin(res.data);
        alert("✅ Profile Updated Successfully!");
        fetchAdminProfile();
      } else {
        alert("❌ Update failed.");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-auto">
        
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Profile</h1>
       

        <div className="flex flex-col items-center justify-center w-full px-6 py-10">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex flex-col items-center">
              <label htmlFor="avatarUpload" className="cursor-pointer relative">
                <img
                  src={
                    admin.avatar
                      ? `${API_URL}
${admin.avatar}`
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
                className="mt-4 hidden"
              />
              {/* {newAvatar && (
                <img
                  src={URL.createObjectURL(newAvatar)}
                  alt="Preview"
                  className="w-28 h-28 rounded-full mt-4 object-cover border-4 border-green-500"
                />
              )} */}
            </div>

            <div className="mt-6">
              <label className="text-gray-600 text-sm block">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 border rounded-md mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-600 text-sm block">Email</label>
              <input
                type="email"
                value={admin.email}
                disabled
                className="w-full p-3 border rounded-md mt-1 text-gray-500 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-600 text-sm block">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border text-black rounded-md mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-600 text-sm block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border text-black rounded-md mt-1"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
