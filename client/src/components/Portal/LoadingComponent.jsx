import React from "react";
import { useTheme } from "./ThemeContext";

export default function LoadingComponent({ title, message }) {
  const { darkMode } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Brand Loader */}
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl
              ${
                darkMode
                  ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white"
                  : "text-white"
              }
            `}
          style={
            !darkMode
              ? {
                  background:
                    "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                }
              : {}
          }
        >
          A
        </div>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-2xl animate-ping bg-cyan-500/30" />
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <p
          className={`text-lg font-semibold ${
            darkMode ? "text-cyan-400" : "text-slate-700"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-sm ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {message}
        </p>
      </div>

      {/* Skeleton layout */}
      <div className="w-full max-w-3xl space-y-4 mt-6">
        <div
          className={`h-24 rounded-2xl animate-pulse ${
            darkMode ? "bg-slate-800/60" : "bg-slate-200/60"
          }`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`h-16 rounded-xl animate-pulse ${
              darkMode ? "bg-slate-800/60" : "bg-slate-200/60"
            }`}
          />
          <div
            className={`h-16 rounded-xl animate-pulse ${
              darkMode ? "bg-slate-800/60" : "bg-slate-200/60"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
