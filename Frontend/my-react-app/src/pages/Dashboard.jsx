import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios'; // Import the CSS file
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
  Axis3DIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


const Dashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  // fetch memebers:
  useEffect(() => {
    const fetchMembers = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser.projectId) {
        console.error("No Project ID found in localStorage");
        return;
      }
      const validProjectId = storedUser.projectId.trim();

      try {
        const res = await axios.get(`http://localhost:5000/api/team/${validProjectId}`);
        setTeamMembers(res.data.teamMembers || []);
      }
      catch (err) {
        console.log("failed to fetch members", err)
      }
    }
    fetchMembers();
  }, [])

  // Authentication & Data Fetching
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const res = await fetch(`http://localhost:5000/api/dashboard/${user.email}`);
          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
            // Assuming tasks are part of dashboardData
            setTasks(data.tasks || []);
          } else {
            console.error("Failed to fetch dashboard data:", res.status, res.statusText);
            // Optionally set some default data or error state
            setDashboardData({
              activeProjectName: "Default Project",
              teammates: [],
              history: [],
              tasks: []
            });
            setTasks([]);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
          // Optionally set some default data or error state
          setDashboardData({
            activeProjectName: "Default Project",
            teammates: [],
            history: [],
            tasks: []
          });
          setTasks([]);
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // landing page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const [showDropdown, setShowDropdown] = useState(false);
  // Mock Auth State (Replace with real AuthContext later)
  // Logic: If a user is logged in, pull their name from the auth state.
  // const user = {
  //   name: "Sakshi",
  //   isLoggedIn: true
  // };

  // const [activeProject] = useState('Apex rebranding for Super Bowl');
  const [searchQuery, setSearchQuery] = useState("");
  // Ensure "Task Board" is the default active tab
  const [activeTab, setActiveTab] = useState("Task Board");

  // Syncing Simulation
  useEffect(() => {
    if (activeTab === "Task Board" || activeTab === "Activity Log") {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Sidebar State
  const [queries, setQueries] = useState([
    { id: 1, text: "Clarify timeline for Week 2", solved: false },
    { id: 2, text: "Budget approval status?", solved: true }
  ]);
  const [newQuery, setNewQuery] = useState("");

  // Role-Based Access Control (RBAC)
  // Context: Team Member View.
  // Action: REMOVED "User Roles" and "Project Creation".
  // Correction: Rename "Task Assignment" to "Next Task Assigned".
  const tabs = [
    "Task Board",
    "Next Task Assigned",
    "Progress Dashboard",
    "Activity Log",
    "Notifications"
  ];

  // Empty Task State (No dummy rows)
  const [tasks, setTasks] = useState([]);

  // Sidebar Logic
  const handleAddQuery = () => {
    if (newQuery.trim()) {
      setQueries([...queries, { id: Date.now(), text: newQuery, solved: false }]);
      setNewQuery("");
    }
  };

  const handleResolveQuery = (id) => {
    // If a query checkbox is clicked, apply the line-through CSS class (via solved state)
    setQueries(queries.map(q => q.id === id ? { ...q, solved: !q.solved } : q));
  };

  // Dashboard Logic
  const toggleTaskCompletion = (id) => {
    // Ensure clicking the checkbox toggles its status visually
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? "Done" : "In Progress" } : t
    ));
  };

  const filteredTasks = tasks.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper for Initials
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "??";
  };

  return (
    <div className="dashboard-container relative">
      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <Layers className="animate-spin mb-2" size={32} color="#000" />
            <span className="text-black font-medium">Syncing...</span>
          </div>
        </div>
      )}

      {/* 2. LEFT SIDEBAR (THE ENGINE) */}
      <aside className="sidebar">

        {/* Logo Fix: Use Lucide Layers icon in Indigo + ToggleNest text */}
        <div className="logo-section">
          <Layers className="logo-icon" size={24} color="#000000" /> {/* Indigo-600 */}
          <span className="logo-text">ToggleNest</span>
        </div>

        {/* Search */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* {contact list} */}
        <div className="team-contacts-section">
          <h4 className="sidebar-heading">Team Contacts</h4>

          {teamMembers.map((member) => (
            <div key={member.email} className="contact-item">
              {/* 1. Initial Circle */}
              <div className="avatar-circle">
                {member?.fullName?.charAt(0).toUpperCase()}
              </div>

              {/* 2. Name and Email Information */}
              <div className="contact-info">
                <p className="contact-name">
                  {member.fullName}
                  {member.email === currentUser?.email && <span className="me-badge"> (Me)</span>}
                </p>
                <p className="contact-email">{member.email}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="sidebar-section">
          <span className="section-title">Projects</span>
          <div className="projects-menu">
            {/* Active Project */}
            <div className="project-item active">
              <div className="project-left">
                <Briefcase size={16} color="#000" />
                <span className="project-name">
                  {dashboardData?.activeProjectName || "Loading..."}
                </span>
              </div>
              <div className="indicator"></div>
            </div>

            {/* History Projects */}
            {dashboardData?.history?.length > 0 && (
              <>
                <span className="section-subtitle mt-4 mb-2 block text-[10px] text-gray-400 uppercase tracking-wider pl-4">Previous Projects</span>
                {dashboardData.history.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-left">
                      <span style={{ fontSize: '12px', color: '#94A3B8', width: '16px', textAlign: 'center' }}>#</span>
                      <span className="project-name">{project.name}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Query Box (Interactive) */}
        <div className="query-section">
          <span className="section-title">Tasks & Queries</span>
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
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="query-item"
                >
                  <div
                    className={`query-check ${q.solved ? 'solved' : ''}`}
                    onClick={() => handleResolveQuery(q.id)}
                  >
                    {q.solved && <Check size={10} />}
                  </div>
                  <span className={`query-text ${q.solved ? 'solved' : ''}`}>
                    {q.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {queries.length === 0 && <p style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>No active queries.</p>}
          </div>
        </div>

        {/* Core Team */}
        <div className="core-team-section">
          <span className="section-title">Core Team</span>
          <div className="team-avatars">
            {/* Just a placeholder visualisation for "Core Team" as per original design */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="team-avatar">
                <User size={14} />
              </div>
            ))}
          </div>
        </div>

      </aside >

      {/* 3. MAIN CONTENT AREA (THE WORKSPACE) */}
      < main className="main-content" >

        {/* Header */}
        < header className="main-header" >
          <div className="project-title">
            <h1>{dashboardData?.activeProjectName || "Dashboard"}</h1>
          </div>
          <div className="header-actions">
            <button className="btn-back">
              <ArrowLeft size={16} />
              Back
            </button>
            <button className="btn-add-query">
              <Plus size={16} />
              Add Query
            </button>

            {/* User Profile Avatar */}
            {currentUser && (
              <div className="relative">
                <div
                  className="user-profile-badge"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  {/* Avatar Logic: First letter of email or name if available */}
                  {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : "U"}
                </div>

                {showDropdown && (
                  <div className="profile-dropdown-container">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {currentUser.email}
                    </div>
                    <button
                      className="profile-dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      View Profile
                    </button>

                    <button
                      className="profile-dropdown-item"
                      onClick={() => {
                        navigate("/settings");
                        setShowDropdown(false);
                      }}
                    >
                      Settings
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
            )}

          </div>
        </header >

        {/* Navigation Tabs */}
        < div className="tabs-container" >
          <div className="tabs-list">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div >

        {/* Task Listing */}
        < div className="dashboard-body" >
          {activeTab === "Task Board" ? (
            <>
              <div className="task-section-header">
                <h2>Active Tasks</h2>
                <span className="task-count">{filteredTasks.length} tasks found</span>
              </div>

              <div className="task-list">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    // Logic for displaying tasks if they existed
                    <div key={task.id} className="task-card">
                      <div className="task-left">
                        <div
                          className={`toggle-complete ${task.completed ? 'completed' : ''}`}
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className={`task-name ${task.completed ? 'completed' : ''}`}>
                          {task.name}
                        </span>
                      </div>

                      <div className="task-right">
                        <div className="task-meta">
                          <Clock size={14} />
                          <span>{task.deadline}</span>
                        </div>

                        <div className={`status-badge ${task.status === "Done" ? "done" : task.status === "In Progress" ? "inprogress" : "todo"}`}>
                          {task.status}
                        </div>

                        <button className="btn-more">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                    <div className="flex justify-center mb-4 opacity-50">
                      <Layers size={48} />
                    </div>
                    <p className="text-lg font-medium text-black">No tasks assigned yet.</p>
                    <p className="text-sm">Your nest is quiet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Activity Log or other tabs
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              <p>Content for <strong>{activeTab}</strong> under construction.</p>
            </div>
          )}
        </div >

      </main >
    </div >
  );
};

export default Dashboard;
