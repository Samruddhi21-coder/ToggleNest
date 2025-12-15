import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        <button onClick={() => nav("/dashboard")}>
          ⬅ Go Back to Dashboard
        </button>
      </div>
    </div>
  );
}
