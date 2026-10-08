import React from 'react';
import { useProblemStore } from '../../store/useProblemStore';

export const ProgressStats: React.FC = () => {
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);

  const total = problems.length || 250;
  const easyTotal = problems.filter((p) => p.difficulty === 'Easy').length || 65;
  const mediumTotal = problems.filter((p) => p.difficulty === 'Medium').length || 140;
  const hardTotal = problems.filter((p) => p.difficulty === 'Hard').length || 45;

  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;

  problems.forEach((p) => {
    if (userProgress[p.id]?.status === 'solved') {
      if (p.difficulty === 'Easy') easySolved++;
      else if (p.difficulty === 'Medium') mediumSolved++;
      else if (p.difficulty === 'Hard') hardSolved++;
    }
  });

  const totalSolved = easySolved + mediumSolved + hardSolved;
  const percentage = Math.round((totalSolved / total) * 100);

  // SVG circular calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left side: Circular ring + Total */}
      <div className="flex items-center gap-5">
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#333333"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#ffa116"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-white leading-none">{totalSolved}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">/ {total}</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Placement Prep Progress
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30">
              {percentage}% Complete
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Master the core 250 problems asked by top tech giants & MNCs.
          </p>
        </div>
      </div>

      {/* Right side: Easy, Medium, Hard breakdown bars */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6 w-full md:w-auto">
        {/* Easy */}
        <div className="flex-1 min-w-[110px] bg-[#282828] p-3 rounded-lg border border-[#383838]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#00b8a3]">Easy</span>
            <span className="font-mono text-gray-300">
              {easySolved}<span className="text-gray-500">/{easyTotal}</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00b8a3] transition-all duration-500"
              style={{ width: `${(easySolved / easyTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Medium */}
        <div className="flex-1 min-w-[110px] bg-[#282828] p-3 rounded-lg border border-[#383838]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#ffc01e]">Medium</span>
            <span className="font-mono text-gray-300">
              {mediumSolved}<span className="text-gray-500">/{mediumTotal}</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ffc01e] transition-all duration-500"
              style={{ width: `${(mediumSolved / mediumTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Hard */}
        <div className="flex-1 min-w-[110px] bg-[#282828] p-3 rounded-lg border border-[#383838]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#ff375f]">Hard</span>
            <span className="font-mono text-gray-300">
              {hardSolved}<span className="text-gray-500">/{hardTotal}</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff375f] transition-all duration-500"
              style={{ width: `${(hardSolved / hardTotal) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
