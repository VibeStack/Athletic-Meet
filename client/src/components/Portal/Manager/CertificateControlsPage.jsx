import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function CertificateControlsPage() {
  const { darkMode } = useTheme();
  const [globalLock, setGlobalLock] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [generating, setGenerating] = useState(false);

  const stats = { total: 45, participation: 35, winner: 10 };

  const toggleGlobalLock = async () => {
    setUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setGlobalLock(!globalLock);
    setUpdating(false);
  };

  const generateCertificates = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGenerating(false);
    alert("Certificates generated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Certificate Controls 🎓
        </h1>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage certificate availability and generation
        </p>
      </div>

      {/* Global Lock Status */}
      <div
        className={`rounded-2xl overflow-hidden ${
          globalLock
            ? darkMode
              ? "bg-linear-to-br from-red-900/50 to-orange-900/30 border border-red-500/40"
              : "bg-linear-to-br from-red-50 to-orange-50 border border-red-200"
            : darkMode
            ? "bg-linear-to-br from-emerald-900/50 to-teal-900/30 border border-emerald-500/40"
            : "bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-200"
        }`}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg ${
                  globalLock
                    ? "bg-linear-to-br from-red-500 to-orange-500"
                    : "bg-linear-to-br from-emerald-500 to-teal-500"
                }`}
              >
                {globalLock ? "🔒" : "🔓"}
              </div>
              <div>
                <h2
                  className={`font-bold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Global Certificate Lock
                </h2>
                <p
                  className={`font-bold ${
                    globalLock
                      ? darkMode
                        ? "text-red-400"
                        : "text-red-600"
                      : darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                  }`}
                >
                  {globalLock
                    ? "Certificates are LOCKED"
                    : "Certificates are AVAILABLE"}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {globalLock
                    ? "Students cannot view or download certificates"
                    : "Students can now access and download their certificates"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleGlobalLock}
              disabled={updating}
              className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl ${
                globalLock
                  ? "bg-linear-to-r from-emerald-500 to-teal-500"
                  : "bg-linear-to-r from-red-500 to-orange-500"
              } disabled:opacity-50 disabled:hover:scale-100`}
            >
              {updating
                ? "..."
                : globalLock
                ? "🔓 Unlock Certificates"
                : "🔒 Lock Certificates"}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`rounded-xl p-5 ${
            darkMode
              ? "bg-linear-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/40"
              : "bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
              📜
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                Total
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-indigo-900"
                }`}
              >
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-5 ${
            darkMode
              ? "bg-linear-to-br from-blue-900/40 to-cyan-900/30 border border-blue-500/40"
              : "bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg">
              🏅
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                Participation
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-blue-900"
                }`}
              >
                {stats.participation}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-5 ${
            darkMode
              ? "bg-linear-to-br from-amber-900/40 to-orange-900/30 border border-amber-500/40"
              : "bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>
            <div>
              <p
                className={`text-sm ${
                  darkMode ? "text-amber-300" : "text-amber-600"
                }`}
              >
                Winners
              </p>
              <p
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-amber-900"
                }`}
              >
                {stats.winner}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Actions */}
      <div
        className={`rounded-2xl p-6 ${
          darkMode
            ? "bg-linear-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border border-indigo-500/30"
            : "bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200"
        }`}
      >
        <h3
          className={`font-bold text-lg mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          ⚙️ Certificate Generation
        </h3>
        <p
          className={`text-sm mb-5 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Generate certificates for all eligible participants based on event
          results
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateCertificates}
            disabled={generating}
            className="px-6 py-3 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {generating ? "⏳ Generating..." : "✨ Generate All Certificates"}
          </button>
          <button
            className={`px-6 py-3 font-semibold rounded-xl transition-all ${
              darkMode
                ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            🔄 Regenerate All
          </button>
        </div>
      </div>

      {/* Warning */}
      <div
        className={`rounded-xl p-5 flex items-start gap-4 ${
          darkMode
            ? "bg-linear-to-r from-amber-900/40 to-orange-900/30 border border-amber-500/30"
            : "bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200"
        }`}
      >
        <span className="text-2xl">⚠️</span>
        <div>
          <p
            className={`font-bold ${
              darkMode ? "text-amber-400" : "text-amber-700"
            }`}
          >
            Important Notice
          </p>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-amber-200" : "text-amber-600"
            }`}
          >
            Ensure all events are completed and results finalized before
            generating certificates. Once unlocked, students will receive email
            notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
