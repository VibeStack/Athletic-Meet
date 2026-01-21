import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "./LoadingComponent";

/* -------------------- Icons -------------------- */
const ICONS = {
  trophy: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
    </svg>
  ),
  medal: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5l-3.5-3.5 1.41-1.41L11 13.67l4.59-4.58L17 10.5 11 16.5z" />
    </svg>
  ),
  ribbon: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm5.5 6c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM6.5 12c.83 0 1.5-.67 1.5-1.5S7.33 9 6.5 9 5 9.67 5 10.5 5.67 12 6.5 12zm11.21 2.21c-1.17 1.17-3.32 1.76-4.92.64L8 19.65 9.65 22 12 19.65l2.35 2.35L16 19.65l-4.79-4.79c-1.12 1.6-.53 3.75.64 4.92.78.78 1.81 1.17 2.85 1.17s2.07-.39 2.85-1.17c1.56-1.56 1.56-4.14 0-5.7-1.56-1.56-4.14-1.56-5.7 0z" />
    </svg>
  ),
  award: (
    <svg
      viewBox="0 0 24 24"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="5" />
      <path
        d="M12 13L8 21l4-2 4 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  ),
  certificate: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  ),
};

export default function CertificatesPage() {
  const { darkMode } = useTheme();
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [areCertificatesLocked, setAreCertificatesLocked] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data: response } = await axios.get(
          `${API_URL}/user/certificates`,
          { withCredentials: true },
        );

        if (response.success) {
          setAreCertificatesLocked(response.data.areCertificatesLocked);
          setCertificates(response.data.certificates || []);
        }
      } catch (err) {
        console.error("Failed to fetch certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, [API_URL]);

  const handleDownload = async (cert, type) => {
    const downloadId = `${cert.eventId}-${type}`;
    setDownloading(downloadId);

    try {
      // Call the certificate generation API
      const response = await fetch(
        `${API_URL}/certificate/download/${cert.eventId}/${type}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate certificate");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate_${cert.eventName.replace(/\s+/g, "_")}_${type}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download certificate:", err);
      alert(err.message || "Failed to download certificate");
    } finally {
      setDownloading(null);
    }
  };

  const getTypeColors = (type) => {
    if (type === "Track") {
      return {
        gradient: "from-orange-500 to-red-600",
        bg: darkMode ? "bg-orange-500/15" : "bg-orange-50",
        text: darkMode ? "text-orange-400" : "text-orange-600",
        ring: darkMode ? "ring-orange-500/30" : "ring-orange-200",
      };
    }
    if (type === "Field") {
      return {
        gradient: "from-emerald-500 to-green-600",
        bg: darkMode ? "bg-emerald-500/15" : "bg-emerald-50",
        text: darkMode ? "text-emerald-400" : "text-emerald-600",
        ring: darkMode ? "ring-emerald-500/30" : "ring-emerald-200",
      };
    }
    return {
      gradient: "from-blue-500 to-cyan-600",
      bg: darkMode ? "bg-blue-500/15" : "bg-blue-50",
      text: darkMode ? "text-blue-400" : "text-blue-600",
      ring: darkMode ? "ring-blue-500/30" : "ring-blue-200",
    };
  };

  if (loading) {
    return (
      <LoadingComponent
        darkMode={darkMode}
        title="Loading Certificates"
        message="Fetching your certificates..."
      />
    );
  }

  // When locked - show beautiful locked message
  if (areCertificatesLocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div
          className={`max-w-md w-full text-center p-8 sm:p-12 rounded-3xl ${
            darkMode
              ? "bg-linear-to-br from-slate-900 via-slate-800/80 to-slate-900 ring-2 ring-red-500/30 shadow-[0_0_100px_-20px_rgba(239,68,68,0.25)]"
              : "bg-linear-to-br from-white via-red-50/30 to-white ring-2 ring-red-200 shadow-xl"
          }`}
        >
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              darkMode
                ? "bg-linear-to-br from-red-500/20 to-rose-500/20 text-red-400"
                : "bg-linear-to-br from-red-100 to-rose-100 text-red-500"
            }`}
          >
            {ICONS.lock}
          </div>

          <h1
            className={`text-2xl sm:text-3xl font-black mb-3 ${
              darkMode
                ? "bg-linear-to-r from-red-400 to-rose-400 bg-clip-text text-transparent"
                : "text-red-600"
            }`}
          >
            Certificates Locked
          </h1>

          <p
            className={`text-sm sm:text-base mb-6 ${
              darkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Certificates are currently unavailable. They will be accessible once
            all events are completed and results are finalized.
          </p>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${
              darkMode
                ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                : "bg-red-100 text-red-600 ring-1 ring-red-200"
            }`}
          >
            <span className="text-lg">🔒</span>
            Please check back later
          </div>
        </div>
      </div>
    );
  }

  // No certificates
  if (certificates.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div
          className={`max-w-md w-full text-center p-8 sm:p-12 rounded-3xl ${
            darkMode
              ? "bg-linear-to-br from-slate-900 to-slate-800/80 ring-1 ring-white/10"
              : "bg-linear-to-br from-white to-slate-50 ring-1 ring-slate-200 shadow-lg"
          }`}
        >
          <div className="w-20 h-20 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="url(#emptyTrophyFill)"
              stroke="url(#emptyTrophyStroke)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
              filter="url(#emptyTrophyGlow)"
            >
              <defs>
                {/* Metallic Gold Fill Gradient */}
                <linearGradient
                  id="emptyTrophyFill"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="30%" stopColor="#FFD700" />
                  <stop offset="60%" stopColor="#E6A400" />
                  <stop offset="100%" stopColor="#C89100" />
                </linearGradient>
                {/* Gold Stroke Gradient */}
                <linearGradient
                  id="emptyTrophyStroke"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFF8D2" />
                  <stop offset="50%" stopColor="#FFCC33" />
                  <stop offset="100%" stopColor="#B57A00" />
                </linearGradient>
                {/* Soft Golden Glow */}
                <filter
                  id="emptyTrophyGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="0"
                    dy="1"
                    stdDeviation="2"
                    floodColor="#FFD700"
                    floodOpacity="0.5"
                  />
                </filter>
              </defs>
              {/* Trophy Shape */}
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <h2
            className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-slate-800"
            }`}
          >
            No Certificates Yet
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Participate in events to earn certificates
          </p>
        </div>
      </div>
    );
  }

  // Separate winners and participation
  const winnerCerts = certificates.filter(
    (c) => c.position === 1 || c.position === 2 || c.position === 3,
  );
  const participationCerts = certificates;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 lg:p-6 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(234,179,8,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-amber-50/30 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 bg-amber-500" />
            <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full blur-3xl opacity-20 bg-orange-600" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-amber-500 to-orange-600"
                  : "bg-slate-900"
              }`}
            >
              {ICONS.certificate}
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                Your Certificates
              </h1>
              <p
                className={`text-[11px] sm:text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Download your achievement certificates
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`flex items-center gap-4 px-4 py-2.5 rounded-xl ${
              darkMode
                ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                : "bg-amber-50 ring-1 ring-amber-200"
            }`}
          >
            <div className="text-center">
              <span
                className={`text-xl font-black ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {certificates.length}
              </span>
              <p
                className={`text-[9px] font-bold uppercase ${
                  darkMode ? "text-amber-400/70" : "text-amber-600"
                }`}
              >
                Total
              </p>
            </div>
            {winnerCerts.length > 0 && (
              <div className="text-center">
                <span
                  className={`text-xl font-black ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  {winnerCerts.length}
                </span>
                <p
                  className={`text-[9px] font-bold uppercase ${
                    darkMode ? "text-yellow-400/70" : "text-yellow-600"
                  }`}
                >
                  Winners
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Winner Certificates Section */}
      {winnerCerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                darkMode
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {ICONS.trophy}
            </div>
            <h2
              className={`font-bold ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              Winner Certificates
            </h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                darkMode
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {winnerCerts.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {winnerCerts.map((cert) => {
              const colors = getTypeColors(cert.eventType);
              const positions = { 1: "1st", 2: "2nd", 3: "3rd" };

              return (
                <div
                  key={`winner-${cert.eventId}`}
                  className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02] ${
                    darkMode
                      ? "bg-linear-to-br from-yellow-950/60 via-amber-950/40 to-orange-950/30 ring-2 ring-yellow-500/40 shadow-xl shadow-yellow-500/10"
                      : "bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50 ring-2 ring-yellow-300 shadow-xl shadow-yellow-400/20"
                  }`}
                >
                  {darkMode && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl bg-yellow-500/20 pointer-events-none" />
                  )}

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          darkMode
                            ? "bg-linear-to-br from-yellow-500/30 to-amber-600/30 text-yellow-400 ring-2 ring-yellow-500/40"
                            : "bg-linear-to-br from-yellow-400 to-amber-500 text-white ring-2 ring-yellow-500/50 shadow-lg shadow-yellow-400/30"
                        }`}
                      >
                        <div className="w-8 h-8">{ICONS.trophy}</div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                          darkMode
                            ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40"
                            : "bg-yellow-200 text-yellow-900 ring-1 ring-yellow-300"
                        }`}
                      >
                        {positions[cert.position]} Place
                      </span>
                    </div>

                    <h3
                      className={`font-bold text-lg mb-1 ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {cert.eventName}
                    </h3>

                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold uppercase ${colors.bg} ${colors.text}`}
                    >
                      {cert.eventType}
                    </span>

                    <button
                      onClick={() => handleDownload(cert, "winner")}
                      disabled={downloading === `${cert.eventId}-winner`}
                      className={`mt-4 w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[40px] ${
                        darkMode
                          ? "bg-linear-to-r from-yellow-500 to-amber-600 text-black hover:brightness-110 shadow-lg shadow-yellow-500/30"
                          : "bg-linear-to-r from-yellow-400 to-amber-500 text-black hover:brightness-110 shadow-lg shadow-yellow-500/40"
                      } disabled:opacity-50`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center shrink-0">
                        {downloading === `${cert.eventId}-winner` ? (
                          <span className="animate-spin h-4 w-4 border-2 border-black/30 rounded-full border-t-black" />
                        ) : (
                          ICONS.download
                        )}
                      </span>
                      <span className="whitespace-nowrap">
                        Download Certificate
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Participation Certificates Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            {ICONS.medal}
          </div>
          <h2
            className={`font-bold ${darkMode ? "text-white" : "text-slate-800"}`}
          >
            Participation Certificates
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              darkMode
                ? "bg-indigo-500/20 text-indigo-400"
                : "bg-indigo-100 text-indigo-600"
            }`}
          >
            {participationCerts.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participationCerts.map((cert) => {
            const colors = getTypeColors(cert.eventType);

            return (
              <div
                key={`participation-${cert.eventId}`}
                className={`relative overflow-hidden rounded-xl p-4 transition-all hover:scale-[1.02] ${
                  darkMode
                    ? `bg-slate-900/80 ring-1 ${colors.ring} shadow-lg`
                    : `bg-white ring-1 ring-slate-200 shadow-lg`
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      darkMode
                        ? `bg-linear-to-br ${colors.gradient}`
                        : "bg-linear-to-br from-slate-800 via-slate-700 to-slate-900"
                    }`}
                  >
                    <div className="w-7 h-7 text-white">{ICONS.award}</div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
                  >
                    {cert.eventType}
                  </span>
                </div>

                <h3
                  className={`font-bold text-sm mb-0.5 ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {cert.eventName}
                </h3>
                <p
                  className={`text-[11px] mb-3 ${
                    darkMode ? "text-slate-500" : "text-slate-500"
                  }`}
                >
                  {cert.eventDay}
                </p>

                <button
                  onClick={() => handleDownload(cert, "participation")}
                  disabled={downloading === `${cert.eventId}-participation`}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all min-h-[36px] shadow-md ${
                    darkMode
                      ? `bg-linear-to-r ${colors.gradient} text-white hover:brightness-110`
                      : "bg-linear-to-r from-slate-800 via-slate-700 to-slate-900 text-white hover:brightness-110 shadow-lg shadow-slate-400/30"
                  } disabled:opacity-50`}
                >
                  <span className="w-4 h-4 flex items-center justify-center shrink-0">
                    {downloading === `${cert.eventId}-participation` ? (
                      <span className="animate-spin h-3 w-3 border-2 border-white/30 rounded-full border-t-white" />
                    ) : (
                      ICONS.download
                    )}
                  </span>
                  <span className="whitespace-nowrap">Download</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
