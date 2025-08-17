// Types for our VS Code clone

// File System Types
export interface FileNode {
  id: string; // Unique identifier
  name: string; // File or folder name
  type: 'file' | 'directory'; // Type of node
  children?: FileNode[]; // Children for directories
  content?: string; // Content for files
  extension?: string; // File extension
  path: string; // Full path to the file or directory
  createdAt: number; // Creation timestamp
  modifiedAt: number; // Last modified timestamp
}

export interface FileSystemState {
  root: FileNode;
  selectedNode: FileNode | null;
  clipboard: {
    node: FileNode | null;
    operation: 'copy' | 'cut' | null;
  };
}

// Editor Types
export interface Tab {
  id: string;
  fileId: string;
  fileName: string;
  filePath: string;
  content: string;
  isDirty: boolean;
  language: string;
}

export interface EditorState {
  tabs: Tab[];
  activeTabId: string | null;
  editorContent: string;
  cursorPosition: {
    lineNumber: number;
    column: number;
  };
}

// Terminal Types
export interface TerminalState {
  isOpen: boolean;
  height: number;
  history: string[];
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

// Extensions Types
export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  isActive: boolean;
  icon?: string;
}

export interface ExtensionState {
  extensions: Extension[];
}

// UI Types
export type SidebarView = 'explorer' | 'search' | 'git' | 'debug' | 'extensions';

export interface UIState {
  isSidebarOpen: boolean;
  activeView: SidebarView;
  isTerminalOpen: boolean;
  isMenuOpen: boolean;
  theme: ThemeMode;
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  };
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  separator?: boolean;
}