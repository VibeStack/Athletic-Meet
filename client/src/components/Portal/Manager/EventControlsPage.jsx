import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import { sortEvents } from "../../../utils/eventSort";
import LoadingComponent from "../LoadingComponent";

/* -------------------- Icons -------------------- */
import {
  LockIcon,
  UnlockIcon,
  TrackIcon,
  FieldIcon,
  TeamIcon,
  InfoIcon,
  ControlsIcon,
  CheckIcon,
} from "../../../icons/Portal/Manager/EventControlsIcons";

/* -------------------- Icons -------------------- */
const ICONS = {
  lock: <LockIcon className="w-5 h-5 fill-current" />,
  unlock: <UnlockIcon className="w-5 h-5 fill-current" />,
  track: <TrackIcon className="w-6 h-6 fill-current" />,
  field: <FieldIcon className="w-6 h-6 fill-current" />,
  team: <TeamIcon className="w-6 h-6 fill-current" />,
  info: <InfoIcon className="w-5 h-5 fill-current" />,
  controls: <ControlsIcon className="w-6 h-6 fill-current" />,
  check: <CheckIcon className="w-3.5 h-3.5 fill-none stroke-current" />,
};

export default function EventControlsPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `${API_URL}/manager/allEvents`,
          { withCredentials: true },
        );

        if (response.success) {
          setEvents(sortEvents(response.data.events));
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  // Group events by day and type
  const groupedEvents = events.reduce((acc, event) => {
    const day = event.day === "Both" ? "Both Days" : event.day;
    const type = event.type;

    if (!acc[day]) acc[day] = {};
    if (!acc[day][type]) acc[day][type] = [];
    acc[day][type].push(event);

    return acc;
  }, {});

  // Day order for consistent display
  const dayOrder = ["Day 1", "Day 2", "Both Days"];

  // Stats
  const activeCount = events.filter((e) => e.isActive).length;
  const inactiveCount = events.filter((e) => !e.isActive).length;

  // API Helper Functions
  const toggleSingleEventAPI = (eventId) => {
    return axios.post(
      `${API_URL}/manager/event/toggle`,
      { eventId },
      { withCredentials: true },
    );
  };

  const activateEventsAPI = (eventIds) => {
    return axios.post(
      `${API_URL}/manager/events/activate`,
      { eventIds },
      { withCredentials: true },
    );
  };

  const deactivateEventsAPI = (eventIds) => {
    return axios.post(
      `${API_URL}/manager/events/deactivate`,
      { eventIds },
      { withCredentials: true },
    );
  };

  // Helper to get event IDs for a day
  const getDayEventIds = (day) =>
    events
      .filter((e) => e.day === day || (day === "Both Days" && e.day === "Both"))
      .map((e) => e.id);

  // Helper to get event IDs for a type in a day
  const getTypeEventIds = (day, type) =>
    events
      .filter(
        (e) =>
          (e.day === day || (day === "Both Days" && e.day === "Both")) &&
          e.type === type,
      )
      .map((e) => e.id);

  // Toggle single event
  const toggleEvent = async (eventId, currentStatus) => {
    try {
      setUpdating(eventId);

      await toggleSingleEventAPI(eventId);

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, isActive: !currentStatus } : e,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle event", err);
      alert("❌ Failed to toggle event. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Toggle all events for a day
  const toggleDay = async (day) => {
    const eventIds = getDayEventIds(day);
    const allActive = events
      .filter((e) => e.day === day || (day === "Both Days" && e.day === "Both"))
      .every((e) => e.isActive);

    try {
      setUpdating(`day-${day}`);

      if (allActive) {
        await deactivateEventsAPI(eventIds);
      } else {
        await activateEventsAPI(eventIds);
      }

      setEvents((prev) =>
        prev.map((e) =>
          eventIds.includes(e.id) ? { ...e, isActive: !allActive } : e,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle day", err);
      alert("❌ Failed to toggle day. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Toggle all events for a type in a day
  const toggleTypeInDay = async (day, type) => {
    const eventIds = getTypeEventIds(day, type);
    const allActive = events
      .filter((e) => eventIds.includes(e.id))
      .every((e) => e.isActive);

    try {
      setUpdating(`${day}-${type}`);

      if (allActive) {
        await deactivateEventsAPI(eventIds);
      } else {
        await activateEventsAPI(eventIds);
      }

      setEvents((prev) =>
        prev.map((e) =>
          eventIds.includes(e.id) ? { ...e, isActive: !allActive } : e,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle type in day", err);
      alert("❌ Failed to toggle events. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    if (type === "Track") return ICONS.track;
    if (type === "Field") return ICONS.field;
    return ICONS.team;
  };

  // Get type colors matching EventsPage
  const getTypeBadgeColors = (type) => {
    if (type === "Track") {
      return darkMode
        ? "bg-orange-500/25 text-orange-400"
        : "bg-orange-100 text-orange-600";
    }
    if (type === "Field") {
      return darkMode
        ? "bg-emerald-500/25 text-emerald-400"
        : "bg-emerald-100 text-emerald-600";
    }
    return darkMode
      ? "bg-blue-500/25 text-blue-400"
      : "bg-blue-100 text-blue-600";
  };

  // Get type gradient for icon background
  const getTypeGradient = (type) => {
    if (type === "Track") return "bg-linear-to-br from-orange-500 to-red-600";
    if (type === "Field")
      return "bg-linear-to-br from-emerald-500 to-green-600";
    return "bg-linear-to-br from-blue-500 to-cyan-600";
  };

  // Loading state
  if (loading) {
    return (
      <LoadingComponent
        title="Event Controls"
        message="Loading event management..."
        darkMode={darkMode}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`rounded-2xl p-8 text-center ${
          darkMode
            ? "bg-red-950/50 ring-1 ring-red-500/30"
            : "bg-red-50 ring-1 ring-red-200"
        }`}
      >
        <p className={darkMode ? "text-red-400" : "text-red-600"}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header Section */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(168,85,247,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Background glow effects */}
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-purple-500" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-violet-600" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-purple-500 to-violet-600"
                  : "bg-slate-900"
              }`}
            >
              {ICONS.controls}
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                Event Controls
              </h1>
              <p
                className={`text-[11px] sm:text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Manage event enrollment status
              </p>
            </div>
          </div>

          {/* Stats Counter */}
          <div
            className={`flex items-stretch justify-center gap-1.5 sm:gap-2 p-1.5 rounded-xl w-full sm:w-auto ${
              darkMode
                ? "bg-slate-900/60 ring-1 ring-white/6"
                : "bg-slate-50 ring-1 ring-slate-200"
            }`}
          >
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
                {activeCount}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-emerald-400/70" : "text-emerald-600"
                }`}
              >
                Active
              </p>
            </div>
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
                {inactiveCount}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-red-400/70" : "text-red-600"
                }`}
              >
                Inactive
              </p>
            </div>
            <div
              className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                darkMode ? "bg-purple-500/15" : "bg-purple-50"
              }`}
            >
              <span
                className={`text-base sm:text-xl font-black leading-none ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {events.length}
              </span>
              <p
                className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                  darkMode ? "text-purple-400/70" : "text-purple-600"
                }`}
              >
                Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={`rounded-xl p-3 sm:p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-linear-to-r from-purple-950/40 to-slate-900/60 ring-1 ring-purple-500/20"
            : "bg-linear-to-r from-purple-50 to-slate-50 ring-1 ring-purple-200"
        }`}
      >
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-purple-500/20 text-purple-400"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {ICONS.info}
        </div>
        <div>
          <p
            className={`font-bold text-sm ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            Event Control Rules
          </p>
          <ul
            className={`text-[11px] sm:text-xs mt-1.5 space-y-1 ${
              darkMode ? "text-purple-300/80" : "text-purple-700"
            }`}
          >
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                •
              </span>
              <span>
                <strong
                  className={darkMode ? "text-emerald-400" : "text-emerald-700"}
                >
                  Active events
                </strong>{" "}
                are visible and open for student enrollment
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                •
              </span>
              <span>
                <strong className={darkMode ? "text-red-400" : "text-red-600"}>
                  Inactive events
                </strong>{" "}
                are hidden from students and closed for registration
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Day-wise Cards */}
      {dayOrder
        .filter((day) => groupedEvents[day])
        .map((day) => {
          const dayData = groupedEvents[day];
          const dayEvents = events.filter(
            (e) => e.day === day || (day === "Both Days" && e.day === "Both"),
          );
          const dayAllActive = dayEvents.every((e) => e.isActive);
          const dayActiveCount = dayEvents.filter((e) => e.isActive).length;

          return (
            <div
              key={day}
              className={`rounded-2xl overflow-hidden ${
                darkMode
                  ? "bg-[#0f172a]/90 ring-1 ring-white/8 shadow-[0_0_60px_-15px_rgba(168,85,247,0.15)]"
                  : "bg-white ring-1 ring-slate-200 shadow-lg"
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b ${
                  darkMode ? "border-white/6" : "border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-lg font-black text-white ${
                      dayAllActive
                        ? "bg-linear-to-br from-emerald-500 to-green-600"
                        : "bg-linear-to-br from-red-500 to-rose-600"
                    }`}
                  >
                    {day === "Day 1" ? "1" : day === "Day 2" ? "2" : "∞"}
                  </div>
                  <div>
                    <h2
                      className={`font-bold text-sm sm:text-base ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {day}
                    </h2>
                    <p
                      className={`text-[11px] ${
                        darkMode ? "text-slate-500" : "text-slate-500"
                      }`}
                    >
                      {dayEvents.length} events • {dayActiveCount} active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleDay(day)}
                  disabled={updating === `day-${day}`}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg min-w-[140px] ${
                    dayAllActive
                      ? darkMode
                        ? "bg-linear-to-r from-red-500 to-rose-600 text-white shadow-red-500/25 hover:brightness-110"
                        : "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-red-500/20 hover:brightness-110"
                      : darkMode
                        ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/25 hover:brightness-110"
                        : "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/20 hover:brightness-110"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {updating === `day-${day}` ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                    ) : dayAllActive ? (
                      ICONS.lock
                    ) : (
                      ICONS.unlock
                    )}
                  </span>
                  <span className="whitespace-nowrap">
                    {dayAllActive ? "Deactivate All" : "Activate All"}
                  </span>
                </button>
              </div>

              {/* Types */}
              <div className="p-3 sm:p-4 space-y-5">
                {["Track", "Field", "Team"]
                  .filter((type) => dayData[type])
                  .map((type) => {
                    const typeEvents = dayData[type];
                    const typeAllActive = typeEvents.every((e) => e.isActive);

                    return (
                      <div key={type}>
                        {/* Type Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${getTypeGradient(
                                type,
                              )}`}
                            >
                              {getTypeIcon(type)}
                            </div>
                            <h3
                              className={`font-bold text-sm ${
                                darkMode ? "text-white" : "text-slate-800"
                              }`}
                            >
                              {type} Events
                            </h3>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getTypeBadgeColors(
                                type,
                              )}`}
                            >
                              {typeEvents.length}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleTypeInDay(day, type)}
                            disabled={updating === `${day}-${type}`}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                              typeAllActive
                                ? darkMode
                                  ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/25"
                                  : "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"
                                : darkMode
                                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
                                  : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 hover:bg-emerald-100"
                            } disabled:opacity-50`}
                          >
                            {updating === `${day}-${type}`
                              ? "..."
                              : typeAllActive
                                ? "Deactivate"
                                : "Activate"}
                          </button>
                        </div>

                        {/* Events Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                          {typeEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 h-full flex flex-col ${
                                event.isActive
                                  ? darkMode
                                    ? "bg-emerald-950/60 ring-2 ring-emerald-500/60"
                                    : "bg-emerald-50 ring-2 ring-emerald-400"
                                  : darkMode
                                    ? "bg-red-950/40 ring-1 ring-red-500/40"
                                    : "bg-red-50 ring-1 ring-red-200"
                              }`}
                            >
                              {/* Glow effect for active events */}
                              {event.isActive && darkMode && (
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500/25 blur-2xl rounded-full pointer-events-none" />
                              )}

                              {/* Type Badge */}
                              <span
                                className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getTypeBadgeColors(
                                  event.type,
                                )}`}
                              >
                                {event.type}
                              </span>

                              <div className="relative pr-12 sm:pr-14 flex-1">
                                <div className="flex items-start gap-1.5 mb-0.5 min-h-9">
                                  <h4
                                    className={`font-semibold text-[13px] leading-tight line-clamp-2 ${
                                      darkMode ? "text-white" : "text-slate-800"
                                    }`}
                                  >
                                    {event.name}
                                  </h4>
                                  {event.isActive && (
                                    <span
                                      className={`w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${
                                        darkMode
                                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                          : "bg-emerald-500 shadow-md"
                                      }`}
                                    >
                                      {ICONS.check}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-[11px] ${
                                    darkMode
                                      ? "text-slate-500"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {event.category}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  toggleEvent(event.id, event.isActive)
                                }
                                disabled={updating === event.id}
                                className={`mt-3 w-full py-2 rounded-lg text-[11px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                                  event.isActive
                                    ? darkMode
                                      ? "bg-linear-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500"
                                      : "bg-linear-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600"
                                    : darkMode
                                      ? "bg-linear-to-r from-emerald-600 to-green-600 text-white hover:brightness-110"
                                      : "bg-linear-to-r from-emerald-500 to-green-500 text-white hover:brightness-110"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                <span className="w-5 h-5 flex items-center justify-center shrink-0">
                                  {updating === event.id ? (
                                    <span className="animate-spin h-4 w-4 border-2 border-white/30 rounded-full border-t-white" />
                                  ) : event.isActive ? (
                                    ICONS.lock
                                  ) : (
                                    ICONS.unlock
                                  )}
                                </span>
                                <span className="whitespace-nowrap">
                                  {event.isActive ? "Deactivate" : "Activate"}
                                </span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
