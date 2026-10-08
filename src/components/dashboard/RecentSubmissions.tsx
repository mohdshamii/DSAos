import React from 'react';
import { Link } from 'react-router-dom';
import { History, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';
import { formatRelativeDate } from '../../lib/utils';

export const RecentSubmissions: React.FC = () => {
  const submissions = useProblemStore((s) => s.submissions);
  const recent = submissions.slice(0, 7);

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[#333333] pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#00b8a3]" />
          <div>
            <h3 className="font-bold text-white text-base">Recent Submissions</h3>
            <p className="text-xs text-gray-400">Your latest practice code runs</p>
          </div>
        </div>

        <Link
          to="/problems"
          className="text-xs text-[#ffa116] hover:text-[#ffb33e] flex items-center gap-1 font-medium"
        >
          <span>Solve More</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-12 text-center text-gray-400 space-y-1">
          <p className="font-medium text-sm text-gray-300">No submissions yet.</p>
          <p className="text-xs text-gray-500">Solve your first problem to see your history here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#2e2e2e]">
          {recent.map((sub) => {
            const isAccepted = sub.verdict === 'Accepted';
            return (
              <div
                key={sub.id}
                className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-[#262626] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {isAccepted ? (
                    <CheckCircle2 className="h-4 w-4 text-[#00b8a3] shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-[#ff375f] shrink-0" />
                  )}
                  <div className="truncate">
                    <Link
                      to={`/problem/${sub.problemSlug}`}
                      className="font-semibold text-gray-200 hover:text-[#ffa116] transition-colors truncate block"
                    >
                      {sub.problemTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span className="uppercase font-mono">{sub.language}</span>
                      <span>•</span>
                      <span>{sub.totalPassed}/{sub.totalCount} passed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-gray-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    {sub.runtimeMs}ms
                  </span>
                  <span className="text-gray-500">{formatRelativeDate(sub.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
