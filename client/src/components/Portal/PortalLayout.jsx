import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useUserDetail } from "../../context/UserDetailContext";
import HamburgerMenu from "./HamburgerMenu";

const HamburgerIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const SunIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export default function PortalLayout() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const { userDetail, fetchUserDetails } = useUserDetail();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadUser = async () => {
      await fetchUserDetails();
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );

      if (response?.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return null;

  const avatarLetter =
    userDetail?.fullname?.charAt(0) || userDetail?.username?.charAt(0) || "?";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-linear-to-br from-cyan-50 via-white to-blue-50"
      }`}
    >
      <header className="fixed inset-x-0 top-4 z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div
            className={`h-16 rounded-2xl backdrop-blur-2xl transition-all duration-500 ${
              darkMode
                ? "bg-slate-900/50 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.65)]"
                : "bg-white/80 border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="h-full rounded-2xl px-5 flex items-center justify-between bg-linear-to-b from-white/10 to-transparent">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="relative p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  <HamburgerIcon className="w-5 h-5 opacity-80" />
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={
                      darkMode
                        ? "/images/dark_mode_logo.png"
                        : "/images/light_mode_logo.png"
                    }
                    alt="Logo"
                    className="w-10 h-10 rounded-xl"
                  />

                  <div className="hidden sm:block leading-tight">
                    <h1
                      className={`font-extrabold tracking-wide ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Athletix
                    </h1>
                    <p
                      className={`text-xs ${
                        darkMode
                          ? "bg-linear-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold"
                          : "text-slate-800 font-medium opacity-80"
                      }`}
                    >
                      65th Athletic Meet
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  <span
                    className={`absolute inset-0 rounded-xl blur-lg transition-opacity ${
                      darkMode ? "bg-yellow-400/20" : "bg-slate-400/20"
                    }`}
                  />
                  {darkMode ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-slate-700" />
                  )}
                </button>

                {!loading && userDetail && (
                  <div
                    className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl ${
                      darkMode
                        ? "bg-slate-800/70"
                        : "bg-white/80 border border-slate-200"
                    }`}
                  >
                    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5">
                      <div
                        className={`relative w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold overflow-hidden ${
                          darkMode
                            ? "bg-linear-to-br from-cyan-500 to-blue-500 text-white"
                            : "text-white"
                        }`}
                        style={
                          !darkMode
                            ? {
                                background:
                                  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)",
                              }
                            : {}
                        }
                      >
                        {!darkMode && (
                          <span className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent" />
                        )}
                        <span className="relative z-10">{avatarLetter}</span>
                      </div>

                      <div className="leading-tight">
                        <p
                          className={`text-sm font-semibold ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {userDetail?.fullname?.split(" ")[0] ||
                            userDetail?.username}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-cyan-400" : "text-slate-500"
                          }`}
                        >
                          {userDetail?.role}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-6 bg-black/10 dark:bg-white/10" />

                    <button
                      onClick={() => setShowLogoutPopup(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 font-semibold hover:bg-red-500/10 transition"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <HamburgerMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={userDetail}
      />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet context={{ user: userDetail }} />
        </div>
      </main>

      {/* ================= LOGOUT CONFIRMATION POPUP ================= */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutPopup(false)}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user role/gender */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
                  userDetail?.role === "Manager"
                    ? "bg-red-500/20"
                    : userDetail?.role === "Admin"
                      ? userDetail?.gender === "Male"
                        ? "bg-sky-500/20"
                        : userDetail?.gender === "Female"
                          ? "bg-pink-500/20"
                          : "bg-emerald-500/20"
                      : "bg-slate-500/20"
                }`}
              />
            )}

            <div className="relative p-6 text-center">
              {/* Icon - Color based on role/gender */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  userDetail?.role === "Manager"
                    ? "bg-red-500/10"
                    : userDetail?.role === "Admin"
                      ? userDetail?.gender === "Male"
                        ? "bg-sky-500/10"
                        : userDetail?.gender === "Female"
                          ? "bg-pink-500/10"
                          : "bg-emerald-500/10"
                      : "bg-slate-500/10"
                }`}
              >
                <LogoutIcon
                  className={`w-8 h-8 ${
                    userDetail?.role === "Manager"
                      ? "text-red-500"
                      : userDetail?.role === "Admin"
                        ? userDetail?.gender === "Male"
                          ? "text-sky-500"
                          : userDetail?.gender === "Female"
                            ? "text-pink-500"
                            : "text-emerald-500"
                        : darkMode
                          ? "text-slate-400"
                          : "text-slate-600"
                  }`}
                />
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Confirm Logout
              </h3>
              <p
                className={`text-sm mb-6 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Are you sure you want to logout from your account?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    darkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutPopup(false);
                    handleLogout();
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${
                    userDetail?.role === "Manager"
                      ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                      : userDetail?.role === "Admin"
                        ? userDetail?.gender === "Male"
                          ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                          : userDetail?.gender === "Female"
                            ? "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                            : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                        : "bg-linear-to-r from-slate-700 to-slate-800 shadow-slate-500/25"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
