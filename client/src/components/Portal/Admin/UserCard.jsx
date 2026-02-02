import React from "react";
import { useNavigate } from "react-router-dom";

// Role badge theme - considers isUserDetailsComplete
const getRoleTheme = (role, gender, isUserDetailsComplete, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "bg-red-500/15 text-red-400 ring-red-500/30"
      : "bg-red-50 text-red-700 ring-red-200";
  }
  if (role === "Admin") {
    // For Admin, use gender-based colors only if details are complete
    if (isUserDetailsComplete === "true") {
      if (gender === "Male") {
        return darkMode
          ? "bg-sky-500/15 text-sky-400 ring-sky-500/30"
          : "bg-sky-50 text-sky-700 ring-sky-200";
      }
      if (gender === "Female") {
        return darkMode
          ? "bg-pink-500/15 text-pink-400 ring-pink-500/30"
          : "bg-pink-50 text-pink-700 ring-pink-200";
      }
    }
    if (isUserDetailsComplete === "partial") {
      return darkMode
        ? "bg-slate-500/15 text-slate-400 ring-slate-500/30"
        : "bg-slate-100 text-slate-700 ring-slate-200";
    }
    // false (unverified)
    return darkMode
      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  return darkMode
    ? "bg-slate-700/50 text-slate-300 ring-slate-600"
    : "bg-slate-800 text-slate-100 ring-slate-700";
};

// Event count color based on role, gender, and isUserDetailsComplete
const getEventColor = (role, gender, isUserDetailsComplete, darkMode) => {
  if (role === "Manager") {
    return darkMode ? "text-red-400" : "text-red-600";
  }
  if (isUserDetailsComplete === "true") {
    if (gender === "Female")
      return darkMode ? "text-pink-400" : "text-pink-600";
    if (gender === "Male") return darkMode ? "text-sky-400" : "text-sky-600";
  }
  if (isUserDetailsComplete === "partial") {
    return darkMode ? "text-slate-400" : "text-slate-600";
  }
  return darkMode ? "text-emerald-400" : "text-emerald-600";
};

// Jersey badge colors based on role, gender, and isUserDetailsComplete
const getJerseyBadgeTheme = (role, gender, isUserDetailsComplete) => {
  if (role === "Manager") {
    return "bg-linear-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30";
  }
  if (isUserDetailsComplete === "true") {
    if (gender === "Male") {
      return "bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
    }
    if (gender === "Female") {
      return "bg-linear-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
    }
  }
  if (isUserDetailsComplete === "partial") {
    return "bg-linear-to-br from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-500/30";
  }
  return "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
};

// Card border colors based on role, gender, and isUserDetailsComplete
const getCardBorderTheme = (role, gender, isUserDetailsComplete, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "border-red-500/50 hover:border-red-400"
      : "border-red-400 hover:border-red-500";
  }
  if (isUserDetailsComplete === "true") {
    if (gender === "Male") {
      return darkMode
        ? "border-sky-500/50 hover:border-sky-400"
        : "border-sky-400 hover:border-sky-500";
    }
    if (gender === "Female") {
      return darkMode
        ? "border-pink-500/50 hover:border-pink-400"
        : "border-pink-400 hover:border-pink-500";
    }
  }
  if (isUserDetailsComplete === "partial") {
    return darkMode
      ? "border-slate-500/50 hover:border-slate-400"
      : "border-slate-400 hover:border-slate-500";
  }
  return darkMode
    ? "border-emerald-500/50 hover:border-emerald-400"
    : "border-emerald-400 hover:border-emerald-500";
};

function UserCard({ user, darkMode, style }) {
  const navigate = useNavigate();
  const isComplete = user.isUserDetailsComplete || "false";
  const roleTheme = getRoleTheme(user.role, user.gender, isComplete, darkMode);
  const jerseyTheme = getJerseyBadgeTheme(user.role, user.gender, isComplete);
  const borderTheme = getCardBorderTheme(
    user.role,
    user.gender,
    isComplete,
    darkMode,
  );

  return (
    <div style={style} className="p-2">
      <div
        onClick={() => navigate(`${user.id}`)}
        className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 h-full
          ${borderTheme}
          ${
            darkMode
              ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
              : "bg-white hover:shadow-2xl hover:shadow-slate-200/50"
          }
          hover:-translate-y-1
        `}
      >
        {/* Header Section */}
        <div className="p-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Jersey Number Badge */}
            <div
              className={`relative shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black transition-transform duration-300 group-hover:scale-105
                ${jerseyTheme}
              `}
            >
              {user.jerseyNumber || "—"}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className={`font-bold text-lg leading-tight truncate ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {user.fullname || user.username}
              </p>
              <p
                className={`text-sm truncate mt-0.5 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {user.email}
              </p>

              {/* Role Badge */}
              <span
                className={`inline-flex items-center mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${roleTheme}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`mx-5 h-px ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
        />

        {/* Meta Grid */}
        <div className="p-5 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`rounded-xl p-3 transition-colors
                ${
                  darkMode
                    ? "bg-slate-800/50"
                    : "bg-slate-50 group-hover:bg-slate-100/80"
                }
              `}
            >
              <p
                className={`text-[10px] uppercase tracking-wider font-medium ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Course
              </p>
              <p
                className={`font-semibold mt-0.5 truncate ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {user.course || "—"}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 transition-colors
                ${
                  darkMode
                    ? "bg-slate-800/50"
                    : "bg-slate-50 group-hover:bg-slate-100/80"
                }
              `}
            >
              <p
                className={`text-[10px] uppercase tracking-wider font-medium ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Branch
              </p>
              <p
                className={`font-semibold mt-0.5 truncate ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {user.branch || "—"}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 transition-colors
                ${
                  darkMode
                    ? "bg-slate-800/50"
                    : "bg-slate-50 group-hover:bg-slate-100/80"
                }
              `}
            >
              <p
                className={`text-[10px] uppercase tracking-wider font-medium ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                URN
              </p>
              <p
                className={`font-semibold mt-0.5 truncate text-sm ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {user.urn || "—"}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 transition-colors
                ${
                  darkMode
                    ? "bg-slate-800/50"
                    : "bg-slate-50 group-hover:bg-slate-100/80"
                }
              `}
            >
              <p
                className={`text-[10px] uppercase tracking-wider font-medium ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                CRN
              </p>
              <p
                className={`font-semibold mt-0.5 truncate text-sm ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {user.crn || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer - Events */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-t transition-colors
            ${
              darkMode
                ? "border-white/5 bg-slate-800/30"
                : "border-slate-100 bg-slate-50/50 group-hover:bg-slate-100/50"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-black ${getEventColor(
                user.role,
                user.gender,
                user.isUserDetailsComplete || "false",
                darkMode,
              )}`}
            >
              {user.eventsCount || 0}
            </span>
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              events
            </span>
          </div>

          {/* Arrow Indicator */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${
                darkMode
                  ? "bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                  : "bg-slate-200/80 text-slate-400 group-hover:bg-slate-300 group-hover:text-slate-600"
              }
              group-hover:translate-x-1
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// React.memo prevents re-renders when props haven't changed
export default React.memo(UserCard);
