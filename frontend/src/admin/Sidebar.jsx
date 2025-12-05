import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Sidebar = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    avatar: "/images/default-avatar.png",
  });
 
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const adminId = localStorage.getItem("adminId");

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

        // ✅ Update Admin Data
        setAdmin({
          name: res.data.name || "Admin Name",
          email: res.data.email || "admin@example.com",
          avatar: res.data.avatar
            ? `${API_URL}
${res.data.avatar}`
            : `${API_URL}
/uploads/1742742024090-112.png`,
        });

        // ✅ Store in LocalStorage (for sidebar persistence)
        localStorage.setItem("adminName", res.data.name);
        localStorage.setItem("adminEmail", res.data.email);
        localStorage.setItem("adminAvatar", res.data.avatar);
      } catch (error) {
        console.error("❌ Error fetching admin profile:", error);
      }
    };

    fetchAdminData();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminAvatar");
    navigate("/login");
  };
  return (
    <aside className="w-64 bg-white shadow-md h-screen p-4 flex flex-col justify-between">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 border-b pb-4">
        <img
          src={admin.avatar}
          alt="Profile"
          className="w-12 h-12 text-black rounded-full border"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{admin.name}</h3>
          <p className="text-sm text-gray-500">{admin.email}</p>
        </div>
      </div>

      {/* Sidebar Links */}
      <ul className="mt-4 space-y-4 flex-1">
        <li>
          <Link
            to="/admin-dashboard"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            🏠 Home
          </Link>
        </li>
        <li>
          <Link
            to="/admin/alumni-list"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            🎓 Alumni List
          </Link>
        </li>
        <li>
          <Link
            to="/admin/student-list"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            📜 Student List
          </Link>
        </li>
        <li>
          <Link
            to="/admin/admin-jobs"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            💼 Jobs
          </Link>
        </li>
        <li>
          <Link
            to="/admin/admin-events"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            📅 Events
          </Link>
        </li>
        <li>
          <Link
            to="/admin/admin-forums"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            💬 Forum
          </Link>
        </li>
        <li>
          <Link
            to="/admin/profile"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            👤 Profile
          </Link>
        </li>
        <li>
          <Link
            to="/admin/admin-gallery"
            className="text-gray-700 hover:text-blue-700 flex items-center"
          >
            🌅 Gallery
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
