import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
const API_URL = import.meta.env.VITE_API_URL;

const Events = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  //  Fetch Events from Backend
  useEffect(() => {
    axios
      .get(`${API_URL}
/api/events`)
      .then(({ data }) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  //  Join Event

  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please login to join the event!");

      const { data } = await axios.post(
        `${API_URL}
/api/events/join`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(data.message || "Successfully joined the event!");

      //  This update the event data with the new attendee
      setEvents(
        events.map((event) =>
          event._id === eventId
            ? { ...event, attendees: [...(event.attendees || []), user._id] }
            : event
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to join event");
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 pt-22">
      <Navbar />

      {/* Header Section */}
      <div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/acadamic.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold"
          >
            Events & Gatherings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-2 text-lg"
          >
            Connect with alumni through exciting events!
          </motion.p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8 space-x-4">
        {["Upcoming", "Completed"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 text-lg font-semibold rounded-lg transition 
              ${
                activeTab === tab
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-gray-800 hover:bg-amber-200"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Events
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="max-w-6xl min-h-[300px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-4">
        {events.filter((event) => {
          const today = new Date();
          const eventDate = new Date(event.date);
          return activeTab === "Upcoming"
            ? eventDate >= today
            : eventDate < today;
        }).length === 0 ? (
          <div className="col-span-full flex justify-center items-center ">
            <p className="text-gray-700 text-xl">No Upcoming Event Available</p>
          </div>
        ) : (
          events
            .filter((event) => {
              const today = new Date();
              const eventDate = new Date(event.date);
              return activeTab === "Upcoming"
                ? eventDate >= today
                : eventDate < today;
            })
            .map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userId={user._id}
                activeTab={activeTab}
                onJoin={handleJoinEvent}
                onClick={setSelectedEvent}
                isJoined={event.attendees?.includes(user._id)} 
                showJoinButton={
                  activeTab === "Upcoming" &&
                  !event.attendees?.includes(user._id)
                } // Only show for upcoming events and if not already joined
              />
            ))
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl"
              onClick={() => setSelectedEvent(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mt-4">{selectedEvent.name}</h2>
            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
            <p className="text-gray-500 text-sm">
              {selectedEvent.date} | {selectedEvent.location}
            </p>
            {/* Show Join Event Button Only for Upcoming Events */}
            {activeTab === "Upcoming" &&
              !selectedEvent.attendees?.includes(user._id) && (
                <button
                  className={`mt-4 ${
                    selectedEvent.attendees?.includes(user._id)
                      ? "bg-gray-500"
                      : "bg-blue-600 hover:bg-blue-700"
                  } 
                text-white px-4 py-2 rounded-lg transition`}
                  onClick={() => handleJoinEvent(selectedEvent._id)}
                  disabled={selectedEvent.attendees?.includes(user._id)} 
                >
                  {selectedEvent.attendees?.includes(user._id)
                    ? "Joined!"
                    : "Join Event"}
                </button>
              )}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Events;
