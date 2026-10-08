import { create } from 'zustand';
import rawStudyLists from '../data/studyLists.json';
import { StudyList } from '../types/user';
import { getLocalStorage, setLocalStorage } from '../lib/storage';

interface StudyListStoreState {
  lists: StudyList[];
  createCustomList: (name: string, description: string, problemIds?: number[]) => void;
  deleteCustomList: (id: string) => void;
  toggleProblemInList: (listId: string, problemId: number) => void;
  addProblemToList: (listId: string, problemId: number) => void;
  removeProblemFromList: (listId: string, problemId: number) => void;
}

const defaultLists = rawStudyLists as unknown as StudyList[];

export const useStudyListStore = create<StudyListStoreState>((set) => {
  const initialLists = getLocalStorage<StudyList[]>('studyLists', defaultLists);

  // Ensure MNC 250 has all 250 problem IDs:
  const populated = initialLists.map((l) => {
    if (l.id === 'preset-mnc-250' && (!l.problemIds || l.problemIds.length === 0)) {
      return { ...l, problemIds: Array.from({ length: 250 }, (_, i) => i + 1) };
    }
    return l;
  });

  return {
    lists: populated,

    createCustomList: (name, description, problemIds = []) => {
      set((state) => {
        const newList: StudyList = {
          id: `custom_${Date.now()}`,
          name,
          description,
          problemIds,
          isPreset: false,
          color: '#ffa116',
          icon: 'Bookmark',
        };
        const updated = [...state.lists, newList];
        setLocalStorage('studyLists', updated);
        return { lists: updated };
      });
    },

    deleteCustomList: (id) => {
      set((state) => {
        const updated = state.lists.filter((l) => l.id !== id || l.isPreset);
        setLocalStorage('studyLists', updated);
        return { lists: updated };
      });
    },

    toggleProblemInList: (listId, problemId) => {
      set((state) => {
        const updated = state.lists.map((l) => {
          if (l.id === listId) {
            const has = l.problemIds.includes(problemId);
            return {
              ...l,
              problemIds: has
                ? l.problemIds.filter((id) => id !== problemId)
                : [...l.problemIds, problemId],
            };
          }
          return l;
        });
        setLocalStorage('studyLists', updated);
        return { lists: updated };
      });
    },

    addProblemToList: (listId, problemId) => {
      set((state) => {
        const updated = state.lists.map((l) => {
          if (l.id === listId && !l.problemIds.includes(problemId)) {
            return {
              ...l,
              problemIds: [...l.problemIds, problemId],
            };
          }
          return l;
        });
        setLocalStorage('studyLists', updated);
        return { lists: updated };
      });
    },

    removeProblemFromList: (listId, problemId) => {
      set((state) => {
        const updated = state.lists.map((l) => {
          if (l.id === listId) {
            return {
              ...l,
              problemIds: l.problemIds.filter((id) => id !== problemId),
            };
          }
          return l;
        });
        setLocalStorage('studyLists', updated);
        return { lists: updated };
      });
    },
  };
});
