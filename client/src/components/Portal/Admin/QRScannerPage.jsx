import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useTheme } from "../../../context/ThemeContext";
import LoadingComponent from "../LoadingComponent";
import { toast } from "react-toastify";

/* -------------------- SVG Icons -------------------- */
const ICONS = {
  qrCode: (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13 2h-2v2h2v2h2v-4h2v-2h-4v2zm0-2V9h-2v2h2zm2 6h2v2h-2v-2zm-4 0h2v2h-2v-2z" />
    </svg>
  ),
  camera: (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  stop: (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg
      viewBox="0 0 24 24"
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  refresh: (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  // Custom Boys icon (male figure)
  boys: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <circle cx="12" cy="4" r="2.5" />
      <path d="M15.5 22v-7.5H17V9c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v5.5h1.5V22h6z" />
    </svg>
  ),
  // Custom Girls icon (female figure)
  girls: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <circle cx="12" cy="4" r="2.5" />
      <path d="M14.5 12.5l1.5-4C16.2 8 16 7.5 15.5 7H8.5c-.5.5-.7 1-.5 1.5l1.5 4H9v2h1.5v3H9v1.5h6V16.5h-1.5v-3H15v-2h-.5z" />
    </svg>
  ),
  present: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  absent: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  notMarked: (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
};

export default function QRScannerPage() {
  const { darkMode } = useTheme();
  const [allEvents, setAllEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef(null);
  const scanLockRef = useRef(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch ALL events from backend
  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user/events`, {
        withCredentials: true,
      });
      setAllEvents(data.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [API_URL]);

  // Check camera permission
  useEffect(() => {
    navigator.permissions
      ?.query({ name: "camera" })
      .then((result) => {
        setCameraPermission(result.state);
        result.onchange = () => setCameraPermission(result.state);
      })
      .catch(() => {});

    return () => stopScanning();
  }, []);

  // Filter events by selected category
  const filteredEvents = selectedCategory
    ? allEvents.filter((e) => e.category === selectedCategory)
    : [];

  // Group filtered events by type
  const trackEvents = filteredEvents.filter((e) => e.type === "Track");
  const fieldEvents = filteredEvents.filter((e) => e.type === "Field");
  const teamEvents = filteredEvents.filter((e) => e.type === "Team");

  const selectedEventData = allEvents.find((e) => e.id === selectedEvent);

  // Reset event when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedEvent("");
    setScanResult(null);
    stopScanning();
  };

  const startScanning = async () => {
    if (!selectedEvent) {
      toast.warning("Please select an event first");
      return;
    }

    try {
      setScanResult(null);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const isPortrait = viewfinderHeight > viewfinderWidth;

            if (isPortrait) {
              const size = Math.floor(viewfinderWidth * 1);
              return { width: size, height: size };
            }

            const size = Math.floor(
              Math.min(viewfinderWidth, viewfinderHeight) * 0.9,
            );
            return { width: size, height: size };
          },
        },
        onScanSuccess,
        () => {},
      );

      setScanning(true);
      setCameraPermission("granted");
    } catch (err) {
      console.error("Failed to start scanner:", err);
      if (err.toString().includes("Permission")) {
        setCameraPermission("denied");
      }
    }
  };

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setScanning(false);
  }, []);

  const onScanSuccess = async (decodedText) => {
    if (scanLockRef.current) return;
    scanLockRef.current = true;

    setProcessing(true);

    let parsedData;

    try {
      parsedData = JSON.parse(decodedText);

      if (!parsedData.jerseyNumber || !parsedData.id) {
        throw new Error("Invalid QR code format");
      }

      await axios.post(
        `${API_URL}/admin/user/event/qrAttendance`,
        {
          recognitionId: parsedData.id,
          jerseyNumber: parsedData.jerseyNumber,
          eventId: selectedEvent,
        },
        { withCredentials: true },
      );

      /* ---------- SUCCESS ---------- */
      toast.success(`#${parsedData.jerseyNumber} Marked Present!`, {
        position: "bottom-right",
      });

      setScanResult({
        success: true,
        jerseyNumber: parsedData.jerseyNumber,
        name: parsedData.name || "Student",
        message: "Attendance marked!",
        alreadyPresent: false,
      });

      fetchEvents();
      playSound("success");
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Failed to process QR code";

      if (status === 400 && message === "Attendance already marked") {
        toast.info(`#${parsedData?.jerseyNumber} Already Present`, {
          position: "bottom-right",
        });

        setScanResult({
          success: true,
          jerseyNumber: parsedData?.jerseyNumber,
          name: parsedData?.name || "Student",
          message: "Already marked present",
          alreadyPresent: true,
        });

        playSound("success");
      } else {
        toast.error(message, { position: "bottom-right" });

        setScanResult({
          success: false,
          jerseyNumber: parsedData?.jerseyNumber,
          message,
        });

        playSound("error");
      }
    } finally {
      setProcessing(false);

      setTimeout(() => {
        scanLockRef.current = false;
        setScanResult(null);
      }, 1200);
    }
  };

  const playSound = (type) => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = type === "success" ? 800 : 300;
      oscillator.type = "sine";
      gainNode.gain.value = 0.3;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 150);
    } catch (e) {}
  };

  if (loading) {
    return (
      <LoadingComponent
        title="Loading Scanner"
        message="Fetching events..."
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 ${
          darkMode
            ? "bg-linear-to-br from-[#0c1929] via-[#0f172a] to-[#0c1525] ring-1 ring-white/8 shadow-[0_0_80px_-20px_rgba(6,182,212,0.25)]"
            : "bg-linear-to-br from-slate-50 via-white to-cyan-50/30 ring-1 ring-slate-200 shadow-lg"
        }`}
      >
        {darkMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 bg-cyan-500" />
          </div>
        )}

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white ${
                darkMode
                  ? "bg-linear-to-br from-cyan-500 to-blue-600"
                  : "bg-slate-800"
              }`}
            >
              {ICONS.qrCode}
            </div>
            <div>
              <h1
                className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight ${
                  darkMode
                    ? "bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                    : "text-slate-800"
                }`}
              >
                QR Scanner
              </h1>
              <p
                className={`text-[11px] sm:text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-500"
                }`}
              >
                Scan student QR codes to mark attendance
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
              selectedEvent
                ? darkMode
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : darkMode
                  ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                selectedEvent ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            ></span>
            {selectedEvent
              ? `Ready: ${selectedEventData?.name}`
              : "Select category & event"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-900/80 border border-white/10"
            : "bg-white border border-slate-200 shadow-lg"
        }`}
      >
        {/* Selection Header */}
        <div
          className={`px-4 sm:px-5 py-4 border-b ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Category Selection */}
            <div>
              <label
                className={`block text-xs font-bold mb-3 uppercase tracking-wide ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                1. Select Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCategoryChange("Boys")}
                  className={`p-3 sm:p-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCategory === "Boys"
                      ? "bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                      : darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 ring-1 ring-white/10"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200"
                  }`}
                >
                  <span
                    className={
                      selectedCategory === "Boys"
                        ? "text-white"
                        : darkMode
                          ? "text-sky-400"
                          : "text-sky-600"
                    }
                  >
                    {ICONS.boys}
                  </span>
                  Boys
                </button>
                <button
                  onClick={() => handleCategoryChange("Girls")}
                  className={`p-3 sm:p-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCategory === "Girls"
                      ? "bg-linear-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25"
                      : darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 ring-1 ring-white/10"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200"
                  }`}
                >
                  <span
                    className={
                      selectedCategory === "Girls"
                        ? "text-white"
                        : darkMode
                          ? "text-pink-400"
                          : "text-pink-600"
                    }
                  >
                    {ICONS.girls}
                  </span>
                  Girls
                </button>
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label
                className={`block text-xs font-bold mb-3 uppercase tracking-wide ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                2. Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  setScanResult(null);
                  stopScanning();
                }}
                disabled={!selectedCategory}
                className={`w-full px-4 py-3 sm:py-4 rounded-xl font-medium transition-all appearance-none cursor-pointer ${
                  darkMode
                    ? "bg-slate-800 ring-1 ring-white/10 text-white focus:ring-cyan-500"
                    : "bg-slate-50 ring-1 ring-slate-200 text-slate-900 focus:ring-cyan-500"
                } focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {selectedCategory
                    ? "-- Select Event --"
                    : "-- Select Category First --"}
                </option>

                {trackEvents.length > 0 && (
                  <optgroup label="🏃 Track Events">
                    {trackEvents.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {fieldEvents.length > 0 && (
                  <optgroup label="🎯 Field Events">
                    {fieldEvents.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </optgroup>
                )}

                {teamEvents.length > 0 && (
                  <optgroup label="👥 Team Events">
                    {teamEvents.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Stats Panel - Show when event is selected */}
        {selectedEventData && (
          <div
            className={`px-4 sm:px-5 py-4 border-b ${
              darkMode ? "border-white/5" : "border-slate-100"
            }`}
          >
            <div
              className={`rounded-xl p-4 ${
                selectedCategory === "Girls"
                  ? darkMode
                    ? "bg-pink-500/10 ring-1 ring-pink-500/20"
                    : "bg-pink-50 ring-1 ring-pink-200"
                  : darkMode
                    ? "bg-sky-500/10 ring-1 ring-sky-500/20"
                    : "bg-sky-50 ring-1 ring-sky-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div>
                  <p
                    className={`font-bold text-sm ${
                      selectedCategory === "Girls"
                        ? darkMode
                          ? "text-pink-200"
                          : "text-pink-900"
                        : darkMode
                          ? "text-sky-200"
                          : "text-sky-900"
                    }`}
                  >
                    {selectedEventData.name}
                  </p>
                  <p
                    className={`text-xs ${
                      selectedCategory === "Girls"
                        ? darkMode
                          ? "text-pink-400/70"
                          : "text-pink-700"
                        : darkMode
                          ? "text-sky-400/70"
                          : "text-sky-700"
                    }`}
                  >
                    {selectedEventData.type} • {selectedEventData.category} •{" "}
                    {selectedEventData.day}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* Present */}
                <div
                  className={`rounded-lg p-3 text-center ${
                    darkMode
                      ? "bg-emerald-500/15 ring-1 ring-emerald-500/30"
                      : "bg-emerald-50 ring-1 ring-emerald-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center ${
                      darkMode
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {ICONS.present}
                  </div>
                  <p
                    className={`text-xl font-black ${
                      darkMode ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    {selectedEventData.studentsCount?.present || 0}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase ${
                      darkMode ? "text-emerald-400/70" : "text-emerald-600"
                    }`}
                  >
                    Present
                  </p>
                </div>

                {/* Absent */}
                <div
                  className={`rounded-lg p-3 text-center ${
                    darkMode
                      ? "bg-red-500/15 ring-1 ring-red-500/30"
                      : "bg-red-50 ring-1 ring-red-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center ${
                      darkMode
                        ? "bg-red-500/20 text-red-400"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {ICONS.absent}
                  </div>
                  <p
                    className={`text-xl font-black ${
                      darkMode ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {selectedEventData.studentsCount?.absent || 0}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase ${
                      darkMode ? "text-red-400/70" : "text-red-600"
                    }`}
                  >
                    Absent
                  </p>
                </div>

                {/* Not Marked */}
                <div
                  className={`rounded-lg p-3 text-center ${
                    darkMode
                      ? "bg-amber-500/15 ring-1 ring-amber-500/30"
                      : "bg-amber-50 ring-1 ring-amber-200"
                  }`}
                >
                  <div
                    className={`w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center ${
                      darkMode
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {ICONS.notMarked}
                  </div>
                  <p
                    className={`text-xl font-black ${
                      darkMode ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    {selectedEventData.studentsCount?.notMarked || 0}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase ${
                      darkMode ? "text-amber-400/70" : "text-amber-600"
                    }`}
                  >
                    Not Marked
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanner Area */}
        <div
          className={`relative aspect-3/4 sm:aspect-video w-full h-full ${
            darkMode ? "bg-slate-950" : "bg-slate-100"
          }`}
        >
          <div id="qr-reader" className="w-full h-full overflow-hidden"></div>

          {/* Idle State */}
          {!scanning && !processing && !scanResult && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center ${
                darkMode
                  ? "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900"
                  : "bg-linear-to-br from-slate-100 via-white to-slate-100"
              }`}
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl ${
                    darkMode
                      ? "opacity-20 bg-cyan-500"
                      : "opacity-10 bg-slate-400"
                  }`}
                ></div>
                <div
                  className={`absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl ${
                    darkMode
                      ? "opacity-15 bg-blue-500"
                      : "opacity-10 bg-slate-300"
                  }`}
                ></div>
              </div>

              {/* QR Frame */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-6">
                <div
                  className={`absolute inset-0 rounded-2xl border-2 border-dashed animate-pulse ${
                    darkMode ? "border-cyan-400/40" : "border-slate-400/50"
                  }`}
                ></div>
                <div
                  className={`absolute inset-2 rounded-xl flex items-center justify-center ${
                    darkMode ? "bg-cyan-500/10" : "bg-slate-200/80"
                  }`}
                >
                  <div
                    className={darkMode ? "text-cyan-400" : "text-slate-600"}
                  >
                    {ICONS.qrCode}
                  </div>
                </div>
                <div
                  className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg ${
                    darkMode ? "border-cyan-400" : "border-slate-500"
                  }`}
                ></div>
                <div
                  className={`absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg ${
                    darkMode ? "border-cyan-400" : "border-slate-500"
                  }`}
                ></div>
                <div
                  className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg ${
                    darkMode ? "border-cyan-400" : "border-slate-500"
                  }`}
                ></div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 rounded-br-lg ${
                    darkMode ? "border-cyan-400" : "border-slate-500"
                  }`}
                ></div>
              </div>

              <p
                className={`mb-6 text-center px-4 text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {!selectedCategory
                  ? "Select category first (Boys/Girls)"
                  : !selectedEvent
                    ? "Select an event to start scanning"
                    : `Ready to scan for ${selectedEventData?.name}`}
              </p>

              <button
                onClick={startScanning}
                disabled={!selectedEvent}
                className={`px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  selectedEvent
                    ? darkMode
                      ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
                      : "bg-linear-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900 shadow-lg shadow-slate-500/25"
                    : darkMode
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-slate-300 text-slate-400 cursor-not-allowed"
                }`}
              >
                {ICONS.camera}
                Start Scanning
              </button>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm">
              <div className="w-14 h-14 border-4 border-cyan-400/30 rounded-full animate-spin border-t-cyan-400 mb-4"></div>
              <p className="text-white font-medium">Processing...</p>
            </div>
          )}

          {/* Result */}
          {scanResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4">
              <div
                className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center ${
                  scanResult.success
                    ? scanResult.alreadyPresent
                      ? "bg-blue-500/20 ring-2 ring-blue-400"
                      : "bg-emerald-500/20 ring-2 ring-emerald-400"
                    : "bg-red-500/20 ring-2 ring-red-400"
                }`}
              >
                <span
                  className={
                    scanResult.success
                      ? scanResult.alreadyPresent
                        ? "text-blue-400"
                        : "text-emerald-400"
                      : "text-red-400"
                  }
                >
                  {scanResult.success ? ICONS.check : ICONS.x}
                </span>
              </div>

              {scanResult.jerseyNumber && (
                <p className="text-3xl font-black text-white mb-1">
                  #{scanResult.jerseyNumber}
                </p>
              )}
              {scanResult.name && (
                <p className="text-slate-400 mb-2">{scanResult.name}</p>
              )}
              <p
                className={`text-center mb-6 font-medium ${
                  scanResult.success
                    ? scanResult.alreadyPresent
                      ? "text-blue-400"
                      : "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {scanResult.message}
              </p>

              <button
                onClick={() => {
                  setScanResult(null);
                  startScanning();
                }}
                className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 hover:from-cyan-600 hover:to-blue-700 shadow-lg"
              >
                {ICONS.refresh}
                Scan Next
              </button>
            </div>
          )}

          {/* Scanning - Stop Button */}
          {scanning && !scanResult && !processing && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={stopScanning}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-500/25"
              >
                {ICONS.stop}
                Stop Scanning
              </button>
            </div>
          )}
        </div>

        {/* Instructions Footer */}
        <div
          className={`px-4 sm:px-5 py-4 border-t ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            {[
              "Select category",
              "Choose event",
              "Start scanning",
              "Point at QR",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={darkMode ? "text-slate-400" : "text-slate-600"}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Permission Warning */}
      {cameraPermission === "denied" && (
        <div
          className={`rounded-2xl p-4 flex items-start gap-3 ${
            darkMode
              ? "bg-red-500/10 ring-1 ring-red-500/30"
              : "bg-red-50 ring-1 ring-red-200"
          }`}
        >
          <span className="text-xl">⚠️</span>
          <div>
            <p
              className={`font-semibold ${
                darkMode ? "text-red-300" : "text-red-800"
              }`}
            >
              Camera Access Denied
            </p>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              Please allow camera access in your browser settings to use the QR
              scanner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
