import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../admin/Sidebar";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    alumniCount: 0,
    studentCount: 0,
    forumCount: 0,
    jobCount: 0,
    eventCount: 0,
    galleryCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/alumni/counts");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Failed to fetch dashboard counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden overflow-y-auto">
        {/* Header */}

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        {/* Content Grid */}
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Alumni Card */}
            <Card
              title="Alumni"
              count={counts.alumniCount}
              bgColor="bg-orange-100"
              iconColor="text-orange-500"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </Card>

            {/* Student Card */}
            <Card
              title="Students"
              count={counts.studentCount}
              bgColor="bg-yellow-100"
              iconColor="text-yellow-500"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5zm0 2l-9-5v6a2 2 0 002 2h14a2 2 0 002-2v-6l-9 5z"></path>
            </Card>

            {/* Forum Topics Card */}
            <Card
              title="Forum Topics"
              count={counts.forumCount}
              bgColor="bg-blue-100"
              iconColor="text-blue-500"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clipRule="evenodd"
              ></path>
            </Card>

            {/* Jobs Card */}
            <Card
              title="Posted Jobs"
              count={counts.jobCount}
              bgColor="bg-green-100"
              iconColor="text-green-500"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
            </Card>

            {/* Events Card */}
            <Card
              title="Upcoming Events"
              count={counts.eventCount}
              bgColor="bg-purple-100"
              iconColor="text-purple-500"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </Card>

            {/* Gallery Card */}
            <Card
              title="Gallery Items"
              count={counts.galleryCount}
              bgColor="bg-pink-100"
              iconColor="text-pink-500"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4a2 2 0 114 0 2 2 0 01-4 0zm-2 8l3.5-4.5 2.5 3 3.5-4.5L18 15H5z"></path>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

//  Reusable Card Component
const Card = ({ title, count, bgColor, iconColor, children }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-gray-700">
          {title} <span className="text-gray-400 text-sm">| Total</span>
        </h2>
      </div>
      <div className="flex items-center">
        <div className={`${bgColor} p-4 rounded-full`}>
          <svg
            className={`w-8 h-8 ${iconColor}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            {children}
          </svg>
        </div>
        <span className="text-black text-4xl ml-6 font-semibold">{count}</span>
      </div>
    </div>
  );
};

export default Dashboard;
