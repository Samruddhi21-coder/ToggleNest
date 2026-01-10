import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
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
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [queries, setQueries] = useState([
    { id: 1, text: "Clarify timeline for Week 2", solved: false },
    { id: 2, text: "Budget approval status?", solved: true },
  ]);

  const [newQuery, setNewQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Task Board");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const tabs = [
    "Task Board",
    "Next Task Assigned",
    "Progress Dashboard",
    "Activity Log",
    "Notifications",
  ];

  /* ---------------- AUTH & DATA ---------------- */

    useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) {
      navigate("/");
      return;
    }

    setCurrentUser(user);

    try {
      const encodedEmail = encodeURIComponent(user.email);

      const res = await fetch(
        `http://localhost:5000/api/dashboard/${encodedEmail}`
      );

      if (!res.ok) {
        throw new Error("Dashboard API failed");
      }

      const dashboard = await res.json(); // ✅ renamed from `data`

      setDashboardData(dashboard);
      setTasks(dashboard.tasks || []);

      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored?.projectId) {
        const teamRes = await axios.get(
          `http://localhost:5000/api/team/${stored.projectId}`
        );
        setTeamMembers(teamRes.data.teamMembers || []);
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  });

  return () => unsub();
}, [navigate]);


  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    if (activeTab === "Task Board" || activeTab === "Activity Log") {
      setIsSyncing(true);
      const t = setTimeout(() => setIsSyncing(false), 500);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  /* ---------------- HANDLERS ---------------- */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? "Done" : "In Progress",
            }
          : t
      )
    );
  };


  // ------------------- QUERIES LOGIC -------------------
  // Fetch Queries
  useEffect(() => {
    const fetchQueries = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser?.projectId) {
        try {
          const res = await axios.get(`http://localhost:5000/api/queries/${storedUser.projectId}`);
          setQueries(res.data);
        } catch (error) {
          console.error("Error fetching queries", error);
        }
      }
    };
    fetchQueries();
  }, [teamMembers]); // Re-fetch when team members load or strictly on mount if stable

  // Add Query
  const handleAddQuery = async () => {
    if (!newQuery.trim()) return;
    setQueries((q) => [
      ...q,
      { id: Date.now(), text: newQuery, solved: false },
    ]);
    setNewQuery("");
  };

  const handleResolveQuery = (id) => {
    setQueries((q) =>
      q.map((x) => (x.id === id ? { ...x, solved: !x.solved } : x))
    );
  };

  const filteredTasks = tasks.filter((t) =>
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      Loading Dashboard...
    </div>
  );
}


  /* ================= RENDER ================= */
  return (
    <div className="dashboard-container">
      {isSyncing && (
        <div className="sync-overlay">
          <Layers className="spin" />
          <span>Syncing...</span>
        </div>
      )}

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

        <span className="section-title">TEAM CONTACTS</span>
        <div className="contacts-list">
          {teamMembers.map((m) => (
            <div key={m.email} className="contact-item">
              <div className="avatar-circle">
                {m.fullName?.charAt(0)}
              </div>
              <div className="contact-info">
                <h4>
                  {m.fullName}
                  {m.email === currentUser.email && (
                    <span className="me-badge"> (Me)</span>
                  )}
                </h4>
                <p>{m.email}</p>
              </div>
            </div>
          ))}
        </div>

        <span className="section-title">PROJECTS</span>
        <div className="projects-menu">
          <div className="project-item active">
            <div className="project-left">
              <Briefcase size={16} />
              <span className="project-name">
                {dashboardData?.activeProjectName || "Project"}
              </span>
            </div>
            <div className="indicator" />
          </div>
        </div>

        <div className="query-section">
          <span className="section-title">TASKS & QUERIES</span>

          <div className="query-input-wrapper">
            <input
              className="query-input"
              placeholder="Drop a Query..."
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddQuery()}
            />
            <button className="add-query-btn-small" onClick={handleAddQuery}>
              <Plus size={16} />
            </button>
          </div>

          <div className="queries-list">
            <AnimatePresence>
              {queries.map((q) => (
                <motion.div
                  key={q.id}
                  className="query-item"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className={`query-check ${q.solved ? "solved" : ""}`}
                    onClick={() => handleResolveQuery(q.id)}
                  >
                    {q.solved && <Check size={10} />}
                  </div>
                  <span className={`query-text ${q.solved ? "solved" : ""}`}>
                    {q.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="core-team-section">
          <span className="section-title">CORE TEAM</span>
          <div className="team-avatars">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="team-avatar">
                <User size={14} />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <header className="main-header">
          <div className="project-title">
            <h1>{dashboardData?.activeProjectName || "Dashboard"}</h1>
          </div>

          <div className="header-actions">
            <button className="btn-back" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Back
            </button>

            <button className="btn-add-query">
              <Plus size={16} /> Add Query
            </button>

            <div className="relative">
              <div
                className="user-profile-badge"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {currentUser.email.charAt(0).toUpperCase()}
              </div>

              {showDropdown && (
                <div className="profile-dropdown-container">
                  <button
                    className="profile-dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    View Profile
                  </button>
                  <button
                    className="profile-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="tabs-container">
          <div className="tabs-list">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-body">
          {activeTab === "Task Board" && (
            <>
              <div className="task-section-header">
                <h2>Active Tasks</h2>
                <span className="task-count">
                  {filteredTasks.length} tasks
                </span>
              </div>

              {filteredTasks.length ? (
                <div className="task-list">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-left">
                        <div
                          className={`toggle-complete ${
                            task.completed ? "completed" : ""
                          }`}
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          <Check size={14} />
                        </div>
                        <span
                          className={`task-name ${
                            task.completed ? "completed" : ""
                          }`}
                        >
                          {task.name}
                        </span>
                      </div>

                      <div className="task-right">
                        <div className="task-meta">
                          <Clock size={14} />
                          <span>{task.deadline}</span>
                        </div>
                        <div
                          className={`status-badge ${task.status
                            ?.toLowerCase()
                            .replace(" ", "")}`}
                        >
                          {task.status}
                        </div>
                        <button className="btn-more">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-tasks-wrapper">
                  <div className="no-tasks-placeholder">
                    <Layers size={48} />
                    <p className="no-task-title">No tasks assigned yet</p>
                    <p className="no-task-sub">Your nest is quiet</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
