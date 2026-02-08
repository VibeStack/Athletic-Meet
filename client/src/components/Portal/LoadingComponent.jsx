import React from "react";

// LoadingComponent that works both inside and outside ThemeProvider
// Uses darkMode prop if provided, otherwise defaults to dark mode for auth loading
export default function LoadingComponent({
  title,
  message,
  fullScreen = false,
  darkMode = null, // Default to null to detect from parent/context if needed
}) {
  const containerClass = fullScreen ? "min-h-screen" : "min-h-[60vh]";

  // Use provided darkMode, or logic to determine if none provided
  const isDark = darkMode !== null ? darkMode : true;

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerClass} gap-6 px-4 transition-colors duration-300 ${
        fullScreen
          ? isDark
            ? "bg-slate-950"
            : "bg-linear-to-br from-slate-50 via-white to-blue-50"
          : isDark
            ? "bg-slate-900/20 rounded-3xl"
            : "bg-slate-100/30 rounded-3xl border border-slate-200/50"
      }`}
    >
      {/* Brand Logo with Shimmer */}
      <div className="relative">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl overflow-hidden transition-all duration-300 ${
            isDark
              ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              : "bg-linear-to-br from-slate-800 via-slate-700 to-slate-900 text-white shadow-xl"
          }`}
          style={
            !isDark
              ? {
                  background:
                    "linear-gradient(135deg, #1e293b 0%, #334155 30%, #0f172a 70%, #020617 100%)",
                }
              : {}
          }
        >
          <span className="relative z-10">A</span>
          {/* Shimmer effect - silvery shine for light mode */}
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
            style={{
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
        </div>
      </div>

      {/* Text */}
      {(title || message) && (
        <div className="text-center space-y-1">
          {title && (
            <p
              className={`text-lg font-bold tracking-tight ${
                isDark ? "text-cyan-400" : "text-slate-900"
              }`}
            >
              {title}
            </p>
          )}
          {message && (
            <p
              className={`text-sm font-medium ${
                isDark ? "text-slate-400" : "text-slate-500"
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
          className={`relative h-28 rounded-2xl overflow-hidden transition-colors duration-300 ${
            isDark
              ? "bg-slate-800/40"
              : "bg-white border border-slate-200 shadow-sm"
          }`}
        >
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
            style={{
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)"
                : "linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)",
            }}
          />
        </div>

        {/* Two smaller cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`relative h-20 rounded-xl overflow-hidden transition-colors duration-300 ${
              isDark
                ? "bg-slate-800/40"
                : "bg-white border border-slate-200 shadow-sm"
            }`}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)",
              }}
            />
          </div>
          <div
            className={`relative h-20 rounded-xl overflow-hidden transition-colors duration-300 ${
              isDark
                ? "bg-slate-800/40"
                : "bg-white border border-slate-200 shadow-sm"
            }`}
          >
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
              style={{
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)",
              }}
            />
          </div>
        </div>

        {/* Three small items */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`relative h-12 rounded-lg overflow-hidden transition-colors duration-300 ${
                isDark
                  ? "bg-slate-800/40"
                  : "bg-white border border-slate-200 shadow-sm"
              }`}
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
                style={{
                  background: isDark
                    ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)"
                    : "linear-gradient(90deg, transparent, rgba(148,163,184,0.1), transparent)",
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
