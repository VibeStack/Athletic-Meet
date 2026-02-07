import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";
import { createContext, useContext, useState, useCallback } from "react";

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [allUsers, setAllUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState(null);

  // Use refs to avoid fetchUsers being recreated on every data change
  const hasFetchedRef = useRef(hasFetched);
  const allUsersRef = useRef(allUsers);
  const totalUsersCountRef = useRef(totalUsersCount);

  // Keep refs in sync
  useEffect(() => {
    hasFetchedRef.current = hasFetched;
  }, [hasFetched]);
  useEffect(() => {
    allUsersRef.current = allUsers;
  }, [allUsers]);
  useEffect(() => {
    totalUsersCountRef.current = totalUsersCount;
  }, [totalUsersCount]);

  const fetchUsers = useCallback(
    async (forceRefresh = false) => {
      // Return cached data if already fetched and not forcing refresh
      if (hasFetchedRef.current && !forceRefresh) {
        return {
          users: allUsersRef.current,
          usersCount: totalUsersCountRef.current,
        };
      }

      try {
        // Only show loading state if we have no users yet
        if (allUsersRef.current.length === 0) {
          setIsLoading(true);
        }
        setError(null);

        const { data: response } = await axios.get(`${API_URL}/admin/users`, {
          withCredentials: true,
        });

        const sortedUsers = response.data.users.sort(
          (a, b) => a.jerseyNumber - b.jerseyNumber,
        );

        setAllUsers(sortedUsers);
        setTotalUsersCount(response.data.usersCount);
        setHasFetched(true);

        return { users: sortedUsers, usersCount: response.data.usersCount };
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL], // Only depend on API_URL to keep function identity stable
  );

  // Update a single user in the cache (useful after editing a user)
  const updateUserInCache = useCallback((userId, updatedUserData) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedUserData } : user,
      ),
    );
  }, []);

  // Remove a user from cache (useful after deleting a user)
  const removeUserFromCache = useCallback((userId) => {
    setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setTotalUsersCount((prev) => prev - 1);
  }, []);

  // Add a new user to cache
  const addUserToCache = useCallback((newUser) => {
    setAllUsers((prevUsers) => {
      const updated = [...prevUsers, newUser].sort(
        (a, b) => a.jerseyNumber - b.jerseyNumber,
      );
      return updated;
    });
    setTotalUsersCount((prev) => prev + 1);
  }, []);

  // Clear cache (useful on logout or when data needs full refresh)
  const clearCache = useCallback(() => {
    setAllUsers([]);
    setTotalUsersCount(0);
    setHasFetched(false);
    setError(null);
  }, []);

  // Force refresh the cache
  const refreshUsers = useCallback(() => {
    return fetchUsers(true);
  }, [fetchUsers]);

  return (
    <UsersContext.Provider
      value={{
        allUsers,
        totalUsersCount,
        isLoading,
        hasFetched,
        error,
        fetchUsers,
        refreshUsers,
        updateUserInCache,
        removeUserFromCache,
        addUserToCache,
        clearCache,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}
