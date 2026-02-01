import React, { useState } from "react";
import { ExternalLink } from "../../icons/index.jsx";
import { useNavigate } from "react-router-dom";
import ScheduleModal from "./ScheduleModal.jsx";
import RulesModal from "./RulesModal.jsx";

const Footer = ({ darkMode, scrollToSection }) => {
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const handleScrollTo = (id) => {
    scrollToSection(id);
  };

  return (
    <>
      <footer
        className={`py-8 sm:py-10 ${
          darkMode
            ? "bg-gray-900 border-t border-gray-800"
            : "bg-gray-50 border-t border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <div
                    className="flex items-center space-x-2 mb-2 cursor-pointer"
                    onClick={() => handleScrollTo("home")}
                  >
                    <img
                      src={
                        darkMode
                          ? "/images/dark_mode_logo.png"
                          : "/images/light_mode_logo.png"
                      }
                      alt="Logo"
                      className="w-10 h-10 rounded-lg"
                    />
                    <span className="font-black text-lg bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                      SprintSync
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Official platform for college athletic meets.
                  </p>
                </div>

                <div>
                  <h4
                    className={`font-semibold mb-2 text-xs uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Quick Links
                  </h4>
                  <ul className="space-y-1.5">
                    {["Home", "Events", "Register", "Gallery"].map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            if (item === "Gallery") {
                              navigate("/gallery");
                            } else {
                              scrollToSection(item.toLowerCase());
                            }
                          }}
                          className={`text-sm ${
                            darkMode
                              ? "text-gray-400 hover:text-cyan-400"
                              : "text-gray-600 hover:text-cyan-600"
                          } transition-colors`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4
                    className={`font-semibold mb-2 text-xs uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Resources
                  </h4>
                  <ul className="space-y-1.5">
                    <li>
                      <button
                        onClick={() => setShowRulesModal(true)}
                        className={`text-sm ${
                          darkMode
                            ? "text-gray-400 hover:text-cyan-400"
                            : "text-gray-600 hover:text-cyan-600"
                        } transition-colors`}
                      >
                        Rules
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className={`text-sm ${
                          darkMode
                            ? "text-gray-400 hover:text-cyan-400"
                            : "text-gray-600 hover:text-cyan-600"
                        } transition-colors`}
                      >
                        Schedule
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4
                    className={`font-semibold mb-2 text-xs uppercase tracking-wider ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Follow Us
                  </h4>
                  <div className="flex gap-2">
                    {[
                      {
                        icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                      },
                      {
                        icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                      },
                      {
                        icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 01-.899 1.382 3.744 3.744 0 01-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 01-1.379-.899 3.644 3.644 0 01-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
                      },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className={`p-2 rounded-lg transition-all ${
                          darkMode
                            ? "bg-gray-800 text-gray-500 hover:text-white hover:bg-gray-700"
                            : "bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d={social.icon} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div
                className={`p-3 rounded-xl h-full ${
                  darkMode
                    ? "bg-gray-800/50"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4
                    className={`font-semibold text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    📍 Event Location
                  </h4>
                  <a
                    href="https://maps.app.goo.gl/cifZ4pzRN5HLQUsJ8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                      darkMode
                        ? "text-cyan-400 hover:text-cyan-300"
                        : "text-cyan-600 hover:text-cyan-700"
                    }`}
                  >
                    Open Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2900.5692847593396!2d75.85840628259152!3d30.859124548052815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a828ff6aaaaab%3A0xc4fd6949a7f34411!2sGNDEC%20Athletic%20Sports%20ground!5e0!3m2!1sen!2sin!4v1763802622855!5m2!1sen!2sin"
                    width="100%"
                    height="140"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`pt-4 border-t text-center ${
              darkMode ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © 2026 SprintSync — Built for real college athletic events.
            </p>
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Designed & maintained with care by{" "}
              <a
                href="https://github.com/arshdeepanand"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${
                  darkMode ? "hover:text-cyan-400" : "hover:text-cyan-600"
                }`}
              >
                Arshdeep Anand
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleModal
          darkMode={darkMode}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
      {showRulesModal && (
        <RulesModal
          darkMode={darkMode}
          onClose={() => setShowRulesModal(false)}
        />
      )}
    </>
  );
};

export default Footer;
