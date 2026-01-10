import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin_Dashboard";
import ViewProfile from "./pages/Profile";

export default function App() {
  const { user, userData, loading } = useAuth();

  if (loading) return null; // or loader

  const redirectPath = user
    ? userData?.onboardingCompleted
      ? "/dashboard"
      : "/onboarding"
    : "/";

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Smart redirect */}
      <Route path="/home" element={<Navigate to={redirectPath} replace />} />

      {/* Protected */}
      <Route
        path="/onboarding"
        element={
          user && !userData?.onboardingCompleted ? (
            <OnboardingPage />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          user && userData?.onboardingCompleted ? (
            <Dashboard />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        }
      />

      <Route
        path="/profile"
        element={user ? <ViewProfile /> : <Navigate to="/" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
