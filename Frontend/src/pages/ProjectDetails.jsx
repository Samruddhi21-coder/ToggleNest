import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";

export default function ProjectDetails() {
  return (
    <>
      <Navbar />

      <div className="project-details">
        {/* Project Header */}
        <div className="project-header">
          <div>
            <h1>Website Redesign</h1>
            <p>Improve UI, UX and performance of the main website</p>
          </div>

          <div className="project-meta">
            <span className="status active">● Active</span>
            <span className="deadline">⏰ 30 Oct 2025</span>
          </div>
        </div>

        {/* Team & Actions */}
        <div className="project-actions">
          <div className="team-avatars">
            <div className="avatar">S</div>
            <div className="avatar">A</div>
            <div className="avatar">M</div>
            <span>+2</span>
          </div>

          <div className="action-buttons">
            <button className="btn secondary">🔍 Filter</button>
            <button className="btn secondary">📤 Share</button>
            <button className="btn primary">➕ Add Task</button>
          </div>
        </div>

        {/* Stats */}
        <div className="project-stats">
          <div className="stat-box blue">
            <h3>12</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-box green">
            <h3>7</h3>
            <p>Completed</p>
          </div>
          <div className="stat-box orange">
            <h3>3</h3>
            <p>Pending</p>
          </div>
          <div className="stat-box red">
            <h3>2</h3>
            <p>Overdue</p>
          </div>
        </div>

        {/* Insight Banner (unique) */}
        <div className="project-insight">
          💡 Tip: Drag tasks between columns to automatically update progress.
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </>
  );
}
