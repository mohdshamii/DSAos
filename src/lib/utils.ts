import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function getDifficultyColor(diff: string): {
  text: string;
  bg: string;
  border: string;
  hex: string;
} {
  switch (diff.toLowerCase()) {
    case 'easy':
      return {
        text: 'text-[#00b8a3]',
        bg: 'bg-[#00b8a3]/10',
        border: 'border-[#00b8a3]/30',
        hex: '#00b8a3',
      };
    case 'medium':
      return {
        text: 'text-[#ffc01e]',
        bg: 'bg-[#ffc01e]/10',
        border: 'border-[#ffc01e]/30',
        hex: '#ffc01e',
      };
    case 'hard':
      return {
        text: 'text-[#ff375f]',
        bg: 'bg-[#ff375f]/10',
        border: 'border-[#ff375f]/30',
        hex: '#ff375f',
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-400/10',
        border: 'border-gray-400/30',
        hex: '#9e9e9e',
      };
  }
}
