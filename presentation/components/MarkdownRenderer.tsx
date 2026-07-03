import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by code blocks first
  const parts = content.split(/```/g);
  
  return (
    <div className="space-y-4 text-[#E8EAED] font-sans leading-relaxed">
      {parts.map((part, index) => {
        // Even indices are regular markdown text, odd indices are code blocks
        if (index % 2 === 1) {
          const lines = part.split('\n');
          const firstLine = (lines[0] || '').trim();
          const hasLanguage = /^[a-zA-Z0-9+#-]+$/.test(firstLine);
          const language = hasLanguage ? firstLine : '';
          const code = hasLanguage ? lines.slice(1).join('\n').trim() : lines.join('\n').trim();
          
          return (
            <div key={index} className="my-5 rounded-lg overflow-hidden border border-slate-800 bg-[#0A0D14] font-mono text-xs md:text-sm shadow-xl">
              {language && (
                <div className="flex items-center justify-between bg-[#131924] px-4 py-2 text-[10px] text-[#00D4FF] font-semibold border-b border-slate-800 uppercase tracking-widest font-mono">
                  <span>{language}</span>
                  <span className="text-[#9BA1A8] font-normal">heimdall bifrost bridge</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed max-h-[450px]">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Parse headlines, lists, paragraphs for regular text
        const lines = part.split('\n');
        return lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-2" />;

          // Headers
          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={lineIdx} className="text-xl md:text-2xl lg:text-3xl font-bold font-sans text-[#E8EAED] tracking-tight mt-6 mb-3 border-b border-slate-800 pb-2">
                {parseInline(trimmed.substring(2))}
              </h1>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={lineIdx} className="text-lg md:text-xl lg:text-2xl font-semibold font-sans text-[#E8EAED] tracking-tight mt-5 mb-2">
                {parseInline(trimmed.substring(3))}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={lineIdx} className="text-md md:text-lg lg:text-xl font-medium font-sans text-[#00D4FF] tracking-tight mt-4 mb-2">
                {parseInline(trimmed.substring(4))}
              </h3>
            );
          }

          // Lists
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <ul key={lineIdx} className="list-disc pl-6 space-y-1 my-1">
                <li className="text-[#E8EAED] text-sm md:text-base">{parseInline(trimmed.substring(2))}</li>
              </ul>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+)\.\s(.*)/);
            if (match) {
              return (
                <ol key={lineIdx} className="list-decimal pl-6 space-y-1 my-1">
                  <li className="text-[#E8EAED] text-sm md:text-base">{parseInline(match[2])}</li>
                </ol>
              );
            }
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={lineIdx} className="border-l-4 border-[#00D4FF] pl-4 py-1.5 my-3 bg-[#1A1F3A]/60 text-[#9BA1A8] italic rounded-r text-sm md:text-base">
                {parseInline(trimmed.substring(2))}
              </blockquote>
            );
          }

          // Standard paragraph
          return (
            <p key={lineIdx} className="text-[#9BA1A8] text-sm md:text-base mb-3 leading-relaxed">
              {parseInline(line)}
            </p>
          );
        });
      })}
    </div>
  );
}

// Simple inline parser for **bold**, *italic*, and `inline code`
function parseInline(text: string): React.ReactNode[] {
  // Regex pattern matching bold, italic, and inline code
  const tokenRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(tokenRegex);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#E8EAED] font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="text-[#E8EAED] italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-[#00D4FF] font-mono text-[10px] md:text-xs border border-slate-700">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
