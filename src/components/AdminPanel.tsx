import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getAllEbooks, updateUserAdminSettings, deleteEbook } from '../services/dbService';
import { UserProfile, EbookProject, UserPlanType } from '../types';
import { PLAN_PRESETS } from '../constants/plans';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Search, 
  Ban, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  X, 
  RefreshCw, 
  Eye, 
  Lock, 
  Crown,
  BarChart3,
  Calendar
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEbook: (ebook: EbookProject) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onOpenEbook }) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'ebooks'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ebooks, setEbooks] = useState<EbookProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedEbook, setSelectedEbook] = useState<EbookProject | null>(null);

  // Edit Quota modal state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newPlanType, setNewPlanType] = useState<UserPlanType>('test');
  const [newQuota, setNewQuota] = useState<number>(1);
  const [newMaxChapters, setNewMaxChapters] = useState<number>(2);
  const [newMaxWordsPerChapter, setNewMaxWordsPerChapter] = useState<number>(500);
  const [newCanExport, setNewCanExport] = useState<boolean>(false);
  const [newValidityDays, setNewValidityDays] = useState<number>(30);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uList, eList] = await Promise.all([getAllUsers(), getAllEbooks()]);
      setUsers(uList);
      setEbooks(eList);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen || !isAdmin) return null;

  const handleToggleStatus = async (user: UserProfile) => {
    const nextStatus = user.status === 'active' ? 'blocked' : 'active';
    const confirmMsg = user.status === 'active' 
      ? `Tem certeza que deseja BLOQUEAR o usuário ${user.email}? Ele não poderá mais criar livros.`
      : `Deseja REATIVAR o acesso de ${user.email}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await updateUserAdminSettings(user.uid, { status: nextStatus });
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, status: nextStatus } : u));
    } catch (err) {
      alert('Erro ao atualizar status do usuário.');
    }
  };

  const handleSaveQuota = async () => {
    if (!editingUser) return;
    try {
      const calculatedExpiresAt = new Date(Date.now() + newValidityDays * 24 * 60 * 60 * 1000).toISOString();

      await updateUserAdminSettings(editingUser.uid, { 
        planType: newPlanType,
        maxEbooksQuota: newQuota,
        maxChapters: newMaxChapters,
        maxWordsPerChapter: newMaxWordsPerChapter,
        canExport: newCanExport,
        planExpiresAt: calculatedExpiresAt,
      });
      setUsers(prev => prev.map(u => u.uid === editingUser.uid ? { 
        ...u, 
        planType: newPlanType,
        maxEbooksQuota: newQuota,
        maxChapters: newMaxChapters,
        maxWordsPerChapter: newMaxWordsPerChapter,
        canExport: newCanExport,
        planExpiresAt: calculatedExpiresAt,
      } : u));
      setEditingUser(null);
    } catch (err) {
      alert('Erro ao atualizar configurações do usuário.');
    }
  };

  const handleApplyPreset = (planKey: UserPlanType) => {
    setNewPlanType(planKey);
    const preset = PLAN_PRESETS[planKey];
    if (preset) {
      setNewQuota(preset.maxEbooksQuota);
      setNewMaxChapters(preset.maxChapters);
      setNewMaxWordsPerChapter(preset.maxWordsPerChapter);
      setNewCanExport(preset.canExport);
    }
  };

  const handleToggleExport = async (user: UserProfile) => {
    const nextCanExport = !(user.canExport ?? (user.role === 'admin'));
    try {
      await updateUserAdminSettings(user.uid, { canExport: nextCanExport });
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, canExport: nextCanExport } : u));
    } catch (err) {
      alert('Erro ao alterar permissão de exportação.');
    }
  };

  const handleDeleteEbookAdmin = async (ebook: EbookProject) => {
    if (!window.confirm(`Tem certeza que deseja excluir o e-book "${ebook.input.title}" do usuário ${ebook.userEmail}?`)) {
      return;
    }
    try {
      await deleteEbook(ebook.id, ebook.userId);
      setEbooks(prev => prev.filter(e => e.id !== ebook.id));
      if (selectedEbook?.id === ebook.id) setSelectedEbook(null);
    } catch (err) {
      alert('Erro ao excluir e-book.');
    }
  };

  const filteredUsers = users.filter(
    u => u.email.toLowerCase().includes(search.toLowerCase()) || 
         (u.displayName && u.displayName.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredEbooks = ebooks.filter(
    e => e.input.title.toLowerCase().includes(search.toLowerCase()) || 
         e.input.author.toLowerCase().includes(search.toLowerCase()) ||
         e.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const totalEbooksCount = ebooks.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                Painel Administrativo
                <span className="text-[10px] uppercase font-sans font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
                  Admin Master
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Controle de usuários, quotas, permissões e diretório global de e-books
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Atualizar dados"
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

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/60">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total de Usuários</p>
              <p className="text-lg font-bold text-white">{totalUsers} <span className="text-xs text-emerald-400 font-normal">({activeUsersCount} Ativos)</span></p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Livros Gerados no Sistema</p>
              <p className="text-lg font-bold text-white">{totalEbooksCount}</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Seu Perfil Admin</p>
              <p className="text-xs font-bold text-emerald-300 truncate">professorjoel65@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gerenciar Usuários ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('ebooks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'ebooks'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Diretório de E-books ({ebooks.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'users' ? 'Buscar usuário...' : 'Buscar e-book ou e-mail...'}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-xs">Carregando dados do servidor...</p>
            </div>
          ) : activeTab === 'users' ? (
            /* Users Table */
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Usuário</th>
                    <th className="p-3">Papel (Role)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Exportação</th>
                    <th className="p-3">Livros / Quota</th>
                    <th className="p-3">Data Cadastro</th>
                    <th className="p-3 text-right">Ações Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const userCanExport = u.role === 'admin' || u.canExport === true;
                      return (
                      <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-semibold text-white">{u.displayName || 'Sem Nome'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="p-3">
                          {u.role === 'admin' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              ADMIN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                              USUÁRIO
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {u.status === 'blocked' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center w-max space-x-1">
                              <Ban className="w-3 h-3" />
                              <span>BLOQUEADO</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center w-max space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>ATIVO</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleExport(u)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                              userCanExport
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                            }`}
                            title="Clique para alterar permissão de exportação PDF/TXT"
                          >
                            <span>{userCanExport ? 'Permitida' : 'Bloqueada'}</span>
                          </button>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-white">{u.ebooksCount || 0}</span>
                          <span className="text-slate-500"> / {u.maxEbooksQuota ?? 1} máximo</span>
                          <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                            {PLAN_PRESETS[u.planType || 'test']?.name || 'Plano Personalizado'}
                          </div>
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setNewPlanType(u.planType || 'test');
                              setNewQuota(u.maxEbooksQuota ?? 1);
                              setNewMaxChapters(u.maxChapters ?? 2);
                              setNewMaxWordsPerChapter(u.maxWordsPerChapter ?? 500);
                              setNewCanExport(u.canExport ?? (u.role === 'admin'));
                              if (u.planExpiresAt) {
                                const diffDays = Math.ceil((new Date(u.planExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                                setNewValidityDays(diffDays > 0 ? diffDays : 30);
                              } else {
                                setNewValidityDays(30);
                              }
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                            title="Alterar Plano, Quota e Permissões"
                          >
                            Editar Plano
                          </button>
                          
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                                u.status === 'active'
                                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {u.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Ebooks Table */
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Título do E-book</th>
                    <th className="p-3">Criador (E-mail)</th>
                    <th className="p-3">Gênero / Autor</th>
                    <th className="p-3">Capítulos</th>
                    <th className="p-3">Data</th>
                    <th className="p-3 text-right">Ações Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEbooks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        Nenhum e-book encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredEbooks.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white max-w-xs truncate">
                          {e.outline?.title || e.input.title}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-amber-300">
                          {e.userEmail || 'N/A'}
                        </td>
                        <td className="p-3">
                          <span className="text-slate-300 font-medium">{e.input.genre}</span>
                          <div className="text-[11px] text-slate-500">por {e.input.author}</div>
                        </td>
                        <td className="p-3 text-slate-400">
                          {e.chapters ? e.chapters.length : 0} cap.
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {e.createdAt ? new Date(e.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              onOpenEbook(e);
                              onClose();
                            }}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[11px] font-semibold border border-amber-500/30 transition-colors inline-flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Abrir</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEbookAdmin(e)}
                            className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[11px] font-semibold border border-red-500/30 transition-colors inline-flex items-center space-x-1"
                            title="Excluir do banco"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Excluir</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal to edit user quota & plan */}
        {editingUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>Gerenciar Plano do Usuário</span>
                </span>
                <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </h3>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">Usuário Selecionado:</span>
                <div className="font-bold text-slate-100 text-sm truncate">{editingUser.email}</div>
              </div>

              {/* Preset Fast Select Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Aplicar Preset de Plano Rápido:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['test', 'basic', 'pro', 'premium'] as UserPlanType[]).map((pKey) => {
                    const preset = PLAN_PRESETS[pKey];
                    const isSelected = newPlanType === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => handleApplyPreset(pKey)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {preset.maxEbooksQuota} liv. • {preset.maxChapters} cap. • {preset.maxWordsPerChapter} pal.
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Fine-Tuning */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Ajuste Fino de Limites</h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Cota de Livros:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={newQuota}
                      onChange={(e) => setNewQuota(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Máx. Capítulos:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newMaxChapters}
                      onChange={(e) => setNewMaxChapters(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Palavras/Cap.:
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={10000}
                      step={100}
                      value={newMaxWordsPerChapter}
                      onChange={(e) => setNewMaxWordsPerChapter(parseInt(e.target.value) || 300)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">
                      Validade (Dias):
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={3650}
                      value={newValidityDays}
                      onChange={(e) => setNewValidityDays(parseInt(e.target.value) || 30)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCanExport}
                      onChange={(e) => setNewCanExport(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      Permitir Exportação e Impressão (PDF / TXT / HTML)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuota}
                  className="flex-1 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
