import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function ManagerDetailsAccessDenied() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-[60vh] flex items-center justify-center relative overflow-hidden ${
        darkMode ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Background decorative elements */}
      {darkMode && (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 bg-red-500 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10 bg-orange-500 pointer-events-none" />
        </>
      )}

      <div
        className={`relative text-center max-w-md px-8 py-10 rounded-3xl ${
          darkMode
            ? "bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl shadow-red-500/5"
            : "bg-white border border-slate-100 shadow-2xl shadow-slate-200/50"
        }`}
      >
        {/* Glow effect for icon */}
        <div className="relative mx-auto mb-6">
          <div
            className={`absolute inset-0 w-24 h-24 mx-auto rounded-2xl blur-xl ${
              darkMode ? "bg-red-500/30" : "bg-red-500/20"
            }`}
          />
          <div
            className={`relative w-24 h-24 mx-auto rounded-2xl flex items-center justify-center ${
              darkMode
                ? "bg-linear-to-br from-red-500/20 to-red-600/20 ring-1 ring-red-500/30"
                : "bg-linear-to-br from-red-50 to-red-100 ring-1 ring-red-200"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-12 h-12 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
        </div>

        {/* Title with linear */}
        <h1
          className={`text-2xl font-black mb-3 ${
            darkMode
              ? "bg-linear-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
              : "text-slate-900"
          }`}
        >
          Access Denied
        </h1>

        {/* Subtitle with better styling */}
        <p
          className={`text-sm mb-8 leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          You don't have permission to view
          <br />
          <span
            className={`font-semibold ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            Manager details
          </span>
        </p>

        {/* Premium button with linear and hover effect */}
        <button
          onClick={() => navigate(-1)}
          className={`group relative px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden ${
            darkMode
              ? "bg-linear-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600 ring-1 ring-white/10"
              : "bg-linear-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700"
          } shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go Back
          </span>
        </button>

        {/* Decorative bottom line */}
        <div
          className={`mt-8 mx-auto w-16 h-1 rounded-full ${
            darkMode
              ? "bg-linear-to-r from-red-500/40 via-red-600/60 to-red-500/40"
              : "bg-linear-to-r from-red-300 via-red-400 to-red-300"
          }`}
        />
      </div>
    </div>
  );
}
