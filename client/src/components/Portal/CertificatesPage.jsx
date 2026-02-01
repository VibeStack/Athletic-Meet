import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
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
  eye: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  ),
};

export default function CertificatesPage() {
  const { darkMode } = useTheme();
  const { isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [areCertificatesLocked, setAreCertificatesLocked] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
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
      const response = await axios.get(
        `${API_URL}/certificate/download/${cert.eventId}/${type}`,
        {
          withCredentials: true,
          responseType: "blob", // 👈 IMPORTANT for PDFs
        },
      );

      // Create blob URL
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create download link
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

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to download certificate";

      alert(message);
    } finally {
      setDownloading(null);
    }
  };

  const handlePreview = async (cert, type, theme = null) => {
    const previewId = `${cert.eventId}-${type}`;
    setPreviewLoading(previewId);
    setActiveCert({ ...cert, type, theme });

    try {
      const response = await axios.get(
        `${API_URL}/manager/certificate/preview/${cert.eventId}/${type}`,
        {
          withCredentials: true,
          responseType: "blob", // Important for PDF blob
        },
      );

      const url = URL.createObjectURL(response.data);
      setPreviewUrl(url);
    } catch (err) {
      console.error("Failed to generate preview:", err);
      const message =
        err?.response?.data?.message || "Failed to generate preview";
      alert(message);
    } finally {
      setPreviewLoading(null);
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setActiveCert(null);
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

  // Vibrant color palette for participation certificates
  const getCardColors = (index) => {
    const colorPalettes = [
      // Red
      {
        cardBg: darkMode
          ? "bg-gradient-to-br from-red-950/80 via-rose-950/60 to-red-900/40"
          : "bg-gradient-to-br from-red-50 via-rose-50 to-red-100",
        cardRing: darkMode ? "ring-red-500/50" : "ring-red-300",
        iconBg: darkMode
          ? "bg-gradient-to-br from-red-500 to-rose-600"
          : "bg-gradient-to-br from-red-500 to-rose-600",
        buttonBg: darkMode
          ? "bg-gradient-to-r from-red-500 to-rose-600"
          : "bg-gradient-to-r from-red-500 to-rose-600",
        shadow: darkMode ? "shadow-red-500/20" : "shadow-red-400/30",
        accent: darkMode ? "text-red-400" : "text-red-600",
        glowColor: "#f87171",
      },
      // Green
      {
        cardBg: darkMode
          ? "bg-gradient-to-br from-green-950/80 via-emerald-950/60 to-green-900/40"
          : "bg-gradient-to-br from-green-50 via-emerald-50 to-green-100",
        cardRing: darkMode ? "ring-green-500/50" : "ring-green-400",
        iconBg: darkMode
          ? "bg-gradient-to-br from-green-500 to-emerald-600"
          : "bg-gradient-to-br from-green-500 to-emerald-600",
        buttonBg: darkMode
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gradient-to-r from-green-500 to-emerald-600",
        shadow: darkMode ? "shadow-green-500/20" : "shadow-green-400/30",
        accent: darkMode ? "text-green-400" : "text-green-600",
        glowColor: "#4ade80",
      },
      // Blue
      {
        cardBg: darkMode
          ? "bg-gradient-to-br from-blue-950/80 via-indigo-950/60 to-blue-900/40"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100",
        cardRing: darkMode ? "ring-blue-500/50" : "ring-blue-400",
        iconBg: darkMode
          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
          : "bg-gradient-to-br from-blue-500 to-indigo-600",
        buttonBg: darkMode
          ? "bg-gradient-to-r from-blue-500 to-indigo-600"
          : "bg-gradient-to-r from-blue-500 to-indigo-600",
        shadow: darkMode ? "shadow-blue-500/20" : "shadow-blue-400/30",
        accent: darkMode ? "text-blue-400" : "text-blue-600",
        glowColor: "#60a5fa",
      },
      // Pink
      {
        cardBg: darkMode
          ? "bg-gradient-to-br from-pink-950/80 via-rose-950/60 to-pink-900/40"
          : "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100",
        cardRing: darkMode ? "ring-pink-500/50" : "ring-pink-400",
        iconBg: darkMode
          ? "bg-gradient-to-br from-pink-500 to-rose-600"
          : "bg-gradient-to-br from-pink-500 to-rose-600",
        buttonBg: darkMode
          ? "bg-gradient-to-r from-pink-500 to-rose-600"
          : "bg-gradient-to-r from-pink-500 to-rose-600",
        shadow: darkMode ? "shadow-pink-500/20" : "shadow-pink-400/30",
        accent: darkMode ? "text-pink-400" : "text-pink-600",
        glowColor: "#f472b6",
      },
      // Purple
      {
        cardBg: darkMode
          ? "bg-gradient-to-br from-purple-950/80 via-violet-950/60 to-purple-900/40"
          : "bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100",
        cardRing: darkMode ? "ring-purple-500/50" : "ring-purple-400",
        iconBg: darkMode
          ? "bg-gradient-to-br from-purple-500 to-violet-600"
          : "bg-gradient-to-br from-purple-500 to-violet-600",
        buttonBg: darkMode
          ? "bg-gradient-to-r from-purple-500 to-violet-600"
          : "bg-gradient-to-r from-purple-500 to-violet-600",
        shadow: darkMode ? "shadow-purple-500/20" : "shadow-purple-400/30",
        accent: darkMode ? "text-purple-400" : "text-purple-600",
        glowColor: "#a855f7",
      },
    ];
    return colorPalettes[index % colorPalettes.length];
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
          className={`max-w-lg w-full text-center p-8 sm:p-12 rounded-3xl relative overflow-hidden ${
            darkMode
              ? "bg-linear-to-br from-slate-900 via-slate-800/80 to-slate-900 ring-1 ring-white/10 shadow-2xl"
              : "bg-linear-to-br from-white via-slate-50 to-white ring-1 ring-slate-200 shadow-xl"
          }`}
        >
          {/* Decorative background glow */}
          {darkMode && (
            <>
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 bg-amber-500 pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-56 h-56 rounded-full blur-3xl opacity-15 bg-yellow-600 pointer-events-none" />
            </>
          )}

          {/* Trophy Icon */}
          <div className="relative mb-6">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-2xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-6 ${
                darkMode
                  ? "bg-linear-to-br from-amber-500/20 to-yellow-500/10 ring-2 ring-amber-500/30"
                  : "bg-linear-to-br from-amber-100 to-yellow-100 ring-2 ring-amber-300 shadow-lg"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-14 h-14 sm:w-16 sm:h-16 transition-colors duration-300 ${
                  darkMode ? "text-amber-400" : "text-amber-500"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Trophy Cup */}
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>

              {/* Sparkle effects */}
              <div className="absolute -top-1 -right-1">
                <svg
                  className={`w-5 h-5 ${darkMode ? "text-yellow-400" : "text-amber-400"} animate-pulse`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -left-1">
                <svg
                  className={`w-4 h-4 ${darkMode ? "text-amber-500" : "text-yellow-500"} animate-pulse delay-75`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ animationDelay: "0.3s" }}
                >
                  <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            <h2
              className={`text-2xl sm:text-3xl font-black mb-3 ${
                darkMode
                  ? "bg-linear-to-r from-amber-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent"
                  : "text-slate-800"
              }`}
            >
              No Certificates Yet
            </h2>
            <p
              className={`text-sm sm:text-base mb-6 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Your certificates will appear here once you participate in events
              and achieve excellent results
            </p>

            {/* Info Box */}
            <div
              className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl ${
                darkMode
                  ? "bg-amber-500/10 ring-1 ring-amber-500/30"
                  : "bg-amber-50 ring-1 ring-amber-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  darkMode
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="text-left">
                <p
                  className={`text-xs font-bold ${
                    darkMode ? "text-amber-400" : "text-amber-700"
                  }`}
                >
                  Ready to earn certificates?
                </p>
                <p
                  className={`text-[10px] ${
                    darkMode ? "text-amber-500/70" : "text-amber-600/80"
                  }`}
                >
                  Participate in events to get started
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Separate winners and participation
  const winnerCerts = certificates.filter(
    (c) => c.position === 1 || c.position === 2 || c.position === 3,
  );
  const participationCerts = certificates.filter((c) => c.position === 0);

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
            className={`flex justify-center items-center gap-6 px-5 py-3 rounded-2xl ${
              darkMode
                ? "bg-linear-to-r from-amber-500/15 via-yellow-500/10 to-orange-500/15 ring-1 ring-amber-500/30"
                : "bg-linear-to-r from-amber-100 via-yellow-50 to-orange-100 ring-1 ring-amber-300 shadow-lg"
            }`}
          >
            {winnerCerts.length > 0 && (
              <>
                <div className="text-center px-2">
                  <span
                    className={`text-2xl sm:text-3xl font-black ${
                      darkMode ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  >
                    {winnerCerts.length}
                  </span>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      darkMode ? "text-yellow-400/80" : "text-yellow-700"
                    }`}
                  >
                    Winners
                  </p>
                </div>
                <div
                  className={`w-px h-10 ${darkMode ? "bg-amber-500/30" : "bg-amber-300"}`}
                />
              </>
            )}
            <div className="text-center px-2">
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  darkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {certificates.length}
              </span>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  darkMode ? "text-amber-400/80" : "text-amber-700"
                }`}
              >
                Total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Certificates Section */}
      {winnerCerts.length > 0 && (
        <div>
          <div
            className={`flex items-center justify-between mb-4 p-3 rounded-xl ${
              darkMode
                ? "bg-linear-to-r from-yellow-950/60 via-amber-950/40 to-orange-950/30 ring-1 ring-yellow-500/30"
                : "bg-linear-to-r from-yellow-50 via-amber-50 to-orange-50 ring-1 ring-yellow-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-linear-to-br from-yellow-500 to-amber-600"
                    : "bg-linear-to-br from-yellow-500 to-amber-600"
                }`}
              >
                <div className="w-6 h-6 text-white">{ICONS.trophy}</div>
              </div>
              <h2
                className={`text-lg font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent"
                    : "text-yellow-700"
                }`}
              >
                Winner Certificates
              </h2>
            </div>
            <span
              className={`text-sm px-3 py-1.5 rounded-xl font-bold ${
                darkMode
                  ? "bg-yellow-500/30 text-yellow-300 ring-1 ring-yellow-500/40"
                  : "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300"
              }`}
            >
              {winnerCerts.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {winnerCerts.map((cert) => {
              const colors = getTypeColors(cert.eventType);
              const positions = { 1: "1st", 2: "2nd", 3: "3rd" };

              // Premium position-based colors
              const positionColors = {
                1: {
                  // Gold
                  cardBg: darkMode
                    ? "bg-gradient-to-br from-yellow-900/90 via-amber-950/80 to-orange-950/70"
                    : "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100",
                  cardRing: darkMode ? "ring-yellow-500/60" : "ring-yellow-400",
                  iconBg: darkMode
                    ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600"
                    : "bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600",
                  badgeBg: darkMode
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                    : "bg-gradient-to-r from-yellow-500 to-amber-500",
                  buttonBg: darkMode
                    ? "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600"
                    : "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600",
                  glowColor: "#fbbf24",
                  shadow: "shadow-yellow-500/40",
                  textColor: "text-yellow-400",
                  badgeText: "text-black",
                },
                2: {
                  // Silver
                  cardBg: darkMode
                    ? "bg-gradient-to-br from-slate-800/90 via-gray-900/80 to-zinc-900/70"
                    : "bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100",
                  cardRing: darkMode ? "ring-slate-400/60" : "ring-slate-400",
                  iconBg: darkMode
                    ? "bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500"
                    : "bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500",
                  badgeBg: darkMode
                    ? "bg-gradient-to-r from-slate-400 to-gray-500"
                    : "bg-gradient-to-r from-slate-400 to-gray-500",
                  buttonBg: darkMode
                    ? "bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600"
                    : "bg-gradient-to-r from-slate-400 via-gray-500 to-slate-600",
                  glowColor: "#94a3b8",
                  shadow: "shadow-slate-400/40",
                  textColor: "text-slate-300",
                  badgeText: "text-black",
                },
                3: {
                  // Bronze
                  cardBg: darkMode
                    ? "bg-gradient-to-br from-orange-900/90 via-amber-950/80 to-yellow-950/70"
                    : "bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100",
                  cardRing: darkMode ? "ring-orange-500/60" : "ring-orange-400",
                  iconBg: darkMode
                    ? "bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700"
                    : "bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700",
                  badgeBg: darkMode
                    ? "bg-gradient-to-r from-orange-500 to-amber-600"
                    : "bg-gradient-to-r from-orange-500 to-amber-600",
                  buttonBg: darkMode
                    ? "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700"
                    : "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700",
                  glowColor: "#f97316",
                  shadow: "shadow-orange-500/40",
                  textColor: "text-orange-400",
                  badgeText: "text-black",
                },
              };

              const pColors =
                positionColors[cert.position] || positionColors[1];

              return (
                <div
                  key={`winner-${cert.eventId}`}
                  className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${pColors.cardBg} ring-2 ${pColors.cardRing} shadow-2xl ${pColors.shadow}`}
                >
                  {/* Premium glow effects */}
                  {darkMode && (
                    <>
                      <div
                        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-40 pointer-events-none"
                        style={{ backgroundColor: pColors.glowColor }}
                      />
                      <div
                        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
                        style={{ backgroundColor: pColors.glowColor }}
                      />
                    </>
                  )}

                  {/* Shimmer overlay */}
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      darkMode
                        ? "bg-linear-to-r from-transparent via-white/5 to-transparent"
                        : "bg-linear-to-r from-transparent via-white/40 to-transparent"
                    }`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${pColors.iconBg}`}
                      >
                        <div className="w-9 h-9 text-white drop-shadow-lg">
                          {ICONS.trophy}
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide shadow-lg ${pColors.badgeBg} ${pColors.badgeText}`}
                      >
                        {positions[cert.position]} Place
                      </span>
                    </div>

                    <h3
                      className={`font-black text-xl mb-2 ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {cert.eventName}
                    </h3>

                    <span
                      className={`inline-block text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
                    >
                      {cert.eventType}
                    </span>

                    <div className="mt-5 flex gap-3">
                      {isManager && (
                        <button
                          onClick={() => handlePreview(cert, "winner", pColors)}
                          disabled={previewLoading === `${cert.eventId}-winner`}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[48px] ${
                            darkMode
                              ? "bg-slate-800 text-white hover:bg-slate-700"
                              : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                          } disabled:opacity-50`}
                        >
                          <span className="w-5 h-5 flex items-center justify-center shrink-0">
                            {previewLoading === `${cert.eventId}-winner` ? (
                              <span
                                className={`animate-spin h-4 w-4 border-2 rounded-full ${darkMode ? "border-white/30 border-t-white" : "border-slate-800/30 border-t-slate-800"}`}
                              />
                            ) : (
                              ICONS.eye
                            )}
                          </span>
                          <span>Preview</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDownload(cert, "winner")}
                        disabled={downloading === `${cert.eventId}-winner`}
                        className={`flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all min-h-[48px] shadow-xl ${pColors.buttonBg} ${darkMode ? "text-white" : "text-black"} hover:brightness-110 hover:shadow-2xl disabled:opacity-50`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">
                          {downloading === `${cert.eventId}-winner` ? (
                            <span
                              className={`animate-spin h-4 w-4 border-2 rounded-full ${darkMode ? "border-white/30 border-t-white" : "border-black/30 border-t-black"}`}
                            />
                          ) : (
                            ICONS.download
                          )}
                        </span>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Participation Certificates Section */}
      <div>
        <div
          className={`flex items-center justify-between mb-4 p-3 rounded-xl ${
            darkMode
              ? "bg-linear-to-r from-indigo-950/60 via-purple-950/40 to-fuchsia-950/30 ring-1 ring-indigo-500/30"
              : "bg-linear-to-r from-indigo-50 via-purple-50 to-fuchsia-50 ring-1 ring-indigo-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                darkMode
                  ? "bg-linear-to-br from-indigo-500 to-purple-600"
                  : "bg-linear-to-br from-indigo-500 to-purple-600"
              }`}
            >
              <div className="w-6 h-6 text-white">{ICONS.medal}</div>
            </div>
            <h2
              className={`text-lg font-black tracking-tight ${
                darkMode
                  ? "bg-linear-to-r from-indigo-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent"
                  : "text-indigo-700"
              }`}
            >
              Participation Certificates
            </h2>
          </div>
          <span
            className={`text-sm px-3 py-1.5 rounded-xl font-bold ${
              darkMode
                ? "bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/40"
                : "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
            }`}
          >
            {participationCerts.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participationCerts.map((cert, index) => {
            const colors = getTypeColors(cert.eventType);
            const cardColors = getCardColors(index);

            return (
              <div
                key={`participation-${cert.eventId}`}
                className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${cardColors.cardBg} ring-2 ${cardColors.cardRing} shadow-xl ${cardColors.shadow}`}
              >
                {/* Decorative glow */}
                {darkMode && (
                  <div
                    className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: cardColors.glowColor }}
                  />
                )}

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${cardColors.iconBg}`}
                    >
                      <div className="w-8 h-8 text-white">{ICONS.award}</div>
                    </div>
                    <span
                      className={`text-[11px] px-3 py-1.5 rounded-xl font-bold uppercase ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}
                    >
                      {cert.eventType}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-base mb-1 ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {cert.eventName}
                  </h3>
                  <p
                    className={`text-xs mb-4 ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {cert.eventDay === "Both" ? "Day 1 & 2" : cert.eventDay}
                  </p>

                  <div className="mt-5 flex gap-3">
                    {isManager && (
                      <button
                        onClick={() =>
                          handlePreview(cert, "participation", cardColors)
                        }
                        disabled={
                          previewLoading === `${cert.eventId}-participation`
                        }
                        className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                          darkMode
                            ? "bg-slate-800 text-white hover:bg-slate-700"
                            : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        } disabled:opacity-50`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center shrink-0">
                          {previewLoading ===
                          `${cert.eventId}-participation` ? (
                            <span
                              className={`animate-spin h-4 w-4 border-2 rounded-full ${darkMode ? "border-white/30 border-t-white" : "border-slate-800/30 border-t-slate-800"}`}
                            />
                          ) : (
                            ICONS.eye
                          )}
                        </span>
                        <span>Preview</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDownload(cert, "participation")}
                      disabled={downloading === `${cert.eventId}-participation`}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-lg ${cardColors.buttonBg} ${darkMode ? "text-white" : "text-black"} hover:brightness-110 hover:shadow-xl disabled:opacity-50`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center shrink-0">
                        {downloading === `${cert.eventId}-participation` ? (
                          <span
                            className={`animate-spin h-4 w-4 border-2 rounded-full ${darkMode ? "border-white/30 border-t-white" : "border-black/30 border-t-black"}`}
                          />
                        ) : (
                          ICONS.download
                        )}
                      </span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={closePreview}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 ${
              darkMode
                ? `${activeCert?.theme?.cardBg || "bg-slate-900"} ring-2 ${activeCert?.theme?.cardRing || "ring-white/10"}`
                : `${activeCert?.theme?.cardBg || "bg-white"} ring-2 ${activeCert?.theme?.cardRing || "ring-slate-200"}`
            }`}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                darkMode ? "border-white/5" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    activeCert?.theme?.iconBg ||
                    (darkMode
                      ? "bg-slate-800 text-emerald-400"
                      : "bg-slate-100 text-emerald-600")
                  }`}
                >
                  <div className="w-6 h-6 text-white drop-shadow-md">
                    {activeCert?.type === "winner" ? ICONS.trophy : ICONS.award}
                  </div>
                </div>
                <div>
                  <h3
                    className={`font-black text-base sm:text-lg ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {activeCert?.eventName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                        activeCert?.theme?.textColor || "text-slate-500"
                      }`}
                    >
                      {activeCert?.type === "winner"
                        ? `${activeCert?.position === 1 ? "1st" : activeCert?.position === 2 ? "2nd" : "3rd"} Place Winner`
                        : "Participation Certificate"}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-slate-500 opacity-50" />
                    <p className="text-[10px] sm:text-xs font-medium text-slate-500">
                      Preview
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeCert, activeCert.type)}
                  disabled={
                    downloading === `${activeCert?.eventId}-${activeCert?.type}`
                  }
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg hover:scale-105 active:scale-95 ${
                    activeCert?.theme?.buttonBg ||
                    (darkMode
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-slate-900 text-white hover:bg-slate-800")
                  } disabled:opacity-50`}
                >
                  <div className="w-4 h-4">
                    {downloading ===
                    `${activeCert?.eventId}-${activeCert?.type}` ? (
                      <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full block" />
                    ) : (
                      ICONS.download
                    )}
                  </div>
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  onClick={closePreview}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    darkMode
                      ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                      : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  <div className="w-5 h-5">{ICONS.close}</div>
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div
              className={`p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto relative ${
                darkMode ? "bg-slate-950/40" : "bg-slate-50"
              }`}
            >
              {/* Premium glow effects matching active theme */}
              {darkMode && activeCert?.theme?.glowColor && (
                <>
                  <div
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: activeCert.theme.glowColor }}
                  />
                  <div
                    className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-[100px] opacity-15 pointer-events-none"
                    style={{ backgroundColor: activeCert.theme.glowColor }}
                  />
                </>
              )}

              <div
                className={`relative group max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl ring-4 ${activeCert?.theme?.cardRing || "ring-black/10"} transition-transform duration-500 hover:scale-[1.005] bg-white`}
              >
                {/* Certificate PDF Embed */}
                <embed
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  className="w-full aspect-[1.414/1] min-h-[400px] sm:min-h-[500px]"
                />

                {/* Info Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <p className="text-white text-[10px] text-center font-bold tracking-wide uppercase">
                    High-Fidelity PDF Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
