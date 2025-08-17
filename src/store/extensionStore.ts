import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { Extension, ExtensionState } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Initial dummy extensions
const initialExtensions: Extension[] = [
  {
    id: uuidv4(),
    name: 'Python',
    description: 'Python language support for VS Code Web',
    version: '1.0.0',
    isActive: true,
    icon: '🐍'
  },
  {
    id: uuidv4(),
    name: 'ESLint',
    description: 'Integrates ESLint into VS Code Web',
    version: '2.1.5',
    isActive: true,
    icon: '🔍'
  },
  {
    id: uuidv4(),
    name: 'Prettier',
    description: 'Code formatter using prettier',
    version: '3.0.2',
    isActive: true,
    icon: '✨'
  },
  {
    id: uuidv4(),
    name: 'GitHub Theme',
    description: 'GitHub theme for VS Code Web',
    version: '1.2.0',
    isActive: false,
    icon: '🎨'
  },
  {
    id: uuidv4(),
    name: 'Material Icons',
    description: 'Material Design Icons for VS Code Web',
    version: '2.0.0',
    isActive: true,
    icon: '📁'
  }
];

const initialState: ExtensionState = {
  extensions: initialExtensions
};

export const useExtensionStore = create(
  persist<{
    state: ExtensionState;
    installExtension: (extension: Extension) => void;
    uninstallExtension: (extensionId: string) => void;
    toggleExtension: (extensionId: string) => void;
    updateExtension: (extensionId: string, data: Partial<Extension>) => void;
  }>(
    (set) => ({
      state: initialState,
      
      installExtension: (extension: Extension) => set(
        produce((draft) => {
          // Check if extension already exists
          const existingIndex = draft.state.extensions.findIndex(e => e.id === extension.id);
          
          if (existingIndex === -1) {
            // Add new extension
            draft.state.extensions.push({
              ...extension,
              id: extension.id || uuidv4() // Use existing ID or generate new one
            });
          }
        })
      ),
      
      uninstallExtension: (extensionId: string) => set(
        produce((draft) => {
          draft.state.extensions = draft.state.extensions.filter(e => e.id !== extensionId);
        })
      ),
      
      toggleExtension: (extensionId: string) => set(
        produce((draft) => {
          const extension = draft.state.extensions.find(e => e.id === extensionId);
          if (extension) {
            extension.isActive = !extension.isActive;
          }
        })
      ),
      
      updateExtension: (extensionId: string, data: Partial<Extension>) => set(
        produce((draft) => {
          const extension = draft.state.extensions.find(e => e.id === extensionId);
          if (extension) {
            Object.assign(extension, data);
          }
        })
      )
    }),
    {
      name: 'extension-storage',
    }
  )
);