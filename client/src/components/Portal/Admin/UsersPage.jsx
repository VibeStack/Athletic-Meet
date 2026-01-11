import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../ThemeContext";

const courses = [
  "All Courses",
  "B.Tech",
  "M.Tech",
  "MBA",
  "MCA",
  "B.Voc.",
  "B.Com",
  "BBA",
  "BCA",
  "B.Arch",
];
const years = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function UsersPage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All Courses");
  const [filterYear, setFilterYear] = useState("All Years");
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        withCredentials: true,
      });
      console.log("API Response:", response.data);
      // Handle both possible response structures
      const usersData =
        response.data.data?.users || response.data.message?.users || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jerseyNumber?.toString().includes(searchTerm);
    const matchesCourse =
      filterCourse === "All Courses" || user.course === filterCourse;
    const matchesYear = filterYear === "All Years" || user.year === filterYear;
    return matchesSearch && matchesCourse && matchesYear;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCourse("All Courses");
    setFilterYear("All Years");
  };

  const activeFiltersCount = [
    filterCourse !== "All Courses",
    filterYear !== "All Years",
  ].filter(Boolean).length;

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return darkMode
          ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
          : "bg-purple-100 text-purple-700 border-purple-200";
      case "Manager":
        return darkMode
          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
          : "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return darkMode
          ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400/30 rounded-full border-t-cyan-400 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading users...
          </p>
        </div>
      </div>
    );
  }

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
            Users 👥
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Manage registered students and staff
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            darkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <svg
            className="w-5 h-5 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span
            className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {filteredUsers.length}
          </span>
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            / {users.length}
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or jersey..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl transition-all ${
              darkMode
                ? "bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:border-cyan-500"
                : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            showFilters || activeFiltersCount > 0
              ? "bg-cyan-500 text-white shadow-lg"
              : darkMode
              ? "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-white text-cyan-500 rounded-full text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          className={`rounded-2xl p-5 ${
            darkMode
              ? "bg-slate-800/50 border border-slate-700/50"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Course
              </label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl transition-all ${
                  darkMode
                    ? "bg-slate-700 border border-slate-600 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                } focus:outline-none focus:border-cyan-500`}
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className={`block text-sm mb-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl transition-all ${
                  darkMode
                    ? "bg-slate-700 border border-slate-600 text-white"
                    : "bg-gray-50 border border-gray-200 text-gray-900"
                } focus:outline-none focus:border-cyan-500`}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl ${
            darkMode
              ? "bg-slate-800/50 border border-slate-700/50"
              : "bg-white border border-gray-200"
          }`}
        >
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-300"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            No users found
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 text-cyan-500 hover:text-cyan-600 text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/portal/admin/users/${user.id}`)}
              className={`group p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                darkMode
                  ? "bg-slate-800/70 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                  : "bg-white border border-gray-200 hover:border-cyan-400 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Header: Jersey + Name */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${
                    darkMode
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-amber-100 text-amber-600 border border-amber-200"
                  }`}
                >
                  {user.jerseyNumber || "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.fullname || user.username}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {user.email}
                  </p>
                  {user.role !== "Student" && (
                    <span
                      className={`inline-flex px-2 py-0.5 mt-1 text-xs font-medium rounded-full border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div
                  className={`px-3 py-2 rounded-lg ${
                    darkMode ? "bg-slate-700/50" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Course
                  </p>
                  <p
                    className={`text-sm font-medium truncate ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {user.course || "—"}
                  </p>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    darkMode ? "bg-slate-700/50" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Year
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {user.year || "—"}
                  </p>
                </div>
              </div>

              {/* Footer: Events + Arrow */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-50 text-cyan-600"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {user.eventsCount || 0}
                  </span>
                  <span className="text-xs">events</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                    darkMode
                      ? "text-gray-600 group-hover:text-cyan-400"
                      : "text-gray-300 group-hover:text-cyan-500"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
