import React from 'react';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { Material } from '../types';

interface CartItem {
  material: Material;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (materialId: string, newQty: number) => void;
  onRemoveItem: (materialId: string) => void;
  purchaseUrl: string;
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  purchaseUrl 
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + (item.material.price * item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // High-converting incentive: Add more to unlock an exclusive digital bonus
  const itemsRequiredForBonus = 2;
  const isBonusUnlocked = totalItems >= itemsRequiredForBonus;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full border-l border-slate-100 z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-600" />
            <h2 className="text-md font-display font-bold text-slate-800">
              Minhas Apostilas <span className="text-xs text-slate-400 font-normal">({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold transition-colors w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Progress / Incentive bar for digital products */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
            <Gift className={`shrink-0 mt-0.5 ${isBonusUnlocked ? 'text-amber-500 animate-bounce' : 'text-slate-400'}`} size={18} />
            <div className="text-xs">
              {isBonusUnlocked ? (
                <div>
                  <p className="font-bold text-amber-800">🎉 Super Bônus Desbloqueado!</p>
                  <p className="text-slate-600 mt-0.5">Parabéns! Você ganhou a <strong>Agenda Planner Escolar 2026</strong> inteiramente editável no Word.</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-700">Presente do Professor Especial 🎁</p>
                  <p className="text-slate-500 mt-0.5">Adicione mais <strong>{itemsRequiredForBonus - totalItems} {itemsRequiredForBonus - totalItems === 1 ? 'material' : 'materiais'}</strong> e ganhe o super brinde: Agenda Planner Escolar Editável!</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(totalItems / itemsRequiredForBonus) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Seu carrinho está vazio</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Navegue pela lista de disciplinas e selecione os planejamentos prontos para poupar suas horas de trabalho.</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-display text-xs font-bold py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
              >
                Ver Apostilas Disponíveis
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div 
                  key={item.material.id}
                  className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex-row items-center"
                >
                  <img 
                    src={item.material.image} 
                    alt={item.material.title} 
                    className="w-12 h-16 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                      {item.material.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.material.fileFormat}</span>
                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button 
                          onClick={() => onUpdateQuantity(item.material.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                          title="Diminuir"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800 bg-white border-x border-slate-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.material.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-200 text-slate-600 text-xs font-bold"
                          title="Aumentar"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-blue-600">
                        R$ {(item.material.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemoveItem(item.material.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Remover material"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal dos materiais:</span>
                <span className="font-mono text-slate-800">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Entrega por e-mail:</span>
                <span className="text-emerald-600 font-bold uppercase">Imediata (Grátis)</span>
              </div>
              {isBonusUnlocked && (
                <div className="flex justify-between text-amber-600 text-[11px]">
                  <span>Bônus Especial:</span>
                  <span className="font-bold">Planner Editável (Liberado)</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline text-slate-800">
                <span className="font-bold text-sm">Valor Total:</span>
                <span className="font-display font-extrabold text-xl text-emerald-600 font-mono">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTA action */}
            <a 
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-display font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Ir para Pagamento Seguro <ArrowRight size={16} />
            </a>

            {/* Security stamp */}
            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Plataforma 100% Criptografada & Segura</span>
            </div>

            {/* Payment methods badges */}
            <div className="flex justify-center items-center gap-2.5 opacity-65 grayscale hover:grayscale-0 transition-all select-none">
              <span className="text-[9px] font-mono font-bold text-slate-400">Pague com:</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_Pix.svg" alt="Pix Logo" className="h-4" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" referrerPolicy="no-referrer" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Cc-visa-brands-doubleback-v2.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
