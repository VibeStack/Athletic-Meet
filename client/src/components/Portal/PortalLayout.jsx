import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import HamburgerMenu from "./HamburgerMenu";

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950"
          : "bg-linear-to-br from-cyan-50/30 via-white to-blue-50/30"
      }`}
    >
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 ${
          darkMode
            ? "bg-slate-900/95 border-b border-slate-800"
            : "bg-white/80 backdrop-blur-md border-b border-cyan-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-slate-800"
                    : "text-cyan-600 hover:bg-cyan-50"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/25">
                  A
                </div>
                <div className="hidden sm:block">
                  <h1
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Athletix
                  </h1>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    64th Athletic Meet
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode
                    ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                    : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"
                }`}
              >
                {darkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              <div
                className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl ${
                  darkMode
                    ? "bg-slate-800"
                    : "bg-linear-to-r from-cyan-50 to-blue-50 border border-cyan-100"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullname?.charAt(0) ||
                    user?.username?.charAt(0) ||
                    "?"}
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {user?.fullname?.split(" ")[0] || user?.username}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    {user?.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode
                    ? "bg-slate-800 text-red-400 hover:bg-red-500/20"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                }`}
              >
                {loggingOut ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
