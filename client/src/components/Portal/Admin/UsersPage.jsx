import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useTheme } from "../ThemeContext";

// Event categories and events for filtering
const eventCategories = {
  "Track Events": [
    "100m Sprint",
    "200m Sprint",
    "400m Race",
    "800m Race",
    "1500m Race",
    "5000m Race",
  ],
  "Field Events": [
    "Long Jump",
    "High Jump",
    "Triple Jump",
    "Shot Put",
    "Discus Throw",
    "Javelin Throw",
  ],
};

const allEvents = [
  ...eventCategories["Track Events"],
  ...eventCategories["Field Events"],
];

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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("All Courses");
  const [filterBranch, setFilterBranch] = useState("All Branches");
  const [filterYear, setFilterYear] = useState("All Years");
  const [filterEventCategory, setFilterEventCategory] =
    useState("All Categories");
  const [filterEvent, setFilterEvent] = useState("All Events");
  const [sortBy, setSortBy] = useState("jerseyNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        withCredentials: true,
      });
      if (response.data.success) {
        // Filter only students and add mock event data
        const students = response.data.data.users
          .filter((u) => u.role === "Student")
          .map((u) => ({
            ...u,
            // Mock enrolled events (would come from API)
            enrolledEvents: allEvents.slice(
              0,
              Math.floor(Math.random() * 4) + 1
            ),
          }));
        setUsers(students);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique branches for filter
  const branches = [
    "All Branches",
    ...new Set(users.map((u) => u.branch).filter(Boolean)),
  ];

  // Get available events based on category
  const availableEvents =
    filterEventCategory === "All Categories"
      ? ["All Events", ...allEvents]
      : filterEventCategory === "Track Events"
      ? ["All Events", ...eventCategories["Track Events"]]
      : ["All Events", ...eventCategories["Field Events"]];

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.crn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.jerseyNumber?.toString().includes(searchTerm);
      const matchesCourse =
        filterCourse === "All Courses" || user.course === filterCourse;
      const matchesBranch =
        filterBranch === "All Branches" || user.branch === filterBranch;
      const matchesYear =
        filterYear === "All Years" || user.year === filterYear;

      // Event filtering
      let matchesEvent = true;
      if (filterEvent !== "All Events") {
        matchesEvent = user.enrolledEvents?.includes(filterEvent);
      } else if (filterEventCategory !== "All Categories") {
        const categoryEvents = eventCategories[filterEventCategory] || [];
        matchesEvent = user.enrolledEvents?.some((e) =>
          categoryEvents.includes(e)
        );
      }

      return (
        matchesSearch &&
        matchesCourse &&
        matchesBranch &&
        matchesYear &&
        matchesEvent
      );
    })
    .sort((a, b) => {
      let aVal = a[sortBy] || "";
      let bVal = b[sortBy] || "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeleting(userId);
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditMode(true);
  };

  const handleSaveEdit = async (updatedUser) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/users/${updatedUser._id}`,
        updatedUser,
        { withCredentials: true }
      );
      if (response.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === updatedUser._id
              ? { ...response.data.data, enrolledEvents: u.enrolledEvents }
              : u
          )
        );
        setEditMode(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getAttendanceStyle = (attendance) => {
    switch (attendance) {
      case "Present":
        return "bg-green-100 text-green-700 border-green-200";
      case "Absent":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCourse("All Courses");
    setFilterBranch("All Branches");
    setFilterYear("All Years");
    setFilterEventCategory("All Categories");
    setFilterEvent("All Events");
  };

  const activeFiltersCount = [
    filterCourse !== "All Courses",
    filterBranch !== "All Branches",
    filterYear !== "All Years",
    filterEventCategory !== "All Categories",
    filterEvent !== "All Events",
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Users
          </h1>
          <p className="text-gray-500 mt-1">Manage registered students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
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
            <span className="text-gray-900 font-bold">
              {filteredUsers.length}
            </span>
            <span className="text-gray-500 text-sm">/ {users.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="Search by name, username, CRN, or jersey..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            showFilters || activeFiltersCount > 0
              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
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

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Advanced Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">Course</label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">Branch</label>
              <select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Category Filter */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Event Type
              </label>
              <select
                value={filterEventCategory}
                onChange={(e) => {
                  setFilterEventCategory(e.target.value);
                  setFilterEvent("All Events");
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Track Events">🏃 Track Events</option>
                <option value="Field Events">🥏 Field Events</option>
              </select>
            </div>

            {/* Specific Event Filter */}
            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Specific Event
              </label>
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                {availableEvents.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    onClick={() => toggleSort("jerseyNumber")}
                    className="text-left text-gray-600 text-sm font-semibold px-4 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Jersey
                      {sortBy === "jerseyNumber" && (
                        <svg
                          className={`w-4 h-4 ${
                            sortOrder === "desc" ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("fullname")}
                    className="text-left text-gray-600 text-sm font-semibold px-4 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Student
                      {sortBy === "fullname" && (
                        <svg
                          className={`w-4 h-4 ${
                            sortOrder === "desc" ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="text-left text-gray-600 text-sm font-semibold px-4 py-4 hidden md:table-cell">
                    Course
                  </th>
                  <th className="text-left text-gray-600 text-sm font-semibold px-4 py-4 hidden lg:table-cell">
                    Branch
                  </th>
                  <th className="text-left text-gray-600 text-sm font-semibold px-4 py-4 hidden xl:table-cell">
                    Events
                  </th>
                  <th className="text-left text-gray-600 text-sm font-semibold px-4 py-4 hidden sm:table-cell">
                    Attendance
                  </th>
                  <th className="text-right text-gray-600 text-sm font-semibold px-4 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-amber-100 to-orange-100 text-amber-600 font-bold border border-amber-200">
                        {user.jerseyNumber || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-gray-900 font-medium">
                          {user.fullname || user.username}
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div>
                        <p className="text-gray-700 text-sm">
                          {user.course || "-"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {user.year || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p
                        className="text-gray-700 text-sm truncate max-w-[150px]"
                        title={user.branch}
                      >
                        {user.branch || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.enrolledEvents?.slice(0, 2).map((event, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-xs rounded-full border border-cyan-200"
                          >
                            {event}
                          </span>
                        ))}
                        {user.enrolledEvents?.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{user.enrolledEvents.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg border ${getAttendanceStyle(
                          user.attendance
                        )}`}
                      >
                        {user.attendance || "Not Marked"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-lg transition-all"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === user._id ? (
                            <svg
                              className="w-4 h-4 animate-spin"
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
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
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
              <p className="text-gray-500">
                No users found matching your filters
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 text-cyan-500 hover:text-cyan-600 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editMode && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setEditMode(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

// Edit User Modal Component (Light Mode)
function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullname: user.fullname || "",
    gender: user.gender || "",
    course: user.course || "",
    branch: user.branch || "",
    year: user.year || "",
    phone: user.phone || "",
    crn: user.crn || "",
    urn: user.urn || "",
  });
  const [saving, setSaving] = useState(false);

  const courses = [
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
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const genders = ["Male", "Female", "Other"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...formData, _id: user._id });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-gray-900 font-bold text-lg">Edit User</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Full Name */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
            >
              <option value="">Select Gender</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Course */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Course</label>
              <select
                value={formData.course}
                onChange={(e) => handleChange("course", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Year</label>
              <select
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Branch */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Branch</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CRN */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">CRN</label>
              <input
                type="text"
                value={formData.crn}
                onChange={(e) => handleChange("crn", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* URN */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">URN</label>
              <input
                type="text"
                value={formData.urn}
                onChange={(e) => handleChange("urn", e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-100 border border-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-500/25"
          >
            {saving && (
              <svg
                className="w-4 h-4 animate-spin"
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
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
