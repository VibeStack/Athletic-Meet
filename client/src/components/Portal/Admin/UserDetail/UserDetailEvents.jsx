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
/* -------------------- SVG Icons -------------------- */
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
  const { userEventsList, setUserEventsList, fetchUserDetails } =
    useUserDetail();

  const viewerId = user.id;
  const viewerRole = user.role;
  const targetId = studentUserData.id;
  const targetRole = studentUserData.role;
  const isDetailsComplete = studentUserData.isUserDetailsComplete === "true";
  const isSelf = viewerId === targetId;

  const [updating, setUpdating] = useState(false);


  const isViewerHigherRole = () => {
    const roleRank = { Manager: 3, Admin: 2, Student: 1 };
    return (roleRank[viewerRole] || 0) > (roleRank[targetRole] || 0);
  };

  const [allEvents, setAllEvents] = useState([]);
  const [updatedEventsArray, setupdatedEventsArray] = useState(
    studentUserEventsList.map(({ eventId, eventType }) => {
      return { eventId, eventType };
    }),
  );
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const openAddEventModal = async () => {
    try {
      const { data: response } = await axios.get(`${API_URL}/user/events`, {
        withCredentials: true,
      });
      const gender = studentUserData.gender === "Male" ? "Boys" : "Girls";
      setAllEvents(
        response.data.filter((e) => e.category === gender && e.isActive),
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
    try {
      await axios.post(
        `${API_URL}/admin/user/event/attendance`,
        { jerseyNumber: studentUserData.jerseyNumber, eventId, status },
        { withCredentials: true },
      );

      if (isSelf) {
        setUserEventsList(
          userEventsList.map((ev) => {
            if (ev.eventId === eventId) {
              ev.userEventAttendance = status;
            }
            return ev;
          }),
        );
      }
      setStudentUserEventsList(
        studentUserEventsList.map((ev) => {
          if (ev.eventId === eventId) {
            ev.attendanceStatus = status;
          }
          return ev;
        }),
      );
    } catch (err) {
      if (err?.response?.data?.message === "User events are not locked") {
        alert("Please lock user events before marking attendance.");
      }
      console.error("Failed to mark attendance", err);
    }
  };

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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
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
                ({ eventId, eventName, eventType, attendanceStatus }) => {
                  const statusDisplay = getStatusDisplay(attendanceStatus);
                  return (
                    <div
                      key={eventId}
                      className={`rounded-xl p-4 transition-all ${
                        darkMode
                          ? "bg-slate-800/70 border border-white/5 hover:border-white/10"
                          : "bg-slate-50 border border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className={`font-bold text-sm leading-tight ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {eventName}
                        </h3>

                        {/* Current Status Badge */}
                        <span
                          className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold uppercase ${statusDisplay.bg} ${statusDisplay.text} shadow-sm`}
                        >
                          <span className="text-xs">{statusDisplay.icon}</span>
                          <span>{statusDisplay.label}</span>
                        </span>
                      </div>

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

                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => markAttendance(eventId, "present")}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            attendanceStatus === "present"
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                              : darkMode
                                ? "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70 border border-emerald-700/30"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                          }`}
                        >
                          <span className="text-sm">✓</span>
                          <span>Present</span>
                        </button>
                        <button
                          onClick={() => markAttendance(eventId, "absent")}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            attendanceStatus === "absent"
                              ? "bg-red-500 text-white shadow-md shadow-red-500/30 ring-2 ring-red-400/50"
                              : darkMode
                                ? "bg-red-900/50 text-red-400 hover:bg-red-900/70 border border-red-700/30"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                          }`}
                        >
                          <span className="text-sm">✗</span>
                          <span>Absent</span>
                        </button>
                        <button
                          onClick={() => markAttendance(eventId, "notMarked")}
                          className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                            attendanceStatus === "notMarked" ||
                            !attendanceStatus
                              ? "bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50"
                              : darkMode
                                ? "bg-amber-900/50 text-amber-400 hover:bg-amber-900/70 border border-amber-700/30"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          }`}
                        >
                          <span className="text-sm">○</span>
                          <span>Reset</span>
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
                          className={`relative rounded-lg p-2.5 transition-all cursor-pointer ${
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
                          className={`relative rounded-lg p-2.5 transition-all cursor-pointer ${
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
                      const teamCount = updatedEventsArray.filter(
                        (e) => e.eventType === "Team",
                      ).length;

                      const isSelected = updatedEventsArray.some(
                        (e) => e.eventId === event.id,
                      );

                      const isDisabled = !isSelected && teamCount >= 2;

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
                                    { eventId: event.id, eventType: "Team" },
                                  ],
                            );
                          }}
                          className={`relative rounded-lg p-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? darkMode
                                ? "bg-emerald-900/50 ring-2 ring-emerald-500"
                                : "bg-emerald-50 ring-2 ring-emerald-400"
                              : darkMode
                                ? "bg-slate-800/80 ring-1 ring-white/10 hover:ring-white/20"
                                : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                          }${
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
              className={`py-2 px-5 flex gap-2 justify-end border-t ${
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
