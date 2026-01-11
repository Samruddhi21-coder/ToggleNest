import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Apex rebranding for Super Bowl",
      tasks: [
        {
          id: 101,
          name: "Define Brand Voice",
          description: "Finalize tone & messaging",
          assignedTo: "Sam",
          deadline: "2026-01-12",
          status: "Done",
          completed: true,
        },
        {
          id: 102,
          name: "Asset Creation Phase 1",
          description: "Initial creatives",
          assignedTo: "Team",
          deadline: "2026-01-15",
          status: "In Progress",
          completed: false,
        },
      ],
    },
  ]);

  /* ================= ADMIN ACTIONS ================= */

  // ➕ Add Project
  const addProject = (name) => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        tasks: [],
      },
    ]);
  };

  // ➕ Add Task (WITH DEADLINE SUPPORT)
  const addTask = (projectId, task) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                {
                  id: task.id || Date.now(),
                  name: task.name,
                  description: task.description || "",
                  assignedTo: task.assignedTo || "",
                  deadline: task.deadline, // ✅ IMPORTANT
                  status: task.status || "To-Do",
                  completed: task.completed || false,
                },
              ],
            }
          : project
      )
    );
  };

  // ✅ Toggle task status
  const toggleTask = (projectId, taskId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed: !task.completed,
                      status: !task.completed ? "Done" : "In Progress",
                    }
                  : task
              ),
            }
          : project
      )
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        projects,
        addProject,
        addTask,
        toggleTask,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
