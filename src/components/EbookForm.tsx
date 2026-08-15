import React from 'react';
import { EbookInput, EbookGenre, UserProfile } from '../types';
import { Sparkles, BookOpen, User, ListFilter, Hash, FileText, MessageSquareQuote, ArrowRight, Crown, AlertCircle } from 'lucide-react';
import { getUserPlanLimits } from '../constants/plans';

interface EbookFormProps {
  input: EbookInput;
  onChange: (input: EbookInput) => void;
  onSubmit: () => void;
  onLoadExample: () => void;
  isGenerating: boolean;
  userProfile: UserProfile | null;
  onOpenPlans?: () => void;
}

const GENRE_OPTIONS: EbookGenre[] = [
  'Autoajuda',
  'Ficção',
  'Romance',
  'Biografia',
  'Espiritualidade/Religião',
  'Desenvolvimento Pessoal',
  'Negócios e Carreira',
  'Educação e Didático',
  'Filosofia e Ensaios',
  'Outro',
];

export const EbookForm: React.FC<EbookFormProps> = ({
  input,
  onChange,
  onSubmit,
  onLoadExample,
  isGenerating,
  userProfile,
  onOpenPlans,
}) => {
  const userLimits = getUserPlanLimits(userProfile);

  const handleChange = (field: keyof EbookInput, value: any) => {
    onChange({
      ...input,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div id="ebook-form-container" className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 md:p-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Parâmetros de Geração do E-book
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Preencha os detalhes abaixo para a Inteligência Artificial estruturar e escrever a obra completa.
          </p>
        </div>

        {/* Preset Button */}
        <button
          type="button"
          id="btn-fill-example"
          onClick={onLoadExample}
          disabled={isGenerating}
          className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Preencher Exemplo</span>
        </button>
      </div>

      {/* Plan Limits Info Bar */}
      <div className="mb-6 bg-slate-900 text-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-white">{userLimits.name}</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                {userLimits.badge}
              </span>
              {userProfile && userProfile.role !== 'admin' && userProfile.planExpiresAt && (
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                  Validade: {Math.max(0, Math.ceil((new Date(userProfile.planExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} dias
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Limites: <strong className="text-amber-300">{userLimits.maxChapters} cap.</strong>/livro • <strong className="text-amber-300">{userLimits.maxWordsPerChapter} pal.</strong>/cap. • <strong className="text-amber-300">1 e-book/dia</strong>
            </p>
          </div>
        </div>

        {onOpenPlans && (
          <button
            type="button"
            onClick={onOpenPlans}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 self-start sm:self-auto"
          >
            Ver Planos & Upgrades
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Título / Tema */}
          <div className="md:col-span-2 space-y-2">
            <label id="lbl-title" htmlFor="input-title" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
              <span>Título / Tema do E-book</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="input-title"
                type="text"
                required
                value={input.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Preparados no Deserto: Identidade, Foco e Vencendo as Primeiras Tentações"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-400">Pode incluir referências, base de capítulos ou livros de apoio.</p>
          </div>

          {/* 2. Autor */}
          <div className="space-y-2">
            <label id="lbl-author" htmlFor="input-author" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
              <span>Autor</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="input-author"
                type="text"
                required
                value={input.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Ex: Professor Luz e Letras"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 text-sm transition-all"
              />
            </div>
          </div>

          {/* 3. Tipo (Dropdown) */}
          <div className="space-y-2">
            <label id="lbl-genre" htmlFor="select-genre" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">3</span>
              <span>Tipo / Gênero</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <ListFilter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <select
                id="select-genre"
                value={input.genre}
                onChange={(e) => handleChange('genre', e.target.value as EbookGenre)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 text-sm transition-all bg-white appearance-none cursor-pointer"
              >
                {GENRE_OPTIONS.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Número de Capítulos */}
          <div className="space-y-2">
            <label id="lbl-chapters-count" htmlFor="input-chapters" className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">4</span>
                <span>Número de Capítulos</span>
                <span className="text-red-500">*</span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Máx. {userLimits.maxChapters} no seu plano
              </span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="input-chapters"
                type="number"
                min={1}
                max={userLimits.maxChapters}
                required
                value={input.chaptersCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  handleChange('chaptersCount', Math.min(userLimits.maxChapters, Math.max(1, val)));
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 text-sm transition-all"
              />
            </div>
            {input.chaptersCount >= userLimits.maxChapters && (
              <p className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Limite máximo do seu plano ({userLimits.maxChapters} cap.). {onOpenPlans && <button type="button" onClick={onOpenPlans} className="underline font-bold hover:text-amber-900">Aumentar com Upgrade</button>}</span>
              </p>
            )}
          </div>

          {/* 5. Número aproximado de palavras por capítulo */}
          <div className="space-y-2">
            <label id="lbl-words-per-chapter" htmlFor="input-words" className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">5</span>
                <span>Palavras p/ Capítulo</span>
                <span className="text-red-500">*</span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Máx. {userLimits.maxWordsPerChapter} no seu plano
              </span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="input-words"
                type="number"
                min={200}
                max={userLimits.maxWordsPerChapter}
                step={50}
                required
                value={input.targetWordsPerChapter}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 300;
                  handleChange('targetWordsPerChapter', Math.min(userLimits.maxWordsPerChapter, Math.max(200, val)));
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-400">
              Total estimado no e-book: ~{(input.chaptersCount * input.targetWordsPerChapter).toLocaleString()} palavras.
            </p>
          </div>

          {/* 6. Observações que a I.A. deve seguir para a produção */}
          <div className="md:col-span-2 space-y-2">
            <label id="lbl-instructions" htmlFor="input-instructions" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">6</span>
              <span>Observações que a I.A. deve seguir para a produção</span>
            </label>
            <div className="relative">
              <MessageSquareQuote className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                id="input-instructions"
                rows={4}
                value={input.instructions}
                onChange={(e) => handleChange('instructions', e.target.value)}
                placeholder="Descreva o foco principal do e-book, tom de voz, passagens bíblicas, histórias ou ensinamentos específicos que devem estar presentes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-900 placeholder-slate-400 text-sm transition-all resize-y"
              />
            </div>
            <p className="text-xs text-slate-400">
              Forneça orientações sobre estilo, conceitos a enfatizar, exercícios práticos ou direcionamento do enredo.
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            id="btn-submit-generate"
            disabled={isGenerating || !input.title.trim()}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gerando Estrutura do E-book...</span>
              </>
            ) : (
              <>
                <span>Gerar Estrutura e Sumário</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
