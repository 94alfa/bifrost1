'use client';

import React, { useState, useEffect } from 'react';
import { Article } from '../core/entities/Article';
import { Snippet } from '../core/entities/Snippet';
import { ArticleCard } from '../presentation/components/ArticleCard';
import { SnippetCard } from '../presentation/components/SnippetCard';
import { CodeReviewPanel } from '../presentation/components/CodeReviewPanel';
import { MarkdownRenderer } from '../presentation/components/MarkdownRenderer';
import { 
  Terminal, 
  BookOpen, 
  Code, 
  Search, 
  Plus, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  Moon,
  Github,
  Globe,
  User,
  LogIn,
  UserPlus,
  ArrowLeft,
  Calendar,
  ThumbsUp,
  Share2,
  Send,
  AlertCircle,
  X,
  Compass
} from 'lucide-react';

const mythologicalUsers = [
  'odin_allfather', 'thor-thunder', 'loki_trickster', 'freya_nordic',
  'heimdall_guardian', 'baldur-light', 'frigg_queen', 'tyr_combat',
  'njord-sea', 'idun_apples', 'hel_underworld', 'vidar_silent'
];

export default function BifrostHome() {
  // Navigation tabs: 'articles' | 'snippets'
  const [activeTab, setActiveTab] = useState<'articles' | 'snippets'>('articles');
  
  // Inline view states
  const [currentScreen, setCurrentScreen] = useState<'home' | 'article-detail' | 'write-article' | 'login' | 'register'>('home');
  
  // Auth simulation
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState('odin_allfather');

  // Randomize on client mount to avoid hydration mismatch and SSR randomness
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mythologicalUsers.length);
      setCurrentUser(mythologicalUsers[randomIndex]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Login & Register Form Inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Write Article Inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTagsInput, setNewTagsInput] = useState('');
  const [newReadTime, setNewReadTime] = useState('5 min');
  const [writeError, setWriteError] = useState('');
  const [writeLoading, setWriteLoading] = useState(false);

  // Article Like and Share state for the detail view
  const [hasLikedCurrentArticle, setHasLikedCurrentArticle] = useState(false);
  const [copiedShareCurrentArticle, setCopiedShareCurrentArticle] = useState(false);

  // Data lists
  const [articles, setArticles] = useState<Article[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Loading & Error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Drawer Selection States
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [aiMode, setAiMode] = useState<'review' | 'explain' | 'view'>('view');
  
  const [showSnippetForm, setShowSnippetForm] = useState(false);

  // Submit Login Simulation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim()) {
      setLoginError('Por favor, informe seu nome de usuário.');
      return;
    }
    // Clean username format (separated by _ or - as per user guidelines)
    const formattedUsername = loginUsername.trim().toLowerCase().replace(/\s+/g, '_');
    setIsLoggedIn(true);
    setCurrentUser(formattedUsername);
    setCurrentScreen('home');
    // Clear inputs
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  // Submit Register Simulation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerUsername.trim()) {
      setRegisterError('Por favor, escolha um nome de usuário.');
      return;
    }
    const formattedUsername = registerUsername.trim().toLowerCase().replace(/\s+/g, '-');
    setIsLoggedIn(true);
    setCurrentUser(formattedUsername);
    setCurrentScreen('home');
    // Clear inputs
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterError('');
  };

  // Submit Write Article
  const handleWriteArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWriteLoading(true);
    setWriteError('');

    if (newTitle.length < 5) {
      setWriteError('O título deve conter pelo menos 5 caracteres.');
      setWriteLoading(false);
      return;
    }
    if (newExcerpt.length < 10) {
      setWriteError('O resumo deve conter pelo menos 10 caracteres.');
      setWriteLoading(false);
      return;
    }
    if (newContent.length < 20) {
      setWriteError('O conteúdo do artigo deve conter pelo menos 20 caracteres.');
      setWriteLoading(false);
      return;
    }

    const tags = newTagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const payload = {
      title: newTitle,
      category: newCategory,
      excerpt: newExcerpt,
      content: newContent,
      readTime: newReadTime,
      author: {
        id: 'usr-current',
        name: currentUser,
        avatarUrl: '' // Empty so it triggers the user avatar icon
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

      // Success
      setNewTitle('');
      setNewExcerpt('');
      setNewContent('');
      setNewTagsInput('');
      loadData();
      setCurrentScreen('home');
    } catch (err: any) {
      setWriteError(err.message || 'Falha ao salvar seu artigo.');
    } finally {
      setWriteLoading(false);
    }
  };

  // Fetch all initial data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [articlesRes, snippetsRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/snippets')
      ]);

      if (!articlesRes.ok || !snippetsRes.ok) {
        throw new Error('Falha ao comunicar com a Bifrost.');
      }

      const articlesData = await articlesRes.json();
      const snippetsData = await snippetsRes.json();

      setArticles(articlesData);
      setSnippets(snippetsData);
    } catch (err: any) {
      console.error(err);
      setError('A conexão com as runas de Asgard falhou. Tente atualizar a página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle Incremental Likes for Articles
  const handleLikeArticle = async (id: string) => {
    try {
      await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      // Update local state smoothly
      setArticles(prev => prev.map(art => art.id === id ? { ...art, likes: art.likes + 1 } : art));
    } catch (err) {
      console.error('Erro ao curtir artigo:', err);
    }
  };

  // Handle Incremental Stars for Snippets
  const handleStarSnippet = async (id: string) => {
    try {
      await fetch('/api/snippets/star', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      // Update local state smoothly
      setSnippets(prev => prev.map(snip => snip.id === id ? { ...snip, stars: snip.stars + 1 } : snip));
    } catch (err) {
      console.error('Erro ao favoritar snippet:', err);
    }
  };

  // Trigger quick AI review or explain from SnippetCard
  const handleAIAction = (snippet: Snippet, action: 'review' | 'explain') => {
    setSelectedSnippet(snippet);
    setAiMode(action);
  };

  // Filter lists based on search query & category selection
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredSnippets = snippets.filter(snip => {
    const matchesSearch = snip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          snip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          snip.language.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = selectedCategory === 'Todos' || 
                            snip.language.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesLanguage;
  });

  // Unique categories for list filters
  const articleCategories = ['Todos', 'Frontend', 'Backend', 'DevOps', 'Security', 'AI'];
  const snippetLanguages = ['Todos', 'TypeScript', 'Go', 'Python', 'Rust'];

  const activeFilters = activeTab === 'articles' ? articleCategories : snippetLanguages;

  return (
    <div className="min-h-screen bg-[#F3F6F9] text-[#0b2046] font-sans antialiased selection:bg-[#ff5a00]/30 selection:text-[#0b2046] pb-12">
      
      {/* 1. TOP TICKER OR STATS HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center hover:opacity-90 transition-opacity cursor-pointer text-left font-black"
          >
            <div className="w-9 h-9 rounded-none bg-[#ff5a00] flex items-center justify-center text-white font-black text-xl shadow-md select-none">
              B
            </div>
          </button>

          {/* Quick Actions & Auth */}
          <div className="flex items-center space-x-3">

            {isLoggedIn ? (
              <div className="flex items-center space-x-3 pl-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <User size={16} />
                  </div>
                  <div className="text-left leading-none">
                    <span className="text-xs text-[#0b2046] font-bold block mt-0.5">{currentUser}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setCurrentScreen('home');
                  }}
                  className="text-[10px] md:text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-none transition-colors cursor-pointer"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-3">
                <button
                  onClick={() => setCurrentScreen('login')}
                  className="flex items-center space-x-1 text-xs font-bold text-[#0b2046] hover:text-[#ff5a00] px-3 py-1.5 rounded-none hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Entrar</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('register')}
                  className="flex items-center space-x-1 text-xs font-bold text-white bg-[#ff5a00] hover:bg-[#ff7a2e] px-3 py-1.5 rounded-none shadow-sm transition-colors cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Cadastrar</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAJESTIC HERO SECTION (Inspirado no compramososeucarro.pt) */}
      {currentScreen === 'home' && (
        <section className="relative overflow-hidden bg-[#0b2046] py-14 md:py-18 border-b-4 border-[#ff5a00]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#ff5a00]/10 via-transparent to-transparent opacity-70 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center px-4 md:px-6 relative z-10 space-y-4 md:space-y-6">

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Escreva Artigos e Compartilhe Conhecimento <span className="text-[#ff5a00]">Sem Custos e na Hora!</span>
            </h2>
            
            <p className="text-xs md:text-sm lg:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Publique seus artigos de forma simples e rápida com título, subtítulo e texto comum, alcançando milhares de leitores interessados.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginError('Por favor, faça login ou cadastre-se para publicar um artigo.');
                    setCurrentScreen('login');
                  } else {
                    setNewTitle('');
                    setNewCategory('Frontend');
                    setNewExcerpt('');
                    setNewContent('');
                    setNewTagsInput('');
                    setWriteError('');
                    setCurrentScreen('write-article');
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 text-xs md:text-sm font-extrabold bg-[#ff5a00] text-white px-7 py-3 rounded-none hover:bg-[#ff7a2e] hover:shadow-[0_0_20px_rgba(255,90,0,0.45)] hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wider cursor-pointer"
              >
                <Plus size={16} />
                <span>Publicar Artigo Grátis</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. CORE INTERACTIVE HUB */}
      <main id="explore-anchor" className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 flex-1">
        
        {currentScreen === 'home' && (
          <>
            {/* Navigation Tabs Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
              
              {/* Main title */}
              <div className="flex items-center space-x-2 px-1">
                <BookOpen className="text-[#ff5a00]" size={20} />
                <h3 className="text-base md:text-lg font-bold text-[#0b2046]">Artigos Publicados</h3>
              </div>

              {/* Search box */}
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#52667d]" />
                <input 
                  type="text" 
                  placeholder="Buscar artigos, tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 rounded-none pl-10 pr-4 py-2.5 text-xs md:text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 shadow-sm"
                />
              </div>

            </div>

            {/* Categories/Languages filters banner */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none scroll-smooth">
              {articleCategories.map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedCategory(filter)}
                  className={`text-xs px-3.5 py-1.5 rounded-none transition-all duration-200 shrink-0 cursor-pointer ${
                    selectedCategory === filter
                      ? 'bg-[#ff5a00] text-[#fff] font-bold shadow-sm'
                      : 'bg-slate-200/60 text-[#52667d] hover:bg-slate-200 hover:text-[#0b2046]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Global Loading state */}
            {loading && (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 rounded-none border-2 border-[#ff5a00]/20 border-t-[#ff5a00] animate-spin" />
                <p className="text-xs text-[#52667d] font-mono uppercase tracking-widest animate-pulse font-semibold">Consultando as Runas...</p>
              </div>
            )}

            {/* Global Error Display */}
            {error && !loading && (
              <div className="p-5 max-w-lg mx-auto rounded-none bg-red-50 border border-red-200 text-center space-y-3 shadow-sm">
                <p className="text-sm text-red-600 font-medium">{error}</p>
                <button 
                  onClick={loadData}
                  className="text-xs font-semibold text-white bg-[#0b2046] px-4 py-2 rounded-none hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Recarregar Bifrost
                </button>
              </div>
            )}

            {/* 4. ARTICLES VIEW GRID */}
            {!loading && !error && activeTab === 'articles' && (
              <>
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-16 space-y-3 border border-dashed border-slate-200 rounded-none bg-white shadow-sm">
                    <Terminal className="mx-auto text-slate-400 mb-2" size={32} />
                    <h4 className="text-md font-bold text-[#0b2046]">Nenhum artigo encontrado</h4>
                    <p className="text-xs text-[#52667d] max-w-xs mx-auto">Nenhum guerreiro registrou ensinamentos sob esta categoria ou termo ainda.</p>
                    <button 
                      onClick={() => {
                        if (!isLoggedIn) {
                          setLoginError('Por favor, faça login para escrever um artigo.');
                          setCurrentScreen('login');
                        } else {
                          setNewTitle('');
                          setNewCategory('Frontend');
                          setNewExcerpt('');
                          setNewContent('');
                          setNewTagsInput('');
                          setWriteError('');
                          setCurrentScreen('write-article');
                        }
                      }}
                      className="mt-4 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff7a2e] px-5 py-2.5 rounded-none transition-all shadow-sm cursor-pointer"
                    >
                      Escrever Novo Artigo
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map(article => (
                      <div key={article.id} className="h-full">
                        <ArticleCard 
                          article={article}
                          onSelect={(art) => {
                            setSelectedArticle(art);
                            setHasLikedCurrentArticle(false);
                            setCopiedShareCurrentArticle(false);
                            setCurrentScreen('article-detail');
                          }}
                          onLike={handleLikeArticle}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* INLINE ARTICLE DETAIL VIEW */}
        {currentScreen === 'article-detail' && selectedArticle && (
          <div className="max-w-3xl mx-auto bg-white border-0 rounded-none shadow-xl overflow-hidden animate-fade-in p-6 md:p-10">
            {/* Integrated minimal Back button and category inside the A4 Sheet top bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-[#0b2046] hover:text-[#ff5a00] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar para Artigos</span>
              </button>
              <span className="text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-none bg-slate-100 text-[#0b2046] uppercase tracking-widest font-mono">
                {selectedArticle.category}
              </span>
            </div>

            {/* Banner/Header Info */}
            <div className="pb-6 border-b border-slate-100">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0b2046] tracking-tight leading-tight mt-2">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-[#0b2046] text-xs font-mono">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mr-2">
                    <User size={12} />
                  </div>
                  <span className="text-[#0b2046] font-sans font-bold">{selectedArticle.author.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar size={12} className="mr-1.5 text-[#ff5a00]" />
                  <span className="text-[#0b2046] font-bold">{new Date(selectedArticle.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center">
                  <BookOpen size={12} className="mr-1.5 text-[#ff5a00]" />
                  <span className="text-[#0b2046] font-bold">{selectedArticle.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Body (Markdown rendered) */}
            <div className="py-6 md:py-8 bg-white prose prose-slate max-w-none text-black font-medium leading-relaxed">
              <MarkdownRenderer content={selectedArticle.content} />
              
              {/* Related Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
                {selectedArticle.tags.map(tag => (
                  <span key={tag} className="text-xs font-mono px-3 py-1 rounded-none bg-slate-100 text-[#0b2046] font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (hasLikedCurrentArticle) return;
                  handleLikeArticle(selectedArticle.id);
                  setHasLikedCurrentArticle(true);
                  // Update likesCount inside current selectedArticle
                  setSelectedArticle(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
                }}
                disabled={hasLikedCurrentArticle}
                className={`flex items-center space-x-2 text-xs md:text-sm font-bold px-5 py-2.5 rounded-none transition-all cursor-pointer ${
                  hasLikedCurrentArticle 
                    ? 'bg-[#ff5a00]/10 text-[#ff5a00]' 
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0b2046] hover:text-[#ff5a00]'
                }`}
              >
                <ThumbsUp size={14} className={hasLikedCurrentArticle ? 'scale-110' : ''} />
                <span>{hasLikedCurrentArticle ? 'Curtido!' : 'Curtir'} ({selectedArticle.likes})</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedShareCurrentArticle(true);
                  setTimeout(() => setCopiedShareCurrentArticle(false), 2000);
                }}
                className="flex items-center space-x-2 text-xs md:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-[#0b2046] px-5 py-2.5 rounded-none transition-colors cursor-pointer shadow-sm"
              >
                <Share2 size={14} />
                <span>{copiedShareCurrentArticle ? 'Link Copiado!' : 'Compartilhar'}</span>
              </button>
            </div>
          </div>
        )}

        {/* INLINE WRITE ARTICLE SCREEN */}
        {currentScreen === 'write-article' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-none p-6 md:p-10 animate-fade-in">
            {/* Integrated minimal Back button inside the A4 Sheet top bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-[#0b2046] hover:text-[#ff5a00] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar para Artigos</span>
              </button>
              <span className="text-[10px] font-mono text-[#ff5a00] uppercase tracking-widest font-bold">Novo Artigo</span>
            </div>

            <form onSubmit={handleWriteArticleSubmit} className="space-y-4">
              {writeError && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 text-red-600 text-xs rounded-none">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{writeError}</span>
                </div>
              )}

              {/* Title and Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Título</label>
                  <input 
                    type="text"
                    placeholder="Título do artigo"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all placeholder-slate-400 font-medium"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all cursor-pointer font-medium"
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
                  <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Tempo de Leitura</label>
                  <input 
                    type="text"
                    placeholder="Tempo de leitura"
                    value={newReadTime}
                    onChange={e => setNewReadTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all placeholder-slate-400 font-medium"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Tags</label>
                  <input 
                    type="text"
                    placeholder="Tags separadas por vírgula"
                    value={newTagsInput}
                    onChange={e => setNewTagsInput(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Resumo</label>
                <input 
                  type="text"
                  placeholder="Breve resumo do artigo"
                  value={newExcerpt}
                  onChange={e => setNewExcerpt(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-sans">Conteúdo</label>
                <textarea 
                  rows={12}
                  placeholder="Escreva seu artigo aqui usando o formato Markdown (.md)..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-none px-4 py-3 text-sm text-[#0b2046] focus:bg-white focus:border-2 focus:border-[#ff5a00] focus:ring-0 focus:outline-none transition-all leading-relaxed resize-y placeholder-slate-400 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('home')}
                  className="text-xs md:text-sm font-bold text-[#0b2046] hover:text-[#ff5a00] bg-slate-100 hover:bg-slate-200 rounded-none px-5 py-2.5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={writeLoading}
                  className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-white bg-[#ff5a00] hover:bg-[#ff7a2e] disabled:opacity-50 rounded-none px-5 py-2.5 transition-all cursor-pointer"
                >
                  <Send size={14} />
                  <span>{writeLoading ? 'Publicando...' : 'Publicar Artigo'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* INLINE LOGIN SCREEN */}
        {currentScreen === 'login' && (
          <div className="max-w-md mx-auto bg-white border-0 rounded-none shadow-xl p-6 md:p-10 animate-fade-in">
            {/* Integrated minimal Back button inside the A4 Sheet top bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-[#0b2046] hover:text-[#ff5a00] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar</span>
              </button>
              <span className="text-[10px] font-mono text-[#ff5a00] uppercase tracking-widest font-bold">Identificação</span>
            </div>

            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-[#ff5a00]/10 text-[#ff5a00] rounded-none flex items-center justify-center mx-auto mb-3">
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0b2046]">Acesse a Bifrost</h3>
              <p className="text-xs text-[#0b2046] mt-1 font-bold">Conecte-se para publicar artigos e compartilhar conhecimento.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 text-red-600 text-xs rounded-none">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-mono">Nome de Usuário</label>
                <input 
                  type="text"
                  placeholder="Ex: odin_allfather, thor-thunder..."
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  required
                  className="w-full bg-slate-50 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-mono">Senha</label>
                <input 
                  type="password"
                  placeholder="Sua senha rúnica"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ff5a00] hover:bg-[#ff7a2e] text-white text-xs md:text-sm font-bold rounded-none transition-all cursor-pointer"
              >
                Entrar na Guilda
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs">
              <span className="text-[#0b2046] font-semibold">Não possui registro? </span>
              <button 
                onClick={() => {
                  setRegisterError('');
                  setCurrentScreen('register');
                }}
                className="text-[#ff5a00] font-bold hover:underline cursor-pointer"
              >
                Criar uma conta nova
              </button>
            </div>
          </div>
        )}

        {/* INLINE REGISTER SCREEN */}
        {currentScreen === 'register' && (
          <div className="max-w-md mx-auto bg-white border-0 rounded-none shadow-xl p-6 md:p-10 animate-fade-in">
            {/* Integrated minimal Back button inside the A4 Sheet top bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="flex items-center space-x-1.5 text-xs md:text-sm font-bold text-[#0b2046] hover:text-[#ff5a00] transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Voltar</span>
              </button>
              <span className="text-[10px] font-mono text-[#ff5a00] uppercase tracking-widest font-bold">Cadastro</span>
            </div>

            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-[#ff5a00]/10 text-[#ff5a00] rounded-none flex items-center justify-center mx-auto mb-3">
                <UserPlus size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0b2046]">Registro de Novo Membro</h3>
              <p className="text-xs text-[#0b2046] mt-1 font-bold">Inscreva-se para contribuir com novos artigos e ensinamentos.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {registerError && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 text-red-600 text-xs rounded-none">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{registerError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-mono">Nome de Usuário</label>
                <input 
                  type="text"
                  placeholder="Ex: loki_trickster, freya-nordic..."
                  value={registerUsername}
                  onChange={e => setRegisterUsername(e.target.value)}
                  required
                  className="w-full bg-slate-50 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-mono">E-mail</label>
                <input 
                  type="email"
                  placeholder="Ex: odin@asgard.com"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b2046] uppercase tracking-wider font-mono">Senha</label>
                <input 
                  type="password"
                  placeholder="Defina sua senha de acesso"
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 rounded-none px-4 py-2.5 text-sm text-[#0b2046] focus:ring-1 focus:ring-[#ff5a00]/20 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#ff5a00] hover:bg-[#ff7a2e] text-white text-xs md:text-sm font-bold rounded-none transition-all cursor-pointer"
              >
                Criar Minha Conta
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs">
              <span className="text-[#0b2046] font-semibold">Já possui uma conta? </span>
              <button 
                onClick={() => {
                  setLoginError('');
                  setCurrentScreen('login');
                }}
                className="text-[#ff5a00] font-bold hover:underline cursor-pointer"
              >
                Fazer login
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 6. MODALS AND DETAILS DRAWERS */}
      {selectedSnippet && (
        <CodeReviewPanel 
          snippet={selectedSnippet}
          initialMode={aiMode}
          onClose={() => {
            setSelectedSnippet(null);
            setAiMode('view');
          }}
        />
      )}

      {/* 7. SIMPLE FOOTER */}
      <footer className="bg-[#0b2046] text-slate-300 border-t border-[#ff5a00] mt-16 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-[#ff5a00] tracking-wider">BIFROST</p>
            <p className="mt-1 text-slate-400">© 2026 Bifrost. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Bifrost API</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
