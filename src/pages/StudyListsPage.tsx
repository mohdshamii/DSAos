import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Briefcase, 
  Target, 
  Flame, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { useStudyListStore } from '../store/useStudyListStore';
import { useProblemStore } from '../store/useProblemStore';
import { getDifficultyColor } from '../lib/utils';
import { StudyList } from '../types/user';

export const StudyListsPage: React.FC = () => {
  const lists = useStudyListStore((s) => s.lists);
  const createCustomList = useStudyListStore((s) => s.createCustomList);
  const deleteCustomList = useStudyListStore((s) => s.deleteCustomList);
  const removeProblemFromList = useStudyListStore((s) => s.removeProblemFromList);

  const problems = useProblemStore((s) => s.problems);
  const userProgress = useProblemStore((s) => s.userProgress);
  const addToast = useProblemStore((s) => s.addToast);

  const [selectedListId, setSelectedListId] = useState<string>(lists[0]?.id || 'preset-mnc-250');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const selectedList: StudyList | undefined = useMemo(() => {
    return lists.find((l) => l.id === selectedListId) || lists[0];
  }, [lists, selectedListId]);

  // Problems for the selected list
  const listProblems = useMemo(() => {
    if (!selectedList) return [];
    if (selectedList.id === 'preset-mnc-250') {
      return problems;
    }
    const idSet = new Set(selectedList.problemIds);
    return problems.filter((p) => idSet.has(p.id));
  }, [selectedList, problems]);

  // Progress stats for selected list
  const listStats = useMemo(() => {
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;
    let easyTotal = 0, mediumTotal = 0, hardTotal = 0;

    listProblems.forEach((p) => {
      const isSolved = userProgress[p.id]?.status === 'solved';
      if (p.difficulty === 'Easy') {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (p.difficulty === 'Medium') {
        mediumTotal++;
        if (isSolved) mediumSolved++;
      } else if (p.difficulty === 'Hard') {
        hardTotal++;
        if (isSolved) hardSolved++;
      }
    });

    const totalSolved = easySolved + mediumSolved + hardSolved;
    const totalCount = listProblems.length || 1;
    const percentage = Math.round((totalSolved / totalCount) * 100);

    return {
      totalSolved,
      totalCount: listProblems.length,
      percentage,
      easySolved,
      easyTotal,
      mediumSolved,
      mediumTotal,
      hardSolved,
      hardTotal,
    };
  }, [listProblems, userProgress]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    createCustomList(newListName.trim(), newListDesc.trim() || 'Custom curated study collection');
    addToast('success', `Created list "${newListName}"!`);
    setNewListName('');
    setNewListDesc('');
    setIsCreateModalOpen(false);
  };

  const handleDeleteList = (id: string, name: string) => {
    deleteCustomList(id);
    addToast('info', `Deleted list "${name}"`);
    if (selectedListId === id) {
      setSelectedListId(lists[0]?.id || 'preset-mnc-250');
    }
  };

  const getListIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="h-5 w-5 text-[#ffa116]" />;
      case 'Target':
        return <Target className="h-5 w-5 text-[#00b8a3]" />;
      case 'Flame':
        return <Flame className="h-5 w-5 text-[#ff375f]" />;
      default:
        return <Bookmark className="h-5 w-5 text-[#ffa116]" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="h-6 w-6 text-[#ffa116]" />
            Study Roadmaps & Lists
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Curated collections to structure your placement preparation and track completion milestones.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#282828] hover:bg-[#323232] border border-[#3e3e3e] hover:border-[#ffa116] text-white text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 text-[#ffa116]" />
          <span>New Custom List</span>
        </button>
      </div>

      {/* Lists Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lists.map((list) => {
          const isSelected = list.id === selectedListId;
          const count = list.id === 'preset-mnc-250' ? problems.length : list.problemIds.length;
          
          let solvedInList = 0;
          if (list.id === 'preset-mnc-250') {
            solvedInList = Object.values(userProgress).filter((p) => p.status === 'solved').length;
          } else {
            list.problemIds.forEach((pid) => {
              if (userProgress[pid]?.status === 'solved') solvedInList++;
            });
          }
          const pct = Math.round((solvedInList / (count || 1)) * 100);

          return (
            <div
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className={`rounded-xl border p-4.5 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#ffa116] bg-[#27231c] shadow-lg shadow-[#ffa116]/5'
                  : 'border-[#333333] bg-[#222222] hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#1c1c1c] border border-[#333333]">
                    {getListIcon(list.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{list.name}</h3>
                    <span className="text-[11px] text-gray-400">
                      {count} Problems {list.isPreset && '• Preset'}
                    </span>
                  </div>
                </div>

                {!list.isPreset && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id, list.name);
                    }}
                    className="text-gray-500 hover:text-red-400 p-1"
                    title="Delete custom list"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                {list.description}
              </p>

              {/* Mini Progress */}
              <div className="mt-4 pt-3 border-t border-[#333333] flex items-center justify-between text-xs">
                <div className="flex-1 mr-3">
                  <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ffa116] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="font-mono text-gray-300 font-semibold shrink-0">
                  {solvedInList}/{count} ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected List Detailed Problem View */}
      {selectedList && (
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-5 shadow-lg space-y-5">
          {/* List Title & Big Progress Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#333333] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{selectedList.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30 font-semibold">
                  {listStats.percentage}% Done
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{selectedList.description}</p>
            </div>

            {/* Easy / Med / Hard badges */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-[#00b8a3]/10 text-[#00b8a3] border border-[#00b8a3]/30">
                Easy: {listStats.easySolved}/{listStats.easyTotal}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#ffc01e]/10 text-[#ffc01e] border border-[#ffc01e]/30">
                Med: {listStats.mediumSolved}/{listStats.mediumTotal}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#ff375f]/10 text-[#ff375f] border border-[#ff375f]/30">
                Hard: {listStats.hardSolved}/{listStats.hardTotal}
              </span>
            </div>
          </div>

          {/* List Problem Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="border-b border-[#333333] bg-[#252525] text-xs font-semibold text-gray-400">
                  <th className="py-3 pl-4 pr-2 w-12 text-center">Status</th>
                  <th className="py-3 px-3 w-16">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-28">Difficulty</th>
                  <th className="py-3 px-4 w-28">Acceptance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2c2c]">
                {listProblems.map((prob, idx) => {
                  const status = userProgress[prob.id]?.status || 'todo';
                  const diffColor = getDifficultyColor(prob.difficulty);

                  return (
                    <tr
                      key={prob.id}
                      className={`hover:bg-[#282828] transition-colors ${
                        idx % 2 === 1 ? 'bg-[#212121]' : 'bg-[#232323]'
                      }`}
                    >
                      <td className="py-3 pl-4 pr-2 text-center">
                        {status === 'solved' ? (
                          <CheckCircle2 className="h-4 w-4 text-[#00b8a3] mx-auto fill-[#00b8a3]/20" />
                        ) : status === 'attempted' ? (
                          <CircleDot className="h-4 w-4 text-[#ffc01e] mx-auto" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-500 mx-auto" />
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-gray-400">
                        {prob.lcNumber || prob.id}
                      </td>

                      <td className="py-3 px-4">
                        <Link
                          to={`/problem/${prob.slug}`}
                          className="font-medium text-gray-200 hover:text-[#ffa116] transition-colors"
                        >
                          {prob.title}
                        </Link>
                        <span className="ml-2 text-[10px] text-gray-500 hidden sm:inline">
                          • {prob.topics[0]}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-gray-400">
                        {prob.acceptance || '50%'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/problem/${prob.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-[#ffa116] hover:text-[#ffb33e] font-semibold"
                          >
                            <span>Solve</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>

                          {!selectedList.isPreset && (
                            <button
                              onClick={() => removeProblemFromList(selectedList.id, prob.id)}
                              className="text-gray-500 hover:text-red-400 p-1"
                              title="Remove from custom list"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create List Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-xl border border-[#383838] bg-[#222222] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create Custom Study List</h3>
            <form onSubmit={handleCreateList} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Google Interview Favorites"
                  required
                  className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:border-[#ffa116] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="e.g. Top 20 essential graph & tree problems for upcoming round..."
                  rows={3}
                  className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5 text-white focus:border-[#ffa116] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#282828] text-gray-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#ffa116] hover:bg-[#ffb33e] text-black text-xs font-semibold"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
