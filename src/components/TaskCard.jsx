export default function TaskCard({ task }) {
  const priorityConfig = {
    High: { color: "#ef4444", icon: "🔥" },
    Medium: { color: "#f59e0b", icon: "⚡" },
    Low: { color: "#22c55e", icon: "🌿" }
  };

  const priority = priorityConfig[task.priority] || {
    color: "#6366f1",
    icon: "📌"
  };

  return (
    <div
      className="task-card"
      style={{ borderLeft: `6px solid ${priority.color}` }}
    >
      {/* Header */}
      <div className="task-header">
        <h4>{task.title}</h4>
        <span
          className="priority-badge"
          style={{ background: priority.color }}
        >
          {priority.icon} {task.priority || "Normal"}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-desc">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="task-footer">
        <div className="task-user">
          <div className="avatar">
            {task.assignedTo
              ? task.assignedTo.charAt(0).toUpperCase()
              : "?"}
          </div>
          <span>{task.assignedTo || "Unassigned"}</span>
        </div>

        <div className="task-date">
          📅 {task.dueDate || "No date"}
        </div>
      </div>
    </div>
  );
}
