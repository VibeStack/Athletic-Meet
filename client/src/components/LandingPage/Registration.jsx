import React from "react";
import {
  Zap,
  Users,
  Mail,
  Target,
  ChevronDown,
  Award,
} from "../../icons/index.jsx";

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

  return (
    <section
      id="register"
      className={`py-16 sm:py-20 md:py-24 ${darkMode ? "bg-gray-800" : "bg-linear-to-b from-gray-50 to-white"
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
            className={`text-lg sm:text-xl ${darkMode ? "text-gray-400" : "text-gray-600"
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
                className={`relative p-6 sm:p-8 rounded-2xl ${darkMode ? "bg-gray-900" : "bg-white"
                  } shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 group border-2 border-transparent hover:${colors.border
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
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"
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
      </div>
    </section>
  );
};

export default Registration;
