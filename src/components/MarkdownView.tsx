import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-serif font-bold uppercase tracking-wider text-[#B8860B] border-b border-[#B8860B]/25 pb-2 mt-4 mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-serif font-bold uppercase tracking-wider text-[#B8860B] border-b border-[#B8860B]/20 pb-1.5 mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#D4AF37] mt-3.5 mb-1.5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#B8860B] mt-3 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed my-1.5">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-[#F3F4F6] font-semibold font-serif">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-[#D4AF37] italic">
              {children}
            </em>
          ),
          hr: () => (
            <hr className="border-[#B8860B]/25 my-3.5" />
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-2 pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal text-xs sm:text-sm text-[#94A3B8]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed flex items-start gap-2">
              <span className="w-1.5 h-1.5 border border-[#B8860B] rotate-45 bg-[#B8860B]/70 mt-1.5 shrink-0" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#B8860B] pl-3 py-1 my-2 text-xs italic text-[#F3F4F6]/90 bg-[#B8860B]/5 rounded-r-sm">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
