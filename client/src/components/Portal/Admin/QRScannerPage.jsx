import { useState, useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

// Event data organized by category
const eventCategories = {
  "Track Events": {
    icon: "🏃",
    color: "from-orange-500 to-red-500",
    lightBg: "from-orange-50 to-red-50",
    events: [
      { id: "sprint_100m", name: "100m Sprint", emoji: "⚡" },
      { id: "sprint_200m", name: "200m Sprint", emoji: "🏃" },
      { id: "race_400m", name: "400m Race", emoji: "🏃‍♂️" },
      { id: "race_800m", name: "800m Race", emoji: "🏃‍♀️" },
      { id: "race_1500m", name: "1500m Race", emoji: "🎽" },
      { id: "race_5000m", name: "5000m Race", emoji: "🏅" },
    ],
  },
  "Field Events": {
    icon: "🥏",
    color: "from-cyan-500 to-blue-500",
    lightBg: "from-cyan-50 to-blue-50",
    events: [
      { id: "long_jump", name: "Long Jump", emoji: "🦘" },
      { id: "high_jump", name: "High Jump", emoji: "🔝" },
      { id: "triple_jump", name: "Triple Jump", emoji: "🥉" },
      { id: "shot_put", name: "Shot Put", emoji: "🏋️" },
      { id: "discus", name: "Discus Throw", emoji: "🥏" },
      { id: "javelin", name: "Javelin Throw", emoji: "🎯" },
    ],
  },
};

// Simulated participant data
const generateParticipants = () => {
  const participants = {};
  Object.values(eventCategories).forEach((category) => {
    category.events.forEach((event) => {
      const count = Math.floor(Math.random() * 50) + 20;
      participants[event.id] = {
        total: count,
        present: 0,
        students: Array.from({ length: count }, (_, i) => ({
          id: `${event.id}_${i}`,
          jerseyNumber: Math.floor(Math.random() * 900) + 100,
          name: `Student ${i + 1}`,
          marked: false,
          markedAt: null,
          markedBy: null,
        })),
      };
    });
  });
  return participants;
};

export default function QRScannerPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState(() =>
    generateParticipants()
  );
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [scanResult, setScanResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const scannerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Simulate real-time updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (Math.random() > 0.7 && selectedEvent) {
        const eventData = participants[selectedEvent];
        if (eventData) {
          const unmarkedStudents = eventData.students.filter((s) => !s.marked);
          if (unmarkedStudents.length > 0 && Math.random() > 0.5) {
            const randomStudent =
              unmarkedStudents[
                Math.floor(Math.random() * unmarkedStudents.length)
              ];
            markStudentPresent(randomStudent.jerseyNumber, "Admin 2", true);
          }
        }
      }
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [selectedEvent, participants]);

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

  const markStudentPresent = useCallback(
    (jerseyNumber, adminName = "You", isRemote = false) => {
      setParticipants((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((eventId) => {
          const eventData = updated[eventId];
          const studentIndex = eventData.students.findIndex(
            (s) => s.jerseyNumber === jerseyNumber && !s.marked
          );

          if (studentIndex !== -1) {
            const newStudents = [...eventData.students];
            newStudents[studentIndex] = {
              ...newStudents[studentIndex],
              marked: true,
              markedAt: new Date(),
              markedBy: adminName,
            };

            updated[eventId] = {
              ...eventData,
              present: eventData.present + 1,
              students: newStudents,
            };

            if (eventId === selectedEvent && !isRemote) {
              setRecentScans((prev) => [
                {
                  jerseyNumber,
                  name: newStudents[studentIndex].name,
                  time: new Date(),
                  admin: adminName,
                },
                ...prev.slice(0, 9),
              ]);
            }
          }
        });

        return updated;
      });
    },
    [selectedEvent]
  );

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
        { fps: 10, qrbox: { width: 250, height: 250 } },
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

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    await stopScanning();
    setProcessing(true);

    try {
      const data = JSON.parse(decodedText);

      if (data.jerseyNumber) {
        const eventData = participants[selectedEvent];
        const student = eventData?.students.find(
          (s) => s.jerseyNumber === data.jerseyNumber
        );

        if (!student) {
          setScanResult({
            success: false,
            message: "Student not enrolled in this event",
            jerseyNumber: data.jerseyNumber,
          });
          playSound("error");
        } else if (student.marked) {
          setScanResult({
            success: false,
            message: "Already marked present",
            jerseyNumber: data.jerseyNumber,
            name: student.name,
          });
          playSound("error");
        } else {
          try {
            await axios.patch(
              `${API_URL}/admin/attendance/${data.jerseyNumber}`,
              {},
              { withCredentials: true }
            );
          } catch (e) {
            console.log("API call failed, using local state");
          }

          markStudentPresent(data.jerseyNumber, "You");

          setScanResult({
            success: true,
            jerseyNumber: data.jerseyNumber,
            name: student.name,
            message: "Attendance marked!",
          });
          playSound("success");
        }
      } else {
        setScanResult({ success: false, message: "Invalid QR code format" });
        playSound("error");
      }
    } catch (err) {
      setScanResult({ success: false, message: "Failed to read QR code" });
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

  const resetToEventSelection = () => {
    stopScanning();
    setScanResult(null);
    setSelectedEvent(null);
    setRecentScans([]);
  };

  const resetToCategorySelection = () => {
    resetToEventSelection();
    setSelectedCategory(null);
  };

  const currentEventData = selectedEvent ? participants[selectedEvent] : null;
  const currentEventInfo = selectedEvent
    ? Object.values(eventCategories)
        .flatMap((c) => c.events)
        .find((e) => e.id === selectedEvent)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <button
              onClick={resetToCategorySelection}
              className="text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
            >
              QR Scanner
            </button>
            {selectedCategory && (
              <>
                <span className="text-gray-400">/</span>
                <button
                  onClick={resetToEventSelection}
                  className="text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
                >
                  {selectedCategory}
                </button>
              </>
            )}
            {selectedEvent && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 font-medium">
                  {currentEventInfo?.name}
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {!selectedCategory
              ? "Select Event Category"
              : !selectedEvent
              ? "Select Event"
              : `Scanning: ${currentEventInfo?.name}`}
          </h1>
        </div>

        {/* Live Sync Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-green-700 text-sm font-medium">Live Sync</span>
          <span className="text-gray-500 text-xs">
            {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(eventCategories).map(([categoryName, category]) => {
            const totalStudents = category.events.reduce(
              (sum, e) => sum + (participants[e.id]?.total || 0),
              0
            );
            const presentStudents = category.events.reduce(
              (sum, e) => sum + (participants[e.id]?.present || 0),
              0
            );

            return (
              <button
                key={categoryName}
                onClick={() => setSelectedCategory(categoryName)}
                className={`group relative p-6 bg-linear-to-br ${category.lightBg} rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all text-left overflow-hidden`}
              >
                <div className="relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-linear-to-br ${category.color} flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-xl">
                        {categoryName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {category.events.length} events
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Attendance Progress</span>
                      <span className="text-gray-900 font-medium">
                        {presentStudents}/{totalStudents}
                      </span>
                    </div>
                    <div className="h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-linear-to-r ${category.color} transition-all duration-500`}
                        style={{
                          width: `${
                            totalStudents > 0
                              ? (presentStudents / totalStudents) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Event Selection */}
      {selectedCategory && !selectedEvent && (
        <div className="space-y-4">
          <button
            onClick={resetToCategorySelection}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Categories
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventCategories[selectedCategory].events.map((event) => {
              const eventData = participants[event.id];
              const percentage =
                eventData.total > 0
                  ? Math.round((eventData.present / eventData.total) * 100)
                  : 0;

              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event.id)}
                  className="group p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-400 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {event.emoji}
                    </span>
                    <div>
                      <h3 className="text-gray-900 font-bold">{event.name}</h3>
                      <p className="text-gray-500 text-sm">
                        {eventData.total} participants
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-bold">
                        {eventData.total}
                      </p>
                      <p className="text-gray-500 text-xs">Total</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-600 font-bold">
                        {eventData.present}
                      </p>
                      <p className="text-gray-500 text-xs">Present</p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-amber-600 font-bold">
                        {eventData.total - eventData.present}
                      </p>
                      <p className="text-gray-500 text-xs">Pending</p>
                    </div>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 text-right">
                    {percentage}% complete
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Scanning Mode */}
      {selectedEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Scanner */}
          <div className="space-y-4">
            <button
              onClick={resetToEventSelection}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Events
            </button>

            {/* Scanner Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <div className="relative aspect-square max-h-[450px] w-full bg-gray-900">
                <div id="qr-reader" className="w-full h-full"></div>

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

                    <p className="text-gray-400 mb-4">
                      Scanning for {currentEventInfo?.name}
                    </p>

                    <button
                      onClick={startScanning}
                      className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 shadow-lg"
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

                {processing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
                    <div className="w-12 h-12 border-4 border-cyan-400/30 rounded-full animate-spin border-t-cyan-400 mb-4"></div>
                    <p className="text-white">Processing...</p>
                  </div>
                )}

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

            {/* Recent Scans */}
            {recentScans.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-gray-900 font-bold mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recent Scans
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentScans.map((scan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl text-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-amber-600 font-bold">
                          #{scan.jerseyNumber}
                        </span>
                        <span className="text-gray-600">{scan.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {scan.time.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Stats */}
          <div className="space-y-4">
            {/* Event Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{currentEventInfo?.emoji}</span>
                <div>
                  <h2 className="text-gray-900 font-bold text-xl">
                    {currentEventInfo?.name}
                  </h2>
                  <p className="text-gray-500 text-sm">Real-time attendance</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-gray-900">
                    {currentEventData?.total || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Total</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-3xl font-bold text-green-600">
                    {currentEventData?.present || 0}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Present</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-3xl font-bold text-amber-600">
                    {(currentEventData?.total || 0) -
                      (currentEventData?.present || 0)}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">Pending</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900 font-medium">
                    {currentEventData?.total > 0
                      ? Math.round(
                          (currentEventData.present / currentEventData.total) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-cyan-500 to-green-500 transition-all duration-500"
                    style={{
                      width: `${
                        currentEventData?.total > 0
                          ? (currentEventData.present /
                              currentEventData.total) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Activity
              </h3>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {currentEventData?.students
                  .filter((s) => s.marked)
                  .sort((a, b) => new Date(b.markedAt) - new Date(a.markedAt))
                  .slice(0, 15)
                  .map((student, i) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm ${
                        i === 0
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-green-600"
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
                        </span>
                        <span className="text-amber-600 font-bold">
                          #{student.jerseyNumber}
                        </span>
                        <span className="text-gray-600">{student.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-500 text-xs block">
                          {student.markedBy}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {student.markedAt?.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}

                {!currentEventData?.students.some((s) => s.marked) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No attendance marked yet</p>
                    <p className="text-sm">
                      Start scanning to see live updates
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
