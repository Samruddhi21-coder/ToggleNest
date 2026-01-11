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

  if (loading) {
  return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
}


  // 🔀 SMART REDIRECT BASED ON ROLE
  const getDashboardRoute = () => {
    if (!user) return "/";
    if (!userData?.onboardingCompleted) return "/onboarding";
    return userData?.role === "Admin"
      ? "/admin_dashboard"
      : "/dashboard";
  };

  return (
    <Routes>
      {/* 🌐 Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🧠 Smart Home Redirect */}
      <Route
        path="/home"
        element={<Navigate to={getDashboardRoute()} replace />}
      />

      {/* 🧩 Onboarding */}
      <Route
        path="/onboarding"
        element={
          user && !userData?.onboardingCompleted ? (
            <OnboardingPage />
          ) : (
            <Navigate to={getDashboardRoute()} replace />
          )
        }
      />

      {/* 👤 Member Dashboard */}
      <Route
        path="/dashboard"
        element={
          user &&
          userData?.onboardingCompleted &&
          userData?.role === "Member" ? (
            <Dashboard />
          ) : (
            <Navigate to={getDashboardRoute()} replace />
          )
        }
      />

      {/* 🛠️ Admin Dashboard */}
      <Route
        path="/admin_dashboard"
        element={
          user &&
          userData?.onboardingCompleted &&
          userData?.role === "Admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to={getDashboardRoute()} replace />
          )
        }
      />

      {/* 👤 Profile */}
      <Route
        path="/profile"
        element={user ? <ViewProfile /> : <Navigate to="/" replace />}
      />

      {/* ❌ Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
