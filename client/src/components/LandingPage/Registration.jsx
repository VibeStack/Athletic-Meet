import React, { useState } from "react";
import {
  Zap,
  Users,
  Mail,
  Target,
  ChevronDown,
  Award,
  Book,
} from "../../icons/index.jsx";
import RulesModal from "./RulesModal.jsx";

const colorMap = {
  cyan: {
    text: "text-cyan-500",
    border: "border-cyan-500",
    from: "from-cyan-400",
    to: "to-cyan-600",
  },
  blue: {
    text: "text-blue-500",
    border: "border-blue-500",
    from: "from-blue-400",
    to: "to-blue-600",
  },
  purple: {
    text: "text-purple-500",
    border: "border-purple-500",
    from: "from-purple-400",
    to: "to-purple-600",
  },
  orange: {
    text: "text-orange-500",
    border: "border-orange-500",
    from: "from-orange-400",
    to: "to-orange-600",
  },
  green: {
    text: "text-green-500",
    border: "border-orange-500",
    from: "from-green-400",
    to: "to-green-600",
  },
};

const Registration = ({ darkMode }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  const registrationSteps = [
    {
      num: "01",
      icon: <Zap className="w-8 h-8" />,
      title: "Start Registration",
      desc: "Click the Register button on the top-right.",
      color: "cyan",
    },
    {
      num: "02",
      icon: <Users className="w-8 h-8" />,
      title: "Create Account",
      desc: "Sign up with your college email",
      color: "blue",
    },
    {
      num: "03",
      icon: <Mail className="w-8 h-8" />,
      title: "Verify Email",
      desc: "Confirm your registration via email",
      color: "purple",
    },
    {
      num: "04",
      icon: <Target className="w-8 h-8" />,
      title: "Select Events",
      desc: "Choose your preferred competitions",
      color: "orange",
    },
    {
      num: "05",
      icon: <Award className="w-8 h-8" />,
      title: "Get QR Code",
      desc: "Receive your unique QR & chest number",
      color: "green",
    },
  ];

  const ruleHighlights = [
    "3 events max (2 Track + 1 Field)",
    "Chest number mandatory",
    "No event changes after registration",
  ];

  return (
    <>
      <section
        id="register"
        className={`py-16 sm:py-20 md:py-24 ${
          darkMode ? "bg-gray-800" : "bg-linear-to-b from-gray-50 to-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-cyan-500/10 rounded-full text-cyan-500 font-semibold text-sm mb-4">
              🚀 Easy Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black p-4 bg-linear-to-r from-cyan-300 to-blue-800 bg-clip-text text-transparent">
              How to Register
            </h2>
            <p
              className={`text-lg sm:text-xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-center`}
            >
              Simple steps to join the competition
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {registrationSteps.map((step, idx) => {
              const colors = colorMap[step.color];

              return (
                <div
                  key={idx}
                  className={`relative p-6 sm:p-8 rounded-2xl ${
                    darkMode ? "bg-gray-900" : "bg-white"
                  } shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:${
                    colors.border
                  }`}
                >
                  <div
                    className={`absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${colors.from} ${colors.to} rounded-2xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                  >
                    {step.num}
                  </div>

                  <div
                    className={`mb-4 ${colors.text} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.icon}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {step.title}
                  </h3>

                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {step.desc}
                  </p>

                  {idx < registrationSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-1 top-1/2 transform -translate-y-1/2 text-gray-300">
                      <ChevronDown className="w-6 h-6 -rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Rules Card - integrated into Registration section */}
          <div className="mt-12 sm:mt-16">
            <div
              className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 ${
                darkMode
                  ? "bg-gray-900 border border-gray-700/50"
                  : "bg-white border border-gray-100 shadow-lg"
              }`}
            >
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                  {/* Icon */}
                  <div className="shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                      <Book className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl font-black mb-2">
                      <span className="bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                        Know the Rules
                      </span>
                    </h3>
                    <p
                      className={`text-sm sm:text-base mb-4 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Make sure you're prepared! Read all rules before
                      registering.
                    </p>

                    {/* Rule highlights */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
                      {ruleHighlights.map((rule, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-gray-800 text-gray-300 border border-gray-700"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {rule}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => setShowRulesModal(true)}
                      className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-linear-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                    >
                      <Book className="w-5 h-5" />
                      Read All Rules
                      <span className="opacity-60 group-hover:translate-x-0.5 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules Modal */}
      {showRulesModal && (
        <RulesModal
          darkMode={darkMode}
          onClose={() => setShowRulesModal(false)}
        />
      )}
    </>
  );
};

export default Registration;
