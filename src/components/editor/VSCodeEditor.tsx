import React from 'react';
import VSCodeTabs from './VSCodeTabs';
import EditorPane from './EditorPane';
import { useEditorStore } from '@/store/editorStore';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { X } from 'lucide-react';

const VSCodeEditor: React.FC = () => {
  const { state: editorState, openFile } = useEditorStore();

  // Show welcome page if no tabs are open
  const renderContent = () => {
    if (editorState.tabs.length === 0) {
      return <WelcomePage openFile={openFile} />;
    }
    return <EditorPane />;
  };

  return (
    <div className="vscode-editor">
      <VSCodeTabs />
      {renderContent()}
    </div>
  );
};

// Welcome Page component when no files are open
const WelcomePage: React.FC<{ openFile: any }> = ({ openFile }) => {
  const { loadExternalFolder } = useFileSystemStore();

  const handleNewFile = () => {
    openFile({
      id: 'untitled-' + Date.now(),
      name: 'Untitled',
      type: 'file',
      path: '/untitled-' + Date.now(),
      content: '',
      extension: 'txt',
    });
  };

  const handleOpenFolder = async () => {
    // File System Access API (Chromium browsers)
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker();
      console.log('Opening folder:', dirHandle.name);
      
      // Load the folder contents into the file system
      await loadExternalFolder(dirHandle);
      
    } catch (e) {
      console.error('Error opening folder:', e);
      // Fallback for browsers that don't support File System Access API
      alert('Folder open cancelled or not supported in this browser. Please use a Chromium-based browser for folder access.');
    }
  };

  const handleCloneRepo = async () => {
    const url = prompt('Enter repository URL to clone:');
    if (url && url.trim()) {
      openFile({
        id: 'repo-' + Date.now(),
        name: 'Cloned Repo',
        type: 'file',
        path: '/repo-' + Date.now(),
        content: `Cloned repository: ${url}`,
        extension: 'txt',
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-light mb-6 text-gray-300">Visual Studio Code</h1>
        <h2 className="text-xl font-light mb-6 text-gray-400">Editing evolved</h2>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="text-lg mb-2 text-foreground">Start</h3>
            <div className="flex flex-col items-start gap-2">
              <button className="text-sm text-blue-500 hover:underline flex items-center" onClick={handleNewFile}>
                <span className="mr-2">⊞</span> New File...
              </button>
              <button className="text-sm text-blue-500 hover:underline flex items-center" onClick={handleOpenFolder}>
                <span className="mr-2">📂</span> Open Folder...
              </button>
              <button className="text-sm text-blue-500 hover:underline flex items-center" onClick={handleCloneRepo}>
                <span className="mr-2">📂</span> Clone Repository...
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg mb-2 text-foreground">Recent</h3>
            <div className="flex flex-col items-start gap-2 text-left">
              <span className="text-sm text-blue-500 truncate max-w-full cursor-default">No recent folders</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg mb-2 text-foreground">Walkthroughs</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border border-border p-3 rounded-md text-left hover:bg-accent cursor-pointer">
              <div className="font-medium mb-1">Get Started with VS Code</div>
              <div className="text-xs">Customize your editor, learn keyboard shortcuts, install extensions</div>
            </div>
            <div className="border border-border p-3 rounded-md text-left hover:bg-accent cursor-pointer">
              <div className="font-medium mb-1">Learn the Fundamentals</div>
              <div className="text-xs">Navigate, search, edit, and debug your code</div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button className="flex items-center text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3 mr-1" /> Don't show welcome page again
          </button>
        </div>
      </div>
    </div>
  );
};

export default VSCodeEditor;