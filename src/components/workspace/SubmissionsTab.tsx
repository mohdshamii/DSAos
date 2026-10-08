import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Code2, Copy, Check } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';
import { Submission } from '../../types/user';
import { formatRelativeDate } from '../../lib/utils';

interface SubmissionsTabProps {
  problemId: number;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({ problemId }) => {
  const allSubmissions = useProblemStore((s) => s.submissions);
  const submissions = allSubmissions.filter((s) => s.problemId === problemId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-4 text-gray-200 text-sm">
      <h2 className="text-base font-bold text-white border-b border-[#333333] pb-3">
        Submission History ({submissions.length})
      </h2>

      {submissions.length === 0 ? (
        <div className="py-16 text-center text-gray-400 space-y-2">
          <Clock className="h-8 w-8 text-gray-500 mx-auto" />
          <p className="font-medium text-gray-300">No submissions yet for this problem.</p>
          <p className="text-xs text-gray-500">Run or Submit your solution to record your progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => {
            const isAccepted = sub.verdict === 'Accepted';
            return (
              <div
                key={sub.id}
                className={`rounded-lg border p-3.5 transition-colors cursor-pointer ${
                  selectedSubmission?.id === sub.id
                    ? 'border-[#ffa116] bg-[#29251f]'
                    : isAccepted
                    ? 'border-[#00b8a3]/30 bg-[#1e2724] hover:bg-[#22302c]'
                    : 'border-[#ff375f]/30 bg-[#271e22] hover:bg-[#302228]'
                }`}
                onClick={() => setSelectedSubmission(selectedSubmission?.id === sub.id ? null : sub)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#00b8a3]" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-[#ff375f]" />
                    )}
                    <span
                      className={`font-semibold text-xs md:text-sm ${
                        isAccepted ? 'text-[#00b8a3]' : 'text-[#ff375f]'
                      }`}
                    >
                      {sub.verdict}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e1e1e] text-gray-300 uppercase font-mono">
                      {sub.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="font-mono">{sub.runtimeMs}ms</span>
                    <span>{formatRelativeDate(sub.timestamp)}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Passed: {sub.totalPassed}/{sub.totalCount} testcases</span>
                  <span className="text-gray-500 hover:text-gray-300 flex items-center gap-1">
                    <Code2 className="h-3 w-3" />
                    {selectedSubmission?.id === sub.id ? 'Hide Code' : 'View Code'}
                  </span>
                </div>

                {/* Expanded Code View */}
                {selectedSubmission?.id === sub.id && (
                  <div className="mt-3 pt-3 border-t border-[#3a3a3a] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">Submitted Code:</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCode(sub.code);
                        }}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-[#00b8a3]" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="rounded bg-[#1a1a1a] p-3 text-xs font-mono text-gray-300 overflow-x-auto max-h-64 border border-[#333333]">
                      <code>{sub.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
