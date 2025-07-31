import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import DataCard from '../components/DataCard';
import ModernChart from '../components/ModernChart';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { dashboardTranslations } from '../translations/dashboard';
import { 
  WorkoutIcon, 
  ScaleIcon, 
  SleepIcon, 
  FireIcon, 
  TrendIcon, 
  ChartIcon, 
  TargetIcon, 
  NotesIcon, 
  BrainIcon,
  PlusIcon,
  NutritionIcon
} from '../components/Icons';
import TrainingenPage from './TrainingenPage';
import VoedingPage from './VoedingPage';
import HerstelPage from './HerstelPage';
import BodyCompositionPage from './BodyCompositionPage';
import PrestatiesPage from './PrestatiesPage';
import PlanningPage from './PlanningPage';
import InstellingenPage from './InstellingenPage';
import HelpPage from './HelpPage';
import AIInsightsPage from './AIInsightsPage';
import ChatPage from './ChatPage';
import LeermodulePage from './LeermodulePage';
import AIRecommendations from '../components/AIRecommendations';
import FloatingChatWidget from '../components/FloatingChatWidget';

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [language, setLanguage] = useState<'nl' | 'en'>('nl');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const t = dashboardTranslations[language];

  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  const handleLogout = () => {
    // Redirect naar login pagina
    window.location.href = '/';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (activeItem) {
      case 'trainingen':
        return <TrainingenPage />;
      case 'voeding':
        return <VoedingPage />;
      case 'herstel':
        return <HerstelPage />;
      case 'body-composition':
        return <BodyCompositionPage />;
      case 'prestaties':
        return <PrestatiesPage />;
      case 'planning':
        return <PlanningPage />;
      case 'leermodules':
        return <LeermodulePage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'chat':
        return <ChatPage />;
      case 'instellingen':
        return <InstellingenPage />;
      case 'help':
        return <HelpPage />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <DataCard
          title={t['trainingen-deze-week']}
          value="4"
          change="+1"
          changeType="positive"
          icon={<WorkoutIcon className="w-6 h-6 text-white" />}
          subtitle={t['van-gepland']}
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title={language === 'nl' ? 'Gewicht' : 'Weight'}
          value="75.2 kg"
          change="-0.3 kg"
          changeType="positive"
          icon={<ScaleIcon className="w-6 h-6 text-white" />}
          subtitle={language === 'nl' ? 'deze maand' : 'this month'}
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title={language === 'nl' ? 'Slaapscore' : 'Sleep score'}
          value="85"
          change="+5%"
          changeType="positive"
          icon={<SleepIcon className="w-6 h-6 text-white" />}
          subtitle={language === 'nl' ? 'gemiddeld deze week' : 'average this week'}
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title={language === 'nl' ? 'Calorie doelen' : 'Calorie goals'}
          value="2,340"
          change="94%"
          changeType="positive"
          icon={<FireIcon className="w-6 h-6 text-white" />}
          subtitle={language === 'nl' ? 'van 2,500 kcal' : 'of 2,500 kcal'}
          className="stagger-item animate-fade-in"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Training Overview */}
        <DataCard
          title={t['volgende-training']}
          value={t['benen-core']}
          icon={<WorkoutIcon className="w-6 h-6" />}
          subtitle={t['vandaag-1800']}
          className="lg:col-span-1 stagger-item"
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t['duur']}</span>
              <span className="text-white">60 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t['trainer']}</span>
              <span className="text-white">Mark Johnson</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t['locatie']}</span>
              <span className="text-white">Studio A</span>
            </div>
            <button className="btn-modern w-full bg-gradient-to-r from-[#E33412] to-[#b9260e] text-white py-3 rounded-lg hover:from-[#b9260e] hover:to-[#E33412] transition-all duration-300 text-sm font-medium mt-4 shadow-lg shadow-[#E33412]/20 hover:shadow-[#E33412]/40 animate-glow">
              <span className="relative z-10">{t['training-starten']}</span>
            </button>
          </div>
        </DataCard>

        {/* Progress Chart */}
        <DataCard
          title={t['voortgang-deze-maand']}
          value="87%"
          icon={<TrendIcon className="w-6 h-6 text-white" />}
          subtitle={t['van-doelen-bereikt']}
          className="lg:col-span-2 stagger-item"
        >
          <div className="space-y-4">
            {[
              { label: t['trainingen'], value: 16, max: 18, percentage: 89, color: "bg-gradient-to-r from-[#E33412] to-[#ff4d24]" },
              { label: t['voeding'], value: 24, max: 28, percentage: 86, color: "bg-gradient-to-r from-green-400 to-green-500" },
              { label: t['herstel'], value: 26, max: 30, percentage: 87, color: "bg-gradient-to-r from-blue-400 to-blue-500" }
            ].map((item, index) => (
              <div key={index} className="space-y-2 stagger-item">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}/{item.max}</span>
                </div>
                <div className="relative w-full bg-[#2A2D3A] rounded-full h-3 overflow-hidden">
                  <div 
                    className={`progress-bar h-3 rounded-full transition-all duration-1000 ease-out ${item.color} relative`}
                    style={{ 
                      width: `${item.percentage}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 animate-shimmer opacity-30"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-white text-xs font-bold opacity-80">{item.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Weekly Progress Chart */}
        <DataCard
          title={t['wekelijke-voortgang']}
          value=""
          icon={<ChartIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <ModernChart
            data={[
              { label: t['ma'], value: 85 },
              { label: t['di'], value: 92 },
              { label: t['wo'], value: 78 },
              { label: t['do'], value: 95 },
              { label: t['vr'], value: 88 },
              { label: t['za'], value: 90 },
              { label: t['zo'], value: 82 }
            ]}
            type="bar"
            height={180}
            animated={true}
          />
        </DataCard>

        {/* Recent Activity */}
        <DataCard
          title="Recente Activiteit"
          value=""
          icon={<NotesIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <div className="space-y-3">
            {[
              { activity: 'Push/Pull training voltooid', time: '2 uur geleden', type: 'success', icon: <WorkoutIcon className="w-4 h-4" /> },
              { activity: 'Voeding gelogd: Lunch', time: '4 uur geleden', type: 'info', icon: <NutritionIcon className="w-4 h-4" /> },
              { activity: 'Slaap geregistreerd: 8.2u', time: 'Gisteren', type: 'info', icon: <SleepIcon className="w-4 h-4" /> },
              { activity: 'Gewicht bijgewerkt: 75.2kg', time: '2 dagen geleden', type: 'success', icon: <ScaleIcon className="w-4 h-4" /> },
            ].map((item, index) => (
              <div key={index} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-[#2A2D3A] transition-all duration-300 transform hover:scale-[1.02] stagger-item border border-transparent hover:border-[#E33412]/20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  item.type === 'success' 
                    ? 'bg-green-400/20 text-green-400 group-hover:bg-green-400/30' 
                    : 'bg-blue-400/20 text-blue-400 group-hover:bg-blue-400/30'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium group-hover:text-[#E33412] transition-colors duration-300">{item.activity}</div>
                  <div className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* AI Insights */}
        <DataCard
          title="AI Aanbevelingen"
          value=""
          icon={<BrainIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <AIRecommendations 
            maxItems={3} 
            showControls={false} 
            compact={true}
          />
        </DataCard>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Goal Distribution */}
        <DataCard
          title="Doelen Verdeling"
          value=""
          icon={<TargetIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <ModernChart
            data={[
              { label: 'Kracht', value: 35, color: '#E33412' },
              { label: 'Cardio', value: 25, color: '#ff4d24' },
              { label: 'Flexibiliteit', value: 20, color: '#ff6b3d' },
              { label: 'Voeding', value: 20, color: '#ff8956' }
            ]}
            type="donut"
            height={250}
            animated={true}
          />
        </DataCard>

        {/* Weekly Trend */}
        <DataCard
          title="Activiteit Trend"
          value=""
          icon={<TrendIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <ModernChart
            data={[
              { label: 'Week 1', value: 75 },
              { label: 'Week 2', value: 82 },
              { label: 'Week 3', value: 78 },
              { label: 'Week 4', value: 88 },
              { label: 'Week 5', value: 92 },
              { label: 'Week 6', value: 85 }
            ]}
            type="line"
            height={250}
            animated={true}
          />
        </DataCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F1117] flex">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 transition-transform duration-300 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar activeItem={activeItem} onItemClick={handleSidebarClick} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="bg-[#1A1D29] border-b border-[#2A2D3A]">
          {/* Mobile Subheader */}
          <div className="lg:hidden px-4 py-2 bg-[#161925] border-b border-[#2A2D3A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2A2D3A] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#E33412] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TB</span>
                  </div>
                  <span className="text-white text-sm font-medium">Team Benji</span>
                </div>
              </div>
              <LanguageSwitcher 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
              />
            </div>
          </div>

          {/* Main Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Desktop Menu Button */}
                <button 
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden lg:block p-2 text-gray-400 hover:text-white hover:bg-[#2A2D3A] rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <h1 className="text-white text-lg sm:text-2xl font-bold">
                    {activeItem === 'dashboard' ? t['dashboard'] : 
                     activeItem === 'trainingen' ? (language === 'nl' ? 'Mijn Trainingen' : 'My Workouts') :
                     activeItem === 'voeding' ? (language === 'nl' ? 'Voeding' : 'Nutrition') :
                     activeItem === 'herstel' ? (language === 'nl' ? 'Herstel' : 'Recovery') :
                     activeItem === 'body-composition' ? (language === 'nl' ? 'Lichaamssamenstelling' : 'Body Composition') :
                     activeItem === 'prestaties' ? (language === 'nl' ? 'Prestaties' : 'Performance') :
                     activeItem === 'planning' ? (language === 'nl' ? 'Planning' : 'Planning') :
                     activeItem === 'leermodules' ? (language === 'nl' ? 'Leermodules' : 'Learning Modules') :
                     activeItem === 'ai-insights' ? 'AI Insights' :
                     activeItem === 'chat' ? 'Chat' :
                     activeItem === 'instellingen' ? t['instellingen-menu'] :
                     activeItem === 'help' ? (language === 'nl' ? 'Help & Support' : 'Help & Support') : t['dashboard']}
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                    {activeItem === 'dashboard' ? t['welkom-terug-overzicht'] : 
                     activeItem === 'trainingen' ? (language === 'nl' ? 'Plan, volg en analyseer je workouts' : 'Plan, track and analyze your workouts') :
                     activeItem === 'voeding' ? (language === 'nl' ? 'Track je macro\'s en bereik je doelen' : 'Track your macros and reach your goals') :
                     activeItem === 'herstel' ? (language === 'nl' ? 'Monitor je slaap en recovery' : 'Monitor your sleep and recovery') :
                     activeItem === 'body-composition' ? (language === 'nl' ? 'Track je lichaamssamenstelling en progressie' : 'Track your body composition and progress') :
                     activeItem === 'prestaties' ? (language === 'nl' ? 'Volg je vooruitgang en behaalde doelen' : 'Track your progress and achieved goals') :
                     activeItem === 'planning' ? (language === 'nl' ? 'Beheer je trainingsschema en afspraken' : 'Manage your training schedule and appointments') :
                     activeItem === 'ai-insights' ? (language === 'nl' ? 'Gepersonaliseerde aanbevelingen op basis van je data' : 'Personalized recommendations based on your data') :
                     activeItem === 'chat' ? (language === 'nl' ? 'Communiceer met je coach en community' : 'Communicate with your coach and community') :
                     activeItem === 'instellingen' ? (language === 'nl' ? 'Beheer je profiel en voorkeuren' : 'Manage your profile and preferences') :
                     activeItem === 'help' ? (language === 'nl' ? 'Vind antwoorden op je vragen' : 'Find answers to your questions') : t['welkom-terug-overzicht']}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Language Switcher */}
                <div className="hidden sm:block">
                  <LanguageSwitcher 
                    currentLanguage={language} 
                    onLanguageChange={setLanguage} 
                  />
                </div>
                
                <button className="btn-modern bg-gradient-to-r from-[#E33412] to-[#b9260e] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-[#b9260e] hover:to-[#E33412] transition-all duration-300 font-medium shadow-lg shadow-[#E33412]/20 hover:shadow-[#E33412]/40 flex items-center gap-2 text-sm sm:text-base">
                  <PlusIcon className="w-4 h-4" />
                  <span className="relative z-10 hidden sm:inline">
                    {language === 'nl' ? 'Nieuwe Training' : 'New Workout'}
                  </span>
                  <span className="relative z-10 sm:hidden">
                    {language === 'nl' ? 'Training' : 'Workout'}
                  </span>
                </button>
                
                <div className="relative" ref={userMenuRef}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-[#2A2D3A] p-2 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">U</span>
                    </div>
                    <span className="text-white font-medium hidden sm:inline">{t['gebruiker']}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1A1D29] border border-[#2A2D3A] rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => setActiveItem('instellingen')}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2D3A] transition-colors"
                        >
                          ⚙️ {t['instellingen-menu']}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2A2D3A] transition-colors"
                        >
                          🚪 {t['uitloggen-menu']}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <FloatingChatWidget />
    </div>
  );
} 