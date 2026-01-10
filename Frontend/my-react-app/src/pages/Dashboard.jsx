import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import {
  Layers, Plus, Check, Briefcase, User, ArrowLeft, Clock, MoreHorizontal, Search, Copy, MessageSquare
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  // ------------------- STATE -------------------
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [queries, setQueries] = useState([]);
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

  // ------------------- AUTH -------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/"); // redirect to landing
      } else {
        setCurrentUser(user);

        // Fetch dashboard data
        try {
          const res = await fetch(`http://localhost:5000/api/dashboard/${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
            setTasks(data.tasks || []);
          } else {
            console.error("Dashboard fetch failed", res.status);
            setDashboardData({ activeProjectName: "Default Project", history: [], tasks: [] });
            setTasks([]);
          }
        } catch (err) {
          console.error(err);
          setDashboardData({ activeProjectName: "Default Project", history: [], tasks: [] });
          setTasks([]);
        }

        // Fetch team members
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.projectId) {
          try {
            const res = await axios.get(`http://localhost:5000/api/team/${storedUser.projectId}`);
            setTeamMembers(res.data.teamMembers || []);
          } catch (err) {
            console.error("Failed to fetch team members", err);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // ------------------- FUNCTIONS -------------------
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleTaskCompletion = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "In Progress" } : t
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
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Optimistic Update
    const tempId = Date.now();
    const tempQuery = { id: tempId, text: newQuery, isResolved: false, projectId: storedUser?.projectId };
    setQueries(prev => [...prev, tempQuery]);
    setNewQuery("");

    try {
      const res = await axios.post("http://localhost:5000/api/queries", {
        projectId: storedUser?.projectId,
        text: tempQuery.text,
        senderEmail: currentUser?.email
      });
      // Replace temp with real
      setQueries(prev => prev.map(q => q.id === tempId ? res.data : q));
    } catch (err) {
      console.error("Failed to add query", err);
      setQueries(prev => prev.filter(q => q.id !== tempId));
      toast.error("Failed to save query");
    }
  };

  // Resolve Query
  const handleResolveQuery = async (id) => {
    // Optimistic Update
    setQueries(prev => prev.map(q => (q._id === id || q.id === id) ? { ...q, isResolved: !q.isResolved } : q));

    try {
      await axios.patch(`http://localhost:5000/api/queries/${id}/resolve`);
    } catch (err) {
      console.error("Failed to resolve query", err);
      // Revert
      setQueries(prev => prev.map(q => (q._id === id || q.id === id) ? { ...q, isResolved: !q.isResolved } : q));
    }
  };

  // ------------------- COPY TO CLIPBOARD -------------------
  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copied to clipboard! ✅");
  };

  useEffect(() => {
    if (activeTab === "Task Board" || activeTab === "Activity Log") {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const filteredTasks = tasks.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null; // prevent UI flash

  return (
    <div className="dashboard-container relative">
      {isSyncing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Layers className="animate-spin mb-2" size={32} color="#000" />
            <span className="text-black font-medium">Syncing...</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
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

        {/* 1. Team Contacts */}
        <div className="team-contacts-section">
          <h4 className="sidebar-heading">Team Contacts</h4>
          <Toaster />
          {teamMembers.map(member => (
            <div key={member.email} className="contact-item group">
              <div className="avatar-circle">{member.fullName?.charAt(0).toUpperCase()}</div>
              <div className="contact-info">
                <p className="contact-name">{member.fullName} {member.email === currentUser.email && "(Me)"}</p>
                <div className="flex items-center gap-2 email-container" onClick={() => handleCopyEmail(member.email)}>
                  <p className="contact-email truncate w-[140px] cursor-pointer hover:text-black transition-colors" title={member.email}>
                    {member.email}
                  </p>
                  <Copy size={12} className="copy-icon opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Projects */}
        <div className="sidebar-section">
          <span className="section-title">PROJECTS</span>
          <div className="projects-menu">
            {/* Active Project */}
            <div className="project-item active">
              <div className="project-left">
                <Briefcase size={16} />
                <span className="project-name">
                  {dashboardData?.activeProjectName || "Loading..."}
                </span>
              </div>
              <div className="indicator"></div>
            </div>

            {/* History Projects */}
            {dashboardData?.history?.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-left">
                  <span className="project-hash">#</span>
                  <span className="project-name">{project.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Tasks & Queries */}
        <div className="query-section">
          <span className="section-title">TASKS & QUERIES</span>

          <div className="query-input-wrapper">
            <input
              type="text"
              className="query-input"
              placeholder="Drop a Query..."
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddQuery()}
            />
            <button className="add-query-btn-small" onClick={handleAddQuery}>
              <Plus size={16} />
            </button>
          </div>

          <div className="queries-list">
            <AnimatePresence>
              {queries.map((q) => (
                <motion.div
                  key={q._id || q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="query-item"
                >
                  <div
                    className={`query-check ${q.isResolved ? 'solved' : ''}`}
                    onClick={() => handleResolveQuery(q._id || q.id)}
                  >
                    {q.isResolved && <Check size={10} />}
                  </div>
                  <span className={`query-text ${q.isResolved ? 'solved' : ''}`}>
                    {q.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {queries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                <MessageSquare size={24} className="mb-2 opacity-50" />
                <p className="text-[10px] italic text-center">No queries yet. <br /> Your team is perfectly aligned!</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Core Team */}
        <div className="core-team-section">
          <span className="section-title">CORE TEAM</span>
          <div className="team-avatars">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="team-avatar">
                <User size={14} />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>{dashboardData?.activeProjectName || "Dashboard"}</h1>
          <div className="header-actions">

            <button className="btn-back" onClick={() => navigate("/onboarding")}>
              <ArrowLeft size={16} /> Back
            </button>

            <button className="btn-add-query">
              <Plus size={16} /> Add Query
            </button>

            <div className="relative">
              <div className="user-profile-badge" onClick={() => setShowDropdown(prev => !prev)}>
                {currentUser.email.charAt(0).toUpperCase()}
              </div>
              {showDropdown && (
                <div className="profile-dropdown-container">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">{currentUser.email}</div>
                  <button className="profile-dropdown-item" onClick={() => { navigate("/profile"); setShowDropdown(false); }}>View Profile</button>
                  <button className="profile-dropdown-item" onClick={() => { navigate("/settings"); setShowDropdown(false); }}>Settings</button>
                  <button className="profile-dropdown-item logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`tab-btn ${activeTab === tab ? 'active' : ''}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Task Board */}
        <div className="dashboard-body">
          {activeTab === "Task Board" ? (
            <>
              <div className="task-section-header">
                <h2>Active Tasks</h2>
                <span className="task-count">{filteredTasks.length} tasks found</span>
              </div>

              {filteredTasks.length > 0 ? (
                <div className="task-list">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="task-card">
                      <div className="task-left">
                        <div className={`toggle-complete ${task.completed ? 'completed' : ''}`} onClick={() => toggleTaskCompletion(task.id)}>
                          <Check size={14} />
                        </div>
                        <span className={`task-name ${task.completed ? 'completed' : ''}`}>{task.name}</span>
                      </div>
                      <div className="task-right">
                        <div className="task-meta"><Clock size={14} /><span>{task.deadline}</span></div>
                        <div className={`status-badge ${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</div>
                        <button className="btn-more"><MoreHorizontal size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-tasks-wrapper">
                  <div className="no-tasks-placeholder">
                    <Layers size={48} strokeWidth={1} />
                    <p className="no-task-title">No tasks assigned yet.</p>
                    <p className="no-task-sub">Your nest is quiet.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="tab-placeholder">
              <p>Content for <strong>{activeTab}</strong> is under construction.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
