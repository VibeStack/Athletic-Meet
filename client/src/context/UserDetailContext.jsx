import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const UserDetailContext = createContext(null);

export function UserDetailProvider({ children }) {
  const [userDetail, setUserDetail] = useState({});
  const [userEventsList, setUserEventsList] = useState([]);
  const [allEventsList, setAllEventsList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch user profile and their enrolled events
  const fetchUserDetails = useCallback(async () => {
    try {
      const { data: response } = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });

      if (response?.success) {
        setUserDetail(response.data);
        setUserEventsList(response.data.selectedEvents || []);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, [API_URL]);

  // Fetch all events (with isActive status) and filter by gender
  const fetchAllEvents = useCallback(
    async (userGender) => {
      try {
        const { data: response } = await axios.get(`${API_URL}/user/events`, {
          withCredentials: true,
        });

        if (response?.success) {
          // Filter by gender if provided
          let events = response.data;
          if (userGender) {
            events = events.filter((event) => {
              if (userGender === "Male") return event.category === "Boys";
              return event.category === "Girls";
            });
          }
          setAllEventsList(events);
          return events;
        }
      } catch (err) {
        console.error("Events fetch error:", err);
      }
      return [];
    },
    [API_URL],
  );

  const value = {
    userDetail,
    setUserDetail,
    userEventsList,
    setUserEventsList,
    allEventsList,
    setAllEventsList,
    fetchUserDetails,
    fetchAllEvents,
  };

  return (
    <UserDetailContext.Provider value={value}>
      {children}
    </UserDetailContext.Provider>
  );
}

export function useUserDetail() {
  const context = useContext(UserDetailContext);
  if (!context) {
    throw new Error("useUserDetail must be used within a UserDetailProvider");
  }
  return context;
}
