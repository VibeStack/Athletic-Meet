import { useState, useEffect } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import LoadingComponent from "../LoadingComponent";

/* -------------------- Icons -------------------- */
const ICONS = {
  certificate: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
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
      alert("❌ Failed to update certificate status");
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
    <div className="space-y-4 sm:space-y-5">
      {/* Header Section */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(147,51,234,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-slate-100 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {/* Background glow effects */}
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-violet-500" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-purple-600" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-violet-500 to-purple-600"
                  : "bg-slate-900"
              }`}
            >
              {ICONS.certificate}
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                Certificate Controls
              </h1>
              <p
                className={`text-[11px] sm:text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Manage student certificate availability
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Status Card */}
      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-8 ${
          isLocked
            ? darkMode
              ? "bg-linear-to-br from-red-950/60 via-rose-950/40 to-orange-950/30 ring-2 ring-red-500/40"
              : "bg-linear-to-br from-red-50 via-rose-50 to-orange-50 ring-2 ring-red-300"
            : darkMode
              ? "bg-linear-to-br from-emerald-950/60 via-green-950/40 to-teal-950/30 ring-2 ring-emerald-500/40"
              : "bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 ring-2 ring-emerald-300"
        }`}
      >
        {/* Glow effect */}
        {darkMode && (
          <div
            className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none ${
              isLocked ? "bg-red-500/20" : "bg-emerald-500/20"
            }`}
          />
        )}

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                isLocked
                  ? "bg-linear-to-br from-red-500 to-rose-600"
                  : "bg-linear-to-br from-emerald-500 to-green-600"
              }`}
            >
              <span className="text-3xl sm:text-4xl">
                {isLocked ? "🔒" : "🔓"}
              </span>
            </div>
            <div>
              <h2
                className={`font-black text-xl sm:text-2xl mb-1 ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                Global Certificate Lock
              </h2>
              <p
                className={`font-bold text-base sm:text-lg ${
                  isLocked
                    ? darkMode
                      ? "text-red-400"
                      : "text-red-600"
                    : darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                }`}
              >
                {isLocked
                  ? "Certificates are LOCKED"
                  : "Certificates are AVAILABLE"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {isLocked
                  ? "Students cannot view or download their certificates"
                  : "Students can now access and download their certificates"}
              </p>
            </div>
          </div>

          <button
            onClick={toggleLock}
            disabled={updating}
            className={`px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-3 shadow-xl min-w-[200px] ${
              isLocked
                ? darkMode
                  ? "bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/25 hover:brightness-110"
                  : "bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30 hover:brightness-110"
                : darkMode
                  ? "bg-linear-to-r from-red-500 to-rose-600 text-white shadow-red-500/25 hover:brightness-110"
                  : "bg-linear-to-r from-red-500 to-rose-500 text-white shadow-red-500/30 hover:brightness-110"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              {updating ? (
                <span className="animate-spin h-5 w-5 border-2 border-white/30 rounded-full border-t-white" />
              ) : isLocked ? (
                ICONS.unlock
              ) : (
                ICONS.lock
              )}
            </span>
            <span className="whitespace-nowrap">
              {isLocked ? "Unlock Certificates" : "Lock Certificates"}
            </span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div
        className={`rounded-xl p-4 flex items-start gap-3 ${
          darkMode
            ? "bg-linear-to-r from-violet-950/40 to-slate-900/60 ring-1 ring-violet-500/20"
            : "bg-linear-to-r from-violet-50 to-slate-50 ring-1 ring-violet-200"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            darkMode
              ? "bg-violet-500/20 text-violet-400"
              : "bg-violet-100 text-violet-600"
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
            How Certificate Lock Works
          </p>
          <ul
            className={`text-xs mt-1.5 space-y-1 ${
              darkMode ? "text-violet-300/80" : "text-violet-700"
            }`}
          >
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}
              >
                •
              </span>
              <span>
                <strong className={darkMode ? "text-red-400" : "text-red-600"}>
                  Locked
                </strong>{" "}
                – Students see a message that certificates are unavailable
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className={`font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
              >
                •
              </span>
              <span>
                <strong
                  className={darkMode ? "text-emerald-400" : "text-emerald-600"}
                >
                  Unlocked
                </strong>{" "}
                – Students can view and download their certificates
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
