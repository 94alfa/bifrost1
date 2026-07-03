import React from 'react';
import { Snippet } from '../../core/entities/Snippet';
import { Star, ShieldAlert, Cpu, ArrowRight, Code, User } from 'lucide-react';

interface SnippetCardProps {
  snippet: Snippet;
  onSelect: (snippet: Snippet) => void;
  onStar: (id: string, e: React.MouseEvent) => void;
  onAIAction: (snippet: Snippet, action: 'review' | 'explain') => void;
}

export function SnippetCard({ snippet, onSelect, onStar, onAIAction }: SnippetCardProps) {
  // Map programming languages to their respective brand colors/badges
  const langColors: Record<string, string> = {
    typescript: 'text-sky-700 bg-sky-50 border-sky-100',
    javascript: 'text-amber-700 bg-amber-50 border-amber-100',
    python: 'text-blue-700 bg-blue-50 border-blue-100',
    go: 'text-cyan-700 bg-cyan-50 border-cyan-100',
    rust: 'text-orange-700 bg-orange-50 border-orange-100',
  };

  const badgeClass = langColors[snippet.language.toLowerCase()] || 'text-purple-700 bg-purple-50 border-purple-100';

  return (
    <div 
      onClick={() => onSelect(snippet)}
      className="group flex flex-col justify-between bg-white border border-slate-200 rounded-none p-5 hover:border-[#ff5a00]/50 cursor-pointer transition-all duration-300 hover:shadow-lg h-full hover:-translate-y-1"
    >
      <div>
        {/* Header language & metadata */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] md:text-xs font-mono font-bold px-2.5 py-0.5 rounded-none border capitalize ${badgeClass}`}>
            {snippet.language}
          </span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStar(snippet.id, e);
            }}
            className="flex items-center space-x-1 text-xs text-[#52667d] hover:text-[#ff5a00] transition-colors p-1 rounded-none hover:bg-slate-50"
            title="Adicionar estrela"
          >
            <Star size={13} className="text-[#ff5a00] fill-[#ff5a00]/10 group-hover:scale-110 transition-transform" />
            <span className="font-mono">{snippet.stars}</span>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-md md:text-lg font-bold text-[#0b2046] group-hover:text-[#ff5a00] transition-colors duration-200 line-clamp-1">
          {snippet.title}
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-[#52667d] mt-2 mb-4 line-clamp-2 leading-relaxed">
          {snippet.description}
        </p>

        {/* Mini code block preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-none p-3 font-mono text-[11px] md:text-xs text-slate-700 overflow-hidden mb-4 relative max-h-[80px]">
          <pre className="opacity-80">{snippet.code.slice(0, 100)}...</pre>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Actions and Author details */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        {/* Author info */}
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm shrink-0">
            <User size={10} />
          </div>
          <span className="text-[11px] md:text-xs text-[#0b2046] font-medium max-w-[80px] truncate">{snippet.author.name}</span>
        </div>

        {/* AI quick trigger buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAIAction(snippet, 'review');
            }}
            className="flex items-center space-x-1 text-[10px] md:text-xs font-bold text-[#ff5a00] bg-[#ff5a00]/5 hover:bg-[#ff5a00]/10 rounded-none px-2.5 py-1 transition-all"
            title="Revisar código com IA"
          >
            <ShieldAlert size={12} />
            <span className="hidden sm:inline">Revisão IA</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAIAction(snippet, 'explain');
            }}
            className="flex items-center space-x-1 text-[10px] md:text-xs font-bold text-[#0b2046] bg-[#0b2046]/5 hover:bg-[#0b2046]/10 rounded-none px-2.5 py-1 transition-all"
            title="Explicar código com IA"
          >
            <Cpu size={12} />
            <span className="hidden sm:inline">Explicar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
