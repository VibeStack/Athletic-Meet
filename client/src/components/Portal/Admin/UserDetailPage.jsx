import React, { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import axios from "axios";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import UserDetailHeader from "./UserDetail/UserDetailHeader";
import UserDetailEvents from "./UserDetail/UserDetailEvents";
import UserDetailInfo from "./UserDetail/UserDetailInfo";

/* -------------------- Color Theme Functions -------------------- */
const getJerseyBadgeTheme = (role, gender) => {
  if (role === "Manager") {
    return "bg-linear-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/30";
  }
  if (gender === "Male") {
    return "bg-linear-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30";
  }
  if (gender === "Female") {
    return "bg-linear-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-500/30";
  }
  return "bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30";
};

const getLockButtonTheme = (role, gender) => {
  if (role === "Manager") {
    return "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25";
  }
  if (gender === "Male") {
    return "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25";
  }
  if (gender === "Female") {
    return "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25";
  }
  return "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25";
};

const getRoleTheme = (role, gender, darkMode) => {
  if (role === "Manager") {
    return darkMode
      ? "bg-red-500/15 text-red-400 ring-red-500/30"
      : "bg-red-50 text-red-700 ring-red-200";
  }
  if (role === "Admin") {
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
    return darkMode
      ? "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  return darkMode
    ? "bg-slate-700/50 text-slate-300 ring-slate-600"
    : "bg-slate-800 text-slate-100 ring-slate-700";
};

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  user: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
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
  plus: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  track: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M13.5 5.5a2 2 0 100-4 2 2 0 000 4zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
  ),
  field: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <circle cx="12" cy="5" r="3" />
      <path d="M12 10c-4 0-7 2-7 5v5h14v-5c0-3-3-5-7-5z" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
};

export default function UserDetailPage() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { darkMode } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [isUserEventsLocked, setIsUserEventsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);

  // Get current logged-in user
  const { user: currentUser } = useOutletContext();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: response } = await axios.get(
          `${BASE_URL}/admin/user/${userId}`,
          { withCredentials: true }
        );

        // Access control: Admin cannot view Manager details
        if (currentUser?.role === "Admin" && response.data.role === "Manager") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setUserData(response.data);
        setIsUserEventsLocked(response.data.isEventsLocked);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, BASE_URL, currentUser]);

  const lockUserEvents = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/users/${userData.id}/events/lock`,
        {},
        { withCredentials: true }
      );
      setIsUserEventsLocked(true);
    } catch (err) {
      console.error("Failed to lock events", err);
    }
  };

  const unlockUserEvents = async () => {
    try {
      await axios.post(
        `${BASE_URL}/admin/users/${userData.id}/events/unlock`,
        {},
        { withCredentials: true }
      );
      setIsUserEventsLocked(false);
    } catch (err) {
      console.error("Failed to unlock events", err);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/admin/user/${userData.id}`, {
        withCredentials: true,
      });
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const markAttendance = async (eventId, status) => {
    try {
      await axios.post(
        `${BASE_URL}/admin/user/event/attendance`,
        { jerseyNumber: userData.jerseyNumber, eventId, status },
        { withCredentials: true }
      );
      setUserData((prev) => ({
        ...prev,
        selectedEvents: prev.selectedEvents.map((ev) =>
          ev.eventId === eventId ? { ...ev, attendanceStatus: status } : ev
        ),
      }));
    } catch (err) {
      console.error("Failed to mark attendance", err);
    }
  };

  const openAddEventModal = async () => {
    try {
      const { data: response } = await axios.get(`${BASE_URL}/user/events`, {
        withCredentials: true,
      });
      const gender = userData.gender === "Male" ? "Boys" : "Girls";
      setAllEvents(response.data.filter((e) => e.category === gender));
      setShowAddEventModal(true);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  if (loading) {
    return (
      <LoadingComponent
        title="Loading User Details"
        message="Fetching profile and events..."
      />
    );
  }

  const getStatusDisplay = (status) => {
    if (status === "Present") {
      return {
        bg: "bg-emerald-500",
        text: "text-white",
        label: "Present",
        icon: "✓",
      };
    }
    if (status === "Absent") {
      return {
        bg: "bg-red-500",
        text: "text-white",
        label: "Absent",
        icon: "✗",
      };
    }
    return {
      bg: "bg-amber-500",
      text: "text-white",
      label: "Not Marked",
      icon: "○",
    };
  };

  // Access Denied Screen
  if (accessDenied) {
    return <ManagerDetailsAccessDenied />;
  }

  return (
    <>
      <div className="space-y-5">
        {/* ================= USER HEADER ================= */}
        <UserDetailHeader
          userData={userData}
          darkMode={darkMode}
          isUserEventsLocked={isUserEventsLocked}
          lockUserEvents={lockUserEvents}
          unlockUserEvents={unlockUserEvents}
          setShowDeletePopup={setShowDeletePopup}
        />

        {/* ================= MAIN CONTENT - 60/40 SPLIT ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* LEFT: REGISTERED EVENTS - Takes 3/5 width */}
          <UserDetailEvents
            userData={userData}
            darkMode={darkMode}
            openAddEventModal={openAddEventModal}
            markAttendance={markAttendance}
            getStatusDisplay={getStatusDisplay}
          />

          {/* RIGHT: USER INFO - Takes 2/5 width */}
          <UserDetailInfo userData={userData} darkMode={darkMode} />
        </section>
      </div>

      {/* ================= ADD EVENT MODAL ================= */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddEventModal(false)}
          />

          <div
            className={`relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            <div
              className={`px-5 py-4 flex items-center justify-between border-b ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    darkMode
                      ? "bg-linear-to-br from-cyan-500 to-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  {ICONS.trophy}
                </div>
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    Add Event for {userData.username}
                  </h2>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Select events to register
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  darkMode
                    ? "hover:bg-white/10 text-slate-400"
                    : "hover:bg-slate-100 text-slate-500"
                }`}
              >
                {ICONS.close}
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(80vh-130px)]">
              {/* Track Events */}
              <div className="mb-5">
                <h3
                  className={`text-xs font-bold mb-2 flex items-center gap-2 ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      darkMode ? "bg-orange-500/20" : "bg-orange-100"
                    }`}
                  >
                    {ICONS.track}
                  </span>
                  Track Events
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allEvents
                    .filter((e) => e.type === "Track")
                    .map((event) => {
                      const isRegistered = userData.selectedEvents?.some(
                        (se) => se.eventId === event.id
                      );
                      return (
                        <div
                          key={event.id}
                          className={`rounded-lg p-2.5 cursor-pointer transition-all ${
                            isRegistered
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                              ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                              : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          }`}
                          onClick={() => {
                            /* TODO: Add event logic */
                          }}
                        >
                          <p
                            className={`font-semibold text-xs ${
                              darkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {event.name}
                          </p>
                          <p
                            className={`text-[9px] ${
                              darkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            {event.day}
                          </p>
                          {isRegistered && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-bold text-emerald-500">
                              {ICONS.check} Registered
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Field Events */}
              <div className="mb-5">
                <h3
                  className={`text-xs font-bold mb-2 flex items-center gap-2 ${
                    darkMode ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      darkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                    }`}
                  >
                    {ICONS.field}
                  </span>
                  Field Events
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allEvents
                    .filter((e) => e.type === "Field")
                    .map((event) => {
                      const isRegistered = userData.selectedEvents?.some(
                        (se) => se.eventId === event.id
                      );
                      return (
                        <div
                          key={event.id}
                          className={`rounded-lg p-2.5 cursor-pointer transition-all ${
                            isRegistered
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                              ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                              : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          }`}
                          onClick={() => {
                            /* TODO: Add event logic */
                          }}
                        >
                          <p
                            className={`font-semibold text-xs ${
                              darkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {event.name}
                          </p>
                          <p
                            className={`text-[9px] ${
                              darkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            {event.day}
                          </p>
                          {isRegistered && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-bold text-emerald-500">
                              {ICONS.check} Registered
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Team Events */}
              <div>
                <h3
                  className={`text-xs font-bold mb-2 flex items-center gap-2 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center ${
                      darkMode ? "bg-blue-500/20" : "bg-blue-100"
                    }`}
                  >
                    {ICONS.team}
                  </span>
                  Team Events
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allEvents
                    .filter((e) => e.type === "Team")
                    .map((event) => {
                      const isRegistered = userData.selectedEvents?.some(
                        (se) => se.eventId === event.id
                      );
                      return (
                        <div
                          key={event.id}
                          className={`rounded-lg p-2.5 cursor-pointer transition-all ${
                            isRegistered
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                              ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                              : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          }`}
                          onClick={() => {
                            /* TODO: Add event logic */
                          }}
                        >
                          <p
                            className={`font-semibold text-xs ${
                              darkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {event.name}
                          </p>
                          <p
                            className={`text-[9px] ${
                              darkMode ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            {event.day}
                          </p>
                          {isRegistered && (
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-bold text-emerald-500">
                              {ICONS.check} Registered
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div
              className={`px-5 py-3 flex justify-end border-t ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <button
                onClick={() => setShowAddEventModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
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
            onClick={() => setShowDeletePopup(false)}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user color */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
                  userData.role === "Manager"
                    ? "bg-red-500/20"
                    : userData.gender === "Male"
                    ? "bg-sky-500/20"
                    : userData.gender === "Female"
                    ? "bg-pink-500/20"
                    : "bg-emerald-500/20"
                }`}
              />
            )}

            <div className="relative p-6 text-center">
              {/* Icon - Color based on role/gender */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  userData.role === "Manager"
                    ? "bg-red-500/10"
                    : userData.gender === "Male"
                    ? "bg-sky-500/10"
                    : userData.gender === "Female"
                    ? "bg-pink-500/10"
                    : "bg-emerald-500/10"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-8 h-8 fill-current ${
                    userData.role === "Manager"
                      ? "text-red-500"
                      : userData.gender === "Male"
                      ? "text-sky-500"
                      : userData.gender === "Female"
                      ? "text-pink-500"
                      : "text-emerald-500"
                  }`}
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Delete User
              </h3>
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
                {userData.fullname || userData.username}?
              </p>
              <p
                className={`text-xs mb-6 ${
                  darkMode ? "text-red-400/80" : "text-red-500/80"
                }`}
              >
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    darkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    deleteUser();
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${
                    userData.role === "Manager"
                      ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                      : userData.gender === "Male"
                      ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                      : userData.gender === "Female"
                      ? "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                      : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
