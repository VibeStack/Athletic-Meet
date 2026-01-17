import React from "react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Premium Profile Field — stronger typography, dashboard-aligned
 */
export default function ProfileField({ label, value, accent = "default" }) {
  const { darkMode } = useTheme();

  const accentRail = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-500",
    emerald: "bg-emerald-500",
    blue: "bg-cyan-500",
    pink: "bg-pink-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    default: darkMode ? "bg-slate-600" : "bg-slate-300",
  };

  const labelColor = {
    red: "text-red-400",
    orange: "text-orange-400",
    yellow: "text-yellow-400",
    emerald: "text-emerald-400",
    blue: "text-cyan-400",
    pink: "text-pink-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    default: darkMode ? "text-slate-400" : "text-slate-500",
  };

  return (
    <div
      className={`group relative rounded-xl p-4 transition-all duration-200
        ${
          darkMode
            ? "bg-slate-900/70 ring-1 ring-white/10 hover:ring-white/20"
            : "bg-white ring-1 ring-slate-200 hover:ring-slate-400"
        }
      `}
      title={value}
    >
      {/* Accent rail */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] rounded-l-xl
          ${accentRail[accent]} opacity-80`}
      />

      {/* Label — stronger & tighter */}
      <p
        className={`text-[11px] uppercase tracking-[0.12em] font-semibold mb-1
          ${labelColor[accent]}`}
      >
        {label}
      </p>

      {/* Value — bolder, clearer */}
      <p
        className={`text-[14px] sm:text-[15px] font-semibold leading-snug
          line-clamp-2
          ${darkMode ? "text-white" : "text-slate-900"}
        `}
      >
        {value || "—"}
      </p>
    </div>
  );
}
