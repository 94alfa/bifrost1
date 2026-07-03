import React, { useState } from 'react';
import { X, Code, AlertCircle } from 'lucide-react';

interface CreateSnippetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSnippetModal({ onClose, onSuccess }: CreateSnippetModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Validations
    if (title.length < 5) {
      setError('O título do snippet deve conter pelo menos 5 caracteres.');
      setLoading(false);
      return;
    }
    if (description.length < 10) {
      setError('A descrição do snippet deve conter pelo menos 10 caracteres.');
      setLoading(false);
      return;
    }
    if (code.length < 5) {
      setError('O bloco de código não pode ser vazio.');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      language,
      code,
      author: {
        id: 'usr-current',
        name: 'Guerreiro Sábio',
        avatarUrl: 'https://picsum.photos/seed/asgard/150/150'
      }
    };

    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro inesperado ao criar snippet.');
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Houve uma falha ao enviar seu snippet para a Bifrost.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1419]/90 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1A1F3A] border border-slate-800 rounded-none shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131924] border-b border-slate-800">
          <div>
            <h3 className="text-md md:text-lg font-bold text-[#E8EAED] tracking-wide">Compartilhar Snippet (Bifrost Gist)</h3>
            <p className="text-xs text-[#9BA1A8]">Envie seu código para análises instantâneas da inteligência artificial</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9BA1A8] hover:text-white bg-slate-800/80 hover:bg-slate-800 p-1.5 rounded-none transition-colors border border-slate-700/40"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4">
          
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-none">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title and Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#9BA1A8] uppercase tracking-wider font-sans">Título do Snippet</label>
              <input 
                type="text"
                placeholder="Título do Snippet"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full bg-[#0A0D14] border border-slate-700 rounded-none px-4 py-2.5 text-sm text-white focus:bg-[#0A0D14] focus:border-2 focus:border-[#00D4FF] focus:ring-0 focus:outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#9BA1A8] uppercase tracking-wider font-sans">Linguagem</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-[#0A0D14] border border-slate-700 rounded-none px-4 py-2.5 text-sm text-white focus:bg-[#0A0D14] focus:border-2 focus:border-[#00D4FF] focus:ring-0 focus:outline-none transition-all capitalize"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#9BA1A8] uppercase tracking-wider font-sans">Descrição Curta</label>
            <input 
              type="text"
              placeholder="Explique o que este código faz e em quais cenários utilizá-lo..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-none px-4 py-2.5 text-sm text-white focus:bg-[#0A0D14] focus:border-2 focus:border-[#00D4FF] focus:ring-0 focus:outline-none transition-all"
            />
          </div>

          {/* Code Blocks */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#9BA1A8] uppercase tracking-wider font-sans font-bold">Código Fonte</label>
              <span className="text-[10px] text-[#00D4FF] font-mono uppercase tracking-widest flex items-center space-x-1">
                <Code size={11} />
                <span>Modo Escrita Ativo</span>
              </span>
            </div>
            <textarea 
              rows={8}
              placeholder={`function minhaFuncao() {\n  // Escreva seu código de Midgard aqui...\n}`}
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="w-full bg-[#0A0D14] border border-slate-700 rounded-none px-4 py-3 text-sm text-white focus:bg-[#0A0D14] focus:border-2 focus:border-[#00D4FF] focus:ring-0 focus:outline-none transition-all font-mono leading-relaxed resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-xs md:text-sm font-semibold text-[#9BA1A8] hover:text-white bg-transparent border border-slate-800 hover:border-slate-700 rounded-none px-5 py-2.5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 text-xs md:text-sm font-semibold text-[#0F1419] bg-[#00D4FF] hover:bg-[#00d5ffdd] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] disabled:opacity-50 rounded-none px-5 py-2.5 transition-all"
            >
              <span>{loading ? 'Sincronizando...' : 'Compartilhar Gist'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
