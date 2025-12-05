import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobForm from "../components/JobForm"; // Import JobForm component
import { PlusIcon } from "lucide-react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false); // State for showing the Add Job form
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
  const isAlumni = user?.role?.toLowerCase() === "alumni";

  // Fetch jobs using Axios with a callback function
  const fetchJobs = async (callback) => {
    try {
      const response = await axios.get("http://localhost:5000/api/job");
      setJobs(response.data);
      if (callback) callback(response.data); // Callback after successful fetch
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(); // Fetch jobs initially on component mount
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const term = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(term) ||
      job.company?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.hrName?.toLowerCase().includes(term) ||
      job.email?.toLowerCase().includes(term) ||
      job.postedBy?.name?.toLowerCase().includes(term)
    );
  });

  const handleJobFormClose = () => {
    setShowJobForm(false);
    fetchJobs(); // Callback after closing the job form, refresh jobs list
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 text-gray-900 pt-22 overflow-y-auto">
      <Navbar />

      {/* Background Image with Overlay */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/acadamic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold"
          >
            Job Listings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg mt-2"
          >
            Explore job opportunities posted by alumni and recruiters. Kickstart
            your career with the right connections!
          </motion.p>
        </div>
      </div>

      {/* Show Add Job Component if 'showJobForm' is true */}
      {isAlumni && showJobForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full mx-4">
            <button
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
              onClick={handleJobFormClose}
            >
              &times;
            </button>
            <JobForm onClose={handleJobFormClose} />
          </div>
        </div>
      )}

      {/* Job Search Section */}
      <div className="max-w-5xl mx-auto mt-10 mb-10 p-6 bg-white shadow-lg rounded-xl border border-gray-300">
        <div className="flex flex-wrap items-center gap-3 border border-gray-300 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search by Job Title or Location..."
            className="flex-1 min-w-[250px] p-3 bg-gray-100 text-gray-900 rounded-lg outline-none border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-500 transition font-semibold">
            Search
          </button>
          {isAlumni && (
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition font-semibold"
            >
              <PlusIcon className="h-4 w-4" />
              Add Job
            </button>
          )}
        </div>

        {/* Job Listings */}
        <div className="mt-8  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-300 p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <h2 className="text-2xl font-semibold text-yellow-600">
                  {job.title}
                </h2>
                <p className="text-gray-700 mt-2">
                  💼 Company:{" "}
                  <span className="font-medium text-gray-900">
                    {job.company}
                  </span>
                </p>
                <p className="text-gray-700">
                  📍 Location:{" "}
                  <span className="font-medium text-gray-900">
                    {job.location}
                  </span>
                </p>
                <p className="text-gray-700">
                  📝 Posted By:{" "}
                  <span className="font-medium text-yellow-600 cursor-pointer hover:underline">
                    {job.firstName}{" "}
                    {/* Display the first name instead of the full name */}
                  </span>
                </p>

                <button className="mt-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500 mt-6 text-lg font-semibold">
              No Jobs Found 😕
            </p>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
              onClick={() => setSelectedJob(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mt-4 text-yellow-600">
              {selectedJob.title}
            </h2>
            <p className="text-gray-700 mt-2">
              💼 Company:{" "}
              <span className="font-medium text-gray-900">
                {selectedJob.company}
              </span>
            </p>
            <p className="text-gray-700">
              📍 Location:{" "}
              <span className="font-medium text-gray-900">
                {selectedJob.location}
              </span>
            </p>
            <p className="text-gray-700">
              📝 Posted By:{" "}
              <span className="font-medium text-yellow-600">
                {selectedJob.postedBy?.name || "Unknown"}
              </span>
            </p>
            <p className="text-gray-700">
              👨‍💼 HR Name:{" "}
              <span className="font-medium text-gray-900">
                {selectedJob.hrName}
              </span>
            </p>
            <p className="text-gray-700">
              📧 Email:{" "}
              <span className="font-medium text-blue-600">
                {selectedJob.email}
              </span>
            </p>
            <p className="text-gray-700 mt-4">
              📝 <span className="font-semibold">Description:</span>
              <br />
              <span className="text-gray-800">{selectedJob.description}</span>
            </p>
            {/* <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Apply Now
            </button> */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
              onClick={() => setSelectedJob(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Jobs;
