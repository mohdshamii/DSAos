import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { BookOpen } from 'lucide-react';
import { Problem } from '../../types/problem';

interface EditorialTabProps {
  problem: Problem;
}

export const EditorialTab: React.FC<EditorialTabProps> = ({ problem }) => {
  return (
    <div className="h-full overflow-y-auto p-5 space-y-4 text-gray-200 text-sm">
      <div className="flex items-center gap-2 border-b border-[#333333] pb-3">
        <BookOpen className="h-4 w-4 text-[#ffa116]" />
        <h2 className="text-base font-bold text-white">Editorial & Official Solution</h2>
      </div>

      {problem.solution ? (
        <div className="prose-dark leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {problem.solution}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <p>No official editorial available yet for this problem.</p>
        </div>
      )}
    </div>
  );
};
