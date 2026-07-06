import React, { useState } from 'react';
import { 
  X, Save, Plus, Trash2, Edit3, Settings, Users, BookOpen, 
  MessageSquare, Globe, ChevronRight, Hash, DollarSign, Link2, 
  Percent, ArrowLeft, RefreshCw, Smartphone, Mail, AlertTriangle, Check
} from 'lucide-react';
import { Discipline, Material, Testimonial, SystemSettings } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  disciplines: Discipline[];
  materials: Material[];
  testimonials: Testimonial[];
  settings: SystemSettings;
  onUpdateDisciplines: (newD: Discipline[]) => void;
  onUpdateMaterials: (newM: Material[]) => void;
  onUpdateTestimonials: (newT: Testimonial[]) => void;
  onUpdateSettings: (newS: SystemSettings) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  disciplines,
  materials,
  testimonials,
  settings,
  onUpdateDisciplines,
  onUpdateMaterials,
  onUpdateTestimonials,
  onUpdateSettings
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'disciplines' | 'materials' | 'testimonials' | 'settings'>('stats');
  
  // Local editable copies of data
  const [localSettings, setLocalSettings] = useState<SystemSettings>({ ...settings });
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // States for adding new items
  const [isAddingDiscipline, setIsAddingDiscipline] = useState(false);
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  
  // Notification Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Preset colors for new disciplines
  const colorPresets = [
    { name: 'Teal/Blue', bg: 'bg-teal-50', border: 'border-teal-200', iconBg: 'bg-teal-500', text: 'text-teal-800', accent: 'bg-teal-600' },
    { name: 'Amber/Gold', bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-500', text: 'text-amber-800', accent: 'bg-amber-600' },
    { name: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', iconBg: 'bg-indigo-500', text: 'text-indigo-800', accent: 'bg-indigo-600' },
    { name: 'Sky Blue', bg: 'bg-sky-50', border: 'border-sky-200', iconBg: 'bg-sky-500', text: 'text-sky-800', accent: 'bg-sky-600' },
    { name: 'Rose', bg: 'bg-rose-50', border: 'border-rose-200', iconBg: 'bg-rose-500', text: 'text-rose-800', accent: 'bg-rose-600' },
    { name: 'Yellow/Gold', bg: 'bg-yellow-50', border: 'border-yellow-200', iconBg: 'bg-yellow-500', text: 'text-yellow-800', accent: 'bg-yellow-600' },
    { name: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-500', text: 'text-purple-800', accent: 'bg-purple-600' },
    { name: 'Green', bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-500', text: 'text-green-800', accent: 'bg-green-600' },
  ];

  // Save Settings
  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    triggerToast('Configurações salvas com sucesso!');
  };

  // Reset all to default parameters
  const handleResetDefaultSettings = () => {
    if (confirm('Tem certeza que deseja resetar as configurações para os valores originais de fábrica?')) {
      const defaultSet: SystemSettings = {
        purchaseUrl: "https://drive.google.com/file/d/12gIaqN6GWkFnTgrDRqN1I026UIbHYbB7/view",
        whatsappNumber: "5511999999999",
        whatsappMessage: "Olá! Gostaria de tirar algumas dúvidas sobre as apostilas de planejamento de aula para professores.",
        contactEmail: "suporte@apostilasdoprofessor.com.br",
        supportHours: "Segunda a Sexta, das 8h às 18h",
        facebookUrl: "https://facebook.com/apostilasdoprofessor",
        instagramUrl: "https://instagram.com/apostilasdoprofessor",
        youtubeUrl: "https://youtube.com/apostilasdoprofessor",
        teachersCount: 10480,
        materialsCount: 284,
        downloadsCount: 82450,
        satisfactionRate: 98,
      };
      setLocalSettings(defaultSet);
      onUpdateSettings(defaultSet);
      triggerToast('Configurações redefinidas para o padrão!');
    }
  };

  // Discipline operations
  const handleSaveDiscipline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const emoji = formData.get('emoji') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPrice = parseFloat(formData.get('originalPrice') as string);
    const description = formData.get('description') as string;
    const longDescription = formData.get('longDescription') as string;
    const grade = formData.get('grade') as 'Ensino Fundamental II' | 'Ensino Médio' | 'Ambos';
    const image = formData.get('image') as string || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80';
    const sampleContents = (formData.get('sampleContents') as string).split('\n').filter(line => line.trim() !== '');
    
    const colorPresetIdx = parseInt(formData.get('colorPreset') as string || '0');
    const selectedPreset = colorPresets[colorPresetIdx];

    const iconMap: { [key: string]: string } = {
      'Geografia': 'Globe', 'História': 'Scroll', 'Português': 'BookOpen',
      'Matemática': 'Hash', 'Redação': 'PenTool', 'Espanhol': 'Languages',
      'Filosofia': 'BrainCircuit', 'Sociologia': 'Users', 'Biologia': 'Leaf',
      'Ciências': 'FlaskConical', 'Física': 'Atom', 'Química': 'Beaker',
      'Literatura': 'BookOpenCheck', 'Educação Física': 'Activity',
      'Artes': 'Palette', 'Projeto de Vida': 'Compass'
    };
    const iconName = iconMap[name] || 'Book';

    if (isAddingDiscipline) {
      const newDisc: Discipline = {
        id: id || `disc-${Date.now()}`,
        name, emoji, price, originalPrice, description, longDescription, grade, image, sampleContents, iconName,
        bgColor: selectedPreset.bg,
        borderColor: selectedPreset.border,
        iconBg: selectedPreset.iconBg,
        textColor: selectedPreset.text,
        accentColor: selectedPreset.accent,
      };
      onUpdateDisciplines([...disciplines, newDisc]);
      triggerToast(`Disciplina "${name}" cadastrada com sucesso!`);
    } else if (selectedDiscipline) {
      const updated = disciplines.map(d => d.id === selectedDiscipline.id ? {
        ...d, name, emoji, price, originalPrice, description, longDescription, grade, image, sampleContents,
        bgColor: selectedPreset.bg,
        borderColor: selectedPreset.border,
        iconBg: selectedPreset.iconBg,
        textColor: selectedPreset.text,
        accentColor: selectedPreset.accent,
      } : d);
      onUpdateDisciplines(updated);
      triggerToast(`Disciplina "${name}" atualizada!`);
    }

    setIsAddingDiscipline(false);
    setSelectedDiscipline(null);
  };

  const handleDeleteDiscipline = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover a disciplina de ${name}? Todos os materiais associados continuarão aparecendo, mas a disciplina sumirá do grid principal.`)) {
      onUpdateDisciplines(disciplines.filter(d => d.id !== id));
      triggerToast(`Disciplina de ${name} removida.`);
    }
  };

  // Material operations
  const handleSaveMaterial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const disciplineId = formData.get('disciplineId') as string;
    const price = parseFloat(formData.get('price') as string);
    const originalPrice = parseFloat(formData.get('originalPrice') as string);
    const description = formData.get('description') as string;
    const pages = parseInt(formData.get('pages') as string || '100');
    const fileFormat = formData.get('fileFormat') as string;
    const image = formData.get('image') as string || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80';
    
    const dName = disciplines.find(d => d.id === disciplineId)?.name || 'Outro';

    if (isAddingMaterial) {
      const newMat: Material = {
        id: `mat-${Date.now()}`,
        title, disciplineId, disciplineName: dName, price, originalPrice, description, pages, fileFormat, image,
        rating: 4.8 + Math.random() * 0.2,
        reviewsCount: 15 + Math.floor(Math.random() * 80),
        isBestSeller: true,
        isNew: true
      };
      onUpdateMaterials([...materials, newMat]);
      triggerToast('Novo material pedagógico adicionado!');
    } else if (selectedMaterial) {
      const updated = materials.map(m => m.id === selectedMaterial.id ? {
        ...m, title, disciplineId, disciplineName: dName, price, originalPrice, description, pages, fileFormat, image
      } : m);
      onUpdateMaterials(updated);
      triggerToast('Material pedagógico atualizado com sucesso!');
    }

    setIsAddingMaterial(false);
    setSelectedMaterial(null);
  };

  const handleDeleteMaterial = (id: string, title: string) => {
    if (confirm(`Excluir material "${title}" do site?`)) {
      onUpdateMaterials(materials.filter(m => m.id !== id));
      triggerToast('Material excluído.');
    }
  };

  // Testimonial operations
  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const comment = formData.get('comment') as string;
    const avatar = formData.get('avatar') as string || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80';

    if (isAddingTestimonial) {
      const newT: Testimonial = {
        id: `t-${Date.now()}`,
        name, role, city, state, comment, avatar, rating: 5, verifiedPurchase: true
      };
      onUpdateTestimonials([newT, ...testimonials]);
      triggerToast('Depoimento cadastrado com sucesso!');
    } else if (selectedTestimonial) {
      const updated = testimonials.map(t => t.id === selectedTestimonial.id ? {
        ...t, name, role, city, state, comment, avatar
      } : t);
      onUpdateTestimonials(updated);
      triggerToast('Depoimento atualizado!');
    }

    setIsAddingTestimonial(false);
    setSelectedTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    if (confirm(`Excluir depoimento de ${name}?`)) {
      onUpdateTestimonials(testimonials.filter(t => t.id !== id));
      triggerToast('Depoimento excluído.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Main Admin UI Panel */}
      <div className="relative bg-slate-950 text-slate-100 rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Toast Notifier */}
        {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 border border-blue-400 text-white font-semibold text-sm py-2.5 px-5 rounded-full shadow-lg flex items-center gap-2 z-50 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 text-blue-500 p-2 rounded-xl border border-blue-500/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-widest">Painel Administrativo</span>
              <h2 className="text-lg font-bold font-display text-white">Central de Customização e Expansão</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content Grid */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Navigation Sidebar */}
          <aside className="w-64 border-r border-slate-800 bg-slate-900/20 p-4 space-y-1 select-none hidden md:block">
            <button
              onClick={() => { setActiveTab('stats'); setSelectedDiscipline(null); setSelectedMaterial(null); setSelectedTestimonial(null); setIsAddingDiscipline(false); setIsAddingMaterial(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'stats' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              📊 Indicadores & Estatísticas
            </button>
            <button
              onClick={() => { setActiveTab('disciplines'); setSelectedDiscipline(null); setSelectedMaterial(null); setSelectedTestimonial(null); setIsAddingDiscipline(false); setIsAddingMaterial(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'disciplines' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>🌍 Grade de Disciplinas</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{disciplines.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('materials'); setSelectedDiscipline(null); setSelectedMaterial(null); setSelectedTestimonial(null); setIsAddingDiscipline(false); setIsAddingMaterial(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'materials' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>📚 Apostilas & Kits</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{materials.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('testimonials'); setSelectedDiscipline(null); setSelectedMaterial(null); setSelectedTestimonial(null); setIsAddingDiscipline(false); setIsAddingMaterial(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'testimonials' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>💬 Depoimentos</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded-full">{testimonials.length}</span>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setSelectedDiscipline(null); setSelectedMaterial(null); setSelectedTestimonial(null); setIsAddingDiscipline(false); setIsAddingMaterial(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              ⚙️ Links & Redes Sociais
            </button>
          </aside>

          {/* Tab Content Panels */}
          <main className="flex-1 overflow-y-auto p-6 bg-slate-950/80">
            
            {/* Mobile Nav Header */}
            <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-4 mb-4 border-b border-slate-800 scrollbar-none">
              <button onClick={() => { setActiveTab('stats'); setSelectedDiscipline(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Indicadores</button>
              <button onClick={() => { setActiveTab('disciplines'); setSelectedDiscipline(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'disciplines' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Disciplinas</button>
              <button onClick={() => { setActiveTab('materials'); setSelectedMaterial(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'materials' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Materiais</button>
              <button onClick={() => { setActiveTab('testimonials'); setSelectedTestimonial(null); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'testimonials' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Testemunhos</button>
              <button onClick={() => { setActiveTab('settings'); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Configurações</button>
            </div>

            {/* TAB: Stats & Indicators */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-display">Visão Geral da Plataforma</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    Estes números representam os gatilhos de prova social dinâmicos exibidos nas seções "Estatísticas" e "Por que comprar" do site.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Professores Ativos</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <input 
                        type="number"
                        value={localSettings.teachersCount}
                        onChange={(e) => setLocalSettings({ ...localSettings, teachersCount: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg py-1 px-2.5 text-white font-mono text-xl font-bold w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total de Materiais</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <BookOpen className="w-5 h-5 text-teal-500" />
                      <input 
                        type="number"
                        value={localSettings.materialsCount}
                        onChange={(e) => setLocalSettings({ ...localSettings, materialsCount: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg py-1 px-2.5 text-white font-mono text-xl font-bold w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Downloads Feitos</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Hash className="w-5 h-5 text-amber-500" />
                      <input 
                        type="number"
                        value={localSettings.downloadsCount}
                        onChange={(e) => setLocalSettings({ ...localSettings, downloadsCount: parseInt(e.target.value) || 0 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg py-1 px-2.5 text-white font-mono text-xl font-bold w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Taxa de Satisfação (%)</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Percent className="w-5 h-5 text-red-500" />
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={localSettings.satisfactionRate}
                        onChange={(e) => setLocalSettings({ ...localSettings, satisfactionRate: parseInt(e.target.value) || 98 })}
                        className="bg-slate-950 border border-slate-700 rounded-lg py-1 px-2.5 text-white font-mono text-xl font-bold w-full focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                  <h4 className="font-bold text-white text-md mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Simulador e Prototipagem Avançada
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Você pode alterar qualquer número ou link nos painéis ao lado. As modificações atualizam o site instantaneamente no navegador para validação imediata, simulando uma integração completa de backend sem a necessidade de banco de dados externo persistente.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Indicadores
                  </button>
                  <button
                    onClick={handleResetDefaultSettings}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-sm px-5 py-3 rounded-xl border border-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resetar Padrões
                  </button>
                </div>
              </div>
            )}

            {/* TAB: Disciplines Management */}
            {activeTab === 'disciplines' && (
              <div className="space-y-6">
                
                {/* Back Button for add/edit */}
                {(selectedDiscipline || isAddingDiscipline) ? (
                  <div>
                    <button
                      onClick={() => { setSelectedDiscipline(null); setIsAddingDiscipline(false); }}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para Lista de Disciplinas
                    </button>
                    
                    <h3 className="text-xl font-bold text-white tracking-tight font-display">
                      {isAddingDiscipline ? 'Cadastrar Nova Disciplina' : `Editar Disciplina: ${selectedDiscipline?.name}`}
                    </h3>

                    <form onSubmit={handleSaveDiscipline} className="space-y-4 mt-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">ID Único (slug)</label>
                          <input 
                            type="text" 
                            name="id"
                            placeholder="ex: geo, hist, bio"
                            required
                            disabled={!isAddingDiscipline}
                            defaultValue={selectedDiscipline?.id || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono disabled:opacity-50"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Nome da Disciplina</label>
                          <input 
                            type="text" 
                            name="name"
                            placeholder="ex: Geografia, Sociologia"
                            required
                            defaultValue={selectedDiscipline?.name || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Emoji</label>
                          <input 
                            type="text" 
                            name="emoji"
                            placeholder="ex: 🌍, 📜"
                            required
                            defaultValue={selectedDiscipline?.emoji || '📚'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-center focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Grade Escolar</label>
                          <select 
                            name="grade"
                            defaultValue={selectedDiscipline?.grade || 'Ambos'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Ensino Fundamental II">Ensino Fundamental II</option>
                            <option value="Ensino Médio">Ensino Médio</option>
                            <option value="Ambos">Ambos</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Preço Promocional (R$)</label>
                          <input 
                            type="number" 
                            name="price"
                            step="0.01"
                            required
                            defaultValue={selectedDiscipline?.price || 47.00}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Preço Sem Desconto (R$)</label>
                          <input 
                            type="number" 
                            name="originalPrice"
                            step="0.01"
                            required
                            defaultValue={selectedDiscipline?.originalPrice || 147.00}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Esquema de Cores do Card</label>
                        <select 
                          name="colorPreset"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          {colorPresets.map((preset, idx) => (
                            <option key={idx} value={idx}>{preset.name} - Estilo Colorido</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Descrição Curta (exibida no card)</label>
                        <input 
                          type="text" 
                          name="description"
                          placeholder="ex: Planejamentos de Geografia do 6º ao 9º ano e Ensino Médio."
                          required
                          defaultValue={selectedDiscipline?.description || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Imagem de Demonstração (URL)</label>
                        <input 
                          type="url" 
                          name="image"
                          placeholder="https://images.unsplash.com/..."
                          defaultValue={selectedDiscipline?.image || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Descrição Longa (exibida na Amostra Grátis)</label>
                        <textarea 
                          name="longDescription"
                          rows={3}
                          required
                          placeholder="Escreva um texto convincente sobre a importância desse material pedagógico..."
                          defaultValue={selectedDiscipline?.longDescription || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Grade de Conteúdo da Apostila (um item por linha)</label>
                        <textarea 
                          name="sampleContents"
                          rows={5}
                          required
                          placeholder="Plano de Aula Anual Completo&#10;Banco de Questões Resolvidas&#10;Slides Editáveis em PowerPoint..."
                          defaultValue={selectedDiscipline?.sampleContents.join('\n') || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          {isAddingDiscipline ? 'Cadastrar Disciplina' : 'Salvar Alterações'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedDiscipline(null); setIsAddingDiscipline(false); }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>

                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight font-display">Grade de Disciplinas</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Adicione ou edite os 16 cards de disciplinas pedagógicas exibidos na tela principal do site.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingDiscipline(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 self-start"
                      >
                        <Plus className="w-4 h-4" />
                        Nova Disciplina
                      </button>
                    </div>

                    {/* Disciplines table list */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-3">Emoji</th>
                              <th className="px-4 py-3">Nome</th>
                              <th className="px-4 py-3">Público Alvo</th>
                              <th className="px-4 py-3 text-right">Preço (R$)</th>
                              <th className="px-4 py-3 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {disciplines.map(d => (
                              <tr key={d.id} className="hover:bg-slate-900/30">
                                <td className="px-4 py-3.5 text-lg text-center select-none">{d.emoji}</td>
                                <td className="px-4 py-3.5 font-bold text-white">{d.name}</td>
                                <td className="px-4 py-3.5">
                                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700">
                                    {d.grade}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-500">
                                  R$ {d.price.toFixed(2)}
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button 
                                      onClick={() => setSelectedDiscipline(d)}
                                      className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-colors"
                                      title="Editar"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteDiscipline(d.id, d.name)}
                                      className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-colors"
                                      title="Excluir"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: Materials Management */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                
                {(selectedMaterial || isAddingMaterial) ? (
                  <div>
                    <button
                      onClick={() => { setSelectedMaterial(null); setIsAddingMaterial(false); }}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para Lista de Apostilas
                    </button>
                    
                    <h3 className="text-xl font-bold text-white tracking-tight font-display">
                      {isAddingMaterial ? 'Adicionar Novo Material Pedagógico' : `Editar Material: ${selectedMaterial?.title}`}
                    </h3>

                    <form onSubmit={handleSaveMaterial} className="space-y-4 mt-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Título do Material</label>
                        <input 
                          type="text" 
                          name="title"
                          placeholder="ex: Apostila Completa de Matemática Básica"
                          required
                          defaultValue={selectedMaterial?.title || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Disciplina Associada</label>
                          <select 
                            name="disciplineId"
                            defaultValue={selectedMaterial?.disciplineId || disciplines[0]?.id || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          >
                            {disciplines.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Formato do Arquivo</label>
                          <input 
                            type="text" 
                            name="fileFormat"
                            placeholder="ex: Word (.docx) 100% Editável"
                            required
                            defaultValue={selectedMaterial?.fileFormat || 'Word (.docx) 100% Editável'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Preço com Desconto (R$)</label>
                          <input 
                            type="number" 
                            name="price"
                            step="0.01"
                            required
                            defaultValue={selectedMaterial?.price || 47.00}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-right focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Preço Normal (R$)</label>
                          <input 
                            type="number" 
                            name="originalPrice"
                            step="0.01"
                            required
                            defaultValue={selectedMaterial?.originalPrice || 147.00}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-right focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Nº de Páginas</label>
                          <input 
                            type="number" 
                            name="pages"
                            required
                            defaultValue={selectedMaterial?.pages || 250}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-center focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Imagem de Capa (URL)</label>
                        <input 
                          type="url" 
                          name="image"
                          placeholder="https://images.unsplash.com/..."
                          defaultValue={selectedMaterial?.image || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Resumo Descritivo (focado em vendas)</label>
                        <textarea 
                          name="description"
                          rows={3}
                          required
                          placeholder="Escreva uma chamada atrativa de conversão e descrição do material..."
                          defaultValue={selectedMaterial?.description || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          {isAddingMaterial ? 'Adicionar Material' : 'Salvar Alterações'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedMaterial(null); setIsAddingMaterial(false); }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>

                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight font-display">Materiais Pedagógicos & Apostilas</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Gerencie os produtos apresentados no Carrossel de "Mais Vendidos" e "Destaques".
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingMaterial(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 self-start"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Produto
                      </button>
                    </div>

                    {/* Materials grid list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {materials.map(m => (
                        <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4">
                          <img 
                            src={m.image} 
                            alt={m.title} 
                            className="w-20 h-24 object-cover rounded-lg border border-slate-800 flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{m.disciplineName}</span>
                              <h4 className="font-bold text-white text-sm line-clamp-1 leading-tight mt-0.5">{m.title}</h4>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-1 leading-normal">{m.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                              <span className="text-xs font-mono font-bold text-emerald-500">R$ {m.price.toFixed(2)}</span>
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => setSelectedMaterial(m)}
                                  className="p-1 rounded-md bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-colors"
                                >
                                  <Edit3 className="w-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMaterial(m.id, m.title)}
                                  className="p-1 rounded-md bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: Testimonials Management */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                
                {(selectedTestimonial || isAddingTestimonial) ? (
                  <div>
                    <button
                      onClick={() => { setSelectedTestimonial(null); setIsAddingTestimonial(false); }}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-semibold mb-4 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para Lista de Depoimentos
                    </button>
                    
                    <h3 className="text-xl font-bold text-white tracking-tight font-display">
                      {isAddingTestimonial ? 'Cadastrar Novo Depoimento' : `Editar Depoimento de ${selectedTestimonial?.name}`}
                    </h3>

                    <form onSubmit={handleSaveTestimonial} className="space-y-4 mt-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Nome Completo</label>
                          <input 
                            type="text" 
                            name="name"
                            required
                            defaultValue={selectedTestimonial?.name || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Cargo / Atuação Docente</label>
                          <input 
                            type="text" 
                            name="role"
                            placeholder="ex: Professora de Geografia do Ensino Médio"
                            required
                            defaultValue={selectedTestimonial?.role || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Cidade</label>
                          <input 
                            type="text" 
                            name="city"
                            required
                            defaultValue={selectedTestimonial?.city || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1.5">Estado (Sigla)</label>
                          <input 
                            type="text" 
                            name="state"
                            maxLength={2}
                            required
                            placeholder="ex: SP, RJ, MG"
                            defaultValue={selectedTestimonial?.state || ''}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white text-center focus:outline-none focus:border-blue-500 uppercase font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">URL do Avatar / Foto do Professor</label>
                        <input 
                          type="url" 
                          name="avatar"
                          placeholder="https://images.unsplash.com/..."
                          defaultValue={selectedTestimonial?.avatar || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5">Comentário / Avaliação Positiva</label>
                        <textarea 
                          name="comment"
                          rows={4}
                          required
                          placeholder="Escreva o depoimento autêntico da professora relatando como o material transformou a rotina letiva dela..."
                          defaultValue={selectedTestimonial?.comment || ''}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          {isAddingTestimonial ? 'Cadastrar Depoimento' : 'Salvar Alterações'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedTestimonial(null); setIsAddingTestimonial(false); }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>

                    </form>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight font-display">Gestão de Depoimentos</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          Cadastre e edite as avaliações dos professores exibidas no carrossel de prova social do site.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsAddingTestimonial(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 self-start"
                      >
                        <Plus className="w-4 h-4" />
                        Novo Depoimento
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {testimonials.map(t => (
                        <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={t.avatar} 
                              alt={t.name} 
                              className="w-10 h-10 object-cover rounded-full border border-slate-800 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-white text-sm">{t.name}</h4>
                              <span className="text-[10px] text-slate-400 font-medium block">{t.role} • {t.city}-{t.state}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                            "{t.comment}"
                          </p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                            <span className="text-[10px] font-bold text-emerald-500">★★★★★ Compra Confirmada</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setSelectedTestimonial(t)}
                                className="p-1 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-colors"
                              >
                                <Edit3 className="w-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTestimonial(t.id, t.name)}
                                className="p-1 rounded bg-red-600/10 hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: General Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-display">Canais de Atendimento & Links</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Gerencie o link global de checkout de compra, WhatsApp de suporte e links de redes sociais.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Link2 className="w-4 h-4 text-blue-500" />
                      Link de Compra Global (PURCHASE_URL)
                    </label>
                    <input 
                      type="url"
                      value={localSettings.purchaseUrl}
                      onChange={(e) => setLocalSettings({ ...localSettings, purchaseUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 leading-normal block mt-1.5">
                      Todos os botões "Comprar Agora", "QUERO MEUS MATERIAIS" e de checkout do carrinho direcionarão em nova aba para esta URL.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        Número WhatsApp (DDD + Número)
                      </label>
                      <input 
                        type="text"
                        value={localSettings.whatsappNumber}
                        onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-blue-400" />
                        E-mail de Suporte ao Cliente
                      </label>
                      <input 
                        type="email"
                        value={localSettings.contactEmail}
                        onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Mensagem Inicial WhatsApp</label>
                    <input 
                      type="text"
                      value={localSettings.whatsappMessage}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappMessage: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Instagram URL</label>
                      <input 
                        type="url"
                        value={localSettings.instagramUrl}
                        onChange={(e) => setLocalSettings({ ...localSettings, instagramUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Facebook URL</label>
                      <input 
                        type="url"
                        value={localSettings.facebookUrl}
                        onChange={(e) => setLocalSettings({ ...localSettings, facebookUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">YouTube URL</label>
                      <input 
                        type="url"
                        value={localSettings.youtubeUrl}
                        onChange={(e) => setLocalSettings({ ...localSettings, youtubeUrl: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações Gerais
                  </button>
                  <button
                    onClick={handleResetDefaultSettings}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
                  >
                    Redefinir Padrões
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
