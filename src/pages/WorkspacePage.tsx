import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  FileText, 
  BookOpen, 
  History, 
  StickyNote, 
  GripVertical,
  GripHorizontal
} from 'lucide-react';
import { useProblemStore } from '../store/useProblemStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Language, RunResult } from '../types/runner';
import { TestCase } from '../types/problem';
import { executeCode } from '../lib/runner';
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader';
import { DescriptionTab } from '../components/workspace/DescriptionTab';
import { EditorialTab } from '../components/workspace/EditorialTab';
import { SubmissionsTab } from '../components/workspace/SubmissionsTab';
import { NotesTab } from '../components/workspace/NotesTab';
import { CodeEditor } from '../components/workspace/CodeEditor';
import { ConsolePanel } from '../components/workspace/ConsolePanel';

type LeftTab = 'description' | 'editorial' | 'submissions' | 'notes';

export const WorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const getProblemBySlug = useProblemStore((s) => s.getProblemBySlug);
  const getCode = useProblemStore((s) => s.getCode);
  const saveCode = useProblemStore((s) => s.saveCode);
  const addSubmission = useProblemStore((s) => s.addSubmission);
  const addToast = useProblemStore((s) => s.addToast);
  const customTestCases = useProblemStore((s) => s.customTestCases);
  const setCustomTestCase = useProblemStore((s) => s.setCustomTestCase);
  const { settings } = useSettingsStore();

  const problem = useMemo(() => {
    return slug ? getProblemBySlug(slug) : undefined;
  }, [slug, getProblemBySlug]);

  const [activeLeftTab, setActiveLeftTab] = useState<LeftTab>('description');
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileView, setMobileView] = useState<'problem' | 'code'>('problem');

  // Load problem code on problem or language change
  useEffect(() => {
    if (problem) {
      const stored = getCode(problem.id, language);
      setCode(stored);
      setRunResult(null);
    }
  }, [problem, language, getCode]);

  // Handle code edit with persistence
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (problem) {
      saveCode(problem.id, language, newCode);
    }
  };

  const handleResetCode = () => {
    if (!problem) return;
    const starter = problem.starterCode[language] || '';
    setCode(starter);
    saveCode(problem.id, language, starter);
    addToast('info', 'Code reset to starter template');
  };

  // Derive target function name from slug or starter code
  const targetFunctionName = useMemo(() => {
    if (!problem) return 'solution';
    // If slug has hyphens, convert to camelCase e.g. two-sum -> twoSum
    return problem.slug.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
  }, [problem]);

  const customInput = problem ? customTestCases[problem.id] || '' : '';

  const handleRun = useCallback(async () => {
    if (!problem || isRunning) return;
    setIsRunning(true);

    let testCasesToRun: TestCase[] = problem.testCases.filter((tc) => !tc.isHidden);
    if (testCasesToRun.length === 0) {
      testCasesToRun = problem.testCases.slice(0, 2);
    }

    // If custom testcase is provided and valid, prioritize it
    if (customInput.trim()) {
      try {
        const parsed = JSON.parse(customInput);
        testCasesToRun = [{ input: parsed, expected: null }];
      } catch {
        testCasesToRun = [{ input: customInput, expected: null }];
      }
    }

    try {
      const result = await executeCode({
        language,
        code,
        testCases: testCasesToRun,
        functionName: targetFunctionName,
        judge0Endpoint: settings.judge0Endpoint,
        judge0ApiKey: settings.judge0ApiKey,
      });
      setRunResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRunResult({
        verdict: 'Runtime Error',
        totalPassed: 0,
        totalCount: testCasesToRun.length,
        executionTimeMs: 0,
        compileError: msg,
        testCaseResults: [],
      });
    } finally {
      setIsRunning(false);
    }
  }, [problem, isRunning, customInput, language, code, targetFunctionName, settings]);

  const handleSubmit = useCallback(async () => {
    if (!problem || isRunning) return;
    setIsRunning(true);

    const allTestCases = problem.testCases;

    try {
      const result = await executeCode({
        language,
        code,
        testCases: allTestCases,
        functionName: targetFunctionName,
        judge0Endpoint: settings.judge0Endpoint,
        judge0ApiKey: settings.judge0ApiKey,
      });

      setRunResult(result);

      // Record submission in store
      addSubmission({
        problemId: problem.id,
        problemSlug: problem.slug,
        problemTitle: problem.title,
        language,
        verdict: result.verdict,
        runtimeMs: result.executionTimeMs,
        code,
        totalPassed: result.totalPassed,
        totalCount: result.totalCount,
      });

      if (result.verdict === 'Accepted') {
        addToast('success', `Accepted! All ${result.totalPassed} test cases passed.`);
      } else {
        addToast('error', `${result.verdict}: ${result.totalPassed}/${result.totalCount} test cases passed.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRunResult({
        verdict: 'Runtime Error',
        totalPassed: 0,
        totalCount: allTestCases.length,
        executionTimeMs: 0,
        compileError: msg,
        testCaseResults: [],
      });
    } finally {
      setIsRunning(false);
    }
  }, [problem, isRunning, language, code, targetFunctionName, settings, addSubmission, addToast]);

  // Global keyboard shortcuts (Ctrl+' for Run, Ctrl+Enter for Submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        handleRun();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, handleSubmit]);

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <h2 className="text-xl font-bold text-white">Problem not found</h2>
        <p className="text-sm text-gray-400">
          The problem slug &quot;{slug}&quot; does not exist in the DSA OS dataset.
        </p>
        <button
          onClick={() => navigate('/problems')}
          className="px-4 py-2 bg-[#ffa116] hover:bg-[#ffb33e] text-black font-semibold rounded-lg text-sm transition-colors"
        >
          Return to Problem List
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-1 bg-[#1a1a1a] ${isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-3.5rem)]'}`}>
      {/* Workspace Header Toolbar */}
      <WorkspaceHeader problem={problem} />

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-[#333333] bg-[#222222]">
        <button
          onClick={() => setMobileView('problem')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
            mobileView === 'problem'
              ? 'border-[#ffa116] text-[#ffa116]'
              : 'border-transparent text-gray-400'
          }`}
        >
          Problem Description
        </button>
        <button
          onClick={() => setMobileView('code')}
          className={`flex-1 py-2 text-xs font-semibold text-center border-b-2 transition-colors ${
            mobileView === 'code'
              ? 'border-[#ffa116] text-[#ffa116]'
              : 'border-transparent text-gray-400'
          }`}
        >
          Code & Console
        </button>
      </div>

      {/* Main Resizable Workspace */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop Split View */}
        <div className="hidden md:block h-full">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={44} minSize={25} className="flex flex-col bg-[#222222] border-r border-[#333333]">
              {/* Left Pane Tabs */}
              <div className="flex h-10 items-center border-b border-[#333333] bg-[#252525] px-2 gap-1 select-none">
                <button
                  onClick={() => setActiveLeftTab('description')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeLeftTab === 'description'
                      ? 'bg-[#333333] text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-[#ffa116]" />
                  <span>Description</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('editorial')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeLeftTab === 'editorial'
                      ? 'bg-[#333333] text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                  <span>Editorial</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('submissions')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeLeftTab === 'submissions'
                      ? 'bg-[#333333] text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <History className="h-3.5 w-3.5 text-[#00b8a3]" />
                  <span>Submissions</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('notes')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeLeftTab === 'notes'
                      ? 'bg-[#333333] text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <StickyNote className="h-3.5 w-3.5 text-[#ffc01e]" />
                  <span>Notes</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-hidden">
                {activeLeftTab === 'description' && <DescriptionTab problem={problem} />}
                {activeLeftTab === 'editorial' && <EditorialTab problem={problem} />}
                {activeLeftTab === 'submissions' && <SubmissionsTab problemId={problem.id} />}
                {activeLeftTab === 'notes' && <NotesTab problemId={problem.id} />}
              </div>
            </Panel>

            <PanelResizeHandle className="w-1.5 bg-[#1a1a1a] hover:bg-[#ffa116] transition-colors cursor-col-resize flex items-center justify-center group">
              <GripVertical className="h-3 w-3 text-gray-600 group-hover:text-black" />
            </PanelResizeHandle>

            {/* Right Pane: Code Editor + Console Panel */}
            <Panel defaultSize={56} minSize={30} className="flex flex-col bg-[#1e1e1e]">
              <PanelGroup direction="vertical">
                {/* Top: Monaco Editor */}
                <Panel defaultSize={60} minSize={25}>
                  <CodeEditor
                    language={language}
                    onLanguageChange={setLanguage}
                    code={code}
                    onCodeChange={handleCodeChange}
                    onResetCode={handleResetCode}
                    isFullscreen={isFullscreen}
                    onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                  />
                </Panel>

                <PanelResizeHandle className="h-1.5 bg-[#1a1a1a] hover:bg-[#ffa116] transition-colors cursor-row-resize flex items-center justify-center group">
                  <GripHorizontal className="h-3 w-3 text-gray-600 group-hover:text-black" />
                </PanelResizeHandle>

                {/* Bottom: Testcase & Result Console */}
                <Panel defaultSize={40} minSize={20}>
                  <ConsolePanel
                    testCases={problem.testCases}
                    customTestCase={customInput}
                    onCustomTestCaseChange={(val) => setCustomTestCase(problem.id, val)}
                    result={runResult}
                    isRunning={isRunning}
                    onRun={handleRun}
                    onSubmit={handleSubmit}
                  />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden h-full overflow-y-auto">
          {mobileView === 'problem' ? (
            <div className="h-full bg-[#222222]">
              <div className="flex border-b border-[#333333] bg-[#252525] px-2 py-1 gap-1">
                <button
                  onClick={() => setActiveLeftTab('description')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    activeLeftTab === 'description' ? 'bg-[#333333] text-white' : 'text-gray-400'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveLeftTab('editorial')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    activeLeftTab === 'editorial' ? 'bg-[#333333] text-white' : 'text-gray-400'
                  }`}
                >
                  Editorial
                </button>
                <button
                  onClick={() => setActiveLeftTab('submissions')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    activeLeftTab === 'submissions' ? 'bg-[#333333] text-white' : 'text-gray-400'
                  }`}
                >
                  Submissions
                </button>
                <button
                  onClick={() => setActiveLeftTab('notes')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    activeLeftTab === 'notes' ? 'bg-[#333333] text-white' : 'text-gray-400'
                  }`}
                >
                  Notes
                </button>
              </div>
              <div className="p-3">
                {activeLeftTab === 'description' && <DescriptionTab problem={problem} />}
                {activeLeftTab === 'editorial' && <EditorialTab problem={problem} />}
                {activeLeftTab === 'submissions' && <SubmissionsTab problemId={problem.id} />}
                {activeLeftTab === 'notes' && <NotesTab problemId={problem.id} />}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-[#1e1e1e]">
              <div className="h-72">
                <CodeEditor
                  language={language}
                  onLanguageChange={setLanguage}
                  code={code}
                  onCodeChange={handleCodeChange}
                  onResetCode={handleResetCode}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ConsolePanel
                  testCases={problem.testCases}
                  customTestCase={customInput}
                  onCustomTestCaseChange={(val) => setCustomTestCase(problem.id, val)}
                  result={runResult}
                  isRunning={isRunning}
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
