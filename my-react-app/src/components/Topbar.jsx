import React from 'react';

const TopBar = ({ projectName }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <select className="bg-gray-700 px-4 py-2 rounded-xl text-sm text-white border border-gray-600 focus:border-blue-500 focus:outline-none">
          <option>All Projects</option>
        </select>
        <h2 className="text-xl font-bold text-white">{projectName}</h2>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-700 rounded-xl text-white">📅</button>
        <button className="p-2 hover:bg-gray-700 rounded-xl text-white">⚙️</button>
        <div className="w-px h-6 bg-gray-600" />
        <span className="text-sm text-gray-200">In Progress</span>
      </div>
    </div>
  </div>
);

export default TopBar;  // ✅ THIS WAS MISSING
