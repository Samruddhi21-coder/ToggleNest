import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🪺</div>
        <div>
          <h2>ToggleNest</h2>
          <span>Workspace</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>
          <span>📊</span> Dashboard
        </NavLink>

        <NavLink to="/projects" className={linkClass}>
          <span>📁</span> Projects
        </NavLink>

        <NavLink to="/tasks" className={linkClass}>
          <span>🧩</span> Tasks
        </NavLink>

        <NavLink to="/dashboard" className={linkClass}>
          <span>🕒</span> Activity
        </NavLink>
      </nav>

      {/* Workspace section (unique idea) */}
      <div className="workspace-card">
        <h4>Current Workspace</h4>
        <p>ToggleNest Team</p>
        <span>4 Members Online</span>
      </div>

      {/* Footer */}
      <button className="logout-btn">
        Logout
      </button>
    </aside>
  );
}
