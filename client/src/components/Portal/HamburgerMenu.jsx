import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

import {
  DashboardIcon,
  EventsIcon,
  CertificateIcon,
  UsersIcon,
  QrIcon,
  ExportIcon,
  SettingsIcon,
  TrophyIcon,
  ShieldIcon,
  CertificateControlIcon,
  AddEventIcon,
  AnalyticsIcon,
  CloseIcon,
  OtpIcon,
} from "../../icons/Portal/HamburgerMenuIcons";

// ========== SECTION-BASED MENU STRUCTURE ==========
const menuSections = [
  {
    title: "Core",
    items: [
      {
        label: "Dashboard",
        path: "/portal",
        roles: ["Student", "Admin", "Manager"],
        gradient: "from-indigo-500 to-blue-600",
        shadowColor: "shadow-indigo-500/30",
        icon: DashboardIcon,
      },
      {
        label: "Users",
        path: "/portal/admin/users",
        roles: ["Admin", "Manager"],
        gradient: "from-sky-400 to-blue-600",
        shadowColor: "shadow-sky-500/30",
        icon: UsersIcon,
      },
      {
        label: "Bulk Admin",
        path: "/portal/manager/bulk-admin",
        roles: ["Manager"],
        gradient: "from-teal-500 to-cyan-600",
        shadowColor: "shadow-teal-500/30",
        icon: ShieldIcon,
      },
      {
        label: "OTP Monitor",
        path: "/portal/manager/otp-monitor",
        roles: ["Manager"],
        gradient: "from-emerald-500 to-teal-600",
        shadowColor: "shadow-emerald-500/30",
        icon: OtpIcon,
      },
    ],
  },
  {
    title: "Events",
    items: [
      {
        label: "Your Events",
        path: "/portal/events",
        roles: ["Student", "Admin", "Manager"],
        gradient: "from-violet-500 to-purple-600",
        shadowColor: "shadow-violet-500/30",
        icon: EventsIcon,
      },
      {
        label: "QR Scanner",
        path: "/portal/admin/scanner",
        roles: ["Admin", "Manager"],
        gradient: "from-cyan-500 to-blue-600",
        shadowColor: "shadow-cyan-500/30",
        icon: QrIcon,
      },
      {
        label: "Event Controls",
        path: "/portal/manager/event-controls",
        roles: ["Manager"],
        gradient: "from-purple-500 to-indigo-600",
        shadowColor: "shadow-purple-500/30",
        icon: SettingsIcon,
      },
      {
        label: "Event Results",
        path: "/portal/manager/event-results",
        roles: ["Manager"],
        gradient: "from-orange-500 to-rose-600",
        shadowColor: "shadow-orange-500/30",
        icon: TrophyIcon,
      },
      {
        label: "Bulk Add Event",
        path: "/portal/manager/bulk-add-event",
        roles: ["Manager"],
        gradient: "from-lime-500 to-green-600",
        shadowColor: "shadow-lime-500/30",
        icon: AddEventIcon,
      },
    ],
  },
  {
    title: "Certificates",
    items: [
      {
        label: "Certificates",
        path: "/portal/certificates",
        roles: ["Student", "Admin", "Manager"],
        gradient: "from-amber-400 to-orange-500",
        shadowColor: "shadow-amber-500/30",
        icon: CertificateIcon,
      },
      {
        label: "Certificate Controls",
        path: "/portal/manager/certificate-controls",
        roles: ["Manager"],
        gradient: "from-fuchsia-500 to-purple-700",
        shadowColor: "shadow-fuchsia-500/30",
        icon: CertificateControlIcon,
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        label: "Analytics",
        path: "/portal/manager/analytics",
        roles: ["Manager"],
        gradient: "from-cyan-500 to-teal-600",
        shadowColor: "shadow-cyan-500/30",
        icon: AnalyticsIcon,
      },
      {
        label: "Export Data",
        path: "/portal/manager/export",
        roles: ["Manager"],
        gradient: "from-rose-400 to-pink-600",
        shadowColor: "shadow-rose-500/30",
        icon: ExportIcon,
      },
    ],
  },
];

const roleStyles = {
  Student: "text-sky-700 bg-sky-100 ring-1 ring-sky-300",
  Admin: "text-violet-700 bg-violet-100 ring-1 ring-violet-300",
  Manager: "text-amber-700 bg-amber-100 ring-1 ring-amber-300",
};

const roleStylesDark = {
  Student: "text-sky-300 bg-sky-500/20 ring-1 ring-sky-400/40",
  Admin: "text-violet-300 bg-violet-500/20 ring-1 ring-violet-400/40",
  Manager: "text-amber-300 bg-amber-500/20 ring-1 ring-amber-400/40",
};

export default function HamburgerMenu({ menuOpen, setMenuOpen, user }) {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  /* -------- ANIMATION CONTROL -------- */
  useEffect(() => {
    if (menuOpen) {
      setIsAnimating(true);
    }
  }, [menuOpen]);

  /* -------- CLOSE ON ROUTE CHANGE -------- */
  useEffect(() => {
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /* -------- BODY SCROLL LOCK -------- */
  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = original);
  }, [menuOpen]);

  if (!menuOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-opacity  ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Panel with slide animation */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col overflow-hidden
          transition-transform  ease-out
          ${isAnimating ? "translate-x-0" : "-translate-x-full"}
          ${
            darkMode
              ? "bg-slate-950/98 backdrop-blur-xl border-r border-white/5"
              : "bg-white/98 backdrop-blur-xl border-r border-slate-200 shadow-2xl"
          }`}
      >
        {/* Animated gradient orbs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top-left cyan orb */}
          <div
            className="absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl animate-pulse"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
              animationDuration: "4s",
            }}
          />
          {/* Center-right purple orb */}
          <div
            className="absolute top-1/3 -right-16 w-40 h-40 rounded-full blur-3xl animate-pulse"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
              animationDuration: "5s",
              animationDelay: "1s",
            }}
          />
          {/* Bottom-left pink orb */}
          <div
            className="absolute bottom-20 -left-10 w-36 h-36 rounded-full blur-3xl animate-pulse"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
              animationDuration: "6s",
              animationDelay: "2s",
            }}
          />
          {/* Bottom-right blue orb */}
          <div
            className="absolute -bottom-10 right-10 w-32 h-32 rounded-full blur-3xl animate-pulse"
            style={{
              background: darkMode
                ? "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              animationDuration: "4.5s",
              animationDelay: "0.5s",
            }}
          />
        </div>

        {/* Header - Premium Brand Section */}
        <div
          className={`relative p-5 ${
            darkMode ? "border-b border-white/5" : "border-b border-slate-100"
          }`}
        >
          {/* Close button - top right */}
          <button
            onClick={() => setMenuOpen(false)}
            className={`absolute top-4 right-4 p-2 rounded-xl group ${
              darkMode
                ? "hover:bg-white/10 text-slate-500 hover:text-white"
                : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            }`}
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </button>

          {/* Centered Brand Container */}
          <div className="flex flex-col items-center pt-4 pb-2">
            {/* Logo with gradient border */}
            <div className="relative mb-4">
              <img
                src={
                  darkMode
                    ? "/images/dark_mode_logo.png"
                    : "/images/light_mode_logo.png"
                }
                alt="Logo"
                className="w-16 h-16 rounded-2xl shadow-lg"
              />
            </div>

            {/* Brand name */}
            <h2
              className="font-extrabold text-2xl tracking-tight mb-3"
              style={{
                background: darkMode
                  ? "linear-gradient(90deg, #67e8f9, #a5b4fc, #c4b5fd)"
                  : "linear-gradient(90deg, #0891b2, #6366f1, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Athletix
            </h2>

            {/* Role badge */}
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                darkMode
                  ? roleStylesDark[user?.role] || "text-slate-400 bg-slate-800"
                  : roleStyles[user?.role] || "text-slate-600 bg-slate-100"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    user?.role === "Manager"
                      ? "#f59e0b"
                      : user?.role === "Admin"
                        ? "#8b5cf6"
                        : "#0ea5e9",
                }}
              />
              {user?.role || "Guest"} Portal
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {menuSections.map((section, sectionIdx) => {
            const visibleItems = section.items.filter(
              (item) => user?.role && item.roles.includes(user.role),
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className={sectionIdx > 0 ? "mt-6" : ""}>
                {/* Section Header */}
                <div className="flex items-center gap-2 px-3 mb-3">
                  <h3
                    className={`text-[10px] font-bold tracking-[0.15em] uppercase ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {section.title}
                  </h3>
                  <div
                    className={`flex-1 h-px ${
                      darkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}
                  />
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                          ${
                            active
                              ? `bg-linear-to-r ${item.gradient} text-white shadow-lg ${item.shadowColor}`
                              : darkMode
                                ? "text-slate-400 hover:text-white hover:bg-white/5"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          }`}
                      >
                        {/* Active indicator line */}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/40 rounded-r-full" />
                        )}

                        {/* Icon container */}
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                            active
                              ? "bg-white/20"
                              : darkMode
                                ? "bg-slate-800 group-hover:bg-slate-700"
                                : "bg-slate-100 group-hover:bg-slate-200"
                          }`}
                        >
                          <Icon
                            className={`w-[18px] h-[18px] ${
                              active
                                ? "text-white"
                                : darkMode
                                  ? "text-slate-400 group-hover:text-slate-200"
                                  : "text-slate-500 group-hover:text-slate-700"
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <span className="font-medium text-[14px] tracking-tight">
                          {item.label}
                        </span>

                        {/* Hover arrow indicator */}
                        {!active && (
                          <svg
                            className={`w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${
                              darkMode ? "text-slate-500" : "text-slate-400"
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer / Account */}
        <div
          className={`relative p-4 ${
            darkMode
              ? "bg-linear-to-t from-slate-800/80 to-transparent border-t border-white/5"
              : "bg-linear-to-t from-slate-100 to-transparent border-t border-slate-100"
          }`}
        >
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer}`}
          >
            {/* Avatar with gradient border (matching header) */}
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute -inset-1.5 rounded-xl blur-md opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6, #d946ef)",
                }}
              />
              {/* Gradient border */}
              <div
                className="relative p-0.5 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6, #d946ef)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white overflow-hidden relative"
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  }}
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 bg-linear-to-br from-white/25 via-transparent to-transparent" />
                  <span className="relative z-10 text-sm">
                    {user?.fullname?.charAt(0) || "?"}
                  </span>
                </div>
              </div>
              {/* Online status dot */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 shadow-sm shadow-emerald-500/50 ${
                  darkMode ? "border-slate-900" : "border-white"
                }`}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-semibold truncate ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {user?.fullname || "Guest"}
              </p>
              <p
                className={`text-xs truncate ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
