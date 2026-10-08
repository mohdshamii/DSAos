import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  Bookmark, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Problem } from '../../types/problem';
import { useProblemStore } from '../../store/useProblemStore';
import { getDifficultyColor } from '../../lib/utils';

interface ProblemTableProps {
  problems: Problem[];
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ problems }) => {
  const userProgress = useProblemStore((s) => s.userProgress);
  const toggleBookmark = useProblemStore((s) => s.toggleBookmark);

  const [sortField, setSortField] = useState<'id' | 'title' | 'difficulty' | 'acceptance' | 'frequency'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handleSort = (field: 'id' | 'title' | 'difficulty' | 'acceptance' | 'frequency') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

  const sortedProblems = useMemo(() => {
    return [...problems].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = (a.lcNumber || a.id) - (b.lcNumber || b.id);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'difficulty') {
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      } else if (sortField === 'acceptance') {
        const aRate = parseFloat(a.acceptance || '50');
        const bRate = parseFloat(b.acceptance || '50');
        comparison = aRate - bRate;
      } else if (sortField === 'frequency') {
        comparison = a.frequency - b.frequency;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [problems, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedProblems.length / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProblems.slice(start, start + pageSize);
  }, [sortedProblems, currentPage, pageSize]);

  const renderSortIcon = (field: 'id' | 'title' | 'difficulty' | 'acceptance' | 'frequency') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#ffa116]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#ffa116]" />
    );
  };

  return (
    <div className="rounded-xl border border-[#333333] bg-[#222222] shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#333333] bg-[#252525] text-xs font-semibold text-gray-400">
              <th className="py-3.5 pl-4 pr-2 w-12 text-center">Status</th>
              <th
                onClick={() => handleSort('id')}
                className="py-3.5 px-3 w-16 cursor-pointer hover:text-white transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>#</span>
                  {renderSortIcon('id')}
                </div>
              </th>
              <th
                onClick={() => handleSort('title')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Title</span>
                  {renderSortIcon('title')}
                </div>
              </th>
              <th
                onClick={() => handleSort('acceptance')}
                className="py-3.5 px-4 w-28 cursor-pointer hover:text-white transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Acceptance</span>
                  {renderSortIcon('acceptance')}
                </div>
              </th>
              <th
                onClick={() => handleSort('difficulty')}
                className="py-3.5 px-4 w-28 cursor-pointer hover:text-white transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Difficulty</span>
                  {renderSortIcon('difficulty')}
                </div>
              </th>
              <th
                onClick={() => handleSort('frequency')}
                className="py-3.5 px-4 w-28 cursor-pointer hover:text-white transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Frequency</span>
                  {renderSortIcon('frequency')}
                </div>
              </th>
              <th className="py-3.5 px-3 w-12 text-center">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2c2c2c]">
            {paginatedProblems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <p className="text-sm font-medium">No problems match the current filter.</p>
                  <p className="text-xs text-gray-500 mt-1">Try resetting filters or search keywords.</p>
                </td>
              </tr>
            ) : (
              paginatedProblems.map((problem, idx) => {
                const userState = userProgress[problem.id];
                const status = userState?.status || 'todo';
                const isBookmarked = Boolean(userState?.isBookmarked);
                const diffColor = getDifficultyColor(problem.difficulty);

                return (
                  <tr
                    key={problem.id}
                    className={`transition-colors hover:bg-[#282828] ${
                      idx % 2 === 1 ? 'bg-[#212121]' : 'bg-[#232323]'
                    }`}
                  >
                    {/* Status Icon */}
                    <td className="py-3 pl-4 pr-2 text-center">
                      {status === 'solved' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#00b8a3] mx-auto fill-[#00b8a3]/20" />
                      ) : status === 'attempted' ? (
                        <CircleDot className="h-4 w-4 text-[#ffc01e] mx-auto" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-500 mx-auto" />
                      )}
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 text-xs font-mono text-gray-400">
                      {problem.lcNumber || problem.id}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                        <Link
                          to={`/problem/${problem.slug}`}
                          className="font-medium text-gray-200 hover:text-[#ffa116] transition-colors truncate max-w-md"
                        >
                          {problem.title}
                        </Link>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e1e] text-gray-400 border border-[#333333]">
                            {problem.topics[0]}
                          </span>
                          {problem.companies[0] && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2c261e] text-[#d4a055] border border-[#443828] hidden lg:inline-block">
                              {problem.companies[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Acceptance */}
                    <td className="py-3 px-4 text-xs font-mono text-gray-300">
                      {problem.acceptance || '49.8%'}
                    </td>

                    {/* Difficulty */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Frequency */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333333]">
                          <div
                            className="h-full bg-gradient-to-r from-[#ffa116] to-[#ff6a00] rounded-full"
                            style={{ width: `${problem.frequency}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-gray-400">
                          {problem.frequency}%
                        </span>
                      </div>
                    </td>

                    {/* Bookmark quick toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => toggleBookmark(problem.id)}
                        className={`p-1 rounded transition-colors ${
                          isBookmarked
                            ? 'text-[#ffa116] hover:text-[#ffb33e]'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isBookmarked ? 'fill-[#ffa116]' : ''}`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#333333] bg-[#222222] px-4 py-3 text-xs text-gray-400 gap-3">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-[#383838] bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>All 250</option>
          </select>
          <span>
            of <strong className="text-white font-mono">{sortedProblems.length}</strong> problems
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page <strong className="text-white">{currentPage}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded p-1 text-gray-400 hover:bg-[#333333] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded p-1 text-gray-400 hover:bg-[#333333] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
