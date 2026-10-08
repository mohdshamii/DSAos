import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

interface NotesTabProps {
  problemId: number;
}

export const NotesTab: React.FC<NotesTabProps> = ({ problemId }) => {
  const userProgress = useProblemStore((s) => s.userProgress);
  const saveNotes = useProblemStore((s) => s.saveNotes);
  const addToast = useProblemStore((s) => s.addToast);

  const initialNotes = userProgress[problemId]?.notes || '';
  const [notes, setNotes] = useState(initialNotes);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setNotes(userProgress[problemId]?.notes || '');
    setIsSaved(true);
  }, [problemId, userProgress]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  const handleManualSave = () => {
    saveNotes(problemId, notes);
    setIsSaved(true);
    addToast('success', 'Notes saved successfully');
  };

  // Debounced auto-save
  useEffect(() => {
    const handler = setTimeout(() => {
      if (notes !== (userProgress[problemId]?.notes || '')) {
        saveNotes(problemId, notes);
        setIsSaved(true);
      }
    }, 1200);

    return () => clearTimeout(handler);
  }, [notes, problemId, userProgress, saveNotes]);

  return (
    <div className="h-full flex flex-col p-5 space-y-4 text-gray-200">
      <div className="flex items-center justify-between border-b border-[#333333] pb-3">
        <div>
          <h2 className="text-base font-bold text-white">Problem Notes</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Jot down edge cases, time complexity thoughts, or interview reminders.
          </p>
        </div>
        <button
          onClick={handleManualSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282828] border border-[#3a3a3a] text-xs font-medium text-gray-200 hover:text-white hover:border-[#ffa116]"
        >
          {isSaved ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#00b8a3]" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 text-[#ffa116]" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        placeholder="Type your notes here in Markdown or plain text... (auto-saved)"
        className="flex-1 w-full rounded-lg border border-[#333333] bg-[#1d1d1d] p-4 text-sm text-gray-100 placeholder-gray-500 focus:border-[#ffa116] focus:outline-none focus:ring-1 focus:ring-[#ffa116] resize-none font-mono leading-relaxed"
      />
    </div>
  );
};
