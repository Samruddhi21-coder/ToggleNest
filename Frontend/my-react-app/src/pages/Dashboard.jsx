import React, { useState } from 'react';
import './Dashboard.css'; // Import the CSS file
import {
  Layers,
  Plus,
  Check,
  Briefcase,
  User,
  ArrowLeft,
  Clock,
  MoreHorizontal,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  // Mock Auth State (Replace with real AuthContext later)
  // Logic: If a user is logged in, pull their name from the auth state.
  const user = {
    name: "Sakshi",
    isLoggedIn: true
  };

  const [activeProject] = useState('Apex rebranding for Super Bowl');
  const [searchQuery, setSearchQuery] = useState("");
  // Ensure "Task Board" is the default active tab
  const [activeTab, setActiveTab] = useState("Task Board");

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

  // Interactive Tasks Logic
  const [tasks, setTasks] = useState([
    { id: 101, name: "Define Brand Voice", deadline: "Jan 12", status: "Done", completed: true },
    { id: 102, name: "Asset Creation Phase 1", deadline: "Jan 15", status: "In Progress", completed: false },
    { id: 103, name: "Review with Stakeholders", deadline: "Jan 18", status: "To-Do", completed: false },
    { id: 104, name: "Finalize Color Palette", deadline: "Jan 11", status: "Done", completed: true },
    { id: 105, name: "Weekly Sync Prep", deadline: "Jan 20", status: "To-Do", completed: false },
  ]);

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

  return (
    <div className="dashboard-container">
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

        {/* Contacts */}
        <div className="sidebar-section">
          <span className="section-title">Team Contacts</span>
          <div className="contacts-list">
            <div className="contact-item">
              <div className="avatar-circle">AS</div>
              <div className="contact-info">
                <h4>Alice Smith</h4>
                <p>alice@edu.global</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="avatar-circle">JD</div>
              <div className="contact-info">
                <h4>John Doe</h4>
                <p>john@edu.global</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="sidebar-section">
          <span className="section-title">Projects</span>
          <div className="projects-menu">
            <div className="project-item active">
              <div className="project-left">
                <Briefcase size={16} color="#000" />
                <span className="project-name">Apex Rebrand</span>
              </div>
              <div className="indicator"></div>
            </div>
            <div className="project-item">
              <div className="project-left">
                <span style={{ fontSize: '12px', color: '#94A3B8', width: '16px', textAlign: 'center' }}>#</span>
                <span className="project-name">Q1 Marketing</span>
              </div>
            </div>
            <div className="project-item">
              <div className="project-left">
                <span style={{ fontSize: '12px', color: '#94A3B8', width: '16px', textAlign: 'center' }}>#</span>
                <span className="project-name">Website Overhaul</span>
              </div>
            </div>
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
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="team-avatar">
                <User size={14} />
              </div>
            ))}
          </div>
        </div>

      </aside>

      {/* 3. MAIN CONTENT AREA (THE WORKSPACE) */}
      <main className="main-content">

        {/* Header */}
        <header className="main-header">
          <div className="project-title">
            <h1>{activeProject}</h1>
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
            {user.isLoggedIn && (
              <div className="user-profile-badge">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="tabs-container">
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
        </div>

        {/* Task Listing */}
        <div className="dashboard-body">
          {activeTab === "Task Board" ? (
            <>
              <div className="task-section-header">
                <h2>Active Tasks</h2>
                <span className="task-count">{filteredTasks.length} tasks found</span>
              </div>

              <div className="task-list">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
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
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    <p>No tasks match your search.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8' }}>
              <p>Content for <strong>{activeTab}</strong> under construction.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
