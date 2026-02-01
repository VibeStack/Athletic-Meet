import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "../../icons/index.jsx";
import { useNavigate } from "react-router-dom";
import { eventConfig } from "../../config/eventConfig.js";

// Registration Not Open Modal
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
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
          <h3
            className={`text-2xl font-black mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Registration Opens Soon!
          </h3>

          {/* Message */}
          <p
            className={`text-base mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You can register for the{" "}
            <span className="font-semibold">65th Annual Athletic Meet</span>{" "}
            starting from:
          </p>

          {/* Date Banner */}
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

          {/* Info */}
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
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

const Navbar = ({
  darkMode,
  setDarkMode,
  activeSection,
  scrollToSection,
  activePage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const navigate = useNavigate();

  const isRegistrationOpen = eventConfig.isRegistrationOpen();
  const registrationDate = eventConfig.getRegistrationStartDateFormatted();

  const navItems = [
    "Home",
    "Register",
    "Events",
    "Team",
    "Gallery",
    "FAQ",
    "Contact",
  ];

  const handleNavClick = (item) => {
    const id = item.toLowerCase();
    setMenuOpen(false);

    // If we're on a standalone page (like Gallery), navigate to home first
    if (activePage) {
      navigate("/");
      // After navigation, scroll to section (handled by home page)
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // On home page, scroll to section
      if (scrollToSection) {
        scrollToSection(id);
      }
    }
  };

  const handleAuthClick = (path) => {
    setMenuOpen(false);
    if (!isRegistrationOpen) {
      setShowRegistrationModal(true);
    } else {
      navigate(path);
    }
  };

  // Determine if an item is active
  const isActive = (item) => {
    const id = item.toLowerCase();
    if (activePage) {
      return id === activePage;
    }
    return activeSection === id;
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 backdrop-blur-xl ${
          darkMode ? "bg-gray-900/98 shadow-2xl" : "bg-white/98 shadow-2xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => handleNavClick("Home")}
            >
              <div className="relative">
                <img
                  src={
                    darkMode
                      ? "/images/dark_mode_logo.png"
                      : "/images/light_mode_logo.png"
                  }
                  alt="Logo"
                  className="w-12 h-12 rounded-2xl"
                />
              </div>
              <span className="font-black text-xl md:text-2xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Athletix
              </span>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-4 py-2 font-semibold text-sm transition-all duration-300 rounded-lg group ${
                    isActive(item)
                      ? "text-cyan-500"
                      : darkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${
                      isActive(item) ? "w-full" : "group-hover:w-full"
                    }`}
                  ></span>
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl transition-all duration-300 ${
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
              <button
                className={`relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden group cursor-pointer inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-300 ${
                  !isRegistrationOpen ? "opacity-90" : ""
                }`}
                onClick={() => handleAuthClick("/login")}
              >
                Login
              </button>
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 ${
            menuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          } ${darkMode ? "bg-gray-800" : "bg-white"} border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive(item)
                    ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white transform scale-105"
                    : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => handleAuthClick("/register")}
              className="relative overflow-hidden group cursor-pointer font-bold text-white rounded-xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 px-4 py-3 w-full sm:px-6 sm:py-3 sm:w-auto transition-transform duration-300 group-hover:scale-110"
            >
              Register
              {!isRegistrationOpen && (
                <span className="absolute top-1 right-2 text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full font-bold">
                  Soon
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Registration Not Open Modal */}
      {showRegistrationModal && (
        <RegistrationClosedModal
          darkMode={darkMode}
          onClose={() => setShowRegistrationModal(false)}
          registrationDate={registrationDate}
        />
      )}
    </>
  );
};

export default Navbar;
