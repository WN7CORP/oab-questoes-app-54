
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, BookOpen, Trophy, Users, Award, TrendingUp, Clock, Star, CheckCircle2, Play } from 'lucide-react';

interface EnhancedWelcomeScreenProps {
  onStartDemo: () => void;
  onStartOnboarding: () => void;
  onSkipToApp: () => void;
}

const EnhancedWelcomeScreen = ({ onStartDemo, onStartOnboarding, onSkipToApp }: EnhancedWelcomeScreenProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Aprovada OAB 2024",
      text: "As questões comentadas me ajudaram a entender exatamente o que a banca espera. Passei na primeira tentativa!",
      rating: 5
    },
    {
      name: "Carlos Santos",
      role: "Aprovado OAB 2024",
      text: "O sistema de simulados é idêntico ao exame real. Me senti preparado e confiante no dia da prova.",
      rating: 5
    },
    {
      name: "Maria Oliveira",
      role: "Aprovada OAB 2023",
      text: "Estudei por 3 meses usando apenas esta plataforma. O conteúdo é completo e muito bem organizado.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50.000+", label: "Questões Comentadas", icon: BookOpen },
    { number: "85%", label: "Taxa de Aprovação", icon: Trophy },
    { number: "10.000+", label: "Estudantes Aprovados", icon: Users },
    { number: "15+", label: "Áreas do Direito", icon: Scale }
  ];

  const features = [
    {
      icon: <Award className="text-yellow-400" size={24} />,
      title: "Questões Originais",
      description: "Todas as questões são dos exames oficiais da OAB, organizadas por área e comentadas por especialistas."
    },
    {
      icon: <TrendingUp className="text-green-400" size={24} />,
      title: "Progresso Inteligente",
      description: "Acompanhe sua evolução com estatísticas detalhadas e identifique pontos de melhoria."
    },
    {
      icon: <Clock className="text-blue-400" size={24} />,
      title: "Simulados Cronometrados",
      description: "Pratique em condições reais de prova com nossos simulados cronometrados."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-netflix-black via-gray-900 to-netflix-black">
      {/* Hero Section */}
      <div className="relative px-6 pt-12 pb-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-8 animate-fade-in">
            <div className="bg-netflix-red rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Scale size={40} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              OAB Questões
            </h1>
            <p className="text-2xl text-netflix-red font-semibold mb-2">
              Comentadas
            </p>
            <p className="text-xl text-netflix-text-secondary max-w-3xl mx-auto leading-relaxed">
              A plataforma mais completa para sua aprovação na OAB. 
              Milhares de questões comentadas, simulados reais e acompanhamento de progresso.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {stats.map((stat, index) => (
              <Card key={index} className="bg-netflix-card/80 border-netflix-border p-6 hover:scale-105 transition-transform">
                <stat.icon className="text-netflix-red mx-auto mb-3" size={32} />
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-netflix-text-secondary">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button 
              onClick={onStartDemo}
              className="bg-netflix-red hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 flex items-center gap-3"
            >
              <Play size={24} />
              Experimentar Grátis
              <Badge className="bg-green-600 text-white ml-2">Sem cadastro</Badge>
            </Button>
            
            <Button 
              onClick={onStartOnboarding}
              variant="outline"
              className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            >
              Fazer Tour Guiado
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-12 bg-netflix-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Por que escolher o OAB Questões?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-netflix-card border-netflix-border p-6 hover:bg-gray-800 transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-netflix-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            O que dizem nossos aprovados
          </h2>
          
          <Card className="bg-netflix-card border-netflix-border p-8 mb-6">
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
            
            <blockquote className="text-lg text-netflix-text-secondary mb-6 italic leading-relaxed">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            
            <div className="text-white font-semibold">
              {testimonials[currentTestimonial].name}
            </div>
            <div className="text-netflix-text-secondary text-sm">
              {testimonials[currentTestimonial].role}
            </div>
          </Card>

          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-netflix-red' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-12 bg-gradient-to-r from-netflix-red/20 to-red-800/20 border-t border-netflix-red/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar sua jornada rumo à aprovação?
          </h2>
          <p className="text-xl text-netflix-text-secondary mb-8">
            Junte-se a milhares de estudantes que já conquistaram sua aprovação na OAB
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onStartDemo}
              className="bg-netflix-red hover:bg-red-700 text-white px-10 py-6 text-xl font-bold rounded-lg transition-all duration-200 hover:scale-105"
            >
              <CheckCircle2 className="mr-3 h-6 w-6" />
              Começar Agora - É Grátis!
            </Button>
          </div>

          <p className="text-netflix-text-secondary text-sm mt-6">
            Sem necessidade de cartão de crédito • Acesso imediato • Cancele quando quiser
          </p>
        </div>
      </div>

      {/* Skip to App */}
      <div className="text-center py-6">
        <button
          onClick={onSkipToApp}
          className="text-netflix-text-secondary hover:text-white transition-colors text-sm"
        >
          Já sou usuário - Ir direto para o app →
        </button>
      </div>
    </div>
  );
};

export default EnhancedWelcomeScreen;
