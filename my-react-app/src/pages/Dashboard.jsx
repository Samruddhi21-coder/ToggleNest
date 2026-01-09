import React, { useState } from 'react';
import Sidebar from "../components/Sidebar"; 
import Kanban from "./Kanban";

const Dashboard = () => {
  const [activeProject, setActiveProject] = useState('Apex rebranding for Super Bowl');

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-300">Projects</h1>
            
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg text-white">👤</button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium">
              + New Project
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <Kanban projectName={activeProject} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;  // ✅ ADDED EXPORT
