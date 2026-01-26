import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import LoadingComponent from "../LoadingComponent";

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

// Jersey badge colors based on role and gender
const getJerseyBadgeTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return "bg-linear-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30";
  }
  // Admin and Student follow gender
  if (gender === "Male") {
    return "bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
  }
  if (gender === "Female") {
    return "bg-linear-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
  }
  // Incomplete profile - green
  return "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
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
  const API_URL = import.meta.env.VITE_API_URL;
  const { darkMode } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [visibleUsersCount, setVisibleUsersCount] = useState(totalUsersCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const { data: response } = await axios.get(`${API_URL}/admin/users`, {
          withCredentials: true,
        });
        const sortedUsers = response.data.users.sort(
          (a, b) => a.jerseyNumber - b.jerseyNumber,
        );
        setAllUsers(sortedUsers);
        setTotalUsersCount(response.data.usersCount);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = allUsers
    .map((user) => {
      let score = 0;
      if (!query) return { user, score };

      if (!isNaN(query)) {
        const q = query.trim();

        if (user.jerseyNumber?.toString() === q) score += 10000;
        else if (user.jerseyNumber?.toString().includes(q)) score += 50;

        if (user.urn?.toString() === q) score += 1000;
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

  return isLoading ? (
    <LoadingComponent
      title="Users"
      message="Manage all registered participants, roles, and event activity"
      darkMode={darkMode}
    />
  ) : (
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
                value={query}
                style={{ color: darkMode ? "#ffffff" : "#000000" }}
                className="w-full bg-transparent py-3 text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                placeholder="Search by name, email, jersey, URN, CRN…"
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.length === 0 && query ? (
          <div
            className={`col-span-full rounded-3xl overflow-hidden border transition-all ${
              darkMode
                ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-white/10 shadow-2xl"
                : "bg-linear-to-br from-white via-slate-50 to-white border-slate-200 shadow-xl"
            }`}
          >
            <div className="relative p-8 sm:p-12 lg:p-16">
              {/* Decorative background elements */}
              {darkMode && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                </>
              )}

              <div className="relative max-w-2xl mx-auto text-center">
                {/* Search Icon with animation */}
                <div className="relative inline-block mb-8">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      darkMode
                        ? "bg-slate-800/80 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
                        : "bg-slate-100 shadow-lg"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-14 h-14 sm:w-16 sm:h-16 transition-all ${
                        darkMode ? "text-cyan-500/70" : "text-slate-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  {/* Animated ring */}
                  <div
                    className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                      darkMode ? "bg-cyan-500" : "bg-slate-400"
                    }`}
                    style={{ animationDuration: "2s" }}
                  />
                </div>

                {/* Message */}
                <h3
                  className={`text-2xl sm:text-3xl lg:text-4xl font-black mb-3 ${
                    darkMode
                      ? "bg-linear-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent"
                      : "text-slate-900"
                  }`}
                >
                  No users found
                </h3>
                <p
                  className={`text-sm sm:text-base mb-2 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  We couldn't find any users matching
                </p>
                <p
                  className={`text-lg sm:text-xl font-bold mb-8 sm:mb-10 ${
                    darkMode ? "text-cyan-400" : "text-slate-700"
                  }`}
                >
                  "{query}"
                </p>

                {/* Suggestions Box - Improved */}
                <div
                  className={`inline-block rounded-2xl p-5 sm:p-6 mb-8 transition-all ${
                    darkMode
                      ? "bg-slate-800/50 border border-white/5"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 ${
                        darkMode ? "text-cyan-400" : "text-slate-700"
                      }`}
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <p
                      className={`text-sm font-bold ${
                        darkMode ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Try searching by:
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {[
                      "Full name or username",
                      "Email address",
                      "Jersey number",
                      "URN or CRN",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-sm ${
                          darkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`w-4 h-4 shrink-0 ${
                            darkMode ? "text-cyan-500" : "text-slate-600"
                          }`}
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Search Button - Enhanced */}
                <button
                  onClick={() => setQuery("")}
                  className={`group relative px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                    darkMode
                      ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/25 hover:shadow-cyan-500/40"
                      : "bg-linear-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-slate-900/25 hover:shadow-slate-900/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Clear Search
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const roleTheme = getRoleTheme(user.role, user.gender, darkMode);
            const jerseyTheme = getJerseyBadgeTheme(
              user.role,
              user.gender,
              darkMode,
            );
            const borderTheme = getCardBorderTheme(
              user.role,
              user.gender,
              darkMode,
            );

            return (
              <div
                key={user.id}
                onClick={() => {
                  navigate(`${user.id}`);
                }}
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
            );
          })
        )}
      </section>
    </>
  );
}
