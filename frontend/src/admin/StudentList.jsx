import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/students/");
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
       
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
        

        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Student List</h2>

          {/* Loading & Error Handling */}
          {loading && <p className="text-gray-600">Loading students...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Student Table */}
          {!loading && !error && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200 shadow-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                    <th className="py-3 px-4 text-left">NAME</th>
                    <th className="py-3 px-4 text-left">EMAIL</th>
                    <th className="py-3 px-4 text-left">graduationYear</th>
                    <th className="py-3 px-4 text-left">STATUS</th>
                    <th className="py-3 px-4 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {students.map((student) => (
                    <tr key={student._id} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4 ">{student.name}</td>
                      <td className="py-2 px-4 ">{student.email}</td>
                      <td className="py-2 px-4 ">{student.graduationYear || "N/A"}</td>
                      <td className="py-2 px-4 ">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === "Approved" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                          }`}
                        >
                          {student.status === "Approved" ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center ">
                        <button
                          onClick={() => navigate(`/admin/student-verify/${student._id}`, { state: { student } })}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No students found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
