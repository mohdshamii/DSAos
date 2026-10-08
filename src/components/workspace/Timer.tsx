import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { formatTime } from '../../lib/utils';

export const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div className="relative flex items-center">
      <div className="flex items-center gap-1.5 rounded-lg bg-[#252525] border border-[#383838] px-2.5 py-1 text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white"
          title="Toggle stopwatch controls"
        >
          <TimerIcon className={`h-3.5 w-3.5 ${isActive ? 'text-[#00b8a3] animate-pulse' : 'text-gray-400'}`} />
          <span className="font-mono font-medium">{formatTime(seconds)}</span>
        </button>

        <button
          onClick={toggle}
          className="text-gray-400 hover:text-white p-0.5"
          title={isActive ? 'Pause timer' : 'Start timer'}
        >
          {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>

        <button
          onClick={reset}
          className="text-gray-400 hover:text-white p-0.5"
          title="Reset timer"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
