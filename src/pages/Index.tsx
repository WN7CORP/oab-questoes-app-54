import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Search, BarChart3, User, BookOpen, Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import WelcomeScreen from '@/components/WelcomeScreen';
import EnhancedWelcomeScreen from '@/components/onboarding/EnhancedWelcomeScreen';
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay';
import FirstQuestionDemo from '@/components/onboarding/FirstQuestionDemo';
import FreeExplorationMode from '@/components/onboarding/FreeExplorationMode';
import FirstTimeTooltips from '@/components/onboarding/FirstTimeTooltips';
import QuickWinsSystem from '@/components/engagement/QuickWinsSystem';
import SocialProofBanner from '@/components/engagement/SocialProofBanner';
import GuidedJourney from '@/components/engagement/GuidedJourney';
import HomeSection from '@/components/HomeSection';
import StudyAreas from '@/components/StudyAreas';
import SearchSection from '@/components/SearchSection';
import PerformanceSection from '@/components/PerformanceSection';
import ProfileSection from '@/components/ProfileSection';
import SimuladoSection from '@/components/SimuladoSection';

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showFirstQuestion, setShowFirstQuestion] = useState(false);
  const [showFreeExploration, setShowFreeExploration] = useState(false);
  const [showTooltips, setShowTooltips] = useState(false);
  const [user, setUser] = useState(null);
  const [hideNavigation, setHideNavigation] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check if user has seen onboarding
    const onboardingSeen = localStorage.getItem('oab-onboarding-completed');
    setHasSeenOnboarding(!!onboardingSeen);

    // Check if user should see tooltips (first time after onboarding)
    const tooltipsSeen = localStorage.getItem('oab-tooltips-seen');
    if (onboardingSeen && !tooltipsSeen) {
      setShowTooltips(true);
    }

    // Load user stats and profile
    loadUserStats();

    return () => subscription.unsubscribe();
  }, []);

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setHasProfile(true);
        
        // Load user statistics from sessions
        const { data: sessions } = await supabase
          .from('user_study_sessions')
          .select('*')
          .eq('user_id', user.id);

        if (sessions) {
          const totalQuestions = sessions.reduce((sum, session) => sum + session.questions_answered, 0);
          const totalCorrect = sessions.reduce((sum, session) => sum + session.correct_answers, 0);
          setQuestionsAnswered(totalQuestions);
          setCorrectAnswers(totalCorrect);
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao OAB Questões!',
      description: 'Sua plataforma completa para preparação do exame da OAB. Vamos fazer um tour rápido pelas principais funcionalidades.',
      icon: <Home size={24} />
    },
    {
      id: 'questions',
      title: 'Questões Comentadas',
      description: 'Acesse milhares de questões de exames anteriores, todas com comentários detalhados para maximizar seu aprendizado.',
      icon: <BookOpen size={24} />
    },
    {
      id: 'simulados',
      title: 'Simulados Completos',
      description: 'Pratique com simulados cronometrados que reproduzem fielmente as condições do exame oficial.',
      icon: <Trophy size={24} />
    },
    {
      id: 'progress',
      title: 'Acompanhe seu Progresso',
      description: 'Visualize seu desempenho, identifique pontos fracos e acompanhe sua evolução em tempo real.',
      icon: <BarChart3 size={24} />
    }
  ];

  const handleStartDemo = () => {
    setShowWelcome(false);
    setShowFirstQuestion(true);
  };

  const handleStartFreeExploration = () => {
    setShowWelcome(false);
    setShowFreeExploration(true);
  };

  const handleStartOnboarding = () => {
    setShowWelcome(false);
    setShowOnboarding(true);
  };

  const handleSkipToApp = () => {
    setShowWelcome(false);
    localStorage.setItem('oab-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    // Show tooltips for first-time users who skip onboarding
    const tooltipsSeen = localStorage.getItem('oab-tooltips-seen');
    if (!tooltipsSeen) {
      setShowTooltips(true);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('oab-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    // Show tooltips after onboarding
    const tooltipsSeen = localStorage.getItem('oab-tooltips-seen');
    if (!tooltipsSeen) {
      setShowTooltips(true);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('oab-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    // Show tooltips for users who skip onboarding
    const tooltipsSeen = localStorage.getItem('oab-tooltips-seen');
    if (!tooltipsSeen) {
      setShowTooltips(true);
    }
  };

  const handleFirstQuestionComplete = (wasCorrect: boolean) => {
    setShowFirstQuestion(false);
    localStorage.setItem('oab-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    
    // Optionally, show a celebration or toast based on the result
    if (wasCorrect) {
      console.log('🎉 Primeira questão correta!');
    } else {
      console.log('📚 Primeira questão - vamos aprender mais!');
    }
  };

  const handleTooltipsComplete = () => {
    setShowTooltips(false);
    localStorage.setItem('oab-tooltips-seen', 'true');
  };

  const handleTooltipsSkip = () => {
    setShowTooltips(false);
    localStorage.setItem('oab-tooltips-seen', 'true');
  };

  const handleFreeExplorationUpgrade = () => {
    setShowFreeExploration(false);
    // Here you would typically redirect to pricing/subscription page
    console.log('Upgrade to premium');
  };

  const handleFreeExplorationExit = () => {
    setShowFreeExploration(false);
    setShowWelcome(true);
  };

  const handleNavigate = (section: string) => {
    // Map journey actions to actual tab values
    const sectionMap: Record<string, string> = {
      'profile': 'profile',
      'questions': 'areas',
      'areas': 'areas',
      'study': 'areas',
      'advanced': 'performance'
    };
    
    const targetSection = sectionMap[section] || 'home';
    // Trigger tab change by programmatically clicking the tab
    const tabElement = document.querySelector(`[value="${targetSection}"]`) as HTMLElement;
    tabElement?.click();
  };

  // Show free exploration mode
  if (showFreeExploration) {
    return (
      <FreeExplorationMode
        onUpgrade={handleFreeExplorationUpgrade}
        onExit={handleFreeExplorationExit}
      />
    );
  }

  // Show enhanced welcome screen for new users
  if (showWelcome && !hasSeenOnboarding) {
    return (
      <EnhancedWelcomeScreen 
        onStartDemo={handleStartDemo}
        onStartOnboarding={handleStartOnboarding}
        onSkipToApp={handleSkipToApp}
      />
    );
  }

  // Show first question demo
  if (showFirstQuestion) {
    return (
      <FirstQuestionDemo
        onComplete={handleFirstQuestionComplete}
        onSkip={() => setShowFirstQuestion(false)}
      />
    );
  }

  // Show original welcome screen for returning users
  if (showWelcome && hasSeenOnboarding) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* Onboarding Overlay */}
      <OnboardingOverlay
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        steps={onboardingSteps}
      />

      {/* First Time Tooltips */}
      <FirstTimeTooltips
        isVisible={showTooltips}
        onComplete={handleTooltipsComplete}
        onSkip={handleTooltipsSkip}
      />

      <Tabs defaultValue="home" className="h-screen flex flex-col">
        {/* Desktop Navigation - Horizontal Top Bar */}
        {!isMobile ? (
          <div className="bg-netflix-card border-b border-netflix-border px-6 py-4 fixed top-0 z-30 w-full">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold text-netflix-red">OAB Questões</h1>
                <TabsList className="bg-transparent h-auto p-0 space-x-6">
                  <TabsTrigger 
                    value="home" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <Home size={18} className="mr-2" />
                    Início
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="simulado" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <Trophy size={18} className="mr-2" />
                    Simulado
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="areas" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <BookOpen size={18} className="mr-2" />
                    Áreas
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="performance" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <BarChart3 size={18} className="mr-2" />
                    Progresso
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="profile" 
                    className="bg-transparent text-netflix-text-secondary hover:text-white data-[state=active]:text-netflix-red data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-netflix-red rounded-none px-4 py-2 transition-all duration-200"
                  >
                    <User size={18} className="mr-2" />
                    Perfil
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {user && (
                <div className="flex items-center gap-2 text-sm text-netflix-text-secondary">
                  <User size={16} />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Mobile Navigation - Top Tabs - Hidden when hideNavigation is true */
          !hideNavigation && (
            <TabsList className="bg-netflix-card border-b border-netflix-border rounded-none h-16 sm:h-20 lg:h-16 p-0 w-full grid grid-cols-5 fixed top-0 z-30">
              <TabsTrigger value="home" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <Home size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Início</span>
              </TabsTrigger>
              
              <TabsTrigger value="simulado" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <Trophy size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Simulado</span>
              </TabsTrigger>
              
              <TabsTrigger value="areas" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <BookOpen size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Áreas</span>
              </TabsTrigger>
              
              <TabsTrigger value="performance" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <BarChart3 size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Progresso</span>
              </TabsTrigger>
              
              <TabsTrigger value="profile" className="flex flex-col gap-1 h-full data-[state=active]:bg-netflix-red data-[state=active]:text-white transition-all duration-200 active:scale-95">
                <User size={22} className="sm:size-24" />
                <span className="text-xs sm:text-sm font-medium">Perfil</span>
              </TabsTrigger>
            </TabsList>
          )
        )}

        {/* Main Content with responsive padding */}
        <div className={`flex-1 overflow-hidden ${!isMobile ? 'pt-20' : hideNavigation ? 'pt-0' : 'pt-16 sm:pt-20'}`}>
          <TabsContent value="home" className="h-full mt-0">
            <div className="h-full overflow-y-auto p-4 space-y-6">
              <HomeSection onHideNavigation={setHideNavigation} />
              
              {/* Quick Wins for early engagement */}
              {questionsAnswered <= 10 && (
                <QuickWinsSystem 
                  questionsAnswered={questionsAnswered}
                  correctAnswers={correctAnswers}
                />
              )}
              
              {/* Guided Journey for new users */}
              {questionsAnswered <= 15 && (
                <GuidedJourney 
                  questionsAnswered={questionsAnswered}
                  hasProfile={hasProfile}
                  onNavigate={handleNavigate}
                />
              )}
              
              {/* Social Proof Banner */}
              {questionsAnswered <= 5 && (
                <SocialProofBanner variant="full" />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="simulado" className="h-full mt-0">
            <SimuladoSection onHideNavigation={setHideNavigation} />
          </TabsContent>
          
          <TabsContent value="areas" className="h-full mt-0">
            <StudyAreas onHideNavigation={setHideNavigation} />
          </TabsContent>
          
          <TabsContent value="performance" className="h-full mt-0">
            <PerformanceSection />
          </TabsContent>
          
          <TabsContent value="profile" className="h-full mt-0">
            <ProfileSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Index;