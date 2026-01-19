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
  const [accessDenied, setAccessDenied] = useState(false);

  // Get current logged-in user
  const { user } = useOutletContext();
  const { userDetail,setUserEventsList } = useUserDetail(); // user and userDetail are same ok 

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
      await axios.post(
        `${API_URL}/admin/users/${studentUserData.id}/events/lock`,
        {},
        { withCredentials: true },
      );
      setIsUserEventsLocked(true);
    } catch (err) {
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
      setStudentUserEventsList([])
    } catch (err) {
      console.error("Failed to unlock events", err);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/admin/user/${studentUserData.id}`, {
        withCredentials: true,
      });
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
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
            onClick={() => setShowDeletePopup(false)}
          />
          <div
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${
              darkMode
                ? "bg-slate-900 border border-white/10"
                : "bg-white border border-slate-200"
            }`}
          >
            {/* Glow based on user color */}
            {darkMode && (
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
                  studentUserData.role === "Manager"
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
              {/* Icon - Color based on role/gender */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  studentUserData.role === "Manager"
                    ? "bg-red-500/10"
                    : studentUserData.gender === "Male"
                      ? "bg-sky-500/10"
                      : studentUserData.gender === "Female"
                        ? "bg-pink-500/10"
                        : "bg-emerald-500/10"
                }`}
              >
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
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Delete User
              </h3>
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

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeletePopup(false)}
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
                    setShowDeletePopup(false);
                    deleteUser();
                  }}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
