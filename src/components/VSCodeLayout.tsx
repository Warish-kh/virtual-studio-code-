import React, { useEffect } from 'react';
import VSCodeTitleBar from './titlebar/VSCodeTitleBar';
import VSCodeActivityBar from './sidebar/VSCodeActivityBar';
import VSCodeSidebar from './sidebar/VSCodeSidebar';
import VSCodeEditor from './editor/VSCodeEditor';
import VSCodePanel from './panel/VSCodePanel';
import VSCodeStatusBar from './statusbar/VSCodeStatusBar';
import ContextMenu from './common/ContextMenu';
import DragProvider from './common/DragProvider';
import { useUIStore } from '@/store/uiStore';

const VSCodeLayout: React.FC = () => {
  const { state: uiState, setTheme } = useUIStore();
  
  // Initialize theme
  useEffect(() => {
    // Apply theme class
    if (uiState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [uiState.theme]);

  // Context menu close is handled inside the ContextMenu component.

  return (
    <DragProvider>
      <div className="vscode-wrapper">
        <VSCodeTitleBar />
        <div className="vscode-main">
          <VSCodeActivityBar />
          {uiState.isSidebarOpen && <VSCodeSidebar />}
          <div className="vscode-content">
            <VSCodeEditor />
            {uiState.isTerminalOpen && <VSCodePanel />}
          </div>
        </div>
        <VSCodeStatusBar />
        <ContextMenu />
      </div>
    </DragProvider>
  );
};

export default VSCodeLayout;