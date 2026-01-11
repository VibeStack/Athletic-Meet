import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useTheme } from "../ThemeContext";

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
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
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

  // Fetch attendance stats when event is selected
  const fetchAttendanceStats = useCallback(
    async (eventId) => {
      if (!eventId) {
        setAttendanceStats(null);
        return;
      }

      setStatsLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/admin/attendance/event/${eventId}`,
          {
            withCredentials: true,
          }
        );
        setAttendanceStats(data.data);
      } catch (err) {
        console.error("Failed to fetch attendance stats:", err);
        setAttendanceStats(null);
      } finally {
        setStatsLoading(false);
      }
    },
    [API_URL]
  );

  // Fetch stats when event changes
  useEffect(() => {
    if (selectedEvent) {
      fetchAttendanceStats(selectedEvent);
    } else {
      setAttendanceStats(null);
    }
  }, [selectedEvent, fetchAttendanceStats]);

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
    setAttendanceStats(null);
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
        { fps: 10, qrbox: { width: 500, height: 500 } },
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
        // Call backend to mark attendance
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

          // Re-fetch attendance stats after successful scan
          fetchAttendanceStats(selectedEvent);
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
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
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
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            QR Scanner 📷
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Scan student QR codes to mark attendance
          </p>
        </div>

        {/* Status */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            selectedEvent
              ? darkMode
                ? "bg-emerald-900/30 border border-emerald-500/40"
                : "bg-green-50 border border-green-200"
              : darkMode
              ? "bg-amber-900/30 border border-amber-500/40"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              selectedEvent ? "bg-green-500 animate-pulse" : "bg-amber-500"
            }`}
          ></span>
          <span
            className={`text-sm font-medium ${
              selectedEvent
                ? darkMode
                  ? "text-emerald-300"
                  : "text-green-700"
                : darkMode
                ? "text-amber-300"
                : "text-amber-700"
            }`}
          >
            {selectedEvent
              ? `Ready: ${selectedEventData?.name}`
              : "Select category & event"}
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Selections + Scanner */}
        <div className="space-y-4">
          {/* Category & Event Selection */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            {/* Category Selection (Boys/Girls) */}
            <div className="mb-4">
              <label
                className={`block text-sm font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                1. Select Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCategoryChange("Boys")}
                  className={`p-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCategory === "Boys"
                      ? "bg-blue-500 text-white shadow-lg"
                      : darkMode
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span className="text-xl">👦</span>
                  Boys
                </button>
                <button
                  onClick={() => handleCategoryChange("Girls")}
                  className={`p-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCategory === "Girls"
                      ? "bg-pink-500 text-white shadow-lg"
                      : darkMode
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span className="text-xl">👧</span>
                  Girls
                </button>
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-900"
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
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-slate-700 border border-slate-600 text-white focus:border-cyan-500"
                    : "bg-gray-50 border border-gray-200 text-gray-900 focus:border-cyan-500"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed`}
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

            {/* Selected Event Info */}
            {selectedEventData && (
              <div
                className={`mt-4 px-4 py-3 rounded-xl flex items-center gap-3 ${
                  darkMode
                    ? "bg-cyan-900/30 border border-cyan-500/30"
                    : "bg-cyan-50 border border-cyan-200"
                }`}
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <p
                    className={`font-semibold ${
                      darkMode ? "text-cyan-100" : "text-cyan-900"
                    }`}
                  >
                    {selectedEventData.name}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-cyan-300" : "text-cyan-700"
                    }`}
                  >
                    {selectedEventData.category} • {selectedEventData.day}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Scanner */}
          <div
            className={`rounded-2xl overflow-hidden ${
              darkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="relative aspect-square max-h-[400px] w-full bg-gray-900">
              <div id="qr-reader" className="w-full h-full"></div>

              {/* Idle State */}
              {!scanning && !processing && !scanResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
                  <div className="w-20 h-20 mb-4 rounded-2xl bg-cyan-500/20 flex items-center justify-center border-2 border-cyan-400/50">
                    <svg
                      className="w-10 h-10 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>

                  <p className="text-gray-400 mb-4 text-center px-4">
                    {!selectedCategory
                      ? "Select category first (Boys/Girls)"
                      : !selectedEvent
                      ? "Select an event to start"
                      : `Ready to scan for ${selectedEventData?.name}`}
                  </p>

                  <button
                    onClick={startScanning}
                    disabled={!selectedEvent}
                    className={`px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 ${
                      selectedEvent
                        ? "bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Start Scanning
                  </button>
                </div>
              )}

              {/* Processing */}
              {processing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                  <div className="w-12 h-12 border-4 border-cyan-400/30 rounded-full animate-spin border-t-cyan-400 mb-4"></div>
                  <p className="text-white">Processing...</p>
                </div>
              )}

              {/* Result */}
              {scanResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 p-4">
                  <div
                    className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center ${
                      scanResult.success
                        ? "bg-green-500/20 border-2 border-green-400"
                        : "bg-red-500/20 border-2 border-red-400"
                    }`}
                  >
                    {scanResult.success ? (
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-8 h-8 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>

                  {scanResult.jerseyNumber && (
                    <p className="text-2xl font-bold text-white mb-1">
                      #{scanResult.jerseyNumber}
                    </p>
                  )}
                  {scanResult.name && (
                    <p className="text-gray-400 mb-2">{scanResult.name}</p>
                  )}
                  <p
                    className={`text-center mb-4 ${
                      scanResult.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {scanResult.message}
                  </p>

                  <button
                    onClick={() => {
                      setScanResult(null);
                      startScanning();
                    }}
                    className="px-5 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Scan Next
                  </button>
                </div>
              )}

              {/* Scanning - Stop Button */}
              {scanning && !scanResult && !processing && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={stopScanning}
                    className="px-5 py-2 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                      />
                    </svg>
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Stats + Instructions */}
        <div className="space-y-4">
          {/* Instructions */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h3
              className={`font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              📋 How to Use
            </h3>
            <ol
              className={`space-y-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <li className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  1
                </span>
                <span>
                  Select <strong>Boys</strong> or <strong>Girls</strong>{" "}
                  category
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  2
                </span>
                <span>Choose the specific event from dropdown</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  3
                </span>
                <span>Click "Start Scanning" to open camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  4
                </span>
                <span>Point camera at student's QR code</span>
              </li>
            </ol>
          </div>

          {/* Attendance Stats */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h3
              className={`font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <svg
                className="w-5 h-5 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Attendance Stats
            </h3>

            {!selectedEvent ? (
              <p
                className={`text-sm text-center py-8 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Select an event to see attendance statistics
              </p>
            ) : statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-3 border-cyan-400/30 rounded-full border-t-cyan-400"></div>
              </div>
            ) : attendanceStats ? (
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Present */}
                  <div
                    className={`text-center p-4 rounded-xl ${
                      darkMode
                        ? "bg-emerald-900/30 border border-emerald-500/30"
                        : "bg-emerald-50 border border-emerald-200"
                    }`}
                  >
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                    >
                      {attendanceStats.present || 0}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        darkMode ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      Present
                    </p>
                  </div>

                  {/* Absent */}
                  <div
                    className={`text-center p-4 rounded-xl ${
                      darkMode
                        ? "bg-red-900/30 border border-red-500/30"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {attendanceStats.absent || 0}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        darkMode ? "text-red-300" : "text-red-700"
                      }`}
                    >
                      Absent
                    </p>
                  </div>

                  {/* Not Marked */}
                  <div
                    className={`text-center p-4 rounded-xl ${
                      darkMode
                        ? "bg-amber-900/30 border border-amber-500/30"
                        : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <p
                      className={`text-3xl font-bold ${
                        darkMode ? "text-amber-400" : "text-amber-600"
                      }`}
                    >
                      {attendanceStats.notMarked || 0}
                    </p>
                    <p
                      className={`text-xs mt-1 font-medium ${
                        darkMode ? "text-amber-300" : "text-amber-700"
                      }`}
                    >
                      Not Marked
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-500"}
                    >
                      Progress
                    </span>
                    <span
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {attendanceStats.total > 0
                        ? Math.round(
                            ((attendanceStats.present || 0) /
                              attendanceStats.total) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div
                    className={`h-3 rounded-full overflow-hidden ${
                      darkMode ? "bg-slate-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{
                        width: `${
                          attendanceStats.total > 0
                            ? ((attendanceStats.present || 0) /
                                attendanceStats.total) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Total */}
                <div
                  className={`text-center p-3 rounded-xl ${
                    darkMode ? "bg-slate-700/50" : "bg-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Enrolled:{" "}
                    <span
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {attendanceStats.total || 0}
                    </span>
                  </p>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={() => fetchAttendanceStats(selectedEvent)}
                  disabled={statsLoading}
                  className={`w-full py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    darkMode
                      ? "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${statsLoading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Stats
                </button>
              </div>
            ) : (
              <p
                className={`text-sm text-center py-8 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No attendance data available
              </p>
            )}
          </div>

          {/* Camera Permission Warning */}
          {cameraPermission === "denied" && (
            <div
              className={`rounded-2xl p-4 flex items-start gap-3 ${
                darkMode
                  ? "bg-red-900/30 border border-red-500/40"
                  : "bg-red-50 border border-red-200"
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
                  Please allow camera access in your browser settings to use the
                  QR scanner.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
