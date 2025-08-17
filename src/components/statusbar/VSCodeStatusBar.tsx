import React from 'react';
import { Bell, Check, GitBranch, Wifi, Sun, Moon, Terminal } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useUIStore } from '@/store/uiStore';

const VSCodeStatusBar: React.FC = () => {
  const { state: editorState } = useEditorStore();
  const { state: uiState, toggleTheme, toggleTerminal } = useUIStore();
  
  // Get active tab
  const activeTab = editorState.tabs.find(tab => tab.id === editorState.activeTabId);
  
  // Get cursor position
  const { lineNumber, column } = editorState.cursorPosition;
  
  return (
    <div className="vscode-statusbar">
      {/* Left section */}
      <div className="flex items-center">
        <div className="flex items-center px-2 border-r border-[hsla(0,0%,100%,.2)]">
          <GitBranch className="h-3.5 w-3.5 mr-1.5" />
          <span>main</span>
        </div>
        
        <div className="flex items-center px-2 border-r border-[hsla(0,0%,100%,.2)]">
          <Check className="h-3.5 w-3.5 mr-1.5" />
          <span>0</span>
          <span className="mx-1.5">⚠</span>
          <span>0</span>
        </div>
      </div>
      
      {/* Right section */}
      <div className="flex items-center ml-auto">
        {/* File path */}
        {activeTab && (
          <button 
            className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
            title="Current file path"
          >
            {activeTab.filePath}
          </button>
        )}
        
        {/* File type */}
        {activeTab && (
          <button 
            className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
            title="File type"
          >
            {activeTab.language}
          </button>
        )}
        
        {/* Line and column */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Go to line/column"
        >
          Ln {lineNumber}, Col {column}
        </button>
        
        {/* Spaces/Tabs */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Select indentation"
        >
          Spaces: 2
        </button>
        
        {/* Encoding */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Select encoding"
        >
          UTF-8
        </button>
        
        {/* EOL */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Select end of line sequence"
        >
          LF
        </button>
        
        {/* Terminal toggle button */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Toggle Terminal"
          onClick={toggleTerminal}
        >
          <Terminal className="h-3.5 w-3.5" />
        </button>
        
        {/* Notifications */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="No notifications"
        >
          <Bell className="h-3.5 w-3.5" />
        </button>
        
        {/* Connection status */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Connected"
        >
          <Wifi className="h-3.5 w-3.5" />
        </button>
        
        {/* Theme toggle */}
        <button 
          className="px-2 hover:bg-[hsla(0,0%,100%,.12)]"
          title="Toggle theme"
          onClick={toggleTheme}
        >
          {uiState.theme === 'dark' ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VSCodeStatusBar;