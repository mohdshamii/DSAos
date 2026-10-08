import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Flame, 
  Search, 
  Sun, 
  Moon, 
  Settings, 
  Code2, 
  BookOpen, 
  LayoutDashboard,
  Shuffle
} from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onPickRandom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onPickRandom }) => {
  const location = useLocation();
  const streak = useProblemStore((s) => s.streak);
  const { settings, setTheme } = useSettingsStore();

  const isDark = settings.theme === 'dark';

  const navLinks = [
    { to: '/problems', label: 'Problems', icon: Code2 },
    { to: '/lists', label: 'Study Lists', icon: BookOpen },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#333333] bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/problems" className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffa116] to-[#ff7e16] text-[#1a1a1a] shadow-md shadow-[#ffa116]/20 font-mono font-extrabold text-lg">
              &lt;/&gt;
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold leading-none tracking-wider text-white">
                DSA <span className="text-[#ffa116]">OS</span>
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">MNC 250 Practice</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#282828] text-white shadow-sm border border-[#3a3a3a]'
                      : 'text-gray-300 hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#ffa116]" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Ctrl+K */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 rounded-lg bg-[#252525] border border-[#383838] px-3 py-1.5 text-xs text-gray-400 hover:border-[#ffa116]/60 hover:text-gray-200 transition-all shadow-inner"
            title="Search problems (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search problems...</span>
            <kbd className="rounded bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] font-mono border border-[#444]">
              Ctrl K
            </kbd>
          </button>

          {/* Random Problem Button */}
          <button
            onClick={onPickRandom}
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#282828] border border-[#383838] px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-[#ffa116]/80 hover:bg-[#303030] transition-colors"
            title="Pick a random problem"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#ffa116]" />
            <span>Random</span>
          </button>

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 rounded-full bg-[#ffa116]/10 border border-[#ffa116]/30 px-2.5 py-1 text-xs font-semibold text-[#ffa116]"
            title={`${streak} day practice streak!`}
          >
            <Flame className="h-4 w-4 fill-[#ffa116] animate-pulse" />
            <span>{streak}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-lg p-2 text-gray-400 hover:bg-[#282828] hover:text-white transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Settings */}
          <Link
            to="/settings"
            className={`rounded-lg p-2 transition-colors ${
              location.pathname === '/settings'
                ? 'bg-[#282828] text-[#ffa116]'
                : 'text-gray-400 hover:bg-[#282828] hover:text-white'
            }`}
            title="Settings & Progress Backup"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
