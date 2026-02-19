import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useUsers } from "../../../context/UsersContext";
import LoadingComponent from "../LoadingComponent";
import UserCard from "./UserCard";

// Number of users to display per page
const USERS_PER_PAGE = 60;

export default function UsersPage() {
  const { darkMode } = useTheme();
  const { allUsers, totalUsersCount, isLoading, fetchUsers } = useUsers();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(USERS_PER_PAGE);
  const timeoutRef = useRef(null);

  // Debounce search with 300ms
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setVisibleCount(USERS_PER_PAGE); // Reset visible count on search
    }, 300);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Fetch users on mount - always attempt a fresh fetch, but show cache if available
  useEffect(() => {
    fetchUsers(true); // Force refresh in background
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optimized filtering with useMemo
  const filteredUsers = useMemo(() => {
    if (!debouncedQuery) return allUsers;

    return allUsers
      .map((user) => {
        let score = 0;

        if (!isNaN(debouncedQuery)) {
          const q = debouncedQuery.trim();
          if (user.jerseyNumber?.toString() === q) score += 10000;
          else if (user.jerseyNumber?.toString().includes(q)) score += 50;
          if (user.urn?.toString() === q) score += 1000;
          else if (user.urn?.toString().includes(q)) score += 50;
          if (user.crn?.toString() === q) score += 100;
          else if (user.crn?.toString().includes(q)) score += 50;
        } else {
          const q = debouncedQuery.toLowerCase();
          if (
            user.fullname?.toLowerCase().startsWith(q) ||
            user.username?.toLowerCase().startsWith(q)
          ) {
            score += 100;
          } else if (
            user.fullname?.toLowerCase().includes(q) ||
            user.username?.toLowerCase().includes(q)
          ) {
            score += 50;
          }
          if (user.email?.toLowerCase().startsWith(q)) score += 80;
          else if (user.email?.toLowerCase().includes(q)) score += 40;
        }

        return { user, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ user }) => user);
  }, [allUsers, debouncedQuery]);

  // Users to display (paginated)
  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(0, visibleCount);
  }, [filteredUsers, visibleCount]);

  const hasMore = visibleCount < filteredUsers.length;
  const visibleUsersCount = filteredUsers.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + USERS_PER_PAGE);
  };

  // Only show loading screen if we have NO users in cache AND we are currently loading
  if (isLoading && allUsers.length === 0) {
    return (
      <LoadingComponent
        title="Users"
        message="Manage all registered participants, roles, and event activity"
        darkMode={darkMode}
      />
    );
  }

  return (
    <>
      {/* Header Section */}
      <section className="mb-10">
        <div
          className={`rounded-3xl px-6 py-6 sm:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8
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
              Showing{" "}
              <span className="font-semibold">
                {Math.min(visibleCount, visibleUsersCount)}
              </span>{" "}
              of <span className="font-semibold">{visibleUsersCount}</span>{" "}
              {debouncedQuery ? "matching" : ""} users
              {!debouncedQuery && totalUsersCount !== visibleUsersCount && (
                <span className="text-slate-500">
                  {" "}
                  (Total: {totalUsersCount})
                </span>
              )}
            </p>
          </div>

          <div className="w-full lg:max-w-3xl">
            <label
              className="text-[11px] uppercase tracking-widest font-bold text-slate-400"
              htmlFor="searching-users"
            >
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
                id="searching-users"
                style={{ color: darkMode ? "#ffffff" : "#000000" }}
                className="w-full bg-transparent py-3 text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                placeholder="Search by name, email, jersey, URN, CRN…"
                onChange={(e) => setQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Users Grid Section */}
      <section>
        {filteredUsers.length === 0 && debouncedQuery ? (
          <NoResultsMessage
            query={query}
            setQuery={setQuery}
            darkMode={darkMode}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedUsers.map((user) => (
                <UserCard key={user.id} user={user} darkMode={darkMode} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  className={`px-8 py-4 rounded-2xl font-bold text-sm transition-transform  shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                    darkMode
                      ? "bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/40 hover:shadow-red-500/60"
                      : "bg-linear-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-slate-900/25 hover:shadow-slate-900/40"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 20 20"
                      className="w-5 h-5"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Load More ({filteredUsers.length - visibleCount} remaining)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

// No Results Message Component
function NoResultsMessage({ query, setQuery, darkMode }) {
  return (
    <div
      className={`rounded-3xl overflow-hidden border transition-transform ${
        darkMode
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border-white/10 shadow-2xl"
          : "bg-linear-to-br from-white via-slate-50 to-white border-slate-200 shadow-xl"
      }`}
    >
      <div className="relative p-8 sm:p-12 lg:p-16">
        {darkMode && (
          <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </>
        )}

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Search Icon */}
          <div className="relative inline-block mb-8">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-transform  ${
                darkMode
                  ? "bg-slate-800/80 shadow-[0_0_50px_rgba(56,189,248,0.2)]"
                  : "bg-slate-100 shadow-lg"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-14 h-14 sm:w-16 sm:h-16 transition-transform ${
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
            <div
              className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
                darkMode ? "bg-cyan-500" : "bg-slate-400"
              }`}
              style={{ animationDuration: "2s" }}
            />
          </div>

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

          {/* Suggestions */}
          <div
            className={`inline-block rounded-2xl p-5 sm:p-6 mb-8 transition-transform ${
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

          {/* Clear Button */}
          <button
            onClick={() => setQuery("")}
            className={`group relative px-8 py-3.5 rounded-xl font-bold text-sm transition-transform  shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
              darkMode
                ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/25 hover:shadow-cyan-500/40"
                : "bg-linear-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 shadow-slate-900/25 hover:shadow-slate-900/40"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg
                viewBox="0 0 20 20"
                className="w-4 h-4 transition-transform group-hover:rotate-180 "
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
  );
}
