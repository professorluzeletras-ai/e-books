import React from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Pause, Play } from 'lucide-react';

interface ChapterGeneratorProgressProps {
  currentStepName: string;
  completedCount: number;
  totalCount: number;
  totalWordsGenerated: number;
  isPaused: boolean;
  onTogglePause: () => void;
  logs: string[];
}

export const ChapterGeneratorProgress: React.FC<ChapterGeneratorProgressProps> = ({
  currentStepName,
  completedCount,
  totalCount,
  totalWordsGenerated,
  isPaused,
  onTogglePause,
  logs,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / Math.max(1, totalCount)) * 100));

  return (
    <div id="generation-progress" className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-indigo-500/30 space-y-5 animate-fadeIn">
      
      {/* Top Status Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span>Produzindo Conteúdo do E-book</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {percentage}% Concluído
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Etapa atual: <strong className="text-amber-300 font-semibold">{currentStepName}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onTogglePause}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Continuar</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pausar</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>{completedCount} de {totalCount} seções prontas</span>
          <span>~{totalWordsGenerated.toLocaleString()} palavras geradas</span>
        </div>
      </div>

      {/* Console Logs / Live updates */}
      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 font-mono text-xs max-h-28 overflow-y-auto space-y-1 text-slate-300 scrollbar-thin">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">Iniciando comunicação com o modelo Gemini...</p>
        ) : (
          logs.slice(-5).map((log, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-indigo-400 shrink-0">›</span>
              <span className="leading-tight">{log}</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
