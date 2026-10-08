import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';
import { ProblemsPage } from './pages/ProblemsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { DashboardPage } from './pages/DashboardPage';
import { StudyListsPage } from './pages/StudyListsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useProblemStore } from './store/useProblemStore';

const AppContent: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const problems = useProblemStore((s) => s.problems);

  const isWorkspace = location.pathname.startsWith('/problem/');

  const handlePickRandom = () => {
    if (!problems.length) return;
    const rand = problems[Math.floor(Math.random() * problems.length)];
    navigate(`/problem/${rand.slug}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] flex flex-col antialiased selection:bg-[#ffa116]/30 selection:text-white">
      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onPickRandom={handlePickRandom}
      />

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Navigate to="/problems" replace />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problem/:slug" element={<WorkspacePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lists" element={<StudyListsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/problems" replace />} />
        </Routes>
      </main>

      {!isWorkspace && <Footer />}

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
