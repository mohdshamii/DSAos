import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Heart, 
  ArrowLeft,
  Share2
} from 'lucide-react';
import { Problem } from '../../types/problem';
import { useProblemStore } from '../../store/useProblemStore';
import { getDifficultyColor } from '../../lib/utils';
import { Timer } from './Timer';

interface WorkspaceHeaderProps {
  problem: Problem;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ problem }) => {
  const navigate = useNavigate();
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);
  const toggleBookmark = useProblemStore((s) => s.toggleBookmark);
  const toggleLike = useProblemStore((s) => s.toggleLike);
  const addToast = useProblemStore((s) => s.addToast);

  const userState = userProgress[problem.id];
  const isBookmarked = Boolean(userState?.isBookmarked);
  const isLiked = Boolean(userState?.isLiked);
  const diffColor = getDifficultyColor(problem.difficulty);

  const currentIndex = problems.findIndex((p) => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Problem URL copied to clipboard!');
    }
  };

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-[#333333] bg-[#222222] px-4 select-none">
      {/* Left section: Back and Problem Info */}
      <div className="flex items-center gap-3 overflow-hidden">
        <Link
          to="/problems"
          className="flex items-center gap-1 rounded-md p-1.5 text-gray-400 hover:bg-[#2c2c2c] hover:text-white transition-colors"
          title="Back to Problem List"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-0.5 border-r border-[#383838] pr-2.5">
          <button
            onClick={() => prevProblem && navigate(`/problem/${prevProblem.slug}`)}
            disabled={!prevProblem}
            className="rounded p-1 text-gray-400 hover:bg-[#2e2e2e] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title={prevProblem ? `Previous: #${prevProblem.lcNumber} ${prevProblem.title}` : 'No previous problem'}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => nextProblem && navigate(`/problem/${nextProblem.slug}`)}
            disabled={!nextProblem}
            className="rounded p-1 text-gray-400 hover:bg-[#2e2e2e] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            title={nextProblem ? `Next: #${nextProblem.lcNumber} ${nextProblem.title}` : 'No next problem'}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Problem Title & Difficulty */}
        <div className="flex items-center gap-2.5 truncate">
          <span className="font-semibold text-sm text-gray-100 truncate">
            {problem.lcNumber ? `#${problem.lcNumber} ` : ''}{problem.title}
          </span>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
          >
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Right section: Like, Bookmark, Share, Timer */}
      <div className="flex items-center gap-2">
        <Timer />

        <div className="flex items-center gap-1 border-l border-[#383838] pl-2">
          {/* Like */}
          <button
            onClick={() => toggleLike(problem.id)}
            className={`rounded-lg p-1.5 transition-colors ${
              isLiked ? 'text-[#ff375f] bg-[#ff375f]/10' : 'text-gray-400 hover:bg-[#2c2c2c] hover:text-white'
            }`}
            title={isLiked ? 'Unlike problem' : 'Like problem'}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-[#ff375f]' : ''}`} />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(problem.id)}
            className={`rounded-lg p-1.5 transition-colors ${
              isBookmarked ? 'text-[#ffa116] bg-[#ffa116]/10' : 'text-gray-400 hover:bg-[#2c2c2c] hover:text-white'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#ffa116]' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-[#2c2c2c] hover:text-white transition-colors"
            title="Copy link"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
