import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Users,
  Timer,
  Star,
  Award,
  Trophy,
  X,
} from "../../icons/index.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import { useNavigate } from "react-router-dom";
import { eventConfig } from "../../config/eventConfig.js";

// Registration Not Open Modal (same as in Navbar)
const RegistrationClosedModal = ({ onClose, registrationDate }) => {
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

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative header */}
        <div className="h-2 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500" />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6">
            <span className="text-5xl">🗓️</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black mb-3 text-gray-900">
            Registration Opens Soon!
          </h3>

          {/* Message */}
          <p className="text-base mb-6 text-gray-600">
            You can register for the{" "}
            <span className="font-semibold">65th Annual Athletic Meet</span>{" "}
            starting from:
          </p>

          {/* Date Banner */}
          <div className="inline-block px-6 py-4 rounded-2xl mb-6 bg-linear-to-r from-cyan-50 to-blue-50 border border-cyan-200">
            <p className="text-sm font-medium mb-1 text-cyan-600">
              Registration Start Date
            </p>
            <p className="text-2xl font-black text-gray-900">
              {registrationDate}
            </p>
          </div>

          {/* Info */}
          <p className="text-sm mb-6 text-gray-500">
            ⏰ Mark your calendar and come back to register!
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl font-bold text-white bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

const Hero = ({ scrollToSection }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const isRegistrationOpen = eventConfig.isRegistrationOpen();
  const registrationDate = eventConfig.getRegistrationStartDateFormatted();

  const stats = [
    { value: "500+", label: "Athletes", icon: <Users className="w-8 h-8" /> },
    { value: "25+", label: "Events", icon: <Award className="w-8 h-8" /> },
    {
      value: "2",
      label: "Event Duration (Days)",
      icon: <Timer className="w-8 h-8" />,
    },
    { value: "10+", label: "Records", icon: <Star className="w-8 h-8" /> },
  ];

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (!isRegistrationOpen) {
      setShowRegistrationModal(true);
    } else {
      navigate("/register");
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-6 pb-20"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/95 via-purple-900/45 to-cyan-900/95 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] z-10"></div>
          <img
            src={`/images/sports_complex.png`}
            alt="sports_complex"
            className="w-full h-full object-cover scale-105 blur-sm"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-6xl mx-auto pt-20">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex gap-3 px-6 py-4 justify-center items-center bg-white/10 backdrop-blur-md rounded-full text-cyan-300 font-semibold text-sm border border-cyan-400/30">
              <Trophy className="w-6 h-6" />
              <p>GNDEC Annual Sports Championship</p>
            </div>
          </div>

          {/* Micro-subtext */}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 leading-tight">
            <span className="block bg-linear-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
              Athletic Championship
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 text-cyan-400 font-bold">
              2026
            </span>
          </h1>

          <CountdownTimer />

          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-cyan-100 font-light max-w-4xl mx-auto leading-relaxed px-4">
            "Champions aren't made in gyms. Champions are made from something
            they have deep inside them—a desire, a dream, a vision."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              className="group relative px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-base sm:text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 w-full sm:w-auto"
              onClick={handleRegisterClick}
            >
              <span className="relative z-10">Register Now</span>
              {!isRegistrationOpen && (
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                  <div className="absolute top-0 right-0 bg-red-600 text-[10px] font-black text-white py-1 w-[141%] text-center uppercase tracking-tighter transform rotate-45 translate-x-[30%] translate-y-[10%] shadow-lg shadow-black/20 border-b border-white/20">
                    Soon
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
            </button>
            <button
              onClick={() => scrollToSection("events")}
              className="relative px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 w-full sm:w-auto"
            >
              Explore Events
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative p-4 sm:p-6 bg-white/8 backdrop-blur-lg rounded-2xl border border-white/15 hover:bg-white/15 hover:border-white/25 transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="text-cyan-400 mb-2 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-cyan-200/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 cursor-pointer"
          onClick={() => scrollToSection("register")}
        >
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 hover:text-white transition-colors" />
        </div>
      </section>

      {/* Registration Not Open Modal */}
      {showRegistrationModal && (
        <RegistrationClosedModal
          onClose={() => setShowRegistrationModal(false)}
          registrationDate={registrationDate}
        />
      )}
    </>
  );
};

export default Hero;
