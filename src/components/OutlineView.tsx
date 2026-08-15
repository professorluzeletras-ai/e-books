import React, { useState } from 'react';
import { EbookOutline, EbookInput } from '../types';
import { Layers, Play, RefreshCw, CheckCircle2, Edit2, Save, FileText, Sparkles, BookOpen } from 'lucide-react';

interface OutlineViewProps {
  outline: EbookOutline;
  input: EbookInput;
  onStartFullGeneration: () => void;
  onGenerateSingleChapter: (chapterNumber: number) => void;
  onRegenerateOutline: () => void;
  onUpdateOutline: (updatedOutline: EbookOutline) => void;
  isGenerating: boolean;
  completedChaptersCount: number;
}

export const OutlineView: React.FC<OutlineViewProps> = ({
  outline,
  input,
  onStartFullGeneration,
  onGenerateSingleChapter,
  onRegenerateOutline,
  onUpdateOutline,
  isGenerating,
  completedChaptersCount,
}) => {
  const [editingChapterNum, setEditingChapterNum] = useState<number | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempSummary, setTempSummary] = useState('');

  const handleEditClick = (chapterNum: number, currentTitle: string, currentSummary: string) => {
    setEditingChapterNum(chapterNum);
    setTempTitle(currentTitle);
    setTempSummary(currentSummary);
  };

  const handleSaveChapter = (chapterNum: number) => {
    const updatedChapters = outline.chapters.map((ch) => {
      if (ch.chapterNumber === chapterNum) {
        return {
          ...ch,
          title: tempTitle,
          summary: tempSummary,
        };
      }
      return ch;
    });

    onUpdateOutline({
      ...outline,
      chapters: updatedChapters,
    });
    setEditingChapterNum(null);
  };

  return (
    <div id="outline-view" className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-900 text-xs font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Estrutura Aprovada
              </span>
              <span className="text-slate-400 text-xs">{input.genre} • {outline.chapters.length} Capítulos</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              {outline.title}
            </h2>
            <p className="text-slate-300 text-sm font-medium italic">
              "{outline.subtitle}"
            </p>
            <p className="text-slate-400 text-xs pt-1">
              Por <strong className="text-slate-200">{input.author}</strong> | Meta total: ~{(outline.chapters.length * input.targetWordsPerChapter).toLocaleString()} palavras
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              id="btn-regenerate-outline"
              onClick={onRegenerateOutline}
              disabled={isGenerating}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refazer Esboço</span>
            </button>

            <button
              id="btn-start-full-gen"
              onClick={onStartFullGeneration}
              disabled={isGenerating}
              className="px-6 py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>Escrever E-book Completo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Synopsis & Intro Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Sinopse da Obra
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/50">
            {outline.synopsis}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Público-Alvo & Foco
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/50">
            {outline.targetAudience}
          </p>
        </div>
      </div>

      {/* Chapters Table of Contents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Sumário e Planejamento dos Capítulos</span>
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {completedChaptersCount} de {outline.chapters.length} capítulos produzidos
          </span>
        </div>

        <div className="space-y-3">
          {outline.chapters.map((chapter) => {
            const isEditing = editingChapterNum === chapter.chapterNumber;

            return (
              <div
                key={chapter.chapterNumber}
                id={`outline-chapter-item-${chapter.chapterNumber}`}
                className="bg-white rounded-xl border border-slate-200/80 p-4 hover:border-indigo-200 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-sm shrink-0 border border-indigo-100">
                      {chapter.chapterNumber}
                    </span>

                    {isEditing ? (
                      <div className="space-y-2 flex-1">
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="w-full text-sm font-bold text-slate-900 px-3 py-1.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-100"
                        />
                        <textarea
                          rows={2}
                          value={tempSummary}
                          onChange={(e) => setTempSummary(e.target.value)}
                          className="w-full text-xs text-slate-700 px-3 py-1.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-100"
                        />
                        <button
                          onClick={() => handleSaveChapter(chapter.chapterNumber)}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" /> Salvar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">
                            Capítulo {chapter.chapterNumber}: {chapter.title}
                          </h4>
                          {chapter.subtitle && (
                            <span className="text-xs text-slate-500 italic">({chapter.subtitle})</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {chapter.summary}
                        </p>
                        {chapter.keyPoints && chapter.keyPoints.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {chapter.keyPoints.map((point, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 text-slate-600 text-[11px] px-2 py-0.5 rounded-md border border-slate-200"
                              >
                                • {point}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditClick(chapter.chapterNumber, chapter.title, chapter.summary)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                        title="Editar Título/Resumo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onGenerateSingleChapter(chapter.chapterNumber)}
                        disabled={isGenerating}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Escrever Cap. {chapter.chapterNumber}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
