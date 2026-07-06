import React, { useState } from 'react';
import { MessageSquare, Send, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function WhatsappButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Olá, colega professor(a)! Me chamo Ana, sou pedagoga aqui no Planejamento Pronto. 🌸',
      time: 'Agora'
    },
    {
      sender: 'bot',
      text: 'Precisa de ajuda para selecionar a série ideal, saber sobre a BNCC ou tirar qualquer dúvida sobre a compra? Me diga qual é sua dúvida!',
      time: 'Agora'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user' as const, text: textToSend, time: 'Agora' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot replying based on keyword matching after 1.2s
    setTimeout(() => {
      let replyText = 'Poxa, que legal! Nossos planejamentos são 100% editáveis no Word e já vêm com os códigos oficiais da BNCC. Você recebe o link de download no seu e-mail logo após o pagamento!';
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('word') || lower.includes('editar') || lower.includes('editavel') || lower.includes('formato')) {
        replyText = 'Sim! Quase todos os nossos planejamentos estão formatados em Microsoft Word (.docx). Você pode editar cada detalhe no seu computador, celular ou tablet para personalizar a aula!';
      } else if (lower.includes('recebe') || lower.includes('prazo') || lower.includes('entrega') || lower.includes('e-mail') || lower.includes('email')) {
        replyText = 'O envio é imediato! Pagando por Pix ou Cartão, o sistema envia o link de download direto para o seu e-mail em menos de 2 minutinhos. No boleto, o banco leva até 1 dia útil para compensar.';
      } else if (lower.includes('bncc') || lower.includes('habilidade') || lower.includes('codigo')) {
        replyText = 'Absolutamente! Todos os nossos planos anuais e diários estão 100% alinhados à BNCC, contendo os objetivos de aprendizagem, campos de experiência e códigos de habilidades detalhados aula por aula.';
      } else if (lower.includes('garantia') || lower.includes('dinheiro') || lower.includes('devolve')) {
        replyText = 'Temos garantia total de 7 dias! Se você não gostar do material por qualquer motivo, nós devolvemos 100% do seu dinheiro. Sem burocracia, basta nos mandar uma mensagem no e-mail ou aqui!';
      } else if (lower.includes('desconto') || lower.includes('cupom') || lower.includes('promo')) {
        replyText = 'Ah! Que bom que perguntou. Use o cupom especial PROF10 no checkout para garantir 10% de desconto adicional na sua compra hoje! 🎉';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText, time: 'Agora' }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end" id="whatsapp-support-floating-widget">
      
      {/* Support Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-3xl w-80 sm:w-85 h-112 shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-scale-up">
          
          {/* Chat Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80" 
                  alt="Ana Pedagoga" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-600 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="text-sm font-display font-bold">Profª. Ana • Suporte</h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span> Online agora
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white font-bold text-sm transition-colors"
              title="Fechar chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Panel */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3 flex flex-col justify-start">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'bot' 
                    ? 'bg-white text-slate-700 rounded-tl-3xs self-start border border-slate-100 shadow-3xs' 
                    : 'bg-emerald-600 text-white rounded-tr-3xs self-end'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[8px] mt-1 block text-right ${msg.sender === 'bot' ? 'text-slate-400' : 'text-emerald-200'}`}>
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="bg-white text-slate-500 rounded-2xl rounded-tl-3xs p-3 text-[11px] self-start border border-slate-100 shadow-3xs flex items-center gap-1.5 shrink-0">
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* Quick FAQ Suggestion links */}
          <div className="bg-white px-3 py-2 border-t border-slate-100 shrink-0 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button 
              onClick={() => handleSendMessage('Os planejamentos são em Word?')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-full px-2.5 py-1 font-semibold transition-colors shrink-0"
            >
              📝 São em Word?
            </button>
            <button 
              onClick={() => handleSendMessage('Como recebo os materiais?')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-full px-2.5 py-1 font-semibold transition-colors shrink-0"
            >
              ⚡ Como recebo?
            </button>
            <button 
              onClick={() => handleSendMessage('Os planos têm BNCC?')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-full px-2.5 py-1 font-semibold transition-colors shrink-0"
            >
              🏫 Alinhados à BNCC?
            </button>
            <button 
              onClick={() => handleSendMessage('Tem garantia se não gostar?')}
              className="text-[10px] text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-full px-2.5 py-1 font-semibold transition-colors shrink-0"
            >
              🔒 Garantia?
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input 
              type="text" 
              placeholder="Digite sua dúvida de professor..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
            />
            <button 
              onClick={() => handleSendMessage(inputValue)}
              className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-colors"
              title="Enviar mensagem"
            >
              <Send size={14} />
            </button>
          </div>

        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all active:scale-95 group relative border border-emerald-400/20"
        title="Falar com Suporte Pedagógico"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-3xs animate-bounce">
          1
        </span>
        <MessageSquare size={22} className="fill-white/10" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-display font-extrabold text-xs whitespace-nowrap hidden sm:inline-block">
          Dúvidas? Fale Conosco
        </span>
      </button>

    </div>
  );
}
