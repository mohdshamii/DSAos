import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Server, 
  ShieldAlert,
  Palette
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProblemStore } from '../store/useProblemStore';

export const SettingsPage: React.FC = () => {
  const { 
    settings, 
    setTheme, 
    setEditorTheme, 
    setFontSize, 
    setKeybindings, 
    setJudge0Endpoint, 
    resetSettings 
  } = useSettingsStore();

  const { 
    userProgress, 
    submissions, 
    exportData, 
    importData, 
    resetAllData, 
    addToast 
  } = useProblemStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [judge0Url, setJudge0Url] = useState(settings.judge0Endpoint);
  const [judge0Key, setJudge0Key] = useState(settings.judge0ApiKey || '');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const solvedCount = Object.values(userProgress).filter((p) => p.status === 'solved').length;
  const submissionsCount = submissions.length;

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsaos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'Progress exported successfully!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveJudge0 = () => {
    setJudge0Endpoint(judge0Url.trim(), judge0Key.trim());
    addToast('success', 'Judge0 endpoint configuration saved');
  };

  const handlePingJudge0 = async () => {
    setIsTestingEndpoint(true);
    setPingStatus(null);
    try {
      const clean = judge0Url.trim().replace(/\/+$/, '');
      const res = await fetch(`${clean}/about`, {
        headers: judge0Key.trim() ? { 'X-Auth-Token': judge0Key.trim() } : {},
      });
      if (res.ok) {
        setPingStatus('Connected successfully! Endpoint is reachable.');
        addToast('success', 'Judge0 connection verified!');
      } else {
        setPingStatus(`Endpoint returned HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPingStatus(`Could not reach endpoint: ${msg}`);
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  const handleConfirmReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#333333] pb-4">
        <div className="p-2.5 rounded-lg bg-[#ffa116]/10 border border-[#ffa116]/30 text-[#ffa116]">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings & Backup</h1>
          <p className="text-xs text-gray-400">
            Configure code editor themes, appearance, Judge0 compiler, and backup your local progress.
          </p>
        </div>
      </div>

      {/* Progress & Storage Statistics */}
      <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#00b8a3]" />
          Local Storage & Sync Status
        </h3>
        <p className="text-xs text-gray-400">
          All your submissions, code drafts, and notes are stored 100% locally in your browser (LocalStorage + IndexedDB). Nothing is ever sent to any third-party server.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#333333]">
            <div className="text-[11px] text-gray-400">Solved Problems</div>
            <div className="text-lg font-bold text-white font-mono">{solvedCount} / 250</div>
          </div>
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#333333]">
            <div className="text-[11px] text-gray-400">Recorded Submissions</div>
            <div className="text-lg font-bold text-white font-mono">{submissionsCount}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#333333] col-span-2 sm:col-span-1">
            <div className="text-[11px] text-gray-400">IndexedDB Engine</div>
            <div className="text-sm font-semibold text-[#00b8a3] mt-1">Active & Ready</div>
          </div>
        </div>

        {/* Export / Import Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#333333]">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] hover:bg-[#323232] border border-[#3e3e3e] hover:border-[#ffa116] text-xs font-semibold text-white transition-colors"
          >
            <Download className="h-4 w-4 text-[#ffa116]" />
            <span>Export Progress (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] hover:bg-[#323232] border border-[#3e3e3e] hover:border-[#00b8a3] text-xs font-semibold text-white transition-colors"
          >
            <Upload className="h-4 w-4 text-[#00b8a3]" />
            <span>Import Progress (JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {/* Editor & Appearance Preferences */}
      <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#333333] pb-3">
          <Palette className="h-4 w-4 text-[#ffa116]" />
          Editor & Appearance Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Platform Theme */}
          <div className="space-y-1.5">
            <label className="font-medium text-gray-300">Platform Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:outline-none focus:border-[#ffa116]"
            >
              <option value="dark">Dark Theme (LeetCode style)</option>
              <option value="light">Light Theme</option>
            </select>
          </div>

          {/* Monaco Editor Theme */}
          <div className="space-y-1.5">
            <label className="font-medium text-gray-300">Code Editor Theme</label>
            <select
              value={settings.editorTheme}
              onChange={(e) => setEditorTheme(e.target.value as 'vs-dark' | 'light' | 'hc-black')}
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:outline-none focus:border-[#ffa116]"
            >
              <option value="vs-dark">VS Dark (Default)</option>
              <option value="light">VS Light</option>
              <option value="hc-black">High Contrast Black</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="font-medium text-gray-300">Editor Font Size</label>
            <select
              value={settings.fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:outline-none focus:border-[#ffa116]"
            >
              <option value={12}>12 px</option>
              <option value={14}>14 px (Standard)</option>
              <option value={16}>16 px</option>
              <option value={18}>18 px</option>
            </select>
          </div>

          {/* Keybindings */}
          <div className="space-y-1.5">
            <label className="font-medium text-gray-300">Keybinding Mode</label>
            <select
              value={settings.keybindings}
              onChange={(e) => setKeybindings(e.target.value as 'default' | 'vim')}
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:outline-none focus:border-[#ffa116]"
            >
              <option value="default">Standard (VS Code default)</option>
              <option value="vim">Vim Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compiler / Judge0 Configuration */}
      <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-[#333333] pb-3">
          <Server className="h-4 w-4 text-blue-400" />
          Judge0 CE API Endpoint (C++ & Java)
        </h3>
        <p className="text-xs text-gray-400">
          JavaScript and Python run 100% locally inside in-browser Web Workers and Pyodide. C++ and Java use the Judge0 CE public API.
        </p>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-300 font-medium mb-1">Judge0 Endpoint URL</label>
            <input
              type="text"
              value={judge0Url}
              onChange={(e) => setJudge0Url(e.target.value)}
              placeholder="https://ce.judge0.com"
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 font-mono text-white focus:outline-none focus:border-[#ffa116]"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">API Key / Auth Token (Optional)</label>
            <input
              type="password"
              value={judge0Key}
              onChange={(e) => setJudge0Key(e.target.value)}
              placeholder="Leave blank for public CE instance"
              className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 font-mono text-white focus:outline-none focus:border-[#ffa116]"
            />
          </div>

          {pingStatus && (
            <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#383838] text-[11px] font-mono text-gray-300">
              {pingStatus}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveJudge0}
              className="px-4 py-2 rounded-lg bg-[#ffa116] hover:bg-[#ffb33e] text-black text-xs font-semibold transition-colors"
            >
              Save Configuration
            </button>
            <button
              onClick={handlePingJudge0}
              disabled={isTestingEndpoint}
              className="px-4 py-2 rounded-lg bg-[#282828] hover:bg-[#323232] border border-[#383838] text-gray-300 hover:text-white text-xs font-semibold transition-colors"
            >
              {isTestingEndpoint ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="rounded-xl border border-red-500/30 bg-[#251b1e] p-5 shadow-lg space-y-3">
        <h3 className="font-bold text-sm text-[#ff375f] flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Danger Zone
        </h3>
        <p className="text-xs text-gray-400">
          Reset all your solved status, code history, custom test cases, and submissions. This action cannot be undone. Make sure to export your backup first.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-semibold transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset All Progress Data</span>
          </button>

          <button
            onClick={() => {
              resetSettings();
              addToast('info', 'Settings restored to defaults');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] hover:bg-[#323232] border border-[#383838] text-gray-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restore Default Settings</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-red-500/40 bg-[#222222] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-5 w-5" />
              Confirm Progress Reset
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently erase all your progress, submissions, and code solutions?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#282828] text-gray-300 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/20"
              >
                Yes, Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
