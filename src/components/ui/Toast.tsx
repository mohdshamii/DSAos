import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

export const ToastContainer: React.FC = () => {
  const toasts = useProblemStore((s) => s.toasts);
  const removeToast = useProblemStore((s) => s.removeToast);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="h-5 w-5 text-blue-400 shrink-0" />;
        let border = 'border-blue-500/30';
        let bg = 'bg-[#222222]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="h-5 w-5 text-[#00b8a3] shrink-0" />;
          border = 'border-[#00b8a3]/40';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="h-5 w-5 text-[#ff375f] shrink-0" />;
          border = 'border-[#ff375f]/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border ${border} ${bg} p-3.5 shadow-2xl backdrop-blur text-sm text-gray-200 transition-all duration-200 animate-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium text-xs md:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white rounded p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
