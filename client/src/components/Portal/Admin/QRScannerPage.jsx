import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useTheme } from "../ThemeContext";

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

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch ALL events from backend
  useEffect(() => {
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
      alert("Please select an event first");
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
              // for mobile
              return {
                width: Math.floor(viewfinderWidth * 0.95),
                height: Math.floor(viewfinderHeight * 0.6),
              };
            }

            // for desktop 
            const size = Math.floor(
              Math.min(viewfinderWidth, viewfinderHeight) * 0.85
            );
            return { width: size, height: size };
          },
        },
        onScanSuccess,
        () => {}
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
    await stopScanning();
    setProcessing(true);

    try {
      const data = JSON.parse(decodedText);

      if (data.jerseyNumber) {
        const response = await axios.post(
          `${API_URL}/admin/users/attendance`,
          {
            jerseyNumber: data.jerseyNumber,
            eventId: selectedEvent,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          setScanResult({
            success: true,
            jerseyNumber: data.jerseyNumber,
            name: data.name || response.data.data?.name || "Student",
            message: "Attendance marked!",
          });
          playSound("success");
        } else {
          setScanResult({
            success: false,
            jerseyNumber: data.jerseyNumber,
            message: response.data.message || "Failed to mark attendance",
          });
          playSound("error");
        }
      } else {
        setScanResult({ success: false, message: "Invalid QR code format" });
        playSound("error");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to process QR code";
      setScanResult({ success: false, message: errorMsg });
      playSound("error");
    } finally {
      setProcessing(false);
    }
  };

  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400/30 rounded-full border-t-cyan-400 mx-auto mb-4"></div>
          <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode
                ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            {ICONS.qrCode}
          </div>
          <div>
            <h1
              className={`text-xl sm:text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              QR Scanner
            </h1>
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Scan student QR codes to mark attendance
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
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
          className={`px-5 py-4 border-b ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <span className="text-lg">👦</span>
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
                  <span className="text-lg">👧</span>
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

          {/* Selected Event Info */}
          {selectedEventData && (
            <div
              className={`mt-4 px-4 py-3 rounded-xl flex items-center gap-3 ${
                darkMode
                  ? "bg-cyan-500/10 ring-1 ring-cyan-500/30"
                  : "bg-cyan-50 ring-1 ring-cyan-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  darkMode ? "bg-cyan-500/20" : "bg-cyan-100"
                }`}
              >
                {selectedEventData.type === "Track"
                  ? "🏃"
                  : selectedEventData.type === "Field"
                  ? "🎯"
                  : "👥"}
              </div>
              <div>
                <p
                  className={`font-semibold text-sm ${
                    darkMode ? "text-cyan-100" : "text-cyan-900"
                  }`}
                >
                  {selectedEventData.name}
                </p>
                <p
                  className={`text-xs ${
                    darkMode ? "text-cyan-300/70" : "text-cyan-700"
                  }`}
                >
                  {selectedEventData.type} • {selectedEventData.category} •{" "}
                  {selectedEventData.day}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scanner Area */}
        <div
          className={`relative aspect-4/3 sm:aspect-video max-h-[500px] w-full ${
            darkMode ? "bg-slate-950" : "bg-slate-100"
          }`}
        >
          <div id="qr-reader" className="w-full h-full"></div>

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
              <div className="relative w-24 h-24 mb-6">
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
                {/* Corner accents */}
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
                    ? "bg-emerald-500/20 ring-2 ring-emerald-400"
                    : "bg-red-500/20 ring-2 ring-red-400"
                }`}
              >
                <span
                  className={
                    scanResult.success ? "text-emerald-400" : "text-red-400"
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
                  scanResult.success ? "text-emerald-400" : "text-red-400"
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
          className={`px-5 py-4 border-t ${
            darkMode ? "border-white/5" : "border-slate-100"
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  darkMode
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-cyan-100 text-cyan-600"
                }`}
              >
                1
              </span>
              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                Select category
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  darkMode
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-cyan-100 text-cyan-600"
                }`}
              >
                2
              </span>
              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                Choose event
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  darkMode
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-cyan-100 text-cyan-600"
                }`}
              >
                3
              </span>
              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                Start scanning
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  darkMode
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "bg-cyan-100 text-cyan-600"
                }`}
              >
                4
              </span>
              <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
                Point at QR
              </span>
            </div>
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
