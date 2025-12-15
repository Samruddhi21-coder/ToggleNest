import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const nav = useNavigate();

  return (
    <>
      <Navbar />

      <div className="projects-page">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>Manage, track, and collaborate on all your projects</p>
          </div>

          <button className="create-project-btn">
            ➕ New Project
          </button>
        </div>

        {/* Summary Stats */}
        <div className="projects-stats">
          <div className="stat mini blue">
            <h3>6</h3>
            <span>Total</span>
          </div>
          <div className="stat mini green">
            <h3>4</h3>
            <span>Active</span>
          </div>
          <div className="stat mini orange">
            <h3>1</h3>
            <span>Completed</span>
          </div>
          <div className="stat mini red">
            <h3>1</h3>
            <span>Overdue</span>
          </div>
        </div>

        {/* Controls */}
        <div className="projects-controls">
          <input
            className="project-search"
            placeholder="🔍 Search projects..."
          />

          <div className="filter-chips">
            <span className="chip active">All</span>
            <span className="chip">Active</span>
            <span className="chip">Completed</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="projects-grid">
          <ProjectCard
            title="Website Redesign"
            deadline="20 Oct 2025"
            onClick={() => nav("/project/1")}
          />

          <ProjectCard
            title="Mobile App UI"
            deadline="5 Nov 2025"
            onClick={() => nav("/project/2")}
          />

          <ProjectCard
            title="Backend API Setup"
            deadline="30 Oct 2025"
            onClick={() => nav("/project/3")}
          />
        </div>

        {/* Tip Banner (unique idea) */}
        <div className="projects-tip">
          💡 Tip: Click on a project to open its Kanban board and track tasks in real time.
        </div>
      </div>
    </>
  );
}
