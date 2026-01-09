import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

const menuItems = [
  {
    label: "Dashboard",
    path: "/portal",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    roles: ["Student", "Admin", "Manager"],
    color: "indigo",
  },
  {
    label: "Events",
    path: "/portal/events",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    roles: ["Student", "Admin", "Manager"],
    color: "purple",
  },
  {
    label: "Certificates",
    path: "/portal/certificates",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    roles: ["Student", "Admin", "Manager"],
    color: "amber",
  },
  {
    label: "Users",
    path: "/portal/admin/users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197",
    roles: ["Admin", "Manager"],
    color: "blue",
  },
  {
    label: "QR Scanner",
    path: "/portal/admin/scanner",
    icon: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z",
    roles: ["Admin", "Manager"],
    color: "emerald",
  },
  {
    label: "Export Data",
    path: "/portal/manager/export",
    icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    roles: ["Manager"],
    color: "rose",
  },
  {
    label: "Event Controls",
    path: "/portal/manager/event-controls",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    roles: ["Manager"],
    color: "orange",
  },
  {
    label: "Certificate Controls",
    path: "/portal/manager/certificate-controls",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    roles: ["Manager"],
    color: "pink",
  },
];

const colorClasses = {
  indigo: {
    active: "bg-indigo-500",
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
  },
  purple: {
    active: "bg-purple-500",
    bg: "bg-purple-500/10",
    text: "text-purple-500",
  },
  amber: {
    active: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  blue: { active: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-500" },
  emerald: {
    active: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
  rose: { active: "bg-rose-500", bg: "bg-rose-500/10", text: "text-rose-500" },
  orange: {
    active: "bg-orange-500",
    bg: "bg-orange-500/10",
    text: "text-orange-500",
  },
  pink: { active: "bg-pink-500", bg: "bg-pink-500/10", text: "text-pink-500" },
};

export default function HamburgerMenu({ isOpen, onClose }) {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${darkMode ? "bg-slate-900" : "bg-white"} shadow-2xl`}
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div
          className={`p-5 border-b ${
            darkMode ? "border-slate-800" : "border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div>
                <h2
                  className={`font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Athletix
                </h2>
                <p
                  className={`text-xs ${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  {user?.role} Portal
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "hover:bg-slate-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
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
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            const colors = colorClasses[item.color];
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? `${colors.active} text-white shadow-lg`
                    : darkMode
                    ? `text-gray-300 hover:bg-slate-800 hover:${colors.text}`
                    : `text-gray-600 hover:${colors.bg} hover:${colors.text}`
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-gray-100 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.fullname?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-semibold truncate ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {user?.fullname || user?.username}
              </p>
              <p
                className={`text-xs truncate ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
