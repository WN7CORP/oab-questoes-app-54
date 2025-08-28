import { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Star } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface SocialProofBannerProps {
  variant?: 'compact' | 'full';
}

const SocialProofBanner = ({ variant = 'full' }: SocialProofBannerProps) => {
  const [stats, setStats] = useState({
    activeUsers: 1247,
    questionsAnswered: 15643,
    successRate: 87,
    approvedStudents: 234
  });

  const [testimonials] = useState([
    {
      name: "Maria S.",
      text: "Passei na OAB na primeira tentativa!",
      rating: 5
    },
    {
      name: "João P.",
      text: "Melhor plataforma para estudar para a OAB.",
      rating: 5
    },
    {
      name: "Ana L.",
      text: "As explicações são excelentes e muito didáticas.",
      rating: 5
    }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        questionsAnswered: prev.questionsAnswered + Math.floor(Math.random() * 5)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users size={14} className="text-primary" />
          <span>{stats.activeUsers.toLocaleString()} online</span>
        </div>
        <div className="flex items-center gap-1">
          <Award size={14} className="text-green-500" />
          <span>{stats.successRate}% aprovação</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/10">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Junte-se a milhares de aprovados!
        </h3>
        <p className="text-muted-foreground">
          Nossa comunidade cresce a cada dia com novos sucessos
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-center mb-2">
            <Users className="text-primary" size={24} />
          </div>
          <div className="text-lg font-bold text-foreground">
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Usuários ativos</div>
          <Badge variant="secondary" className="mt-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Online agora
          </Badge>
        </div>

        <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <div className="text-lg font-bold text-foreground">
            {stats.questionsAnswered.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Questões resolvidas</div>
        </div>

        <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-center mb-2">
            <Award className="text-green-500" size={24} />
          </div>
          <div className="text-lg font-bold text-foreground">{stats.successRate}%</div>
          <div className="text-xs text-muted-foreground">Taxa de aprovação</div>
        </div>

        <div className="text-center p-3 bg-background/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-center mb-2">
            <Star className="text-yellow-500" size={24} />
          </div>
          <div className="text-lg font-bold text-foreground">
            {stats.approvedStudents}
          </div>
          <div className="text-xs text-muted-foreground">Aprovados este ano</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground text-center">
          O que nossos alunos dizem:
        </h4>
        <div className="grid gap-2">
          {testimonials.slice(0, 2).map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background/70 rounded-lg p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="text-sm font-medium text-foreground">
                  {testimonial.name}
                </div>
                <div className="flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofBanner;