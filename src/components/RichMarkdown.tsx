import React from 'react';

interface RichMarkdownProps {
  content: string;
  className?: string;
}

export const RichMarkdown: React.FC<RichMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Format inline **bold** and *italic* segments safely
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={idx} className="text-[#D4AF37] font-semibold">
            {inner}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={index} className="h-1.5" />;
        }

        // Heading ### or ## or #
        if (line.startsWith('### ')) {
          return (
            <h4
              key={index}
              className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-[#B8860B] pt-2 pb-1 border-b border-[#B8860B]/20"
            >
              {renderInline(line.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (line.startsWith('## ') || line.startsWith('# ')) {
          return (
            <h3
              key={index}
              className="text-sm sm:text-base font-serif font-bold uppercase tracking-wider text-[#B8860B] pt-2 pb-1 border-b border-[#B8860B]/30"
            >
              {renderInline(line.replace(/^#+\s+/, ''))}
            </h3>
          );
        }

        // Bullet points (-, *, •)
        if (/^[-*•]\s+/.test(line)) {
          const itemText = line.replace(/^[-*•]\s+/, '');
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 border border-[#B8860B] rotate-45 bg-[#B8860B]/80 mt-1.5 shrink-0" />
              <span className="flex-1 leading-relaxed">{renderInline(itemText)}</span>
            </div>
          );
        }

        // Numbered list (1. , 2. )
        const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="text-[#B8860B] font-serif font-bold text-xs min-w-[18px]">
                {numMatch[1]}.
              </span>
              <span className="flex-1 leading-relaxed">{renderInline(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={index} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
};
