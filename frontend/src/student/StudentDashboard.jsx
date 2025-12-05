import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { UsersIcon, CalendarIcon, BriefcaseIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-auto flex flex-col">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/acadamic.jpg')",
        }}
      >
        <div className="bg-black/60 w-full h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Welcome to Alumni Connect
          </h1>
          <p className="text-lg text-gray-300 mt-3 max-w-2xl">
            Stay connected, relive memories, and create new opportunities.
          </p>
          <div className="mt-6 flex space-x-4">
            <button
              className="px-6 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-500"
              onClick={() => navigate("/about")}
            >
              FIND OUT MORE
            </button>
            <button
              className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>

      {/* Why Stay Connected Section */}
      <div className="py-16 px-4 md:px-12 bg-gray-100 text-center mb-0">

        <h2 className="text-5xl font-bold text-amber-500">Why Stay Connected?</h2>
        <p className="text-gray-600 p-2 mt-3 max-w-2xl mx-auto text-lg">
          Your alumni network is more than just a connection—it’s a lifelong community.
        </p>

        {/* Benefits Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64">
            <UsersIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Reconnect with Alumni</h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Find your old classmates and relive cherished memories.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64">
            <CalendarIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Exclusive Alumni Meetups</h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Be part of reunions, gatherings, and special events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64">
            <BriefcaseIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Career & Mentorship</h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Get career guidance and mentorship from experienced alumni.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64">
            <LightBulbIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Meet With Industrial Experts</h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Inspire and learn from experts.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="text-center py-10 bg-white">

        <h2 className="text-4xl text-amber-500 font-semibold">Upcoming Events</h2>
        <div className="w-16 h-1 bg-amber-400 mx-auto mt-2 mb-6"></div>
        <p className="text-gray-700 text-lg mt-4">No Upcoming Event Available</p>
      </div>

      {/* Footer */}
      <Footer  />


    </div>
  );
};

export default StudentDashboard;
