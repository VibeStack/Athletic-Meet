import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import UserDetailHeader from "./UserDetail/UserDetailHeader";
import UserDetailEvents from "./UserDetail/UserDetailEvents";
import UserDetailInfo from "./UserDetail/UserDetailInfo";
import ManagerDetailsAccessDenied from "./ManagerDetailsAccessDenied";
import { useUserDetail } from "../../../context/UserDetailContext";

export default function UserDetailPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { darkMode } = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [studentUserData, setStudentUserData] = useState({});
  const [studentUserEventsList, setStudentUserEventsList] = useState([]);
  const [isUserEventsLocked, setIsUserEventsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteState, setDeleteState] = useState("confirm"); // 'confirm' | 'deleting' | 'success'
  const [accessDenied, setAccessDenied] = useState(false);

  // Get current logged-in user
  const { user } = useOutletContext();
  const { userDetail, setUserEventsList } = useUserDetail(); // user and userDetail are same ok

  const fetchUser = async () => {
    try {
      const { data: response } = await axios.get(
        `${API_URL}/admin/user/${userId}`,
        { withCredentials: true },
      );

      // Access control: Admin cannot view Manager details
      if (user?.role === "Admin" && response.data.role === "Manager") {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setStudentUserData(response.data);
      setStudentUserEventsList(response.data.selectedEvents);
      setIsUserEventsLocked(response.data.isEventsLocked);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const lockUserEvents = async () => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/admin/users/${studentUserData.id}/events/lock`,
        {},
        { withCredentials: true },
      );
      setIsUserEventsLocked(true);
      if (studentUserData.id === user.id) {
        setUserEventsList(response.data);
      }
      setStudentUserEventsList(response.data);
    } catch (err) {
      console.log(err.response);
      console.error("Failed to lock events", err);
    }
  };

  const unlockUserEvents = async () => {
    try {
      await axios.post(
        `${API_URL}/admin/users/${studentUserData.id}/events/unlock`,
        {},
        { withCredentials: true },
      );
      setIsUserEventsLocked(false);
      if (studentUserData.id === user.id) {
        setUserEventsList([]);
      }
      setStudentUserEventsList([]);
    } catch (err) {
      console.error("Failed to unlock events", err);
    }
  };

  const deleteUser = async () => {
    setDeleteState("deleting");
    try {
      await axios.delete(`${API_URL}/admin/user/${studentUserData.id}`, {
        withCredentials: true,
      });
      setDeleteState("success");
      // Wait for success animation then navigate
      setTimeout(() => {
        setShowDeletePopup(false);
        setDeleteState("confirm");
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Failed to delete user", error);
      setDeleteState("confirm");
    }
  };

  const closeDeletePopup = () => {
    if (deleteState === "deleting") return; // Prevent closing while deleting
    setShowDeletePopup(false);
    setDeleteState("confirm");
  };

  if (loading) {
    return (
      <LoadingComponent
        title="Loading User Details"
        message="Fetching profile and events..."
        darkMode={darkMode}
      />
    );
  }

  // Access Denied Screen
  if (accessDenied) {
    return <ManagerDetailsAccessDenied />;
  }

  return (
    <>
      <div className="space-y-5">
        {/* ================= USER HEADER ================= */}
        <UserDetailHeader
          studentUserData={studentUserData}
          darkMode={darkMode}
          isUserEventsLocked={isUserEventsLocked}
          lockUserEvents={lockUserEvents}
          unlockUserEvents={unlockUserEvents}
          setShowDeletePopup={setShowDeletePopup}
        />

        {/* ================= MAIN CONTENT - 60/40 SPLIT ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          {/* LEFT: REGISTERED EVENTS - Takes 3/5 width */}
          <UserDetailEvents
            studentUserData={studentUserData}
            studentUserEventsList={studentUserEventsList}
            setStudentUserEventsList={setStudentUserEventsList}
            lockUserEvents={lockUserEvents}
            darkMode={darkMode}
            isUserEventsLocked={isUserEventsLocked}
          />

          {/* RIGHT: USER INFO - Takes 2/5 width */}
          <UserDetailInfo
            studentUserData={studentUserData}
            darkMode={darkMode}
          />
        </section>
      </div>

      {/* ================= DELETE CONFIRMATION POPUP ================= */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeletePopup}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user color */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
                  deleteState === "success"
                    ? "bg-emerald-500/30"
                    : studentUserData.role === "Manager"
                      ? "bg-red-500/20"
                      : studentUserData.gender === "Male"
                        ? "bg-sky-500/20"
                        : studentUserData.gender === "Female"
                          ? "bg-pink-500/20"
                          : "bg-emerald-500/20"
                }`}
              />
            )}

            <div className="relative p-6 text-center">
              {/* Icon - Changes based on state */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                  deleteState === "success"
                    ? "bg-emerald-500/15 scale-110"
                    : deleteState === "deleting"
                      ? "bg-amber-500/15"
                      : studentUserData.role === "Manager"
                        ? "bg-red-500/10"
                        : studentUserData.gender === "Male"
                          ? "bg-sky-500/10"
                          : studentUserData.gender === "Female"
                            ? "bg-pink-500/10"
                            : "bg-emerald-500/10"
                }`}
              >
                {deleteState === "success" ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : deleteState === "deleting" ? (
                  <span className="animate-spin h-8 w-8 border-3 border-amber-500/30 rounded-full border-t-amber-500" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-8 h-8 fill-current ${
                      studentUserData.role === "Manager"
                        ? "text-red-500"
                        : studentUserData.gender === "Male"
                          ? "text-sky-500"
                          : studentUserData.gender === "Female"
                            ? "text-pink-500"
                            : "text-emerald-500"
                    }`}
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                )}
              </div>

              {/* Title - Changes based on state */}
              <h3
                className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                  deleteState === "success"
                    ? darkMode
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : darkMode
                      ? "text-white"
                      : "text-slate-900"
                }`}
              >
                {deleteState === "success"
                  ? "Deleted Successfully!"
                  : deleteState === "deleting"
                    ? "Deleting..."
                    : "Delete User"}
              </h3>

              {/* Content - Changes based on state */}
              {deleteState === "success" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-emerald-400/80" : "text-emerald-600/80"
                  }`}
                >
                  {studentUserData.fullname || studentUserData.username} has
                  been removed.
                </p>
              ) : deleteState === "deleting" ? (
                <p
                  className={`text-sm mb-6 ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Please wait while we remove this user...
                </p>
              ) : (
                <>
                  <p
                    className={`text-sm mb-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Are you sure you want to delete
                  </p>
                  <p
                    className={`text-base font-bold mb-4 ${
                      darkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {studentUserData.fullname || studentUserData.username}?
                  </p>
                  <p
                    className={`text-xs mb-6 ${
                      darkMode ? "text-red-400/80" : "text-red-500/80"
                    }`}
                  >
                    This action cannot be undone.
                  </p>
                </>
              )}

              {/* Buttons - Only show for confirm state */}
              {deleteState === "confirm" && (
                <div className="flex gap-3">
                  <button
                    onClick={closeDeletePopup}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      darkMode
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteUser}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg hover:brightness-110 ${
                      studentUserData.role === "Manager"
                        ? "bg-linear-to-r from-red-500 to-red-600 shadow-red-500/25"
                        : studentUserData.gender === "Male"
                          ? "bg-linear-to-r from-sky-500 to-blue-600 shadow-sky-500/25"
                          : studentUserData.gender === "Female"
                            ? "bg-linear-to-r from-pink-500 to-pink-600 shadow-pink-500/25"
                            : "bg-linear-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/25"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Success state - Show redirecting message */}
              {deleteState === "success" && (
                <p
                  className={`text-xs ${
                    darkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Redirecting...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
