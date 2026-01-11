import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

// Role badge theme
const getRoleTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "bg-red-500/15 text-red-400 ring-red-500/30"
      : "bg-red-50 text-red-700 ring-red-200";
  }
  if (role === "Admin") {
    // Admin badge follows gender color
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
    // Admin no gender - emerald
    return darkMode
      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  // Student - always black/dark badge
  return darkMode
    ? "bg-slate-700/50 text-slate-300 ring-slate-600"
    : "bg-slate-800 text-slate-100 ring-slate-700";
};

// Event count color based on role and gender
const getEventColor = (role, gender, darkMode) => {
  if (role === "Manager") {
    return darkMode ? "text-red-400" : "text-red-600";
  }
  // Admin and Student follow gender
  if (gender === "Female") return darkMode ? "text-pink-400" : "text-pink-600";
  if (gender === "Male") return darkMode ? "text-sky-400" : "text-sky-600";
  // Incomplete profile - green
  return darkMode ? "text-emerald-400" : "text-emerald-600";
};

const getGenderTheme = (gender, darkMode) => {
  switch (gender) {
    case "Male":
      return {
        rail: darkMode
          ? "bg-gradient-to-b from-sky-400 to-blue-600"
          : "bg-gradient-to-b from-sky-500 to-blue-700",
        glow: "shadow-sky-500/20",
        events: darkMode ? "text-sky-400" : "text-sky-600",
      };

    case "Female":
      return {
        rail: darkMode
          ? "bg-gradient-to-b from-pink-400 to-purple-600"
          : "bg-gradient-to-b from-pink-500 to-purple-700",
        glow: "shadow-pink-500/20",
        events: darkMode ? "text-pink-400" : "text-pink-600",
      };

    default: // null / incomplete profile
      return {
        rail: darkMode
          ? "bg-gradient-to-b from-lime-400 to-emerald-600"
          : "bg-gradient-to-b from-lime-500 to-emerald-700",
        glow: "shadow-emerald-500/20",
        events: darkMode ? "text-emerald-400" : "text-emerald-600",
      };
  }
};

// Jersey badge colors based on role and gender
const getJerseyBadgeTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30";
  }
  // Admin and Student follow gender
  if (gender === "Male") {
    return "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
  }
  if (gender === "Female") {
    return "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
  }
  // Incomplete profile - green
  return "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
};

// Card border colors based on role and gender
const getCardBorderTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "border-red-500/50 hover:border-red-400"
      : "border-red-400 hover:border-red-500";
  }
  // Admin and Student follow gender
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
  // Incomplete profile - green
  return darkMode
    ? "border-emerald-500/50 hover:border-emerald-400"
    : "border-emerald-400 hover:border-emerald-500";
};

export default function UsersPage() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { darkMode } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [visibleUsersCount, setVisibleUsersCount] = useState(totalUsersCount);

  useEffect(() => {
    const allUsers = async () => {
      const { data: response } = await axios.get(`${BASE_URL}/admin/users`, {
        withCredentials: true,
      });
      console.log(response.data.users);
      setAllUsers(response.data.users);
      setTotalUsersCount(response.data.usersCount);
      setVisibleUsersCount(response.data.usersCount);
    };
    allUsers();
  }, []);

  const filteredUsers = allUsers
    .map((user) => {
      let score = 0;
      if (!query) return { user, score };

      if (!isNaN(query)) {
        const q = query.trim();

        if (user.jerseyNumber?.toString() === q) score += 100;
        else if (user.jerseyNumber?.toString().includes(q)) score += 50;

        if (user.urn?.toString() === q) score += 100;
        else if (user.urn?.toString().includes(q)) score += 50;

        if (user.crn?.toString() === q) score += 100;
        else if (user.crn?.toString().includes(q)) score += 50;
      } else {
        const q = query.toLowerCase();

        if (
          user.fullname?.toLowerCase().startsWith(q) ||
          user.username?.toLowerCase().startsWith(q)
        )
          score += 100;
        else if (
          user.fullname?.toLowerCase().includes(q) ||
          user.username?.toLowerCase().includes(q)
        )
          score += 50;

        if (user.email?.toLowerCase().startsWith(q)) score += 80;
        else if (user.email?.toLowerCase().includes(q)) score += 40;
      }

      return { user, score };
    })
    .filter(({ score }) => !query || score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ user }) => user);

  useEffect(() => {
    setVisibleUsersCount(filteredUsers.length);
  }, [filteredUsers]);

  return (
    <>
      <section className="mb-10">
        <div
          className={`rounded-3xl px-6 py-6 sm:px-8
      flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8
      ${
        darkMode
          ? "bg-linear-to-br from-slate-900 to-slate-800 border border-white/10 shadow-lg"
          : "bg-white/80 border border-slate-200 shadow-sm"
      }
    `}
        >
          <div>
            <h2
              className={`text-3xl font-black ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Users
            </h2>
            <p
              className={`${
                darkMode ? "text-slate-400" : "text-slate-600"
              } text-sm`}
            >
              Showing <span className="font-semibold">{visibleUsersCount}</span>{" "}
              of <span className="font-semibold">{totalUsersCount}</span> users
            </p>
          </div>

          <div className="w-full lg:max-w-3xl">
            <label className="text-[11px] uppercase tracking-widest font-bold text-slate-400">
              Search Users
            </label>
            <div
              className={`mt-2 rounded-2xl px-4
          ${
            darkMode
              ? "bg-slate-900 border border-white/10"
              : "bg-white border border-slate-300"
          }
        `}
            >
              <input
                className="w-full bg-transparent py-3 text-sm focus:outline-none"
                placeholder="Search by name, email, jersey, URN, CRN…"
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const genderTheme = getGenderTheme(user.gender, darkMode);
          const roleTheme = getRoleTheme(user.role, user.gender, darkMode);
          const jerseyTheme = getJerseyBadgeTheme(
            user.role,
            user.gender,
            darkMode
          );
          const borderTheme = getCardBorderTheme(
            user.role,
            user.gender,
            darkMode
          );

          return (
            <div
              key={user.id}
              onClick={() => navigate(`${location.pathname}/${user.id}`)}
              className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2
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
                    className={`relative shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black transition-transform duration-300 group-hover:scale-105
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
                className={`mx-5 h-px ${
                  darkMode ? "bg-white/5" : "bg-slate-100"
                }`}
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
                      darkMode
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
          );
        })}
      </section>
    </>
  );
}
