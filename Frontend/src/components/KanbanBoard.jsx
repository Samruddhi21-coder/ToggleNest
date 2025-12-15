import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import TaskCard from "./TaskCard";

const initialTasks = {
  todo: [
    {
      id: "1",
      title: "Design Dashboard UI",
      description: "Create wireframes and final UI",
      priority: "High",
      assignedTo: "Sam",
      dueDate: "25 Oct"
    }
  ],
  progress: [
    {
      id: "2",
      title: "Build Kanban Logic",
      description: "Implement drag and drop",
      priority: "Medium",
      assignedTo: "Alex",
      dueDate: "28 Oct"
    }
  ],
  done: [
    {
      id: "3",
      title: "Setup Project",
      description: "Initialize React project",
      priority: "Low",
      assignedTo: "Team",
      dueDate: "20 Oct"
    }
  ]
};

const columnTitles = {
  todo: "To Do",
  progress: "In Progress",
  done: "Done"
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    if (sourceCol === destCol) return;

    const sourceTasks = [...tasks[sourceCol]];
    const [moved] = sourceTasks.splice(result.source.index, 1);

    const destTasks = [...tasks[destCol]];
    destTasks.splice(result.destination.index, 0, moved);

    setTasks({
      ...tasks,
      [sourceCol]: sourceTasks,
      [destCol]: destTasks
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container">
        {Object.keys(tasks).map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="kanban-column"
              >
                {/* Column Header */}
                <div className="kanban-header">
                  <h4>{columnTitles[col]}</h4>
                  <span className="task-count">
                    {tasks[col].length}
                  </span>
                </div>

                {/* Tasks */}
                {tasks[col].length === 0 && (
                  <p className="empty-text">No tasks here</p>
                )}

                {tasks[col].map((task, index) => (
                  <Draggable
                    draggableId={task.id}
                    index={index}
                    key={task.id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="kanban-task"
                      >
                        <TaskCard task={task} />
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
