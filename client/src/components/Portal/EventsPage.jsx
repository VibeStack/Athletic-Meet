import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import LoadingComponent from "./LoadingComponent";

const MAX_EVENTS = 3;

/* -------------------- Section Icons -------------------- */
const SECTION_ICONS = {
  track: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M13.5 5.5a2 2 0 100-4 2 2 0 000 4zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
  ),
  field: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <circle cx="12" cy="5" r="3" />
      <path d="M12 10c-4 0-7 2-7 5v5h14v-5c0-3-3-5-7-5z" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
    </svg>
  ),
  rules: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  ),
};

export default function EventsPage() {
  const { darkMode } = useTheme();
  const { user, refetchUserProfile } = useOutletContext();
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const [enrolling, setEnrolling] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Refetch user profile on mount to get latest data
  useEffect(() => {
    if (refetchUserProfile) refetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: response } = await axios.get(`${BASE_URL}/user/events`, {
          withCredentials: true,
        });

        const genderBasedFilteredEvents = response.data.filter((event) => {
          if (user.gender === "Male") return event.category === "Boys";
          return event.category === "Girls";
        });

        const selectedEventIds = (user.selectedEvents || []).map(
          (e) => e.eventId
        );

        const enrolledEventsDB = genderBasedFilteredEvents.filter((event) =>
          selectedEventIds.includes(event.id)
        );

        setEnrolledEvents(enrolledEventsDB.map((e) => e.id));
        setIsLocked(selectedEventIds.length > 0);

        const mappedEvents = genderBasedFilteredEvents.map((event) => ({
          id: event.id,
          name: event.name,
          day: event.day,
          type: event.type,
          category: event.category,
        }));

        setAllEvents(mappedEvents);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user.gender, user.selectedEvents, BASE_URL]);

  const trackEvents = allEvents.filter((e) => e.type === "Track");
  const fieldEvents = allEvents.filter((e) => e.type === "Field");
  const teamEvents = allEvents.filter((e) => e.type === "Team");

  const enrollmentStats = useMemo(() => {
    const enrolled = allEvents.filter((e) => enrolledEvents.includes(e.id));
    return {
      trackCount: enrolled.filter((e) => e.type === "Track").length,
      fieldCount: enrolled.filter((e) => e.type === "Field").length,
      teamCount: enrolled.filter((e) => e.type === "Team").length,
      total: enrolled.length,
    };
  }, [enrolledEvents, allEvents]);

  const canEnrollInEvent = (event) => {
    if (isLocked) return false;

    const enrolled = enrolledEvents.includes(event.id);

    // TEAM EVENTS - No one can self-enroll (Admin/Manager enrolls from UserDetailPage)
    if (event.type === "Team") {
      return false; // Always false for self-enrollment, but enrolled ones still show
    }

    // TRACK / FIELD EVENTS - Max 3 self-enrollment
    const { trackCount, fieldCount } = enrollmentStats;
    const trackFieldTotal = trackCount + fieldCount;

    if (enrolled) return true;
    if (trackFieldTotal >= MAX_EVENTS) return false;

    if (event.type === "Track") {
      return trackCount < 2 && trackFieldTotal < 3;
    }

    if (event.type === "Field") {
      return fieldCount < 2 && trackFieldTotal < 3;
    }

    return false;
  };

  const handleEnroll = async (eventId) => {
    if (isLocked) return;
    const event = allEvents.find((e) => e.id === eventId);
    if (!canEnrollInEvent(event) && !enrolledEvents.includes(eventId)) return;

    setEnrolling(eventId);
    setEnrolledEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
    setEnrolling(null);
  };

  const handleLockEvents = async () => {
    if (enrolledEvents.length === 0 || enrolledEvents.length > MAX_EVENTS) {
      alert(`Please select 1-${MAX_EVENTS} events before locking.`);
      return;
    }

    setLocking(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/events/lock`,
        { events: enrolledEvents },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsLocked(true);
        alert(`✅ Successfully locked ${enrolledEvents.length} event(s)!`);
      }
    } catch (err) {
      console.error("Failed to lock events", err);
      alert("❌ Failed to lock events. Please try again.");
    } finally {
      setLocking(false);
    }
  };

  const handleUnlockEvents = async () => {
    setLocking(true);
    try {
      await axios.post(
        `${BASE_URL}/admin/users/${user.id}/events/unlock`,
        {},
        { withCredentials: true }
      );

      setIsLocked(false);
      setEnrolledEvents([]);
      alert(
        "✅ Events unlocked successfully! You can now select events again."
      );
    } catch (err) {
      console.error("Failed to unlock events", err);
      alert("❌ Failed to unlock events. Please try again.");
    } finally {
      setLocking(false);
    }
  };

  /* -------------------- Event Card (Compact) -------------------- */
  const EventCard = ({ event }) => {
    const isEnrolled = enrolledEvents.includes(event.id);
    const canEnroll = canEnrollInEvent(event);
    const isTeam = event.type === "Team";
    const isDisabled = !canEnroll && !isEnrolled;

    // Team events: greyed unless already enrolled (by Admin/Manager from elsewhere)
    const isTeamAndNotEnrolled = isTeam && !isEnrolled;

    return (
      <div
        className={`group rounded-xl p-3 sm:p-4 transition-all duration-200 relative h-full flex flex-col ${
          isTeamAndNotEnrolled
            ? darkMode
              ? "bg-slate-900/50 ring-1 ring-dashed ring-slate-700 opacity-60 grayscale-30"
              : "bg-slate-100/80 ring-1 ring-dashed ring-slate-300 opacity-70 grayscale-20"
            : isEnrolled
            ? darkMode
              ? "bg-emerald-950/60 ring-2 ring-emerald-500/60"
              : "bg-emerald-50 ring-2 ring-emerald-400"
            : darkMode
            ? "bg-slate-900/80 ring-1 ring-white/8 hover:ring-cyan-500/40"
            : "bg-white ring-1 ring-slate-200 hover:ring-slate-400 shadow-sm hover:shadow-md"
        } ${isDisabled && !isTeamAndNotEnrolled ? "opacity-50" : ""}`}
      >
        {/* Enrolled glow - dark mode */}
        {isEnrolled && darkMode && (
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/25 blur-2xl rounded-full pointer-events-none" />
        )}

        {/* Type badge - UPDATED COLORS: Orange, Green, Blue */}
        <span
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
            event.type === "Track"
              ? darkMode
                ? "bg-orange-500/25 text-orange-400"
                : "bg-orange-100 text-orange-600"
              : event.type === "Field"
              ? darkMode
                ? "bg-emerald-500/25 text-emerald-400"
                : "bg-emerald-100 text-emerald-600"
              : darkMode
              ? "bg-blue-500/25 text-blue-400"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {event.type}
        </span>

        {/* Content area with fixed height for title */}
        <div className="relative pr-12 sm:pr-14 flex-1">
          <div className="flex items-start gap-1.5 mb-0.5 min-h-9">
            <h3
              className={`font-semibold text-[13px] leading-tight line-clamp-2 ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              {event.name}
            </h3>
            {isEnrolled && (
              <span
                className={`w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${
                  darkMode
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-emerald-500 shadow-md"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 text-white fill-none stroke-current stroke-3"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>

          <p
            className={`text-[11px] ${
              darkMode ? "text-slate-500" : "text-slate-500"
            }`}
          >
            {event.category} • {event.day === "Both" ? "Day 1 & 2" : event.day}
          </p>
        </div>

        <button
          onClick={() => handleEnroll(event.id)}
          disabled={isLocked || isTeam || isDisabled || enrolling === event.id}
          className={`mt-3 w-full py-2 rounded-lg text-[11px] font-bold transition-all duration-200 grid place-items-center ${
            isTeamAndNotEnrolled
              ? darkMode
                ? "bg-transparent border border-dashed border-slate-600 text-slate-500 cursor-not-allowed"
                : "bg-transparent border border-dashed border-slate-300 text-slate-400 cursor-not-allowed"
              : isEnrolled
              ? darkMode
                ? "bg-linear-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500"
                : "bg-linear-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600"
              : canEnroll
              ? darkMode
                ? "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 text-white hover:brightness-110"
                : "bg-linear-to-r from-slate-700 via-slate-800 to-slate-900 text-white hover:from-slate-600 hover:via-slate-700 hover:to-slate-800"
              : darkMode
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          } ${
            isLocked || (isTeam && isEnrolled)
              ? "cursor-not-allowed opacity-60"
              : ""
          }`}
        >
          {/* Invisible text to maintain consistent width */}
          <span className="invisible col-start-1 row-start-1">Team Only</span>
          <span className="col-start-1 row-start-1">
            {enrolling === event.id
              ? "..."
              : (isLocked && isEnrolled) || (isTeam && isEnrolled)
              ? "Locked"
              : isTeamAndNotEnrolled
              ? "Team Only"
              : isEnrolled
              ? "Remove"
              : "Enroll"}
          </span>
        </button>
      </div>
    );
  };

  /* -------------------- Section Component -------------------- */
  const Section = ({ title, icon, iconlinear, events, count }) => (
    <div
      className={`rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-[#0f172a]/90 ring-1 ring-white/8 shadow-[0_0_60px_-15px_rgba(56,189,248,0.15)]"
          : "bg-white ring-1 ring-slate-200 shadow-lg"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between border-b ${
          darkMode ? "border-white/6" : "border-slate-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white ${iconlinear}`}
          >
            {icon}
          </div>
          <div>
            <h2
              className={`font-bold text-sm sm:text-base ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              {title}
            </h2>
            <p
              className={`text-[11px] ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {events.length} events available
            </p>
          </div>
        </div>

        {count > 0 && (
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
              darkMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {count} enrolled
          </span>
        )}
      </div>

      {/* Events Grid - 1 → 2 → 3 → 4 → 5 columns */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p
            className={`col-span-full text-center py-8 text-sm ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            No events available
          </p>
        )}
      </div>
    </div>
  );

  /* -------------------- Loading State -------------------- */
  if (loading) {
    return (
      <LoadingComponent
        title="Loading Events"
        message="Preparing available events for you"
      />
    );
  }

  /* -------------------- Main UI -------------------- */
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Section - Trophy now BLUE */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(56,189,248,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Background glow effects - Dark mode */}
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-cyan-500" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-blue-600" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Trophy - Now BLUE linear */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-cyan-500 to-blue-600"
                  : "bg-slate-900"
              }`}
            >
              {SECTION_ICONS.trophy}
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                Athletic Events
              </h1>
              <p
                className={`text-[11px] sm:text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                64th Annual Meet • Feb 20-21, 2025
              </p>
            </div>
          </div>

          {/* Stats Counter - Centered on mobile */}
          <div
            className={`flex items-stretch justify-center gap-1.5 sm:gap-2 p-1.5 rounded-xl w-full sm:w-auto ${
              darkMode
                ? "bg-slate-900/60 ring-1 ring-white/6"
                : "bg-slate-50 ring-1 ring-slate-200"
            }`}
          >
            {/* TRACK - RED */}
            <div
              className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                darkMode ? "bg-red-500/15" : "bg-red-50"
              }`}
            >
              <span
                className={`text-base sm:text-xl font-black leading-none ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {enrollmentStats.trackCount}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-red-400/70" : "text-red-600"
                }`}
              >
                Track
              </p>
            </div>
            {/* FIELD - PARROT GREEN */}
            <div
              className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                darkMode ? "bg-emerald-500/15" : "bg-emerald-50"
              }`}
            >
              <span
                className={`text-base sm:text-xl font-black leading-none ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                {enrollmentStats.fieldCount}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-emerald-400/70" : "text-emerald-600"
                }`}
              >
                Field
              </p>
            </div>
            {/* TEAM - PINK */}
            <div
              className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                darkMode ? "bg-pink-500/15" : "bg-pink-50"
              }`}
            >
              <span
                className={`text-base sm:text-xl font-black leading-none ${
                  darkMode ? "text-pink-400" : "text-pink-600"
                }`}
              >
                {enrollmentStats.teamCount}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-pink-400/70" : "text-pink-600"
                }`}
              >
                Team
              </p>
            </div>
            {/* TOTAL - GOLDEN YELLOW */}
            <div
              className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                darkMode ? "bg-amber-500/15" : "bg-amber-50"
              }`}
            >
              <span
                className={`text-base sm:text-xl font-black leading-none ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {enrollmentStats.total}/5
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-amber-400/70" : "text-amber-600"
                }`}
              >
                Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Rules Banner - Golden accent */}
      <div
        className={`rounded-xl p-3 sm:p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-linear-to-r from-amber-950/40 to-slate-900/60 ring-1 ring-amber-500/20"
            : "bg-linear-to-r from-amber-50 to-slate-50 ring-1 ring-amber-200"
        }`}
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-amber-500/20 text-amber-400"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          {SECTION_ICONS.rules}
        </div>
        <div>
          <p
            className={`font-bold text-sm ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Enrollment Rules
          </p>
          <ul
            className={`text-[11px] sm:text-xs mt-1.5 space-y-1 ${
              darkMode ? "text-amber-300/80" : "text-amber-700"
            }`}
          >
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                •
              </span>
              <span>
                <strong
                  className={darkMode ? "text-amber-400" : "text-amber-700"}
                >
                  Maximum 3 events
                </strong>
                :{" "}
                <strong
                  className={darkMode ? "text-orange-300" : "text-orange-600"}
                >
                  2 Track + 1 Field
                </strong>{" "}
                OR{" "}
                <strong
                  className={darkMode ? "text-orange-300" : "text-orange-600"}
                >
                  1 Track + 2 Field
                </strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                •
              </span>
              <span>
                <strong
                  className={darkMode ? "text-amber-400" : "text-amber-700"}
                >
                  Team events
                </strong>
                : Visit a{" "}
                <strong
                  className={darkMode ? "text-orange-300" : "text-orange-600"}
                >
                  manager
                </strong>{" "}
                with your{" "}
                <strong
                  className={darkMode ? "text-orange-300" : "text-orange-600"}
                >
                  whole team
                </strong>{" "}
                to register
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Your Enrolled Events - Only when locked */}
      {isLocked && enrolledEvents.length > 0 && (
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-linear-to-br from-emerald-950/50 to-[#0f172a] ring-2 ring-emerald-500/40 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]"
              : "bg-linear-to-br from-emerald-50 to-teal-50/50 ring-2 ring-emerald-300 shadow-lg"
          }`}
        >
          <div
            className={`px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 border-b ${
              darkMode ? "border-emerald-800/40" : "border-emerald-200"
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-emerald-500 to-green-600"
                  : "bg-emerald-600"
              }`}
            >
              {SECTION_ICONS.trophy}
            </div>
            <div>
              <h2
                className={`font-bold text-sm sm:text-base ${
                  darkMode ? "text-emerald-100" : "text-emerald-800"
                }`}
              >
                Your Enrolled Events
              </h2>
              <p
                className={`text-[11px] ${
                  darkMode ? "text-emerald-400/80" : "text-emerald-600"
                }`}
              >
                Registered for {enrolledEvents.length} event(s)
              </p>
            </div>
          </div>

          {/* Grid with 5 equal columns on desktop, centered */}
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
              {allEvents
                .filter((e) => enrolledEvents.includes(e.id))
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Lock Banner */}
      {!isLocked && enrolledEvents.length > 0 && (
        <div
          className={`rounded-xl p-3 sm:p-4 ${
            darkMode
              ? "bg-linear-to-r from-amber-950/50 to-orange-950/40 ring-1 ring-amber-500/30"
              : "bg-linear-to-r from-amber-50 to-orange-50 ring-1 ring-amber-300 shadow-md"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-amber-500/25 text-amber-400"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {SECTION_ICONS.lock}
            </div>
            <div className="flex-1">
              <p
                className={`font-bold text-sm ${
                  darkMode ? "text-amber-100" : "text-amber-800"
                }`}
              >
                Ready to Lock Your Events?
              </p>
              <p
                className={`text-[11px] sm:text-xs mt-0.5 ${
                  darkMode ? "text-amber-200/70" : "text-amber-700"
                }`}
              >
                {enrollmentStats.total} event(s) selected. Locking finalizes
                enrollment.
              </p>
            </div>
            <button
              onClick={handleLockEvents}
              disabled={locking}
              className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs w-full sm:w-auto sm:min-w-[140px] h-10 transition-all ${
                darkMode
                  ? "bg-linear-to-r from-amber-500 to-orange-600 text-white hover:brightness-110"
                  : "bg-linear-to-r from-amber-500 to-orange-500 text-white hover:brightness-110"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {/* ICON / SPINNER SLOT */}
              <span className="w-4 h-4 flex items-center justify-center">
                {locking ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                ) : (
                  SECTION_ICONS.lock
                )}
              </span>

              {/* TEXT — SAME WIDTH */}
              <span className="whitespace-nowrap">
                {locking ? "Locking…" : "Lock Events"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Locked Status Banner */}
      {isLocked && (
        <div
          className={`rounded-xl p-3 sm:p-4 ${
            darkMode
              ? "bg-linear-to-r from-emerald-950/50 to-teal-950/40 ring-1 ring-emerald-500/30"
              : "bg-linear-to-r from-emerald-50 to-teal-50 ring-1 ring-emerald-300 shadow-md"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-emerald-500/25 text-emerald-400"
                  : "bg-emerald-100 text-emerald-600"
              }`}
            >
              {SECTION_ICONS.lock}
            </div>
            <div className="flex-1">
              <p
                className={`font-bold text-sm ${
                  darkMode ? "text-emerald-100" : "text-emerald-800"
                }`}
              >
                {user.role === "Admin" || user.role === "Manager"
                  ? "Events Locked (Admin Override)"
                  : "Events Locked Successfully"}
              </p>
              <p
                className={`text-[11px] sm:text-xs mt-0.5 ${
                  darkMode ? "text-emerald-200/70" : "text-emerald-700"
                }`}
              >
                {user.role === "Admin" || user.role === "Manager"
                  ? "You can unlock and re-select events."
                  : "Contact admin or manager to unlock."}
              </p>
            </div>
            {(user.role === "Admin" || user.role === "Manager") && (
              <button
                onClick={handleUnlockEvents}
                disabled={locking}
                className={` grid place-items-center px-5 py-2.5 rounded-lg font-bold text-xs w-full sm:w-auto h-10 transition-all ${
                  darkMode
                    ? "bg-linear-to-r from-orange-500 to-red-600 text-white hover:brightness-110"
                    : "bg-linear-to-r from-orange-500 to-red-500 text-white hover:brightness-110"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {/* WIDTH DEFINER (VISIBLE TO LAYOUT, NOT USER) */}
                <span className="invisible flex items-center gap-2 col-start-1 row-start-1">
                  <span className="w-4 h-4" />
                  <span>Unlock Events</span>
                </span>

                {/* ACTUAL CONTENT (OVERLAYS) */}
                <span className="flex items-center gap-2 col-start-1 row-start-1">
                  <span className="w-4 h-4 flex items-center justify-center">
                    {locking ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                    ) : (
                      SECTION_ICONS.unlock
                    )}
                  </span>

                  <span className="whitespace-nowrap">
                    {locking ? "Unlocking…" : "Unlock Events"}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Track Events Section - ORANGE icon */}
      <Section
        title="Track Events"
        icon={SECTION_ICONS.track}
        iconlinear={
          darkMode
            ? "bg-linear-to-br from-orange-500 to-red-600"
            : "bg-slate-800"
        }
        events={trackEvents}
        count={enrollmentStats.trackCount}
      />

      {/* Field Events Section - PARROT GREEN icon */}
      <Section
        title="Field Events"
        icon={SECTION_ICONS.field}
        iconlinear={
          darkMode
            ? "bg-linear-to-br from-emerald-500 to-green-600"
            : "bg-slate-800"
        }
        events={fieldEvents}
        count={enrollmentStats.fieldCount}
      />

      {/* Team Events Section - BLUE icon */}
      <Section
        title="Team Events"
        icon={SECTION_ICONS.team}
        iconlinear={
          darkMode
            ? "bg-linear-to-br from-blue-500 to-cyan-600"
            : "bg-slate-800"
        }
        events={teamEvents}
        count={0}
      />
    </div>
  );
}
