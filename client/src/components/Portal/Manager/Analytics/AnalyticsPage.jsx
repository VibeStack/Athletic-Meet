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

// Icons
const UsersIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const EventsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </svg>
);

const ActiveIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const EnrollmentIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7a2.5 2.5 0 010-5 2.5 2.5 0 010 5zM3 21.5h8v-2H3v2zm0-4h8v-2H3v2z" />
  </svg>
);

const RefreshIcon = ({ className, spinning }) => (
  <svg
    className={`${className} ${spinning ? "animate-spin" : ""}`}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
  </svg>
);

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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <GenderChartCard data={data?.users?.byGender} darkMode={darkMode} />
        <EventTypeChartCard data={data?.events?.byType} darkMode={darkMode} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <AttendanceChartCard
          data={data?.users?.attendanceBreakdown}
          eventWiseAttendance={data?.events?.eventWiseAttendance}
          darkMode={darkMode}
        />
        <WinnersCard
          data={data?.users?.positionBreakdown}
          darkMode={darkMode}
        />
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <CourseBreakdownCard data={data?.users?.byCourse} darkMode={darkMode} />
        <YearBreakdownCard data={data?.users?.byYear} darkMode={darkMode} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* User Roles */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
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
            User Roles
          </h3>
          <div className="space-y-3">
            {data?.users?.byRole?.map((role) => (
              <div key={role._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      role._id === "Manager"
                        ? "bg-red-500"
                        : role._id === "Admin"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {role._id}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {role.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Day */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
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
            Events by Day
          </h3>
          <div className="space-y-3">
            {data?.events?.byDay?.map((day) => (
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
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {day.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Events by Category */}
        <div
          className={`rounded-2xl p-4 sm:p-6 ${
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
            Events by Category
          </h3>
          <div className="space-y-3">
            {data?.events?.byCategory?.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      cat._id === "Boys" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  />
                  <span
                    className={darkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {cat._id}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {cat.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Status & Profile Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Status */}
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
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              ) : (
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z" />
                </svg>
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
                  ? "Users cannot download certificates"
                  : "Users can download their certificates"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
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
            Profile Completion
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {["true", "partial", "false"].map((status) => {
              const statusData = data?.users?.detailsComplete?.find(
                (d) => d._id === status,
              );
              const count = statusData?.count || 0;
              const label =
                status === "true"
                  ? "Complete"
                  : status === "partial"
                    ? "Partial"
                    : "Incomplete";
              const color =
                status === "true"
                  ? "emerald"
                  : status === "partial"
                    ? "amber"
                    : "red";

              return (
                <div key={status} className="text-center">
                  <p className={`text-2xl font-bold text-${color}-500`}>
                    {count.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p
        className={`text-xs text-center py-8 ${
          darkMode ? "text-slate-600" : "text-slate-400"
        }`}
      >
        © {new Date().getFullYear()} Athletix • Analytics Dashboard
      </p>
    </div>
  );
}
