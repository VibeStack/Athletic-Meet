import React, { useState, useEffect } from "react";
import {
  TrophySimple,
  Zap,
  Users,
  ArrowRight,
  XIcon as X,
  Timer,
  Target,
  FieldIcon,
} from "../../icons/LandingPage/EventsIcons";

// Icon components for filter buttons
const FilterIcons = {
  all: ({ className }) => <Target className={className} />,
  track: ({ className }) => <Timer className={className} />,
  field: ({ className }) => <FieldIcon className={className} />,
  team: ({ className }) => <Users className={className} />,
};

// All events data - easy to update
const allEventsData = {
  day1: {
    date: "Thursday, 19th February 2026",
    events: [
      { name: "1500m", gender: "Boys & Girls", type: "Track" },
      { name: "100m", gender: "Boys & Girls", type: "Track" },
      { name: "Javelin Throw", gender: "Boys & Girls", type: "Field" },
      { name: "High Jump", gender: "Boys & Girls", type: "Field" },
      { name: "100m Hurdles", gender: "Girls", type: "Track" },
      { name: "110m Hurdles", gender: "Boys", type: "Track" },
      { name: "Shot Put", gender: "Boys & Girls", type: "Field" },
      { name: "Triple Jump", gender: "Boys & Girls", type: "Field" },
      { name: "400m", gender: "Boys & Girls", type: "Track" },
      { name: "5000m", gender: "Boys", type: "Track" },
      {
        name: "4x100m Inter Dept. Relay",
        gender: "Boys & Girls",
        type: "Team",
      },
      { name: "Tug of War", gender: "Boys & Girls", type: "Team" },
    ],
  },
  day2: {
    date: "Friday, 20th February 2026",
    events: [
      { name: "10000m", gender: "Boys", type: "Track" },
      { name: "3000m", gender: "Girls", type: "Track" },
      { name: "400m Hurdles", gender: "Boys & Girls", type: "Track" },
      { name: "Discus Throw", gender: "Boys & Girls", type: "Field" },
      { name: "Long Jump", gender: "Boys & Girls", type: "Field" },
      { name: "200m", gender: "Boys & Girls", type: "Track" },
      { name: "800m", gender: "Boys & Girls", type: "Track" },
      {
        name: "4x400m Inter Dept. Relay",
        gender: "Boys & Girls",
        type: "Team",
      },
      { name: "Hammer Throw", gender: "Boys", type: "Field" },
      { name: "Tug of War", gender: "Boys & Girls", type: "Team" },
    ],
  },
};

const Events = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [activeDay, setActiveDay] = useState("both");

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const signatureEvents = [
    {
      id: "1500m",
      title: "1500m Run",
      tagline: "Where endurance meets strategy",
      icon: "🏃",
      color: "from-red-500 to-rose-600",
    },
    {
      id: "100m",
      title: "100m Sprint",
      tagline: "The ultimate test of pure speed",
      icon: "🏃‍♂️",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "long-jump",
      title: "Long Jump",
      tagline: "Defy gravity with every leap",
      icon: "🏃‍♂️💨",
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const speedPowerEvents = [
    {
      id: "400m",
      title: "400m Race",
      tagline: "One lap. Maximum intensity",
      icon: "🏃‍♂️",
      color: "from-sky-400 to-blue-600",
    },
    {
      id: "shot-put",
      title: "Shot Put",
      tagline: "Explosive power unleashed",
      icon: "🤾🏽",
      color: "from-sky-500 to-blue-600",
    },
    {
      id: "110m-hurdles",
      title: "110m Hurdles",
      tagline: "Speed meets precision",
      icon: "🚧",
      color: "from-blue-400 to-blue-600",
    },
  ];

  const teamFunEvents = [
    {
      id: "tug-of-war",
      title: "Tug of War",
      tagline: "United strength wins the battle",
      icon: "🪢",
      color: "from-emerald-500 to-green-600",
    },
    {
      id: "4x100-relay",
      title: "4x100m Relay",
      tagline: "Speed passed hand to hand",
      icon: "🏃‍♂️➝🏃‍♂️",
      color: "from-green-500 to-teal-600",
    },
  ];

  // Filter events based on active filters
  const getFilteredEvents = () => {
    let events = [];

    if (activeDay === "both" || activeDay === "day1") {
      events = [
        ...events,
        ...allEventsData.day1.events.map((e) => ({ ...e, day: "Day 1" })),
      ];
    }
    if (activeDay === "both" || activeDay === "day2") {
      events = [
        ...events,
        ...allEventsData.day2.events.map((e) => ({ ...e, day: "Day 2" })),
      ];
    }

    if (activeTab !== "all") {
      events = events.filter((e) => e.type.toLowerCase() === activeTab);
    }

    return events;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Track":
        return "from-blue-500 to-cyan-500";
      case "Field":
        return "from-amber-500 to-orange-500";
      case "Team":
        return "from-emerald-500 to-green-500";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  // SVG icons for gender
  const GenderIcon = ({ gender }) => {
    const isBoys = gender.includes("Boys");
    const isGirls = gender.includes("Girls");

    if (isBoys && isGirls) {
      // Both - group icon
      return (
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-purple-500/20" : "bg-purple-100"}`}
        >
          <Users
            className={`w-4 h-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}
          />
        </div>
      );
    }
    if (isBoys) {
      return (
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}
        >
          <svg
            className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="6" r="4" />
            <path d="M12 12c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z" />
          </svg>
        </div>
      );
    }
    if (isGirls) {
      return (
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-pink-500/20" : "bg-pink-100"}`}
        >
          <svg
            className={`w-4 h-4 ${darkMode ? "text-pink-400" : "text-pink-600"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="6" r="4" />
            <path d="M12 12c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z" />
          </svg>
        </div>
      );
    }
    // Default - running icon
    return (
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
      >
        <Timer
          className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        />
      </div>
    );
  };

  const EventCard = ({ event }) => (
    <div
      className={`group relative p-6 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        darkMode
          ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700/50"
          : "bg-white border border-gray-100"
      }`}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${event.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div className="text-5xl mb-4 transform group-hover:-translate-y-1 group-hover:scale-110 transition-transform duration-300">
          {event.icon}
        </div>

        {/* Event Title */}
        <h4
          className={`text-xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {event.title}
        </h4>

        {/* Tagline */}
        <p
          className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          } mb-4`}
        >
          {event.tagline}
        </p>

        {/* Category tag */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r ${event.color} text-white`}
        >
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Track Event
        </span>
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, iconGradient }) => (
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`p-3 rounded-xl bg-linear-to-br ${iconGradient} shadow-lg`}
      >
        <Icon className="text-white w-5 h-5" />
      </div>
      <h3
        className={`text-2xl font-bold ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
    </div>
  );

  // Events Modal Component
  const EventsModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setShowModal(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl ${
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
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">
                <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  All Events
                </span>
              </h2>
              <p
                className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                65th Annual Athletic Meet • 19-20 February 2026
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filters - centered on mobile */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {/* Day Filter */}
            <div
              className={`flex gap-1 p-1 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              {[
                { id: "both", label: "Both Days" },
                { id: "day1", label: "Day 1" },
                { id: "day2", label: "Day 2" },
              ].map((day) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeDay === day.id
                      ? "bg-purple-500 text-white shadow-md"
                      : darkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Type Filter with SVG icons */}
            <div
              className={`flex gap-1 p-1 rounded-xl ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              {[
                { id: "all", label: "All" },
                { id: "track", label: "Track" },
                { id: "field", label: "Field" },
                { id: "team", label: "Team" },
              ].map((tab) => {
                const IconComponent = FilterIcons[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? "bg-pink-500 text-white shadow-md"
                        : darkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-700"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-300"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Events List - reduced height for visible footer */}
        <div className="overflow-y-auto max-h-[calc(90vh-220px)] p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {getFilteredEvents().map((event, idx) => (
              <div
                key={idx}
                className={`group p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? "bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50"
                    : "bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start gap-3">
                  <GenderIcon gender={event.gender} />
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-sm truncate ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {event.name}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {event.gender}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium bg-linear-to-r ${getTypeColor(event.type)} text-white`}
                  >
                    {event.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {event.day}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {getFilteredEvents().length === 0 && (
            <div
              className={`text-center py-12 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              <p className="text-4xl mb-3">🔍</p>
              <p>No events found for this filter</p>
            </div>
          )}
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
            className={`text-center text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Sports Complex, GNDEC Ludhiana • 19-20 February 2026
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section
        id="events"
        className={`py-16 sm:py-20 md:py-24 overflow-hidden ${
          darkMode ? "bg-gray-900" : "bg-linear-to-b from-gray-50 to-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span
              className={`inline-block px-5 py-2 rounded-full font-semibold text-sm mb-6 ${
                darkMode
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              ✨ Event Highlights
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Race. Jump. Throw.
              </span>
              <br />
              <span className={darkMode ? "text-white" : "text-gray-900"}>
                Compete.
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              The best competitions of Athletix 2026 — curated for champions
            </p>
          </div>

          {/* 🏆 Signature Events - Warm Amber Background */}
          <div
            className={`mb-10 p-6 rounded-2xl ${
              darkMode
                ? "bg-linear-to-br from-amber-900/20 to-orange-900/10"
                : "bg-linear-to-br from-amber-50 to-orange-50"
            }`}
          >
            <SectionHeader
              icon={TrophySimple}
              title="Signature Events"
              iconGradient="from-amber-500 to-orange-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {signatureEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* ⚡ Speed & Power - Sky Blue Background */}
          <div
            className={`mb-10 p-6 rounded-2xl ${
              darkMode
                ? "bg-linear-to-br from-sky-900/20 to-blue-900/10"
                : "bg-linear-to-br from-sky-50 to-blue-50"
            }`}
          >
            <SectionHeader
              icon={Zap}
              title="Speed & Power"
              iconGradient="from-sky-400 to-blue-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {speedPowerEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* 🎉 Team & Fun - Green Background */}
          <div
            className={`mb-10 p-6 rounded-2xl ${
              darkMode
                ? "bg-linear-to-br from-emerald-900/20 to-green-900/10"
                : "bg-linear-to-br from-emerald-50 to-green-50"
            }`}
          >
            <SectionHeader
              icon={Users}
              title="Team & Fun"
              iconGradient="from-emerald-500 to-green-600"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {teamFunEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* View All Events CTA */}
          <div className="text-center pt-4">
            <p
              className={`text-lg mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Want to explore all <span className="font-bold">35+ events</span>?
            </p>
            <p
              className={`text-sm mb-6 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              View the complete event list for 19th & 20th February
            </p>
            <button
              onClick={() => setShowModal(true)}
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500`}
            >
              View Full Event List
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && <EventsModal />}
    </>
  );
};

export default Events;
