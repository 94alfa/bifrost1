import React, { useState, useEffect } from 'react';
import { Snippet } from '../../core/entities/Snippet';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, Play, ShieldAlert, BookOpen, Copy, Check, Sparkles } from 'lucide-react';

interface CodeReviewPanelProps {
  snippet: Snippet;
  initialMode: 'review' | 'explain' | 'view';
  onClose: () => void;
}

export function CodeReviewPanel({ snippet, initialMode, onClose }: CodeReviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'explain' | 'code'>(
    initialMode === 'view' ? 'code' : initialMode
  );
  
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cache for the AI responses during the component session
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [explainResult, setExplainResult] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReviewResult(null);
      setExplainResult(null);
      setError(null);
      setActiveTab(initialMode === 'view' ? 'code' : initialMode);
    }, 0);
    return () => clearTimeout(timer);
  }, [snippet, initialMode]);

  // Handle triggered AI actions
  const fetchAIAnalysis = async (type: 'review' | 'explain') => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = type === 'review' ? '/api/gemini/review' : '/api/gemini/explain';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: snippet.title,
          code: snippet.code,
          language: snippet.language,
          description: snippet.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha ao processar requisição');
      }

      if (type === 'review') {
        setReviewResult(data.review);
      } else {
        setExplainResult(data.explanation);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Houve um erro ao invocar Bifrost AI. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger load when switching tabs if content is missing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'review' && !reviewResult && !loading) {
        fetchAIAnalysis('review');
      } else if (activeTab === 'explain' && !explainResult && !loading) {
        fetchAIAnalysis('explain');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, reviewResult, explainResult, loading]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-900/60 backdrop-blur-md overflow-hidden">
      
      {/* LEFT COLUMN: Code Snippet Viewer */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full border-b md:border-b-0 md:border-r border-slate-200 flex flex-col bg-[#0A0D14]">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0b2046] border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-none bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-none bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-none bg-green-500" />
            <span className="text-xs text-slate-300 font-mono ml-2 uppercase tracking-wider">{snippet.language}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={copyToClipboard}
              className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-none transition-colors cursor-pointer"
            >
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
            <button 
              onClick={onClose}
              className="md:hidden text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-none transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex-1 font-mono text-xs md:text-sm text-slate-200 leading-relaxed bg-[#0A0D14]">
          <pre className="select-text whitespace-pre-wrap">
            <code>{snippet.code}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-[#0b2046] border-t border-slate-850 shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src={snippet.author.avatarUrl} 
              alt={snippet.author.name}
              className="w-5 h-5 rounded-none border border-slate-700"
            />
            <span className="text-xs text-slate-300">{snippet.author.name}</span>
          </div>
          <span className="text-[10px] md:text-xs text-slate-400 font-mono">
            {new Date(snippet.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: AI Analysis & Runes */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-full flex flex-col bg-white">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center space-x-1 p-0.5 bg-slate-200/60 rounded-none border border-slate-200">
            <button
              onClick={() => setActiveTab('code')}
              className={`text-xs px-3 py-1.5 rounded-none font-bold transition-all cursor-pointer ${
                activeTab === 'code' 
                  ? 'bg-white text-[#0b2046] shadow-sm' 
                  : 'text-[#52667d] hover:text-[#0b2046]'
              }`}
            >
              Descrição
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-none font-bold transition-all cursor-pointer ${
                activeTab === 'review' 
                  ? 'bg-[#ff5a00] text-white shadow-sm' 
                  : 'text-[#52667d] hover:text-[#ff5a00]'
              }`}
            >
              <ShieldAlert size={12} />
              <span>Revisão Rúnica</span>
            </button>
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-none font-bold transition-all cursor-pointer ${
                activeTab === 'explain' 
                  ? 'bg-[#0b2046] text-white shadow-sm' 
                  : 'text-[#52667d] hover:text-[#0b2046]'
              }`}
            >
              <BookOpen size={12} />
              <span>Explicação</span>
            </button>
          </div>

          <button 
            onClick={onClose}
            className="hidden md:flex items-center justify-center text-[#52667d] hover:text-[#0b2046] bg-slate-200 hover:bg-slate-300 p-1.5 rounded-none transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {activeTab === 'code' && (
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-[#0b2046]">{snippet.title}</h2>
              <p className="text-sm text-[#52667d] leading-relaxed whitespace-pre-wrap">{snippet.description}</p>
              
              <div className="p-4 rounded-none border border-dashed border-slate-200 bg-slate-50 mt-6 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#ff5a00] flex items-center space-x-1.5 font-bold">
                  <Sparkles size={12} />
                  <span>Atalhos Bifrost AI</span>
                </h4>
                <p className="text-xs text-[#52667d]">Selecione as abas superiores para canalizar o conhecimento da Bifrost.</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('review')}
                    className="flex-1 text-xs py-2 px-3 bg-[#ff5a00] hover:bg-[#ff7a2e] text-white rounded-none font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Gerar Code Review
                  </button>
                  <button 
                    onClick={() => setActiveTab('explain')}
                    className="flex-1 text-xs py-2 px-3 bg-[#0b2046] hover:bg-slate-800 text-white rounded-none font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Explicar Código
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Loader/Rune Glow State */}
          {loading && (activeTab === 'review' || activeTab === 'explain') && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Pulsating concentric glow rings */}
                <span className="absolute inset-0 border border-[#ff5a00]/30 rounded-none animate-ping" />
                <span className="absolute inset-2 border border-[#0b2046]/20 rounded-none animate-pulse" />
                <div className="w-10 h-10 rounded-none bg-gradient-to-tr from-[#0b2046] to-[#ff5a00]/25 flex items-center justify-center border border-[#ff5a00]/40 text-[#ff5a00] animate-spin">
                  ᚛
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-[#0b2046] tracking-wide animate-pulse">Sincronizando com a Bifrost...</h4>
                <p className="text-xs text-[#52667d] max-w-xs leading-relaxed">
                  A Bifrost está escaneando as linhas rúnicas do seu código de Midgard. Por favor, aguarde.
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-none bg-red-50 border border-red-200 text-red-600 text-xs md:text-sm my-4">
              <p className="font-bold mb-1">A Bifrost falhou:</p>
              <p>{error}</p>
              <button 
                onClick={() => fetchAIAnalysis(activeTab as 'review' | 'explain')}
                className="mt-3 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-none transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* AI Success Render */}
          {!loading && !error && activeTab === 'review' && reviewResult && (
            <div className="space-y-4 animate-fade-in text-[#0b2046]">
              <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#ff5a00] font-bold">
                <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>Revisão Rúnica Concluída</span>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700">
                <MarkdownRenderer content={reviewResult} />
              </div>
            </div>
          )}

          {!loading && !error && activeTab === 'explain' && explainResult && (
            <div className="space-y-4 animate-fade-in text-[#0b2046]">
              <div className="flex items-center space-x-1.5 text-xs font-mono uppercase tracking-widest text-[#0b2046] font-bold">
                <Sparkles size={12} className="animate-spin text-[#ff5a00]" style={{ animationDuration: '4s' }} />
                <span>Revelando Conhecimento da Bifrost</span>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700">
                <MarkdownRenderer content={explainResult} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
