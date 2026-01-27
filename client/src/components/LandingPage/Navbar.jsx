import React, { useState } from "react";
import { Sun, Moon, Menu, X, Trophy } from "../../icons/index.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({
  darkMode,
  setDarkMode,
  activeSection,
  scrollToSection,
  activePage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  // Determine if an item is active
  const isActive = (item) => {
    const id = item.toLowerCase();
    if (activePage) {
      return id === activePage;
    }
    return activeSection === id;
  };

  return (
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
              SprintSync
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
              className="relative px-6 py-3 rounded-xl font-bold text-white overflow-hidden group cursor-pointer inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-300"
              onClick={() => navigate("/register")}
            >
              Register
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
            onClick={() => navigate("/register")}
            className="relative overflow-hidden group cursor-pointer font-bold text-white rounded-xl bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 px-4 py-3 w-full sm:px-6 sm:py-3 sm:w-auto transition-transform duration-300 group-hover:scale-110"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
