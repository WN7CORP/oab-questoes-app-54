
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Lightbulb, ArrowRight } from 'lucide-react';

interface TooltipStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface FirstTimeTooltipsProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const FirstTimeTooltips = ({ isVisible, onComplete, onSkip }: FirstTimeTooltipsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const tooltipSteps: TooltipStep[] = [
    {
      id: 'simulado-tab',
      target: '[data-state="inactive"][value="simulado"]',
      title: '🏆 Simulados Completos',
      description: 'Pratique com provas completas e cronometradas, idênticas ao exame real.',
      position: 'bottom'
    },
    {
      id: 'areas-tab',
      target: '[data-state="inactive"][value="areas"]',
      title: '📚 Estudo por Áreas',
      description: 'Foque nas disciplinas que mais precisa melhorar com questões organizadas.',
      position: 'bottom'
    },
    {
      id: 'performance-tab',
      target: '[data-state="inactive"][value="performance"]',
      title: '📊 Acompanhe seu Progresso',
      description: 'Veja suas estatísticas detalhadas e identifique pontos de melhoria.',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    if (isVisible && currentStep < tooltipSteps.length) {
      const timer = setTimeout(() => {
        updateTooltipPosition();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentStep]);

  const updateTooltipPosition = () => {
    const currentTooltip = tooltipSteps[currentStep];
    const targetElement = document.querySelector(currentTooltip.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = 120;
      
      let top = 0;
      let left = 0;

      switch (currentTooltip.position) {
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'top':
          top = rect.top - tooltipHeight - 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 10;
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 10;
          break;
      }

      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 10) left = 10;
      if (left + tooltipWidth > viewportWidth - 10) left = viewportWidth - tooltipWidth - 10;
      if (top < 10) top = 10;
      if (top + tooltipHeight > viewportHeight - 10) top = viewportHeight - tooltipHeight - 10;

      setTooltipPosition({ top, left });
    }
  };

  const handleNext = () => {
    if (currentStep < tooltipSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isVisible || currentStep >= tooltipSteps.length) {
    return null;
  }

  const currentTooltip = tooltipSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={handleSkip} />
      
      {/* Tooltip */}
      <Card
        className="fixed z-50 bg-netflix-card border-netflix-border p-4 max-w-sm animate-scale-in"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '320px'
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-400" size={20} />
            <span className="text-netflix-red text-sm font-medium">
              Dica {currentStep + 1}/{tooltipSteps.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-netflix-text-secondary hover:text-white p-1 h-auto"
          >
            <X size={16} />
          </Button>
        </div>

        <h3 className="text-white font-semibold mb-2">
          {currentTooltip.title}
        </h3>
        
        <p className="text-netflix-text-secondary text-sm mb-4 leading-relaxed">
          {currentTooltip.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {tooltipSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-netflix-red' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            size="sm"
            className="bg-netflix-red hover:bg-red-700 text-white"
          >
            {currentStep === tooltipSteps.length - 1 ? 'Entendi!' : 'Próxima'}
            <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>

        {/* Arrow pointer */}
        <div
          className={`absolute w-0 h-0 border-solid ${
            currentTooltip.position === 'bottom'
              ? 'border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-netflix-border -top-2 left-1/2 transform -translate-x-1/2'
              : currentTooltip.position === 'top'
              ? 'border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-netflix-border -bottom-2 left-1/2 transform -translate-x-1/2'
              : currentTooltip.position === 'right'
              ? 'border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-netflix-border -left-2 top-1/2 transform -translate-y-1/2'
              : 'border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-netflix-border -right-2 top-1/2 transform -translate-y-1/2'
          }`}
        />
      </Card>
    </>
  );
};

export default FirstTimeTooltips;
