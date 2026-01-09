import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const checkAuth = useCallback(async () => {
    if (authChecked && user) return user;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/user/profile`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        setAuthChecked(true);
        return response.data.data;
      } else {
        setUser(null);
        setAuthChecked(true);
        return null;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setAuthChecked(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_URL, authChecked, user]);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setAuthChecked(false);
    }
  }, [API_URL]);

  const refreshUser = useCallback(async () => {
    setAuthChecked(false);
    return checkAuth();
  }, [checkAuth]);

  // Auth check removed - now using lazy auth pattern
  // Auth will only be checked when navigating to protected routes

  const value = {
    user,
    loading,
    authChecked,
    checkAuth,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isStudent: user?.role === "Student",
    isAdmin: user?.role === "Admin",
    isManager: user?.role === "Manager",
    canAccessAdmin: user?.role === "Admin" || user?.role === "Manager",
    canAccessManager: user?.role === "Manager",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
