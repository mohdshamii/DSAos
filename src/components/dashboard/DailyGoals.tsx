import React, { useState } from 'react';
import { Target, CheckCircle2, Circle } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

export const DailyGoals: React.FC = () => {
  const dailyGoals = useProblemStore((s) => s.dailyGoals);
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});

  const toggleGoal = (id: string) => {
    setCompletedGoals((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completedGoals).filter(Boolean).length;
  const pct = Math.round((completedCount / (dailyGoals.length || 1)) * 100);

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[#333333] pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[#ffa116]" />
          <div>
            <h3 className="font-bold text-white text-base">Daily Focus Goals</h3>
            <p className="text-xs text-gray-400">
              {completedCount} of {dailyGoals.length} goals completed today
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30">
          {pct}%
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {dailyGoals.map((goal) => {
          const isDone = Boolean(completedGoals[goal.id]);
          return (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                isDone
                  ? 'bg-[#1e2724] border-[#00b8a3]/40 text-gray-200'
                  : 'bg-[#272727] border-[#363636] text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-[#00b8a3] shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-500 shrink-0" />
                )}
                <span className={`text-xs font-medium ${isDone ? 'line-through text-gray-400' : ''}`}>
                  {goal.title}
                </span>
              </div>

              <span className="text-[11px] font-mono text-gray-500">
                Target: {goal.target} {goal.type === 'time' ? 'min' : 'prob'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
