import React from 'react';
import { Flame, CheckCircle2, History, Award } from 'lucide-react';
import { useProblemStore } from '../store/useProblemStore';
import { StreakHeatmap } from '../components/dashboard/StreakHeatmap';
import { DifficultyDonut } from '../components/dashboard/DifficultyDonut';
import { TopicProgress } from '../components/dashboard/TopicProgress';
import { RecentSubmissions } from '../components/dashboard/RecentSubmissions';
import { DailyGoals } from '../components/dashboard/DailyGoals';

export const DashboardPage: React.FC = () => {
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);
  const submissions = useProblemStore((s) => s.submissions);
  const streak = useProblemStore((s) => s.streak);

  const solvedCount = Object.values(userProgress).filter((p) => p.status === 'solved').length;
  const attemptedCount = Object.values(userProgress).filter((p) => p.status === 'attempted').length;
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter((s) => s.verdict === 'Accepted').length;
  const acceptanceRate = totalSubmissions > 0
    ? `${((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)}%`
    : '—';

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Study Dashboard & Analytics</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor your preparation velocity, consistency streak, and placement syllabus coverage.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved */}
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#00b8a3]/10 border border-[#00b8a3]/30 flex items-center justify-center text-[#00b8a3]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Solved</div>
            <div className="text-xl font-bold text-white">
              {solvedCount} <span className="text-xs text-gray-500 font-normal">/ {problems.length}</span>
            </div>
            <div className="text-[10px] text-gray-500">{attemptedCount} attempted</div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#ffa116]/10 border border-[#ffa116]/30 flex items-center justify-center text-[#ffa116]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Current Streak</div>
            <div className="text-xl font-bold text-white">
              {streak} <span className="text-xs text-gray-500 font-normal">days</span>
            </div>
          </div>
        </div>

        {/* Total Submissions */}
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <History className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Total Submissions</div>
            <div className="text-xl font-bold text-white">
              {totalSubmissions} <span className="text-xs text-gray-500 font-normal">runs</span>
            </div>
          </div>
        </div>

        {/* Submission Acceptance */}
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-4 shadow-md flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Acceptance Rate</div>
            <div className="text-xl font-bold text-white">
              {acceptanceRate}
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Heatmap & Difficulty Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StreakHeatmap />
        </div>
        <div className="lg:col-span-1">
          <DifficultyDonut />
        </div>
      </div>

      {/* Row 2: Topic Mastery & Daily Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopicProgress />
        </div>
        <div className="lg:col-span-1">
          <DailyGoals />
        </div>
      </div>

      {/* Row 3: Recent Submissions */}
      <RecentSubmissions />
    </div>
  );
};
