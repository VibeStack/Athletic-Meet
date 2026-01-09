import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

export default function PortalHome() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (user?.jerseyNumber) {
      const qrData = JSON.stringify({
        jerseyNumber: user.jerseyNumber,
        userId: user._id,
        name: user.fullname || user.username,
      });

      QRCode.toDataURL(
        qrData,
        {
          width: 180,
          margin: 2,
          color: { dark: "#0891b2", light: "#ffffff" },
        },
        (err, url) => {
          if (!err) setQrDataUrl(url);
        }
      );
    }
  }, [user]);

  return (
    <div className="space-y-5">
      {/* Hero Section - Blue/Cyan Athletic Theme */}
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-linear-to-br from-slate-800 via-cyan-900 to-slate-900"
              : "bg-linear-to-br from-cyan-500 via-blue-500 to-indigo-600"
          }`}
        ></div>

        {/* Geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Light effects */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 border border-white/20">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Active Session
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
                Welcome back, {user?.fullname?.split(" ")[0] || user?.username}!
                👋
              </h1>

              <p className="text-cyan-100 mb-6">
                64th Annual Athletic Meet • GNDEC Ludhiana
              </p>

              {user?.jerseyNumber && (
                <div className="inline-flex items-center gap-4 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="text-white font-black text-2xl">
                      {user.jerseyNumber}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider">
                      Jersey Number
                    </p>
                    <p className="text-white font-bold text-xl">
                      #{user.jerseyNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-black/20">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 lg:w-36 lg:h-36 rounded-xl"
                />
                <p className="text-center text-cyan-600 text-xs font-semibold mt-2">
                  Scan for attendance
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          darkMode={darkMode}
          icon="⚡"
          label="Events"
          value="3"
          subValue="/21"
          color="cyan"
        />
        <StatCard
          darkMode={darkMode}
          icon="🏆"
          label="Certificates"
          value="0"
          color="amber"
        />
        <StatCard
          darkMode={darkMode}
          icon="✓"
          label="Attendance"
          value="Not Marked"
          isText
          color="emerald"
        />
        <StatCard
          darkMode={darkMode}
          icon="👤"
          label="Role"
          value={user?.role}
          isBadge
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickAction
          darkMode={darkMode}
          href="/portal/events"
          icon="🏃"
          title="Browse Events"
          desc="View and enroll in events"
          color="cyan"
        />
        <QuickAction
          darkMode={darkMode}
          href="/portal/certificates"
          icon="🏆"
          title="Your Certificates"
          desc="View achievements"
          color="amber"
        />
      </div>

      {/* Profile Card */}
      <div
        className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-800/60 border border-slate-700/50"
            : "bg-white border border-gray-200 shadow-sm"
        }`}
      >
        <div
          className={`px-5 py-4 flex items-center gap-3 border-b ${
            darkMode
              ? "border-slate-700/50 bg-linear-to-r from-cyan-900/30 to-slate-800/50"
              : "border-gray-100 bg-linear-to-r from-cyan-50 to-blue-50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-cyan-100 text-cyan-600"
            }`}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2
            className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Profile Details
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Full Name", value: user?.fullname },
              { label: "Username", value: user?.username },
              { label: "Email", value: user?.email },
              { label: "Course", value: user?.course },
              { label: "Branch", value: user?.branch },
              { label: "Year", value: user?.year },
              { label: "CRN", value: user?.crn },
              { label: "Phone", value: user?.phone },
            ].map((item, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl ${
                  darkMode ? "bg-slate-700/40" : "bg-gray-50"
                }`}
              >
                <p
                  className={`text-xs mb-1 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-sm font-semibold truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  darkMode,
  icon,
  label,
  value,
  subValue,
  color,
  isText,
  isBadge,
}) {
  const colors = {
    cyan: {
      bg: "from-cyan-500 to-blue-600",
      light: "bg-cyan-50 border-cyan-200",
      text: "text-cyan-600",
      darkBg: "bg-cyan-500/10 border-cyan-500/30",
    },
    amber: {
      bg: "from-amber-500 to-orange-500",
      light: "bg-amber-50 border-amber-200",
      text: "text-amber-600",
      darkBg: "bg-amber-500/10 border-amber-500/30",
    },
    emerald: {
      bg: "from-emerald-500 to-teal-500",
      light: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-600",
      darkBg: "bg-emerald-500/10 border-emerald-500/30",
    },
    blue: {
      bg: "from-blue-500 to-indigo-500",
      light: "bg-blue-50 border-blue-200",
      text: "text-blue-600",
      darkBg: "bg-blue-500/10 border-blue-500/30",
    },
  };

  const c = colors[color];

  return (
    <div
      className={`rounded-2xl p-4 border ${
        darkMode ? `${c.darkBg}` : `${c.light}`
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-linear-to-br ${c.bg} shadow-lg`}
      >
        <span className="text-lg text-white">{icon}</span>
      </div>
      <p
        className={`text-xs font-medium mb-1 ${
          darkMode ? "text-gray-400" : c.text
        }`}
      >
        {label}
      </p>
      {isBadge ? (
        <span
          className={`inline-block px-3 py-1 rounded-lg text-xs font-bold text-white bg-linear-to-r ${c.bg}`}
        >
          {value}
        </span>
      ) : isText ? (
        <p
          className={`text-sm font-semibold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {value}
        </p>
      ) : (
        <div className="flex items-baseline gap-0.5">
          <span
            className={`text-2xl font-black ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </span>
          {subValue && (
            <span
              className={`text-sm ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {subValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function QuickAction({ darkMode, href, icon, title, desc, color }) {
  const colors = {
    cyan: {
      bg: "from-cyan-500 to-blue-600",
      hover: "hover:border-cyan-400/50",
      light: "hover:bg-cyan-50",
    },
    amber: {
      bg: "from-amber-500 to-orange-500",
      hover: "hover:border-amber-400/50",
      light: "hover:bg-amber-50",
    },
  };

  const c = colors[color];

  return (
    <a
      href={href}
      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01] ${
        darkMode
          ? `bg-slate-800/60 border border-slate-700/50 ${c.hover}`
          : `bg-white border border-gray-200 shadow-sm hover:shadow-md ${c.light}`
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white bg-linear-to-br ${c.bg} shadow-lg group-hover:scale-105 transition-transform`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <h3
          className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {desc}
        </p>
      </div>
      <svg
        className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
}
