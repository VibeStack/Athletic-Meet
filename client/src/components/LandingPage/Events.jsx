import React from "react";
import { TrophySimple, Zap, Users, ArrowRight } from "../../icons/index.jsx";
import { useNavigate } from "react-router-dom";

const Events = ({ darkMode }) => {
  const navigate = useNavigate();

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
      title: "4×100m Relay",
      tagline: "Speed passed hand to hand",
      icon: "🏃‍♂️➝🏃‍♂️",
      color: "from-green-500 to-teal-600",
    },
  ];

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

  return (
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
            Want to explore all <span className="font-bold">20+ events</span>?
          </p>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Log in to view the complete event list and register
          </p>
          <button
            onClick={() => navigate("/login")}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500`}
          >
            View Full Event List
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;
