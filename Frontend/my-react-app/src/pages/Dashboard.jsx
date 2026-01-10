import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import {
  Layers, Plus, Check, Briefcase, User, ArrowLeft, Clock, MoreHorizontal, Search
} from 'lucide-react';
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
  const [queries, setQueries] = useState([
    { id: 1, text: "Clarify timeline for Week 2", solved: false },
    { id: 2, text: "Budget approval status?", solved: true }
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

  const handleAddQuery = () => {
    if (!newQuery.trim()) return;
    const query = { id: Date.now(), text: newQuery, solved: false };
    setQueries(prev => [...prev, query]);
    setNewQuery("");
  };

  const handleResolveQuery = (id) => {
    setQueries(prev => prev.map(q => q.id === id ? { ...q, solved: !q.solved } : q));
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

        <div className="team-contacts-section">
          <h4 className="sidebar-heading">Team Contacts</h4>
          {teamMembers.map(member => (
            <div key={member.email} className="contact-item">
              <div className="avatar-circle">{member.fullName?.charAt(0).toUpperCase()}</div>
              <div className="contact-info">
                <p className="contact-name">{member.fullName} {member.email === currentUser.email && "(Me)"}</p>
                <p className="contact-email">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1>{dashboardData?.activeProjectName || "Dashboard"}</h1>
          <div className="header-actions">
            <button onClick={() => navigate("/")}><ArrowLeft size={16} /> Back</button>
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
            filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
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
              ))
            ) : (
              <div className="no-tasks-placeholder">
                <Layers size={48} className="mb-4 opacity-50" />
                <p>No tasks assigned yet.</p>
              </div>
            )
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
