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
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 4v5c0 4.5-3.2 8.3-7 9-3.8-.7-7-4.5-7-9V7l7-4z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l2 2 4-4" />
    </svg>
  ),
  demoteAdmin: (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l7 4v5c0 4.5-3.2 8.3-7 9-3.8-.7-7-4.5-7-9V7l7-4z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
    </svg>
  ),
};

export default function UserDetailHeader({
  studentUserData,
  darkMode,
  isUserEventsLocked,
  lockUserEvents,
  unlockUserEvents,
  setShowDeletePopup,
  refetchUser,
}) {
  const { user } = useOutletContext();
  const API_URL = import.meta.env.VITE_API_URL;
  const jerseyTheme = getJerseyBadgeTheme(
    studentUserData.role,
    studentUserData.gender,
  );
  const roleTheme = getRoleTheme(
    studentUserData.role,
    studentUserData.gender,
    darkMode,
  );
  const lockButtonTheme = getLockButtonTheme(
    studentUserData.role,
    studentUserData.gender,
  );
  const [isUserHavingAdminAccess, setIsUserHavingAdminAccess] = useState(
    studentUserData.role === "Manager" || studentUserData.role === "Admin",
  );

  // ========== VISIBILITY LOGIC ==========
  const viewerId = user.id || user._id;
  const viewerRole = user.role;
  const targetId = studentUserData.id;
  const targetRole = studentUserData.role;
  const isDetailsComplete = studentUserData.isUserDetailsComplete === "true";
  const isSelf = viewerId === targetId;

  // Helper to check if viewer has higher role
  const isViewerHigherRole = () => {
    const roleRank = { Manager: 3, Admin: 2, Student: 1 };
    return (roleRank[viewerRole] || 0) > (roleRank[targetRole] || 0);
  };

  // Determine button visibility
  let canShowLockUnlock = false;
  let canShowDelete = false;
  let canShowMakeRemoveAdmin = false;

  if (!isDetailsComplete) {
    // Incomplete details: Only delete is visible (for higher roles)
    canShowDelete = isViewerHigherRole();
  } else if (viewerRole === "Manager") {
    // Manager can see all buttons for anyone
    canShowLockUnlock = true;
    canShowDelete = !isSelf; // Can't delete self
    canShowMakeRemoveAdmin = targetRole !== "Manager"; // Can't change Manager role
  } else if (viewerRole === "Admin") {
    if (isSelf) {
      // Admin viewing own profile: only lock/unlock
      canShowLockUnlock = true;
    } else if (targetRole === "Admin" || targetRole === "Manager") {
      // Admin viewing other Admin/Manager: no buttons
      canShowLockUnlock = false;
      canShowDelete = false;
      canShowMakeRemoveAdmin = false;
    } else if (targetRole === "Student") {
      // Admin viewing Student: lock/unlock + delete
      canShowLockUnlock = true;
      canShowDelete = true;
    }
  }
  // Students can't see any admin buttons

  const makeAsAdmin = async () => {
    try {
      await axios.post(
        `${API_URL}/admin/user/${studentUserData.id}/makeAsAdmin`,
        null,
        { withCredentials: true },
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
        `${API_URL}/admin/user/${studentUserData.id}/removeAsAdmin`,
        null,
        { withCredentials: true },
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
            {studentUserData.jerseyNumber || "—"}
          </div>

          <div>
            <h1
              className={`text-xl sm:text-[20px] font-black ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {studentUserData.fullname || studentUserData.username}
            </h1>
            <p
              className={`text-[12px] ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {studentUserData.email}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full ring-1 ${roleTheme}`}
              >
                {studentUserData.role}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {ICONS.calendar}
                Joined{" "}
                {studentUserData.createdAt
                  ? new Date(studentUserData.createdAt)
                      .toLocaleDateString()
                      .split("/")
                      .join("-")
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Lock/Unlock + Delete Row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {canShowLockUnlock && (
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
            )}

            {canShowDelete && (
              <button
                onClick={() => setShowDeletePopup(true)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${lockButtonTheme}`}
              >
                {ICONS.trash}
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Make/Remove Admin Button - Only for Manager */}
          {canShowMakeRemoveAdmin && (
            <button
              onClick={isUserHavingAdminAccess ? removeAsAdmin : makeAsAdmin}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${lockButtonTheme}`}
            >
              {isUserHavingAdminAccess ? ICONS.demoteAdmin : ICONS.promoteAdmin}
              <span>
                {isUserHavingAdminAccess ? "Remove As Admin" : "Make As Admin"}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
