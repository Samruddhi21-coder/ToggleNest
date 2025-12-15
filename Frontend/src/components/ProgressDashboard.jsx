export default function ProgressDashboard() {
  return (
    <div className="card progress-card">
      <h3>Project Progress</h3>

      {/* Stats Row */}
      <div className="progress-stats">
        <div className="stat-box completed">
          <h4>Completed</h4>
          <span>12</span>
        </div>

        <div className="stat-box pending">
          <h4>Pending</h4>
          <span>4</span>
        </div>

        <div className="stat-box total">
          <h4>Total Tasks</h4>
          <span>16</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label">
          <span>Overall Completion</span>
          <span>75%</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {/* Insights */}
      <div className="progress-insights">
        <div>🚀 Productivity is high today</div>
        <div>⏳ 2 tasks near deadline</div>
        <div>👥 Team collaboration active</div>
      </div>
    </div>
  );
}
