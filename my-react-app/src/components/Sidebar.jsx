import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Users,
  Calendar,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
    active: false,
  },
  {
    id: "kanban",
    title: "Kanban Board", 
    icon: FolderKanban,
    color: "from-emerald-500 to-teal-500",
    active: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    active: false,
  },
  {
    id: "team",
    title: "Team",
    icon: Users,
    color: "from-orange-500 to-red-500",
    active: false,
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: Calendar,
    color: "from-indigo-500 to-violet-500",
    active: false,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-black/95 backdrop-blur-md text-white transition-all duration-500 min-h-screen ${
      isCollapsed ? 'w-20' : 'w-100'
    } p-8 border-r border-gray-900/50 shadow-2xl`}>
      
      {/* Logo/Brand */}
      <div className="flex items-center mb-16 justify-between">
        {!isCollapsed && (
          <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
            ToggleNest
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 rounded-2xl bg-gray-900/70 hover:bg-gradient-to-r from-gray-700 to-gray-600 hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-6 flex-1">
        {/* Section Labels */}
        {!isCollapsed && (
          <p className="uppercase text-xs font-bold text-gray-400 tracking-widest mb-8 pl-1 border-l-4 border-emerald-500/50 ml-1">
            Main Menu
          </p>
        )}

        {/* Menu Items - MORE SPACING */}
        <div className="space-y-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                className={`
                  group block p-6 py-7 rounded-3xl transition-all duration-300 flex items-center space-x-5 h-20
                  border-2 border-transparent
                  ${item.active 
                    ? `bg-gradient-to-r ${item.color} text-black shadow-2xl shadow-${item.color.split('-')[1]}-500/25 border-${item.color.split('-')[1]}-400/50 scale-[1.02]` 
                    : 'bg-gray-900/50 hover:bg-gradient-to-r hover:from-gray-800/70 hover:to-gray-700/70 hover:border-gray-600/50 hover:scale-[1.01] text-gray-200'
                  }
                  ${isCollapsed ? 'justify-center space-x-0 p-5 h-auto' : ''}
                `}
              >
                <div className={`
                  p-3 rounded-2xl flex-shrink-0 shadow-lg transition-all duration-300
                  ${item.active 
                    ? `bg-white/20 backdrop-blur-sm shadow-2xl shadow-${item.color.split('-')[1]}-500/30 scale-110` 
                    : 'bg-gray-800/50 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-gray-700/50 group-hover:shadow-xl group-hover:scale-105 text-gray-300'
                  }
                `}>
                  <Icon size={22} />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-base tracking-wide block leading-tight">
                      {item.title}
                    </span>
                    {item.active && (
                      <div className={`h-1 w-full bg-gradient-to-r ${item.color} rounded-full mt-2 shadow-sm`}></div>
                    )}
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Settings Section */}
      {!isCollapsed && (
        <>
          <div className="mt-16 pt-10 border-t border-gray-900/50">
            <p className="uppercase text-xs font-bold text-gray-400 tracking-widest mb-6 pl-1 border-l-4 border-purple-500/50 ml-1">
              Settings
            </p>
            <a className="
              block p-6 py-7 rounded-3xl h-20 text-gray-200 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 
              hover:border-purple-500/30 hover:text-white hover:scale-[1.01] transition-all duration-300 flex items-center space-x-5 
              border-2 border-transparent group shadow-xl hover:shadow-2xl
            ">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm shadow-lg flex-shrink-0 border border-purple-500/30">
                <Settings size={22} className="text-purple-300" />
              </div>
              <span className="font-bold text-base tracking-wide">Settings</span>
            </a>
          </div>
        </>
      )}
    </aside>
  );
}
