import React, { useState } from "react";
import "./Dashboard.css";
import { Plus, Briefcase } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

const AdminDashboard = () => {
  const { projects, addProject, addTask } = useDashboard();

  const [projectName, setProjectName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="dashboard-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <Briefcase size={22} />
          <span className="logo-text">ToggleNest Admin</span>
        </div>

        {/* CREATE PROJECT */}
        <div className="sidebar-section">
          <span className="section-title">Create Project</span>

          <input
            className="query-input"
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <button
            className="btn-add-query"
            onClick={() => {
              if (!projectName.trim()) return;
              addProject(projectName);
              setProjectName("");
            }}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {/* PROJECT LIST */}
        <div className="sidebar-section">
          <span className="section-title">Projects</span>

          {projects.map((p) => (
            <div
              key={p.id}
              className={`project-item ${
                selectedProject?.id === p.id ? "active" : ""
              }`}
              onClick={() => setSelectedProject(p)}
            >
              {p.name}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {selectedProject ? (
          <>
            <h1>{selectedProject.name}</h1>

            {/* ADD TASK SECTION */}
            <div className="task-section-header">
              <h2>Add Task</h2>
            </div>

            {/* TASK NAME */}
            <input
              className="query-input"
              placeholder="Task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            {/* DEADLINE */}
            <input
              type="date"
              className="query-input"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

            {/* ADD TASK BUTTON */}
            <button
              className="btn-add-query"
              onClick={() => {
                if (!taskName || !deadline) return;

                addTask(selectedProject.id, {
                  id: Date.now(),
                  name: taskName,
                  deadline: deadline,
                  status: "To-Do",
                  completed: false,
                });

                setTaskName("");
                setDeadline("");
              }}
            >
              <Plus size={16} /> Add Task
            </button>

            {/* TASK LIST */}
            <div className="task-list">
              {selectedProject.tasks.length > 0 ? (
                selectedProject.tasks.map((t) => (
                  <div key={t.id} className="task-card">
                    <div>
                      <span className="task-name">{t.name}</span>
                      <p className="task-deadline">
                        Deadline: {t.deadline}
                      </p>
                    </div>

                    <span className="status-badge todo">
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: "#94A3B8" }}>
                  No tasks added yet
                </p>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "#94A3B8" }}>
            Select a project to manage
          </p>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
