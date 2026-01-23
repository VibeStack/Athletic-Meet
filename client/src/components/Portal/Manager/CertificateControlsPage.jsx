import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import LoadingComponent from "../LoadingComponent";

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  certificate: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  ),
  lock: (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  unlock: (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  ),
};

export default function CertificateControlsPage() {
  const { darkMode } = useTheme();
  const [isLocked, setIsLocked] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data: response } = await axios.get(
          `${API_URL}/manager/certificates/status`,
          { withCredentials: true },
        );
        if (response.success) {
          setIsLocked(response.data.areCertificatesLocked);
        }
      } catch (err) {
        console.error("Failed to fetch certificate status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [API_URL]);

  const toggleLock = async () => {
    try {
      setUpdating(true);
      const endpoint = isLocked
        ? `${API_URL}/manager/certificates/unlock`
        : `${API_URL}/manager/certificates/lock`;

      const { data: response } = await axios.post(
        endpoint,
        {},
        { withCredentials: true },
      );

      if (response.success) {
        setIsLocked(response.data.areCertificatesLocked);
      }
    } catch (err) {
      console.error("Failed to toggle certificate lock", err);
      alert("Failed to update certificate status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <LoadingComponent
        darkMode={darkMode}
        title="Loading Certificate Controls"
        message="Fetching certificate status..."
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 ${
          darkMode
            ? "bg-linear-to-br from-slate-900 via-slate-800/80 to-slate-900 ring-1 ring-white/10"
            : "bg-linear-to-br from-white via-slate-50 to-white ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Background glow effects */}
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 bg-violet-500" />
            <div className="absolute -bottom-32 -left-32 w-56 h-56 rounded-full blur-3xl opacity-15 bg-purple-600" />
          </div>
        )}

        <div className="relative flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
              darkMode
                ? "bg-linear-to-br from-violet-500 to-purple-600"
                : "bg-slate-900"
            }`}
          >
            {ICONS.certificate}
          </div>
          <div>
            <h1
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                darkMode
                  ? "bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
                  : "text-slate-800"
              }`}
            >
              Certificate Controls
            </h1>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Manage student certificate availability
            </p>
          </div>
        </div>
      </div>

      {/* Main Control Card */}
      <div
        className={`relative overflow-hidden rounded-2xl ${
          darkMode
            ? "bg-slate-900/80 ring-1 ring-white/10"
            : "bg-white ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Status Banner */}
        <div
          className={`px-6 py-4 border-b ${
            isLocked
              ? darkMode
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-200"
              : darkMode
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-emerald-50 border-emerald-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                isLocked ? "bg-red-500" : "bg-emerald-500"
              }`}
            />
            <span
              className={`text-sm font-bold uppercase tracking-wider ${
                isLocked
                  ? darkMode
                    ? "text-red-400"
                    : "text-red-600"
                  : darkMode
                    ? "text-emerald-400"
                    : "text-emerald-600"
              }`}
            >
              {isLocked ? "Certificates Locked" : "Certificates Available"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Side - Icon and Info */}
            <div className="flex items-start gap-5">
              {/* Lock/Unlock Icon */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isLocked
                    ? darkMode
                      ? "bg-linear-to-br from-red-500/20 to-rose-500/10 ring-2 ring-red-500/30 text-red-400"
                      : "bg-linear-to-br from-red-100 to-rose-100 ring-2 ring-red-300 text-red-500"
                    : darkMode
                      ? "bg-linear-to-br from-emerald-500/20 to-green-500/10 ring-2 ring-emerald-500/30 text-emerald-400"
                      : "bg-linear-to-br from-emerald-100 to-green-100 ring-2 ring-emerald-300 text-emerald-500"
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  {isLocked ? ICONS.lock : ICONS.unlock}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h2
                  className={`font-black text-xl sm:text-2xl mb-2 ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  Global Certificate Lock
                </h2>
                <p
                  className={`text-sm sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {isLocked
                    ? "Students cannot view or download their certificates. Toggle the lock to make certificates available."
                    : "Students can now access and download their certificates. You can lock them again at any time."}
                </p>
              </div>
            </div>

            {/* Right Side - Action Button */}
            <div className="flex justify-center w-[200px]">
              <button
                onClick={toggleLock}
                disabled={updating}
                className={`group relative px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 shadow-xl min-w-[220px] overflow-hidden ${
                  isLocked
                    ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    : "bg-linear-to-r from-red-500 to-rose-600 text-white shadow-red-500/25 hover:shadow-red-500/40"
                } hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative w-5 h-5 flex items-center justify-center shrink-0">
                  {updating ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
                  ) : (
                    <div className="w-5 h-5">
                      {isLocked ? ICONS.unlock : ICONS.lock}
                    </div>
                  )}
                </span>
                <span className="relative whitespace-nowrap">
                  {updating
                    ? "Updating..."
                    : isLocked
                      ? "Unlock Certificates"
                      : "Lock Certificates"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Locked State Info */}
        <div
          className={`rounded-xl p-5 ${
            darkMode
              ? "bg-red-500/5 ring-1 ring-red-500/20"
              : "bg-red-50 ring-1 ring-red-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-red-500/15 text-red-400"
                  : "bg-red-100 text-red-500"
              }`}
            >
              <div className="w-5 h-5">{ICONS.lock}</div>
            </div>
            <div>
              <h3
                className={`font-bold text-sm mb-1 ${
                  darkMode ? "text-red-400" : "text-red-700"
                }`}
              >
                When Locked
              </h3>
              <p
                className={`text-xs ${
                  darkMode ? "text-red-400/70" : "text-red-600/80"
                }`}
              >
                Students see a "Certificates Locked" message and cannot download
                any certificates until you unlock them.
              </p>
            </div>
          </div>
        </div>

        {/* Unlocked State Info */}
        <div
          className={`rounded-xl p-5 ${
            darkMode
              ? "bg-emerald-500/5 ring-1 ring-emerald-500/20"
              : "bg-emerald-50 ring-1 ring-emerald-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                darkMode
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-emerald-100 text-emerald-500"
              }`}
            >
              <div className="w-5 h-5">{ICONS.unlock}</div>
            </div>
            <div>
              <h3
                className={`font-bold text-sm mb-1 ${
                  darkMode ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                When Unlocked
              </h3>
              <p
                className={`text-xs ${
                  darkMode ? "text-emerald-400/70" : "text-emerald-600/80"
                }`}
              >
                Students can view and download their participation and winner
                certificates from the Certificates page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Box */}
      <div
        className={`rounded-xl p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-slate-800/50 ring-1 ring-white/5"
            : "bg-slate-50 ring-1 ring-slate-200"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-amber-500/15 text-amber-400"
              : "bg-amber-100 text-amber-600"
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div>
          <p
            className={`text-xs font-semibold ${
              darkMode ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Pro Tip
          </p>
          <p
            className={`text-xs mt-0.5 ${
              darkMode ? "text-slate-500" : "text-slate-500"
            }`}
          >
            Keep certificates locked until all events are completed and results
            are finalized. Unlock them when you're ready for students to
            download.
          </p>
        </div>
      </div>
    </div>
  );
}
