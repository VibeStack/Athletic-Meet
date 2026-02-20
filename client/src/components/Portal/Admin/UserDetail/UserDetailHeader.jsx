import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useUsers } from "../../../../context/UsersContext";

/* -------------------- Color Theme Functions -------------------- */
const getJerseyBadgeTheme = (role, gender, isUserDetailsComplete) => {
  if (role === "Manager")
    return "bg-linear-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30";
  if (isUserDetailsComplete === "true") {
    if (gender === "Male")
      return "bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
    if (gender === "Female")
      return "bg-linear-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
  }
  if (isUserDetailsComplete === "partial")
    return "bg-linear-to-br from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-500/30";
  return "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
};

const getLockButtonTheme = (role, gender, isUserDetailsComplete) => {
  if (role === "Manager")
    return "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25";
  if (isUserDetailsComplete === "true") {
    if (gender === "Male")
      return "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25";
    if (gender === "Female")
      return "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25";
  }
  if (isUserDetailsComplete === "partial")
    return "bg-linear-to-r from-slate-500 to-slate-600 shadow-slate-500/25";
  return "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25";
};

const getRoleTheme = (role, gender, isUserDetailsComplete, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "bg-red-500/15 text-red-400 ring-red-500/30"
      : "bg-red-100 text-red-700 ring-red-400/30";
  }
  if (role === "Admin") {
    if (isUserDetailsComplete === "true") {
      if (gender === "Male")
        return darkMode
          ? "bg-sky-500/15 text-sky-400 ring-sky-500/30"
          : "bg-sky-100 text-sky-700 ring-sky-400/30";
      if (gender === "Female")
        return darkMode
          ? "bg-pink-500/15 text-pink-400 ring-pink-500/30"
          : "bg-pink-100 text-pink-700 ring-pink-400/30";
    }
    if (isUserDetailsComplete === "partial")
      return darkMode
        ? "bg-slate-500/15 text-slate-400 ring-slate-500/30"
        : "bg-slate-100 text-slate-700 ring-slate-300";
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
  verifyEmail: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
};

export default function UserDetailHeader({
  studentUserData,
  darkMode,
  isUserEventsLocked,
  lockUserEvents,
  unlockUserEvents,
  updateUserInCache,
}) {
  const { user } = useOutletContext(); // user is me and studentUserData is that student whole profile i am viewing it can be me also ok
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { removeUserFromCache } = useUsers();

  const [isUserHavingAdminAccess, setIsUserHavingAdminAccess] = useState(
    ["Manager", "Admin"].includes(studentUserData.role),
  );
  const [lockingEvents, setLockingEvents] = useState(false);
  const [togglingAdmin, setTogglingAdmin] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [localDetailsComplete, setLocalDetailsComplete] = useState(
    studentUserData.isUserDetailsComplete || "false",
  );

  // Delete popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteState, setDeleteState] = useState("confirm"); // 'confirm' | 'deleting' | 'success'
  const timeoutRef = useRef(null);

  // Unlock popup state
  const [showUnlockPopup, setShowUnlockPopup] = useState(false);
  const [unlockState, setUnlockState] = useState("confirm"); // 'confirm' | 'unlocking' | 'success'
  const unlockTimeoutRef = useRef(null);

  // Unlock error popup state
  const [showUnlockErrorPopup, setShowUnlockErrorPopup] = useState(false);

  // When isUserHavingAdminAccess changes, we need to compute the displayed role:
  // - Manager always stays Manager
  // - Others show Admin if isUserHavingAdminAccess is true, otherwise Student
  const targetRole =
    studentUserData.role === "Manager"
      ? "Manager"
      : isUserHavingAdminAccess
        ? "Admin"
        : "Student";

  const roleTheme = getRoleTheme(
    targetRole,
    studentUserData.gender,
    localDetailsComplete,
    darkMode,
  );
  const jerseyTheme = getJerseyBadgeTheme(
    targetRole,
    studentUserData.gender,
    localDetailsComplete,
  );
  const lockButtonTheme = getLockButtonTheme(
    targetRole,
    studentUserData.gender,
    localDetailsComplete,
  );

  // ========== VISIBILITY LOGIC ==========
  const viewerId = user.id;
  const viewerRole = user.role;
  const targetId = studentUserData.id;

  const isDetailsComplete = localDetailsComplete === "true";
  const isEmailUnverified = localDetailsComplete === "false";
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
  let canShowVerifyEmail = false;

  // Verify Email button: Only for Admin/Manager viewing users with isUserDetailsComplete === "false"
  if (
    isEmailUnverified &&
    !isSelf &&
    ["Admin", "Manager"].includes(viewerRole)
  ) {
    canShowVerifyEmail = true;
  }

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

  const verifyUserEmail = async () => {
    if (verifyingEmail) return;
    setVerifyingEmail(true);
    try {
      await axios.post(
        `${API_URL}/admin/user/${studentUserData.id}/verify-email`,
        null,
        { withCredentials: true },
      );
      setLocalDetailsComplete("partial");
      // Update cache with new isUserDetailsComplete status
      updateUserInCache(studentUserData.id, {
        isUserDetailsComplete: "partial",
      });
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to verify email");
      alert(`❌ ${error.response?.data?.message || "Failed to verify email"}`);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const makeAsAdmin = async () => {
    if (togglingAdmin) return;
    setTogglingAdmin(true);
    try {
      await axios.post(
        `${API_URL}/manager/user/${studentUserData.id}/makeSingleAsAdmin`,
        null,
        { withCredentials: true },
      );
      setIsUserHavingAdminAccess(true);
      // Update cache with new role
      updateUserInCache(studentUserData.id, { role: "Admin" });
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setTogglingAdmin(false);
    }
  };

  const removeAsAdmin = async () => {
    if (togglingAdmin) return;
    setTogglingAdmin(true);
    try {
      await axios.post(
        `${API_URL}/manager/user/${studentUserData.id}/removeSingleAsAdmin`,
        null,
        { withCredentials: true },
      );
      setIsUserHavingAdminAccess(false);
      // Update cache with new role
      updateUserInCache(studentUserData.id, { role: "Student" });
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setTogglingAdmin(false);
    }
  };

  const handleLockUnlock = async () => {
    if (lockingEvents) return;
    setLockingEvents(true);
    try {
      if (isUserEventsLocked) {
        await unlockUserEvents();
      } else {
        await lockUserEvents();
      }
    } finally {
      setLockingEvents(false);
    }
  };

  const startLockUnlock = () => {
    if (isUserEventsLocked) {
      const hasRestrictedEvents = studentUserData.selectedEvents?.some(
        (ev) => ev.eventType === "Team" || ev.position > 0,
      );

      if (hasRestrictedEvents) {
        setShowUnlockErrorPopup(true);
      } else {
        setShowUnlockPopup(true);
      }
    } else {
      handleLockUnlock();
    }
  };

  const confirmUnlock = async () => {
    setUnlockState("unlocking");
    try {
      await unlockUserEvents();
      setUnlockState("success");
      unlockTimeoutRef.current = setTimeout(() => {
        setShowUnlockPopup(false);
        setUnlockState("confirm");
      }, 1500);
    } catch (error) {
      console.error("Failed to unlock user events", error);
      setUnlockState("confirm");
    }
  };

  const closeUnlockPopup = () => {
    if (unlockState === "unlocking") return;
    setShowUnlockPopup(false);
    setUnlockState("confirm");
  };

  const deleteUser = async () => {
    setDeleteState("deleting");
    try {
      await axios.delete(`${API_URL}/admin/user/${studentUserData.id}`, {
        withCredentials: true,
      });
      setDeleteState("success");
      // Remove user from cache
      removeUserFromCache(studentUserData.id);
      // Wait for success animation then navigate
      timeoutRef.current = setTimeout(() => {
        setShowDeletePopup(false);
        setDeleteState("confirm");
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Failed to delete user", error);
      setDeleteState("confirm");
    }
  };

  const closeDeletePopup = () => {
    if (deleteState === "deleting") return; // Prevent closing while deleting
    setShowDeletePopup(false);
    setDeleteState("confirm");
  };

  return (
    <>
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
              className={`shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black ${jerseyTheme}`}
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
                  {studentUserData.role === "Manager"
                    ? "Manager"
                    : isUserHavingAdminAccess
                      ? "Admin"
                      : "Student"}
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
                  onClick={startLockUnlock}
                  disabled={lockingEvents}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-transform sm:min-w-40 shadow-lg hover:brightness-110 whitespace-nowrap ${lockButtonTheme} ${lockingEvents ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {lockingEvents ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                  ) : isUserEventsLocked ? (
                    ICONS.unlock
                  ) : (
                    ICONS.lock
                  )}
                  <span className="hidden sm:inline">
                    {lockingEvents
                      ? isUserEventsLocked
                        ? "Unlocking..."
                        : "Locking..."
                      : isUserEventsLocked
                        ? "Unlock Events"
                        : "Lock Events"}
                  </span>
                  <span className="sm:hidden">
                    {lockingEvents
                      ? "..."
                      : isUserEventsLocked
                        ? "Unlock"
                        : "Lock"}
                  </span>
                </button>
              )}

              {canShowVerifyEmail && (
                <button
                  onClick={verifyUserEmail}
                  disabled={verifyingEmail}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25 ${verifyingEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {verifyingEmail ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                  ) : (
                    ICONS.verifyEmail
                  )}
                  <span className="hidden sm:inline">
                    {verifyingEmail ? "Verifying..." : "Verify Email"}
                  </span>
                  <span className="sm:hidden">
                    {verifyingEmail ? "..." : "Verify"}
                  </span>
                </button>
              )}

              {canShowDelete && (
                <button
                  onClick={() => setShowDeletePopup(true)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 ${
                    localDetailsComplete === "partial"
                      ? "bg-linear-to-r from-slate-500 to-slate-600 shadow-slate-500/25"
                      : lockButtonTheme
                  }`}
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
                disabled={togglingAdmin}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 ${lockButtonTheme} ${togglingAdmin ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {togglingAdmin ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                ) : isUserHavingAdminAccess ? (
                  ICONS.demoteAdmin
                ) : (
                  ICONS.promoteAdmin
                )}
                <span>
                  {togglingAdmin
                    ? isUserHavingAdminAccess
                      ? "Removing..."
                      : "Making Admin..."
                    : isUserHavingAdminAccess
                      ? "Remove As Admin"
                      : "Make As Admin"}
                </span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= UNLOCK CONFIRMATION POPUP ================= */}
      {showUnlockPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeUnlockPopup}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transition-transform  ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user color */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none   ${
                  unlockState === "success"
                    ? "bg-emerald-500/30"
                    : studentUserData.role === "Manager"
                      ? "bg-red-500/20"
                      : studentUserData.isUserDetailsComplete === "true"
                        ? studentUserData.gender === "Male"
                          ? "bg-sky-500/20"
                          : "bg-pink-500/20"
                        : studentUserData.isUserDetailsComplete === "partial"
                          ? "bg-slate-500/20"
                          : "bg-emerald-500/20"
                }`}
              />
            )}

            <div className="relative p-6 text-center">
              {/* Icon - Changes based on state */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform  ${
                  unlockState === "success"
                    ? "bg-emerald-500/15 scale-110"
                    : unlockState === "unlocking"
                      ? "bg-amber-500/15"
                      : studentUserData.role === "Manager"
                        ? "bg-red-500/10"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "bg-sky-500/10"
                            : "bg-pink-500/10"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "bg-slate-500/10"
                            : "bg-emerald-500/10"
                }`}
              >
                {unlockState === "success" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : unlockState === "unlocking" ? (
                  <span className="animate-spin h-8 w-8 border-3 border-amber-500/30 rounded-full border-t-amber-500" />
                ) : (
                  <div
                    className={`w-8 h-8 flex items-center justify-center ${
                      studentUserData.role === "Manager"
                        ? "text-red-500"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "text-sky-500"
                            : "text-pink-500"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "text-slate-500"
                            : "text-emerald-500"
                    }`}
                  >
                    {ICONS.unlock}
                  </div>
                )}
              </div>

              {/* Title - Changes based on state */}
              <h3
                className={`text-xl font-bold mb-2   ${
                  unlockState === "success"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-white"
                      : "text-slate-900"
                }`}
              >
                {unlockState === "success"
                  ? "Unlocked Successfully!"
                  : unlockState === "unlocking"
                    ? "Unlocking..."
                    : "Unlock Events"}
              </h3>

              {/* Content - Changes based on state */}
              {unlockState === "success" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-emerald-400/80" : "text-emerald-600/80"
                  }`}
                >
                  Events for{" "}
                  {studentUserData.fullname || studentUserData.username} have
                  been unlocked.
                </p>
              ) : unlockState === "unlocking" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Please wait while we unlock the events...
                </p>
              ) : (
                <>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Are you sure you want to unlock events for
                  </p>
                  <p
                    className={`text-base font-bold mb-4 ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {studentUserData.fullname || studentUserData.username}?
                  </p>
                  <p
                    className={`text-xs mb-6 ${
                      darkMode ? "text-amber-400/80" : "text-amber-500/80"
                    }`}
                  >
                    This will remove the user from all their registered events,
                    except for group events or events where they hold a winning
                    position.
                  </p>
                </>
              )}

              {/* Buttons - Only show for confirm state */}
              {unlockState === "confirm" && (
                <div className="flex gap-3">
                  <button
                    onClick={closeUnlockPopup}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-transform ${
                      darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmUnlock}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 ${
                      studentUserData.role === "Manager"
                        ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                            : "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "bg-linear-to-r from-slate-500 to-slate-600 shadow-slate-500/25"
                            : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                    }`}
                  >
                    Unlock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= UNLOCK RESTRICTION ERROR POPUP ================= */}
      {showUnlockErrorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUnlockErrorPopup(false)}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transition-transform  ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {darkMode && (
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none bg-red-500/20" />
            )}

            <div className="relative p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Cannot Unlock Events
              </h3>

              <p
                className={`text-sm mb-6 ${
                  darkMode ? "text-red-400/80" : "text-red-500/80"
                }`}
              >
                You cannot unlock events for this user because they are
                registered in Team events or hold a winning position in an
                event.
              </p>

              <button
                onClick={() => setShowUnlockErrorPopup(false)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-transform ${
                  darkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION POPUP ================= */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeletePopup}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transition-transform  ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user color */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none   ${
                  deleteState === "success"
                    ? "bg-emerald-500/30"
                    : studentUserData.role === "Manager"
                      ? "bg-red-500/20"
                      : studentUserData.isUserDetailsComplete === "true"
                        ? studentUserData.gender === "Male"
                          ? "bg-sky-500/20"
                          : "bg-pink-500/20"
                        : studentUserData.isUserDetailsComplete === "partial"
                          ? "bg-slate-500/20"
                          : "bg-emerald-500/20"
                }`}
              />
            )}

            <div className="relative p-6 text-center">
              {/* Icon - Changes based on state */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform  ${
                  deleteState === "success"
                    ? "bg-emerald-500/15 scale-110"
                    : deleteState === "deleting"
                      ? "bg-amber-500/15"
                      : studentUserData.role === "Manager"
                        ? "bg-red-500/10"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "bg-sky-500/10"
                            : "bg-pink-500/10"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "bg-slate-500/10"
                            : "bg-emerald-500/10"
                }`}
              >
                {deleteState === "success" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : deleteState === "deleting" ? (
                  <span className="animate-spin h-8 w-8 border-3 border-amber-500/30 rounded-full border-t-amber-500" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-8 h-8 fill-current ${
                      studentUserData.role === "Manager"
                        ? "text-red-500"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "text-sky-500"
                            : "text-pink-500"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "text-slate-500"
                            : "text-emerald-500"
                    }`}
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                )}
              </div>

              {/* Title - Changes based on state */}
              <h3
                className={`text-xl font-bold mb-2   ${
                  deleteState === "success"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-white"
                      : "text-slate-900"
                }`}
              >
                {deleteState === "success"
                  ? "Deleted Successfully!"
                  : deleteState === "deleting"
                    ? "Deleting..."
                    : "Delete User"}
              </h3>

              {/* Content - Changes based on state */}
              {deleteState === "success" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-emerald-400/80" : "text-emerald-600/80"
                  }`}
                >
                  {studentUserData.fullname || studentUserData.username} has
                  been removed.
                </p>
              ) : deleteState === "deleting" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Please wait while we remove this user...
                </p>
              ) : (
                <>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Are you sure you want to delete
                  </p>
                  <p
                    className={`text-base font-bold mb-4 ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {studentUserData.fullname || studentUserData.username}?
                  </p>
                  <p
                    className={`text-xs mb-6 ${
                      darkMode ? "text-red-400/80" : "text-red-500/80"
                    }`}
                  >
                    This action cannot be undone.
                  </p>
                </>
              )}

              {/* Buttons - Only show for confirm state */}
              {deleteState === "confirm" && (
                <div className="flex gap-3">
                  <button
                    onClick={closeDeletePopup}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-transform ${
                      darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteUser}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-transform shadow-lg hover:brightness-110 ${
                      studentUserData.role === "Manager"
                        ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                        : studentUserData.isUserDetailsComplete === "true"
                          ? studentUserData.gender === "Male"
                            ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                            : "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                          : studentUserData.isUserDetailsComplete === "partial"
                            ? "bg-linear-to-r from-slate-500 to-slate-600 shadow-slate-500/25"
                            : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Success state - Show redirecting message */}
              {deleteState === "success" && (
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Redirecting...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
