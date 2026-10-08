import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ChevronDown, ChevronRight, Lightbulb, Tag, Building2 } from 'lucide-react';
import { Problem } from '../../types/problem';

interface DescriptionTabProps {
  problem: Problem;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ problem }) => {
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  const toggleHint = (idx: number) => {
    setOpenHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-6 text-gray-200 text-sm">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-white mb-2">
          {problem.lcNumber ? `${problem.lcNumber}. ` : ''}{problem.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/30 font-medium">
            Frequency: {problem.frequency}%
          </span>
          {problem.acceptance && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2a2a2a] text-gray-300 border border-[#383838]">
              Acceptance: {problem.acceptance}
            </span>
          )}
        </div>
      </div>

      {/* Markdown Description */}
      <div className="prose-dark font-sans leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {problem.description}
        </ReactMarkdown>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-white text-sm">Examples</h3>
          {problem.examples.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#333333] bg-[#222222] p-3.5 space-y-2 text-xs"
            >
              <div className="font-semibold text-gray-300">Example {idx + 1}:</div>
              <div className="space-y-1 font-mono">
                <div>
                  <span className="text-gray-400 select-none">Input: </span>
                  <span className="text-white">{ex.input}</span>
                </div>
                <div>
                  <span className="text-gray-400 select-none">Output: </span>
                  <span className="text-[#00b8a3]">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="font-sans text-gray-400 pt-1">
                    <span className="font-semibold text-gray-300">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-white text-sm">Constraints</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-300 font-mono">
            {problem.constraints.map((c, idx) => (
              <li key={idx} className="leading-relaxed">
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hints (Collapsible) */}
      {problem.hints && problem.hints.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-[#ffa116]" />
            Hints
          </h3>
          <div className="space-y-2">
            {problem.hints.map((hint, idx) => {
              const isOpen = Boolean(openHints[idx]);
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-[#333333] bg-[#242424] overflow-hidden"
                >
                  <button
                    onClick={() => toggleHint(idx)}
                    className="flex w-full items-center justify-between p-3 text-xs font-medium text-gray-300 hover:text-white transition-colors text-left"
                  >
                    <span>Hint {idx + 1}</span>
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-xs text-gray-400 border-t border-[#333333] pt-2 font-sans leading-relaxed">
                      {hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Topic and Company Tags */}
      <div className="pt-4 border-t border-[#333333] space-y-3">
        {/* Topics */}
        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1.5">
            {problem.topics.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[#282828] text-gray-300 border border-[#383838]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Companies */}
        {problem.companies && problem.companies.length > 0 && (
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {problem.companies.map((c) => (
                <span
                  key={c}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[#30281b] text-[#e0b06b] border border-[#4d3d25]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
