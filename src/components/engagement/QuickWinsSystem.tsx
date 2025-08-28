import { useState, useEffect } from 'react';
import { Star, Trophy, Target, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useConfettiStore } from "@/stores/confettiStore";

interface QuickWinsSystemProps {
  questionsAnswered: number;
  correctAnswers: number;
  onAchievement?: (achievement: string) => void;
}

interface QuickWin {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  threshold: number;
  type: 'questions' | 'correct' | 'streak';
}

const QuickWinsSystem = ({ 
  questionsAnswered, 
  correctAnswers, 
  onAchievement 
}: QuickWinsSystemProps) => {
  const [quickWins, setQuickWins] = useState<QuickWin[]>([
    {
      id: 'first_try',
      title: 'Primeiro Passo!',
      description: 'Responda sua primeira questão',
      icon: <Star className="text-yellow-400" size={20} />,
      completed: false,
      threshold: 1,
      type: 'questions'
    },
    {
      id: 'first_correct',
      title: 'Primeiro Acerto!',
      description: 'Acerte sua primeira questão',
      icon: <CheckCircle className="text-green-400" size={20} />,
      completed: false,
      threshold: 1,
      type: 'correct'
    },
    {
      id: 'early_achiever',
      title: 'Bom Começo!',
      description: 'Responda 3 questões',
      icon: <Target className="text-blue-400" size={20} />,
      completed: false,
      threshold: 3,
      type: 'questions'
    },
    {
      id: 'confidence_builder',
      title: 'Construindo Confiança!',
      description: 'Acerte 3 questões',
      icon: <Trophy className="text-orange-400" size={20} />,
      completed: false,
      threshold: 3,
      type: 'correct'
    }
  ]);

  const { toast } = useToast();
  const confetti = useConfettiStore();

  useEffect(() => {
    checkForCompletedWins();
  }, [questionsAnswered, correctAnswers]);

  const checkForCompletedWins = () => {
    setQuickWins(prev => {
      let hasNewWin = false;
      const updated = prev.map(win => {
        if (win.completed) return win;

        const shouldComplete = 
          (win.type === 'questions' && questionsAnswered >= win.threshold) ||
          (win.type === 'correct' && correctAnswers >= win.threshold);

        if (shouldComplete) {
          hasNewWin = true;
          triggerWinCelebration(win);
          if (onAchievement) onAchievement(win.id);
          return { ...win, completed: true };
        }
        return win;
      });

      return updated;
    });
  };

  const triggerWinCelebration = (win: QuickWin) => {
    // Trigger confetti for first achievements
    if (win.id === 'first_correct' || win.id === 'first_try') {
      confetti.pop();
    }

    toast({
      title: `🎉 ${win.title}`,
      description: win.description,
      duration: 4000
    });
  };

  const completedWins = quickWins.filter(w => w.completed);
  const nextWin = quickWins.find(w => !w.completed);

  if (completedWins.length === 0 && questionsAnswered === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Star className="text-primary" size={20} />
          Quick Wins
        </h3>
        <div className="text-sm text-muted-foreground">
          {completedWins.length}/{quickWins.length}
        </div>
      </div>

      <div className="space-y-2">
        {completedWins.slice(-2).map(win => (
          <div 
            key={win.id}
            className="flex items-center gap-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
          >
            {win.icon}
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{win.title}</div>
              <div className="text-xs text-muted-foreground">{win.description}</div>
            </div>
            <CheckCircle className="text-green-500" size={16} />
          </div>
        ))}

        {nextWin && (
          <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg border border-border">
            {nextWin.icon}
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{nextWin.title}</div>
              <div className="text-xs text-muted-foreground">{nextWin.description}</div>
            </div>
            <div className="text-xs text-muted-foreground">
              {nextWin.type === 'questions' ? questionsAnswered : correctAnswers}/{nextWin.threshold}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickWinsSystem;