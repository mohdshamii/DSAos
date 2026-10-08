import React, { useMemo } from 'react';
import { Flame, Calendar } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

export const StreakHeatmap: React.FC = () => {
  const streak = useProblemStore((s) => s.streak);
  const submissions = useProblemStore((s) => s.submissions);
  const userProgress = useProblemStore((s) => s.userProgress);

  // Map of date string YYYY-MM-DD -> activity count
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();

    // Count submissions per day
    submissions.forEach((sub) => {
      const d = new Date(sub.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + 1);
    });

    // Count solved problems per day
    Object.values(userProgress).forEach((prog) => {
      if (prog.solvedAt) {
        const d = new Date(prog.solvedAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        map.set(key, (map.get(key) || 0) + 2);
      }
    });

    return map;
  }, [submissions, userProgress]);

  // Generate 52 weeks (364 days) up to today
  const { weeks, monthLabels, totalActiveDays } = useMemo(() => {
    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 52 weeks ago, aligned to Sunday
    const start = new Date(today);
    start.setDate(today.getDate() - (52 * 7 - (6 - today.getDay())));

    let activeCount = 0;
    const current = new Date(start);

    for (let i = 0; i < 364; i++) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      const count = activityMap.get(dateStr) || 0;
      if (count > 0) activeCount++;

      days.push({
        date: dateStr,
        count,
        dayOfWeek: current.getDay(),
      });

      current.setDate(current.getDate() + 1);
    }

    // Chunk into 52 columns (weeks)
    const weekChunks: typeof days[] = [];
    for (let w = 0; w < 52; w++) {
      weekChunks.push(days.slice(w * 7, (w + 1) * 7));
    }

    // Month header labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: { text: string; weekIdx: number }[] = [];
    let lastMonth = -1;

    weekChunks.forEach((wk, idx) => {
      if (wk[0]) {
        const d = new Date(wk[0].date);
        const m = d.getMonth();
        if (m !== lastMonth && idx % 4 === 0) {
          labels.push({ text: months[m], weekIdx: idx });
          lastMonth = m;
        }
      }
    });

    return { weeks: weekChunks, monthLabels: labels, totalActiveDays: activeCount };
  }, [activityMap]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#262626] border-[#303030]';
    if (count === 1) return 'bg-[#ffa116]/30 border-[#ffa116]/40';
    if (count === 2) return 'bg-[#ffa116]/55 border-[#ffa116]/65';
    if (count <= 4) return 'bg-[#ffa116]/80 border-[#ffa116]/90';
    return 'bg-[#ffa116] border-amber-300';
  };

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#333333] pb-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-5 w-5 text-[#ffa116]" />
          <div>
            <h3 className="font-bold text-white text-base">Activity Heatmap</h3>
            <p className="text-xs text-gray-400">
              {totalActiveDays} active days in the last year • Consistency build-up
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffa116]/10 border border-[#ffa116]/30 text-xs font-semibold text-[#ffa116]">
            <Flame className="h-4 w-4 fill-[#ffa116] animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded-sm bg-[#262626] border border-[#303030]" />
            <div className="h-2.5 w-2.5 rounded-sm bg-[#ffa116]/30 border border-[#ffa116]/40" />
            <div className="h-2.5 w-2.5 rounded-sm bg-[#ffa116]/60 border border-[#ffa116]/70" />
            <div className="h-2.5 w-2.5 rounded-sm bg-[#ffa116] border-amber-300" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px]">
          {/* Months header */}
          <div className="flex text-[10px] text-gray-500 mb-1 pl-6 gap-[11px]">
            {monthLabels.map((lbl, i) => (
              <span key={i} style={{ width: '44px' }}>
                {lbl.text}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex gap-1">
            {/* Days of week labels */}
            <div className="flex flex-col justify-between text-[9px] text-gray-500 pr-1.5 py-0.5 select-none">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`h-[11px] w-[11px] rounded-[2px] border transition-transform hover:scale-125 cursor-pointer ${getColor(
                        day.count
                      )}`}
                      title={`${day.date}: ${day.count} activities`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
