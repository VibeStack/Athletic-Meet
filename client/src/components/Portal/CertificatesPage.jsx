import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

const mockCertificates = [
  {
    id: 1,
    type: "Participation",
    event: "100m Sprint",
    date: "2025-02-20",
    locked: true,
  },
  {
    id: 2,
    type: "Winner",
    event: "Long Jump",
    date: "2025-02-21",
    position: "1st",
    locked: true,
  },
  {
    id: 3,
    type: "Runner-up",
    event: "200m Race",
    date: "2025-02-20",
    position: "2nd",
    locked: true,
  },
];

export default function CertificatesPage() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [certificates] = useState(mockCertificates);
  const [previewCert, setPreviewCert] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (certId) => {
    setDownloading(certId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setDownloading(null);
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "Winner":
        return {
          emoji: "🏆",
          gradient: "from-amber-500 to-orange-500",
          bg: darkMode
            ? "from-amber-900/40 to-orange-900/40"
            : "from-amber-50 to-orange-50",
          border: darkMode ? "border-amber-500/40" : "border-amber-200",
        };
      case "Runner-up":
        return {
          emoji: "🥈",
          gradient: "from-slate-400 to-gray-500",
          bg: darkMode
            ? "from-slate-800/60 to-gray-800/40"
            : "from-slate-50 to-gray-50",
          border: darkMode ? "border-slate-500/40" : "border-slate-200",
        };
      default:
        return {
          emoji: "🏅",
          gradient: "from-indigo-500 to-purple-500",
          bg: darkMode
            ? "from-indigo-900/40 to-purple-900/40"
            : "from-indigo-50 to-purple-50",
          border: darkMode ? "border-indigo-500/40" : "border-indigo-200",
        };
    }
  };

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
            Certificates 🏅
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Your achievements and participation records
          </p>
        </div>
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
            darkMode
              ? "bg-linear-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/30"
              : "bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200"
          }`}
        >
          <span className="text-2xl">📜</span>
          <div>
            <span
              className={`text-xl font-bold ${
                darkMode ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {certificates.length}
            </span>
            <p
              className={`text-xs ${
                darkMode ? "text-amber-300" : "text-amber-500"
              }`}
            >
              Certificates
            </p>
          </div>
        </div>
      </div>

      {/* Lock Notice */}
      {certificates.some((c) => c.locked) && (
        <div
          className={`rounded-xl p-4 flex items-start gap-4 ${
            darkMode
              ? "bg-linear-to-r from-red-900/30 to-orange-900/30 border border-red-500/30"
              : "bg-linear-to-r from-red-50 to-orange-50 border border-red-200"
          }`}
        >
          <span className="text-2xl">🔒</span>
          <div>
            <p
              className={`font-bold ${
                darkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              Certificates are currently locked
            </p>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-red-200" : "text-red-500"
              }`}
            >
              They will be available after all events conclude and results are
              finalized.
            </p>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => {
            const styles = getTypeStyles(cert.type);
            return (
              <div
                key={cert.id}
                className={`rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
                  darkMode ? "bg-slate-800/50" : "bg-white shadow-md"
                } border ${styles.border}`}
              >
                {/* Card Header with gradient */}
                <div className={`p-5 bg-linear-to-br ${styles.bg}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-linear-to-br ${styles.gradient} flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {styles.emoji}
                    </div>
                    {cert.locked && (
                      <span
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg ${
                          darkMode
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-red-100 text-red-600 border border-red-200"
                        }`}
                      >
                        🔒 Locked
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white bg-linear-to-r ${styles.gradient}`}
                  >
                    {cert.type}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3
                    className={`font-bold text-lg mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {cert.event}
                  </h3>
                  <p
                    className={`text-sm flex items-center gap-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    📅{" "}
                    {new Date(cert.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div
                  className={`px-5 py-4 flex gap-3 border-t ${
                    darkMode
                      ? "border-slate-700 bg-slate-800/30"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  <button
                    onClick={() => setPreviewCert(cert)}
                    disabled={cert.locked}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                      darkMode
                        ? "bg-slate-700 text-white hover:bg-slate-600 disabled:text-gray-500"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:text-gray-400"
                    } disabled:cursor-not-allowed`}
                  >
                    👁️ Preview
                  </button>
                  <button
                    onClick={() => handleDownload(cert.id)}
                    disabled={cert.locked || downloading === cert.id}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg text-white shadow-md transition-all bg-linear-to-r ${styles.gradient} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {downloading === cert.id ? "..." : "⬇️ Download"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`text-center py-16 rounded-2xl ${
            darkMode
              ? "bg-linear-to-br from-slate-800 to-slate-800/50 border border-slate-700"
              : "bg-linear-to-br from-gray-50 to-white border border-gray-200"
          }`}
        >
          <span className="text-6xl mb-4 block">🏆</span>
          <h3
            className={`font-bold text-xl ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No Certificates Yet
          </h3>
          <p
            className={`text-sm mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Participate in events to earn certificates
          </p>
        </div>
      )}

      {/* Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl ${
              darkMode ? "bg-slate-900" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b flex items-center justify-between ${
                darkMode
                  ? "border-slate-800 bg-linear-to-r from-indigo-900/50 to-purple-900/50"
                  : "border-gray-100 bg-linear-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <h3
                className={`font-bold text-lg ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                🏆 Certificate Preview
              </h3>
              <button
                onClick={() => setPreviewCert(null)}
                className={`p-2 rounded-lg ${
                  darkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8 bg-linear-to-br from-amber-50 via-white to-indigo-50">
              <div className="border-4 border-amber-400 rounded-xl p-8 text-center bg-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-500"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-amber-500"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-amber-500"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber-500"></div>

                <span className="text-5xl mb-4 block">
                  {getTypeStyles(previewCert.type).emoji}
                </span>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Certificate of {previewCert.type}
                </h2>
                <p className="text-gray-500 mb-4">This is to certify that</p>
                <p className="text-2xl font-black bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {user?.fullname || user?.username}
                </p>
                <p className="text-gray-600 mb-2">participated in</p>
                <p className="text-xl font-bold text-gray-900 mb-6">
                  {previewCert.event}
                </p>
                <div className="w-32 h-1 bg-linear-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-4"></div>
                <p className="text-gray-500 text-sm">
                  64th Annual Athletic Meet - GNDEC
                </p>
              </div>
            </div>

            <div
              className={`p-4 border-t flex justify-end gap-3 ${
                darkMode ? "border-slate-800" : "border-gray-100"
              }`}
            >
              <button
                onClick={() => setPreviewCert(null)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg ${
                  darkMode
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(previewCert.id);
                  setPreviewCert(null);
                }}
                className="px-5 py-2.5 text-sm font-bold rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
              >
                ⬇️ Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
