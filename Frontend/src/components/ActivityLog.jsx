const activities = [
  {
    icon: "📝",
    title: "Task Updated",
    description: "UI Design task moved to In Progress",
    time: "2 minutes ago"
  },
  {
    icon: "👤",
    title: "Task Assigned",
    description: "Backend API task assigned to Sam",
    time: "10 minutes ago"
  },
  {
    icon: "✅",
    title: "Task Completed",
    description: "Login page implementation completed",
    time: "1 hour ago"
  },
  {
    icon: "📁",
    title: "Project Created",
    description: "New project 'ToggleNest UI Revamp' created",
    time: "Today"
  }
];

export default function ActivityLog() {
  return (
    <div className="card activity-card">
      <h3>Recent Activity</h3>

      <div className="activity-list">
        {activities.map((item, index) => (
          <div
            key={index}
            className="activity-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="activity-icon">{item.icon}</div>

            <div className="activity-content">
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
