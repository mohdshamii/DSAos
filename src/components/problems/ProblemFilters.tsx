import React from 'react';
import { Search, X, Shuffle, RotateCcw } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

const TOPIC_OPTIONS = [
  'All Topics',
  'Arrays',
  'Strings',
  'Two Pointers & Sliding Window',
  'Linked List',
  'Stack & Queue',
  'Binary Search',
  'Recursion & Backtracking',
  'Trees',
  'Binary Search Tree',
  'Heap / Priority Queue',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Trie',
  'Bit Manipulation',
  'Matrix',
  'Design',
];

const COMPANY_OPTIONS = [
  'All Companies',
  'Google',
  'Amazon',
  'Meta',
  'Microsoft',
  'Apple',
  'Uber',
  'Bloomberg',
  'Netflix',
  'Adobe',
  'Goldman Sachs',
];

interface ProblemFiltersProps {
  onPickRandom: () => void;
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({ onPickRandom }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedTopic,
    setSelectedTopic,
    selectedCompany,
    setSelectedCompany,
    selectedStatus,
    setSelectedStatus,
  } = useProblemStore();

  const difficulties = [
    { label: 'All', value: '' },
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' },
  ];

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedDifficulty) ||
    Boolean(selectedTopic) ||
    Boolean(selectedCompany) ||
    Boolean(selectedStatus);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('');
    setSelectedTopic('');
    setSelectedCompany('');
    setSelectedStatus('');
  };

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-[#333333] bg-[#222222] p-4 shadow-md">
      {/* Top row: Search and Difficulty Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, numbers, tags..."
            className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] py-2 pl-9 pr-9 text-sm text-white placeholder-gray-500 focus:border-[#ffa116] focus:outline-none focus:ring-1 focus:ring-[#ffa116]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Difficulty buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-[#1a1a1a] p-1 border border-[#383838]">
          {difficulties.map((d) => {
            const isActive = selectedDifficulty === d.value;
            let activeColor = 'bg-[#333333] text-white';
            if (isActive && d.value === 'Easy') activeColor = 'bg-[#00b8a3]/20 text-[#00b8a3] border border-[#00b8a3]/40';
            if (isActive && d.value === 'Medium') activeColor = 'bg-[#ffc01e]/20 text-[#ffc01e] border border-[#ffc01e]/40';
            if (isActive && d.value === 'Hard') activeColor = 'bg-[#ff375f]/20 text-[#ff375f] border border-[#ff375f]/40';

            return (
              <button
                key={d.label}
                onClick={() => setSelectedDifficulty(d.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  isActive ? activeColor : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Select Dropdowns, Status, and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Topic Select */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value === 'All Topics' ? '' : e.target.value)}
            className="rounded-lg border border-[#383838] bg-[#1a1a1a] px-3 py-1.5 text-xs text-gray-200 focus:border-[#ffa116] focus:outline-none"
          >
            {TOPIC_OPTIONS.map((t) => (
              <option key={t} value={t === 'All Topics' ? '' : t}>
                {t}
              </option>
            ))}
          </select>

          {/* Company Select */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value === 'All Companies' ? '' : e.target.value)}
            className="rounded-lg border border-[#383838] bg-[#1a1a1a] px-3 py-1.5 text-xs text-gray-200 focus:border-[#ffa116] focus:outline-none"
          >
            {COMPANY_OPTIONS.map((c) => (
              <option key={c} value={c === 'All Companies' ? '' : c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-[#383838] bg-[#1a1a1a] px-3 py-1.5 text-xs text-gray-200 focus:border-[#ffa116] focus:outline-none"
          >
            <option value="">Status: All</option>
            <option value="todo">Todo</option>
            <option value="attempted">Attempted</option>
            <option value="solved">Solved</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#ffa116] px-2 py-1 rounded transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Pick random button */}
        <button
          onClick={onPickRandom}
          className="flex items-center gap-1.5 rounded-lg border border-[#ffa116]/40 bg-[#ffa116]/10 px-3 py-1.5 text-xs font-semibold text-[#ffa116] hover:bg-[#ffa116]/20 transition-all"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Pick Random
        </button>
      </div>
    </div>
  );
};
