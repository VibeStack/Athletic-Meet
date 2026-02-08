import { useState, useEffect } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import axios from "axios";

import StatCard from "./cards/StatCard";
import GenderChartCard from "./cards/GenderChartCard";
import EventTypeChartCard from "./cards/EventTypeChartCard";
import AttendanceChartCard from "./cards/AttendanceChartCard";
import WinnersCard from "./cards/WinnersCard";
import CourseBreakdownCard from "./cards/CourseBreakdownCard";
import YearBreakdownCard from "./cards/YearBreakdownCard";
import LoadingComponent from "../../LoadingComponent";
import {
  UsersIcon,
  EventsIcon,
  ActiveIcon,
  EnrollmentIcon,
  RefreshIcon,
} from "../../../../icons/Portal/Manager/AnalyticsIcons";

import QuickActionsCard from "./cards/QuickActionsCard";
import { LockIcon, UnlockIcon } from "../../../../icons/Portal/Manager/EventControlsIcons";

const ROLE_COLORS = {
  Admin: "bg-emerald-500",
  Manager: "bg-red-500",
  User: "bg-amber-400",
};

const CATEGORY_COLORS = {
  Boys: "bg-blue-500",
  Girls: "bg-pink-500",
};

const PROFILE_TEXT_COLORS = {
  true: "text-emerald-500",
  partial: "text-amber-500",
  false: "text-red-500",
};

export default function AnalyticsPage() {
  const { darkMode } = useTheme();
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(`${API_URL}/manager/analytics`, {
        withCredentials: true,
      });
      setData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [API_URL]);

  // Extract stats
  const totalUsers = data?.users?.total?.[0]?.count || 0;
  const totalEvents = data?.events?.total?.[0]?.count || 0;
  const activeEvents =
    data?.events?.activeStatus?.find((s) => s._id === true)?.count || 0;
  const totalEnrollments = data?.users?.totalEnrollments?.[0]?.count || 0;

  if (loading) {
    return (
      <LoadingComponent
        title="Loading Analytics"
        message="Fetching statistics and insights..."
        darkMode={darkMode}
      />
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <div
          className={`text-center p-8 rounded-2xl ${
            darkMode ? "bg-slate-900/80" : "bg-white shadow-lg"
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Error Loading Analytics
          </h3>
          <p
            className={`mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {error}
          </p>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-8 ${
        darkMode ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Analytics Dashboard
          </h1>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Real-time statistics and insights for the athletics meet
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            darkMode
              ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
          } ${refreshing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <RefreshIcon className="w-5 h-5" spinning={refreshing} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Users"
          value={totalUsers}
          hint="Registered accounts"
          icon={UsersIcon}
          gradient="from-blue-500 to-cyan-500"
          darkMode={darkMode}
        />
        <StatCard
          label="Total Events"
          value={totalEvents}
          hint="All event types"
          icon={EventsIcon}
          gradient="from-violet-500 to-purple-600"
          darkMode={darkMode}
        />
        <StatCard
          label="Active Events"
          value={activeEvents}
          hint="Currently enabled"
          icon={ActiveIcon}
          gradient="from-emerald-500 to-green-600"
          darkMode={darkMode}
        />
        <StatCard
          label="Total Enrollments"
          value={totalEnrollments}
          hint="Event participations"
          icon={EnrollmentIcon}
          gradient="from-amber-500 to-orange-600"
          darkMode={darkMode}
        />
      </div>
      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActionsCard darkMode={darkMode} />
      </div>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <GenderChartCard data={data?.users?.byGender} darkMode={darkMode} />
        <AttendanceChartCard
          data={data?.users?.attendanceBreakdown}
          eventWiseAttendance={data?.events?.eventWiseAttendance}
          darkMode={darkMode}
        />
      </div>
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <CourseBreakdownCard data={data?.users?.byCourse} darkMode={darkMode} />
        <EventTypeChartCard data={data?.events?.byType} darkMode={darkMode} />
      </div>
      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <WinnersCard
          data={data?.users?.positionBreakdown}
          darkMode={darkMode}
        />
        <YearBreakdownCard data={data?.users?.byYear} darkMode={darkMode} />
      </div>

      {/* ================= ADDITIONAL STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* ===== User Roles ===== */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
            darkMode
              ? "bg-slate-900/80 border border-slate-800/50"
              : "bg-white border border-slate-200/50 shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            User Roles
          </h3>

          <div className="space-y-3">
            {(data?.users?.byRole || []).map((role) => (
              <div key={role._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${ROLE_COLORS[role._id] || "bg-slate-400"}`}
                  />
                  <span
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {role._id}
                  </span>
                </div>
                <span
                  className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {(role.count ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Events by Day ===== */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
            darkMode
              ? "bg-slate-900/80 border border-slate-800/50"
              : "bg-white border border-slate-200/50 shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Events by Day
          </h3>

          <div className="space-y-3">
            {(data?.events?.byDay || []).map((day) => (
              <div key={day._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-linear-to-r from-cyan-500 to-blue-500" />
                  <span
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {day._id}
                  </span>
                </div>
                <span
                  className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {(day.count ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Events by Category ===== */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
            darkMode
              ? "bg-slate-900/80 border border-slate-800/50"
              : "bg-white border border-slate-200/50 shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Events by Category
          </h3>

          <div className="space-y-3">
            {(data?.events?.byCategory || []).map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat._id] || "bg-slate-400"}`}
                  />
                  <span
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {cat._id}
                  </span>
                </div>
                <span
                  className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {(cat.count ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CERTIFICATE & PROFILE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===== Certificate Status ===== */}

        <div
          className={`rounded-2xl p-6 ${
            darkMode
              ? "bg-slate-900/80 border border-slate-800/50"
              : "bg-white border border-slate-200/50 shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Certificate Status
          </h3>

          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                data?.certificatesLocked
                  ? "bg-red-500/20 text-red-500"
                  : "bg-emerald-500/20 text-emerald-500"
              }`}
            >
              {data?.certificatesLocked ? (
                <LockIcon className="w-7 h-7 fill-current" />
              ) : (
                <UnlockIcon className="w-7 h-7 fill-current" />
              )}
            </div>

            <div>
              <p
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {data?.certificatesLocked ? "Locked" : "Unlocked"}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {data?.certificatesLocked
                  ? "Certificate downloads are disabled"
                  : "Users can download certificates"}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Profile Completion ===== */}
        <div
          className={`rounded-2xl p-6 ${
            darkMode
              ? "bg-slate-900/80 border border-slate-800/50"
              : "bg-white border border-slate-200/50 shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Profile Completion
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {["true", "partial", "false"].map((status) => {
              const statusData = data?.users?.detailsComplete?.find(
                (d) => d._id === status,
              );
              const count = statusData?.count ?? 0;

              const label =
                status === "true"
                  ? "Complete"
                  : status === "partial"
                    ? "Partial"
                    : "Incomplete";

              return (
                <div key={status} className="text-center">
                  <p
                    className={`text-2xl font-bold ${PROFILE_TEXT_COLORS[status]}`}
                  >
                    {count.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ================= FOOTER ================= */}
      <p
        className={`text-xs text-center py-8 ${darkMode ? "text-slate-600" : "text-slate-400"}`}
      >
        © {new Date().getFullYear()} Athletix • Analytics Dashboard
      </p>
    </div>
  );
}
