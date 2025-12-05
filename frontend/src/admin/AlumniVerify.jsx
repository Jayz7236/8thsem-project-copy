import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AlumniVerify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch alumni details
    const fetchAlumni = async () => {
      try {
        const response = await fetch(`${API_URL}
/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch alumni data");
        const data = await response.json();

        // Log the avatar field to verify
        console.log("Fetched Alumni Data: ", data);

        // Ensure the avatar path is correct (prepend base URL if it's a relative path)
        if (data.avatar && !data.avatar.startsWith("http")) {
          data.avatar = `${API_URL}
${data.avatar}`; // Prepend the base URL
        }
        console.log("Avatar Path: ", data.avatar); // Log to verify the avatar URL

        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [id]);

  const approveAlumni = async () => {
    try {
      const response = await fetch(`${API_URL}
/api/alumni/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to approve alumni");
      }
  
      // Fetch updated alumni data
      const updatedAlumni = await response.json();
      setAlumni(updatedAlumni);
  
      alert("Alumni approved successfully.");
      navigate("/admin/alumni-list");
    } catch (error) {
      console.error("Error approving alumni:", error);
      alert("Something went wrong.");
    }
  };

  const deleteAlumni = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this alumni?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}
/api/alumni/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete alumni");
      }

      alert("Alumni deleted successfully.");
      navigate("/admin/alumni-list");
    } catch (error) {
      console.error("Error deleting alumni:", error);
      alert("Failed to delete alumni.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!alumni) return <div className="p-6 text-red-500">Alumni not found.</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <header className="bg-white shadow-sm py-2 px-4 flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Alumni Verification</h1>
        </header>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Alumni Details</h2>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex items-center gap-6">
            {/* ✅ Show Avatar */}
            <img
              src={alumni.avatar} // Avatar now has the correct full path
              alt="Alumni Avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <div>
              <p className="text-lg font-medium text-gray-700">Name: {alumni.name}</p>
              <p className="text-lg font-medium text-gray-700">Email: {alumni.email}</p>
              <p className="text-lg font-medium text-gray-700">Graduation Year: {alumni.graduationYear}</p>
              <p className="text-lg font-medium text-gray-700">Degree: {alumni.degree}</p>
              <p className="text-lg font-medium text-gray-700">Branch: {alumni.branch}</p>

              {/* ✅ Show full details only if approved */}
              {alumni.status === "Approved" ? (
                <>
                  <p className="text-lg font-medium text-gray-700">Company: {alumni.company || "Not provided"}</p>
                  <p className="text-lg font-medium text-gray-700">Job Title: {alumni.jobTitle || "Not provided"}</p>
                  <p className="text-lg font-medium text-gray-700">Experience: {alumni.experience || 0} years</p>
                  <p className="text-lg font-medium text-gray-700">Phone: {alumni.phoneNumber || "Not provided"}</p>
                  <p className="text-lg font-medium text-gray-700">
                    LinkedIn: {alumni.socialLinks?.linkedin ? (
                      <a href={alumni.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View Profile
                      </a>
                    ) : "Not provided"}
                  </p>
                </>
              ) : (
                <p className="text-red-500 font-medium">Approval required to view full details.</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {/* ✅ Show approve button only if not approved */}
            {alumni.status !== "Approved" && (
              <button
                onClick={approveAlumni}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Approve Alumni
              </button>
            )}
            <button
              onClick={deleteAlumni}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Alumni
            </button>
            <Link
              to="/admin/alumni-list"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniVerify;
