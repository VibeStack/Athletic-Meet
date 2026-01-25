import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import LoadingComponent from "../LoadingComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------- Icons -------------------- */
const ICONS = {
  trophy: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1l4 7-1.26.37.25 1.17L14.5 16l.25 1.17-2.75-.82-2.75.82L9.5 16l-2.49.54.25-1.17L6 15l4-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zm0 10a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  position: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M7.5 21H2V9h5.5v12zM21 3h-5.5v18H21V3zm-6.75 6h-5.5v12h5.5V9z" />
    </svg>
  ),
  // Badge/ID icon for jersey numbers
  badge: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm1 13h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
    </svg>
  ),
  // Calendar event icon (same as BulkAddEvent)
  event: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4 fill-none stroke-current stroke-3"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  ),
  // Medal icon - same SVG for all positions, colors applied via CSS
  medal1: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <circle cx="12" cy="15" r="6" />
      <path d="M12 2L9 9h6L12 2z" />
    </svg>
  ),
  medal2: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <circle cx="12" cy="15" r="6" />
      <path d="M12 2L9 9h6L12 2z" />
    </svg>
  ),
  medal3: (
    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
      <circle cx="12" cy="15" r="6" />
      <path d="M12 2L9 9h6L12 2z" />
    </svg>
  ),
};

export default function EventResultsPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jerseyNumbers: "",
      eventId: "",
      position: "",
    },
  });

  const watchedValues = watch();

  // Parse jersey numbers (same logic as QR Scanner - comma separated)
  const parseJerseyNumbers = (input) => {
    const numbers = input
      .split(",")
      .map((n) => n.trim())
      .filter((n) => /^\d+$/.test(n)) // only whole numbers
      .map((n) => Number(n));

    // Remove duplicates using Set
    return [...new Set(numbers)];
  };

  // Validate jersey numbers input
  const isValidJerseyInput = (input) => {
    if (!input.trim()) return false;

    const values = input
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n);

    // Must be only whole numbers
    if (!values.every((n) => /^\d+$/.test(n))) return false;

    // No duplicates allowed
    const unique = new Set(values);
    return unique.size === values.length;
  };

  const getValidCount = (input) => {
    return parseJerseyNumbers(input).length;
  };

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data: response } = await axios.get(
          `${API_URL}/manager/allEvents`,
          { withCredentials: true },
        );

        if (response.success) {
          setEvents(response.data.events);
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

  // Handle form submission
  const onSubmit = async (data) => {
    const jerseyNumbers = parseJerseyNumbers(data.jerseyNumbers);

    if (jerseyNumbers.length === 0) {
      toast.error("Please enter valid jersey numbers");
      return;
    }

    const payload = {
      jerseyNumbers,
      eventId: data.eventId,
      position: parseInt(data.position, 10),
    };

    try {
      setSubmitting(true);
      setSubmitSuccess(false);
      console.log(payload);

      const { data: response } = await axios.post(
        `${API_URL}/manager/event/results`,
        payload,
        { withCredentials: true },
      );

      if (response.success) {
        setSubmitSuccess(true);
        toast.success(
          `✅ Position ${payload.position} recorded for ${jerseyNumbers.length} participant(s)!`,
        );
        reset();
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to submit results", err);
      const message =
        err.response?.data?.message ||
        "Failed to submit results. Please try again.";
      toast.error(`❌ ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Get selected event for display
  const selectedEvent = events.find(
    (e) => String(e.id) === String(watchedValues.eventId),
  );

  // Get selected event name for display
  const getSelectedEventName = () => {
    return selectedEvent?.name || "";
  };

  // Get type icon
  const getTypeIcon = (type) => {
    if (type === "Track") {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
        </svg>
      );
    }
    if (type === "Field") {
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58s4.1-.78 5.66-2.34c3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z" />
      </svg>
    );
  };

  // Get type badge colors
  const getTypeBadgeColors = (type) => {
    if (type === "Track") {
      return darkMode
        ? "bg-orange-500/20 text-orange-400"
        : "bg-orange-100 text-orange-700";
    }
    if (type === "Field") {
      return darkMode
        ? "bg-lime-500/20 text-lime-400"
        : "bg-lime-100 text-lime-700";
    }
    return darkMode
      ? "bg-blue-500/20 text-blue-400"
      : "bg-blue-100 text-blue-700";
  };

  // Position labels with icons instead of emojis
  const positionOptions = [
    {
      value: "1",
      label: "1st Place",
      sublabel: "Gold",
      icon: ICONS.medal1,
      color: darkMode
        ? "from-amber-500 to-yellow-600"
        : "from-amber-400 to-yellow-500",
      ringColor: darkMode ? "ring-amber-500/60" : "ring-amber-400",
      bgColor: darkMode ? "bg-amber-500/15" : "bg-amber-50",
      iconColor: darkMode ? "text-amber-400" : "text-amber-500",
    },
    {
      value: "2",
      label: "2nd Place",
      sublabel: "Silver",
      icon: ICONS.medal2,
      color: darkMode
        ? "from-slate-400 to-gray-500"
        : "from-slate-300 to-gray-400",
      ringColor: darkMode ? "ring-slate-400/60" : "ring-slate-300",
      bgColor: darkMode ? "bg-slate-500/15" : "bg-slate-100",
      iconColor: darkMode ? "text-slate-300" : "text-slate-400",
    },
    {
      value: "3",
      label: "3rd Place",
      sublabel: "Bronze",
      icon: ICONS.medal3,
      color: darkMode
        ? "from-orange-600 to-amber-700"
        : "from-orange-500 to-amber-600",
      ringColor: darkMode ? "ring-orange-500/60" : "ring-orange-400",
      bgColor: darkMode ? "bg-orange-500/15" : "bg-orange-50",
      iconColor: darkMode ? "text-orange-400" : "text-orange-500",
    },
  ];

  const hasValidInput =
    watchedValues.jerseyNumbers &&
    isValidJerseyInput(watchedValues.jerseyNumbers);
  const validCount = hasValidInput
    ? getValidCount(watchedValues.jerseyNumbers)
    : 0;

  // Loading state
  if (loading) {
    return (
      <LoadingComponent
        title="Event Results"
        message="Loading events..."
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
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="space-y-4 sm:space-y-5">
        {/* Header Section - Orange/Rose Theme */}
        <div
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
            darkMode
              ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(251,146,60,0.25)]"
              : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          {/* Background glow effects */}
          {darkMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-orange-500" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-rose-600" />
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                  darkMode
                    ? "bg-linear-to-br from-orange-500 to-rose-600"
                    : "bg-slate-900"
                }`}
              >
                {ICONS.trophy}
              </div>
              <div>
                <h1
                  className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                    darkMode
                      ? "bg-linear-to-r from-orange-400 via-rose-400 to-pink-400 bg-clip-text text-transparent"
                      : "text-slate-800"
                  }`}
                >
                  Event Results
                </h1>
                <p
                  className={`text-[11px] sm:text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Record participant positions for events
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className={`flex items-stretch justify-center gap-1.5 sm:gap-2 p-1.5 rounded-xl w-full sm:w-auto ${
                darkMode
                  ? "bg-slate-900/60 ring-1 ring-white/6"
                  : "bg-slate-50 ring-1 ring-slate-200"
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                  darkMode ? "bg-orange-500/15" : "bg-orange-50"
                }`}
              >
                <span
                  className={`text-base sm:text-xl font-black leading-none ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {events.length}
                </span>
                <p
                  className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                    darkMode ? "text-orange-400/70" : "text-orange-600"
                  }`}
                >
                  Events
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className={`rounded-xl p-3 sm:p-4 flex items-start gap-3 ${
            darkMode
              ? "bg-linear-to-r from-orange-950/40 to-slate-900/60 ring-1 ring-orange-500/20"
              : "bg-linear-to-r from-orange-50 to-slate-50 ring-1 ring-orange-200"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
              darkMode
                ? "bg-orange-500/20 text-orange-400"
                : "bg-orange-100 text-orange-600"
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
              How to Record Results
            </p>
            <ul
              className={`text-[11px] sm:text-xs mt-1.5 space-y-1 ${
                darkMode ? "text-orange-300/80" : "text-orange-700"
              }`}
            >
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  1.
                </span>
                <span>
                  Enter{" "}
                  <strong
                    className={darkMode ? "text-orange-400" : "text-orange-700"}
                  >
                    jersey numbers
                  </strong>{" "}
                  separated by commas (e.g., 1, 5, 12)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  2.
                </span>
                <span>
                  Select the{" "}
                  <strong
                    className={darkMode ? "text-orange-400" : "text-orange-700"}
                  >
                    event
                  </strong>{" "}
                  from the dropdown
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  3.
                </span>
                <span>
                  Choose the{" "}
                  <strong
                    className={darkMode ? "text-orange-400" : "text-orange-700"}
                  >
                    position
                  </strong>{" "}
                  (Gold, Silver, or Bronze)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-[#0f172a]/90 ring-1 ring-white/8 shadow-[0_0_60px_-15px_rgba(251,146,60,0.15)]"
              : "bg-white ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          <div
            className={`px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 border-b ${
              darkMode ? "border-white/6" : "border-slate-100"
            }`}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-orange-500 to-rose-600"
                  : "bg-orange-600"
              }`}
            >
              {ICONS.medal}
            </div>
            <div>
              <h2
                className={`font-bold text-sm sm:text-base ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Record Position
              </h2>
              <p
                className={`text-[11px] ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Submit event results for participants
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
            {/* ROW 1: Main Content - Equal Height */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* LEFT: Jersey Numbers Label + Textarea */}
              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      darkMode
                        ? "bg-red-600/30 text-red-400"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ICONS.badge}
                  </span>
                  Jersey Numbers
                </label>
                <textarea
                  placeholder="Enter jersey numbers: 1, 5, 12, 23"
                  rows={8}
                  {...register("jerseyNumbers", {
                    required: "Jersey numbers are required",
                    validate: (value) =>
                      isValidJerseyInput(value) ||
                      "Please enter valid jersey numbers (comma separated)",
                  })}
                  className={`w-full flex-1 px-4 py-3 rounded-xl text-sm transition-all duration-200 resize-none focus:outline-none ${(() => {
                    const hasInput = watchedValues.jerseyNumbers?.trim();
                    const isValid =
                      hasInput &&
                      isValidJerseyInput(watchedValues.jerseyNumbers);

                    if (hasInput && !isValid) {
                      return darkMode
                        ? "bg-slate-800/80 ring-2 ring-red-500/50 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-red-500"
                        : "bg-slate-50 ring-2 ring-red-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500";
                    }
                    return darkMode
                      ? "bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";
                  })()} ${errors.jerseyNumbers ? "ring-2 ring-red-500/50" : ""}`}
                />
              </div>

              {/* RIGHT: Select Event + Event Details + Position */}
              <div className="flex flex-col gap-3">
                {/* Select Event Label */}
                <label
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      darkMode
                        ? "bg-emerald-600/30 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {ICONS.event}
                  </span>
                  Select Event
                </label>

                {/* Dropdown */}
                <select
                  {...register("eventId", {
                    required: "Please select an event",
                  })}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 appearance-none cursor-pointer ${
                    darkMode
                      ? "bg-slate-800/80 border border-slate-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  } ${errors.eventId ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? "%2394a3b8" : "%2364748b"}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="">Choose an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({event.type} - {event.category})
                    </option>
                  ))}
                </select>

                {/* Event Preview Card - Always visible */}
                <div
                  className={`rounded-xl p-3 flex items-center ${
                    darkMode
                      ? "bg-slate-800/60 ring-1 ring-white/10"
                      : "bg-slate-50 ring-1 ring-slate-200"
                  }`}
                >
                  {selectedEvent ? (
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 ${
                          selectedEvent.type === "Track"
                            ? "bg-linear-to-br from-orange-500 to-red-600"
                            : selectedEvent.type === "Field"
                              ? "bg-linear-to-br from-lime-500 to-green-600"
                              : "bg-linear-to-br from-blue-500 to-cyan-600"
                        }`}
                      >
                        {getTypeIcon(selectedEvent.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-bold text-sm truncate ${
                            darkMode ? "text-white" : "text-slate-800"
                          }`}
                        >
                          {selectedEvent.name}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {selectedEvent.category} • {selectedEvent.day}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${getTypeBadgeColors(
                          selectedEvent.type,
                        )}`}
                      >
                        {selectedEvent.type}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          darkMode
                            ? "bg-slate-700/50 text-slate-500"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        {ICONS.event}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            darkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          No event selected
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-slate-500" : "text-slate-400"
                          }`}
                        >
                          Choose an event from the dropdown
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Position Radio Buttons */}
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-2 text-sm font-semibold ${
                      darkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        darkMode
                          ? "bg-amber-600/30 text-amber-400"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {ICONS.position}
                    </span>
                    Position
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {positionOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`relative flex flex-col items-center gap-1 p-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                          watchedValues.position === option.value
                            ? `${option.bgColor} ring-2 ${option.ringColor}`
                            : darkMode
                              ? "bg-slate-800/60 ring-1 ring-slate-700 hover:ring-slate-600"
                              : "bg-slate-50 ring-1 ring-slate-200 hover:ring-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register("position", {
                            required: "Please select a position",
                          })}
                          className="sr-only"
                        />
                        <span className={option.iconColor}>{option.icon}</span>
                        <div className="text-center">
                          <p
                            className={`font-bold text-xs ${
                              darkMode ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`text-[9px] font-medium ${
                              darkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {option.sublabel}
                          </p>
                        </div>
                        {watchedValues.position === option.value && (
                          <span
                            className={`absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-linear-to-br ${option.color} text-white`}
                          >
                            {ICONS.check}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Validation Status + Submit Button - Equal Height */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
              {/* LEFT: Validation Status */}
              <div
                className={`px-4 py-4 rounded-xl flex items-center gap-3 ${
                  watchedValues.jerseyNumbers?.trim()
                    ? !isValidJerseyInput(watchedValues.jerseyNumbers)
                      ? darkMode
                        ? "bg-red-500/10 ring-1 ring-red-500/30"
                        : "bg-red-50 ring-1 ring-red-200"
                      : darkMode
                        ? "bg-orange-500/10 ring-1 ring-orange-500/30"
                        : "bg-orange-50 ring-1 ring-orange-200"
                    : darkMode
                      ? "bg-slate-800/50 ring-1 ring-slate-700"
                      : "bg-slate-100 ring-1 ring-slate-200"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    watchedValues.jerseyNumbers?.trim()
                      ? !isValidJerseyInput(watchedValues.jerseyNumbers)
                        ? "bg-red-500 animate-pulse"
                        : darkMode
                          ? "bg-orange-400 animate-pulse"
                          : "bg-orange-600 animate-pulse"
                      : darkMode
                        ? "bg-slate-600"
                        : "bg-slate-300"
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    watchedValues.jerseyNumbers?.trim()
                      ? !isValidJerseyInput(watchedValues.jerseyNumbers)
                        ? darkMode
                          ? "text-red-400"
                          : "text-red-600"
                        : darkMode
                          ? "text-orange-400"
                          : "text-orange-700"
                      : darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                  }`}
                >
                  {watchedValues.jerseyNumbers?.trim()
                    ? isValidJerseyInput(watchedValues.jerseyNumbers)
                      ? `${validCount} valid jersey number(s) detected`
                      : "Duplicate or Invalid jersey number(s) — only whole numbers allowed"
                    : "Enter jersey numbers above"}
                </p>
              </div>

              {/* RIGHT: Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  submitSuccess
                    ? darkMode
                      ? "bg-linear-to-r from-emerald-500 to-green-600 text-white"
                      : "bg-linear-to-r from-emerald-500 to-green-500 text-white"
                    : darkMode
                      ? "bg-linear-to-r from-orange-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-orange-500/25 hover:brightness-110 hover:shadow-xl hover:shadow-orange-500/30"
                      : "bg-linear-to-r from-orange-500 via-rose-500 to-pink-500 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 hover:shadow-xl hover:shadow-orange-500/25"
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100`}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                    <span>Submitting...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <span className="w-5 h-5">{ICONS.check}</span>
                    <span>Results Submitted!</span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5">{ICONS.send}</span>
                    <span>Submit Results</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Card - Full Width */}
            {hasValidInput &&
              watchedValues.eventId &&
              watchedValues.position && (
                <div
                  className={`mt-5 rounded-xl p-4 ${
                    darkMode
                      ? "bg-orange-950/40 ring-1 ring-orange-500/30"
                      : "bg-orange-50 ring-1 ring-orange-200"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold mb-2 ${
                      darkMode ? "text-orange-400" : "text-orange-700"
                    }`}
                  >
                    Preview
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-orange-200" : "text-orange-800"
                    }`}
                  >
                    Setting{" "}
                    <strong>
                      {watchedValues.position === "1"
                        ? "🥇 1st (Gold)"
                        : watchedValues.position === "2"
                          ? "🥈 2nd (Silver)"
                          : "🥉 3rd (Bronze)"}
                    </strong>{" "}
                    for <strong>{validCount}</strong> participant(s) with
                    jerseys{" "}
                    <strong className="font-mono">
                      [
                      {parseJerseyNumbers(watchedValues.jerseyNumbers).join(
                        ", ",
                      )}
                      ]
                    </strong>{" "}
                    in <strong>{getSelectedEventName()}</strong>
                  </p>
                </div>
              )}
          </form>
        </div>
      </div>
    </>
  );
}
