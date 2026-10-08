import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

export const TopicProgress: React.FC = () => {
  const navigate = useNavigate();
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);
  const setSelectedTopic = useProblemStore((s) => s.setSelectedTopic);

  // Group problems by topic
  const topicStats = React.useMemo(() => {
    const stats: Record<string, { total: number; solved: number }> = {};

    problems.forEach((p) => {
      p.topics.forEach((t) => {
        if (!stats[t]) {
          stats[t] = { total: 0, solved: 0 };
        }
        stats[t].total++;
        if (userProgress[p.id]?.status === 'solved') {
          stats[t].solved++;
        }
      });
    });

    return Object.entries(stats)
      .filter(([_, data]) => data.total >= 4) // Primary topics
      .sort((a, b) => b[1].total - a[1].total);
  }, [problems, userProgress]);

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    navigate('/problems');
  };

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-[#333333] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#ffa116]" />
          <div>
            <h3 className="font-bold text-white text-base">Topic Mastery</h3>
            <p className="text-xs text-gray-400">Click any topic to practice related problems</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {topicStats.map(([topic, data]) => {
          const pct = Math.round((data.solved / data.total) * 100);

          return (
            <div
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className="p-3 rounded-lg bg-[#272727] border border-[#363636] hover:border-[#ffa116]/60 cursor-pointer transition-all hover:bg-[#2c2c2c] group"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-gray-200 group-hover:text-[#ffa116] transition-colors truncate">
                  {topic}
                </span>
                <span className="font-mono text-gray-400 shrink-0">
                  <strong className="text-white">{data.solved}</strong> / {data.total}
                </span>
              </div>

              <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffa116] to-[#ffb84d] transition-all duration-500 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex justify-end text-[10px] text-gray-500 mt-1">
                <span>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
