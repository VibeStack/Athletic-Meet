import React, { useEffect, useState } from "react";
import { X, Calendar, Clock } from "../../icons/index.jsx";

// Schedule data - easy to update
const scheduleData = {
  day1: {
    date: "Thursday, 19th February 2026",
    shortDate: "19th Feb",
    ceremony: {
      type: "Opening Ceremony & Prize Distribution",
      time: "9:30 AM",
    },
    events: [
      { num: 1, name: "1500m Final", category: "Boys & Girls" },
      { num: 2, name: "100m Heats", category: "Boys & Girls" },
      { num: 3, name: "Javelin Throw", category: "Boys & Girls" },
      { num: 4, name: "High Jump Final", category: "Boys & Girls" },
      { num: 5, name: "100m Hurdles Final", category: "Girls" },
      { num: 6, name: "110m Hurdles Final", category: "Boys" },
      { num: 7, name: "Shot Put Final", category: "Boys & Girls" },
      { num: 8, name: "Triple Jump Final", category: "Boys & Girls" },
      { num: 9, name: "400m Final", category: "Girls" },
      { num: 10, name: "400m Heats", category: "Boys" },
      { num: 11, name: "100m Semi-Final", category: "Boys & Girls" },
      { num: 12, name: "5000m Final", category: "Boys" },
      { num: 13, name: "4x100m Inter-Dept. Relay", category: "Girls & Boys" },
      { num: 14, name: "100m Class IV Employee Race", category: "Open" },
      { num: 15, name: "Tug of War Semis", category: "Boys & Girls" },
    ],
  },
  day2: {
    date: "Friday, 20th February 2026",
    shortDate: "20th Feb",
    ceremony: {
      type: "Closing Ceremony & Prize Distribution",
      time: "4:00 PM",
    },
    events: [
      { num: 16, name: "10,000m Final", category: "Boys" },
      { num: 17, name: "3000m Final", category: "Girls" },
      { num: 18, name: "100m Final", category: "Boys & Girls" },
      { num: 19, name: "400m Hurdles Final", category: "Boys & Girls" },
      { num: 20, name: "Discus Throw Final", category: "Boys & Girls" },
      { num: 21, name: "Long Jump Final", category: "Boys & Girls" },
      { num: 22, name: "200m Heat", category: "Boys & Girls" },
      { num: 23, name: "800m Final", category: "Boys & Girls" },
      { num: 24, name: "4x400m Inter-Dept. Relay Race", category: "Girls" },
      {
        num: 25,
        name: "4x100m Inter-Dept. Relay Race (Faculty)",
        category: "Faculty",
      },
      { num: 26, name: "Hammer Throw Final", category: "Boys" },
      { num: 27, name: "400m Final", category: "Boys" },
      { num: 28, name: "200m Final", category: "Boys & Girls" },
      { num: 29, name: "Tug of War Final", category: "Boys " },
      { num: 30, name: "4x400m Inter-Dept. Relay Race", category: "Boys" },
    ],
  },
};

const ScheduleModal = ({ darkMode, onClose }) => {
  const [activeDay, setActiveDay] = useState("day1");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const currentDay = scheduleData[activeDay];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-5 border-b ${
            darkMode
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-100"
          } backdrop-blur-md`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Event Schedule
                  </span>
                </h2>
                <p
                  className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  65th Annual Athletic Meet 2026
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-transform hover:scale-110 ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Day Tabs */}
          <div className="flex gap-2">
            {["day1", "day2"].map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-transform ${
                  activeDay === day
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : darkMode
                      ? "bg-gray-800 text-gray-400 hover:text-white"
                      : "bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="block text-base">
                  {scheduleData[day].shortDate}
                </span>
                <span className="text-xs opacity-75 hidden sm:block">
                  {day === "day1" ? "Thursday" : "Friday"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Ceremony Banner */}
          <div
            className={`mb-6 p-4 rounded-2xl ${
              activeDay === "day1"
                ? "bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
                : "bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock
                className={`w-5 h-5 ${activeDay === "day1" ? "text-green-500" : "text-amber-500"}`}
              />
              <div>
                <p
                  className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {currentDay.ceremony.type}
                </p>
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {currentDay.ceremony.time}
                </p>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-2">
            {currentDay.events.map((event) => (
              <div
                key={event.num}
                className={`flex items-center gap-4 p-4 rounded-xl transition-transform hover:scale-[1.01] ${
                  darkMode
                    ? "bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50"
                    : "bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {event.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {event.name}
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                    event.category.includes("Boys") &&
                    event.category.includes("Girls")
                      ? "bg-purple-500/15 text-purple-500"
                      : event.category.includes("Boys")
                        ? "bg-blue-500/15 text-blue-500"
                        : event.category.includes("Girls")
                          ? "bg-pink-500/15 text-pink-500"
                          : "bg-gray-500/15 text-gray-500"
                  }`}
                >
                  {event.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${
            darkMode
              ? "bg-gray-800/50 border-gray-800"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <p
            className={`text-center text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            📍 Sports Complex, GNDEC Ludhiana
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
