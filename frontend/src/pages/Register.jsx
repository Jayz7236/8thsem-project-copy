import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HiEye, HiEyeOff } from "react-icons/hi"; 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    enrollmentNumber: "",
    branch: "",
    graduationYear: "",
    company: "",
  });
const API_URL = import.meta.env.VITE_API_URL;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name" && /[^a-zA-Z\s]/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name must contain only alphabetic characters",
      }));
    } else {
      setErrors((prevErrors) => {
        const { name, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const {
      name,
      email,
      password,
      confirmPassword,
      enrollmentNumber,
      graduationYear,
      branch,
    } = formData;

    if (!name || /[^a-zA-Z\s]/.test(name)) {
      newErrors.name = "Name must contain only alphabetic characters";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.role === "student" && !enrollmentNumber) {
      newErrors.enrollmentNumber = "Enrollment number is required";
    } else if (enrollmentNumber && !/^\d+$/.test(enrollmentNumber)) {
      newErrors.enrollmentNumber = "Enrollment number must be numeric";
    }

    if (!graduationYear) {
      newErrors.graduationYear = "Graduation year is required";
    } else if (graduationYear && !/^\d+$/.test(graduationYear)) {
      newErrors.graduationYear = "Graduation year must be numeric";
    }

    if (!branch) {
      newErrors.branch = "Branch is required";
    } else if (!/^[A-Za-z\s]+$/.test(branch)) {
      newErrors.branch = "Branch should contain only letters";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(`${API_URL}
/api/auth/register`, formData, {
        withCredentials: true,
      });
      alert("Registration successful! Awaiting admin approval.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  const isStudent = formData.role === "student";
  const isAlumni = formData.role === "alumni";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1F3A5F] to-[#8C4A3B]">
      <h1
        className="text-3xl font-bold text-[#FFC107] mb-6 cursor-pointer hover:underline"
        onClick={() => navigate("/home")}
      >
        Alumni Connect
      </h1>

      <div className="bg-[#D4C2A8] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#8C4A3B]">
        <h2 className="text-2xl font-bold text-[#1F3A5F] text-center">
          Create an Account
        </h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#1F3A5F]">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black placeholder-gray-700 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
              onChange={handleChange}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black placeholder-gray-700 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full p-2 pr-10 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#1F3A5F]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full p-2 pr-10 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
                onChange={handleChange}
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#1F3A5F]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <HiEyeOff size={20} />
                ) : (
                  <HiEye size={20} />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1F3A5F]">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107]"
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          {(isStudent || isAlumni) && (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium text-[#1F3A5F]">
                  Enrollment Number
                </label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black"
                  onChange={handleChange}
                  required={isStudent}
                />
                {errors.enrollmentNumber && (
                  <p className="text-red-500 text-xs">
                    {errors.enrollmentNumber}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#1F3A5F]">
                  Graduation Year
                </label>
                <input
                  type="text"
                  name="graduationYear"
                  placeholder="Enter your graduation year"
                  className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black"
                  onChange={handleChange}
                  required
                />
                {errors.graduationYear && (
                  <p className="text-red-500 text-xs">
                    {errors.graduationYear}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#1F3A5F]">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  placeholder="Enter your branch"
                  className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black"
                  onChange={handleChange}
                  required
                />
                {errors.branch && (
                  <p className="text-red-500 text-xs">{errors.branch}</p>
                )}
              </div>

              {isAlumni && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#1F3A5F]">
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter your current company"
                    className="w-full p-2 mt-1 border border-[#8C4A3B] rounded-md bg-transparent text-black"
                    onChange={handleChange}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-[#1F3A5F] text-white py-2 rounded-md hover:bg-[#2e4c72] transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#1F3A5F] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
