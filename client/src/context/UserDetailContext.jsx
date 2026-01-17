import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const UserDetailContext = createContext(null);

export function UserDetailProvider({ children }) {
  const [userDetail, setUserDetail] = useState({});
  const [userEventsList, setUserEventsList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUserDetails = useCallback(async () => {
    try {
      const { data: response } = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });
      console.log(response);

      if (response?.success) {
        setUserDetail(response.data);
        setUserEventsList(response.data.selectedEvents || []);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, [API_URL]);

  const value = {
    userDetail,
    setUserDetail,
    userEventsList,
    setUserEventsList,
    fetchUserDetails,
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
