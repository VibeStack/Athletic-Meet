import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useUserDetail } from "../../../../context/UserDetailContext";

const roleAccessPoints = (role) => {
  if (role === "Manager") return 3;
  if (role === "Admin") return 2;
  if (role === "Student") return 1;
  else 0;
};

const getStatusDisplay = (status) => {
  if (status === "present") {
    return {
      bg: "bg-emerald-500",
      text: "text-white",
      label: "Present",
      icon: "✓",
    };
  }
  if (status === "absent") {
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

/* SVG medal icons for positions */
const MEDAL_ICONS = {
  gold: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#FBBF24">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
  silver: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#94A3B8">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
  bronze: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#CD7F32">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
  noPosition: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <path
        d="M8 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  ),
};

const getPositionDisplay = (position) => {
  if (position === 1)
    return {
      icon: MEDAL_ICONS.gold,
      label: "1st Place",
      colorClass: "text-amber-700",
      darkColorClass: "text-amber-300",
      bgClass: "bg-amber-400/30 ring-2 ring-amber-400/60",
      darkBgClass: "bg-amber-400/20 ring-2 ring-amber-400/50",
    };
  if (position === 2)
    return {
      icon: MEDAL_ICONS.silver,
      label: "2nd Place",
      colorClass: "text-slate-600",
      darkColorClass: "text-slate-200",
      bgClass: "bg-slate-300/50 ring-2 ring-slate-400/60",
      darkBgClass: "bg-slate-400/20 ring-2 ring-slate-300/40",
    };
  if (position === 3)
    return {
      icon: MEDAL_ICONS.bronze,
      label: "3rd Place",
      colorClass: "text-orange-700",
      darkColorClass: "text-orange-300",
      bgClass: "bg-orange-400/30 ring-2 ring-orange-500/60",
      darkBgClass: "bg-orange-400/20 ring-2 ring-orange-400/50",
    };
  if (position === 0)
    return {
      icon: MEDAL_ICONS.noPosition,
      label: "No Position",
      colorClass: "text-slate-700",
      darkColorClass: "text-slate-200",
      bgClass: "bg-slate-900/8 ring-1 ring-slate-400/50",
      darkBgClass: "bg-white/5 ring-1 ring-white/20",
    };
  if (position === null || position === undefined) return null;
  return {
    icon: MEDAL_ICONS.trophy,
    label: `#${position} Place`,
    colorClass: "text-purple-600",
    darkColorClass: "text-purple-400",
    bgClass: "bg-purple-400/15 ring-1 ring-purple-400/40",
    darkBgClass: "bg-purple-400/10 ring-1 ring-purple-400/30",
  };
};

const ICONS = {
  trophy: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
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
  plus: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
};

export default function UserDetailEvents({
  studentUserData,
  studentUserEventsList,
  setStudentUserEventsList,
  lockUserEvents,
  darkMode,
  isUserEventsLocked,
}) {
  const { user } = useOutletContext(); // user is me ok and studentUserData is student whose details i am viewing ok
  const API_URL = import.meta.env.VITE_API_URL;
  const { userEventsList, setUserEventsList } = useUserDetail();

  const viewerId = user.id;
  const viewerRole = user.role;
  const targetId = studentUserData.id;
  const targetRole = studentUserData.role;
  const isDetailsComplete = studentUserData.isUserDetailsComplete === "true";
  const isSelf = viewerId === targetId;

  const [updating, setUpdating] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(null); // { clickedEventId, prevStatus, newStatus }

  const isViewerHigherRole = () => {
    const roleRank = { Manager: 3, Admin: 2, Student: 1 };
    return (roleRank[viewerRole] || 0) > (roleRank[targetRole] || 0);
  };

  const [allEvents, setAllEvents] = useState([]);
  const [updatedEventsArray, setupdatedEventsArray] = useState(
    (studentUserEventsList || [])
      .filter((ev) => ev.eventType !== "Team")
      .map(({ eventId, eventType }) => ({ eventId, eventType })),
  );

  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const openAddEventModal = async () => {
    try {
      const { data: response } = await axios.get(`${API_URL}/user/events`, {
        withCredentials: true,
      });
      const gender = studentUserData.gender === "Male" ? "Boys" : "Girls";
      setAllEvents(
        response.data.filter(
          (e) => e.category === gender && e.isActive && e.type !== "Team",
        ),
      );

      setShowAddEventModal(true);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const updateUserEvents = async () => {
    if (updating) return;

    try {
      if (!updatedEventsArray || updatedEventsArray.length === 0) {
        alert("Please select at least one event");
        return;
      }

      setUpdating(true);

      const updatedEventsIdsArray = updatedEventsArray.map(
        ({ eventId }) => eventId,
      );

      const { data: response } = await axios.post(
        `${API_URL}/admin/users/${studentUserData.id}/updateEvents`,
        { updatedEventsIdsArray },
        { withCredentials: true },
      );

      if (isSelf) {
        setUserEventsList(response.data);
      }

      setStudentUserEventsList(response.data);
      await lockUserEvents();
      setShowAddEventModal(false);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Failed to update user events. Please try again.";
      alert(msg);
      console.error("Failed to update user events", error);
    } finally {
      setUpdating(false);
    }
  };

  const markAttendance = async (eventId, status) => {
    const clickedEventId = eventId;
    const newStatus = status;

    const prevStatus = studentUserEventsList.find(
      (ev) => ev.eventId === eventId,
    )?.attendanceStatus;

    if (markingAttendance) return; // prevent double click

    // same-state short circuit (UX + saves API call)
    if (prevStatus === newStatus) {
      alert("Attendance is already in this state.");
      return;
    }

    setMarkingAttendance({ clickedEventId, prevStatus, newStatus });

    try {
      await axios.post(
        `${API_URL}/admin/user/event/attendance`,
        {
          jerseyNumber: studentUserData.jerseyNumber,
          clickedEventId,
          prevStatus,
          newStatus,
        },
        { withCredentials: true },
      );

      // update self context (if needed)
      if (isSelf) {
        setUserEventsList((prev) =>
          prev.map((ev) =>
            ev.eventId === eventId
              ? { ...ev, userEventAttendance: newStatus }
              : ev,
          ),
        );
      }

      // update viewed student list
      setStudentUserEventsList((prev) =>
        prev.map((ev) =>
          ev.eventId === eventId ? { ...ev, attendanceStatus: newStatus } : ev,
        ),
      );
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (msg === "User events not locked") {
        alert("Please lock user events before marking attendance.");
      } else if (msg === "Attendance state has already changed") {
        alert("Attendance was updated by someone else. Please refresh.");
      } else if (msg === "Event counter conflict") {
        alert("Attendance update conflict. Please try again.");
      } else {
        alert("Failed to mark attendance. Please try again.");
      }

      console.error("Failed to mark attendance", err);
    } finally {
      setMarkingAttendance(null);
    }
  };

  console.log(studentUserEventsList);

  return (
    <>
      <section
        className={`lg:col-span-7 rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-900/80 border border-white/10"
            : "bg-white border border-slate-200 shadow-lg"
        }`}
      >
        <div
          className={`px-4 py-3 flex items-center justify-between border-b ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                darkMode ? "bg-slate-700" : "bg-slate-800"
              }`}
            >
              {ICONS.trophy}
            </div>
            <h2
              className={`font-bold text-[12px] sm:text-sm ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              Registered Events
            </h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                darkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {studentUserEventsList?.length || 0}
            </span>
          </div>

          {!isUserEventsLocked &&
            (isSelf || isViewerHigherRole()) &&
            isDetailsComplete && (
              <button
                onClick={openAddEventModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-transform ${
                  darkMode
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {ICONS.plus}
                Add Event
              </button>
            )}
        </div>

        <div className="p-3">
          {studentUserEventsList?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentUserEventsList.map(
                ({
                  eventId,
                  eventName,
                  eventType,
                  position,
                  attendanceStatus,
                }) => {
                  const statusDisplay = getStatusDisplay(attendanceStatus);
                  return (
                    <div
                      key={eventId}
                      className={`rounded-xl p-4 ${
                        darkMode
                          ? "bg-slate-800/70 border border-white/5 hover:border-white/10"
                          : "bg-slate-50 border border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      {/* Row 1: Event Name + Status Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`font-extrabold text-base leading-tight ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {eventName}
                        </h3>

                        {/* Current Status Badge */}
                        <span
                          className={`shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold uppercase ${statusDisplay.bg} ${statusDisplay.text} shadow-sm`}
                        >
                          <span className="text-xs">{statusDisplay.icon}</span>
                          <span>{statusDisplay.label}</span>
                        </span>
                      </div>

                      {/* Row 2: Centered Position Badge */}
                      {(() => {
                        const pos = getPositionDisplay(position);
                        if (!pos) return null;
                        return (
                          <div className="flex justify-center my-3">
                            <div
                              className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full font-bold text-xs ${
                                darkMode
                                  ? `${pos.darkBgClass} ${pos.darkColorClass}`
                                  : `${pos.bgClass} ${pos.colorClass}`
                              }`}
                            >
                              {pos.icon}
                              <span className="tracking-wide">{pos.label}</span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Row 3: Event Type Tag */}
                      <div className="mt-2 mb-3">
                        <span
                          className={`inline-block text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            eventType === "Track"
                              ? darkMode
                                ? "bg-orange-500/25 text-orange-400"
                                : "bg-orange-100 text-orange-600"
                              : eventType === "Field"
                                ? darkMode
                                  ? "bg-emerald-500/25 text-emerald-400"
                                  : "bg-emerald-100 text-emerald-600"
                                : darkMode
                                  ? "bg-blue-500/25 text-blue-400"
                                  : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {eventType}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => markAttendance(eventId, "present")}
                          disabled={markingAttendance !== null}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-transform ${
                            attendanceStatus === "present"
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                              : darkMode
                                ? "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70 border border-emerald-700/30"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          } ${markingAttendance !== null ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {markingAttendance?.clickedEventId === eventId &&
                          markingAttendance?.newStatus === "present" ? (
                            <span className="animate-spin h-4 w-4 border-2 border-current/30 rounded-full border-t-current" />
                          ) : (
                            <>
                              <span className="text-sm">✓</span>
                              <span>Present</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => markAttendance(eventId, "absent")}
                          disabled={markingAttendance !== null}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-transform ${
                            attendanceStatus === "absent"
                              ? "bg-red-500 text-white shadow-md shadow-red-500/30 ring-2 ring-red-400/50"
                              : darkMode
                                ? "bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-700/30"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                          } ${markingAttendance !== null ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {markingAttendance?.clickedEventId === eventId &&
                          markingAttendance?.newStatus === "absent" ? (
                            <span className="animate-spin h-4 w-4 border-2 border-current/30 rounded-full border-t-current" />
                          ) : (
                            <>
                              <span className="text-sm">✗</span>
                              <span>Absent</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => markAttendance(eventId, "notMarked")}
                          disabled={markingAttendance !== null}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-transform ${
                            attendanceStatus === "notMarked" ||
                            !attendanceStatus
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50"
                              : darkMode
                                ? "bg-amber-900/50 text-amber-400 hover:bg-amber-900/70 border border-amber-700/30"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          } ${markingAttendance !== null ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                          {markingAttendance?.clickedEventId === eventId &&
                          markingAttendance?.newStatus === "notMarked" ? (
                            <span className="animate-spin h-4 w-4 border-2 border-current/30 rounded-full border-t-current" />
                          ) : (
                            <>
                              <span className="text-sm">○</span>
                              <span>Reset</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <div
              className={`text-center py-16 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  darkMode ? "bg-slate-800" : "bg-slate-100"
                }`}
              >
                {ICONS.trophy}
              </div>
              <p className="text-sm font-semibold">No events registered</p>
              <p className="text-xs mt-1">Click "Add Event" to register.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= ADD EVENT MODAL ================= */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddEventModal(false)}
          />

          <div
            className={`relative w-full max-w-3xl max-h-[95vh] overflow-hidden rounded-2xl ${
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
                    className={`text-base font-bold ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    Add Event for {studentUserData.username}
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
                      const trackCount = updatedEventsArray.filter(
                        (e) => e.eventType === "Track",
                      ).length;

                      const fieldCount = updatedEventsArray.filter(
                        (e) => e.eventType === "Field",
                      ).length;

                      const tfTotal = trackCount + fieldCount;

                      const isSelected = updatedEventsArray.some(
                        (e) => e.eventId === event.id,
                      );

                      const isDisabled =
                        !isSelected && (trackCount >= 2 || tfTotal >= 3);

                      return (
                        <div
                          key={event.id}
                          onClick={() => {
                            if (isDisabled) return;

                            setupdatedEventsArray((prev) =>
                              isSelected
                                ? prev.filter((e) => e.eventId !== event.id)
                                : [
                                    ...prev,
                                    { eventId: event.id, eventType: "Track" },
                                  ],
                            );
                          }}
                          className={`relative rounded-lg p-2.5 transition-transform cursor-pointer ${
                            isSelected
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                                ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                                : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          } ${
                            isDisabled ? "opacity-40 pointer-events-none" : ""
                          }`}
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
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {event.day}
                          </p>

                          {isSelected && (
                            <span className="absolute bottom-2 right-2 text-[8px] font-bold text-emerald-500">
                              {ICONS.check} Selected
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
                      const trackCount = updatedEventsArray.filter(
                        (e) => e.eventType === "Track",
                      ).length;

                      const fieldCount = updatedEventsArray.filter(
                        (e) => e.eventType === "Field",
                      ).length;

                      const tfTotal = trackCount + fieldCount;

                      const isSelected = updatedEventsArray.some(
                        (e) => e.eventId === event.id,
                      );

                      const isDisabled =
                        !isSelected && (fieldCount >= 2 || tfTotal >= 3);

                      return (
                        <div
                          key={event.id}
                          onClick={() => {
                            if (isDisabled) return;

                            setupdatedEventsArray((prev) =>
                              isSelected
                                ? prev.filter((e) => e.eventId !== event.id)
                                : [
                                    ...prev,
                                    { eventId: event.id, eventType: "Field" },
                                  ],
                            );
                          }}
                          className={`relative rounded-lg p-2.5 transition-transform cursor-pointer ${
                            isSelected
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                                ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                                : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          } ${
                            isDisabled ? "opacity-40 pointer-events-none" : ""
                          }`}
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
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {event.day}
                          </p>

                          {isSelected && (
                            <span className="absolute bottom-2 right-2 text-[8px] font-bold text-emerald-500">
                              {ICONS.check} Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div
              className={`py-2 px-5 flex gap-2 min-h-[5vh] justify-end border-t ${
                darkMode ? "border-white/10" : "border-slate-200"
              }`}
            >
              <button
                onClick={updateUserEvents}
                disabled={updating}
                className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  updating
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {updating ? "Updating..." : "Update"}
              </button>

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
    </>
  );
}
