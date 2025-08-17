import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { EditorState, Tab, FileNode } from '@/types';
import { produce } from 'immer';
import { useFileSystemStore } from './fileSystemStore';

const initialState: EditorState = {
  tabs: [],
  activeTabId: null,
  editorContent: '',
  cursorPosition: {
    lineNumber: 1,
    column: 1
  }
};

export const useEditorStore = create(
  persist<{
    state: EditorState;
    openFile: (file: FileNode) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    updateTabContent: (tabId: string, content: string) => void;
    saveTab: (tabId: string) => void;
    updateCursorPosition: (lineNumber: number, column: number) => void;
    getActiveTab: () => Tab | null;
  }>(
    (set, get) => ({
      state: initialState,
      
      openFile: (file: FileNode) => {
        if (file.type !== 'file') return;
        
        set(
          produce((draft) => {
            // Check if file is already open in a tab
            const existingTab = draft.state.tabs.find(tab => tab.filePath === file.path);
            
            if (existingTab) {
              draft.state.activeTabId = existingTab.id;
              return;
            }
            
            // Create new tab
            const newTab: Tab = {
              id: uuidv4(),
              fileId: file.id,
              fileName: file.name,
              filePath: file.path,
              content: file.content || '',
              isDirty: false,
              language: getLanguageFromExtension(file.extension || '')
            };
            
            draft.state.tabs.push(newTab);
            draft.state.activeTabId = newTab.id;
            draft.state.editorContent = newTab.content;
          })
        );
      },
      
      closeTab: (tabId: string) => {
        set(
          produce((draft) => {
            const tabIndex = draft.state.tabs.findIndex(tab => tab.id === tabId);
            if (tabIndex === -1) return;
            
            // Handle active tab changes
            if (draft.state.activeTabId === tabId) {
              // Set next tab as active, or previous if no next, or null if no tabs left
              if (draft.state.tabs.length > 1) {
                const newActiveIndex = tabIndex === draft.state.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
                draft.state.activeTabId = draft.state.tabs[newActiveIndex].id;
                draft.state.editorContent = draft.state.tabs[newActiveIndex].content;
              } else {
                draft.state.activeTabId = null;
                draft.state.editorContent = '';
              }
            }
            
            // Remove the tab
            draft.state.tabs.splice(tabIndex, 1);
          })
        );
      },
      
      setActiveTab: (tabId: string) => {
        set(
          produce((draft) => {
            const tab = draft.state.tabs.find(tab => tab.id === tabId);
            if (!tab) return;
            
            draft.state.activeTabId = tabId;
            draft.state.editorContent = tab.content;
          })
        );
      },
      
      updateTabContent: (tabId: string, content: string) => {
        set(
          produce((draft) => {
            const tab = draft.state.tabs.find(tab => tab.id === tabId);
            if (!tab) return;
            
            tab.content = content;
            tab.isDirty = true;
            
            if (draft.state.activeTabId === tabId) {
              draft.state.editorContent = content;
            }
          })
        );
      },
      
      saveTab: (tabId: string) => {
        const tab = get().state.tabs.find(tab => tab.id === tabId);
        if (!tab) return;
        
        // Update file content in the file system
        useFileSystemStore.getState().updateFileContent(tab.filePath, tab.content);
        
        set(
          produce((draft) => {
            const tab = draft.state.tabs.find(tab => tab.id === tabId);
            if (tab) {
              tab.isDirty = false;
            }
          })
        );
      },
      
      updateCursorPosition: (lineNumber: number, column: number) => {
        set(
          produce((draft) => {
            draft.state.cursorPosition = { lineNumber, column };
          })
        );
      },
      
      getActiveTab: () => {
        const { tabs, activeTabId } = get().state;
        return tabs.find(tab => tab.id === activeTabId) || null;
      }
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({ state: { tabs: state.state.tabs, activeTabId: state.state.activeTabId, editorContent: state.state.editorContent, cursorPosition: state.state.cursorPosition } } as any),
    }
  )
);

// Helper function to determine language from file extension
function getLanguageFromExtension(extension: string): string {
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'php': 'php',
    'rb': 'ruby',
    'rs': 'rust',
    'sh': 'shell',
    'sql': 'sql',
    'swift': 'swift',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
  };
  
  return languageMap[extension.toLowerCase()] || 'plaintext';
}