export default function ProjectCard({ title, deadline, onClick }) {
  return (
    <div className="project-card" onClick={onClick}>
      {/* Accent bar */}
      <div className="project-accent" />

      {/* Content */}
      <div className="project-content">
        <h3>{title}</h3>

        <div className="project-meta">
          <span className="project-deadline">
            ⏰ {deadline}
          </span>

          <span className="project-status">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
