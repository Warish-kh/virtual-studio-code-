import React from 'react';
import { X, FileCode, FileText, CircleDot } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

const VSCodeTabs: React.FC = () => {
  const { state: editorState, setActiveTab, closeTab } = useEditorStore();
  const { tabs, activeTabId } = editorState;

  // Handle tab click
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Handle tab close
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  };

  // Get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    if (!fileName.includes('.')) return <FileText className="h-4 w-4 mr-1" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="h-4 w-4 mr-1 text-yellow-600" />;
      case 'html':
        return <FileCode className="h-4 w-4 mr-1 text-orange-500" />;
      case 'css':
      case 'scss':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'json':
        return <FileCode className="h-4 w-4 mr-1 text-yellow-400" />;
      case 'md':
        return <FileText className="h-4 w-4 mr-1 text-blue-400" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="vscode-tabs">
      {tabs.map((tab) => (
        <div 
          key={tab.id}
          className={`vscode-tab group ${activeTabId === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          {getFileIcon(tab.fileName)}
          <span className="mr-1">{tab.fileName}</span>
          {tab.isDirty && <CircleDot className="h-2.5 w-2.5 mr-1 text-muted-foreground" />}
          <button 
            className="h-4 w-4 flex items-center justify-center rounded-sm hover:bg-muted"
            onClick={(e) => handleTabClose(e, tab.id)}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default VSCodeTabs;