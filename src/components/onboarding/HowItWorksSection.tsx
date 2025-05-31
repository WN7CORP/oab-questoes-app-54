
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, BarChart3, Trophy, ArrowRight, PlayCircle } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartDemo: () => void;
}

const HowItWorksSection = ({ onStartDemo }: HowItWorksSectionProps) => {
  const steps = [
    {
      icon: <BookOpen className="text-blue-400" size={32} />,
      title: "1. Escolha sua Área",
      description: "Selecione a disciplina que quer estudar ou faça um simulado completo",
      image: "📚"
    },
    {
      icon: <PlayCircle className="text-green-400" size={32} />,
      title: "2. Responda as Questões",
      description: "Questões reais de provas anteriores com interface idêntica ao exame",
      image: "✍️"
    },
    {
      icon: <Clock className="text-yellow-400" size={32} />,
      title: "3. Veja os Comentários",
      description: "Cada questão tem explicação detalhada da resposta correta e incorretas",
      image: "💡"
    },
    {
      icon: <BarChart3 className="text-purple-400" size={32} />,
      title: "4. Acompanhe o Progresso",
      description: "Estatísticas detalhadas mostram sua evolução e pontos de melhoria",
      image: "📊"
    }
  ];

  const features = [
    { icon: "⚡", text: "Feedback instantâneo" },
    { icon: "🎯", text: "Questões por dificuldade" },
    { icon: "⏱️", text: "Simulados cronometrados" },
    { icon: "📱", text: "Funciona no celular" }
  ];

  return (
    <div className="bg-netflix-card/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Como Funciona o OAB Questões?
          </h2>
          <p className="text-xl text-netflix-text-secondary max-w-3xl mx-auto">
            Uma metodologia comprovada para maximizar sua preparação em 4 passos simples
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="bg-netflix-card border-netflix-border p-6 text-center hover:scale-105 transition-transform duration-200">
              <div className="text-4xl mb-4">{step.image}</div>
              <div className="flex justify-center mb-3">{step.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-netflix-text-secondary text-sm leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 bg-netflix-card/50 p-3 rounded-lg">
              <span className="text-xl">{feature.icon}</span>
              <span className="text-white text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Demo CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-netflix-red/20 to-red-800/20 border-netflix-red/30 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pronto para Experimentar?
            </h3>
            <p className="text-netflix-text-secondary mb-6">
              Faça sua primeira questão agora e veja como funciona nossa metodologia
            </p>
            
            <Button
              onClick={onStartDemo}
              className="bg-netflix-red hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold"
            >
              <Trophy className="mr-2 h-6 w-6" />
              Experimentar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-netflix-text-secondary text-sm mt-4">
              ✨ Sem cadastro • Sem compromisso • Resultado na hora
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
