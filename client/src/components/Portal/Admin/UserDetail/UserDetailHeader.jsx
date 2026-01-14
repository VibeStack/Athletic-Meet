import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

/* -------------------- Color Theme Functions -------------------- */
const getJerseyBadgeTheme = (role, gender) => {
  if (role === "Manager")
    return "bg-linear-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30";
  if (gender === "Male")
    return "bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
  if (gender === "Female")
    return "bg-linear-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
  return "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
};

const getLockButtonTheme = (role, gender) => {
  if (role === "Manager")
    return "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25";
  if (gender === "Male")
    return "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25";
  if (gender === "Female")
    return "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25";
  return "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25";
};

const getRoleTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "bg-red-500/15 text-red-400 ring-red-500/30"
      : "bg-red-100 text-red-700 ring-red-400/30";
  }
  if (role === "Admin") {
    if (gender === "Male")
      return darkMode
        ? "bg-sky-500/15 text-sky-400 ring-sky-500/30"
        : "bg-sky-100 text-sky-700 ring-sky-400/30";
    if (gender === "Female")
      return darkMode
        ? "bg-pink-500/15 text-pink-400 ring-pink-500/30"
        : "bg-pink-100 text-pink-700 ring-pink-400/30";
    return darkMode
      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
      : "bg-emerald-100 text-emerald-700 ring-emerald-400/30";
  }
  return darkMode
    ? "bg-slate-700 text-slate-300 ring-slate-600"
    : "bg-slate-200 text-slate-700 ring-slate-300";
};

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  lock: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  promoteAdmin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.67-3.13 8.97-7 10.17-3.87-1.2-7-5.5-7-10.17V6.3l7-3.12zm-1 5.82v3H8v2h3v3h2v-3h3v-2h-3V9h-2z" />
    </svg>
  ),
  demoteAdmin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.67-3.13 8.97-7 10.17-3.87-1.2-7-5.5-7-10.17V6.3l7-3.12zM8 11v2h8v-2H8z" />
    </svg>
  ),
};

export default function UserDetailHeader({
  userData,
  darkMode,
  isUserEventsLocked,
  lockUserEvents,
  unlockUserEvents,
  setShowDeletePopup,
  refetchUser,
}) {
  const { user } = useOutletContext();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const jerseyTheme = getJerseyBadgeTheme(userData.role, userData.gender);
  const roleTheme = getRoleTheme(userData.role, userData.gender, darkMode);
  const lockButtonTheme = getLockButtonTheme(userData.role, userData.gender);
  const [isUserHavingAdminAccess, setIsUserHavingAdminAccess] = useState(
    userData.role === "Manager" || userData.role === "Admin" ? true : false
  );

  const makeAsAdmin = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/user/${userData.id}/makeAsAdmin`,
        null,
        { withCredentials: true }
      );
      setIsUserHavingAdminAccess(true);
      if (refetchUser) refetchUser();
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const removeAsAdmin = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/user/${userData.id}/removeAsAdmin`,
        null,
        { withCredentials: true }
      );
      setIsUserHavingAdminAccess(false);
      if (refetchUser) refetchUser();
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section
      className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 ${
        darkMode
          ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10"
          : "bg-white border border-slate-200 shadow-lg"
      }`}
    >
      {darkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-15 bg-cyan-500" />
        </div>
      )}

      <div className="relative flex flex-col sm:flex-row justify-between gap-4">
        {/* Left: Jersey + Info */}
        <div className="flex items-center gap-4">
          <div
            className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black ${jerseyTheme}`}
          >
            {userData.jerseyNumber || "—"}
          </div>

          <div>
            <h1
              className={`text-xl sm:text-[20px] font-black ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {userData.fullname || userData.username}
            </h1>
            <p
              className={`text-[12px] ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {userData.email}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${roleTheme}`}
              >
                {userData.role}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {ICONS.calendar}
                Joined{" "}
                {userData.createdAt
                  ? new Date(userData.createdAt)
                      .toLocaleDateString()
                      .split("/")
                      .join("-")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons - Lock/Unlock + Delete */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={isUserEventsLocked ? unlockUserEvents : lockUserEvents}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all sm:min-w-40 shadow-lg hover:brightness-110 whitespace-nowrap ${lockButtonTheme}`}
          >
            {isUserEventsLocked ? ICONS.unlock : ICONS.lock}
            <span className="hidden sm:inline">
              {isUserEventsLocked ? "Unlock Events" : "Lock Events"}
            </span>
            <span className="sm:hidden">
              {isUserEventsLocked ? "Unlock" : "Lock"}
            </span>
          </button>

          <button
            onClick={() => setShowDeletePopup(true)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${lockButtonTheme}`}
          >
            {ICONS.trash}
            <span>Delete</span>
          </button>

          {user.role === "Manager" && userData.role !== "Manager" && (
            <>
              {!isUserHavingAdminAccess ? (
                <button
                  onClick={makeAsAdmin}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${lockButtonTheme}`}
                >
                  {ICONS.promoteAdmin}
                  <span>Make As Admin</span>
                </button>
              ) : (
                <button
                  onClick={removeAsAdmin}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${lockButtonTheme}`}
                >
                  {ICONS.demoteAdmin}
                  <span>Remove As Admin</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
