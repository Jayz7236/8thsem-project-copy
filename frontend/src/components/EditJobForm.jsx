import React from "react";
const API_URL = import.meta.env.VITE_API_URL;

const EditJobForm = ({ formData, handleChange, handleSubmit, loading, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded shadow mb-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl text-gray-700 font-semibold mb-4">Edit Job</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
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
          <p className="text-sm text-gray-500 mt-1">Enter the job position (e.g., Frontend Developer).</p>
        </div>

        {/* Description */}
        <div className="mb-4 text-gray-800">
          <label className="block text-gray-700">Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded"
            rows="4"
          />
          <p className="text-sm text-gray-500 mt-1">Include key responsibilities, skills required, etc.</p>
        </div>

        {/* Company */}
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
          <p className="text-sm text-gray-500 mt-1">Enter the full company name (e.g., TCS, Infosys).</p>
        </div>

        {/* Location */}
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
          <p className="text-sm text-gray-500 mt-1">Mention the job location (e.g., Remote, Mumbai).</p>
        </div>

        {/* HR Name */}
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
          <p className="text-sm text-gray-500 mt-1">Enter the name of the HR contact person.</p>
        </div>

        {/* HR Email */}
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
          <p className="text-sm text-gray-500 mt-1">Provide the official HR contact email.</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
