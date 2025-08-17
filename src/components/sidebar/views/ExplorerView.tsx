import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, MoreHorizontal, 
  FilePlus, FolderPlus, RefreshCw, X,
  FileCode, FileText, Folder, FolderOpen,
  ChevronUp, Pencil, Trash, Copy
} from 'lucide-react';
import { useFileSystemStore } from '@/store/fileSystemStore';
import { useEditorStore } from '@/store/editorStore';
import { useUIStore } from '@/store/uiStore';
import { FileNode } from '@/types';
import { Draggable, Droppable } from '@/components/common/DragProvider';

const ExplorerView: React.FC = () => {
  const { state: fsState, selectNode, createFile, createDirectory, deleteNode, renameNode, moveNode, testCreateFile } = useFileSystemStore();
  const { openFile } = useEditorStore();
  const { openContextMenu } = useUIStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/', '/src']));
  const [newItemPath, setNewItemPath] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'directory'>('file');
  const [renamingNode, setRenamingNode] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', { newItemPath, newItemName, newItemType, renamingNode, renamingValue });
    console.log('Current file system root:', fsState.root);
    console.log('Expanded folders:', Array.from(expandedFolders));
  }, [newItemPath, newItemName, newItemType, renamingNode, renamingValue, fsState.root, expandedFolders]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when no input is focused
      if (document.activeElement?.tagName === 'INPUT') return;
      
      const selectedNode = fsState.selectedNode;
      if (!selectedNode) return;

      if (e.key === 'F2') {
        // F2 to rename
        e.preventDefault();
        console.log('F2 pressed - renaming:', selectedNode.name);
        setRenamingNode(selectedNode.path);
        setRenamingValue(selectedNode.name);
      } else if (e.key === 'Delete') {
        // Delete key to delete
        e.preventDefault();
        const itemType = selectedNode.type === 'directory' ? 'folder' : 'file';
        const itemName = selectedNode.name;
        
        if (confirm(`Are you sure you want to delete the ${itemType} "${itemName}"?\n\nThis action cannot be undone.`)) {
          console.log(`Deleting ${itemType}:`, itemName);
          deleteNode(selectedNode.path);
        } else {
          console.log(`Delete cancelled for ${itemType}:`, itemName);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fsState.selectedNode, deleteNode]);

  const handleToggleExpand = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleNodeClick = (node: FileNode) => {
    selectNode(node);
    if (node.type === 'file') {
      openFile(node);
    }
  };

  const handleNodeContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    selectNode(node);
    
    console.log('Opening node context menu for:', node.name, 'at position:', e.clientX, e.clientY);
    
    const contextMenuItems = [
      {
        id: 'new-file',
        label: 'New File',
        icon: 'FilePlus',
        action: () => {
          console.log('New File action triggered for node:', node.name);
          if (node.type === 'directory') {
            console.log('Setting new file path to:', node.path);
            setNewItemPath(node.path);
            setNewItemType('file');
            setNewItemName('');
          } else {
            // For files, create in the parent directory
            const parts = node.path.split('/');
            parts.pop();
            const parentPath = parts.join('/') || '/';
            console.log('Setting new file path to parent:', parentPath);
            setNewItemPath(parentPath);
            setNewItemType('file');
            setNewItemName('');
          }
        },
      },
      {
        id: 'new-folder',
        label: 'New Folder',
        icon: 'FolderPlus',
        action: () => {
          if (node.type === 'directory') {
            setNewItemPath(node.path);
            setNewItemType('directory');
            setNewItemName('');
          } else {
            // For files, create in the parent directory
            const parts = node.path.split('/');
            parts.pop();
            const parentPath = parts.join('/') || '/';
            setNewItemPath(parentPath);
            setNewItemType('directory');
            setNewItemName('');
          }
        },
      },
      {
        id: 'separator-1',
        separator: true,
        label: '',
      },
      {
        id: 'rename',
        label: 'Rename',
        icon: 'Pencil',
        action: () => {
          console.log('Rename action triggered for node:', node.name, 'path:', node.path);
          alert('Rename action triggered!'); // Temporary alert to test
          setRenamingNode(node.path);
          setRenamingValue(node.name);
          console.log('Renaming state set:', { renamingNode: node.path, renamingValue: node.name });
        },
      },
      {
        id: 'copy-path',
        label: 'Copy Path',
        icon: 'Copy',
        action: () => {
          navigator.clipboard.writeText(node.path);
        },
      },
      {
        id: 'separator-2',
        separator: true,
        label: '',
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'Trash',
        action: () => {
          const itemType = node.type === 'directory' ? 'folder' : 'file';
          const itemName = node.name;
          
          console.log('Delete action triggered for:', itemType, itemName, 'path:', node.path);
          alert('Delete action triggered!'); // Temporary alert to test
          
          if (confirm(`Are you sure you want to delete the ${itemType} "${itemName}"?\n\nThis action cannot be undone.`)) {
            console.log(`Deleting ${itemType}:`, itemName, 'path:', node.path);
            deleteNode(node.path);
          } else {
            console.log(`Delete cancelled for ${itemType}:`, itemName);
          }
        },
      }
    ];

    openContextMenu(e.clientX, e.clientY, contextMenuItems);
  };

  const handleCreateNewItem = () => {
    console.log('Creating new item:', { newItemPath, newItemName, newItemType });
    if (!newItemPath || !newItemName.trim()) {
      console.log('Cannot create item: missing path or name');
      return;
    }

    let finalName = newItemName.trim();

    if (newItemType === 'file') {
      // Auto-add .js extension if no extension is provided
      if (!finalName.includes('.')) {
        finalName += '.js';
      }
      console.log('Creating file:', newItemPath, finalName);
      createFile(newItemPath, finalName);
    } else {
      console.log('Creating directory:', newItemPath, finalName);
      createDirectory(newItemPath, finalName);
    }
    
    // Ensure the parent folder is expanded
    if (!expandedFolders.has(newItemPath)) {
      handleToggleExpand(newItemPath);
    }
    
    setNewItemPath(null);
  };

  const handleRenameItem = () => {
    if (!renamingNode || !renamingValue.trim()) return;
    renameNode(renamingNode, renamingValue);
    setRenamingNode(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      setNewItemPath(null);
      setRenamingNode(null);
    }
  };

  // Handle new file button
  const handleNewFile = () => {
    console.log('New file button clicked');
    try {
      // Find the best location to create the file
      let targetPath = '/';
      
      // If there's a selected node and it's a directory, use that
      if (fsState.selectedNode && fsState.selectedNode.type === 'directory') {
        targetPath = fsState.selectedNode.path;
        console.log('Using selected directory:', targetPath);
      } else {
        // Find the first expanded directory or use root
        const expandedArray = Array.from(expandedFolders);
        const firstExpanded = expandedArray.find(path => {
          const node = fsState.root.children?.find(child => child.path === path);
          return node && node.type === 'directory';
        });
        
        if (firstExpanded) {
          targetPath = firstExpanded;
          console.log('Using first expanded directory:', targetPath);
        } else {
          // Fallback to root
          targetPath = '/';
          console.log('Using root directory');
        }
      }
      
      setNewItemPath(targetPath);
      setNewItemType('file');
      setNewItemName('');
      
      // Ensure target folder is expanded
      if (!expandedFolders.has(targetPath)) {
        handleToggleExpand(targetPath);
      }
      console.log('New file button action completed, target path:', targetPath);
    } catch (error) {
      console.error('Error in handleNewFile:', error);
    }
  };

  // Handle new folder button
  const handleNewFolder = () => {
    console.log('New folder button clicked');
    try {
      // Find the best location to create the folder
      let targetPath = '/';
      
      // If there's a selected node and it's a directory, use that
      if (fsState.selectedNode && fsState.selectedNode.type === 'directory') {
        targetPath = fsState.selectedNode.path;
        console.log('Using selected directory:', targetPath);
      } else {
        // Find the first expanded directory or use root
        const expandedArray = Array.from(expandedFolders);
        const firstExpanded = expandedArray.find(path => {
          const node = fsState.root.children?.find(child => child.path === path);
          return node && node.type === 'directory';
        });
        
        if (firstExpanded) {
          targetPath = firstExpanded;
          console.log('Using first expanded directory:', targetPath);
        } else {
          // Fallback to root
          targetPath = '/';
          console.log('Using root directory');
        }
      }
      
      setNewItemPath(targetPath);
      setNewItemType('directory');
      setNewItemName('');
      
      // Ensure target folder is expanded
      if (!expandedFolders.has(targetPath)) {
        handleToggleExpand(targetPath);
      }
      console.log('New folder button action completed, target path:', targetPath);
    } catch (error) {
      console.error('Error in handleNewFolder:', error);
    }
  };

  // Handle refresh button
  const handleRefresh = () => {
    // Force re-render by updating expanded folders
    setExpandedFolders(new Set(expandedFolders));
  };

  // Handle explorer three-dot menu
  const handleExplorerMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Opening explorer context menu');
    
    const contextMenuItems = [
      {
        id: 'new-file',
        label: 'New File',
        icon: 'FilePlus',
        action: handleNewFile,
      },
      {
        id: 'new-folder',
        label: 'New Folder',
        icon: 'FolderPlus',
        action: handleNewFolder,
      },
      {
        id: 'separator-1',
        separator: true,
        label: '',
      },
      {
        id: 'refresh',
        label: 'Refresh',
        icon: 'RefreshCw',
        action: handleRefresh,
      },
      {
        id: 'separator-2',
        separator: true,
        label: '',
      },
      {
        id: 'collapse-all',
        label: 'Collapse All',
        icon: 'ChevronUp',
        action: () => setExpandedFolders(new Set()),
      },
      {
        id: 'expand-all',
        label: 'Expand All',
        icon: 'ChevronDown',
        action: () => {
          const allPaths = new Set<string>();
          const collectPaths = (node: FileNode) => {
            if (node.type === 'directory') {
              allPaths.add(node.path);
              node.children?.forEach(collectPaths);
            }
          };
          collectPaths(fsState.root);
          setExpandedFolders(allPaths);
        },
      },
    ];

    openContextMenu(e.clientX, e.clientY, contextMenuItems);
  };

  const getFileNameColor = (node: FileNode) => {
    if (node.type === 'directory') return 'text-yellow-400';
    
    const extension = node.extension?.toLowerCase();
    switch (extension) {
      case 'js':
        return 'text-yellow-500';
      case 'jsx':
        return 'text-yellow-600';
      case 'ts':
        return 'text-blue-500';
      case 'tsx':
        return 'text-blue-600';
      case 'html':
        return 'text-orange-500';
      case 'css':
      case 'scss':
      case 'sass':
        return 'text-blue-400';
      case 'json':
        return 'text-yellow-400';
      case 'md':
        return 'text-blue-400';
      case 'py':
        return 'text-green-500';
      case 'java':
        return 'text-red-500';
      case 'cpp':
      case 'c':
        return 'text-blue-600';
      case 'php':
        return 'text-purple-500';
      case 'rb':
        return 'text-red-400';
      case 'go':
        return 'text-blue-500';
      case 'rs':
        return 'text-orange-600';
      case 'swift':
        return 'text-orange-500';
      case 'kt':
        return 'text-purple-600';
      case 'scala':
        return 'text-red-600';
      case 'r':
        return 'text-blue-500';
      case 'm':
        return 'text-blue-400';
      case 'pl':
        return 'text-blue-600';
      case 'sh':
        return 'text-green-400';
      case 'ps1':
        return 'text-blue-500';
      case 'sql':
        return 'text-blue-500';
      case 'yml':
      case 'yaml':
        return 'text-green-500';
      case 'xml':
        return 'text-orange-500';
      default:
        return 'text-gray-300';
    }
  };

  const renderFileIcon = (node: FileNode) => {
    if (node.type === 'directory') {
      return expandedFolders.has(node.path) ? <FolderOpen className="h-4 w-4 mr-1 text-yellow-400" /> : <Folder className="h-4 w-4 mr-1 text-yellow-400" />;
    }

    // Determine file icon based on extension with better color coding
    const extension = node.extension?.toLowerCase();
    switch (extension) {
      case 'js':
        return <FileCode className="h-4 w-4 mr-1 text-yellow-500" />;
      case 'jsx':
        return <FileCode className="h-4 w-4 mr-1 text-yellow-600" />;
      case 'ts':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'tsx':
        return <FileCode className="h-4 w-4 mr-1 text-blue-600" />;
      case 'html':
        return <FileCode className="h-4 w-4 mr-1 text-orange-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileCode className="h-4 w-4 mr-1 text-blue-400" />;
      case 'json':
        return <FileCode className="h-4 w-4 mr-1 text-yellow-400" />;
      case 'md':
        return <FileText className="h-4 w-4 mr-1 text-blue-400" />;
      case 'py':
        return <FileCode className="h-4 w-4 mr-1 text-green-500" />;
      case 'java':
        return <FileCode className="h-4 w-4 mr-1 text-red-500" />;
      case 'cpp':
      case 'c':
        return <FileCode className="h-4 w-4 mr-1 text-blue-600" />;
      case 'php':
        return <FileCode className="h-4 w-4 mr-1 text-purple-500" />;
      case 'rb':
        return <FileCode className="h-4 w-4 mr-1 text-red-400" />;
      case 'go':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'rs':
        return <FileCode className="h-4 w-4 mr-1 text-orange-600" />;
      case 'swift':
        return <FileCode className="h-4 w-4 mr-1 text-orange-500" />;
      case 'kt':
        return <FileCode className="h-4 w-4 mr-1 text-purple-600" />;
      case 'scala':
        return <FileCode className="h-4 w-4 mr-1 text-red-600" />;
      case 'r':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'm':
        return <FileCode className="h-4 w-4 mr-1 text-blue-400" />;
      case 'pl':
        return <FileCode className="h-4 w-4 mr-1 text-blue-600" />;
      case 'sh':
        return <FileCode className="h-4 w-4 mr-1 text-green-400" />;
      case 'ps1':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'sql':
        return <FileCode className="h-4 w-4 mr-1 text-blue-500" />;
      case 'yml':
      case 'yaml':
        return <FileCode className="h-4 w-4 mr-1 text-green-500" />;
      case 'xml':
        return <FileCode className="h-4 w-4 mr-1 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 mr-1 text-gray-400" />;
    }
  };

  // Handle file/folder drop
  const handleDrop = (item: FileNode, targetPath: string) => {
    // Move the node to the target path
    moveNode(item.path, targetPath);
  };

  // Recursive function to render file tree
  const renderFileTree = (node: FileNode) => {
    const isExpanded = expandedFolders.has(node.path);
    const isRenaming = renamingNode === node.path;

    return (
      <div key={node.id} className="select-none">
        <Draggable item={node} className="cursor-grab active:cursor-grabbing">
          <Droppable 
            onDrop={handleDrop} 
            targetPath={node.path} 
            acceptsType={node.type === 'directory' ? 'both' : 'file'}
          >
            <div 
              className={`vscode-explorer-item group ${fsState.selectedNode?.path === node.path ? 'active' : ''}`}
              onClick={() => handleNodeClick(node)}
              onDoubleClick={() => {
                if (!isRenaming) {
                  setRenamingNode(node.path);
                  setRenamingValue(node.name);
                }
              }}
              onContextMenu={(e) => handleNodeContextMenu(e, node)}
            >
              {node.type === 'directory' && (
                <span onClick={(e) => { e.stopPropagation(); handleToggleExpand(node.path); }}>
                  {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                </span>
              )}
              
              {node.type !== 'directory' && <span className="w-4 mr-1" />} {/* Spacing for files */}
              
              {renderFileIcon(node)}
              
              {isRenaming ? (
                <div className="flex-1 flex items-center">
                  <input 
                    type="text"
                    className="flex-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded px-1 py-0 text-sm text-foreground"
                    value={renamingValue}
                    onChange={(e) => setRenamingValue(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, handleRenameItem)}
                    onBlur={() => {
                      // Only close if user didn't click on the confirm/cancel buttons
                      setTimeout(() => handleRenameItem(), 100);
                    }}
                    autoFocus
                  />
                  <button 
                    className="p-0.5 rounded hover:bg-green-500 hover:text-white ml-1" 
                    onClick={() => handleRenameItem()}
                    title="Confirm Rename"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <button 
                    className="p-0.5 rounded hover:bg-red-500 hover:text-white ml-1" 
                    onClick={() => setRenamingNode(null)}
                    title="Cancel Rename"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <span className={`flex-1 text-sm ${node.type === 'directory' ? 'vscode-folder text-yellow-400' : getFileNameColor(node)}`}>{node.name}</span>
              )}
              
              {!isRenaming && (
                <span className="hidden group-hover:flex items-center">
                  <button 
                    className="p-0.5 rounded hover:bg-accent" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleNodeContextMenu(e, node);
                    }}
                    title="More Actions"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </Droppable>
        </Draggable>
        
        {node.type === 'directory' && isExpanded && (
          <div className="pl-4">
            {/* New item input if this is the active folder */}
            {(newItemPath === node.path || (newItemPath === '/' && node.path === '/')) && (
              <div className="vscode-explorer-item bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                {newItemType === 'directory' ? <FolderPlus className="h-4 w-4 mr-1 text-yellow-400" /> : <FilePlus className="h-4 w-4 mr-1 text-blue-500" />}
                <input 
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none px-0 py-0 text-sm text-foreground"
                  placeholder={newItemType === 'directory' ? 'New Folder' : 'New File (e.g., script.js)'}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, handleCreateNewItem)}
                  onBlur={() => {
                    // Only close if user didn't click on the confirm/cancel buttons
                    setTimeout(() => setNewItemPath(null), 100);
                  }}
                  autoFocus
                />
                <button 
                  className="p-0.5 rounded hover:bg-green-500 hover:text-white" 
                  onClick={() => handleCreateNewItem()}
                  title="Create"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button 
                  className="p-0.5 rounded hover:bg-red-500 hover:text-white" 
                  onClick={() => setNewItemPath(null)}
                  title="Cancel"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {/* Child nodes */}
            {node.children?.map(child => renderFileTree(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="vscode-sidebar-title">
        <div className="uppercase">Explorer</div>
        <div className="flex space-x-2">
          <button 
            className="p-0.5 rounded hover:bg-accent" 
            onClick={handleExplorerMenu}
            title="Explorer Options"
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="vscode-sidebar-title">
        <div className="flex items-center">
          <ChevronDown className="h-3 w-3 mr-1" />
          <span>OPEN EDITORS</span>
        </div>
      </div>
      
      <div className="vscode-sidebar-title">
        <div className="flex items-center">
          <ChevronDown className="h-3 w-3 mr-1" />
          <span>PROJECT</span>
        </div>
        <div className="flex space-x-1">
          <button 
            className="p-0.5 rounded hover:bg-accent cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('New File button clicked');
              handleNewFile();
            }}
            title="New File"
          >
            <FilePlus className="h-3 w-3" />
          </button>
          <button 
            className="p-0.5 rounded hover:bg-accent cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('New Folder button clicked');
              handleNewFolder();
            }}
            title="New Folder"
          >
            <FolderPlus className="h-3 w-3" />
          </button>
          <button 
            className="p-0.5 rounded hover:bg-accent cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Refresh button clicked');
              handleRefresh();
            }}
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
          <button 
            className="p-0.5 rounded hover:bg-red-500 cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Test button clicked');
              testCreateFile();
            }}
            title="Test File Creation"
          >
            <FileText className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 py-2">
        {renderFileTree(fsState.root)}
      </div>
    </div>
  );
};

export default ExplorerView;