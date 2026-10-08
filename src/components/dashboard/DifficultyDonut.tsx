import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useProblemStore } from '../../store/useProblemStore';

export const DifficultyDonut: React.FC = () => {
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

  const data = [
    { name: 'Easy', value: easySolved, total: easyTotal, color: '#00b8a3' },
    { name: 'Medium', value: mediumSolved, total: mediumTotal, color: '#ffc01e' },
    { name: 'Hard', value: hardSolved, total: hardTotal, color: '#ff375f' },
    { name: 'Unsolved', value: Math.max(0, total - totalSolved), total, color: '#333333' },
  ];

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg flex flex-col justify-between h-full">
      <div className="border-b border-[#333333] pb-3">
        <h3 className="font-bold text-white text-base">Solved by Difficulty</h3>
        <p className="text-xs text-gray-400">Total solved: {totalSolved} / {total}</p>
      </div>

      <div className="relative h-48 w-full my-3 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-[#1a1a1a] p-2 border border-[#333333] text-xs shadow-xl">
                      <span className="font-semibold" style={{ color: item.color }}>
                        {item.name}:
                      </span>{' '}
                      <span className="text-white font-mono">{item.value}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="#222222"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white leading-none">{totalSolved}</span>
          <span className="text-[11px] text-gray-400 font-medium mt-0.5">/ {total}</span>
        </div>
      </div>

      {/* Difficulty Legend */}
      <div className="space-y-2 pt-2 border-t border-[#333333] text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00b8a3]" />
            <span className="text-gray-300 font-medium">Easy</span>
          </div>
          <span className="font-mono text-gray-400">
            <strong className="text-white">{easySolved}</strong> / {easyTotal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc01e]" />
            <span className="text-gray-300 font-medium">Medium</span>
          </div>
          <span className="font-mono text-gray-400">
            <strong className="text-white">{mediumSolved}</strong> / {mediumTotal}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff375f]" />
            <span className="text-gray-300 font-medium">Hard</span>
          </div>
          <span className="font-mono text-gray-400">
            <strong className="text-white">{hardSolved}</strong> / {hardTotal}
          </span>
        </div>
      </div>
    </div>
  );
};
