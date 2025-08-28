import { useState, useEffect } from 'react';
import { CheckCircle, Circle, ArrowRight, BookOpen, Target, User, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GuidedJourneyProps {
  questionsAnswered: number;
  hasProfile: boolean;
  onNavigate: (section: string) => void;
}

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action: string;
  actionLabel: string;
  points: number;
}

const GuidedJourney = ({ 
  questionsAnswered, 
  hasProfile, 
  onNavigate 
}: GuidedJourneyProps) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [steps, setSteps] = useState<JourneyStep[]>([
    {
      id: 'complete_profile',
      title: 'Complete seu Perfil',
      description: 'Adicione suas informações para uma experiência personalizada',
      icon: <User className="text-blue-500" size={20} />,
      completed: false,
      action: 'profile',
      actionLabel: 'Ir para Perfil',
      points: 50
    },
    {
      id: 'first_question',
      title: 'Responda sua Primeira Questão',
      description: 'Experimente nossa metodologia de ensino',
      icon: <BookOpen className="text-green-500" size={20} />,
      completed: false,
      action: 'questions',
      actionLabel: 'Começar Questões',
      points: 25
    },
    {
      id: 'try_different_areas',
      title: 'Explore Diferentes Áreas',
      description: 'Teste seu conhecimento em várias matérias',
      icon: <Target className="text-orange-500" size={20} />,
      completed: false,
      action: 'areas',
      actionLabel: 'Ver Áreas',
      points: 75
    },
    {
      id: 'complete_study_session',
      title: 'Complete uma Sessão de Estudo',
      description: 'Responda pelo menos 5 questões em sequência',
      icon: <CheckCircle className="text-purple-500" size={20} />,
      completed: false,
      action: 'study',
      actionLabel: 'Iniciar Sessão',
      points: 100
    }
  ]);

  useEffect(() => {
    updateStepsCompletion();
  }, [questionsAnswered, hasProfile]);

  const updateStepsCompletion = () => {
    setSteps(prev => {
      let newTotalPoints = 0;
      const updated = prev.map(step => {
        let completed = false;
        
        switch (step.id) {
          case 'complete_profile':
            completed = hasProfile;
            break;
          case 'first_question':
            completed = questionsAnswered >= 1;
            break;
          case 'try_different_areas':
            completed = questionsAnswered >= 3;
            break;
          case 'complete_study_session':
            completed = questionsAnswered >= 5;
            break;
        }

        if (completed && !step.completed) {
          newTotalPoints += step.points;
        }

        return { ...step, completed };
      });

      if (newTotalPoints > 0) {
        setTotalPoints(prev => prev + newTotalPoints);
      }

      return updated;
    });
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const nextStep = steps.find(s => !s.completed);
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (completedSteps === steps.length) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 border-green-200 dark:border-green-800">
        <div className="text-center">
          <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            🎉 Parabéns! Jornada Inicial Completa!
          </h3>
          <p className="text-muted-foreground mb-4">
            Você ganhou {totalPoints} pontos e está pronto para estudar de forma eficiente!
          </p>
          <Button 
            onClick={() => onNavigate('advanced')}
            className="bg-green-600 hover:bg-green-700"
          >
            Explorar Funcionalidades Avançadas
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-primary/20">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            Sua Jornada de Estudo
          </h3>
          <div className="text-sm text-muted-foreground">
            {completedSteps}/{steps.length} concluídas
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Progresso: {Math.round(progressPercentage)}%</span>
          <span>Pontos: {totalPoints}</span>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              step.completed 
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                : nextStep?.id === step.id
                ? 'bg-primary/10 border-primary/30'
                : 'bg-muted/30 border-border/50'
            }`}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : nextStep?.id === step.id ? (
                <Circle className="text-primary" size={24} />
              ) : (
                <Circle className="text-muted-foreground" size={24} />
              )}
            </div>

            <div className="flex-shrink-0">
              {step.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {step.completed ? (
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{step.points} pts
                </div>
              ) : nextStep?.id === step.id ? (
                <Button 
                  size="sm" 
                  onClick={() => onNavigate(step.action)}
                  className="h-8 text-xs"
                >
                  {step.actionLabel}
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {nextStep && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <ArrowRight className="text-primary" size={16} />
            <span className="font-medium">Próximo passo:</span>
            <span>{nextStep.title}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default GuidedJourney;