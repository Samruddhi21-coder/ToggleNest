import Sidebar from "../components/Sidebar";
import ProgressDashboard from "../components/ProgressDashboard";
import ActivityLog from "../components/ActivityLog";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back 👋</h1>
            <p>Here’s what’s happening with your workspace today</p>
          </div>

          <button className="create-btn">
            ➕ New Project
          </button>
        </div>

        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="stat-card blue">
            <span>📁</span>
            <div>
              <h3>6</h3>
              <p>Active Projects</p>
            </div>
          </div>

          <div className="stat-card green">
            <span>✅</span>
            <div>
              <h3>18</h3>
              <p>Completed Tasks</p>
            </div>
          </div>

          <div className="stat-card orange">
            <span>⏳</span>
            <div>
              <h3>5</h3>
              <p>Pending Tasks</p>
            </div>
          </div>

          <div className="stat-card purple">
            <span>👥</span>
            <div>
              <h3>4</h3>
              <p>Team Members</p>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="dashboard-grid">
          <ProgressDashboard />
          <ActivityLog />
        </section>

        {/* Insight Banner (unique idea) */}
        <div className="insight-banner">
          🚀 Productivity is up by <strong>24%</strong> this week.
          Keep the momentum going!
        </div>
      </main>
    </div>
  );
}
