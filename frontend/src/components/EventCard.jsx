import React from "react";
const API_URL = import.meta.env.VITE_API_URL;

const EventCard = ({ event, userId, activeTab, onJoin, onClick }) => {
  const hasJoined = event.attendees?.includes(userId);

  return (
    <div
      className="min-w-[300px] max-w-[320px] w-full relative rounded-lg overflow-hidden shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
      onClick={() => onClick(event)}
    >
      <img
        src={
          event.image
            ? `${API_URL}
${event.image}`
            : "/images/university.jpg"
        }
        alt={event.name}
        className="w-full h-56 object-cover"
        onError={(e) => (e.target.src = "/images/university.jpg")}
      />

      <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 text-white">
        <h3 className="text-xl font-bold">{event.name}</h3>
        <p className="text-sm">{event.date} | {event.location}</p>
        <button
          className={`mt-3 ${
            hasJoined
              ? "bg-gray-500"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-black px-4 py-2 rounded-lg transition`}
          onClick={(e) => {
            e.stopPropagation();
            if (activeTab === "Upcoming" && !hasJoined) {
              onJoin(event._id);
            } else {
              onClick(event);
            }
          }}
          disabled={activeTab === "Upcoming" && hasJoined}
        >
          {hasJoined
            ? "Joined!"
            : activeTab === "Upcoming"
            ? "Join Event"
            : "View Details"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
