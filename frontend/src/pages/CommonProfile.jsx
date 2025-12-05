import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const API_URL = import.meta.env.VITE_API_URL;

import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Briefcase,
  Linkedin,
  ArrowLeft,
} from "lucide-react";

const CommonProfile = () => {
  const { id } = useParams(); 
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchAlumnus = async () => {
      try {
        const response = await fetch(`${API_URL}
/api/users/${id}`);
        if (!response.ok) throw new Error("Alumnus not found");
        const data = await response.json();

       
        const avatarUrl = data.avatar && !data.avatar.startsWith("http")
          ? `${API_URL}
${data.avatar}`
          : data.avatar;

        setAlumnus({ ...data, avatar: avatarUrl }); // Set alumnus with updated avatar
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetch
      }
    };

    fetchAlumnus();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10 text-amber-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="w-full max-w-xl mx-auto mt-25 mb-16 p-10 bg-white shadow-xl rounded-2xl border border-gray-300 min-h-[550px] px-4 sm:px-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-amber-700 text-white py-2 px-4 rounded-md mb-6 hover:bg-amber-600"
        >
          <ArrowLeft size={18} />
          Back 
        </button>

        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <img
            src={alumnus.avatar || "/default-avatar.png"} 
            alt={alumnus.name}
            className="w-28 h-28 rounded-full border-2 border-gray-300"
          />
          <h1 className="text-2xl font-bold text-amber-700">{alumnus.name}</h1>
          <p className="text-sm text-gray-500">
            {alumnus.jobTitle} at {alumnus.company}
          </p>
        </div>

        <div className="mt-4 space-y-3 text-gray-700 text-sm md:text-base">
          <p className="flex items-center gap-2">
            <Mail size={18} />
            <span>{alumnus.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={18} />
            <span>{alumnus.phoneNumber || "N/A"}</span>
          </p>
          <p className="flex items-center gap-2">
            <GraduationCap size={18} />
            <span>{alumnus.graduationYear}</span>
          </p>
          <p className="flex items-center gap-2">
            <BookOpen size={18} />
            <span>
              {alumnus.degree} - {alumnus.branch}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Briefcase size={18} />
            <span>{alumnus.experience} years</span>
          </p>
          <p className="flex items-center gap-2">
            <Linkedin size={18} />
            <a
              href={`https://linkedin.com/in/${alumnus.socialLinks?.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-amber-700"
            >
              {alumnus.socialLinks?.linkedinDisplay || "View Profile"}
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommonProfile;
