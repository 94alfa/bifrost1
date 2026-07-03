import React from 'react';
import { Article } from '../../core/entities/Article';
import { BookOpen, ThumbsUp, Calendar, ArrowRight, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
}

export function ArticleCard({ article, onSelect, onLike }: ArticleCardProps) {
  // Map categories to specific aesthetic sub-borders or text hues
  const categoryColors: Record<string, string> = {
    Frontend: 'text-sky-700 bg-sky-50',
    Backend: 'text-amber-700 bg-amber-50',
    DevOps: 'text-purple-700 bg-purple-50',
    Security: 'text-rose-700 bg-rose-50',
    AI: 'text-emerald-700 bg-emerald-50',
  };

  const badgeClass = categoryColors[article.category] || 'text-slate-700 bg-slate-50';

  const formattedDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <article 
      onClick={() => onSelect(article)}
      className={`group relative flex flex-col justify-between bg-white rounded-none p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full shadow-sm ${article.approved === false ? 'border-l-4 border-amber-500' : ''}`}
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1.5">
            <span className={`text-[10px] md:text-xs font-semibold px-2.5 py-0.5 rounded-none uppercase tracking-widest ${badgeClass}`}>
              {article.category}
            </span>
            {article.approved === false && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-amber-500 text-white uppercase tracking-wider animate-pulse">
                Pendente
              </span>
            )}
          </div>
          <span className="flex items-center text-[11px] text-[#52667d] font-mono">
            <BookOpen size={12} className="mr-1 text-[#ff5a00]" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-md md:text-lg font-bold text-[#0b2046] group-hover:text-[#ff5a00] transition-colors duration-200 line-clamp-2 leading-snug">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs md:text-sm text-[#52667d] mt-2 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.map(tag => (
            <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-none bg-slate-50 text-[#52667d]">
              #{tag.toLowerCase().replace(/\s+/g, '')}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        {/* Author */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm shrink-0">
            <User size={12} />
          </div>
          <span className="text-xs text-[#0b2046] font-medium max-w-[100px] truncate">{article.author.name}</span>
        </div>

        {/* Actions (Like + Read) */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLike(article.id, e);
            }}
            className="flex items-center space-x-1 text-xs text-[#52667d] hover:text-[#ff5a00] transition-colors p-1 rounded-none hover:bg-slate-50"
            title="Curtir artigo"
          >
            <ThumbsUp size={13} className="group-hover:scale-110 transition-transform" />
            <span>{article.likes}</span>
          </button>

          <span className="text-xs text-[#ff5a00] font-bold flex items-center group-hover:translate-x-1 transition-transform duration-200">
            Ler <ArrowRight size={12} className="ml-1" />
          </span>
        </div>
      </div>
    </article>
  );
}
