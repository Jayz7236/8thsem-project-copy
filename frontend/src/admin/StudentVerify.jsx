import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const StudentVerify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch student data
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`);
        if (!response.ok) {
          throw new Error("Student not found");
        }
        const data = await response.json();

        // Ensure the avatar path is correct (prepend base URL if it's a relative path)
        if (data.avatar && !data.avatar.startsWith("http")) {
          data.avatar = `http://localhost:5000${data.avatar}`; // Prepend the base URL
        }

        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // Approve Student
  const approveStudent = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to approve student");
      }
  
      // ✅ Redirect to Student List after approval
      navigate("/admin/student-list", { state: { approvedStudentId: id } });
    } catch (error) {
      console.error("Error approving student:", error);
      alert("Something went wrong.");
    }
  };

  // Delete Student
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete student");
      }
  
      alert("Student deleted successfully");
      navigate("/admin/student-list"); // Redirect to student list
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-blue-500 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <header className="bg-white shadow-sm py-2 px-4 flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Student Profile</h1>
          <Link to="/admin/student-list">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
              Back to Student List
            </button>
          </Link>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-6">
            {/* Display Avatar */}
            {student.avatar && (
              <img
                src={student.avatar} // Avatar now has the correct full path
                alt="Student Avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-300"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-4">{student.name}</h2>
              <p className="text-gray-700 mb-2"><strong>Email:</strong> {student.email}</p>
              <p className="text-gray-700 mb-2"><strong>Batch:</strong> {student.batch}</p>
              <p className="text-gray-700 mb-2"><strong>Company:</strong> {student.company}</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> {student.phoneNumber}</p>
              <p className="text-gray-700 mb-2"><strong>Experience:</strong> {student.experience} years</p>
              <p className="text-gray-700 mb-2"><strong>Job Title:</strong> {student.jobTitle}</p>
              <p className="text-gray-700 mb-2"><strong>Areas of Interest:</strong> {student.areasOfInterest}</p>
              <p className="text-gray-700 mb-2"><strong>Degree:</strong> {student.degree}</p>
              <p className="text-gray-700 mb-2"><strong>Graduation Year:</strong> {student.graduationYear}</p>
              <p className="text-gray-700 mb-2">
                <strong>Status:</strong> {student.status === "Approved" ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs ml-2">Approved</span>
                ) : (
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs ml-2">{student.status}</span>
                )}
              </p>
            </div>
          </div>

          {/* Approve & Delete Buttons */}
          <div className="mt-4 space-x-3">
            {student.status !== "Approved" && (
              <button
                onClick={() => approveStudent(student._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentVerify;
