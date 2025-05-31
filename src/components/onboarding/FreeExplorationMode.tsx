
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Star, CheckCircle2, BookOpen, Trophy, Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseToQuestions } from '@/utils/questionTransform';
import { Question } from '@/types/question';
import StudySession from '../StudySession';

interface FreeExplorationModeProps {
  onUpgrade: () => void;
  onExit: () => void;
}

const FreeExplorationMode = ({ onUpgrade, onExit }: FreeExplorationModeProps) => {
  const [freeQuestions, setFreeQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inSession, setInSession] = useState(false);

  const FREE_QUESTIONS_LIMIT = 3;

  useEffect(() => {
    fetchFreeQuestions();
  }, []);

  const fetchFreeQuestions = async () => {
    try {
      // Buscar questões variadas de diferentes áreas
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('*')
        .in('area', ['Direito Constitucional', 'Direito Civil', 'Direito Penal'])
        .limit(FREE_QUESTIONS_LIMIT * 2); // Buscar mais para ter variedade

      if (error) {
        console.error('Error fetching free questions:', error);
      } else if (data && data.length > 0) {
        const transformedQuestions = transformSupabaseToQuestions(data);
        const shuffledQuestions = transformedQuestions
          .sort(() => Math.random() - 0.5)
          .slice(0, FREE_QUESTIONS_LIMIT);
        setFreeQuestions(shuffledQuestions);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    setInSession(true);
  };

  const handleSessionComplete = () => {
    setAnsweredQuestions(prev => prev + 1);
    
    if (answeredQuestions + 1 >= FREE_QUESTIONS_LIMIT) {
      setShowPaywall(true);
    } else {
      setInSession(false);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const benefits = [
    {
      icon: <BookOpen className="text-blue-400" size={20} />,
      title: "50.000+ Questões",
      description: "Banco completo com todas as provas"
    },
    {
      icon: <Trophy className="text-yellow-400" size={20} />,
      title: "Simulados Ilimitados",
      description: "Pratique quantas vezes quiser"
    },
    {
      icon: <Users className="text-green-400" size={20} />,
      title: "Comunidade Premium",
      description: "Tire dúvidas com outros estudantes"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Preparando questões gratuitas...</div>
      </div>
    );
  }

  if (showPaywall) {
    return (
      <div className="min-h-screen bg-netflix-black p-4">
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="bg-netflix-card border-netflix-border p-8 text-center">
            <div className="mb-6">
              <div className="bg-netflix-red rounded-full p-6 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <Lock size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Você explorou {FREE_QUESTIONS_LIMIT} questões gratuitas!
              </h2>
              <p className="text-netflix-text-secondary">
                Parabéns! Você acertou {correctAnswers} de {answeredQuestions} questões.
              </p>
            </div>

            <div className="grid gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-netflix-card/50 rounded-lg">
                  {benefit.icon}
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{benefit.title}</h3>
                    <p className="text-netflix-text-secondary text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                onClick={onUpgrade}
                className="w-full bg-netflix-red hover:bg-red-700 text-lg py-6"
              >
                <Unlock className="mr-2 h-5 w-5" />
                Desbloquear Acesso Completo
              </Button>
              
              <Button 
                onClick={onExit}
                variant="outline"
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>

            <p className="text-netflix-text-secondary text-sm mt-6">
              ✨ Sem compromisso • Cancele quando quiser • Primeira semana grátis
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (inSession && freeQuestions.length > 0) {
    return (
      <StudySession
        questions={[freeQuestions[currentQuestionIndex]]}
        onComplete={handleSessionComplete}
        onExit={() => setInSession(false)}
        title={`Questão Gratuita ${answeredQuestions + 1}/${FREE_QUESTIONS_LIMIT}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <Card className="bg-netflix-card border-netflix-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="bg-green-600 text-white mb-4 px-4 py-2">
              <Star className="mr-2 h-4 w-4" />
              Modo Exploração Gratuita
            </Badge>
            <h1 className="text-2xl font-bold text-white mb-2">
              Experimente {FREE_QUESTIONS_LIMIT} Questões Gratuitas
            </h1>
            <p className="text-netflix-text-secondary">
              Conheça nossa metodologia sem compromisso
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-netflix-text-secondary">Progresso</span>
              <span className="text-white">{answeredQuestions}/{FREE_QUESTIONS_LIMIT}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-netflix-red h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredQuestions / FREE_QUESTIONS_LIMIT) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question Preview */}
          {freeQuestions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Próxima Questão - {freeQuestions[currentQuestionIndex]?.area}
              </h3>
              <div className="bg-netflix-card/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    {freeQuestions[currentQuestionIndex]?.exame} - {freeQuestions[currentQuestionIndex]?.ano}
                  </Badge>
                </div>
                <p className="text-netflix-text-secondary text-sm line-clamp-3">
                  {freeQuestions[currentQuestionIndex]?.enunciado?.substring(0, 150)}...
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          {answeredQuestions > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{correctAnswers}</div>
                <div className="text-green-200 text-sm">Acertos</div>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0}%
                </div>
                <div className="text-blue-200 text-sm">Aproveitamento</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleStartSession}
              className="w-full bg-netflix-red hover:bg-red-700 text-lg py-6"
              disabled={answeredQuestions >= FREE_QUESTIONS_LIMIT}
            >
              {answeredQuestions === 0 ? 'Começar Primeira Questão' : `Questão ${answeredQuestions + 1}`}
              <CheckCircle2 className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={onExit}
              variant="outline"
              className="w-full"
            >
              Voltar ao Menu
            </Button>
          </div>

          <p className="text-netflix-text-secondary text-center text-sm mt-6">
            💡 Sem cadastro necessário • Experiência completa • Sem spam
          </p>
        </Card>
      </div>
    </div>
  );
};

export default FreeExplorationMode;
