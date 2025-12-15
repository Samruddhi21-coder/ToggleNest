import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  return (
    <div className="auth-layout">
      {/* Left Branding Section */}
      <div className="auth-left">
        <h1>
          Toggle<span>Nest</span>
        </h1>
        <p>Organize • Collaborate • Deliver</p>

        <ul>
          <li>📊 Visual Kanban Boards</li>
          <li>👥 Team Collaboration</li>
          <li>⚡ Real-time Progress Tracking</li>
        </ul>
      </div>

      {/* Right Login Card */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>

          <div className="input-group">
            <input type="email" required />
            <label>Email address</label>
          </div>

          <div className="input-group">
            <input type="password" required />
            <label>Password</label>
          </div>

          <button onClick={() => nav("/dashboard")}>
            Sign In
          </button>

          <div
            className="auth-link"
            onClick={() => nav("/register")}
          >
            Create a new account →
          </div>
        </div>
      </div>
    </div>
  );
}
