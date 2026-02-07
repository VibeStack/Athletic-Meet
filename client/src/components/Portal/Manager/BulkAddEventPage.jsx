import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import LoadingComponent from "../LoadingComponent";
import { sortEvents } from "../../../utils/eventSort";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------- Icons -------------------- */
import {
  AddEventIcon,
  UsersIcon,
  BadgeIcon,
  EventIcon,
  InfoIcon,
  CheckIcon,
  SendIcon,
  TrackIcon,
  FieldIcon,
  TeamIcon,
} from "../../../icons/Portal/Manager/BulkAddEventIcons";

/* -------------------- Icons -------------------- */
const ICONS = {
  addEvent: <AddEventIcon className="w-6 h-6 fill-current" />,
  users: <UsersIcon className="w-6 h-6 fill-current" />,
  badge: <BadgeIcon className="w-5 h-5 fill-current" />,
  event: <EventIcon className="w-5 h-5 fill-current" />,
  info: <InfoIcon className="w-5 h-5 fill-current" />,
  check: <CheckIcon className="w-4 h-4 fill-none stroke-current" />,
  send: <SendIcon className="w-5 h-5 fill-current" />,
  track: <TrackIcon className="w-5 h-5 fill-current" />,
  field: <FieldIcon className="w-5 h-5 fill-current" />,
  team: <TeamIcon className="w-5 h-5 fill-current" />,
};

export default function BulkAddEventPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jerseyNumbers: "",
      eventId: "",
    },
  });

  const watchedValues = watch();

  // Parse jersey numbers (same logic as QR Scanner)
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get selected event details for display
  const getSelectedEvent = () => {
    return events.find((e) => String(e.id) === String(watchedValues.eventId));
  };

  // Get type icon (same as EventResultsPage)
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

  // Get type colors
  const getTypeBadgeColors = (type) => {
    if (type === "Track") {
      return darkMode
        ? "bg-orange-500/25 text-orange-400"
        : "bg-orange-100 text-orange-600";
    }
    if (type === "Field") {
      return darkMode
        ? "bg-lime-500/25 text-lime-400"
        : "bg-lime-100 text-lime-600";
    }
    return darkMode
      ? "bg-blue-500/25 text-blue-400"
      : "bg-blue-100 text-blue-600";
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const jerseyNumbers = parseJerseyNumbers(data.jerseyNumbers);

    if (jerseyNumbers.length === 0) {
      toast.error("Please enter valid jersey numbers");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitSuccess(false);

      const { data: response } = await axios.post(
        `${API_URL}/manager/event/bulkAdd`,
        { jerseyNumbers, eventId: data.eventId },
        { withCredentials: true },
      );

      if (response.success) {
        const { updatedUsers } = response.data || {};

        setSubmitSuccess(true);

        toast.success(
          `Event added to ${updatedUsers ?? jerseyNumbers.length} participant(s)!`,
        );

        reset();
        timeoutRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.log(err.response);

      const apiError = err.response?.data || {};
      const message =
        apiError.message || "Failed to add event. Please try again.";
      const extraErrors = apiError.errors || [];

      const list = extraErrors.length ? `: ${extraErrors.join(", ")}` : "";

      // Map backend messages to short UI toasts
      if (message.includes("Event not found")) {
        toast.error("❌ Selected event does not exist.");
      } else if (message.includes("No matching users")) {
        toast.error("❌ No users found for the given jersey numbers.");
      } else if (message.includes("invalid — either they do not exist")) {
        toast.error(`❌ Invalid or gender-mismatched jerseys${list}`);
      } else if (message.includes("already enrolled")) {
        toast.error(`❌ Already enrolled users${list}`);
      } else if (message.includes("maximum event limit")) {
        toast.error(`❌ Max event limit reached for jerseys${list}`);
      } else {
        toast.error(`❌ ${message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <LoadingComponent
        title="Bulk Add Event"
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

  const selectedEvent = getSelectedEvent();
  const hasValidInput =
    watchedValues.jerseyNumbers &&
    isValidJerseyInput(watchedValues.jerseyNumbers);
  const validCount = hasValidInput
    ? getValidCount(watchedValues.jerseyNumbers)
    : 0;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="space-y-4 sm:space-y-5">
        {/* Header Section - Lime/Parrot Green Theme */}
        <div
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
            darkMode
              ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(132,204,22,0.25)]"
              : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          {/* Background glow effects - Lime green */}
          {darkMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-lime-500" />
              <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-green-500" />
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                  darkMode
                    ? "bg-linear-to-br from-lime-500 to-green-600"
                    : "bg-slate-900"
                }`}
              >
                {ICONS.addEvent}
              </div>
              <div>
                <h1
                  className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                    darkMode
                      ? "bg-linear-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent"
                      : "text-slate-800"
                  }`}
                >
                  Bulk Add Event
                </h1>
                <p
                  className={`text-[11px] sm:text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Add event to multiple participants at once
                </p>
              </div>
            </div>

            {/* Quick Stats - Lime */}
            <div
              className={`flex items-stretch justify-center gap-1.5 sm:gap-2 p-1.5 rounded-xl w-full sm:w-auto ${
                darkMode
                  ? "bg-slate-900/60 ring-1 ring-white/6"
                  : "bg-slate-50 ring-1 ring-slate-200"
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${
                  darkMode ? "bg-lime-500/15" : "bg-lime-50"
                }`}
              >
                <span
                  className={`text-base sm:text-xl font-black leading-none ${
                    darkMode ? "text-lime-400" : "text-lime-600"
                  }`}
                >
                  {events.length}
                </span>
                <p
                  className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${
                    darkMode ? "text-lime-400/70" : "text-lime-600"
                  }`}
                >
                  Events
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner - Lime theme */}
        <div
          className={`rounded-xl p-3 sm:p-4 flex items-start gap-3 ${
            darkMode
              ? "bg-linear-to-r from-lime-950/40 to-slate-900/60 ring-1 ring-lime-500/20"
              : "bg-linear-to-r from-lime-50 to-slate-50 ring-1 ring-lime-200"
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
              darkMode
                ? "bg-lime-500/20 text-lime-400"
                : "bg-lime-100 text-lime-600"
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
              How to Bulk Add Event
            </p>
            <ul
              className={`text-[11px] sm:text-xs mt-1.5 space-y-1 ${
                darkMode ? "text-lime-300/80" : "text-lime-700"
              }`}
            >
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-lime-400" : "text-lime-600"
                  }`}
                >
                  1.
                </span>
                <span>
                  Enter{" "}
                  <strong
                    className={darkMode ? "text-lime-400" : "text-lime-700"}
                  >
                    jersey numbers
                  </strong>{" "}
                  separated by commas (e.g., 1, 5, 12, 23)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-lime-400" : "text-lime-600"
                  }`}
                >
                  2.
                </span>
                <span>
                  Select the{" "}
                  <strong
                    className={darkMode ? "text-lime-400" : "text-lime-700"}
                  >
                    event
                  </strong>{" "}
                  to add
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`font-bold ${
                    darkMode ? "text-lime-400" : "text-lime-600"
                  }`}
                >
                  3.
                </span>
                <span>
                  Click{" "}
                  <strong
                    className={darkMode ? "text-lime-400" : "text-lime-700"}
                  >
                    Add Event
                  </strong>{" "}
                  to enroll all those participants in the event
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? "bg-[#0f172a]/90 ring-1 ring-white/8 shadow-[0_0_60px_-15px_rgba(132,204,22,0.15)]"
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
                  ? "bg-linear-to-br from-lime-500 to-green-600"
                  : "bg-lime-600"
              }`}
            >
              {ICONS.users}
            </div>
            <div>
              <h2
                className={`font-bold text-sm sm:text-base ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Add Event to Participants
              </h2>
              <p
                className={`text-[11px] ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Enter jersey numbers and select event
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
                        ? "bg-green-700/40 text-green-400"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {ICONS.badge}
                  </span>
                  Jersey Numbers
                </label>
                <textarea
                  placeholder="Enter jersey numbers: 1, 5, 12, 23 (spaces auto-convert to commas)"
                  rows={5}
                  {...register("jerseyNumbers", {
                    required: "Jersey numbers are required",
                    validate: (value) =>
                      isValidJerseyInput(value) ||
                      "Please enter valid jersey numbers (comma separated)",
                  })}
                  onChange={(e) => {
                    // Only add comma when space is typed at end
                    let newValue = e.target.value;
                    if (newValue.endsWith(" ")) {
                      const trimmed = newValue.trimEnd();
                      if (!trimmed.endsWith(",") && trimmed.length > 0) {
                        newValue = trimmed + ", ";
                      } else {
                        newValue = trimmed + " ";
                      }
                    }
                    newValue = newValue
                      .replace(/,\s*,+/g, ",")
                      .replace(/\s+/g, " ");
                    setValue("jerseyNumbers", newValue, {
                      shouldValidate: true,
                    });
                  }}
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
                      ? "bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                      : "bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20";
                  })()} ${errors.jerseyNumbers ? "ring-2 ring-red-500/50" : ""}`}
                />
              </div>

              {/* RIGHT: Select Event Label + Dropdown + Event Preview */}
              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${
                      darkMode
                        ? "bg-green-700/40 text-green-400"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {ICONS.event}
                  </span>
                  Select Event
                </label>
                <select
                  {...register("eventId", {
                    required: "Please select an event",
                  })}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 appearance-none cursor-pointer ${
                    darkMode
                      ? "bg-slate-800/80 border border-slate-700 text-white focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
                      : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20"
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

                {/* Event Preview - Always visible */}
                <div
                  className={`flex-1 rounded-xl p-4 flex items-center ${
                    darkMode
                      ? "bg-slate-800/60 ring-1 ring-white/10"
                      : "bg-slate-50 ring-1 ring-slate-200"
                  }`}
                >
                  {selectedEvent ? (
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 ${
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
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
              </div>
            </div>

            {/* ROW 2: Validation Status + Button - Equal Height */}
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
                        ? "bg-lime-500/10 ring-1 ring-lime-500/30"
                        : "bg-lime-50 ring-1 ring-lime-200"
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
                          ? "bg-lime-400 animate-pulse"
                          : "bg-lime-600 animate-pulse"
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
                          ? "text-lime-400"
                          : "text-lime-700"
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
                      ? "bg-linear-to-r from-lime-500 to-green-600 text-white"
                      : "bg-linear-to-r from-lime-500 to-green-500 text-white"
                    : darkMode
                      ? "bg-linear-to-r from-lime-500 via-green-500 to-emerald-500 text-white shadow-lg shadow-lime-500/25 hover:brightness-110 hover:shadow-xl hover:shadow-lime-500/30"
                      : "bg-linear-to-r from-lime-500 via-green-500 to-emerald-500 text-white shadow-lg shadow-lime-500/20 hover:brightness-110 hover:shadow-xl hover:shadow-lime-500/25"
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100`}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                    <span>Adding Event...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <span className="w-5 h-5">{ICONS.check}</span>
                    <span>Event Added!</span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5">{ICONS.send}</span>
                    <span>Add Event</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Card - Full Width */}
            {hasValidInput && watchedValues.eventId && selectedEvent && (
              <div
                className={`mt-5 rounded-xl p-4 ${
                  darkMode
                    ? "bg-lime-950/40 ring-1 ring-lime-500/30"
                    : "bg-lime-50 ring-1 ring-lime-200"
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-2 ${
                    darkMode ? "text-lime-400" : "text-lime-700"
                  }`}
                >
                  Preview
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-lime-200" : "text-lime-800"
                  }`}
                >
                  Adding <strong>{selectedEvent.name}</strong> to{" "}
                  <strong>{validCount}</strong> participant(s) with jersey
                  numbers{" "}
                  <strong className="font-mono">
                    [
                    {parseJerseyNumbers(watchedValues.jerseyNumbers).join(", ")}
                    ]
                  </strong>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
