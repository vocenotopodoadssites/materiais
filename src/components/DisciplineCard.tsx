import React from 'react';
import { Eye, ShoppingCart, ArrowRight, Download, CheckCircle } from 'lucide-react';
import { Discipline } from '../types';
import * as LucideIcons from 'lucide-react';

interface DisciplineCardProps {
  discipline: Discipline;
  onOpenSample: (discipline: Discipline) => void;
  purchaseUrl: string;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({ discipline, onOpenSample, purchaseUrl }) => {
  // Safe icon retrieval
  const getIcon = (iconName: string) => {
    // Return standard fallback if icon not found
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Book;
    return <IconComponent className="w-5 h-5 md:w-6 h-6 text-white" />;
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border-2 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${discipline.bgColor} ${discipline.borderColor}`}
    >
      {/* Visual Accent Gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-white/10 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4">
        {/* Colorful Icon Frame */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md shrink-0 ${discipline.iconBg}`}>
          {getIcon(discipline.iconName)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none select-none">{discipline.emoji}</span>
            <h3 className={`font-display font-bold text-lg md:text-xl tracking-tight ${discipline.textColor}`}>
              {discipline.name}
            </h3>
            {discipline.grade === 'Ensino Médio' && (
              <span className="text-[9px] font-bold bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300/30">
                Médio
              </span>
            )}
            {discipline.grade === 'Ensino Fundamental II' && (
              <span className="text-[9px] font-bold bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300/30">
                Fund. II
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed max-w-sm md:max-w-md">
            {discipline.description}
          </p>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-200/40 sm:border-t-0">
        <button
          onClick={() => onOpenSample(discipline)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-3 rounded-xl border border-slate-200 transition-all duration-200 hover:shadow-xs active:scale-95"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          Amostra Grátis
        </button>

        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-95 ${discipline.accentColor}`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Comprar Agora
        </a>
      </div>
    </div>
  );
};

export default DisciplineCard;
