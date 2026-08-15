import React from 'react';
import { X, Check, Sparkles, Zap, Shield, ArrowRight, MessageCircle, Crown, Lock, QrCode } from 'lucide-react';
import { PLAN_PRESETS, getUserPlanLimits, PlanDefinition } from '../constants/plans';
import { UserProfile } from '../types';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSelectPlanForPix?: (plan: PlanDefinition) => void;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSelectPlanForPix,
}) => {
  if (!isOpen) return null;

  const currentLimits = getUserPlanLimits(userProfile);
  const userEmail = userProfile?.email || 'Visitante';

  const handleWhatsAppUpgrade = (planName: string) => {
    const text = encodeURIComponent(
      `Olá! Gostaria de fazer upgrade da minha conta no Luz e Letras / Meulivro.top para o ${planName}.\nE-mail da conta: ${userEmail}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5517991919991&text=${text}`, '_blank');
  };

  const plans = [
    PLAN_PRESETS.test,
    PLAN_PRESETS.basic,
    PLAN_PRESETS.pro,
    PLAN_PRESETS.premium,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 my-8 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Níveis de Acesso & Planos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Desbloqueie todo o potencial da I.A. para seus E-books
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Aumente o número de e-books, quantidade de capítulos, limite de palavras e libere a exportação em PDF e TXT.
          </p>
        </div>

        {/* Current Plan Summary Card */}
        {userProfile && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Seu Plano Ativo</span>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{currentLimits.name}</span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                    {currentLimits.badge}
                  </span>
                </h4>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-300 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Quota Livros</span>
                <span className="font-bold text-white">{userProfile.ebooksCount || 0} / {currentLimits.maxEbooksQuota}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Máx. Capítulos</span>
                <span className="font-bold text-white">{currentLimits.maxChapters} cap.</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-slate-500 block">Palavras/Cap.</span>
                <span className="font-bold text-white">{currentLimits.maxWordsPerChapter} pal.</span>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentLimits.planType === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-5 transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/80 to-slate-900 border-2 border-indigo-500/80 shadow-xl shadow-indigo-500/10'
                    : isCurrentPlan
                    ? 'bg-slate-900 border-2 border-emerald-500/80'
                    : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black rounded-full shadow-md uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-base text-white">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                        Ativo
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-black text-white">{plan.price}</span>
                    {plan.price !== 'Grátis' && <span className="text-xs text-slate-400"> / e-book ou pacote</span>}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="h-px bg-slate-800/80 my-3" />

                  {/* Specs Highlights */}
                  <div className="space-y-2 mb-6 text-xs">
                    <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400">E-books:</span>
                      <span className="font-bold text-amber-400">{plan.maxEbooksQuota} livro(s)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400">Capítulos:</span>
                      <span className="font-bold text-amber-400">Até {plan.maxChapters} por livro</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400">Palavras/Cap.:</span>
                      <span className="font-bold text-amber-400">Até {plan.maxWordsPerChapter} pal.</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                      <span className="text-slate-400">Exportação PDF:</span>
                      <span className={`font-bold ${plan.canExport ? 'text-emerald-400' : 'text-red-400 flex items-center gap-1'}`}>
                        {plan.canExport ? 'Liberada' : <><Lock className="w-3 h-3" /> Bloqueada</>}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Buttons */}
                <div>
                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-default text-center"
                    >
                      Seu Plano Atual
                    </button>
                  ) : plan.id === 'test' ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 font-bold text-xs cursor-default text-center"
                    >
                      Incluso no Cadastro
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          if (onSelectPlanForPix) {
                            onSelectPlanForPix(plan);
                          } else {
                            handleWhatsAppUpgrade(plan.name);
                          }
                        }}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/20'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Pagar com Pix</span>
                      </button>

                      <button
                        onClick={() => handleWhatsAppUpgrade(plan.name)}
                        className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-800"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-400 fill-current" />
                        <span>Comprar via WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer Support Notice */}
        <div className="bg-slate-950/80 rounded-2xl p-4 text-center border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Precisa de um pacote sob medida ou suporte comercial?</span>
          </div>
          <button
            onClick={() => handleWhatsAppUpgrade('Plano Personalizado')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Falar com o Administrador</span>
          </button>
        </div>

      </div>
    </div>
  );
};
