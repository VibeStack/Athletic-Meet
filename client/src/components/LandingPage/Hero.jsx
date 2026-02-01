import React from "react";
import {
  ChevronDown,
  Users,
  Timer,
  Star,
  Award,
  Trophy,
} from "../../icons/index.jsx";
import CountdownTimer from "./CountdownTimer.jsx";
import { useNavigate } from "react-router-dom";

const Hero = ({ scrollToSection }) => {
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

  return (
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
            <p>Annual Sports Championship</p>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 leading-tight">
          <span className="block bg-linear-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
            Athletic Meet
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 text-cyan-400 font-bold">
            2026
          </span>
        </h1>

        {/* Micro-subtext */}
        <p className="text-sm sm:text-base text-cyan-200/80 font-medium tracking-wide mb-6">
          GNDEC Annual Inter-College Athletic Championship
        </p>

        <CountdownTimer />

        <p className="text-lg sm:text-xl md:text-2xl mb-10 text-cyan-100 font-light max-w-4xl mx-auto leading-relaxed px-4">
          "Champions aren't made in gyms. Champions are made from something they
          have deep inside them—a desire, a dream, a vision."
        </p>

        <div className="flex flex-col gap-4 items-center mb-16">
          {/* Buttons wrapper with shared width */}
          <div className="flex sm:flex-row gap-4 w-full max-w-md">
            <button
              className="group relative w-full px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-base sm:text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
              onClick={() => navigate("/register")}
            >
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
            </button>

            <button
              className="group relative w-full px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-base sm:text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25"
              onClick={() => navigate("/login")}
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
            </button>
          </div>

          {/* Explore Events — same width */}
          <button
            onClick={() => scrollToSection("events")}
            className="w-full max-w-md px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-full font-bold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300"
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
  );
};

export default Hero;
