import { ProblemStatus } from './problem';
import { Language, Verdict } from './runner';

export interface Submission {
  id: string;
  problemId: number;
  problemSlug: string;
  problemTitle: string;
  language: Language;
  verdict: Verdict;
  runtimeMs: number;
  code: string;
  timestamp: number;
  totalPassed: number;
  totalCount: number;
}

export interface ProblemUserState {
  status: ProblemStatus;
  notes?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
  solvedAt?: number;
  lastAttemptedAt?: number;
  codePerLanguage: Partial<Record<Language, string>>;
  bestRuntimeMs?: number;
}

export interface StudyList {
  id: string;
  name: string;
  description: string;
  problemIds: number[];
  isPreset?: boolean;
  icon?: string;
  color?: string;
}

export interface DayActivity {
  solvedCount: number;
  attemptCount: number;
  minutesSpent: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  editorTheme: 'vs-dark' | 'light' | 'hc-black';
  fontSize: number;
  keybindings: 'default' | 'vim';
  judge0Endpoint: string;
  judge0ApiKey?: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  target: number;
  type: 'solve' | 'time' | 'review';
}
