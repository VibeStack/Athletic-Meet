import { useState, useMemo, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const MAX_EVENTS = 3;

// Emoji mapping based on event names
const getEventEmoji = (eventName) => {
  const name = eventName.toLowerCase();

  // Sprint events
  if (name.includes("100m") && !name.includes("relay")) return "⚡";
  if (name.includes("200m")) return "🏃";
  if (name.includes("400m") && !name.includes("relay")) return "🏃‍♂️";
  if (name.includes("800m")) return "🏃‍♀️";
  if (name.includes("1500m")) return "🎽";
  if (name.includes("3000m")) return "🏃‍♀️";
  if (name.includes("5000m")) return "🏅";
  if (name.includes("10000m")) return "🎖️";

  // Hurdles
  if (name.includes("hurdles")) return "🚧";

  // Jumps
  if (name.includes("long jump")) return "🦘";
  if (name.includes("high jump")) return "🔝";
  if (name.includes("triple jump")) return "🥉";

  // Throws
  if (name.includes("shot put")) return "🏋️";
  if (name.includes("discus")) return "🥏";
  if (name.includes("javelin")) return "🎯";
  if (name.includes("hammer")) return "🔨";

  // Team events
  if (name.includes("relay") && name.includes("4x100")) return "🏃‍♂️";
  if (name.includes("relay") && name.includes("4x400")) return "🏃‍♀️";
  if (name.includes("tug of war")) return "🪢";

  // Default
  return "🏆";
};

export default function EventsPage() {
  const { darkMode } = useTheme();
  const { user } = useOutletContext();
  const [enrolledEvents, setEnrolledEvents] = useState([]); // Array of IDs only
  const [isLocked, setIsLocked] = useState(false);
  const [locking, setLocking] = useState(false);
  const [enrolling, setEnrolling] = useState(null);
  const [allEvents, setAllEvents] = useState([]); // Full event objects
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: response } = await axios.get(`${BASE_URL}/user/events`, {
          withCredentials: true,
        });

        // 1️⃣ Gender filtering
        const genderBasedFilteredEvents = response.data.filter((event) => {
          if (user.gender === "Male") return event.category === "Boys";
          return event.category === "Girls";
        });

        // 2️⃣ Extract event IDs from user.selectedEvents
        const selectedEventIds = (user.selectedEvents || []).map(
          (e) => e.eventId
        );

        // 3️⃣ Get full event objects for enrolled events
        const enrolledEventsDB = genderBasedFilteredEvents.filter((event) =>
          selectedEventIds.includes(event.id)
        );

        // 4️⃣ Save states - store only IDs in enrolledEvents
        setEnrolledEvents(enrolledEventsDB.map((e) => e.id));
        setIsLocked(selectedEventIds.length > 0);

        // 5️⃣ Map events for UI
        const mappedEvents = genderBasedFilteredEvents.map((event) => ({
          id: event.id,
          name: event.name,
          day: event.day,
          type: event.type,
          category: event.category,
          emoji: getEventEmoji(event.name),
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
      total: enrolled.length,
    };
  }, [enrolledEvents, allEvents]);

  const canEnrollInEvent = (event) => {
    if (isLocked) return false;
    if (event.type === "Team") return false;
    if (enrolledEvents.includes(event.id)) return true;
    if (enrollmentStats.total >= MAX_EVENTS) return false;
    const { trackCount, fieldCount } = enrollmentStats;
    if (event.type === "Track")
      return trackCount < 2 || (trackCount === 1 && fieldCount === 0);
    if (event.type === "Field")
      return fieldCount < 2 || (fieldCount === 1 && trackCount === 0);
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
        `${BASE_URL}/admin/user/events/unlock`,
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

  const EventCard = ({ event }) => {
    const isEnrolled = enrolledEvents.includes(event.id);
    const canEnroll = canEnrollInEvent(event);
    const isTeam = event.type === "Team";

    return (
      <div
        className={`rounded-xl p-4 transition-all duration-300 ${
          isEnrolled
            ? darkMode
              ? "bg-linear-to-br from-emerald-900/60 to-teal-900/40 border-2 border-emerald-500/50 shadow-lg"
              : "bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-md"
            : darkMode
            ? "bg-slate-800/70 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg"
            : "bg-white border border-gray-200 hover:border-cyan-400 shadow-sm hover:shadow-md"
        } ${!canEnroll && !isEnrolled ? "opacity-50" : "hover:scale-[1.02]"} ${
          isLocked ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl shrink-0">{event.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-semibold text-sm ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {event.name}
              </h3>
              {isEnrolled && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0">
                  ✓
                </span>
              )}
            </div>
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {event.category} • {event.day}
            </p>
          </div>
          <button
            onClick={() => handleEnroll(event.id)}
            disabled={
              isLocked ||
              isTeam ||
              (!canEnroll && !isEnrolled) ||
              enrolling === event.id
            }
            className={`shrink-0 w-[85px] py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              isTeam
                ? darkMode
                  ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isEnrolled
                ? "bg-linear-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-700"
                : canEnroll
                ? "bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700"
                : darkMode
                ? "bg-slate-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {enrolling === event.id
              ? "..."
              : isLocked && isEnrolled
              ? "Locked"
              : isTeam
              ? "Team"
              : isEnrolled
              ? "Remove"
              : "Enroll"}
          </button>
        </div>
      </div>
    );
  };

  const Section = ({ title, emoji, events, count, linear }) => (
    <div
      className={`rounded-2xl overflow-hidden ${
        darkMode
          ? "bg-slate-800/50 border border-slate-700/50"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div
        className={`px-5 py-4 flex items-center justify-between ${
          darkMode
            ? `bg-linear-to-r ${linear} border-b border-slate-700`
            : `bg-linear-to-r ${linear} border-b border-gray-100`
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <h2
            className={`font-bold text-lg ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              darkMode ? "bg-white/10 text-white" : "bg-white/70 text-gray-700"
            }`}
          >
            {events.length} events
          </span>
        </div>
        {count > 0 && (
          <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-emerald-500 text-white shadow-sm">
            {count} enrolled
          </span>
        )}
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p
            className={`col-span-full text-center py-8 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No events available
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400/30 rounded-full border-t-cyan-400 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Athletic Events 🏆
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            64th Annual Athletic Meet • Feb 20-21, 2025
          </p>
        </div>

        {/* Stats Counter */}
        <div
          className={`flex items-stretch gap-2 p-2 rounded-xl ${
            darkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg min-w-[75px] ${
              darkMode ? "bg-orange-500/20" : "bg-orange-50"
            }`}
          >
            <span
              className={`text-xl font-bold leading-none ${
                darkMode ? "text-orange-400" : "text-orange-600"
              }`}
            >
              {enrollmentStats.trackCount}
            </span>
            <p
              className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${
                darkMode ? "text-orange-300" : "text-orange-600"
              }`}
            >
              Track
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg min-w-[75px] ${
              darkMode ? "bg-blue-500/20" : "bg-blue-50"
            }`}
          >
            <span
              className={`text-xl font-bold leading-none ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {enrollmentStats.fieldCount}
            </span>
            <p
              className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Field
            </p>
          </div>
          <div
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg min-w-[75px] ${
              darkMode ? "bg-purple-500/20" : "bg-purple-50"
            }`}
          >
            <span
              className={`text-xl font-bold leading-none ${
                darkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {enrollmentStats.total}/{MAX_EVENTS}
            </span>
            <p
              className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${
                darkMode ? "text-purple-300" : "text-purple-600"
              }`}
            >
              Total
            </p>
          </div>
        </div>
      </div>

      {/* Your Enrolled Events - ✅ FIXED: use e.id not e.eventId */}
      {isLocked && enrolledEvents.length > 0 && (
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-linear-to-br from-emerald-900/30 to-teal-900/30 border-2 border-emerald-500/50"
              : "bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400"
          }`}
        >
          <div
            className={`px-5 py-4 flex items-center gap-3 border-b ${
              darkMode ? "border-emerald-700/50" : "border-emerald-200"
            }`}
          >
            <span className="text-2xl">🏆</span>
            <div>
              <h2
                className={`font-bold text-lg ${
                  darkMode ? "text-emerald-100" : "text-emerald-900"
                }`}
              >
                Your Enrolled Events
              </h2>
              <p
                className={`text-xs mt-0.5 ${
                  darkMode ? "text-emerald-300" : "text-emerald-700"
                }`}
              >
                You are registered for {enrolledEvents.length} event(s)
              </p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* ✅ FIXED: filter using e.id, key using event.id */}
            {allEvents
              .filter((e) => enrolledEvents.includes(e.id))
              .map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      )}

      {/* Lock Button Banner */}
      {!isLocked && enrolledEvents.length > 0 && (
        <div
          className={`rounded-xl p-4 flex items-center gap-4 ${
            darkMode
              ? "bg-linear-to-r from-amber-900/40 to-orange-900/40 border border-amber-500/40"
              : "bg-linear-to-r from-amber-50 to-orange-50 border border-amber-300"
          }`}
        >
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p
              className={`font-bold text-sm ${
                darkMode ? "text-amber-100" : "text-amber-900"
              }`}
            >
              Ready to Lock Your Events?
            </p>
            <p
              className={`text-xs mt-1 ${
                darkMode ? "text-amber-200" : "text-amber-800"
              }`}
            >
              You've selected {enrollmentStats.total} event(s). Locking will
              finalize your enrollment. Only admins/managers can unlock.
            </p>
          </div>
          <button
            onClick={handleLockEvents}
            disabled={locking}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {locking ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white"></div>
                <span>Locking...</span>
              </>
            ) : (
              <>
                <span>🔒</span>
                <span>Lock Events</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Locked Status Banner */}
      {isLocked && (
        <div
          className={`rounded-xl p-4 flex items-center gap-4 ${
            darkMode
              ? "bg-linear-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/40"
              : "bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-300"
          }`}
        >
          <span className="text-2xl">🔒</span>
          <div className="flex-1">
            <p
              className={`font-bold ${
                darkMode ? "text-emerald-100" : "text-emerald-900"
              }`}
            >
              {user.role === "Admin" || user.role === "Manager"
                ? "Events Locked (Admin Override Available)"
                : "Events Locked Successfully"}
            </p>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-emerald-200" : "text-emerald-800"
              }`}
            >
              {user.role === "Admin" || user.role === "Manager"
                ? "You can unlock and re-select events using the button on the right."
                : "Your enrollment is finalized. Contact an admin or manager to make changes."}
            </p>
          </div>
          {(user.role === "Admin" || user.role === "Manager") && (
            <button
              onClick={handleUnlockEvents}
              disabled={locking}
              className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locking ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white"></div>
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <span>🔓</span>
                  <span>Unlock Events</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Rules Banner */}
      <div
        className={`rounded-xl p-4 flex items-start gap-4 ${
          darkMode
            ? "bg-linear-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30"
            : "bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200"
        }`}
      >
        <span className="text-2xl">📋</span>
        <div>
          <p
            className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Enrollment Rules
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-indigo-200" : "text-indigo-700"
            }`}
          >
            Maximum 3 events: <strong>2 Track + 1 Field</strong> OR{" "}
            <strong>1 Track + 2 Field</strong>. Team events require manager
            registration.
          </p>
        </div>
      </div>

      {/* Sections */}
      <Section
        title="Track Events"
        emoji="🏃"
        events={trackEvents}
        count={enrollmentStats.trackCount}
        linear={
          darkMode
            ? "from-orange-900/40 to-red-900/40"
            : "from-orange-100 to-red-50"
        }
      />

      <Section
        title="Field Events"
        emoji="🥏"
        events={fieldEvents}
        count={enrollmentStats.fieldCount}
        linear={
          darkMode
            ? "from-blue-900/40 to-cyan-900/40"
            : "from-blue-100 to-cyan-50"
        }
      />

      <Section
        title="Team Events"
        emoji="👥"
        events={teamEvents}
        count={0}
        linear={
          darkMode
            ? "from-purple-900/40 to-pink-900/40"
            : "from-purple-100 to-pink-50"
        }
      />
    </div>
  );
}
