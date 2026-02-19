import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import LoadingComponent from "../LoadingComponent";

/* -------------------- Helper Functions -------------------- */
const formatTime = (ms) => {
  if (ms <= 0) return "Expired";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

/* -------------------- OTP Card Component -------------------- */
function OtpCard({ otp, darkMode, now }) {
  const createdAtMs = new Date(otp.createdAt).getTime();
  const expiresAtMs = createdAtMs + 5 * 60 * 1000;
  const remainingMs = Math.max(0, expiresAtMs - now);
  const isExpiringSoon = remainingMs > 0 && remainingMs < 60 * 1000;
  const isExpired = remainingMs <= 0;
  const progressPercent = Math.max(0, (remainingMs / (5 * 60 * 1000)) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl transition-transform  ${
        darkMode
          ? "bg-linear-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-emerald-500/10 shadow-2xl shadow-emerald-900/20"
          : "bg-white border border-emerald-100 shadow-xl shadow-emerald-100/50"
      }`}
    >
      {/* Glow Effect */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-3xl transition-opacity  ${
          isExpiringSoon
            ? "bg-amber-500/30 opacity-100"
            : "bg-emerald-500/20 opacity-60"
        }`}
      />

      {/* Progress Bar - Top */}
      <div className={`h-1 ${darkMode ? "bg-slate-700/50" : "bg-emerald-50"}`}>
        <div
          className={`h-full transition-transform  ease-linear ${
            isExpiringSoon
              ? "bg-linear-to-r from-amber-400 via-orange-500 to-red-500"
              : "bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="relative p-4 sm:p-5">
        {/* Header Row - OTP Label + Timer */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <p
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
              darkMode ? "text-emerald-400/80" : "text-emerald-600"
            }`}
          >
            Verification Code
          </p>
          <div
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl font-mono text-sm sm:text-base font-bold ${
              isExpired
                ? "bg-slate-500/30 text-slate-400"
                : isExpiringSoon
                  ? "text-white animate-pulse"
                  : "text-white"
            }`}
            style={{
              background: isExpired
                ? undefined
                : isExpiringSoon
                  ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                  : "linear-gradient(135deg, #059669, #0d9488)",
              boxShadow: isExpired
                ? undefined
                : isExpiringSoon
                  ? "0 4px 20px rgba(245, 158, 11, 0.4)"
                  : "0 4px 20px rgba(5, 150, 105, 0.35)",
            }}
          >
            {isExpired ? "Expired" : formatTime(remainingMs)}
          </div>
        </div>

        {/* OTP Display */}
        <div className="flex gap-1.5 sm:gap-2 mb-4">
          {otp.otp?.split("").map((digit, index) => (
            <div
              key={index}
              className={`flex-1 aspect-square max-w-[44px] sm:max-w-[48px] flex items-center justify-center text-lg sm:text-2xl font-bold rounded-lg sm:rounded-xl transition-transform  ${
                isExpired
                  ? "bg-slate-600/30 text-slate-500"
                  : darkMode
                    ? "text-white"
                    : "text-emerald-700"
              }`}
              style={{
                background: isExpired
                  ? undefined
                  : darkMode
                    ? "linear-gradient(180deg, rgba(5, 150, 105, 0.2) 0%, rgba(13, 148, 136, 0.15) 100%)"
                    : "linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(13, 148, 136, 0.08) 100%)",
                border: isExpired
                  ? undefined
                  : darkMode
                    ? "1px solid rgba(16, 185, 129, 0.35)"
                    : "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              {digit}
            </div>
          ))}
        </div>

        {/* User Info Card */}
        <div
          className={`rounded-xl p-3 sm:p-3.5 ${
            darkMode
              ? "bg-slate-900/60 border border-emerald-500/10"
              : "bg-emerald-50/80 border border-emerald-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar - Green Theme */}
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                boxShadow: "0 4px 16px rgba(5, 150, 105, 0.35)",
              }}
            >
              {otp.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`font-semibold text-sm sm:text-base truncate ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                {otp.username}
              </p>
              <p
                className={`text-xs sm:text-sm truncate ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {otp.email}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-emerald-500/20">
          <div
            className={`flex items-center gap-1.5 text-[11px] sm:text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span>{formatDateTime(otp.createdAt)}</span>
          </div>
          {otp.attempts > 0 && (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
                otp.attempts >= 2
                  ? "bg-red-500/20 text-red-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              {otp.attempts}/3
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export default function OtpMonitorPage() {
  const { darkMode } = useTheme();
  const [otps, setOtps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchOtps = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get("/api/v1/manager/otps", {
        withCredentials: true,
      });
      setOtps(response.data.data || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch OTPs:", err);
      setError(err.response?.data?.message || "Failed to fetch OTPs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOtps();
    const refreshInterval = setInterval(fetchOtps, 30000);
    return () => clearInterval(refreshInterval);
  }, [fetchOtps]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOtps = otps.filter((otp) => {
    const createdAtMs = new Date(otp.createdAt).getTime();
    const expiresAtMs = createdAtMs + 5 * 60 * 1000;
    return expiresAtMs > now;
  });

  if (loading)
    return (
      <LoadingComponent
        darkMode={darkMode}
        title="Monitoring OTPs"
        message="Fetching real-time verification codes..."
      />
    );

  return (
    <div
      className={`min-h-screen px-4 py-5 sm:p-6 lg:p-10 ${
        darkMode
          ? "bg-slate-950"
          : "bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30"
      }`}
    >
      {/* Background Pattern for Dark Mode */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, rgba(5, 150, 105, 0.25), rgba(13, 148, 136, 0.2))"
                    : "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(13, 148, 136, 0.15))",
                  boxShadow: "0 8px 32px rgba(5, 150, 105, 0.15)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <div>
                <h1
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  OTP Monitor
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-0.5 ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Real-time codes
                  {lastRefresh && (
                    <span className="hidden sm:inline">
                      {" "}
                      • Updated {lastRefresh.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchOtps}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base text-white transition-transform hover:scale-105 active:scale-95 shrink-0"
              style={{
                background: "linear-gradient(135deg, #059669, #0d9488)",
                boxShadow: "0 4px 20px rgba(5, 150, 105, 0.35)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
              >
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {/* Mobile Last Updated */}
          {lastRefresh && (
            <p
              className={`text-xs sm:hidden ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Updated {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div
            className={`mb-5 sm:mb-8 p-4 rounded-xl flex items-center gap-3 ${
              darkMode
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Content */}
        {activeOtps.length === 0 ? (
          <div
            className={`text-center py-16 sm:py-20 rounded-2xl sm:rounded-3xl ${
              darkMode
                ? "bg-slate-900/50 border border-emerald-500/10"
                : "bg-white border border-emerald-100 shadow-xl"
            }`}
          >
            <div
              className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-5"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(13, 148, 136, 0.15))"
                  : "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(13, 148, 136, 0.1))",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-8 h-8 sm:w-10 sm:h-10 ${darkMode ? "text-emerald-500/70" : "text-emerald-500"}`}
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3
              className={`text-lg sm:text-xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              All Clear!
            </h3>
            <p
              className={`text-sm max-w-xs mx-auto px-4 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              No pending verification codes. New OTPs appear here instantly.
            </p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div
              className={`mb-5 sm:mb-6 px-4 py-3 rounded-xl flex items-center justify-between ${
                darkMode
                  ? "bg-slate-900/50 border border-emerald-500/10"
                  : "bg-white border border-emerald-100 shadow-md"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500" />
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Active
                </span>
                <span
                  className="text-xl sm:text-2xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #059669, #0d9488)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {activeOtps.length}
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {activeOtps.map((otp) => (
                <OtpCard
                  key={otp.email}
                  otp={otp}
                  darkMode={darkMode}
                  now={now}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
