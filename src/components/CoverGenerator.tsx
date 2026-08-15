import React, { useState } from 'react';
import { EbookProject } from '../types';
import { BookOpen, Sparkles, Palette, Download } from 'lucide-react';

interface CoverGeneratorProps {
  project: EbookProject;
}

type CoverTheme = 'spiritual' | 'classic' | 'modern' | 'dark-gold' | 'minimal';

export const CoverGenerator: React.FC<CoverGeneratorProps> = ({ project }) => {
  const [theme, setTheme] = useState<CoverTheme>('spiritual');

  const title = project.outline?.title || project.input.title;
  const subtitle = project.outline?.subtitle || '';
  const author = project.input.author;
  const genre = project.input.genre;

  const themeStyles = {
    spiritual: {
      container: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-amber-100 border-amber-500/30',
      accent: 'border-amber-400/40 text-amber-300',
      badge: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
      title: 'font-serif text-amber-100 drop-shadow-md',
      subtitle: 'text-amber-200/80 font-sans',
      author: 'text-amber-300 font-serif tracking-widest',
    },
    classic: {
      container: 'bg-[#1a2e23] text-[#e8ded1] border-[#c9b086]',
      accent: 'border-[#c9b086] text-[#c9b086]',
      badge: 'bg-[#c9b086]/20 text-[#e8ded1] border-[#c9b086]/40',
      title: 'font-serif text-[#f2eafe] drop-shadow',
      subtitle: 'text-[#e8ded1]/90 font-serif italic',
      author: 'text-[#c9b086] font-serif uppercase tracking-widest',
    },
    modern: {
      container: 'bg-gradient-to-tr from-blue-900 via-slate-900 to-indigo-900 text-white border-blue-500/30',
      accent: 'border-blue-400 text-blue-300',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      title: 'font-sans font-black tracking-tight text-white',
      subtitle: 'text-blue-100 font-sans',
      author: 'text-blue-300 font-semibold tracking-wider',
    },
    'dark-gold': {
      container: 'bg-stone-950 text-amber-200 border-amber-500/40',
      accent: 'border-amber-500 text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      title: 'font-serif text-amber-100 tracking-wide',
      subtitle: 'text-amber-300/80 italic',
      author: 'text-amber-400 font-serif tracking-widest uppercase',
    },
    minimal: {
      container: 'bg-slate-50 text-slate-900 border-slate-300',
      accent: 'border-slate-800 text-slate-800',
      badge: 'bg-slate-200 text-slate-800 border-slate-300',
      title: 'font-sans font-extrabold text-slate-900',
      subtitle: 'text-slate-600 font-sans',
      author: 'text-slate-800 font-bold uppercase tracking-widest',
    },
  }[theme];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <span>Design da Capa do E-book</span>
          </h3>
          <p className="text-xs text-slate-500">
            Escolha um tema visual para a capa de apresentação do seu livro.
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex flex-wrap gap-2">
          {(['spiritual', 'classic', 'modern', 'dark-gold', 'minimal'] as CoverTheme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                theme === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t === 'spiritual' ? 'Espiritual/Deserto' : t === 'dark-gold' ? 'Ouro Negro' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Book Mockup Frame */}
      <div className="flex justify-center py-6 bg-slate-100/70 rounded-2xl border border-slate-200/60">
        
        {/* Book Cover Container */}
        <div className={`w-[320px] sm:w-[380px] h-[520px] rounded-2xl p-8 flex flex-col justify-between shadow-2xl border-2 relative overflow-hidden transition-all duration-300 ${themeStyles.container}`}>
          
          {/* Subtle Decorative Pattern Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

          {/* Top Section */}
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${themeStyles.badge}`}>
                {genre}
              </span>
              <BookOpen className="w-5 h-5 opacity-80" />
            </div>

            <div className={`w-12 h-1 border-t-2 ${themeStyles.accent}`} />
          </div>

          {/* Middle Title Section */}
          <div className="space-y-4 my-auto relative z-10 text-center px-2">
            <h1 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${themeStyles.title}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${themeStyles.subtitle}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom Author Section */}
          <div className="pt-6 border-t border-white/10 text-center space-y-1 relative z-10">
            <span className="text-[10px] uppercase tracking-widest opacity-60 block">E-book Escrito por</span>
            <p className={`text-sm font-extrabold ${themeStyles.author}`}>
              {author}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
