import React from "react";
import { CheckIcon } from "../../icons";

export default function LoginSuccess() {
  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl w-full max-w-md p-10 border border-white/50 text-center animate-fade-in relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 transform scale-110">
          {CheckIcon}
        </div>

        <h2 className="text-3xl font-extrabold bg-linear-to-r from-green-500 via-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          Login Successful!
        </h2>

        <p className="text-gray-700 text-base mb-2">
          🎉 Welcome back! You've successfully logged in.
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
          <p className="text-sm text-gray-600">Welcome to</p>
          <p className="font-bold text-gray-800 text-base mt-1">
            Athletic Meet Portal
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Ready for the competition! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
