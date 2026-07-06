import React from 'react';
import { X, Check, ShoppingCart, Award, FileText, Download } from 'lucide-react';
import { Discipline } from '../types';

interface SampleModalProps {
  discipline: Discipline | null;
  onClose: () => void;
  purchaseUrl: string;
}

export default function SampleModal({ discipline, onClose, purchaseUrl }: SampleModalProps) {
  if (!discipline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay Background */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Area */}
        <div className={`p-6 text-white relative ${discipline.accentColor}`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{discipline.emoji}</span>
            <div>
              <span className="text-xs uppercase font-mono tracking-widest font-bold opacity-80">Amostra Pedagógica</span>
              <h2 className="text-2xl font-display font-bold tracking-tight">{discipline.name}</h2>
            </div>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Column: Visual Mockup Image */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="relative group rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-50">
                <img 
                  src={discipline.image} 
                  alt={`Amostra de ${discipline.name}`} 
                  className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  70% OFF
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded-md backdrop-blur-xs">
                  Imagem de Demonstração
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-800 leading-relaxed font-semibold">
                  Garantia de atualização constante de acordo com as alterações do MEC/BNCC 2026.
                </p>
              </div>
            </div>

            {/* Right Column: Descriptions and Index */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Descrição do Material</h3>
                <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                  {discipline.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  O que você vai receber:
                </h3>
                
                <div className="grid grid-cols-1 gap-2.5 mt-2.5">
                  {discipline.sampleContents.map((content, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="mt-1 p-0.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-slate-700 text-xs font-semibold leading-normal">
                        {content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 p-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 line-through">De R$ {discipline.originalPrice.toFixed(2)}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-xs font-bold font-mono">Por apenas</span>
              <span className="text-red-600 text-2xl font-display font-extrabold">R$ {discipline.price.toFixed(2)}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">⚡ Pagamento único, sem mensalidades!</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all active:scale-95"
            >
              Fechar Visualização
            </button>
            <a 
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Comprar Agora
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
