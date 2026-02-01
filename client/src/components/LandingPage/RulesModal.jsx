import React, { useEffect } from "react";
import { X, Book } from "../../icons/index.jsx";

// Rules data with emojis (restored per user request)
const rulesData = [
  {
    icon: "🏃",
    title: "Event Participation Limit",
    description:
      "An Athlete can take part in 3 events (2 Track & 1 Field or vice-versa)",
  },
  {
    icon: "🎽",
    title: "Chest Number Requirement",
    description: "Chest number mandatory for participation",
  },
  {
    icon: "🚫",
    title: "No Event Changes",
    description:
      "No change in the events will be entertained after registration",
  },
  {
    icon: "📋",
    title: "Chest Number Collection",
    description:
      "Registered athletes can collect their Chest number from 17th February 2026 (12 PM onwards) at Sports Complex",
  },
  {
    icon: "💬",
    title: "Support & Assistance",
    description:
      "For any issues or concerns, please fill out the contact form. We're here to help and ensure a smooth and enjoyable experience for everyone.",
  },
];

const RulesModal = ({ darkMode, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-5 border-b ${
            darkMode
              ? "bg-gray-900/95 border-gray-800"
              : "bg-white/95 border-gray-100"
          } backdrop-blur-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-linear-to-br from-red-500 to-orange-500">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  <span className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    Rules & Guidelines
                  </span>
                </h2>
                <p
                  className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  65th Annual Athletic Meet 2026
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all hover:scale-110 ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Rules Content - reduced height for visible footer */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          <div className="space-y-4">
            {rulesData.map((rule, idx) => (
              <div
                key={idx}
                className={`group p-5 rounded-2xl transition-all hover:scale-[1.01] ${
                  darkMode
                    ? "bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50"
                    : "bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-lg"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`text-3xl p-2 rounded-xl ${
                      darkMode ? "bg-gray-700/50" : "bg-white shadow-sm"
                    }`}
                  >
                    {rule.icon}
                  </span>
                  <div className="flex-1">
                    <h4
                      className={`font-bold text-base mb-1 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {rule.title}
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Note */}
          <div
            className={`mt-6 p-4 rounded-xl ${
              darkMode
                ? "bg-amber-500/10 border border-amber-500/20"
                : "bg-amber-50 border border-amber-200"
            }`}
          >
            <p
              className={`text-sm text-center ${
                darkMode ? "text-amber-300" : "text-amber-700"
              }`}
            >
              ⚠️ Please read and follow all rules carefully. Violation may
              result in disqualification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t ${
            darkMode
              ? "bg-gray-800/50 border-gray-800"
              : "bg-gray-50 border-gray-100"
          }`}
        >
          <p
            className={`text-center text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            19-20 February 2026 • Sports Complex, GNDEC
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
