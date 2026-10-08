import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Send, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Code2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TestCase } from '../../types/problem';
import { RunResult } from '../../types/runner';
import { formatValue } from '../../lib/runner/harness';

interface ConsolePanelProps {
  testCases: TestCase[];
  customTestCase: string;
  onCustomTestCaseChange: (val: string) => void;
  result: RunResult | null;
  isRunning: boolean;
  onRun: () => void;
  onSubmit: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({
  testCases,
  customTestCase,
  onCustomTestCaseChange,
  result,
  isRunning,
  onRun,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Automatically switch to result tab when execution finishes
  useEffect(() => {
    if (result) {
      setActiveTab('result');
      if (result.verdict === 'Accepted') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#00b8a3', '#ffa116', '#ffffff'],
          });
        } catch (e) {
          // ignore in environments without canvas
        }
      }
    }
  }, [result]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Console Tab Bar & Action Buttons */}
      <div className="flex h-11 items-center justify-between border-b border-[#333333] bg-[#252525] px-3 select-none">
        {/* Left: Tab Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'testcase'
                ? 'bg-[#333333] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-[#ffa116]" />
            <span>Testcase</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'result'
                ? 'bg-[#333333] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-[#00b8a3]" />
            <span>Test Result</span>
            {result && (
              <span
                className={`ml-1 h-2 w-2 rounded-full ${
                  result.verdict === 'Accepted'
                    ? 'bg-[#00b8a3]'
                    : result.verdict === 'Wrong Answer'
                    ? 'bg-[#ff375f]'
                    : 'bg-[#ffc01e]'
                }`}
              />
            )}
          </button>
        </div>

        {/* Right: Run and Submit Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] px-3 py-1.5 text-xs font-semibold text-gray-200 hover:bg-[#383838] hover:text-white transition-all disabled:opacity-50"
            title="Run Code (Ctrl + ')"
          >
            {isRunning ? (
              <Sparkles className="h-3.5 w-3.5 animate-spin text-[#ffa116]" />
            ) : (
              <Play className="h-3.5 w-3.5 text-gray-300" />
            )}
            <span>Run</span>
            <kbd className="hidden md:inline rounded bg-[#1f1f1f] px-1 text-[10px] text-gray-400 border border-[#444]">
              Ctrl+'
            </kbd>
          </button>

          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-[#00b8a3] hover:bg-[#00c9b2] px-3.5 py-1.5 text-xs font-semibold text-black transition-all shadow-md shadow-[#00b8a3]/20 disabled:opacity-50"
            title="Submit Code (Ctrl + Enter)"
          >
            {isRunning ? (
              <Sparkles className="h-3.5 w-3.5 animate-spin text-black" />
            ) : (
              <Send className="h-3.5 w-3.5 fill-black" />
            )}
            <span>Submit</span>
            <kbd className="hidden md:inline rounded bg-black/20 px-1 text-[10px] text-black border border-black/20">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Console Content Area */}
      <div className="flex-1 overflow-y-auto p-4 text-xs">
        {activeTab === 'testcase' ? (
          /* Testcase View */
          <div className="space-y-3">
            {/* Case Selector Pills */}
            <div className="flex items-center gap-1.5 border-b border-[#333333] pb-2">
              {testCases.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCaseIdx(idx);
                    setIsCustomMode(false);
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    !isCustomMode && selectedCaseIdx === idx
                      ? 'bg-[#333333] text-white'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#282828]'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  isCustomMode
                    ? 'bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#282828]'
                }`}
              >
                + Custom Testcase
              </button>
            </div>

            {/* Testcase Input display / Custom editor */}
            {isCustomMode ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Enter JSON or parameters for your custom test case:</span>
                  <button
                    onClick={() => onCustomTestCaseChange('')}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>
                <textarea
                  value={customTestCase}
                  onChange={(e) => onCustomTestCaseChange(e.target.value)}
                  placeholder='e.g. {"nums": [2, 7, 11, 15], "target": 9}'
                  className="w-full h-32 rounded-lg border border-[#333333] bg-[#1a1a1a] p-3 font-mono text-gray-200 focus:border-[#ffa116] focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-3 font-mono">
                <div>
                  <div className="text-gray-400 mb-1 select-none font-sans">Input:</div>
                  <pre className="rounded bg-[#181818] p-3 text-gray-200 border border-[#2e2e2e] overflow-x-auto">
                    {formatValue(testCases[selectedCaseIdx]?.input)}
                  </pre>
                </div>

                <div>
                  <div className="text-gray-400 mb-1 select-none font-sans">Expected Output:</div>
                  <pre className="rounded bg-[#181818] p-3 text-[#00b8a3] border border-[#2e2e2e] overflow-x-auto">
                    {formatValue(testCases[selectedCaseIdx]?.expected)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Result View */
          <div className="space-y-4">
            {!result ? (
              <div className="py-12 text-center text-gray-500">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Run your code to view results and testcase evaluations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#333333] pb-3">
                  <div className="flex items-center gap-2.5">
                    {result.verdict === 'Accepted' ? (
                      <CheckCircle2 className="h-6 w-6 text-[#00b8a3]" />
                    ) : result.verdict === 'Wrong Answer' ? (
                      <XCircle className="h-6 w-6 text-[#ff375f]" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-[#ffc01e]" />
                    )}

                    <div>
                      <div
                        className={`text-lg font-bold ${
                          result.verdict === 'Accepted'
                            ? 'text-[#00b8a3]'
                            : result.verdict === 'Wrong Answer'
                            ? 'text-[#ff375f]'
                            : 'text-[#ffc01e]'
                        }`}
                      >
                        {result.verdict}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span>
                          {result.totalPassed} / {result.totalCount} testcases passed
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {result.executionTimeMs} ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compilation / Runtime Error Banner */}
                {result.compileError && (
                  <div className="rounded-lg border border-[#ff375f]/40 bg-[#ff375f]/10 p-3 text-xs font-mono text-[#ff809b] whitespace-pre-wrap">
                    {result.compileError}
                  </div>
                )}

                {/* Per-Testcase Result Breakdown */}
                {result.testCaseResults && result.testCaseResults.length > 0 && (
                  <div className="space-y-3">
                    {/* Case Tabs */}
                    <div className="flex items-center gap-1 border-b border-[#333333] pb-2">
                      {result.testCaseResults.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCaseIdx(idx)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                            selectedCaseIdx === idx
                              ? 'bg-[#333333] text-white'
                              : 'text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${
                              tc.status === 'Accepted' ? 'bg-[#00b8a3]' : 'bg-[#ff375f]'
                            }`}
                          />
                          <span>Case {tc.testCaseId}</span>
                        </button>
                      ))}
                    </div>

                    {/* Selected Case Drill-down */}
                    {result.testCaseResults[selectedCaseIdx] && (
                      <div className="space-y-3 font-mono">
                        <div>
                          <div className="text-gray-400 mb-1 font-sans">Input:</div>
                          <pre className="rounded bg-[#181818] p-2.5 text-gray-200 border border-[#2e2e2e] overflow-x-auto">
                            {result.testCaseResults[selectedCaseIdx].input}
                          </pre>
                        </div>

                        <div>
                          <div className="text-gray-400 mb-1 font-sans">Your Output:</div>
                          <pre
                            className={`rounded bg-[#181818] p-2.5 border overflow-x-auto ${
                              result.testCaseResults[selectedCaseIdx].status === 'Accepted'
                                ? 'text-[#00b8a3] border-[#00b8a3]/30'
                                : 'text-[#ff375f] border-[#ff375f]/30'
                            }`}
                          >
                            {result.testCaseResults[selectedCaseIdx].actualOutput}
                          </pre>
                        </div>

                        <div>
                          <div className="text-gray-400 mb-1 font-sans">Expected Output:</div>
                          <pre className="rounded bg-[#181818] p-2.5 text-[#00b8a3] border border-[#2e2e2e] overflow-x-auto">
                            {result.testCaseResults[selectedCaseIdx].expectedOutput}
                          </pre>
                        </div>

                        {/* Error info if any */}
                        {result.testCaseResults[selectedCaseIdx].error && (
                          <div>
                            <div className="text-red-400 mb-1 font-sans">Error:</div>
                            <pre className="rounded bg-[#ff375f]/10 p-2.5 text-[#ff809b] border border-[#ff375f]/30 whitespace-pre-wrap">
                              {result.testCaseResults[selectedCaseIdx].error}
                            </pre>
                          </div>
                        )}

                        {/* Stdout Logs */}
                        {result.testCaseResults[selectedCaseIdx].stdout && (
                          <div>
                            <div className="text-gray-400 mb-1 font-sans">Stdout:</div>
                            <pre className="rounded bg-[#181818] p-2.5 text-gray-300 border border-[#2e2e2e] overflow-x-auto whitespace-pre-wrap">
                              {result.testCaseResults[selectedCaseIdx].stdout}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
