import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserEbooks, deleteEbook } from '../services/dbService';
import { EbookProject } from '../types';
import { BookOpen, Calendar, Trash2, Eye, PlusCircle, RefreshCw, X, Sparkles } from 'lucide-react';

interface UserEbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEbook: (ebook: EbookProject) => void;
  onNewEbookClick: () => void;
}

export const UserEbooksModal: React.FC<UserEbooksModalProps> = ({
  isOpen,
  onClose,
  onOpenEbook,
  onNewEbookClick,
}) => {
  const { user, userProfile } = useAuth();
  const [ebooks, setEbooks] = useState<EbookProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEbooks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await getUserEbooks(user.uid);
      setEbooks(list);
    } catch (err) {
      console.error('Error fetching user ebooks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchEbooks();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleDelete = async (ebook: EbookProject, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (!window.confirm(`Deseja realmente excluir o e-book "${ebook.input.title}"? Esta ação é irreversível.`)) {
      return;
    }

    try {
      await deleteEbook(ebook.id, user.uid);
      setEbooks(prev => prev.filter(item => item.id !== ebook.id));
    } catch (err) {
      alert('Erro ao excluir e-book.');
    }
  };

  const quota = userProfile?.maxEbooksQuota || 5;
  const usedCount = ebooks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Meus E-books Criados</h2>
              <p className="text-xs text-slate-400">
                Seus livros estão salvos com segurança na sua conta ({usedCount} de {quota} utilizados)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchEbooks}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
              <p className="text-xs">Buscando seus livros salvos...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Nenhum e-book criado ainda</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Você ainda não possui nenhum e-book gerado na sua conta. Comece agora a criar seu primeiro livro em formato profissional!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNewEbookClick();
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all active:scale-95 inline-flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Criar Meu Primeiro E-book</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ebooks.map((ebook) => (
                <div
                  key={ebook.id}
                  onClick={() => {
                    onOpenEbook(ebook);
                    onClose();
                  }}
                  className="bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between relative shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        {ebook.input.genre}
                      </span>
                      <button
                        onClick={(e) => handleDelete(ebook, e)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors"
                        title="Excluir este livro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {ebook.outline?.title || ebook.input.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">por {ebook.input.author}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(ebook.updatedAt).toLocaleDateString('pt-BR')}</span>
                    </span>

                    <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Livro</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Cota da Conta: <strong className="text-amber-400">{usedCount} / {quota}</strong> livros utilizados
          </p>
          <button
            onClick={() => {
              onClose();
              onNewEbookClick();
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo E-book</span>
          </button>
        </div>

      </div>
    </div>
  );
};
