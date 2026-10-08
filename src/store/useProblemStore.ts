import { create } from 'zustand';
import rawProblems from '../data/problems.json';
import { Problem, ProblemStatus } from '../types/problem';
import { Language } from '../types/runner';
import { ProblemUserState, Submission, DailyGoal } from '../types/user';
import { getLocalStorage, setLocalStorage, saveToIdb, getFromIdb } from '../lib/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ProblemStoreState {
  problems: Problem[];
  userProgress: Record<number, ProblemUserState>;
  submissions: Submission[];
  customTestCases: Record<number, string>;
  dailyProblemId: number;
  streak: number;
  lastActiveDate: string;
  dailyGoals: DailyGoal[];
  toasts: ToastMessage[];

  // Filter state
  searchQuery: string;
  selectedDifficulty: string;
  selectedTopic: string;
  selectedCompany: string;
  selectedStatus: string;
  sortBy: 'id' | 'title' | 'difficulty' | 'frequency' | 'acceptance';
  sortOrder: 'asc' | 'desc';

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedDifficulty: (diff: string) => void;
  setSelectedTopic: (topic: string) => void;
  setSelectedCompany: (company: string) => void;
  setSelectedStatus: (status: string) => void;
  setSortBy: (sort: 'id' | 'title' | 'difficulty' | 'frequency' | 'acceptance') => void;
  toggleSortOrder: () => void;

  // Problem actions
  getProblemBySlug: (slug: string) => Problem | undefined;
  getProblemById: (id: number) => Problem | undefined;
  updateProblemStatus: (problemId: number, status: ProblemStatus) => void;
  saveCode: (problemId: number, language: Language, code: string) => void;
  getCode: (problemId: number, language: Language) => string;
  saveNotes: (problemId: number, notes: string) => void;
  toggleBookmark: (problemId: number) => void;
  toggleLike: (problemId: number) => void;
  addSubmission: (submission: Omit<Submission, 'id' | 'timestamp'>) => void;
  setCustomTestCase: (problemId: number, testCaseInput: string) => void;
  getCustomTestCase: (problemId: number) => string;

  // System actions
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAllData: () => void;
}

const problemsList = rawProblems as unknown as Problem[];

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function calculateStreak(lastActive: string, currentStreak: number): { streak: number; today: string } {
  const today = getTodayString();
  if (!lastActive) {
    return { streak: 1, today };
  }
  if (lastActive === today) {
    return { streak: Math.max(1, currentStreak), today };
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  if (lastActive === yStr) {
    return { streak: currentStreak + 1, today };
  }
  return { streak: 1, today };
}

// Compute deterministic daily problem from day of year
function getDailyProblemId(list: Problem[]): number {
  if (!list.length) return 1;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return list[dayOfYear % list.length]?.id || 1;
}

export const useProblemStore = create<ProblemStoreState>((set, get) => {
  const initialProgress = getLocalStorage<Record<number, ProblemUserState>>('userProgress', {});
  const initialSubmissions = getLocalStorage<Submission[]>('submissions', []);
  const initialCustomCases = getLocalStorage<Record<number, string>>('customTestCases', {});
  const storedLastActive = getLocalStorage<string>('lastActiveDate', '');
  const storedStreak = getLocalStorage<number>('streak', 1);

  const { streak: calculatedStreak, today } = calculateStreak(storedLastActive, storedStreak);

  // Sync with IndexedDB asynchronously in background
  getFromIdb<Record<number, ProblemUserState>>('userProgress_backup', initialProgress).then((idbProgress) => {
    if (Object.keys(idbProgress).length > Object.keys(initialProgress).length) {
      set({ userProgress: idbProgress });
    }
  });

  return {
    problems: problemsList,
    userProgress: initialProgress,
    submissions: initialSubmissions,
    customTestCases: initialCustomCases,
    dailyProblemId: getDailyProblemId(problemsList),
    streak: calculatedStreak,
    lastActiveDate: today,
    dailyGoals: [
      { id: 'goal-1', title: 'Solve 2 problems today', target: 2, type: 'solve' },
      { id: 'goal-2', title: 'Practice for 30 minutes', target: 30, type: 'time' },
      { id: 'goal-3', title: 'Review 1 attempted problem', target: 1, type: 'review' },
    ],
    toasts: [],

    searchQuery: '',
    selectedDifficulty: '',
    selectedTopic: '',
    selectedCompany: '',
    selectedStatus: '',
    sortBy: 'id',
    sortOrder: 'asc',

    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedDifficulty: (diff) => set({ selectedDifficulty: diff }),
    setSelectedTopic: (topic) => set({ selectedTopic: topic }),
    setSelectedCompany: (company) => set({ selectedCompany: company }),
    setSelectedStatus: (status) => set({ selectedStatus: status }),
    setSortBy: (sortBy) => set({ sortBy }),
    toggleSortOrder: () => set((s) => ({ sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc' })),

    getProblemBySlug: (slug) => {
      return get().problems.find((p) => p.slug === slug);
    },

    getProblemById: (id) => {
      return get().problems.find((p) => p.id === id);
    },

    updateProblemStatus: (problemId, status) => {
      set((state) => {
        const cur = state.userProgress[problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };
        const updatedProgress = {
          ...state.userProgress,
          [problemId]: {
            ...cur,
            status,
            solvedAt: status === 'solved' ? Date.now() : cur.solvedAt,
            lastAttemptedAt: Date.now(),
          },
        };

        setLocalStorage('userProgress', updatedProgress);
        saveToIdb('userProgress_backup', updatedProgress);

        return { userProgress: updatedProgress };
      });
    },

    saveCode: (problemId, language, code) => {
      set((state) => {
        const cur = state.userProgress[problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };
        const updated = {
          ...state.userProgress,
          [problemId]: {
            ...cur,
            codePerLanguage: {
              ...cur.codePerLanguage,
              [language]: code,
            },
            lastAttemptedAt: Date.now(),
          },
        };

        setLocalStorage('userProgress', updated);
        saveToIdb('userProgress_backup', updated);
        return { userProgress: updated };
      });
    },

    getCode: (problemId, language) => {
      const state = get();
      const userCode = state.userProgress[problemId]?.codePerLanguage[language];
      if (userCode !== undefined) return userCode;
      const prob = state.problems.find((p) => p.id === problemId);
      return prob?.starterCode[language] || '';
    },

    saveNotes: (problemId, notes) => {
      set((state) => {
        const cur = state.userProgress[problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };
        const updated = {
          ...state.userProgress,
          [problemId]: {
            ...cur,
            notes,
          },
        };
        setLocalStorage('userProgress', updated);
        return { userProgress: updated };
      });
    },

    toggleBookmark: (problemId) => {
      set((state) => {
        const cur = state.userProgress[problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };
        const updated = {
          ...state.userProgress,
          [problemId]: {
            ...cur,
            isBookmarked: !cur.isBookmarked,
          },
        };
        setLocalStorage('userProgress', updated);
        return { userProgress: updated };
      });
    },

    toggleLike: (problemId) => {
      set((state) => {
        const cur = state.userProgress[problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };
        const updated = {
          ...state.userProgress,
          [problemId]: {
            ...cur,
            isLiked: !cur.isLiked,
          },
        };
        setLocalStorage('userProgress', updated);
        return { userProgress: updated };
      });
    },

    addSubmission: (submissionData) => {
      const submission: Submission = {
        ...submissionData,
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
      };

      set((state) => {
        const updatedSubmissions = [submission, ...state.submissions];
        setLocalStorage('submissions', updatedSubmissions);
        saveToIdb('submissions_backup', updatedSubmissions);

        // Update problem status
        const isPassed = submission.verdict === 'Accepted';
        const cur = state.userProgress[submission.problemId] || {
          status: 'todo',
          codePerLanguage: {},
        };

        const nextStatus: ProblemStatus = isPassed
          ? 'solved'
          : cur.status === 'solved'
          ? 'solved'
          : 'attempted';

        const updatedProgress: Record<number, ProblemUserState> = {
          ...state.userProgress,
          [submission.problemId]: {
            ...cur,
            status: nextStatus,
            solvedAt: isPassed ? (cur.solvedAt || Date.now()) : cur.solvedAt,
            lastAttemptedAt: Date.now(),
            bestRuntimeMs: isPassed
              ? Math.min(cur.bestRuntimeMs || Infinity, submission.runtimeMs)
              : cur.bestRuntimeMs,
          },
        };

        setLocalStorage('userProgress', updatedProgress);
        return {
          submissions: updatedSubmissions,
          userProgress: updatedProgress,
        };
      });
    },

    setCustomTestCase: (problemId, testCaseInput) => {
      set((state) => {
        const updated = {
          ...state.customTestCases,
          [problemId]: testCaseInput,
        };
        setLocalStorage('customTestCases', updated);
        return { customTestCases: updated };
      });
    },

    getCustomTestCase: (problemId) => {
      return get().customTestCases[problemId] || '';
    },

    addToast: (type, message) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
      setTimeout(() => {
        get().removeToast(id);
      }, 3500);
    },

    removeToast: (id) => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    },

    exportData: () => {
      const state = get();
      const payload = {
        version: 'dsaos.v2',
        exportedAt: new Date().toISOString(),
        userProgress: state.userProgress,
        submissions: state.submissions,
        customTestCases: state.customTestCases,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
      };
      return JSON.stringify(payload, null, 2);
    },

    importData: (jsonStr: string) => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.userProgress) {
          setLocalStorage('userProgress', parsed.userProgress);
          setLocalStorage('submissions', parsed.submissions || []);
          setLocalStorage('customTestCases', parsed.customTestCases || {});
          setLocalStorage('streak', parsed.streak || 1);
          setLocalStorage('lastActiveDate', parsed.lastActiveDate || getTodayString());

          set({
            userProgress: parsed.userProgress,
            submissions: parsed.submissions || [],
            customTestCases: parsed.customTestCases || {},
            streak: parsed.streak || 1,
            lastActiveDate: parsed.lastActiveDate || getTodayString(),
          });
          get().addToast('success', 'Progress imported successfully!');
          return true;
        }
        get().addToast('error', 'Invalid backup file format');
        return false;
      } catch (err) {
        console.error('Import error:', err);
        get().addToast('error', 'Failed to parse backup JSON');
        return false;
      }
    },

    resetAllData: () => {
      setLocalStorage('userProgress', {});
      setLocalStorage('submissions', []);
      setLocalStorage('customTestCases', {});
      setLocalStorage('streak', 1);
      set({
        userProgress: {},
        submissions: [],
        customTestCases: {},
        streak: 1,
      });
      get().addToast('info', 'All user data has been reset.');
    },
  };
});
