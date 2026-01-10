import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import {
  Layers,
  Plus,
  Check,
  Briefcase,
  User,
  ArrowLeft,
  Clock,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  // ---------------- AUTH ----------------
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/"); // redirect if logged out
      else setCurrentUser(user);
    });
    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // ---------------- UI STATE ----------------
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeProject] = useState("Apex rebranding for Super Bowl");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Task Board");

  const tabs = [
    "Task Board",
    "Next Task Assigned",
    "Progress Dashboard",
    "Activity Log",
    "Notifications",
  ];

  const [tasks, setTasks] = useState([
    { id: 1, name: "Define Brand Voice", deadline: "Jan 12", status: "Done", completed: true },
    { id: 2, name: "Asset Creation Phase 1", deadline: "Jan 15", status: "In Progress", completed: false },
    { id: 3, name: "Stakeholder Review", deadline: "Jan 18", status: "To-Do", completed: false },
  ]);

  const toggleTaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "In Progress" }
          : t
      )
    );
  };

  const filteredTasks = tasks.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---------------- USER INFO ----------------
  if (!currentUser) return null; // prevent UI flash

  const userInitial =
    currentUser.displayName?.charAt(0) ||
    currentUser.email?.charAt(0).toUpperCase();
  // ---------------- RENDER ----------------

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <Layers className="logo-icon" />
          <span className="logo-text">ToggleNest</span>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="main-header">
          <h1>{activeProject}</h1>

          <div className="relative">
            <div
              className="user-profile-badge"
              onClick={() => setShowDropdown((p) => !p)}
            >
              {userInitial}
            </div>

            {showDropdown && (
              <div className="profile-dropdown-container">
                <button onClick={() => navigate("/profile")}>
                  View Profile
                </button>
                <button onClick={() => navigate("/settings")}>
                  Settings
                </button>
                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* TABS */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TASK BOARD */}
        {activeTab === "Task Board" && (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-left">
                  <div
                    className={`toggle-complete ${task.completed ? "completed" : ""}`}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <Check size={14} />
                  </div>
                  <span className={task.completed ? "completed" : ""}>
                    {task.name}
                  </span>
                </div>

                <div className="task-right">
                  <Clock size={14} />
                  <span>{task.deadline}</span>
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                  <MoreHorizontal />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
