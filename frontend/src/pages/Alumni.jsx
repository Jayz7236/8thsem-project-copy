import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, MapPin, GraduationCap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
const API_URL = import.meta.env.VITE_API_URL;

const Alumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch(`${API_URL}
/api/alumni`);
        if (!response.ok) throw new Error("Failed to fetch alumni data.");
        const data = await response.json();

        data.forEach((alumnus) => {
          if (alumnus.avatar && !alumnus.avatar.startsWith("http")) {
            alumnus.avatar = `${API_URL}
${alumnus.avatar}`;
          }
        });
        setAlumni(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((person) => {
    const term = searchTerm.toLowerCase();
    return (
      person.name?.toLowerCase().includes(term) ||
      person.company?.toLowerCase().includes(term) ||
      person.jobTitle?.toLowerCase().includes(term) ||
      person.graduationYear?.toLowerCase().includes(term)
    );
  });

  const handleViewProfile = (id) => {
    navigate(`/alumni/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 pt-22">
      <Navbar />

      {/* Background */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/acadamic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl font-bold text-center"
          >
            Alumni Directory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-2 text-lg text-center max-w-2xl mx-auto text-gray-300"
          >
            Explore and connect with alumni from your batch and beyond!
          </motion.p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-5xl mx-auto mt-10 mb-10 p-6 bg-white shadow-lg rounded-xl border border-gray-300">
        <div className="flex flex-wrap items-center gap-3 border border-gray-300 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search by Name, Company, or Batch..."
            className="flex-1 min-w-[250px] p-3 bg-gray-100 text-gray-900 rounded-lg outline-none border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold">
            Search
          </button>
        </div>

        {/* Alumni List */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {loading ? (
            <p>Loading alumni data...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-6 text-lg font-semibold">
              {error}
            </p>
          ) : filteredAlumni.length > 0 ? (
            filteredAlumni.map((person) => (
              <div
                key={person._id}
                className="flex flex-col justify-between border border-gray-300 p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer w-full"
              >
                 <div className="flex flex-col h-full flex-grow">
                <h2 className="text-2xl font-semibold text-yellow-600 mb-2">
                  {person.name}
                </h2>
                <p className="text-gray-800 flex items-center font-medium mt-2 ">
                  <Briefcase className="w-5 h-5 mr-2 text-yellow-500" />
                  Job Title: 
                  <span className="text-gray-700 font-semi-bold">
                    {person.jobTitle}
                  </span>
                </p>
                <p className="text-gray-800 flex items-center font-medium ">
                  <Briefcase className="w-5 h-5 mr-2 text-yellow-500" />
                  Company:
                  <span className="text-gray-700 font-semi-bold">
                    {person.company}
                  </span>
                </p>
                <p className="text-gray-800 flex items-center font-medium">
                  <GraduationCap className="w-5 h-5 mr-2 text-yellow-500" />
                  Batch:
                  <span className="text-gray-700 font-semi-bold">
                    {person.graduationYear}
                  </span>
                </p>
                </div>
                <button
                  onClick={() => handleViewProfile(person._id)}
                  className="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold"
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 mt-6 text-lg font-semibold">
              No Alumni Found 😕
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Alumni;
