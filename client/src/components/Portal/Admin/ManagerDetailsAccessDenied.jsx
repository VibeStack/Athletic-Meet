import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function ManagerDetailsAccessDenied() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-[70vh] flex items-center justify-center relative overflow-hidden ${
        darkMode ? "" : "bg-slate-50"
      }`}
    >
      {/* Background gradient - only in dark mode */}
      {darkMode && (
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {darkMode ? (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] bg-cyan-500/10" />
        ) : (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] bg-red-500/5" />
        )}
      </div>

      <div
        className={`relative text-center max-w-md w-full mx-4 px-10 py-12 rounded-2xl ${
          darkMode
            ? "bg-slate-800/90 border border-white/10 backdrop-blur-sm shadow-2xl"
            : "bg-white border border-slate-200 shadow-2xl"
        }`}
      >
        {/* Warning icon */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          <div
            className={`absolute inset-0 rounded-full blur-xl ${
              darkMode ? "bg-red-500/20" : "bg-red-500/10"
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full ${
              darkMode
                ? "bg-red-500/10 ring-1 ring-red-500/30"
                : "bg-red-50 ring-1 ring-red-200"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className={`w-12 h-12 ${
                darkMode ? "text-red-400" : "text-red-500"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.5" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-black mb-3 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Access Denied
        </h1>

        {/* Description */}
        <p
          className={`text-sm mb-8 leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          You don't have permission to access this page.
        </p>

        {/* Go back button */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 bg-linear-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Portal
        </button>
      </div>
    </div>
  );
}
