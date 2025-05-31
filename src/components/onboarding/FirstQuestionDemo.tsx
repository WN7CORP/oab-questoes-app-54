
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { transformSupabaseToQuestions } from '@/utils/questionTransform';
import { Question } from '@/types/question';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Star } from 'lucide-react';

interface FirstQuestionDemoProps {
  onComplete: (wasCorrect: boolean) => void;
  onSkip: () => void;
}

const FirstQuestionDemo = ({ onComplete, onSkip }: FirstQuestionDemoProps) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDemoQuestion();
  }, []);

  const fetchDemoQuestion = async () => {
    try {
      // Buscar uma questão fácil de Direito Constitucional (área popular)
      const { data, error } = await supabase
        .from('Questoes_Comentadas')
        .select('*')
        .eq('area', 'Direito Constitucional')
        .limit(5);

      if (error) {
        console.error('Error fetching demo question:', error);
      } else if (data && data.length > 0) {
        const transformedQuestions = transformSupabaseToQuestions(data);
        // Pegar a primeira questão
        setQuestion(transformedQuestions[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || !question) return;
    
    const correct = selectedOption === question.resposta_correta;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect || false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white">Carregando sua primeira questão...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Não foi possível carregar a questão demo.</p>
          <Button onClick={onSkip}>Continuar mesmo assim</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Badge className="bg-green-600 text-white mb-4 px-4 py-2">
            <Star className="mr-2 h-4 w-4" />
            Questão Demonstrativa - Grátis!
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-2">
            Experimente Agora - Sua Primeira Questão
          </h1>
          <p className="text-netflix-text-secondary">
            Veja como funciona nosso sistema de questões comentadas
          </p>
        </div>

        {/* Question Card */}
        <Card className="bg-netflix-card border-netflix-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {question.area}
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-400">
              {question.exame} - {question.ano}
            </Badge>
          </div>

          <h2 className="text-lg font-semibold text-white mb-4">
            Questão {question.numero}
          </h2>

          <div className="text-netflix-text-secondary mb-6 leading-relaxed">
            {question.enunciado}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.opcoes.map((option, index) => {
              const letter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedOption === letter;
              const isCorrectOption = showResult && letter === question.resposta_correta;
              const isWrongSelected = showResult && isSelected && !isCorrectOption;

              return (
                <button
                  key={letter}
                  onClick={() => handleOptionSelect(letter)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    isCorrectOption
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : isWrongSelected
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : isSelected
                      ? 'border-netflix-red bg-netflix-red/20 text-white'
                      : 'border-netflix-border bg-netflix-card/50 text-netflix-text-secondary hover:border-netflix-red/50 hover:bg-netflix-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`font-bold ${
                      isCorrectOption ? 'text-green-400' : 
                      isWrongSelected ? 'text-red-400' : 
                      isSelected ? 'text-netflix-red' : 'text-netflix-text-secondary'
                    }`}>
                      {letter})
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                    )}
                    {showResult && isWrongSelected && (
                      <XCircle className="text-red-400 flex-shrink-0" size={20} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!showResult && (
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full mt-6 bg-netflix-red hover:bg-red-700"
            >
              Confirmar Resposta
            </Button>
          )}

          {/* Result and Explanation */}
          {showResult && (
            <div className="mt-6 animate-fade-in">
              <div className={`p-4 rounded-lg mb-4 ${
                isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="text-green-400" size={24} />
                  ) : (
                    <XCircle className="text-red-400" size={24} />
                  )}
                  <h3 className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? '🎉 Parabéns! Resposta Correta!' : '❌ Resposta Incorreta'}
                  </h3>
                </div>
                <p className={isCorrect ? 'text-green-200' : 'text-red-200'}>
                  {isCorrect 
                    ? 'Excelente! Você demonstrou conhecimento na área.'
                    : `A resposta correta é a alternativa ${question.resposta_correta}.`
                  }
                </p>
              </div>

              {/* Justification */}
              <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-blue-400" size={20} />
                  <h4 className="font-semibold text-blue-400">Comentário Explicativo</h4>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed">
                  {question.justificativa || 'Esta questão aborda conceitos fundamentais da área selecionada.'}
                </p>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full mt-6 bg-netflix-red hover:bg-red-700 text-lg py-6"
              >
                {isCorrect ? '🚀 Continuar Estudando!' : '📚 Vamos Aprender Mais!'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </Card>

        {/* Benefits Preview */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-netflix-text-secondary mb-4">
            ✨ Esta é apenas uma amostra! Com o OAB Questões você terá acesso a:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-netflix-card/30 p-3 rounded-lg">
              <strong className="text-white">Milhares de questões</strong>
              <br />
              <span className="text-netflix-text-secondary">Todas comentadas</span>
            </div>
            <div className="bg-netflix-card/30 p-3 rounded-lg">
              <strong className="text-white">Simulados completos</strong>
              <br />
              <span className="text-netflix-text-secondary">Exames reais</span>
            </div>
            <div className="bg-netflix-card/30 p-3 rounded-lg">
              <strong className="text-white">Progresso detalhado</strong>
              <br />
              <span className="text-netflix-text-secondary">Acompanhe sua evolução</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstQuestionDemo;
