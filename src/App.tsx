import React, { useState, useEffect } from 'react';
import { 
  defaultSettings, 
  defaultDisciplines, 
  defaultMaterials, 
  defaultTestimonials, 
  defaultFaqs 
} from './data';
import { Discipline, Material, Testimonial, FAQ, SystemSettings } from './types';

// Import Custom Modular Components
import Header from './components/Header';
import DisciplineCard from './components/DisciplineCard';
import SampleModal from './components/SampleModal';
import AdminPanel from './components/AdminPanel';
import Carousel from './components/Carousel';
import CartDrawer from './components/CartDrawer';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

// Icons for section layout
import { 
  Check, ShieldCheck, Clock, Award, Users, BookOpen, 
  Download, Sparkles, Star, ArrowRight, ArrowUp, Zap, HelpCircle, Phone
} from 'lucide-react';

interface CartItem {
  material: Material;
  quantity: number;
}

export default function App() {
  // App-wide state with mock DB simulation
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [disciplines, setDisciplines] = useState<Discipline[]>(defaultDisciplines);
  const [materials, setMaterials] = useState<Material[]>(defaultMaterials);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFaqs);

  // Interface open/close states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Discipline | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('apostilas_do_professor_cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        setCart(parsed);
      } catch (e) {
        console.error("Erro ao carregar carrinho local", e);
      }
    }
  }, []);

  // Save cart to localStorage on modification
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('apostilas_do_professor_cart', JSON.stringify(newCart));
  };

  const handleAddToCart = (material: Material) => {
    const existingIndex = cart.findIndex(item => item.material.id === material.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      saveCart([...cart, { material, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  const handleAddDisciplineToCart = (discipline: Discipline) => {
    // Generate a quick material from the discipline selection
    const generatedMaterial: Material = {
      id: `mat-disc-${discipline.id}`,
      title: `Apostila Completa de ${discipline.name} (BNCC)`,
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      price: discipline.price,
      originalPrice: discipline.originalPrice,
      rating: 4.9,
      reviewsCount: 128,
      isBestSeller: true,
      isNew: false,
      image: discipline.image,
      description: discipline.description,
      pages: 350,
      fileFormat: "Word (.docx) + PDF"
    };
    handleAddToCart(generatedMaterial);
  };

  const handleUpdateQuantity = (materialId: string, newQty: number) => {
    if (newQty <= 0) {
      const updated = cart.filter(item => item.material.id !== materialId);
      saveCart(updated);
    } else {
      const updated = cart.map(item => 
        item.material.id === materialId ? { ...item, quantity: newQty } : item
      );
      saveCart(updated);
    }
  };

  const handleRemoveItem = (materialId: string) => {
    const updated = cart.filter(item => item.material.id !== materialId);
    saveCart(updated);
  };

  // Back to top scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleScrollToId = (id: string) => {
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

  // Predictive search click handlers
  const handleSelectDiscipline = (discipline: Discipline) => {
    setSelectedSample(discipline);
  };

  const handleSelectMaterial = (material: Material) => {
    const disciplineOfMaterial = disciplines.find(d => d.id === material.disciplineId);
    if (disciplineOfMaterial) {
      setSelectedSample(disciplineOfMaterial);
    } else {
      // Direct buy of material if discipline not found
      window.open(settings.purchaseUrl, '_blank');
    }
  };

  // SEO Schema.org structure
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Apostilas do Professor",
    "description": "Materiais pedagógicos estruturados e prontos de acordo com as competências da BNCC para professores de Ensino Fundamental II e Ensino Médio.",
    "url": window.location.origin,
    "logo": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&h=150&q=80",
    "sameAs": [
      settings.facebookUrl,
      settings.instagramUrl,
      settings.youtubeUrl
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "BRL",
      "lowPrice": "35.00",
      "highPrice": "57.00",
      "offerCount": disciplines.length
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* Schema.org Injected Metadata */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* FIXED NAV SUPERIOR */}
      <Header 
        onSearch={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        disciplines={disciplines}
        materials={materials}
        onSelectDiscipline={handleSelectDiscipline}
        onSelectMaterial={handleSelectMaterial}
        purchaseUrl={settings.purchaseUrl}
      />

      {/* HERO BANNER SECTION */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-linear-to-b from-blue-50/70 via-white to-white overflow-hidden" id="hero-banner">
        {/* Abstract background decorative blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider shadow-xs">
                <Zap className="w-4.5 h-4.5 text-blue-600 animate-pulse fill-current" />
                Entrega Imediata por E-mail
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 leading-tight tracking-tight">
                Economize Horas <br className="hidden md:inline" />
                Preparando Suas <span className="text-blue-600 relative inline-block">Aulas</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Tenha acesso imediato a materiais pedagógicos completos, organizados por disciplina e prontos para usar em sala de aula do Ensino Fundamental II e Ensino Médio.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={() => handleScrollToId('disciplinas')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-8 py-4.5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Ver Disciplinas
                  <ArrowRight className="w-5 h-5" />
                </button>

                <a
                  href={settings.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm px-8 py-4.5 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Comprar Agora
                </a>
              </div>

              {/* Confidence Micro-Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block font-display font-extrabold text-lg text-slate-900 leading-none">100%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">Editável no Word</span>
                </div>
                <div className="text-center lg:text-left border-x border-slate-100 px-2">
                  <span className="block font-display font-extrabold text-lg text-slate-900 leading-none">BNCC</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">Alinhado MEC</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-display font-extrabold text-lg text-slate-900 leading-none">7 Dias</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">Garantia Total</span>
                </div>
              </div>

            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual back frame */}
                <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 scale-102 opacity-10 pointer-events-none" />
                
                {/* Premium photo mockup */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" 
                    alt="Professor preparando aulas usando notebook e materiais pedagógicos" 
                    className="w-full h-[380px] md:h-[420px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating overlay tag */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-100/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500 text-white">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metodologia Aprovada</p>
                      <p className="text-sm font-extrabold text-slate-800 leading-tight">Garantia de Ensino de Alto Rendimento</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO DISCIPLINAS GRID */}
      <section className="py-20 bg-white" id="disciplinas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Grade Curricular Completa</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              Materiais Pedagógicos Prontos por Disciplina
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Encontre o material perfeito de acordo com a sua disciplina de atuação. Nossos planejamentos anuais, bimestrais e apostilas estão divididos por área e prontos para uso.
            </p>
          </div>

          {/* Grid of Disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disciplines.map((discipline) => (
              <DisciplineCard 
                key={discipline.id}
                discipline={discipline}
                onOpenSample={setSelectedSample}
                purchaseUrl={settings.purchaseUrl}
              />
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO POR QUE COMPRAR / BENEFÍCIOS */}
      <section className="py-20 bg-slate-50 border-y border-slate-100" id="beneficios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Vantagens Exclusivas</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              Por que comprar nossos materiais?
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Trabalhamos com seriedade técnica para entregar o melhor apoio pedagógico do Brasil. Veja o que torna nossas apostilas imbatíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Download Imediato</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Receba o link seguro em seu e-mail logo após a confirmação do pagamento, sem esperas.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Apostilas Organizadas</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Arquivos divididos de forma limpa por bimestres, semanas e séries para facilitar sua consulta.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Material Atualizado</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Conteúdos constantemente revisados e alinhados às diretrizes do MEC e da BNCC 2026.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Arquivos em PDF & Word</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                O melhor de dois mundos: PDF de alta definição pronto para imprimir e Word editável.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Conteúdo Completo</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Abordagem ampla com planos de aula teóricos, atividades dinâmicas e avaliações finais.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Excelente Qualidade</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Diagramação limpa, formatação profissional e imagens vetoriais nítidas para os alunos.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Celular e Computador</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Acesse de onde quiser. Abra e edite usando seu notebook, tablet ou diretamente pelo celular.
              </p>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <h4 className="font-display font-bold text-slate-900 text-md">Economia de Tempo</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Prepare todo o seu plano de aulas do ano letivo em minutos ao invés de perder noites e finais de semana.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SEÇÃO MAIS VENDIDOS / CARROSSEL */}
      <section className="py-20 bg-white" id="mais-vendidos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Destaques da Semana</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              Os Materiais Mais Procurados Pelos Professores
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Estes são os campeões de vendas e os kits de planejamento mais elogiados pelas coordenações pedagógicas brasileiras.
            </p>
          </div>

          {/* Carousel component rendering list of best seller products */}
          <Carousel 
            materials={materials}
            purchaseUrl={settings.purchaseUrl}
          />

        </div>
      </section>

      {/* SEÇÃO COMO FUNCIONA (LINHA DO TEMPO) */}
      <section className="py-20 bg-slate-50 border-y border-slate-100" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Prático e Rápido</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              Como funciona o processo de compra?
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              O caminho mais curto entre você e um ano letivo perfeitamente planejado e tranquilo.
            </p>
          </div>

          {/* Timeline Process Graphic */}
          <div className="relative">
            {/* Visual connector line for desktop */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-100 -translate-y-1/2 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-center space-y-4 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white font-display font-black text-md rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  1
                </span>
                <div className="pt-2 text-3xl select-none">🌍</div>
                <h4 className="font-display font-extrabold text-slate-800 text-md">Escolha a disciplina</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Selecione sua disciplina de atuação dentre as 16 opções disponíveis na grade.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-center space-y-4 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white font-display font-black text-md rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  2
                </span>
                <div className="pt-2 text-3xl select-none">👁️</div>
                <h4 className="font-display font-extrabold text-slate-800 text-md">Veja a amostra</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Clique em "Amostra Grátis" e veja os sumários, conteúdos e mockups de cada apostila.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-center space-y-4 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white font-display font-black text-md rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  3
                </span>
                <div className="pt-2 text-3xl select-none">🛒</div>
                <h4 className="font-display font-extrabold text-slate-800 text-md">Clique em Comprar</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Aperte "Comprar Agora" para abrir o ambiente de checkout seguro em nosso drive.
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs text-center space-y-4 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-blue-600 text-white font-display font-black text-md rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  4
                </span>
                <div className="pt-2 text-3xl select-none">🎁</div>
                <h4 className="font-display font-extrabold text-slate-800 text-md">Receba imediatamente</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Acesse os links de download direto em seu e-mail e tenha as apostilas em seu celular ou PC.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SEÇÃO DEPOIMENTOS (Avaliations) */}
      <section className="py-20 bg-white" id="depoimentos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Prova Social</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              O que dizem os professores que já compraram?
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Mais de 10.000 educadores em todo o território nacional utilizam nossos planejamentos para transformar sua rotina docente diária.
            </p>
          </div>

          {/* Testimonials Masonry / Grid Wall of 8 Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 8).map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  {/* Testimonial Stars */}
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                </div>

                {/* Avatar and name */}
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-200/50">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 object-cover rounded-full border border-slate-200"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-none">{testimonial.name}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      {testimonial.role} • {testimonial.city}/{testimonial.state}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEÇÃO ESTATÍSTICAS COMD CONTADORES */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        {/* Visual shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <span className="block font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
                +{settings.teachersCount.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-blue-200">
                Professores Atendidos
              </span>
            </div>

            <div className="space-y-1">
              <span className="block font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
                +{settings.materialsCount}
              </span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-blue-200">
                Materiais Didáticos
              </span>
            </div>

            <div className="space-y-1">
              <span className="block font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
                +{settings.downloadsCount.toLocaleString('pt-BR')}
              </span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-blue-200">
                Downloads Concluídos
              </span>
            </div>

            <div className="space-y-1">
              <span className="block font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight">
                {settings.satisfactionRate}%
              </span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-blue-200">
                Taxa de Satisfação
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <section className="py-20 bg-slate-50 border-y border-slate-100" id="faq">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Dúvidas Frequentes</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
              Ainda tem alguma dúvida?
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Esclarecemos as principais perguntas dos professores para dar total segurança antes de realizar sua compra.
            </p>
          </div>

          <FAQSection faqs={faqs} />

        </div>
      </section>

      {/* CHAMADA FINAL (CONVENCIMENTO) */}
      <section className="py-20 md:py-24 bg-white text-center relative overflow-hidden" id="chamada-final">
        {/* Grid dots decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 text-red-600 font-extrabold text-xs uppercase tracking-wider">
            🚨 Oferta por Tempo Limitado!
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight max-w-2xl mx-auto">
            Comece Hoje Mesmo a Poupar Seu Tempo
          </h2>

          <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Não perca mais noites de sono preparando slides, provas e preenchendo códigos da BNCC. Tenha o acervo pedagógico definitivo em suas mãos agora mesmo!
          </p>

          <div className="pt-4 flex flex-col items-center justify-center gap-3">
            <a
              href={settings.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base px-10 py-5 rounded-2xl shadow-xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 animate-bounce"
            >
              QUERO MEUS MATERIAIS
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Garantia de Satisfação incondicional de 7 dias com reembolso total.
            </span>
          </div>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-115 active:scale-90 flex items-center justify-center group"
        title="Dúvidas no WhatsApp?"
      >
        <Phone className="w-6 h-6 fill-current animate-pulse" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Dúvidas? Chame no WhatsApp!
        </span>
      </a>

      {/* VOLTAR AO TOPO BUTTON */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-90 flex items-center justify-center cursor-pointer"
          title="Voltar ao Topo"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* PREVIEW MODAL (AMOSTRA GRÁTIS) */}
      <SampleModal 
        discipline={selectedSample}
        onClose={() => setSelectedSample(null)}
        purchaseUrl={settings.purchaseUrl}
      />

      {/* ADMINISTRATIVE DASHBOARD MODAL */}
      <AdminPanel 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        disciplines={disciplines}
        materials={materials}
        testimonials={testimonials}
        settings={settings}
        onUpdateDisciplines={setDisciplines}
        onUpdateMaterials={setMaterials}
        onUpdateTestimonials={setTestimonials}
        onUpdateSettings={setSettings}
      />

      {/* SHOPPING CART DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        purchaseUrl={settings.purchaseUrl}
      />

      {/* FOOTER */}
      <Footer 
        disciplines={disciplines}
        settings={settings}
      />

    </div>
  );
}
