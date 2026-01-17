import React from "react";

// LoadingComponent that works both inside and outside ThemeProvider
// Uses darkMode prop if provided, otherwise defaults to dark mode for auth loading
export default function LoadingComponent({
  title,
  message,
  fullScreen = false,
  darkMode = true,
}) {
  const containerClass = fullScreen ? "min-h-screen" : "min-h-[60vh]";

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClass} gap-6 px-4 ${
        fullScreen
          ? darkMode
            ? "bg-slate-950"
            : "bg-linear-to-br from-cyan-50 via-white to-blue-50"
          : ""
      }`}
    >
      {/* Brand Logo with Shimmer */}
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl overflow-hidden ${
            darkMode
              ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white"
              : "bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 text-white"
          }`}
        >
          <span className="relative z-10">A</span>
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
          />
        </div>
      </div>

      {/* Text */}
      {(title || message) && (
        <div className="text-center space-y-1">
          {title && (
            <p
              className={`text-lg font-semibold ${
                darkMode ? "text-cyan-400" : "text-slate-700"
              }`}
            >
              {title}
            </p>
          )}
          {message && (
            <p
              className={`text-sm ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {/* Shimmer Skeleton Cards */}
      <div className="w-full max-w-3xl space-y-4 mt-2">
        {/* Large card skeleton */}
        <div
          className={`relative h-28 rounded-2xl overflow-hidden ${
            darkMode ? "bg-slate-800/50" : "bg-slate-100"
          }`}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
            style={{
              background: darkMode
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            }}
          />
        </div>

        {/* Two smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`relative h-20 rounded-xl overflow-hidden ${
              darkMode ? "bg-slate-800/50" : "bg-slate-100"
            }`}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
              style={{
                background: darkMode
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              }}
            />
          </div>
          <div
            className={`relative h-20 rounded-xl overflow-hidden ${
              darkMode ? "bg-slate-800/50" : "bg-slate-100"
            }`}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
              style={{
                background: darkMode
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              }}
            />
          </div>
        </div>

        {/* Three small items */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`relative h-12 rounded-lg overflow-hidden ${
                darkMode ? "bg-slate-800/50" : "bg-slate-100"
              }`}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
                style={{
                  background: darkMode
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
