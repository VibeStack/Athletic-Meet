import React, { useState } from "react";
import { ChevronDown } from "../../icons/index.jsx";

const FAQ = ({ darkMode, scrollToSection }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      icon: "🔑",
      q: "How do I get my QR code and chest number?",
      a: "After successful registration and event selection, your QR code and chest number will be generated automatically. You can download it from your profile or receive it via email.",
      featured: true,
    },
    {
      icon: "🕒",
      q: "When do the events start?",
      a: "The athletic meet begins on March 15th at 8:00 AM with the opening ceremony. Individual events will run from March 16-18 according to the schedule.",
    },
    {
      icon: "🏃",
      q: "Can I register for multiple events?",
      a: "Yes! You can register for up to 3 individual events and unlimited team events, subject to time slot availability.",
    },
    {
      icon: "🎒",
      q: "What should I bring on event day?",
      a: "Bring your college ID, QR code (printed or digital), athletic gear, water bottle, and your chest number badge.",
    },
    {
      icon: "💳",
      q: "Is there a registration fee?",
      a: "No, participation is completely free for all enrolled students. Just register and show up!",
    },
  ];

  return (
    <section
      id="faq"
      className={`py-16 sm:py-20 md:py-24 ${
        darkMode ? "bg-gray-800" : "bg-linear-to-b from-teal-50/50 to-white"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-4 py-2 bg-green-500/10 rounded-full text-green-500 font-semibold text-sm mb-4">
            ❓ Help Center
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p
            className={`text-lg sm:text-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            } max-w-xl mx-auto`}
          >
            Everything you need to know before registering and attending the
            event
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                darkMode
                  ? "bg-gray-900 hover:bg-gray-900/80"
                  : "bg-white hover:shadow-md"
              } ${
                openFaq === idx
                  ? darkMode
                    ? "ring-2 ring-teal-500 shadow-lg"
                    : "ring-2 ring-teal-500 shadow-lg"
                  : darkMode
                    ? "border border-gray-700"
                    : "border border-gray-100 shadow-sm"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className={`w-full p-5 text-left flex items-center gap-4 transition-colors ${
                  openFaq === idx
                    ? darkMode
                      ? "bg-teal-500/5"
                      : "bg-teal-50/50"
                    : ""
                }`}
              >
                <span className="text-xl shrink-0">{faq.icon}</span>

                <span
                  className={`font-bold text-base sm:text-lg flex-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {faq.q}
                </span>

                {faq.featured && (
                  <span className="hidden sm:inline-block px-2 py-1 text-xs font-semibold bg-teal-500/10 text-teal-600 rounded-full mr-2">
                    Most Asked
                  </span>
                )}

                <ChevronDown
                  className={`w-5 h-5 text-teal-500 shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFaq === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div
                  className={`px-5 pb-5 pl-14 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } text-sm sm:text-base leading-relaxed`}
                >
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-10 p-6 rounded-2xl text-center ${
            darkMode
              ? "bg-gray-900"
              : "bg-white border border-gray-100 shadow-sm"
          }`}
        >
          <p
            className={`font-semibold mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Still have questions?
          </p>
          <p
            className={`text-sm mb-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Contact our support team or check event details
          </p>
          <p
            className={`text-sm mb-4 flex items-center justify-center gap-2 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="text-lg">📞</span>
            <span className="font-medium">85449-53527</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollToSection && scrollToSection("contact")}
              className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all bg-linear-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:shadow-teal-500/25 hover:scale-105"
            >
              Contact Us
            </button>
            <button
              onClick={() => scrollToSection && scrollToSection("events")}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              View Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
