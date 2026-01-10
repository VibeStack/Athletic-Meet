import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import QRCode from "qrcode";
import { useTheme } from "./ThemeContext";

export default function PortalHome() {
  const { user } = useOutletContext();
  const { darkMode } = useTheme();
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!user?.jerseyNumber) {
      setQrDataUrl("");
      return;
    }

    let cancelled = false;

    const qrData = JSON.stringify({
      jerseyNumber: user.jerseyNumber,
      userId: user.id,
      name: user.username,
    });

    QRCode.toDataURL(qrData, {
      width: 180,
      margin: 2,
      color: {
        dark: darkMode ? "#22d3ee" : "#0891b2",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [user?.jerseyNumber, user?.id, user?.username, darkMode]);

  // Loading skeleton
  if (!user) {
    return (
      <div className="space-y-5">
        <div className="animate-pulse h-48 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-28 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section - Simplified & Elevated */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 ${
            darkMode
              ? "bg-linear-to-br from-slate-900 via-cyan-950 to-slate-900"
              : "bg-linear-to-br from-cyan-500 via-blue-500 to-indigo-600"
          }`}
        />

        {/* Subtle noise texture - premium grain effect */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Single subtle glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl" />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium mb-4 border border-white/10">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Active Session
              </div>

              {/* Main heading - larger for impact */}
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight leading-tight">
                Welcome back,
                <br />
                {user?.fullname?.split(" ")[0] || user?.username}! 👋
              </h1>

              {/* Subtitle with breathing room */}
              <p className="text-cyan-100/70 mb-8 text-sm tracking-wide">
                64th Annual Athletic Meet • GNDEC Ludhiana
              </p>

              {/* Jersey card - cleaner design */}
              {user?.jerseyNumber && (
                <div className="inline-flex items-center gap-4 px-5 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-white font-black text-xl">
                      {user.jerseyNumber}
                    </span>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">
                      Jersey Number
                    </p>
                    <p className="text-white font-bold text-lg">
                      #{user.jerseyNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* QR Code - intentional & integrated */}
            {qrDataUrl && (
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl" />
                <div className="relative bg-white p-4 rounded-3xl shadow-2xl">
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="w-32 h-32 lg:w-36 lg:h-36 rounded-xl"
                  />
                  <p className="text-center text-cyan-600 text-xs font-semibold mt-3">
                    Scan for attendance
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Label */}
      <h3
        className={`text-xs uppercase tracking-widest font-semibold ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        Overview
      </h3>

      {/* Stats Row - Unified visual language */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          darkMode={darkMode}
          icon="⚡"
          label="Events"
          value={user?.selectedEvents?.length || 0}
          subValue="/21"
          color="cyan"
        />
        <StatCard
          darkMode={darkMode}
          icon="🏆"
          label="Certificates"
          value={user?.selectedEvents?.length || 0}
          color="amber"
        />
        <StatCard
          darkMode={darkMode}
          icon="✓"
          label="Attendance"
          value={
            user?.selectedEvents?.filter((e) => e.attendanceMarked)?.length || 0
          }
          subValue={`/${user?.selectedEvents?.length || 0}`}
          color="emerald"
        />
        <StatCard
          darkMode={darkMode}
          icon="👤"
          label="Role"
          value={user?.role}
          variant="badge"
          color="violet"
        />
      </div>

      {/* Section Label */}
      <h3
        className={`text-xs uppercase tracking-widest font-semibold mt-2 ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        Quick Actions
      </h3>

      {/* Quick Actions - Unified with stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <QuickAction
          darkMode={darkMode}
          href="/portal/events"
          icon="🏃"
          title="Browse Events"
          desc="View and enroll in events"
        />
        <QuickAction
          darkMode={darkMode}
          href="/portal/certificates"
          icon="🏆"
          title="Your Certificates"
          desc="View achievements"
        />
      </div>

      {/* Section Label */}
      <h3
        className={`text-xs uppercase tracking-widest font-semibold mt-2 ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
      >
        Profile
      </h3>

      {/* Profile Card - Flat & calm */}
      <div
        className={`rounded-2xl overflow-hidden ${
          darkMode
            ? "bg-slate-800/50 border border-slate-700/50"
            : "bg-white border border-slate-200"
        }`}
      >
        <div
          className={`px-5 py-4 flex items-center gap-3 border-b ${
            darkMode ? "border-slate-700/50" : "border-slate-100"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              darkMode
                ? "bg-slate-700 text-slate-400"
                : "bg-slate-100 text-slate-500"
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
            className={`font-semibold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
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
                  darkMode ? "bg-slate-700/30" : "bg-slate-50"
                }`}
              >
                <p
                  className={`text-xs mb-1 ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-sm font-medium truncate ${
                    darkMode ? "text-white" : "text-slate-900"
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

// StatCard - Only icon gets gradient, text stays neutral
function StatCard({
  darkMode,
  icon,
  label,
  value,
  subValue,
  color,
  variant = "number",
}) {
  const colors = {
    cyan: {
      iconBg: "from-cyan-500 to-blue-500",
      border: darkMode ? "border-cyan-500/20" : "border-cyan-200",
      bg: darkMode ? "bg-cyan-500/5" : "bg-cyan-50/50",
      badge: "bg-cyan-500 text-white",
    },
    amber: {
      iconBg: "from-amber-500 to-orange-500",
      border: darkMode ? "border-amber-500/20" : "border-amber-200",
      bg: darkMode ? "bg-amber-500/5" : "bg-amber-50/50",
      badge: "bg-amber-500 text-white",
    },
    emerald: {
      iconBg: "from-emerald-500 to-teal-500",
      border: darkMode ? "border-emerald-500/20" : "border-emerald-200",
      bg: darkMode ? "bg-emerald-500/5" : "bg-emerald-50/50",
      badge: "bg-emerald-500 text-white",
    },
    violet: {
      iconBg: "from-violet-500 to-purple-500",
      border: darkMode ? "border-violet-500/20" : "border-violet-200",
      bg: darkMode ? "bg-violet-500/5" : "bg-violet-50/50",
      badge: "bg-violet-500 text-white",
    },
  };

  const c = colors[color];

  return (
    <div className={`rounded-2xl p-4 border ${c.border} ${c.bg}`}>
      {/* Only icon gets the gradient */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-linear-to-br ${c.iconBg} shadow-lg`}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <p
        className={`text-xs font-medium mb-1 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      {variant === "badge" ? (
        <span
          className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${c.badge}`}
        >
          {value}
        </span>
      ) : (
        <div className="flex items-baseline gap-0.5">
          <span
            className={`text-2xl font-black ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {value}
          </span>
          {subValue && (
            <span
              className={`text-sm ${
                darkMode ? "text-slate-500" : "text-slate-400"
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

// QuickAction - Using Link, added arrow emphasis
function QuickAction({ darkMode, href, icon, title, desc }) {
  return (
    <Link
      to={href}
      className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
        darkMode
          ? "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800"
          : "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Icon container - simple, not gradient heavy */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-105 ${
          darkMode ? "bg-slate-700" : "bg-slate-100"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm truncate ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {desc}
        </p>
      </div>
      {/* Arrow - appears on hover */}
      <svg
        className={`w-5 h-5 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1 ${
          darkMode ? "text-slate-400" : "text-slate-400"
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
    </Link>
  );
}
