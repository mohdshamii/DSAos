import { create } from 'zustand';
import { AppSettings } from '../types/user';
import { getLocalStorage, setLocalStorage } from '../lib/storage';

interface SettingsState {
  settings: AppSettings;
  setTheme: (theme: 'dark' | 'light') => void;
  setEditorTheme: (theme: 'vs-dark' | 'light' | 'hc-black') => void;
  setFontSize: (size: number) => void;
  setKeybindings: (kb: 'default' | 'vim') => void;
  setJudge0Endpoint: (endpoint: string, apiKey?: string) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  editorTheme: 'vs-dark',
  fontSize: 14,
  keybindings: 'default',
  judge0Endpoint: 'https://ce.judge0.com',
  judge0ApiKey: '',
};

export const useSettingsStore = create<SettingsState>((set) => {
  const initialSettings = getLocalStorage<AppSettings>('settings', DEFAULT_SETTINGS);

  return {
    settings: initialSettings,
    setTheme: (theme) => {
      set((state) => {
        const updated = { ...state.settings, theme };
        setLocalStorage('settings', updated);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { settings: updated };
      });
    },
    setEditorTheme: (editorTheme) => {
      set((state) => {
        const updated = { ...state.settings, editorTheme };
        setLocalStorage('settings', updated);
        return { settings: updated };
      });
    },
    setFontSize: (fontSize) => {
      set((state) => {
        const updated = { ...state.settings, fontSize };
        setLocalStorage('settings', updated);
        return { settings: updated };
      });
    },
    setKeybindings: (keybindings) => {
      set((state) => {
        const updated = { ...state.settings, keybindings };
        setLocalStorage('settings', updated);
        return { settings: updated };
      });
    },
    setJudge0Endpoint: (judge0Endpoint, judge0ApiKey) => {
      set((state) => {
        const updated = { ...state.settings, judge0Endpoint, judge0ApiKey };
        setLocalStorage('settings', updated);
        return { settings: updated };
      });
    },
    resetSettings: () => {
      setLocalStorage('settings', DEFAULT_SETTINGS);
      set({ settings: DEFAULT_SETTINGS });
    },
  };
});
