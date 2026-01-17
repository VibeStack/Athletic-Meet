import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./components/Register/RegisterPage";
import LandingPage from "./components/LandingPage/LandingPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import LoginPage from "./components/Login/loginPage";
import GalleryPage from "./components/LandingPage/GalleryPage";
import ScrollToTop from "./components/LandingPage/ScrollToTop";

// Portal Components
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserDetailProvider } from "./context/UserDetailContext";
import ProtectedRoute from "./context/ProtectedRoute";
import PortalLayout from "./components/Portal/PortalLayout";
import PortalHome from "./components/Portal/PortalHome";
import EventsPage from "./components/Portal/EventsPage";
import CertificatesPage from "./components/Portal/CertificatesPage";

// Admin Components
import UsersPage from "./components/Portal/Admin/UsersPage";
import UserDetailPage from "./components/Portal/Admin/UserDetailPage";
import QRScannerPage from "./components/Portal/Admin/QRScannerPage";

// Manager Components
import ExportDataPage from "./components/Portal/Manager/ExportDataPage";
import EventControlsPage from "./components/Portal/Manager/EventControlsPage";
import CertificateControlsPage from "./components/Portal/Manager/CertificateControlsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gallery" element={<GalleryPage />} />

          {/* Protected Portal Routes */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <ThemeProvider>
                  <UserDetailProvider>
                    <PortalLayout />
                  </UserDetailProvider>
                </ThemeProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<PortalHome />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="certificates" element={<CertificatesPage />} />

            {/* Admin Routes (Admin + Manager) */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users/:userId"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/scanner"
              element={
                <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                  <QRScannerPage />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="manager/export"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <ExportDataPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manager/event-controls"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <EventControlsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="manager/certificate-controls"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <CertificateControlsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
