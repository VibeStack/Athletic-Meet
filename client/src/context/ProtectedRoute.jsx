import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import LoadingComponent from "../components/Portal/LoadingComponent";

// Access Denied component
function AccessDenied() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this page.
        </p>
        <a
          href="/portal"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Portal
        </a>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, isAuthenticated, authChecked, checkAuth } = useAuth();
  const location = useLocation();

  // Lazy auth check - only runs when navigating to a protected route
  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked, checkAuth]);

  // Show shimmer loading while checking auth
  if (loading) {
    return (
      <LoadingComponent
        title="Authenticating"
        message="Verifying your access..."
        fullScreen
      />
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(user?.role);
    if (!hasAccess) {
      return <AccessDenied />;
    }
  }

  // All checks passed - render children
  return children;
}
