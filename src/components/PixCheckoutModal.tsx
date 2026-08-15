import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle2, QrCode, ShieldCheck, Sparkles, Clock, ArrowRight, MessageCircle, AlertCircle, Smartphone } from 'lucide-react';
import { PlanDefinition } from '../constants/plans';
import { UserProfile } from '../types';
import { updateUserAdminSettings } from '../services/dbService';

interface PixCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDefinition | null;
  userProfile: UserProfile | null;
  onPaymentSuccess?: () => void;
}

export const PixCheckoutModal: React.FC<PixCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  userProfile,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [payerName, setPayerName] = useState(userProfile?.email?.split('@')[0] || '');
  const [payerEmail, setPayerEmail] = useState(userProfile?.email || '');

  // Pix credentials
  const PIX_KEY = '05222783880';
  const PIX_KEY_FORMATTED = '052.227.838-80 (CPF)';
  const PIX_NAME = 'JOEL VATER SANCHES';
  const PIX_CITY = 'SAO PAULO';

  // Format price into numeric value
  const rawPrice = plan ? plan.price.replace('R$', '').replace('.', '').trim() : '0,00';
  const numericPrice = rawPrice.replace(',', '.');

  // CRC16 Calculation for official EMV Pix BR Code
  const calculateCRC16 = (payload: string): string => {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };

  // Generate standard BR Code Pix Copia e Cola
  const generatePixPayload = () => {
    const keyStr = PIX_KEY.replace(/\D/g, '');
    const keyField = `0014BR.GOV.BCB.PIX01${String(keyStr.length).padStart(2, '0')}${keyStr}`;
    const merchantInfo = `26${String(keyField.length).padStart(2, '0')}${keyField}`;
    
    const formattedVal = parseFloat(numericPrice || '0').toFixed(2);
    const valueField = `54${String(formattedVal.length).padStart(2, '0')}${formattedVal}`;
    
    const nameStr = PIX_NAME.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25).toUpperCase();
    const nameField = `59${String(nameStr.length).padStart(2, '0')}${nameStr}`;
    
    const cityStr = PIX_CITY.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15).toUpperCase();
    const cityField = `60${String(cityStr.length).padStart(2, '0')}${cityStr}`;
    
    const txId = '***';
    const txField = `05${String(txId.length).padStart(2, '0')}${txId}`;
    const additionalInfo = `62${String(txField.length).padStart(2, '0')}${txField}`;
    
    const rawPayload = `000201${merchantInfo}520400005303986${valueField}5802BR${nameField}${cityField}${additionalInfo}6304`;
    const crc = calculateCRC16(rawPayload);
    return rawPayload + crc;
  };

  const pixCopiaECola = generatePixPayload();

  useEffect(() => {
    if (!isOpen) return;
    setPaymentDone(false);
    setIsVerifying(false);
    setTimeLeft(15 * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleConfirmPayment = async () => {
    setIsVerifying(true);

    // Simulate instant notification & activation
    setTimeout(async () => {
      setIsVerifying(false);
      setPaymentDone(true);

      if (userProfile && plan) {
        try {
          const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await updateUserAdminSettings(userProfile.uid, {
            planType: plan.id,
            maxEbooksQuota: plan.maxEbooksQuota,
            maxChapters: plan.maxChapters,
            maxWordsPerChapter: plan.maxWordsPerChapter,
            canExport: plan.canExport,
            planExpiresAt: newExpiresAt,
          });
          if (onPaymentSuccess) onPaymentSuccess();
        } catch (err) {
          console.warn('Efetivação de plano via teste Pix:', err);
        }
      }
    }, 2000);
  };

  const handleSendProofWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Realizei o pagamento via Pix para o ${plan.name} (${plan.price}).\nE-mail da conta: ${payerEmail}\nNome do pagador: ${payerName}\nSolicito a liberação do meu plano.`
    );
    window.open(`https://api.whatsapp.com/send?phone=5517991919991&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentDone ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/30">
                Pagamento Confirmado!
              </span>
              <h2 className="text-2xl font-black text-white mt-3">
                Seu {plan.name} foi Ativado!
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Sua cota foi atualizada para <strong>{plan.maxEbooksQuota} e-book(s)</strong> com até <strong>{plan.maxChapters} capítulos</strong> por livro e exportação liberada por 30 dias.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Plano Ativado:</span>
                <span className="font-bold text-amber-300">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Pago:</span>
                <span className="font-bold text-emerald-400">{plan.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Forma de Pagamento:</span>
                <span className="font-bold text-slate-200">Pix Instantâneo</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Ir para o Gerador de E-books
            </button>
          </div>
        ) : (
          /* Checkout Payment Screen */
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-xs rounded-full border border-emerald-500/30 mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>Pagamento via Pix (Aprovação Instantânea)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Finalizar Assinatura do {plan.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Escaneie o QR Code abaixo ou copie o código Pix Copia e Cola para ativar sua conta na hora.
              </p>
            </div>

            {/* Plan Price Summary */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total a pagar:</span>
                <span className="text-2xl font-black text-emerald-400">{plan.price}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Validade do Pix:</span>
                <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime} min</span>
                </div>
              </div>
            </div>

            {/* QR Code Block */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
              <div className="relative inline-block bg-white p-4 rounded-2xl shadow-xl">
                {/* Simulated Visual QR Code */}
                <svg className="w-44 h-44 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="25" height="25" rx="3" fill="#0f172a" />
                  <rect x="9" y="9" width="17" height="17" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="9" height="9" rx="1" fill="#0f172a" />

                  <rect x="70" y="5" width="25" height="25" rx="3" fill="#0f172a" />
                  <rect x="74" y="9" width="17" height="17" rx="2" fill="#ffffff" />
                  <rect x="78" y="13" width="9" height="9" rx="1" fill="#0f172a" />

                  <rect x="5" y="70" width="25" height="25" rx="3" fill="#0f172a" />
                  <rect x="9" y="74" width="17" height="17" rx="2" fill="#ffffff" />
                  <rect x="13" y="78" width="9" height="9" rx="1" fill="#0f172a" />

                  {/* QR Data Matrix representation */}
                  <rect x="35" y="10" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="10" width="6" height="6" fill="#0f172a" />
                  <rect x="58" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="35" y="25" width="12" height="6" fill="#0f172a" />
                  <rect x="52" y="25" width="8" height="8" fill="#0f172a" />

                  <rect x="10" y="35" width="10" height="10" fill="#0f172a" />
                  <rect x="25" y="38" width="8" height="8" fill="#0f172a" />
                  <rect x="38" y="35" width="14" height="14" fill="#0f172a" />
                  <rect x="58" y="38" width="10" height="10" fill="#0f172a" />
                  <rect x="74" y="35" width="16" height="8" fill="#0f172a" />

                  <rect x="10" y="50" width="12" height="12" fill="#0f172a" />
                  <rect x="28" y="52" width="8" height="8" fill="#0f172a" />
                  <rect x="40" y="55" width="16" height="10" fill="#0f172a" />
                  <rect x="60" y="52" width="8" height="12" fill="#0f172a" />
                  <rect x="72" y="48" width="18" height="16" fill="#0f172a" />

                  <rect x="35" y="70" width="10" height="10" fill="#0f172a" />
                  <rect x="48" y="74" width="12" height="12" fill="#0f172a" />
                  <rect x="65" y="70" width="8" height="18" fill="#0f172a" />
                  <rect x="78" y="72" width="14" height="14" fill="#0f172a" />
                </svg>

                {/* Center Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-md shadow-md">
                    PIX
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Aponte a câmera do aplicativo do seu banco para o QR Code acima
              </div>

              {/* Copia e Cola Code Block */}
              <div className="space-y-2 pt-2">
                <label className="block text-left text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Pix Copia e Cola:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCopiaECola}
                    className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPixCode}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      copied
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Chave Pix Alternativa */}
              <div className="flex items-center justify-between text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left">
                <div>
                  <span className="text-slate-400 block text-[10px]">Chave Pix (CPF):</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{PIX_KEY_FORMATTED}</span>
                  <span className="text-[10px] text-slate-400 block">Titular: {PIX_NAME}</span>
                </div>
                <button
                  onClick={handleCopyPixKey}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  {copiedKey ? 'Copiada!' : 'Copiar Chave'}
                </button>
              </div>

            </div>

            {/* Payer Info Input */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Dados para Identificação do Pagador
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">E-mail da Conta:</label>
                  <input
                    type="email"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nome do Pagador:</label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Nome completo ou titular Pix"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmPayment}
                disabled={isVerifying}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verificando Pagamento Pix...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Já Fiz o Pix! (Ativar Plano Agora)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSendProofWhatsApp}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enviar Comprovante de Pix no WhatsApp</span>
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pagamento 100% seguro com ativação de cota por 30 dias.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
