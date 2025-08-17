import React from 'react';
import { useUIStore } from '@/store/uiStore';
import ExplorerView from './views/ExplorerView';
import SearchView from './views/SearchView';
import GitView from './views/GitView';
import DebugView from './views/DebugView';
import ExtensionsView from './views/ExtensionsView';

const VSCodeSidebar: React.FC = () => {
  const { state: uiState } = useUIStore();

  // Render appropriate view based on active view state
  const renderView = () => {
    switch (uiState.activeView) {
      case 'explorer':
        return <ExplorerView />;
      case 'search':
        return <SearchView />;
      case 'git':
        return <GitView />;
      case 'debug':
        return <DebugView />;
      case 'extensions':
        return <ExtensionsView />;
      default:
        return <ExplorerView />;
    }
  };

  return (
    <div className="vscode-sidebar">
      {renderView()}
    </div>
  );
};

export default VSCodeSidebar;