import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  
  // Check if a user is authenticated using token or user object
  const isAuthenticated = localStorage.getItem("token") && localStorage.getItem("user");

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("user"));
      // Redirect to the appropriate dashboard based on user role
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (user.role === "alumni") {
        navigate("/home", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}
/api/auth/login`,
        formData, 
        { withCredentials: true }
      );
  
      console.log("Login Response:", res.data); // ✅ Debugging
  
      alert("Login Successful!");
  
      const { user, token, adminId } = res.data;  // ✅ Ensure backend sends { user, token }
  
      if (!token) {
        alert("No token received! Please check backend.");
        return;
      }
      if (!user) {
        console.error("❌ User data is undefined in API response");
        return;
      }

      // ✅ Save token & user data in localStorage
      localStorage.setItem("token", token); 
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("adminId", adminId); // ✅ Store adminId

      console.log("User Data:", user);  // ✅ Debugging
      console.log("✅ Stored User:", localStorage.getItem("user"));
      console.log("✅ Stored  ID:", localStorage.getItem("adminId"));

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "alumni") {
        navigate("/home");
      } else {
        navigate("/home"); 
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data);
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1F3A5F] to-[#8C4A3B]">
      <h1 className="text-3xl font-bold text-[#FFC107] mb-6 cursor-pointer hover:underline"
        onClick={() => navigate("/login")}>
        Alumni Connect
      </h1>
      <div className="bg-[#D4C2A8] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#8C4A3B]">
        <h2 className="text-2xl font-bold text-[#1F3A5F] text-center">Login</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">Email</label>
            <input type="email" name="email" placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black placeholder-gray-700 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
              onChange={handleChange} required />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">Password</label>
            <input type="password" name="password" placeholder="Enter your password"
              className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black placeholder-gray-700 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
              onChange={handleChange} required />
          </div>
          <button type="submit"
            className="w-full bg-[#1F3A5F] text-white py-2 mt-4 rounded-md hover:bg-[#FFC107] transition-all">
            Login
          </button>
        </form>
        <p className="text-center text-[#1F3A5F] text-sm mt-4">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}
            className="text-[#8C4A3B] font-semibold focus:outline-none hover:underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
