import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  return (
    <div className="auth-layout">
      {/* Left Branding */}
      <div className="auth-left">
        <h1>
          Toggle<span>Nest</span>
        </h1>
        <p>Start organizing work the smart way</p>

        <ul>
          <li>🚀 Boost team productivity</li>
          <li>🧠 Visual task tracking</li>
          <li>📈 Real-time progress insights</li>
        </ul>
      </div>

      {/* Right Register Card */}
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Join ToggleNest in seconds</p>

          <div className="input-group">
            <input type="text" required />
            <label>Full Name</label>
          </div>

          <div className="input-group">
            <input type="email" required />
            <label>Email address</label>
          </div>

          <div className="input-group">
            <input type="password" required />
            <label>Password</label>
          </div>

          {/* Password hint (unique touch) */}
          <div className="password-hint">
            🔒 Use at least 8 characters
          </div>

          <button onClick={() => nav("/")}>
            Create Account
          </button>

          <div
            className="auth-link"
            onClick={() => nav("/")}
          >
            Already have an account? Sign in →
          </div>
        </div>
      </div>
    </div>
  );
}
