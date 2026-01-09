// components/Register/Step4Success.jsx
import React from "react";
import { CheckIcon } from "../../icons";

export default function Step4Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10 border border-gray-100 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          {/* Success Icon */}
          <div className="flex justify-center mb-6 transform scale-110">
            {CheckIcon}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-extrabold bg-linear-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent mb-4">
            Registration Successful!
          </h2>

          {/* Subtitle */}
          <p className="text-gray-700 text-base mb-2">
            🎉 Congratulations! Your account has been created successfully.
          </p>

          {/* Redirecting Status */}
          <div className="my-8">
            <p className="text-green-600 text-lg font-semibold mb-6">
              Redirecting to portal...
            </p>

            {/* Beautiful Bouncing Dots */}
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
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Thank you for registering with
            </p>
            <p className="font-bold text-gray-800 text-base mt-1">
              Guru Nanak Dev Engineering College
            </p>
            <p className="text-sm text-gray-500 mt-2">
              We look forward to your participation! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
