import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Maximize2, Minimize2 } from 'lucide-react';
import Terminal from './Terminal';
import { useTerminalStore } from '@/store/terminalStore';
import { useUIStore } from '@/store/uiStore';

const VSCodePanel: React.FC = () => {
  const { state, setTerminalHeight } = useTerminalStore();
  const { toggleTerminal } = useUIStore();
  const [activeTab, setActiveTab] = useState<'terminal' | 'problems' | 'output'>('terminal');
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const initialY = useRef<number>(0);
  const initialHeight = useRef<number>(state.height);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && panelRef.current) {
        const deltaY = initialY.current - e.clientY;
        const newHeight = Math.max(100, initialHeight.current + deltaY);
        
        panelRef.current.style.height = `${newHeight}px`;
        setTerminalHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setTerminalHeight]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    initialY.current = e.clientY;
    initialHeight.current = state.height;
    setIsResizing(true);
  };

  return (
    <div 
      ref={panelRef} 
      className="vscode-panel"
      style={{ height: `${state.height}px` }}
    >
      {/* Resize handle */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent z-10"
        onMouseDown={handleResizeStart}
      />
      
      <div className="vscode-panel-header">
        <div className="vscode-panel-tabs">
          <button 
            className={`vscode-panel-tab ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            TERMINAL
          </button>
          <button 
            className={`vscode-panel-tab ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
          >
            PROBLEMS
          </button>
          <button 
            className={`vscode-panel-tab ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            OUTPUT
          </button>
        </div>
        
        <div className="ml-auto flex items-center">
          <button className="p-1 rounded-sm hover:bg-accent" title="Maximize Panel">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button className="p-1 rounded-sm hover:bg-accent" title="Restore Panel">
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1 rounded-sm hover:bg-accent" 
            title="Close Panel"
            onClick={toggleTerminal}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      {activeTab === 'terminal' && <Terminal />}
      {activeTab === 'problems' && <ProblemsPanel />}
      {activeTab === 'output' && <OutputPanel />}
    </div>
  );
};

// Problems Panel component
const ProblemsPanel: React.FC = () => {
  return (
    <div className="flex-1 bg-card text-card-foreground p-4 overflow-auto">
      <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
        <p>No problems have been detected in the workspace.</p>
      </div>
    </div>
  );
};

// Output Panel component
const OutputPanel: React.FC = () => {
  return (
    <div className="flex-1 bg-card text-card-foreground p-4 overflow-auto">
      <div className="text-xs font-mono whitespace-pre-wrap">
        <div className="text-muted-foreground">Output will appear here when you run a command.</div>
      </div>
    </div>
  );
};

export default VSCodePanel;