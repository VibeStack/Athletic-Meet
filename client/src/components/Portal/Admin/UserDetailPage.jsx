import React, { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import LoadingComponent from "../LoadingComponent";
import UserDetailHeader from "./UserDetail/UserDetailHeader";
import UserDetailEvents from "./UserDetail/UserDetailEvents";
import UserDetailInfo from "./UserDetail/UserDetailInfo";
import ManagerDetailsAccessDenied from "./ManagerDetailsAccessDenied";
import { useUserDetail } from "../../../context/UserDetailContext";
import { useUsers } from "../../../context/UsersContext";

export default function UserDetailPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { darkMode } = useTheme();
  const { userId } = useParams();

  const [studentUserData, setStudentUserData] = useState({});
  const [studentUserEventsList, setStudentUserEventsList] = useState([]);
  const [isUserEventsLocked, setIsUserEventsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Get current logged-in user
  const { user } = useOutletContext();
  // Get cache update functions
  const { updateUserInCache } = useUsers();
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
      setStudentUserEventsList(response.data || []);
      setStudentUserData((prev) => ({
        ...prev,
        selectedEvents: response.data || [],
      }));
      // Update cache with new events count
      updateUserInCache(studentUserData.id, {
        eventsCount: response.data?.length || 0,
        isEventsLocked: true,
      });
    } catch (err) {
      console.log(err.response);
      console.error("Failed to lock events", err);
    }
  };

  const unlockUserEvents = async () => {
    try {
      const { data: response } = await axios.post(
        `${API_URL}/admin/users/${studentUserData.id}/events/unlock`,
        {},
        { withCredentials: true },
      );
      const retainedEvents = response.data || [];
      setIsUserEventsLocked(false);
      if (studentUserData.id === user.id) {
        setUserEventsList(retainedEvents);
      }
      setStudentUserEventsList(retainedEvents);
      setStudentUserData((prev) => ({
        ...prev,
        selectedEvents: retainedEvents,
      }));
      // Update cache with zero events count
      updateUserInCache(studentUserData.id, {
        eventsCount: retainedEvents.length,
        isEventsLocked: false,
      });
    } catch (err) {
      console.error("Failed to unlock events", err);
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
    <div className="space-y-5 relative">
      {/* ================= USER HEADER ================= */}
      <UserDetailHeader
        studentUserData={studentUserData}
        darkMode={darkMode}
        isUserEventsLocked={isUserEventsLocked}
        lockUserEvents={lockUserEvents}
        unlockUserEvents={unlockUserEvents}
        updateUserInCache={updateUserInCache}
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
          setStudentUserData={setStudentUserData}
          darkMode={darkMode}
        />
      </section>
    </div>
  );
}
