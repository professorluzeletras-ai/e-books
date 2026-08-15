import React from 'react';
import { BookOpen, Download, Copy, Printer, FileText, Sparkles, RefreshCw, ShieldCheck, UserCheck, LogOut, LogIn, Library, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  hasContent: boolean;
  onExportTxt: () => void;
  onExportMd: () => void;
  onExportHtml: () => void;
  onCopyMarkdown: () => void;
  onPrint: () => void;
  onNewEbook: () => void;
  onLoadExample: () => void;
  isGenerating: boolean;
  onOpenAuth: () => void;
  onOpenMyEbooks: () => void;
  onOpenAdminPanel: () => void;
  onOpenPlans?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasContent,
  onExportTxt,
  onExportMd,
  onExportHtml,
  onCopyMarkdown,
  onPrint,
  onNewEbook,
  onLoadExample,
  isGenerating,
  onOpenAuth,
  onOpenMyEbooks,
  onOpenAdminPanel,
  onOpenPlans,
}) => {
  const { user, userProfile, isAdmin, logout } = useAuth();

  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">Gerador de E-books I.A.</h1>
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Plataforma autônoma para criação, salvamento e exportação de livros
            </p>
          </div>
        </div>

        {/* Action Controls & Auth */}
        <div className="flex items-center space-x-2">
          {!hasContent && (
            <button
              id="btn-load-example-header"
              onClick={onLoadExample}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/50 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm"
              title="Preencher com o exemplo fornecido"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Exemplo</span>
            </button>
          )}

          {hasContent && (
            <>
              <button
                id="btn-new-ebook-header"
                onClick={onNewEbook}
                disabled={isGenerating}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center space-x-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Novo E-book</span>
              </button>

              {/* Export Button - TXT */}
              <button
                id="btn-export-txt"
                onClick={onExportTxt}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                title="Exportar como TXT formatado em Markdown"
              >
                <FileText className="w-4 h-4 text-slate-900" />
                <span className="hidden sm:inline">TXT</span>
              </button>

              {/* Print / Save PDF Button */}
              <button
                id="btn-print"
                onClick={onPrint}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-100 bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 rounded-lg flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
                title="Abrir em Nova Aba para Imprimir ou Salvar como PDF"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-300" />
                <span>PDF</span>
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* User Status / Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-2">
              {/* Plans & Upgrades Button */}
              {onOpenPlans && (
                <button
                  onClick={onOpenPlans}
                  className="px-3 py-1.5 text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-500/30 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Ver Níveis e Planos de Acesso"
                >
                  <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Planos</span>
                </button>
              )}

              {/* My Ebooks Button */}
              <button
                onClick={onOpenMyEbooks}
                className="px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center space-x-1.5 transition-all"
                title="Meus E-books Salvos"
              >
                <Library className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Meus Livros</span>
              </button>

              {/* Admin Button */}
              {isAdmin && (
                <button
                  onClick={onOpenAdminPanel}
                  className="px-3 py-1.5 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20"
                  title="Painel Administrativo do Sistema"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">Painel Admin</span>
                </button>
              )}

              {/* Profile Badge & Logout */}
              <div className="flex items-center space-x-1 bg-slate-950/60 border border-slate-800 p-1 rounded-xl">
                <div className="px-2 py-0.5 text-[11px] font-semibold text-slate-300 max-w-[110px] sm:max-w-[150px] truncate">
                  {userProfile?.displayName || user.email}
                </div>
                <button
                  onClick={() => logout()}
                  className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl flex items-center space-x-1.5 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
