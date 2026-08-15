import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EbookProject } from '../types';
import { BookOpen, FileText, Edit3, Image, Download, Copy, Check, Clock, Eye, Layers, ChevronRight, Type, Printer, Sparkles, Play, RefreshCw } from 'lucide-react';
import { CoverGenerator } from './CoverGenerator';

interface EbookReaderProps {
  project: EbookProject;
  activeSection: string; // 'cover' | 'intro' | 'chap-1' | ... | 'conclusion' | 'full'
  onSelectSection: (sectionId: string) => void;
  onUpdateChapterContent: (chapterNumber: number, newContent: string) => void;
  onUpdateIntroContent: (newContent: string) => void;
  onUpdateConclusionContent: (newContent: string) => void;
  onExportTxt: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
  onCopyMarkdown: () => void;
  onPrint: () => void;
  onContinueGeneration?: () => void;
  onGenerateSingleChapter?: (chapterNumber: number) => void;
  isGenerating?: boolean;
}

export const EbookReader: React.FC<EbookReaderProps> = ({
  project,
  activeSection,
  onSelectSection,
  onUpdateChapterContent,
  onUpdateIntroContent,
  onUpdateConclusionContent,
  onExportTxt,
  onExportMd,
  onExportHtml,
  onCopyMarkdown,
  onPrint,
  onContinueGeneration,
  onGenerateSingleChapter,
  isGenerating = false,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'editor' | 'cover'>('preview');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readingTheme, setReadingTheme] = useState<'paper' | 'dark' | 'sepia'>('paper');
  const [copied, setCopied] = useState(false);

  // Pending chapters calculation
  const pendingChapters = project.chapters.filter((c) => !c.content || c.status !== 'completed');
  const hasPendingChapters = pendingChapters.length > 0;

  // Calculate total words
  const introWords = project.introduction ? project.introduction.trim().split(/\s+/).filter(Boolean).length : 0;
  const conclusionWords = project.conclusion ? project.conclusion.trim().split(/\s+/).filter(Boolean).length : 0;
  const chapterWords = project.chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const totalWords = introWords + conclusionWords + chapterWords;
  const estimatedReadingMinutes = Math.max(1, Math.round(totalWords / 200));

  // Assemble full book markdown string
  const getFullMarkdown = () => {
    let md = `# ${project.outline?.title || project.input.title}\n`;
    if (project.outline?.subtitle) {
      md += `*${project.outline.subtitle}*\n\n`;
    }
    md += `**Autor:** ${project.input.author}\n`;
    md += `**Gênero:** ${project.input.genre}\n\n`;
    md += `---\n\n`;

    if (project.introduction) {
      md += `${project.introduction}\n\n---\n\n`;
    }

    project.chapters.forEach((ch) => {
      if (ch.content) {
        md += `${ch.content}\n\n---\n\n`;
      }
    });

    if (project.conclusion) {
      md += `${project.conclusion}\n\n`;
    }

    return md;
  };

  // Get current content based on activeSection
  const getCurrentSectionContent = () => {
    if (activeSection === 'intro') {
      return project.introduction || '# INTRODUÇÃO\n\n*Ainda não gerada.*';
    }
    if (activeSection === 'conclusion') {
      return project.conclusion || '# CONCLUSÃO\n\n*Ainda não gerada.*';
    }
    if (activeSection === 'full') {
      return getFullMarkdown();
    }
    if (activeSection.startsWith('chap-')) {
      const chapterNum = parseInt(activeSection.replace('chap-', ''), 10);
      const chapter = project.chapters.find((c) => c.chapterNumber === chapterNum);
      return chapter?.content || `# CAPÍTULO ${chapterNum}\n\n*Conteúdo pendente.*`;
    }
    return '';
  };

  const handleContentEdit = (newVal: string) => {
    if (activeSection === 'intro') {
      onUpdateIntroContent(newVal);
    } else if (activeSection === 'conclusion') {
      onUpdateConclusionContent(newVal);
    } else if (activeSection.startsWith('chap-')) {
      const chapterNum = parseInt(activeSection.replace('chap-', ''), 10);
      onUpdateChapterContent(chapterNum, newVal);
    }
  };

  const handleCopy = () => {
    onCopyMarkdown();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  }[fontSize];

  const themeClasses = {
    paper: 'bg-white text-slate-900 border-slate-200',
    dark: 'bg-slate-900 text-slate-100 border-slate-800',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e8d7be]',
  }[readingTheme];

  return (
    <div id="ebook-reader-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 space-y-4">
        
        {/* Book Info Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {project.input.genre}
            </span>
            <h3 className="font-extrabold text-lg leading-snug line-clamp-2">
              {project.outline?.title || project.input.title}
            </h3>
            <p className="text-xs text-slate-400">Por {project.input.author}</p>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="block text-slate-400 text-[10px]">Palavras</span>
              <strong className="text-indigo-300 font-bold text-sm">{totalWords.toLocaleString()}</strong>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="block text-slate-400 text-[10px]">Tempo de Leitura</span>
              <strong className="text-amber-300 font-bold text-sm">~{estimatedReadingMinutes} min</strong>
            </div>
          </div>
        </div>

        {/* Table of Contents Drawer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider px-2 flex items-center justify-between">
            <span>Sumário da Obra</span>
            <Layers className="w-3.5 h-3.5" />
          </h4>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => onSelectSection('full')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                activeSection === 'full'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Livro Completo (Tudo)</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => onSelectSection('intro')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                activeSection === 'intro'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Introdução</span>
              {project.introduction && (
                <span className="text-[10px] text-slate-400">
                  {project.introduction.trim().split(/\s+/).filter(Boolean).length} pal.
                </span>
              )}
            </button>

            {project.chapters.map((ch) => {
              const isActive = activeSection === `chap-${ch.chapterNumber}`;
              const isDone = ch.status === 'completed' || !!ch.content;

              return (
                <button
                  key={ch.chapterNumber}
                  onClick={() => onSelectSection(`chap-${ch.chapterNumber}`)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate pr-2">
                    Cap. {ch.chapterNumber}: {ch.title}
                  </span>
                  <span className="text-[10px] opacity-70 shrink-0">
                    {ch.wordCount ? `${ch.wordCount} pal.` : isDone ? 'Pronto' : 'Pendente'}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => onSelectSection('conclusion')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                activeSection === 'conclusion'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Conclusão</span>
              {project.conclusion && (
                <span className="text-[10px] text-slate-400">
                  {project.conclusion.trim().split(/\s+/).filter(Boolean).length} pal.
                </span>
              )}
            </button>
          </nav>
        </div>

      </div>

      {/* Main Workspace (Preview / Editor / Cover) */}
      <div className="lg:col-span-9 space-y-4">
        
        {/* Pending Chapters Alert Banner */}
        {hasPendingChapters && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300">Capítulos Pendentes Detectados</h4>
                <p className="text-xs text-slate-300">
                  Este e-book possui <strong className="text-amber-300">{pendingChapters.length}</strong> capítulo(s) pendente(s) de geração. Seus capítulos anteriores estão salvos na nuvem.
                </p>
              </div>
            </div>
            {onContinueGeneration && (
              <button
                onClick={onContinueGeneration}
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isGenerating ? 'Gerando...' : 'Continuar Produção Automática'}</span>
              </button>
            )}
          </div>
        )}

        {/* Workspace Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
          
          {/* Main View Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Leitura Formatada</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'editor'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Markdown</span>
            </button>

            <button
              onClick={() => setActiveTab('cover')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'cover'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span>Capa do E-book</span>
            </button>
          </div>

          {/* Reading Preferences (Font size & theme) */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-3">
              {/* Font Size */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'sm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  title="Fonte Pequena"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'md' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  title="Fonte Média"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'lg' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  title="Fonte Grande"
                >
                  A+
                </button>
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setReadingTheme('paper')}
                  className={`w-6 h-6 rounded bg-white border border-slate-300 shadow-xs ${readingTheme === 'paper' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Tema Papel Claro"
                />
                <button
                  onClick={() => setReadingTheme('sepia')}
                  className={`w-6 h-6 rounded bg-[#fbf0d9] border border-[#e8d7be] shadow-xs ${readingTheme === 'sepia' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Tema Sépia"
                />
                <button
                  onClick={() => setReadingTheme('dark')}
                  className={`w-6 h-6 rounded bg-slate-900 border border-slate-700 shadow-xs ${readingTheme === 'dark' ? 'ring-2 ring-indigo-500' : ''}`}
                  title="Tema Noturno"
                />
              </div>
            </div>
          )}

          {/* Export / Copy Quick Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Abrir página de impressão para salvar em PDF com formatação completa"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onExportTxt}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Exportar arquivo TXT com formatação Markdown"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Baixar TXT</span>
            </button>
          </div>

        </div>

        {/* Content Body */}
        {activeTab === 'preview' && (
          <div className={`rounded-2xl border p-8 md:p-12 shadow-md transition-all ${themeClasses}`}>
            <div className={`prose max-w-none ${fontSizeClasses}`}>
              <div className="markdown-body">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {getCurrentSectionContent()}
                </Markdown>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
              <span>Editando Markdown da seção atual: <strong className="text-indigo-300">{activeSection}</strong></span>
              <span>Edição em tempo real habilitada</span>
            </div>
            <textarea
              value={getCurrentSectionContent()}
              onChange={(e) => handleContentEdit(e.target.value)}
              rows={24}
              className="w-full bg-slate-950 text-slate-100 font-mono text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
              placeholder="Digite ou edite o código Markdown aqui..."
            />
          </div>
        )}

        {activeTab === 'cover' && (
          <CoverGenerator project={project} />
        )}

      </div>

    </div>
  );
};
