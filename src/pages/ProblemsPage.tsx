import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProblemStore } from '../store/useProblemStore';
import { ProgressStats } from '../components/problems/ProgressStats';
import { DailyProblemBanner } from '../components/problems/DailyProblemBanner';
import { ProblemFilters } from '../components/problems/ProblemFilters';
import { ProblemTable } from '../components/problems/ProblemTable';

export const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);
  const searchQuery = useProblemStore((s) => s.searchQuery);
  const selectedDifficulty = useProblemStore((s) => s.selectedDifficulty);
  const selectedTopic = useProblemStore((s) => s.selectedTopic);
  const selectedCompany = useProblemStore((s) => s.selectedCompany);
  const selectedStatus = useProblemStore((s) => s.selectedStatus);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(q);
        const matchesLc = problem.lcNumber?.toString().includes(q);
        const matchesId = problem.id.toString().includes(q);
        const matchesTopic = problem.topics.some((t) => t.toLowerCase().includes(q));
        const matchesComp = problem.companies.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesLc && !matchesId && !matchesTopic && !matchesComp) {
          return false;
        }
      }

      // Difficulty
      if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // Topic
      if (selectedTopic && !problem.topics.includes(selectedTopic)) {
        return false;
      }

      // Company
      if (selectedCompany && !problem.companies.includes(selectedCompany)) {
        return false;
      }

      // Status
      if (selectedStatus) {
        const currentStatus = userProgress[problem.id]?.status || 'todo';
        if (currentStatus !== selectedStatus) {
          return false;
        }
      }

      return true;
    });
  }, [
    problems,
    userProgress,
    searchQuery,
    selectedDifficulty,
    selectedTopic,
    selectedCompany,
    selectedStatus,
  ]);

  const handlePickRandom = () => {
    const pool = filteredProblems.length > 0 ? filteredProblems : problems;
    if (!pool.length) return;
    const random = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/problem/${random.slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Top Banner & Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DailyProblemBanner />
        </div>
        <div className="lg:col-span-1">
          <ProgressStats />
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProblemFilters onPickRandom={handlePickRandom} />

      {/* Problems Table */}
      <ProblemTable problems={filteredProblems} />
    </div>
  );
};
