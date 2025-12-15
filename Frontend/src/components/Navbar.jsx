import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => nav("/dashboard")}>
        Toggle<span>Nest</span>
      </div>

      {/* Navigation */}
      <nav className="navbar-links">
        <button
          className={`nav-btn ${isActive("/projects") ? "active" : ""}`}
          onClick={() => nav("/projects")}
        >
          Projects
        </button>

        <button
          className="nav-btn logout"
          onClick={() => nav("/")}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
