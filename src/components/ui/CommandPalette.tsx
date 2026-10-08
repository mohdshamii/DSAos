import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Code2, 
  BookOpen, 
  LayoutDashboard, 
  Shuffle, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { getDifficultyColor } from '../../lib/utils';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const problems = useProblemStore((s) => s.problems);
  const { settings, setTheme } = useSettingsStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelectProblem = (slug: string) => {
    onOpenChange(false);
    navigate(`/problem/${slug}`);
  };

  const handlePickRandom = () => {
    onOpenChange(false);
    if (!problems.length) return;
    const random = problems[Math.floor(Math.random() * problems.length)];
    navigate(`/problem/${random.slug}`);
  };

  const filteredProblems = query.trim()
    ? problems
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.lcNumber?.toString().includes(q) ||
            p.id.toString().includes(q) ||
            p.topics.some((t) => t.toLowerCase().includes(q)) ||
            p.companies.some((c) => c.toLowerCase().includes(q))
          );
        })
        .slice(0, 10)
    : problems.slice(0, 8);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-xl">
        <Command
          className="rounded-xl border border-[#383838] bg-[#222222] shadow-2xl text-gray-200 overflow-hidden"
          loop
        >
          <div className="flex items-center border-b border-[#333333] px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search problems by name, topic, company, #id..."
              className="flex h-12 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-gray-500 text-white"
              autoFocus
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-xs text-gray-400">
              No matching problems or actions found.
            </Command.Empty>

            {/* Quick Navigation Group */}
            {!query && (
              <Command.Group heading={<span className="text-[11px] font-semibold text-gray-500 uppercase px-2">Navigation</span>}>
                <Command.Item
                  onSelect={() => {
                    onOpenChange(false);
                    navigate('/problems');
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#2c2c2c] hover:text-white cursor-pointer"
                >
                  <Code2 className="h-4 w-4 text-[#ffa116]" />
                  <span>Problem List</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    onOpenChange(false);
                    navigate('/lists');
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#2c2c2c] hover:text-white cursor-pointer"
                >
                  <BookOpen className="h-4 w-4 text-[#ffa116]" />
                  <span>Study Lists (Blind 75, MNC 250)</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    onOpenChange(false);
                    navigate('/dashboard');
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#2c2c2c] hover:text-white cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#ffa116]" />
                  <span>Dashboard & Analytics</span>
                </Command.Item>
                <Command.Item
                  onSelect={handlePickRandom}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#2c2c2c] hover:text-white cursor-pointer"
                >
                  <Shuffle className="h-4 w-4 text-[#00b8a3]" />
                  <span>Pick a Random Problem</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    setTheme(settings.theme === 'dark' ? 'light' : 'dark');
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-[#2c2c2c] hover:text-white cursor-pointer"
                >
                  {settings.theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-[#ffc01e]" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-400" />
                  )}
                  <span>Toggle Theme ({settings.theme === 'dark' ? 'Light' : 'Dark'})</span>
                </Command.Item>
              </Command.Group>
            )}

            {/* Problems Group */}
            <Command.Group heading={<span className="text-[11px] font-semibold text-gray-500 uppercase px-2">Problems</span>}>
              {filteredProblems.map((p) => {
                const diffColor = getDifficultyColor(p.difficulty);
                return (
                  <Command.Item
                    key={p.id}
                    value={`${p.lcNumber} ${p.title} ${p.topics.join(' ')}`}
                    onSelect={() => handleSelectProblem(p.slug)}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-gray-200 hover:bg-[#2e2e2e] hover:text-white cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="text-xs font-mono text-gray-500 shrink-0">
                        #{p.lcNumber || p.id}
                      </span>
                      <span className="truncate font-medium">{p.title}</span>
                      <span className="hidden sm:inline-block text-[11px] text-gray-500 truncate">
                        • {p.topics[0]}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border text-right font-medium shrink-0 ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
                    >
                      {p.difficulty}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-[#333333] px-3 py-2 text-[11px] text-gray-500">
            <span>Use ↑↓ to navigate, ↵ to select, Esc to close</span>
            <span className="font-mono">DSA OS v2.0</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
