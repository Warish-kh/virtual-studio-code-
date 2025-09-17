import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryEntry, HistoryState } from '@/types';
import { v4 as uuidv4 } from 'uuid';

type HistoryActions = {
  addEntry: (params: Omit<HistoryEntry, 'id' | 'createdAt'> & { createdAt?: number }) => void;
  clearForUser: (userId: string) => void;
  getForUser: (userId: string) => HistoryEntry[];
};

export const useHistoryStore = create(
  persist<{
    state: HistoryState;
    addEntry: HistoryActions['addEntry'];
    clearForUser: HistoryActions['clearForUser'];
    getForUser: HistoryActions['getForUser'];
  }>(
    (set, get) => ({
      state: { entries: [] },

      addEntry: ({ userId, filePath, fileName, language, content, createdAt }) => {
        const entry: HistoryEntry = {
          id: uuidv4(),
          userId,
          filePath,
          fileName,
          language,
          content,
          createdAt: createdAt ?? Date.now(),
        };
        set((prev) => ({
          state: { entries: [entry, ...prev.state.entries].slice(0, 200) }
        }));
      },

      clearForUser: (userId: string) => {
        set((prev) => ({
          state: { entries: prev.state.entries.filter(e => e.userId !== userId) }
        }));
      },

      getForUser: (userId: string) => {
        return get().state.entries.filter(e => e.userId === userId);
      },
    }),
    {
      name: 'history-storage',
      partialize: (state) => ({ state: { entries: state.state.entries } } as any),
    }
  )
);


