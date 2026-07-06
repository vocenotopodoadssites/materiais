import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, Clock } from 'lucide-react';

export default function DiscountPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    // Delay of 4.5 seconds to show popup organically
    const timer = setTimeout(() => {
      // Check if they've already dismissed it in this session to respect UX
      const isDismissed = sessionStorage.getItem('discount_popup_dismissed');
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  // Simple countdown timer
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleCopy = () => {
    navigator.clipboard.writeText('PROF10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('discount_popup_dismissed', 'true');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={handleDismiss} />

      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col space-y-5 animate-scale-up z-10 text-center">
        
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-xs transition-colors"
          title="Fechar"
        >
          ✕
        </button>

        {/* Gift icon with decorative background circles */}
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <Gift size={28} className="animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] tracking-widest font-extrabold text-secondary-600 uppercase bg-secondary-50 px-2.5 py-1 rounded-full">
            PRESENTE ESPECIAL DO PROFESSOR
          </span>
          <h3 className="text-lg sm:text-xl font-display font-bold text-slate-800 leading-tight pt-1">
            Ganhe 10% de Desconto Adicional!
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Parabéns pela sua dedicação ao ensino! Copie o cupom abaixo e utilize no checkout para economizar ainda mais na compra de qualquer planejamento.
          </p>
        </div>

        {/* Coupon display card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Código do Cupom</span>
            <span className="text-lg font-mono font-bold text-slate-800 tracking-wider">PROF10</span>
          </div>

          <button 
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-xs'}`}
          >
            {copied ? (
              <>
                <Check size={14} className="stroke-[2.5]" /> Copiado!
              </>
            ) : (
              <>
                <Copy size={14} /> Copiar
              </>
            )}
          </button>
        </div>

        {/* Countdown Urgency elements */}
        <div className="flex justify-center items-center gap-2 text-[11px] text-amber-600 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/40">
          <Clock size={12} className="animate-spin-slow" />
          <span>Oferta expira em: <strong>{formatTime(timeLeft)}</strong></span>
        </div>

        <button 
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 text-xs font-semibold underline underline-offset-4 pt-1 transition-colors"
        >
          Não, prefiro continuar pagando valor integral
        </button>

      </div>
    </div>
  );
}
