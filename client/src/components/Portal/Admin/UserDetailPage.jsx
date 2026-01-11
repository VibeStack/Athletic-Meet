import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedEventToAdd, setSelectedEventToAdd] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUserDetails();
    fetchAllEvents();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/user/${userId}`, {
        withCredentials: true,
      });
      if (data.success) {
        setUser(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      alert("Failed to load user details");
      navigate("/portal/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user/events`, {
        withCredentials: true,
      });
      setAllEvents(data.data || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  const handleMarkAttendance = async (eventId, status) => {
    setActionLoading(`attendance-${eventId}`);
    try {
      await axios.post(
        `${API_URL}/admin/users/attendance`,
        { jerseyNumber: user.jerseyNumber, eventId },
        { withCredentials: true }
      );
      await fetchUserDetails();
      alert(`✅ Marked as ${status}!`);
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("❌ Failed to mark attendance");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateRole = async (newRole) => {
    if (!confirm(`Are you sure you want to make this user ${newRole}?`)) return;

    setActionLoading("role");
    try {
      await axios.patch(
        `${API_URL}/admin/user/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
      await fetchUserDetails();
      alert(`✅ User role updated to ${newRole}!`);
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("❌ Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlockEvents = async () => {
    if (
      !confirm(
        "Are you sure you want to unlock and clear all events for this user?"
      )
    )
      return;

    setActionLoading("unlock");
    try {
      await axios.patch(
        `${API_URL}/admin/user/${userId}`,
        { selectedEvents: [] },
        { withCredentials: true }
      );
      await fetchUserDetails();
      alert("✅ Events unlocked and cleared!");
    } catch (err) {
      console.error("Failed to unlock events:", err);
      alert("❌ Failed to unlock events");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to DELETE this user? This action cannot be undone!"
      )
    )
      return;
    if (!confirm("This is your last chance. Delete this user permanently?"))
      return;

    setActionLoading("delete");
    try {
      await axios.delete(`${API_URL}/admin/user/${userId}`, {
        withCredentials: true,
      });
      alert("✅ User deleted successfully");
      navigate("/portal/admin/users");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("❌ Failed to delete user");
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return darkMode
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
          : "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Absent":
        return darkMode
          ? "bg-red-500/20 text-red-400 border-red-500/30"
          : "bg-red-100 text-red-700 border-red-200";
      default:
        return darkMode
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  // Get events available to add (filter by user gender and not already selected)
  const availableEventsToAdd = allEvents.filter((event) => {
    const userCategory = user?.gender === "Male" ? "Boys" : "Girls";
    const isCorrectCategory = event.category === userCategory;
    const notAlreadySelected = !user?.selectedEvents?.some(
      (e) => e.id === event.id
    );
    return isCorrectCategory && notAlreadySelected;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400/30 rounded-full border-t-cyan-400 mx-auto mb-4"></div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Back Button + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/portal/admin/users")}
            className={`flex items-center gap-2 mb-2 text-sm font-medium transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Users
          </button>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            User Details
          </h1>
        </div>

        {/* Jersey Badge */}
        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
            darkMode
              ? "bg-amber-500/20 border border-amber-500/30"
              : "bg-amber-100 border border-amber-200"
          }`}
        >
          <span
            className={`text-2xl font-bold ${
              darkMode ? "text-amber-400" : "text-amber-600"
            }`}
          >
            #{user.jerseyNumber || "—"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Basic Info Card */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h2
              className={`font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="text-lg">👤</span>
              Basic Info
            </h2>

            <div className="space-y-3">
              <InfoRow
                darkMode={darkMode}
                label="Name"
                value={user.fullname || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="Username"
                value={user.username}
              />
              <InfoRow darkMode={darkMode} label="Email" value={user.email} />
              <InfoRow
                darkMode={darkMode}
                label="Phone"
                value={user.phone || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="Gender"
                value={user.gender || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="Role"
                value={user.role}
                highlight
              />
            </div>
          </div>

          {/* Academic Info Card */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h2
              className={`font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="text-lg">🎓</span>
              Academic Info
            </h2>

            <div className="space-y-3">
              <InfoRow
                darkMode={darkMode}
                label="Course"
                value={user.course || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="Branch"
                value={user.branch || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="Year"
                value={user.year || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="CRN"
                value={user.crn || "—"}
              />
              <InfoRow
                darkMode={darkMode}
                label="URN"
                value={user.urn || "—"}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Events + Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected Events */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`font-semibold flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="text-lg">🏃</span>
                Selected Events
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    darkMode
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-cyan-100 text-cyan-600"
                  }`}
                >
                  {user.selectedEvents?.length || 0}
                </span>
              </h2>

              {user.selectedEvents?.length > 0 && (
                <button
                  onClick={handleUnlockEvents}
                  disabled={actionLoading === "unlock"}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1 ${
                    darkMode
                      ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200"
                  }`}
                >
                  {actionLoading === "unlock" ? (
                    <div className="animate-spin h-3 w-3 border-2 border-current rounded-full border-t-transparent"></div>
                  ) : (
                    <span>🔓</span>
                  )}
                  Unlock & Clear
                </button>
              )}
            </div>

            {!user.selectedEvents?.length ? (
              <p
                className={`text-center py-8 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No events selected
              </p>
            ) : (
              <div className="space-y-3">
                {user.selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl flex items-center justify-between ${
                      darkMode
                        ? "bg-slate-700/50 border border-slate-600/50"
                        : "bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎯</span>
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {event.name}
                        </p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {event.type} • {event.day}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {event.status || "Not Marked"}
                      </span>

                      {event.status !== "Present" && (
                        <button
                          onClick={() =>
                            handleMarkAttendance(event.id, "Present")
                          }
                          disabled={actionLoading === `attendance-${event.id}`}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            darkMode
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          }`}
                        >
                          {actionLoading === `attendance-${event.id}`
                            ? "..."
                            : "✓ Present"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <div
            className={`rounded-2xl p-5 ${
              darkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <h2
              className={`font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="text-lg">⚙️</span>
              Admin Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Make Admin */}
              {currentUser?.role === "Admin" && user.role !== "Admin" && (
                <button
                  onClick={() => handleUpdateRole("Admin")}
                  disabled={actionLoading === "role"}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode
                      ? "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30"
                      : "bg-purple-100 hover:bg-purple-200 border border-purple-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-purple-300" : "text-purple-700"
                        }`}
                      >
                        Make Admin
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        Grant admin privileges
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {/* Make Manager */}
              {currentUser?.role === "Admin" && user.role === "Student" && (
                <button
                  onClick={() => handleUpdateRole("Manager")}
                  disabled={actionLoading === "role"}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode
                      ? "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30"
                      : "bg-blue-100 hover:bg-blue-200 border border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎖️</span>
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Make Manager
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        Grant manager privileges
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {/* Demote to Student */}
              {currentUser?.role === "Admin" && user.role !== "Student" && (
                <button
                  onClick={() => handleUpdateRole("Student")}
                  disabled={actionLoading === "role"}
                  className={`p-4 rounded-xl text-left transition-all ${
                    darkMode
                      ? "bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30"
                      : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p
                        className={`font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Demote to Student
                      </p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Remove privileges
                      </p>
                    </div>
                  </div>
                </button>
              )}

              {/* Delete User */}
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading === "delete"}
                className={`p-4 rounded-xl text-left transition-all ${
                  darkMode
                    ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
                    : "bg-red-100 hover:bg-red-200 border border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {actionLoading === "delete" ? (
                    <div className="animate-spin h-6 w-6 border-3 border-red-400 rounded-full border-t-transparent"></div>
                  ) : (
                    <span className="text-2xl">🗑️</span>
                  )}
                  <div>
                    <p
                      className={`font-medium ${
                        darkMode ? "text-red-300" : "text-red-700"
                      }`}
                    >
                      Delete User
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      Permanently remove
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ darkMode, label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight
            ? darkMode
              ? "text-cyan-400"
              : "text-cyan-600"
            : darkMode
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
