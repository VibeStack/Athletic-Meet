import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Trophy } from "../../icons/index.jsx";
import galleryImages from "../../Data/galleryPageImages.json";
import { eventConfig } from "../../config/eventConfig.js";

// Helper to get optimized Cloudinary URL
const getOptimizedUrl = (url, width = 400) => {
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

// Registration Modal - same as home page
const RegistrationClosedModal = ({ darkMode, onClose, registrationDate }) => {
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6">
            <span className="text-5xl">🗓️</span>
          </div>
          <h3
            className={`text-2xl font-black mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Registration Opens Soon!
          </h3>
          <p
            className={`text-base mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You can register for the{" "}
            <span className="font-semibold">65th Annual Athletic Meet</span>{" "}
            starting from:
          </p>
          <div
            className={`inline-block px-6 py-4 rounded-2xl mb-6 ${
              darkMode
                ? "bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                : "bg-linear-to-r from-cyan-50 to-blue-50 border border-cyan-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-1 ${
                darkMode ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              Registration Start Date
            </p>
            <p
              className={`text-2xl font-black ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {registrationDate}
            </p>
          </div>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            ⏰ Mark your calendar and come back to register!
          </p>
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

const GalleryPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [showModal, setShowModal] = useState(false);

  const isRegistrationOpen = eventConfig.isRegistrationOpen();
  const registrationDate = eventConfig.getRegistrationStartDateFormatted();

  const handleImageLoad = (idx) => {
    setLoadedImages((prev) => ({ ...prev, [idx]: true }));
  };

  const handleLoginClick = () => {
    if (!isRegistrationOpen) {
      setShowModal(true);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Header - Matching home page exactly */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-xl ${
          darkMode ? "bg-gray-900/98 shadow-2xl" : "bg-white/98 shadow-2xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={
                  darkMode
                    ? "/images/dark_mode_logo.png"
                    : "/images/light_mode_logo.png"
                }
                alt="Logo"
                className="w-12 h-12 rounded-2xl"
              />
              <span className="font-black text-xl md:text-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Athletix
              </span>
            </div>

            {/* Right actions */}
            <div className="flex items-center space-x-3">
              {/* Dark mode toggle - rounded-xl */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Login button */}
              <button
                className={`relative px-6 py-3 rounded-lg font-bold text-white overflow-hidden group cursor-pointer inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 hover:scale-105 active:scale-95 ${
                  !isRegistrationOpen ? "opacity-95" : ""
                }`}
                onClick={handleLoginClick}
              >
                <span className="relative z-10">Login</span>
                {!isRegistrationOpen && (
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none z-20">
                    <div className="absolute -top-1 -right-1 bg-red-600 text-[6px] font-black text-white py-0.5 w-[140%] text-center uppercase tracking-tighter transform rotate-45 translate-x-[25%] translate-y-[50%] shadow-lg shadow-black/20 border-b border-white/20">
                      Soon
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      {/* Hero - Matching home page style */}
      <div
        className="relative overflow-hidden py-14 sm:py-20"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
            : "linear-gradient(135deg, #0891b2 0%, #6366f1 50%, #8b5cf6 100%)",
        }}
      >
        {/* Background image - sports complex */}
        <div
          className="absolute xl:-top-30 lg:-top-40 md:-top-45 sm:-top-40 -top-40 inset-0 opacity-15"
          style={{
            backgroundImage: "url('/images/sports_complex.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/50" />

        {/* Gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge - cyan gradient for better trophy visibility */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-6">
            <Trophy className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-bold text-white">
              GNDEC Annual Sports Championship
            </span>
          </div>

          {/* Title with gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            <span className="bg-linear-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
              Photo Gallery
            </span>
          </h1>

          {/* Year */}
          <p className="text-3xl sm:text-4xl font-black mb-4">
            <span className="bg-linear-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              2026
            </span>
          </p>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/80 font-medium">
            ✨ Captured moments of glory & determination
          </p>
        </div>
      </div>

      {/* Gallery */}
      <main
        className={`p-1 sm:p-2 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-1 sm:gap-2">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-1 sm:mb-2 group relative overflow-hidden rounded-lg cursor-pointer"
            >
              {!loadedImages[idx] && (
                <div
                  className={`absolute inset-0 animate-pulse ${
                    darkMode ? "bg-gray-800" : "bg-gray-300"
                  }`}
                />
              )}

              <img
                src={getOptimizedUrl(img.url, 500)}
                alt={`Photo ${idx + 1}`}
                loading={idx < 12 ? "eager" : "lazy"}
                onLoad={() => handleImageLoad(idx)}
                className={`w-full h-auto block group-hover:scale-105 transition-transform duration-500 ${
                  loadedImages[idx] ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-white">
                  {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-6 text-center ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <p
          className={`text-xs ${darkMode ? "text-gray-600" : "text-gray-400"}`}
        >
          © 2026 Athletix
        </p>
      </footer>

      {/* Registration Modal */}
      {showModal && (
        <RegistrationClosedModal
          darkMode={darkMode}
          onClose={() => setShowModal(false)}
          registrationDate={registrationDate}
        />
      )}
    </div>
  );
};

export default GalleryPage;
