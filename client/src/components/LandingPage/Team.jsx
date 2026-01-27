import React from "react";
import { Github } from "../../icons/index.jsx";

const Team = ({ darkMode }) => {
  // Current Solo Developer
  const developer = {
    name: "Arshdeep Anand",
    role: "Full-Stack Developer",
    tagline: "Solo Creator of SprintSync 2026",
    image: "/images/MyProfessionalPic.png",
    github: "https://github.com/vibestack",
    linkedin: "https://www.linkedin.com/in/arshdeep-anand-600865288/",
    website: "https://vibestack.netlify.app/",
  };

  const techStack = [
    { name: "React" },
    { name: "Node.js" },
    { name: "MongoDB" },
    { name: "Express" },
  ];

  const stats = [
    { value: "20+", label: "Features" },
    { value: "3+", label: "Months" },
    { value: "100%", label: "Ownership" },
  ];

  const highlights = [
    "QR-based attendance",
    "MERN stack",
    "Real college events",
    "Mobile-first design",
  ];

  return (
    <section
      id="team"
      className={`py-14 sm:py-20 md:py-24 relative overflow-hidden ${
        darkMode
          ? "bg-gray-900"
          : "bg-linear-to-br from-blue-50/80 via-white to-purple-50/80"
      }`}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            darkMode ? "bg-cyan-900/20" : "bg-cyan-200/40"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            darkMode ? "bg-purple-900/20" : "bg-purple-200/40"
          }`}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========== CURRENT DEVELOPER SECTION ========== */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Profile Card */}
          <div className="w-full flex justify-center lg:order-2 lg:justify-end">
            <div
              className={`rounded-2xl overflow-hidden w-full max-w-[320px] sm:max-w-[360px] transition-all duration-500 hover:-translate-y-1 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700 hover:border-purple-500/50"
                  : "bg-white border-2 border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10"
              }`}
            >
              <div className="p-3 sm:p-4 pb-0">
                <img
                  src={developer.image}
                  alt={developer.name}
                  className="w-full h-52 sm:h-64 object-cover rounded-xl"
                />
              </div>

              <div className="p-4 sm:p-5 pt-4">
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-0.5 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {developer.name}
                </h3>

                <p className="text-purple-600 font-semibold text-sm sm:text-base mb-0.5">
                  {developer.role}
                </p>
                <p
                  className={`text-xs sm:text-sm mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {developer.tagline}
                </p>

                <div className="flex flex-col gap-2.5">
                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
                  >
                    <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    View GitHub
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] border-2 ${
                        darkMode
                          ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                          : "border-blue-500 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={developer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] border-2 ${
                        darkMode
                          ? "border-purple-500 text-purple-400 hover:bg-purple-500/10"
                          : "border-purple-500 text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:order-1">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 ${
                darkMode
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-linear-to-r from-purple-500/10 to-blue-500/10 text-purple-600"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              👨‍💻 Current Developer
            </span>

            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight ${
                darkMode ? "text-white" : ""
              }`}
            >
              Built & Maintained by a{" "}
              <span className="bg-linear-to-br from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent bg-size-[200%_auto] animate-gradient">
                Solo Developer
              </span>
            </h2>

            <p
              className={`text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              For 2026, SprintSync is redesigned, rebuilt, and enhanced by a
              single full-stack developer with a focus on{" "}
              <span className="font-semibold text-purple-600">performance</span>{" "}
              and{" "}
              <span className="font-semibold text-blue-600">
                user experience
              </span>
              .
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-white/80 hover:bg-white shadow-md sm:shadow-lg hover:shadow-xl"
                  }`}
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div
                    className={`text-[10px] sm:text-xs md:text-sm mt-0.5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-8">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white shadow-md hover:shadow-lg text-gray-700"
                  }`}
                >
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default Team;
