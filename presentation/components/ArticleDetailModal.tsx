import React, { useState } from 'react';
import { Article } from '../../core/entities/Article';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, ThumbsUp, Calendar, BookOpen, Share2 } from 'lucide-react';

interface ArticleDetailModalProps {
  article: Article;
  onClose: () => void;
  onLike: (id: string) => void;
}

export function ArticleDetailModal({ article, onClose, onLike }: ArticleDetailModalProps) {
  const [likesCount, setLikesCount] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleLikeClick = () => {
    if (hasLiked) return;
    onLike(article.id);
    setLikesCount(prev => prev + 1);
    setHasLiked(true);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-fade-in">
        
        {/* Banner/Header Info */}
        <div className="relative p-6 md:p-8 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-[#0b2046] uppercase tracking-widest font-mono">
              {article.category}
            </span>
            <button 
              onClick={onClose}
              className="text-[#52667d] hover:text-[#0b2046] bg-slate-200 hover:bg-slate-300 p-1.5 rounded-full transition-colors border border-slate-300/40 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0b2046] tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-[#52667d] text-xs font-mono">
            <div className="flex items-center">
              <img 
                src={article.author.avatarUrl} 
                alt={article.author.name}
                className="w-5 h-5 rounded-full mr-2 border border-slate-200"
              />
              <span className="text-[#0b2046] font-sans font-medium">{article.author.name}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={12} className="mr-1.5 text-[#ff5a00]" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center">
              <BookOpen size={12} className="mr-1.5 text-[#ff5a00]" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Body (Markdown rendered) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-white prose prose-slate max-w-none text-[#0b2046]">
          <MarkdownRenderer content={article.content} />
          
          {/* Related Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs font-mono px-3 py-1 rounded bg-slate-50 text-[#52667d] border border-slate-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between">
          <button
            onClick={handleLikeClick}
            disabled={hasLiked}
            className={`flex items-center space-x-2 text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition-all border cursor-pointer ${
              hasLiked 
                ? 'bg-[#ff5a00]/10 border-[#ff5a00]/30 text-[#ff5a00]' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-[#52667d] hover:text-[#ff5a00]'
            }`}
          >
            <ThumbsUp size={14} className={hasLiked ? 'scale-110' : ''} />
            <span>{hasLiked ? 'Curtido!' : 'Curtir'} ({likesCount})</span>
          </button>

          <button
            onClick={handleShareClick}
            className="flex items-center space-x-2 text-xs md:text-sm font-bold bg-white hover:bg-slate-100 border border-slate-200 text-[#52667d] hover:text-[#0b2046] px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Share2 size={14} />
            <span>{copiedShare ? 'Link Copiado!' : 'Compartilhar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
