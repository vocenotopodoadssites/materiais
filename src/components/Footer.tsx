import React from 'react';
import { Mail, Clock, ShieldCheck, Heart, Facebook, Instagram, Youtube } from 'lucide-react';
import { Discipline, SystemSettings } from '../types';

interface FooterProps {
  disciplines: Discipline[];
  settings: SystemSettings;
}

export default function Footer({ disciplines, settings }: FooterProps) {
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleScrollToTop}>
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                Apostilas <span className="text-blue-500">do Professor</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Nossa missão é valorizar o trabalho docente, poupando o tempo precioso dos professores do Ensino Fundamental II e Ensino Médio através de materiais pedagógicos completos, 100% editáveis no Word e estruturados com base na BNCC.
            </p>

            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-400 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-all duration-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Links Rápidos</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={handleScrollToTop} className="hover:text-white transition-colors cursor-pointer">Início (Home)</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('disciplinas')} className="hover:text-white transition-colors cursor-pointer">Grade Curricular</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('mais-vendidos')} className="hover:text-white transition-colors cursor-pointer">Mais Procurados</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('como-funciona')} className="hover:text-white transition-colors cursor-pointer">Linha do Tempo</button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('faq')} className="hover:text-white transition-colors cursor-pointer">Perguntas Frequentes</button>
              </li>
            </ul>
          </div>

          {/* Popular Disciplines Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Principais Disciplinas</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold">
              {disciplines.slice(0, 8).map(d => (
                <button 
                  key={d.id}
                  onClick={() => handleLinkClick('disciplinas')}
                  className="hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  {d.emoji} {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento & Suporte</h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-bold">E-mail:</span>
                  <a href={`mailto:${settings.contactEmail}`} className="text-slate-300 hover:text-white transition-colors font-mono">{settings.contactEmail}</a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-bold">Horário de Suporte:</span>
                  <span className="text-slate-300 font-medium">{settings.supportHours}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-400 font-bold">Compra Garantida:</span>
                  <span className="text-slate-300 font-medium">Plataforma Segura e Criptografada</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Col */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} <strong>Apostilas do Professor</strong>. Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido com excelência pedagógica para impulsionar a educação brasileira.</p>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <a href="#politica" className="hover:text-slate-300 transition-colors">Política de Privacidade</a>
            <span>•</span>
            <a href="#termos" className="hover:text-slate-300 transition-colors">Termos de Uso</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
