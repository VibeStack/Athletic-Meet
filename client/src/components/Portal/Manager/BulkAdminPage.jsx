import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../../../context/ThemeContext";
import { useUsers } from "../../../context/UsersContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* -------------------- Custom SVG Icons -------------------- */
const ICONS = {
  shieldAdmin: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  ),
  promoteUp: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v3h3l-4 4-4-4h3V9z"
        transform="rotate(180, 12, 12)"
      />
    </svg>
  ),
  demoteDown: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v3h3l-4 4-4-4h3V9z" />
    </svg>
  ),
  badge: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zm1 13h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
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
  users: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
};

// Helper: Convert trailing space to comma for jersey number input
const handleJerseyInput = (e, setValue) => {
  let newValue = e.target.value;
  // If ends with space, replace with comma (but not if already ends with comma)
  if (newValue.endsWith(" ")) {
    const trimmed = newValue.trimEnd();
    // Only add comma if doesn't already end with comma
    if (!trimmed.endsWith(",") && trimmed.length > 0) {
      newValue = trimmed + ", ";
    } else {
      newValue = trimmed + " ";
    }
  }
  // Clean up multiple consecutive commas/spaces
  newValue = newValue.replace(/,\s*,+/g, ",").replace(/\s+/g, " ");
  setValue("jerseyNumbers", newValue, { shouldValidate: true });
};

export default function BulkAdminPage() {
  const { darkMode } = useTheme();
  const { allUsers, updateUserInCache } = useUsers();
  const API_URL = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("promote"); // 'promote' or 'demote'
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const timeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { jerseyNumbers: "" },
  });

  const watchedValues = watch();

  // Parse jersey numbers (comma separated, only whole numbers)
  const parseJerseyNumbers = (input) => {
    const numbers = input
      .split(",")
      .map((n) => n.trim())
      .filter((n) => /^\d+$/.test(n))
      .map((n) => Number(n));
    return [...new Set(numbers)];
  };

  // Validate jersey numbers input
  const isValidJerseyInput = (input) => {
    if (!input.trim()) return false;
    const values = input
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n);
    if (!values.every((n) => /^\d+$/.test(n))) return false;
    const unique = new Set(values);
    return unique.size === values.length;
  };

  const getValidCount = (input) => parseJerseyNumbers(input).length;

  // Handle form submission
  const onSubmit = async (data) => {
    const jerseyNumbers = parseJerseyNumbers(data.jerseyNumbers);

    if (jerseyNumbers.length === 0) {
      toast.error("Please enter valid jersey numbers");
      return;
    }

    const endpoint =
      activeTab === "promote"
        ? `${API_URL}/manager/users/makeMultipleAsAdmin`
        : `${API_URL}/manager/users/removeMultipleAsAdmin`;

    try {
      setSubmitting(true);
      setSubmitSuccess(false);

      const { data: response } = await axios.post(
        endpoint,
        { jerseyNumbers },
        { withCredentials: true },
      );

      if (response.success) {
        const { promotedCount, demotedCount, alreadyAdmins, alreadyStudents } =
          response.data || {};

        setSubmitSuccess(true);

        if (activeTab === "promote") {
          const alreadyList =
            alreadyAdmins?.length > 0
              ? ` (Already Admin: ${alreadyAdmins.join(", ")})`
              : "";
          toast.success(
            `✅ ${promotedCount ?? 0} promoted to Admin!${alreadyList}`,
          );
        } else {
          const alreadyList =
            alreadyStudents?.length > 0
              ? ` (Already Student: ${alreadyStudents.join(", ")})`
              : "";
          toast.success(
            `✅ ${demotedCount ?? 0} demoted to Student!${alreadyList}`,
          );
        }

        reset();
        // Update users cache directly for affected users (faster than refetching all)
        const newRole = activeTab === "promote" ? "Admin" : "Student";
        jerseyNumbers.forEach((jerseyNum) => {
          const user = allUsers.find((u) => u.jerseyNumber === jerseyNum);
          if (user) {
            updateUserInCache(user.id, { role: newRole });
          }
        });
        timeoutRef.current = setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Operation failed. Please try again.";
      toast.error(`❌ ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const hasValidInput =
    watchedValues.jerseyNumbers &&
    isValidJerseyInput(watchedValues.jerseyNumbers);
  const validCount = hasValidInput
    ? getValidCount(watchedValues.jerseyNumbers)
    : 0;

  // Theme colors - Teal/Cyan for promotion, Slate/Gray for demotion
  const themeColors = {
    promote: {
      primary: "teal",
      gradient: "from-teal-500 to-cyan-600",
      gradientText: darkMode
        ? "from-teal-400 via-cyan-400 to-sky-400"
        : "text-slate-800",
      glow1: "bg-teal-500",
      glow2: "bg-cyan-500",
      shadow: "rgba(20,184,166,0.25)",
      shadowForm: "rgba(20,184,166,0.15)",
      bgAccent: darkMode ? "bg-teal-500/15" : "bg-teal-50",
      textAccent: darkMode ? "text-teal-400" : "text-teal-600",
      textMuted: darkMode ? "text-teal-400/70" : "text-teal-600",
      infoBg: darkMode
        ? "from-teal-950/40 to-slate-900/60"
        : "from-teal-50 to-slate-50",
      infoRing: darkMode ? "ring-teal-500/20" : "ring-teal-200",
      infoIcon: darkMode
        ? "bg-teal-500/20 text-teal-400"
        : "bg-teal-100 text-teal-600",
      infoText: darkMode ? "text-teal-300/80" : "text-teal-700",
      inputFocus: "focus:border-teal-500 focus:ring-teal-500/20",
      validBg: darkMode
        ? "bg-teal-500/10 ring-1 ring-teal-500/30"
        : "bg-teal-50 ring-1 ring-teal-200",
      validDot: darkMode ? "bg-teal-400" : "bg-teal-600",
      validText: darkMode ? "text-teal-400" : "text-teal-700",
      buttonGradient: "from-teal-500 via-cyan-500 to-sky-500",
      buttonShadow: darkMode ? "shadow-teal-500/25" : "shadow-teal-500/20",
    },
    demote: {
      primary: "slate",
      gradient: "from-slate-500 to-gray-600",
      gradientText: darkMode
        ? "from-slate-400 via-gray-400 to-zinc-400"
        : "text-slate-800",
      glow1: "bg-slate-500",
      glow2: "bg-gray-500",
      shadow: "rgba(100,116,139,0.25)",
      shadowForm: "rgba(100,116,139,0.15)",
      bgAccent: darkMode ? "bg-slate-500/15" : "bg-slate-100",
      textAccent: darkMode ? "text-slate-400" : "text-slate-600",
      textMuted: darkMode ? "text-slate-400/70" : "text-slate-600",
      infoBg: darkMode
        ? "from-slate-800/40 to-slate-900/60"
        : "from-slate-100 to-slate-50",
      infoRing: darkMode ? "ring-slate-500/20" : "ring-slate-300",
      infoIcon: darkMode
        ? "bg-slate-500/20 text-slate-400"
        : "bg-slate-200 text-slate-600",
      infoText: darkMode ? "text-slate-300/80" : "text-slate-600",
      inputFocus: "focus:border-slate-500 focus:ring-slate-500/20",
      validBg: darkMode
        ? "bg-slate-500/10 ring-1 ring-slate-500/30"
        : "bg-slate-100 ring-1 ring-slate-300",
      validDot: darkMode ? "bg-slate-400" : "bg-slate-600",
      validText: darkMode ? "text-slate-400" : "text-slate-700",
      buttonGradient: "from-slate-500 via-gray-500 to-zinc-500",
      buttonShadow: darkMode ? "shadow-slate-500/25" : "shadow-slate-500/20",
    },
  };

  const theme = themeColors[activeTab];

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="space-y-4 sm:space-y-5">
        {/* Header Section */}
        <div
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
            darkMode
              ? `bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_${theme.shadow}]`
              : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          {/* Background glow effects */}
          {darkMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 ${theme.glow1}`}
              />
              <div
                className={`absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 ${theme.glow2}`}
              />
            </div>
          )}

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                  darkMode
                    ? `bg-linear-to-br ${theme.gradient}`
                    : "bg-slate-900"
                }`}
              >
                {ICONS.shieldAdmin}
              </div>
              <div>
                <h1
                  className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                    darkMode
                      ? `bg-linear-to-r ${theme.gradientText} bg-clip-text text-transparent`
                      : "text-slate-800"
                  }`}
                >
                  Bulk Admin Management
                </h1>
                <p
                  className={`text-[11px] sm:text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  Promote or demote multiple users by jersey number
                </p>
              </div>
            </div>

            {/* Valid Count Stat */}
            <div
              className={`flex items-stretch justify-center gap-1.5 sm:gap-2 p-1.5 rounded-xl w-full sm:w-auto ${
                darkMode
                  ? "bg-slate-900/60 ring-1 ring-white/6"
                  : "bg-slate-50 ring-1 ring-slate-200"
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center px-2.5 sm:px-4 py-2 rounded-lg min-w-[55px] sm:min-w-[65px] ${theme.bgAccent}`}
              >
                <span
                  className={`text-base sm:text-xl font-black leading-none ${theme.textAccent}`}
                >
                  {validCount}
                </span>
                <p
                  className={`text-[8px] sm:text-[9px] mt-0.5 font-bold uppercase tracking-wide ${theme.textMuted}`}
                >
                  Selected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          className={`flex gap-2 p-1.5 rounded-xl ${
            darkMode
              ? "bg-slate-900/80 ring-1 ring-white/6"
              : "bg-slate-100 ring-1 ring-slate-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("promote")}
            className={`flex-1 flex items-center text-center justify-center py-3 px-4 rounded-lg font-bold text-sm transition-transform  ${
              activeTab === "promote"
                ? darkMode
                  ? "bg-linear-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30"
                  : "bg-linear-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            {ICONS.promoteUp}
            <span>Promote to Admin</span>
          </button>
          <button
            onClick={() => setActiveTab("demote")}
            className={`flex-1 flex items-center text-center justify-center py-3 px-4 rounded-lg font-bold text-sm transition-transform  ${
              activeTab === "demote"
                ? darkMode
                  ? "bg-linear-to-r from-slate-500 to-gray-600 text-white shadow-lg shadow-slate-500/30"
                  : "bg-linear-to-r from-slate-500 to-gray-600 text-white shadow-lg"
                : darkMode
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            {ICONS.demoteDown}
            <span>Demote to Student</span>
          </button>
        </div>

        {/* Info Banner */}
        <div
          className={`rounded-xl p-3 sm:p-4 flex items-start gap-3 ${
            darkMode
              ? `bg-linear-to-r ${theme.infoBg} ring-1 ${theme.infoRing}`
              : `bg-linear-to-r ${theme.infoBg} ring-1 ${theme.infoRing}`
          }`}
        >
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${theme.infoIcon}`}
          >
            {ICONS.info}
          </div>
          <div>
            <p
              className={`font-bold text-sm ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              {activeTab === "promote"
                ? "How to Promote to Admin"
                : "How to Demote to Student"}
            </p>
            <ul
              className={`text-[11px] sm:text-xs mt-1.5 space-y-1 ${theme.infoText}`}
            >
              <li className="flex items-start gap-2">
                <span className={`font-bold ${theme.textAccent}`}>1.</span>
                <span>
                  Enter{" "}
                  <strong className={theme.textAccent}>jersey numbers</strong>{" "}
                  separated by commas (e.g., 1, 5, 12, 23)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`font-bold ${theme.textAccent}`}>2.</span>
                <span>
                  Click{" "}
                  <strong className={theme.textAccent}>
                    {activeTab === "promote"
                      ? "Promote to Admin"
                      : "Demote to Student"}
                  </strong>{" "}
                  to {activeTab === "promote" ? "promote" : "demote"} all
                  matching users
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className={`font-bold ${theme.textAccent}`}>3.</span>
                <span>
                  {activeTab === "promote"
                    ? "Only eligible Students with complete profiles will be promoted"
                    : "Current Admins will be demoted back to Student role"}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form Card */}
        <div
          className={`rounded-2xl overflow-hidden ${
            darkMode
              ? `bg-[#0f172a]/90 ring-1 ring-white/8 shadow-[0_0_60px_-15px_${theme.shadowForm}]`
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
                  ? `bg-linear-to-br ${theme.gradient}`
                  : activeTab === "promote"
                    ? "bg-teal-600"
                    : "bg-slate-600"
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
                {activeTab === "promote"
                  ? "Promote Users to Admin"
                  : "Demote Admins to Student"}
              </h2>
              <p
                className={`text-[11px] ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Enter jersey numbers to{" "}
                {activeTab === "promote" ? "promote" : "demote"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
            {/* Jersey Numbers Input */}
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-center gap-2 text-sm font-semibold ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    activeTab === "promote"
                      ? darkMode
                        ? "bg-teal-700/40 text-teal-400"
                        : "bg-teal-100 text-teal-700"
                      : darkMode
                        ? "bg-slate-700/40 text-slate-400"
                        : "bg-slate-200 text-slate-700"
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
                onChange={(e) => handleJerseyInput(e, setValue)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-transform  resize-none focus:outline-none ${(() => {
                  const hasInput = watchedValues.jerseyNumbers?.trim();
                  const isValid =
                    hasInput && isValidJerseyInput(watchedValues.jerseyNumbers);

                  if (hasInput && !isValid) {
                    return darkMode
                      ? "bg-slate-800/80 ring-2 ring-red-500/50 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-red-500"
                      : "bg-slate-50 ring-2 ring-red-300 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500";
                  }
                  return darkMode
                    ? `bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 ${theme.inputFocus}`
                    : `bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 ${theme.inputFocus}`;
                })()} ${errors.jerseyNumbers ? "ring-2 ring-red-500/50" : ""}`}
              />
            </div>

            {/* Validation Status + Submit Button */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
              {/* Validation Status */}
              <div
                className={`px-4 py-4 rounded-xl flex items-center gap-3 ${
                  watchedValues.jerseyNumbers?.trim()
                    ? !isValidJerseyInput(watchedValues.jerseyNumbers)
                      ? darkMode
                        ? "bg-red-500/10 ring-1 ring-red-500/30"
                        : "bg-red-50 ring-1 ring-red-200"
                      : theme.validBg
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
                        : `${theme.validDot} animate-pulse`
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
                        : theme.validText
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-base transition-transform  flex items-center justify-center gap-2 ${
                  submitSuccess
                    ? darkMode
                      ? `bg-linear-to-r ${theme.gradient} text-white`
                      : `bg-linear-to-r ${theme.gradient} text-white`
                    : darkMode
                      ? `bg-linear-to-r ${theme.buttonGradient} text-white shadow-lg ${theme.buttonShadow} hover:brightness-110 hover:shadow-xl`
                      : `bg-linear-to-r ${theme.buttonGradient} text-white shadow-lg ${theme.buttonShadow} hover:brightness-110 hover:shadow-xl`
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100`}
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                    <span>Processing...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <span className="w-5 h-5">{ICONS.check}</span>
                    <span>Done!</span>
                  </>
                ) : (
                  <>
                    <span className="w-5 h-5">{ICONS.send}</span>
                    <span>
                      {activeTab === "promote"
                        ? "Promote to Admin"
                        : "Demote to Student"}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Card */}
            {hasValidInput && (
              <div
                className={`mt-5 rounded-xl p-4 ${
                  activeTab === "promote"
                    ? darkMode
                      ? "bg-teal-950/40 ring-1 ring-teal-500/30"
                      : "bg-teal-50 ring-1 ring-teal-200"
                    : darkMode
                      ? "bg-slate-800/40 ring-1 ring-slate-500/30"
                      : "bg-slate-100 ring-1 ring-slate-300"
                }`}
              >
                <p
                  className={`text-xs font-semibold mb-2 ${
                    activeTab === "promote"
                      ? darkMode
                        ? "text-teal-400"
                        : "text-teal-700"
                      : darkMode
                        ? "text-slate-400"
                        : "text-slate-700"
                  }`}
                >
                  Preview
                </p>
                <p
                  className={`text-sm ${
                    activeTab === "promote"
                      ? darkMode
                        ? "text-teal-200"
                        : "text-teal-800"
                      : darkMode
                        ? "text-slate-200"
                        : "text-slate-800"
                  }`}
                >
                  {activeTab === "promote" ? "Promoting" : "Demoting"}{" "}
                  <strong>{validCount}</strong> user(s) with jersey numbers{" "}
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
