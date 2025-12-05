import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Trash2, Users, Calendar, MapPin, Plus } from "lucide-react"; 
import axios from "axios";
const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const onClose = () => {
    setSelectedEvent(null); 
  };
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("Unexpected API response format:", data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewEvent({ ...newEvent, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvent = async () => {
    const formData = new FormData();
    formData.append("name", newEvent.name);
    formData.append("date", newEvent.date);
    formData.append("location", newEvent.location);
    formData.append("description", newEvent.description);
    formData.append("image", newEvent.image);

    try {
      const response = await fetch(
        "http://localhost:5000/api/events/add-event",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to add event");

      const data = await response.json();
      setEvents([...events, data.event]);
      setNewEvent({
        name: "",
        date: "",
        location: "",
        description: "",
        image: null,
      });
      setImagePreview("");
      setShowForm(false);
      alert("Event added successfully!");
    } catch (error) {
      alert("Failed to add event.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete event.");
    }
  };
  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${eventId}/attendees`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const eventWithAttendees = events.find((e) => e._id === eventId);
      setSelectedEvent({
        ...eventWithAttendees,
        attendees: response.data || [],
      });
    } catch (error) {
      console.error("Error fetching attendees:", error);
      alert("Failed to fetch attendees");
    }
  };

  const handleViewAttendees = (event) => {
    setSelectedEvent(event);
    fetchAttendees(event._id); // Fetch attendees for the selected event
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
  <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Management</h1>

  <div className="flex justify-start">
    <button
      onClick={() => setShowForm(true)}
      className="mb-4 bg-green-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-800 transition font-semibold"
    >
      <Plus className="h-4 w-4" />  Add Event
    </button>
  </div>

        
        {loading && (
          <p className="text-center text-gray-500">Loading events...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {/* Modern Styled Event Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full max-w mx-auto border border-white">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
              Create New Event
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleChange}
                className="border p-3 rounded-md text-black shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Event Name"
              />
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
                className="border p-3 rounded-md text-black shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="description"
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                className="border p-3 rounded-md text-black shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
              />
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                className="border p-3 rounded-md text-black shadow-sm focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-3 text-black rounded-md shadow-sm"
              />
            </div>

            {imagePreview && (
              <div className="mt-4 flex text-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-full object-contain rounded-lg border shadow-md"
                />
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleAddEvent}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-800"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* Event Cards with Proper Background Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="relative rounded-xl shadow-md overflow-hidden transition-all hover:scale-105"
              style={{ height: "260px" }} 
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: event.image
                    ? `url(http://localhost:5000${event.image})`
                    : "url('/images/university.jpg')",
                }}
              ></div>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Content  */}
              <div className="relative z-10 flex flex-col h-full p-4 text-white">
                <h3 className="text-lg font-semibold">{event.name}</h3>

                {/* Date & Location */}
                <p className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                  <Calendar size={16} className="text-gray-400" /> {event.date}
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-300">
                  <MapPin size={16} className="text-gray-400" />{" "}
                  {event.location}
                </p>

                {/* Spacer (Pushing buttons to bottom) */}
                <div className="flex-grow"></div>

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-md shadow-md hover:bg-blue-800 transition-all"
                    onClick={() => handleViewAttendees(event)}
                  >
                    <Users size={18} /> View Attendees
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(event._id)} 
                    className="bg-red-600 p-2 rounded-full shadow-md hover:bg-red-800 transition-all"
                  >
                    <Trash2 size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendee Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Event Details & Attendees
              </h2>

              {/* Display Event Details */}
              <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                  Event:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedEvent.name}
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">Date:</span>{" "}
                  {selectedEvent.date}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {selectedEvent.location}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold text-gray-800">
                    Description:
                  </span>
                  <span className="italic text-gray-700">
                    {selectedEvent.description}
                  </span>
                </p>
              </div>

              {/* Display Attendees */}
              {selectedEvent.attendees?.length ? (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Total Attendees: {selectedEvent.attendees.length}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                      <thead className="bg-gray-700 text-white">
                        <tr>
                          <th className="px-4 py-2">#</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Role</th>
                          <th className="px-4 py-2">Graduation Year</th>
                          <th className="px-4 py-2">Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.attendees.map((attendee, i) => (
                          <tr
                            key={i}
                            className={`text-center ${
                              i % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <td className="px-4 text-black py-2">{i + 1}</td>
                            <td className="px-4 text-black py-2">
                              {attendee.name}
                            </td>
                            <td className="px-4 text-black py-2">
                              {attendee.email}
                            </td>
                            <td className="px-4 text-black py-2">
                              {attendee.role}
                            </td>
                            <td className="px-4 text-black py-2">
                              {attendee.graduationYear || "N/A"}
                            </td>
                            <td className="px-4 text-black py-2">
                              {attendee.phoneNumber || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No attendees yet.</p>
              )}

              <button
                onClick={onClose}
                className="w-full mt-4 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
