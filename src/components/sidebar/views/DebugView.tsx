import React from 'react';
import { ChevronDown, Play, MoreHorizontal, Bug } from 'lucide-react';

const DebugView: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="vscode-sidebar-title">
        <div className="uppercase">Run and Debug</div>
        <div className="flex space-x-1">
          <button className="p-0.5 rounded hover:bg-accent">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center p-4 text-center flex-1 text-sm">
        <Bug className="h-8 w-8 mb-2 opacity-20" />
        <p className="mb-4">Run and Debug</p>
        <button className="flex items-center px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm text-xs">
          <Play className="h-3 w-3 mr-1" /> Run and Debug
        </button>
        <p className="mt-4 text-xs text-muted-foreground">To customize Run and Debug create a launch.json file.</p>
      </div>
      
      <div className="vscode-sidebar-title">
        <div className="flex items-center">
          <ChevronDown className="h-3 w-3 mr-1" />
          <span>BREAKPOINTS</span>
        </div>
      </div>
      
      <div className="px-4 py-1 text-xs text-muted-foreground">
        No breakpoints
      </div>
    </div>
  );
};

export default DebugView;