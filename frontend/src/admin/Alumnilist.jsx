import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
const API_URL = import.meta.env.VITE_API_URL;

const AlumniList = () => {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch(`${API_URL}
/api/alumni/`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAlumniData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Alumni Dashboard</h1>
       

        {/* Alumni List Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Alumni List</h2>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-blue-600 font-semibold">
              Loading alumni...
            </div>
          )}

          {/* Error Handling */}
          {error && (
            <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>
          )}

          {/* Alumni Table */}
          {!loading && !error && (
            <>
              {alumniData.length === 0 ? (
                <p className="text-gray-600 text-center">No alumni found.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-200 shadow-sm">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Batch</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {alumniData.map((alumnus) => (
                      <tr key={alumnus._id} className="border-b hover:bg-gray-100">
                        <td className="py-3 px-4">{alumnus.name}</td>
                        <td className="py-3 px-4">{alumnus.email}</td>
                        <td className="py-3 px-4">{alumnus.graduationYear}</td>
                        <td className="py-3 px-4">
                          {alumnus.status === "Approved" ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                              Verified
                            </span>
                          ) : (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link to={`/admin/alumni-verify/${alumnus._id}`}>
                            <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                              View
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniList;
