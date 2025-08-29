import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Target, Trophy, TrendingUp, Clock, ChevronRight, Play, Zap, Award, Users, FileText } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import QuestionsSection from './QuestionsSection';
import DailyChallenge from './DailyChallenge';
import OabTipsCarousel from './OabTipsCarousel';
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  ano: string;
  exame: string;
  area: string;
  numero: string;
  enunciado: string;
  alternativa_a: string;
  alternativa_b: string;
  alternativa_c: string;
  alternativa_d: string;
  resposta_correta: string;
  justificativa: string;
  banca: string;
}

interface HomeSectionProps {
  onHideNavigation?: (hide: boolean) => void;
}

const HomeSection = ({ onHideNavigation }: HomeSectionProps) => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showRandomQuestions, setShowRandomQuestions] = useState(false);
  const [showSimulado, setShowSimulado] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAreas: 0,
    totalExams: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('area, exame, ano');
      
      if (error) {
        console.error('Error fetching stats:', error);
      } else {
        const uniqueAreas = new Set(data?.map(item => item.area).filter(Boolean));
        const uniqueExams = new Set(data?.map(item => `${item.exame}-${item.ano}`).filter(item => !item.includes('null')));
        
        setStats({
          totalQuestions: data?.length || 0,
          totalAreas: uniqueAreas.size,
          totalExams: uniqueExams.size
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    setShowQuestions(true);
    setShowRandomQuestions(false);
    setShowSimulado(false);
    setShowDailyChallenge(false);
  };

  const handleRandomQuestions = () => {
    setSelectedArea('');
    setShowRandomQuestions(true);
    setShowQuestions(true);
    setShowSimulado(false);
    setShowDailyChallenge(false);
  };

  const handleSimuladoAccess = () => {
    setShowSimulado(true);
    setShowQuestions(false);
    setShowRandomQuestions(false);
    setShowDailyChallenge(false);
  };

  const handleDailyChallenge = () => {
    setShowDailyChallenge(true);
    setShowQuestions(true);
    setShowRandomQuestions(false);
    setShowSimulado(false);
    setSelectedArea('');
  };

  const handleBackToHome = () => {
    setShowQuestions(false);
    setShowRandomQuestions(false);
    setSelectedArea('');
    setShowDailyChallenge(false);
    // Mostrar menu novamente quando voltar para o início
    if (onHideNavigation) {
      onHideNavigation(false);
    }
  };

  const popularAreas = [
    'Direito Constitucional', 
    'Direito Civil', 
    'Direito Penal', 
    'Direito Processual Civil', 
    'Direito do Trabalho', 
    'Direito Administrativo'
  ];

  if (showQuestions && !showSimulado) {
    return (
      <div className="h-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-gray-800 border-l-4 border-netflix-red animate-fade-in">
            <button 
              onClick={handleBackToHome} 
              className="text-netflix-red hover:text-red-400 transition-all duration-200 font-semibold hover:scale-105"
            >
              ← Voltar ao Início
            </button>
            <h1 className="text-2xl font-bold text-white">
              {showDailyChallenge ? 'Desafio Diário - 20 Questões' : 
               showRandomQuestions ? 'Questões Aleatórias' : 
               `Estudando: ${selectedArea}`}
            </h1>
          </div>
          
          <QuestionsSection 
            selectedArea={showRandomQuestions ? undefined : selectedArea} 
            limit={showDailyChallenge ? 20 : showRandomQuestions ? 10 : 20} 
            isDailyChallenge={showDailyChallenge} 
            onHideNavigation={onHideNavigation} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <div className="text-center space-y-3 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-netflix-red rounded-full p-2 transition-transform duration-200 hover:scale-110">
            <Award className="text-white" size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            OAB Questões
          </h1>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-netflix-card border border-netflix-border rounded-lg p-3 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-netflix-red">
              {stats.totalQuestions.toLocaleString()}
            </div>
            <div className="text-xs text-netflix-text-secondary">
              Questões
            </div>
          </div>
          <div className="bg-netflix-card border border-netflix-border rounded-lg p-3 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-green-400">
              {stats.totalAreas}
            </div>
            <div className="text-xs text-netflix-text-secondary">
              Áreas
            </div>
          </div>
          <div className="bg-netflix-card border border-netflix-border rounded-lg p-3 transition-all duration-200 hover:scale-105">
            <div className="text-xl font-bold text-blue-400">
              {stats.totalExams}
            </div>
            <div className="text-xs text-netflix-text-secondary">
              Exames
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Section */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="text-orange-500" size={24} />
          Desafio Diário
        </h2>
        <DailyChallenge onStartChallenge={handleDailyChallenge} />
      </div>

      {/* OAB Tips Carousel */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Scale className="text-blue-500" size={24} />
          Dicas para o Sucesso na OAB
        </h2>
        <OabTipsCarousel />
      </div>

      {/* Main Study Options */}
      <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target className="text-netflix-red" size={24} />
          Como você quer estudar hoje?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Study by Area */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Scale className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Estudar por Área</h3>
                <p className="text-blue-200 text-sm">Foque em disciplinas específicas</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularAreas.slice(0, 3).map(area => (
                <button 
                  key={area} 
                  onClick={() => handleAreaSelect(area)} 
                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 px-2 py-1 rounded-full text-xs transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          </Card>

          {/* Random Questions */}
          <Card 
            className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50 p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl" 
            onClick={handleRandomQuestions}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-600 rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Questões Rápidas</h3>
                <p className="text-green-200 text-sm">Prática mista e dinâmica</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-200">
              <Play size={16} />
              <span className="text-sm font-medium">Começar Agora</span>
            </div>
          </Card>

          {/* Simulado */}
          <Card 
            className="bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50 p-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl" 
            onClick={handleSimuladoAccess}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-netflix-red rounded-lg p-2 group-hover:scale-110 transition-transform">
                <Trophy className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Simulado Completo</h3>
                <p className="text-red-200 text-sm">Provas reais de exames anteriores</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-red-200">
              <Clock size={16} />
              <span className="text-sm font-medium">5h de duração</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Special Categories */}
      <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="text-netflix-red" size={20} />
          Categorias Especiais
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card 
            className="bg-netflix-card border-netflix-border p-3 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" 
            onClick={() => handleAreaSelect('Ética Profissional')}
          >
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                <Award size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Ética Profissional</h3>
                <p className="text-gray-400 text-xs">Estatuto da OAB</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-netflix-card border-netflix-border p-3 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" 
            onClick={() => handleAreaSelect('Direito Constitucional')}
          >
            <div className="flex items-center gap-2">
              <div className="bg-orange-600 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Constitucional</h3>
                <p className="text-gray-400 text-xs">Base do ordenamento</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-netflix-card border-netflix-border p-3 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" 
            onClick={() => handleAreaSelect('Direito Civil')}
          >
            <div className="flex items-center gap-2">
              <div className="bg-cyan-600 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Direito Civil</h3>
                <p className="text-gray-400 text-xs">Relações privadas</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-netflix-card border-netflix-border p-3 cursor-pointer hover:bg-gray-800 transition-all duration-200 group hover:scale-105" 
            onClick={() => handleAreaSelect('Direito Penal')}
          >
            <div className="flex items-center gap-2">
              <div className="bg-red-600 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
                <Target size={16} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Direito Penal</h3>
                <p className="text-gray-400 text-xs">Crimes e penas</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default HomeSection;