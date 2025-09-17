import React from 'react';
import {
  Files, Search, GitBranch, Bug, Package, History, User, Settings
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { SidebarView } from '@/types';

const icons = [
  { view: 'explorer', icon: Files, label: 'Explorer' },
  { view: 'search', icon: Search, label: 'Search' },
  { view: 'git', icon: GitBranch, label: 'Source Control' },
  { view: 'debug', icon: Bug, label: 'Run & Debug' },
  { view: 'extensions', icon: Package, label: 'Extensions' },
  { view: 'history', icon: History, label: 'History' },
];

const VSCodeActivityBar: React.FC = () => {
  const { state: uiState, setActiveView } = useUIStore();

  return (
    <nav className="flex flex-col items-center bg-[#23272e] w-12 py-2 h-full border-r border-[#22242b] select-none">
      <div className="flex flex-col gap-1 flex-1 w-full">
        {icons.map(({ view, icon: Icon, label }) => (
          <button
            key={view}
            className={`group relative flex items-center justify-center w-full h-11 focus:outline-none ${uiState.activeView === view ? 'bg-[#2c313a]' : 'hover:bg-[#282c34]'}`}
            onClick={() => setActiveView(view as SidebarView)}
            aria-label={label}
            title={label}
          >
            {/* Active indicator bar */}
            <span className={`absolute left-0 top-0 h-full w-1 rounded-r ${uiState.activeView === view ? 'bg-blue-500' : ''}`}></span>
            <Icon className={`h-6 w-6 mx-auto ${uiState.activeView === view ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
            {/* Tooltip */}
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-lg transition-opacity duration-200">
              {label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1 w-full mt-auto">
        <button className="group relative flex items-center justify-center w-full h-11 hover:bg-[#282c34]" aria-label="Accounts" title="Accounts">
          <User className="h-6 w-6 mx-auto text-gray-400 group-hover:text-white" />
        </button>
        <button className="group relative flex items-center justify-center w-full h-11 hover:bg-[#282c34]" aria-label="Manage" title="Manage">
          <Settings className="h-6 w-6 mx-auto text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </nav>
  );
};

export default VSCodeActivityBar;