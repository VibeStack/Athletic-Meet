import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

// ========== CUSTOM SVG ICONS ==========
const DashboardIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);

const EventsIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 4.08-3.05 7.44-7 7.93v2.02c5.05-.5 9-4.76 9-9.95S18.05 2.55 13 2.05zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7c3.87 0 7 3.13 7 7s-3.13 7-7 7z" />
  </svg>
);

const CertificateIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const QrIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM19 13v1.5h-1.5V13H19z" />
  </svg>
);

const ExportIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const TrophyIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.5 1.9 4.6 4.4 4.9A5 5 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5 5 0 003.6-3C19.1 12.6 21 10.5 21 8V7a2 2 0 00-2-2z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
  </svg>
);

const CertificateControlIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${
      className || "w-5 h-5"
    } transition-all duration-300 group-hover:scale-110 group-hover:rotate-1`}
    fill="currentColor"
  >
    {/* Robust Lock Shackle - Scaled up for prominence */}
    <path
      d="M18 9V5.5a6 6 0 00-12 0V9H4v13a2 2 0 002 2h12a2 2 0 002-2V9h-2zM8 5.5a4 4 0 018 0V9H8V5.5z"
      opacity="0.3"
    />
    {/* Larger Shield-shaped Body with bigger cutout Star */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 9v6c0 5 4 8 8 9 4-1 8-4 8-9V9H4z M12 11.2l1.2 2.4 2.6.4-1.9 1.9.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.9 2.6-.4 1.2-2.4z M12 20.2 a0.8 0.8 0 1 1 0 -1.6 a0.8 0.8 0 0 1 0 1.6 z"
    />

    {/* Texture details */}
    <rect x="7" y="11" width="2" height="0.6" rx="0.3" opacity="0.4" />
    <rect x="15" y="11" width="2" height="0.6" rx="0.3" opacity="0.4" />
  </svg>
);

const AddEventIcon = ({ className }) => (
  <svg
    className={className || "w-5 h-5"}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

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
        label: "Export Data",
        path: "/portal/manager/export",
        roles: ["Manager"],
        gradient: "from-rose-400 to-pink-600",
        shadowColor: "shadow-rose-500/30",
        icon: ExportIcon,
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
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Panel with slide animation */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
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
            className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 group ${
              darkMode
                ? "hover:bg-white/10 text-slate-500 hover:text-white"
                : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            }`}
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              SprintSync
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
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
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
                          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                            active
                              ? "bg-white/20"
                              : darkMode
                                ? "bg-slate-800 group-hover:bg-slate-700"
                                : "bg-slate-100 group-hover:bg-slate-200"
                          }`}
                        >
                          <Icon
                            className={`w-[18px] h-[18px] transition-colors ${
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
                            className={`w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${
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
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              darkMode ? "hover:bg-white/5" : "hover:bg-slate-200/50"
            }`}
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

            {/* Expand icon */}
            <svg
              className={`w-4 h-4 ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
}
