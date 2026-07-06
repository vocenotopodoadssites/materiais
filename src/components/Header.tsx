import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, Check } from 'lucide-react';
import { Discipline, Material } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenAdmin: () => void;
  onOpenCart: () => void;
  cartCount: number;
  disciplines: Discipline[];
  materials: Material[];
  onSelectDiscipline: (d: Discipline) => void;
  onSelectMaterial: (m: Material) => void;
  purchaseUrl: string;
}

export default function Header({
  onSearch,
  onOpenAdmin,
  onOpenCart,
  cartCount,
  disciplines,
  materials,
  onSelectDiscipline,
  onSelectMaterial,
  purchaseUrl
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Monitor page scroll to apply background blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter disciplines and materials based on search query
  const filteredDisciplines = searchQuery.trim() === '' ? [] : disciplines.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = searchQuery.trim() === '' ? [] : materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.disciplineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
    setShowSearchResults(query.trim() !== '');
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setShowSearchResults(false);
  };

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      {/* Red Offer Bar */}
      <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs text-center py-1 font-medium select-none animate-pulse">
        🔥 PROMOÇÃO RELÂMPAGO: Todos os materiais com até 70% de desconto! Acesso vitalício imediato.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-md flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  Apostilas <span className="text-blue-600">do Professor</span>
                </span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold font-mono">Ensino Médio e Fundamental II</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
              Home
            </button>
            <button onClick={() => handleLinkClick('disciplinas')} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
              Disciplinas
            </button>
            <button onClick={() => handleLinkClick('mais-vendidos')} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
              Mais Vendidos
            </button>
            <button onClick={() => handleLinkClick('como-funciona')} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
              Novidades
            </button>
            <button onClick={() => handleLinkClick('beneficios')} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors text-red-600 font-semibold">
              Promoções
            </button>
            <button onClick={() => handleLinkClick('faq')} className="text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg font-medium text-sm transition-colors">
              Contato
            </button>
          </nav>

          {/* Search, Admin, Cart Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Intelligent Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full py-1.5 px-3 w-56 focus-within:w-64 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-sm transition-all duration-300">
                <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Pesquisar materiais..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(searchQuery.trim() !== '')}
                  className="bg-transparent border-none text-slate-800 text-sm focus:outline-none w-full placeholder-slate-400"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto p-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultados da busca</span>
                    <button onClick={() => setShowSearchResults(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Disciplines Match */}
                  {filteredDisciplines.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-blue-600 mb-2">Disciplinas</h4>
                      <div className="space-y-1">
                        {filteredDisciplines.map(d => (
                          <div 
                            key={d.id}
                            onClick={() => { onSelectDiscipline(d); setShowSearchResults(false); }}
                            className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <span className="text-lg">{d.emoji}</span>
                            <div className="text-sm font-semibold text-slate-800">{d.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Materials Match */}
                  {filteredMaterials.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 mb-2">Apostilas & Kits</h4>
                      <div className="space-y-1">
                        {filteredMaterials.map(m => (
                          <div 
                            key={m.id}
                            onClick={() => { onSelectMaterial(m); setShowSearchResults(false); }}
                            className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{m.disciplineName}</div>
                            <div className="text-sm font-bold text-slate-800 leading-tight line-clamp-1">{m.title}</div>
                            <div className="text-xs text-blue-600 font-bold mt-1">R$ {m.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDisciplines.length === 0 && filteredMaterials.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-500">Nenhum material encontrado para "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Portal Toggle (Simulating Minha Conta) */}
            <button 
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-3.5 py-1.5 rounded-full font-semibold text-sm border border-slate-200 transition-all duration-300 shadow-xs"
              title="Painel Administrativo"
            >
              <User className="w-4 h-4" />
              <span>Painel Admin</span>
            </button>

            {/* Cart Button */}
            <button 
              onClick={onOpenCart}
              className="relative p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Action & Cart */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-blue-50 text-blue-600 rounded-full"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-800 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-300">
          
          {/* Mobile Search */}
          <div className="relative">
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl py-2 px-3">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Pesquisar materiais..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent border-none text-slate-800 text-sm focus:outline-none w-full"
              />
              {searchQuery && (
                <button onClick={clearSearch}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
            
            {/* Mobile search drop list */}
            {searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 max-h-60 overflow-y-auto">
                {filteredDisciplines.map(d => (
                  <div 
                    key={d.id} 
                    onClick={() => { onSelectDiscipline(d); setIsMobileMenuOpen(false); }}
                    className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-sm font-semibold text-slate-800"
                  >
                    {d.emoji} {d.name}
                  </div>
                ))}
                {filteredMaterials.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => { onSelectMaterial(m); setIsMobileMenuOpen(false); }}
                    className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-sm border-t border-slate-100"
                  >
                    <div className="text-[10px] text-slate-400 uppercase">{m.disciplineName}</div>
                    <div className="font-bold text-slate-800 leading-tight">{m.title}</div>
                  </div>
                ))}
                {filteredDisciplines.length === 0 && filteredMaterials.length === 0 && (
                  <div className="text-center py-3 text-xs text-slate-400">Nenhum resultado encontrado</div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left text-slate-800 hover:text-blue-600 p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl font-semibold text-sm transition-colors">
              🏠 Home
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); handleLinkClick('disciplinas'); }} className="text-left text-slate-800 hover:text-blue-600 p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl font-semibold text-sm transition-colors">
              🌍 Disciplinas
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); handleLinkClick('mais-vendidos'); }} className="text-left text-slate-800 hover:text-blue-600 p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl font-semibold text-sm transition-colors">
              🔥 Mais Vendidos
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); handleLinkClick('como-funciona'); }} className="text-left text-slate-800 hover:text-blue-600 p-2.5 bg-slate-50 hover:bg-blue-50/50 rounded-xl font-semibold text-sm transition-colors">
              ✨ Novidades
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); handleLinkClick('beneficios'); }} className="text-left text-red-600 hover:text-red-700 p-2.5 bg-slate-50 hover:bg-red-50/30 rounded-xl font-bold text-sm transition-colors col-span-2 text-center">
              🏷️ Promoções & Descontos
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onOpenAdmin(); }}
              className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-sm transition-transform active:scale-95"
            >
              <User className="w-4 h-4" />
              Acessar Painel Administrativo
            </button>
            
            <a 
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-transform active:scale-95"
            >
              Comprar Todo o Acervo
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      )}
    </header>
  );
}
