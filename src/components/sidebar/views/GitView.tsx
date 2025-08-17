import React from 'react';
import { GitBranch, ChevronDown, MoreHorizontal, FileText, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';

const GitView: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="vscode-sidebar-title">
        <div className="uppercase">Source Control</div>
        <div className="flex space-x-1">
          <button className="p-0.5 rounded hover:bg-accent">
            <RefreshCw className="h-3 w-3" />
          </button>
          <button className="p-0.5 rounded hover:bg-accent">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center px-4 py-2">
        <input
          type="text"
          placeholder="Message (Ctrl+Enter to commit)"
          className="w-full h-7 px-2 text-xs bg-muted rounded-sm border border-input focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      
      <div className="vscode-sidebar-title">
        <div className="flex items-center">
          <ChevronDown className="h-3 w-3 mr-1" />
          <span>CHANGES</span>
        </div>
        <div className="flex space-x-1">
          <button className="p-0.5 rounded hover:bg-accent">
            <PlusCircle className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <div className="px-4 py-1 hover:bg-accent flex items-center group cursor-pointer">
          <FileText className="h-4 w-4 mr-1 text-yellow-500" />
          <span className="text-sm flex-1">src/index.js</span>
          <div className="hidden group-hover:flex items-center space-x-1">
            <button className="p-0.5 rounded hover:bg-muted">
              <PlusCircle className="h-3 w-3" />
            </button>
            <button className="p-0.5 rounded hover:bg-muted">
              <MinusCircle className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div className="px-4 py-1 hover:bg-accent flex items-center group cursor-pointer">
          <FileText className="h-4 w-4 mr-1 text-blue-500" />
          <span className="text-sm flex-1">README.md</span>
          <div className="hidden group-hover:flex items-center space-x-1">
            <button className="p-0.5 rounded hover:bg-muted">
              <PlusCircle className="h-3 w-3" />
            </button>
            <button className="p-0.5 rounded hover:bg-muted">
              <MinusCircle className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-2 flex items-center">
        <GitBranch className="h-4 w-4 mr-1" />
        <span className="text-xs">main</span>
        <span className="ml-auto text-xs text-muted-foreground">Sync Changes</span>
      </div>
    </div>
  );
};

export default GitView;