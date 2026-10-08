import React, { lazy, Suspense } from 'react';
import { 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Type
} from 'lucide-react';
import { Language } from '../../types/runner';
import { useSettingsStore } from '../../store/useSettingsStore';

// Lazy load Monaco editor for optimal initial bundle and performance
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface CodeEditorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onResetCode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRun: () => void;
  onSubmit: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onResetCode,
  isFullscreen,
  onToggleFullscreen,
  onRun,
  onSubmit,
}) => {
  const { settings, setFontSize } = useSettingsStore();

  const languageLabels: Record<Language, string> = {
    javascript: 'JavaScript',
    python: 'Python',
    cpp: 'C++',
    java: 'Java',
  };

  const monacoLanguage = language === 'cpp' ? 'cpp' : language;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-b border-[#333333]">
      {/* Editor Toolbar */}
      <div className="flex h-10 items-center justify-between border-b border-[#333333] bg-[#252525] px-3 select-none">
        {/* Left: Language selector & Font size */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="rounded border border-[#383838] bg-[#1a1a1a] px-2.5 py-1 text-xs font-semibold text-gray-200 focus:border-[#ffa116] focus:outline-none"
          >
            {Object.entries(languageLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 text-xs text-gray-400 pl-2 border-l border-[#3a3a3a]">
            <Type className="h-3.5 w-3.5" />
            <select
              value={settings.fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="rounded border border-[#383838] bg-[#1a1a1a] px-1.5 py-0.5 text-xs text-gray-200 focus:outline-none"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>
          </div>
        </div>

        {/* Right: Reset code, Keybinding indicator, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetCode}
            className="flex items-center gap-1 rounded p-1 text-xs text-gray-400 hover:bg-[#333333] hover:text-white transition-colors"
            title="Reset code to starter template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="rounded p-1 text-gray-400 hover:bg-[#333333] hover:text-white transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen editor'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-[#1e1e1e] text-gray-400 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin text-[#ffa116]" />
                <span>Loading Monaco Editor...</span>
              </div>
            </div>
          }
        >
          <MonacoEditor
            height="100%"
            language={monacoLanguage}
            theme={settings.editorTheme || 'vs-dark'}
            value={code}
            onChange={(val) => onCodeChange(val || '')}
            onMount={(editor, monaco) => {
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                onSubmit();
              });
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Quote, () => {
                onRun();
              });
            }}
            options={{
              fontSize: settings.fontSize || 14,
              fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 12, bottom: 12 },
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};
