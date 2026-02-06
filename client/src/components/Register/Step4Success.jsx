// components/Register/Step4Success.jsx
import React from "react";
import { CheckIcon } from "../../icons";

export default function Step4Success() {
  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center px-4 py-6 sm:py-0">
      <div
        className="bg-white shadow-xl rounded-2xl w-full max-w-md
                p-6 sm:p-8 md:p-10
                border border-gray-100 text-center
                animate-fade-in relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6 transform scale-110">
            {CheckIcon}
          </div>

          {/* Title */}
          <h2 className="text-xl font-extrabold bg-linear-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent mb-4">
            Registration Successful!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-700 text-sm mb-2">
            🎉 Congratulations! Your account has been created successfully.
          </p>

          {/* Redirecting Status */}
          {/* Beautiful Bouncing Dots */}

          {/* <div className="my-8">
            <p className="text-green-600 text-lg font-semibold mb-6">
              Redirecting to portal...
            </p>

            <div className="flex justify-center gap-3">
              <div className="w-4 h-4 bg-linear-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg"></div>
              <div
                className="w-4 h-4 bg-linear-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className="w-4 h-4 bg-linear-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          </div> */}

          {/* WhatsApp Community */}
          <div
            className="mt-6 px-4 py-4
                rounded-xl border border-green-200
                bg-green-50/60"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className="w-9 h-9 flex items-center justify-center
                    rounded-full bg-green-500 text-white"
              >
                {/* WhatsApp SVG */}
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                  <path d="M16 0C7.164 0 0 7.163 0 16c0 2.838.743 5.604 2.156 8.042L0 32l8.21-2.104A15.89 15.89 0 0 0 16 32c8.837 0 16-7.163 16-16C32 7.163 24.837 0 16 0zm0 29.091c-2.61 0-5.174-.702-7.425-2.034l-.53-.314-4.873 1.248 1.3-4.74-.345-.547A13.02 13.02 0 0 1 2.91 16C2.91 8.61 8.61 2.91 16 2.91S29.09 8.61 29.09 16 23.39 29.09 16 29.09zm7.363-9.818c-.403-.202-2.388-1.178-2.757-1.31-.37-.134-.64-.202-.91.202-.27.403-1.043 1.31-1.28 1.58-.236.27-.472.304-.875.101-.403-.202-1.701-.626-3.24-1.996-1.197-1.067-2.005-2.386-2.24-2.79-.236-.403-.025-.62.178-.82.183-.182.403-.472.605-.708.202-.236.27-.404.404-.673.134-.27.067-.505-.033-.708-.101-.202-.91-2.195-1.246-3.006-.327-.785-.66-.678-.91-.69l-.775-.014c-.27 0-.708.101-1.078.505-.37.404-1.415 1.38-1.415 3.364 0 1.985 1.448 3.904 1.65 4.173.202.27 2.85 4.36 6.903 6.115.964.416 1.716.665 2.303.851.967.307 1.848.264 2.544.16.776-.116 2.388-.976 2.724-1.918.336-.942.336-1.75.236-1.918-.101-.168-.37-.27-.774-.472z" />
                </svg>
              </div>

              <h3 className="font-semibold text-green-700 text-[12px] sm:text-sm">
                Join WhatsApp Community
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
              Get instant updates, announcements, and important information
              about the Athletic Championship.
            </p>

            <a
              href="YOUR_WHATSAPP_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 sm:py-3
               rounded-lg bg-green-500 text-white
               font-semibold text-sm sm:text-base
               hover:bg-green-600 transition"
            >
              Join WhatsApp
            </a>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-[12px] text-gray-600">
              Thank you for registering with
            </p>
            <p className="font-bold text-gray-800 text-sm mt-1">
              Guru Nanak Dev Engineering College
            </p>
            <p className="text-[12px] text-gray-500 mt-2">
              We look forward to your participation! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
