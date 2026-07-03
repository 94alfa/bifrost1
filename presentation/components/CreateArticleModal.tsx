import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';

interface CreateArticleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateArticleModal({ onClose, onSuccess }: CreateArticleModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [readTime, setReadTime] = useState('5 min');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validation Checks
    if (title.length < 5) {
      setError('O título deve conter pelo menos 5 caracteres.');
      setLoading(false);
      return;
    }
    if (excerpt.length < 10) {
      setError('O resumo deve conter pelo menos 10 caracteres.');
      setLoading(false);
      return;
    }
    if (content.length < 20) {
      setError('O conteúdo do artigo deve conter pelo menos 20 caracteres.');
      setLoading(false);
      return;
    }
    if (!tagsInput.trim()) {
      setError('Insira pelo menos uma tag.');
      setLoading(false);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Prepare robust, pre-seeded author metadata since this is client-only session context
    const payload = {
      title,
      category,
      excerpt,
      content,
      readTime,
      author: {
        id: 'usr-current',
        name: 'Guerreiro Sábio',
        avatarUrl: 'https://picsum.photos/seed/asgard/150/150'
      },
      tags
    };

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro inesperado ao criar artigo.');
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Houve uma falha ao publicar seu artigo na Bifrost.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div>
            <h3 className="text-md md:text-lg font-bold text-[#0b2046] tracking-wide">Escrever Novo Artigo</h3>
            <p className="text-xs text-[#52667d]">Compartilhe o seu conhecimento com toda a comunidade</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#52667d] hover:text-[#0b2046] bg-slate-200 hover:bg-slate-300 p-1.5 rounded-full transition-colors border border-slate-300/40 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Título do Artigo</label>
              <input 
                type="text"
                placeholder="Ex: Como Organizar seu Código em Projetos Modernos"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Categoria</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:outline-none transition-all cursor-pointer"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Security">Security</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>

          {/* Read Time and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Tempo de Leitura</label>
              <input 
                type="text"
                placeholder="Ex: 5 min"
                value={readTime}
                onChange={e => setReadTime(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Tags (Separadas por vírgula)</label>
              <input 
                type="text"
                placeholder="Ex: Tecnologia, Produtividade, Dicas"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Resumo Curto (Excerpt)</label>
            <input 
              type="text"
              placeholder="Uma frase simples resumindo o objetivo do seu artigo..."
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#52667d] uppercase tracking-wider font-mono">Conteúdo do Artigo</label>
              <span className="text-[10px] font-mono text-[#ff5a00] uppercase tracking-widest font-bold">Título, subtítulo e texto simples</span>
            </div>
            <textarea 
              rows={8}
              placeholder="# Título Principal&#10;&#10;## Subtítulo do Artigo&#10;&#10;Escreva o seu texto comum aqui de forma estruturada e limpa."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0b2046] focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all leading-relaxed resize-y placeholder-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-xs md:text-sm font-bold text-[#52667d] hover:text-[#0b2046] bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-5 py-2.5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-white bg-[#ff5a00] hover:bg-[#ff7a2e] hover:shadow-lg hover:shadow-[#ff5a00]/20 disabled:opacity-50 rounded-xl px-5 py-2.5 transition-all cursor-pointer"
            >
              <Send size={14} />
              <span>{loading ? 'Publicando...' : 'Publicar Artigo'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
