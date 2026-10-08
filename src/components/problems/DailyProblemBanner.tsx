import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';
import { getDifficultyColor } from '../../lib/utils';

export const DailyProblemBanner: React.FC = () => {
  const dailyProblemId = useProblemStore((s) => s.dailyProblemId);
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);

  const problem = problems.find((p) => p.id === dailyProblemId) || problems[0];
  if (!problem) return null;

  const isSolved = userProgress[problem.id]?.status === 'solved';
  const diffStyle = getDifficultyColor(problem.difficulty);

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#ffa116]/30 bg-gradient-to-r from-[#28241b] via-[#222222] to-[#1e1e1e] p-5 shadow-lg">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#ffa116]/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#ffa116] bg-[#ffa116]/10 px-2.5 py-0.5 rounded-full border border-[#ffa116]/30">
              <Sparkles className="h-3 w-3 fill-[#ffa116]" />
              Daily Challenge
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {todayFormatted}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <h2 className="text-lg md:text-xl font-bold text-white hover:text-[#ffa116] transition-colors">
              <Link to={`/problem/${problem.slug}`}>
                {problem.lcNumber ? `#${problem.lcNumber} ` : ''}{problem.title}
              </Link>
            </h2>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
            >
              {problem.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {problem.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[11px] bg-[#2a2a2a] text-gray-300 px-2 py-0.5 rounded border border-[#383838]"
              >
                {topic}
              </span>
            ))}
            {problem.companies.slice(0, 2).map((comp) => (
              <span
                key={comp}
                className="text-[11px] bg-[#332e22] text-[#e0b06b] px-2 py-0.5 rounded border border-[#52442b]"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSolved ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00b8a3]/10 border border-[#00b8a3]/30 text-[#00b8a3] text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Solved Today</span>
            </div>
          ) : (
            <Link
              to={`/problem/${problem.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#ffa116] hover:bg-[#ffb33e] text-black font-semibold text-sm transition-all shadow-md shadow-[#ffa116]/20"
            >
              <span>Solve Challenge</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
