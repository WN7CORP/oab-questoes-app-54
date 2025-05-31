
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, ChevronRight, ChevronLeft, PlayCircle, Award, Target, Zap } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  steps: OnboardingStep[];
}

const OnboardingOverlay = ({ isVisible, onComplete, onSkip, steps }: OnboardingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible && currentStep === 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentStep]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className={`bg-netflix-card border-netflix-border max-w-md w-full p-6 transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {step.icon && <div className="text-netflix-red">{step.icon}</div>}
            <h3 className="text-lg font-semibold text-white">
              Passo {currentStep + 1} de {steps.length}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-netflix-text-secondary hover:text-white"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6" />

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>
          <p className="text-netflix-text-secondary leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Action Button */}
        {step.action && (
          <div className="mb-6">
            <Button
              onClick={step.action.onClick}
              className="w-full bg-netflix-red hover:bg-red-700"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              {step.action.label}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Anterior
          </Button>

          <div className="flex gap-1">
            {steps.map((_, index) => (
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
            className="bg-netflix-red hover:bg-red-700 flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Skip option */}
        <div className="text-center mt-4">
          <button
            onClick={onSkip}
            className="text-sm text-netflix-text-secondary hover:text-white transition-colors"
          >
            Pular tutorial
          </button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingOverlay;
