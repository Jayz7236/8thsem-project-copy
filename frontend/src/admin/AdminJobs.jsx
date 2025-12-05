import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import EditJobForm from "../components/EditJobForm";
import JobForm from "../components/JobForm";
import { Plus } from "lucide-react";
// Fetch jobs from the API
const fetchJobs = async () => {
  const response = await fetch("http://localhost:5000/api/job");
  return response.json();
};

// Modal Component to View Job Details
const JobModal = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg max-w-lg w-[500px] text-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Details</h2>

        <div className="mb-4">
          <strong className="text-gray-700">Title:</strong>{" "}
          <span className="text-gray-600">{job.title}</span>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">Company:</strong>{" "}
          <span className="text-gray-600">{job.company}</span>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">Location:</strong>{" "}
          <span className="text-gray-600">{job.location}</span>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">HR Name:</strong>{" "}
          <span className="text-gray-600">{job.hrName}</span>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">HR Email:</strong>{" "}
          <span className="text-gray-600">{job.email}</span>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">Description:</strong>{" "}
          <p className="text-gray-600 mt-1 whitespace-pre-line">
            {job.description || "No description provided."}
          </p>
        </div>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    hrName: "",
    email: "",
  });

  const [isEditJob, setIsEditJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // Store selected job for modal

  useEffect(() => {
    const getJobs = async () => {
      const data = await fetchJobs();
      setJobs(data);
    };
    getJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditJob
        ? `http://localhost:5000/api/jobs/${formData._id}`
        : "http://localhost:5000/api/job";
      const method = isEditJob ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          postedBy: {
            role: "admin",
            name: "Admin",
          },
        }),
      });

      if (!response.ok) throw new Error("Error in response");

      // Reset
      setIsAddJobOpen(true);
      setIsEditJob(false);
      setFormData({
        title: "",
        company: "",
        location: "",
        description: "",
        hrName: "",
        email: "",
      });

      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job); // Set selected job to show in the modal
  };
  const handleDeleteEvent = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/job/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the event");
      }

      // Update UI if needed
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const closeModal = () => {
    setSelectedJob(null); // Close the modal by clearing the selected job
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden ">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
       
          <h1 className="text-3xl mb-6 font-bold  text-gray-700">Job Management</h1>
          <button
           className="mb-4 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-800 transition font-semibold"
            onClick={() => setIsAddJobOpen(true)}
          >
            < Plus className="h-5 w-5"/> Add Job
          </button>
     
        {/* Show the JobForm directly inside the page layout */}
        {isAddJobOpen && (
         
            <JobForm onClose={() => setIsAddJobOpen(false)} />
          
        )}
        {/* Add Job Form */}
        {/* {isAddJobOpen && !isEditJob && (
          <div className="bg-white p-6 rounded shadow mb-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">
              Add Job
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  rows="4"
                />
              </div>

              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">HR Name</label>
                <input
                  type="text"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4 text-gray-800">
                <label className="block text-gray-700">HR Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Job
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddJobOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )} */}

        {isEditJob && (
          <EditJobForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
            onCancel={() => {
              setIsAddJobOpen(false);
              setIsEditJob(false);
            }}
          />
        )}

        {/* Job Table */}
        <div className="bg-white p-6 rounded shadow min-h-[60vh] overflow-y-auto">
          <h2 className="text-2xl text-gray-700 font-semibold mb-4">
            Job Listings
          </h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-black border px-4 py-2">Title</th>
                <th className="text-black border px-4 py-2">Company</th>
                <th className="text-black border px-4 py-2">Location</th>
                <th className="text-black border px-4 py-2">Posted By</th>
                <th className="text-black border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="text-center">
                  <td className="text-black border px-4 py-2">{job.title}</td>
                  <td className="text-black border px-4 py-2">{job.company}</td>
                  <td className="text-black border px-4 py-2">
                    {job.location}
                  </td>
                  <td className="text-black border px-4 py-2">
                    {job.firstName}
                  </td>
                  <td className="text-black border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(job)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setFormData({
                          title: job.title,
                          company: job.company,
                          location: job.location,
                          description: job.description,
                          hrName: job.hrName,
                          email: job.email,
                          _id: job._id, // needed to identify which job to edit
                        });
                        setIsEditJob(true);
                        setIsAddJobOpen(false);
                      }}
                      className="bg-yellow-400 text-black px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(job._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Viewing Job Details */}
      {selectedJob && <JobModal job={selectedJob} onClose={closeModal} />}
    </div>
  );
};

export default AdminJobs;
