import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { UIState, ThemeMode, SidebarView, ContextMenuItem } from '@/types';

const initialState: UIState = {
  isSidebarOpen: true,
  activeView: 'explorer',
  isTerminalOpen: false,
  isMenuOpen: false,
  theme: 'dark',
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  }
};

export const useUIStore = create(
  persist<{
    state: UIState;
    toggleSidebar: () => void;
    setActiveView: (view: SidebarView) => void;
    toggleTerminal: () => void;
    toggleMenu: () => void;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
    openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
    closeContextMenu: () => void;
  }>(
    (set) => ({
      state: initialState,
      
      toggleSidebar: () => set(
        produce((draft) => {
          draft.state.isSidebarOpen = !draft.state.isSidebarOpen;
        })
      ),
      
      setActiveView: (view: SidebarView) => set(
        produce((draft) => {
          draft.state.activeView = view;
          draft.state.isSidebarOpen = true;
        })
      ),
      
      toggleTerminal: () => set(
        produce((draft) => {
          draft.state.isTerminalOpen = !draft.state.isTerminalOpen;
        })
      ),
      
      toggleMenu: () => set(
        produce((draft) => {
          draft.state.isMenuOpen = !draft.state.isMenuOpen;
        })
      ),
      
      toggleTheme: () => set(
        produce((draft) => {
          draft.state.theme = draft.state.theme === 'light' ? 'dark' : 'light';
          
          // Apply theme to document
          if (draft.state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
      ),
      
      setTheme: (theme: ThemeMode) => set(
        produce((draft) => {
          draft.state.theme = theme;
          
          // Apply theme to document
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
      ),
      
      openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => {
        console.log('UI Store: Opening context menu at:', x, y, 'with', items.length, 'items');
        set(
          produce((draft) => {
            draft.state.contextMenu = {
              isOpen: true,
              x,
              y,
              items,
            };
          })
        );
      },
      
      closeContextMenu: () => {
        console.log('UI Store: Closing context menu');
        set(
          produce((draft) => {
            draft.state.contextMenu.isOpen = false;
          })
        );
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ state: { theme: state.state.theme, isSidebarOpen: state.state.isSidebarOpen, activeView: state.state.activeView, isTerminalOpen: state.state.isTerminalOpen, isMenuOpen: state.state.isMenuOpen, contextMenu: state.state.contextMenu } } as any),
    }
  )
);

// Initialize the theme based on stored preference
const initializeTheme = () => {
  const stored = localStorage.getItem('ui-storage');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      const theme = data?.state?.theme || 'dark';
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Fallback to dark theme if there's an error
      document.documentElement.classList.add('dark');
    }
  } else {
    // Default to dark theme
    document.documentElement.classList.add('dark');
  }
};

// Call on import
initializeTheme();