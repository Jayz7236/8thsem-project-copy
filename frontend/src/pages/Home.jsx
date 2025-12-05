import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  CalendarIcon,
  BriefcaseIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { motion } from "framer-motion"; // Import motion
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}
/api/events`);
        const today = new Date();

        const filtered = res.data.filter(
          (event) => new Date(event.date) > today
        );

        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        setUpcomingEvents(filtered);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (id) => {
    navigate(`/events`);
  };
  const handleCardClick = (page) => {
    navigate(`/${page}`);
  };


  return (
    <div className="w-full h-auto flex  bg-amber-50 flex-col pt-22">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with motion */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/acadamic.jpg')",
        }}
      >
        <div className="bg-black/60 w-full h-full flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl font-bold text-white drop-shadow-lg"
          >
            Welcome to Alumni Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg text-gray-300 mt-3 max-w-2xl"
          >
            Stay connected, relive memories, and create new opportunities.
          </motion.p>
          <div className="mt-6 flex space-x-4">
            <motion.button
              className="px-6 py-2 bg-amber-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-500"
              onClick={() => navigate("/about")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              FIND OUT MORE
            </motion.button>
          </div>
        </div>
      </div>

      {/* Why Stay Connected Section */}
      <div className="py-16 px-4 md:px-12 bg-gray-100 text-center mb-0">
        <h2 className="text-5xl font-bold text-amber-500">
          Why Stay Connected?
        </h2>
        <p className="text-gray-600 p-2 mt-3 max-w-2xl mx-auto text-lg">
          Your alumni network is more than just a connection—it’s a lifelong
          community.
        </p>

        {/* Benefits Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
          <div
            onClick={() => handleCardClick("alumni")}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <UsersIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Reconnect with Friends
            </h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Find your old classmates and relive cherished memories.
            </p>
          </div>
          <div
            onClick={() => handleCardClick("events")}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <CalendarIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Exclusive Alumni Meetups
            </h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Be part of reunions, gatherings, and special events.
            </p>
          </div>
          <div
            onClick={() => handleCardClick("forums")}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <BriefcaseIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Career & Mentorship
            </h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Get career guidance and mentorship from experienced alumni.
            </p>
          </div>
          <div
            onClick={() => handleCardClick("jobs")}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-64 h-64 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <LightBulbIcon className="h-14 w-14 text-amber-500" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Give Back to Juniors
            </h3>
            <p className="text-gray-600 mt-4 text-sm text-center">
              Inspire and guide the next generation of students.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="text-center py-10 bg-white min-h-[400px] px-4">
        <h2 className="text-4xl text-amber-500 font-semibold">
          Upcoming Events
        </h2>
        <div className="w-16 h-1 bg-amber-400 mx-auto mt-2 mb-6"></div>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-700 text-xl  mt-30">
            No Upcoming Event Available
          </p>
        ) : (
          <>
            <div className="flex justify-center flex-wrap gap-6">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate("/events")}
                  className="relative cursor-pointer w-72 h-80 overflow-hidden rounded-lg shadow-md"
                >
                  <img
                    src={
                      event.image
                        ? `${API_URL}
${event.image}`
                        : "/images/university.jpg"
                    }
                    alt={event.name}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/images/university.jpg")}
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold">{event.name}</h3>
                    <p className="text-sm">
                      {new Date(event.date).toDateString()} | {event.location}
                    </p>
                    <button
                      className={`mt-3 ${
                        event.attendees?.includes(user._id)
                          ? "bg-gray-500"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-black px-4 py-2 rounded-lg transition`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!event.attendees?.includes(user._id)) {
                          handleJoinEvent(event._id);
                        } else {
                          setSelectedEvent(event);
                        }
                      }}
                      disabled={event.attendees?.includes(user._id)}
                    >
                      {event.attendees?.includes(user._id)
                        ? "Joined!"
                        : "Join Event"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {upcomingEvents.length > 3 && (
              <div className="mt-6">
                <button
                  onClick={() => navigate("/events")}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded"
                >
                  View All Events
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
