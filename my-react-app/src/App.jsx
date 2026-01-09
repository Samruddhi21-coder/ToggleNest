import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Kanban from "./pages/Kanban";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";

export default function App() {
return (
<Routes>
  <Route path="/register" element={<Register />} />
  <Route path="/" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/kanban" element={<Kanban />} />
</Routes>
);
}