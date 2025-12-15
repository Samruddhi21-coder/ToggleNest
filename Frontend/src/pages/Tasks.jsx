import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";

export default function Tasks() {
  return (
    <>
      <Navbar />
      <div style={{ padding: 28 }}>
        <h1>Tasks</h1>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          View and manage all tasks across projects
        </p>

        <KanbanBoard />
      </div>
    </>
  );
}
