import React, { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const JobForm = ({ onClose }) => {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    hrName: "",
    email: "",
  });

  // Handle input changes for the job form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Logged-in user:", user); // Debugging step

    // Check if the user is logged in and has a valid id
    if (!user || !user.id) {
      alert("You must be logged in to post a job.");
      return; // Exit the function if user is not logged in
    }

    // Check if the user is an alumni or admin
    if (user.role !== "alumni" && user.role !== "admin") {
      alert("Only alumni and admin can post a job.");
      return; // Exit the function if the user is neither an alumni nor an admin
    }

    // Extract first name from user.name
    let firstName = "";
    if (user.name) {
      firstName = user.name.split(" ")[0];
      console.log("First Name:", firstName); // Debugging step
    } else {
      alert("User name is missing!");
      return; // Exit if the name is missing
    }

    // Prepare the job payload with the user ID
    const jobPayload = {
      ...jobData,
      postedBy: user.id,
      firstName, // Use user.id here
    };

    console.log("Job Payload:", jobPayload); // Log the payload to check its structure

    try {
      // Post the job to the server
      const response = await axios.post(`${API_URL}
/api/job`, jobPayload);

      // Handle the response
      if (response.status === 201) {
        alert("Job posted successfully!");
        onClose(); // Close the form or modal after posting
      }
    } catch (error) {
      console.error("Error posting the job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl text-gray-700 font-semibold mb-4">Add Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">Job Description</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            rows="4"
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">Company</label>
          <input
            type="text"
            name="company"
            value={jobData.company}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">HR Name</label>
          <input
            type="text"
            name="hrName"
            value={jobData.hrName}
            onChange={handleInputChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">HR Email</label>
          <input
            type="email"
            name="email"
            value={jobData.email}
            onChange={handleInputChange}
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
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
