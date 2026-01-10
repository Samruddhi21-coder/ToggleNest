import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
return (
<Routes>
  <Route path="/landing" element={<LandingPage />} />
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/kanban" element={<Kanban />} />
</Routes>
);
}