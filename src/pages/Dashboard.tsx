import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import DataCard from '../components/DataCard';
import ModernChart from '../components/ModernChart';
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
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSidebarClick = (item: string) => {
    setActiveItem(item);
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
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Trainingen deze week"
          value="4"
          change="+1"
          changeType="positive"
          icon={<WorkoutIcon className="w-6 h-6 text-white" />}
          subtitle="van 5 gepland"
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title="Gewicht"
          value="75.2 kg"
          change="-0.3 kg"
          changeType="positive"
          icon={<ScaleIcon className="w-6 h-6 text-white" />}
          subtitle="deze maand"
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title="Slaapscore"
          value="85"
          change="+5%"
          changeType="positive"
          icon={<SleepIcon className="w-6 h-6 text-white" />}
          subtitle="gemiddeld deze week"
          className="stagger-item animate-fade-in"
        />
        <DataCard
          title="Calorie doelen"
          value="2,340"
          change="94%"
          changeType="positive"
          icon={<FireIcon className="w-6 h-6 text-white" />}
          subtitle="van 2,500 kcal"
          className="stagger-item animate-fade-in"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Overview */}
        <DataCard
          title="Volgende Training"
          value="Benen & Core"
          icon={<WorkoutIcon className="w-6 h-6" />}
          subtitle="Vandaag 18:00"
          className="lg:col-span-1 stagger-item"
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duur</span>
              <span className="text-white">60 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Trainer</span>
              <span className="text-white">Mark Johnson</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Locatie</span>
              <span className="text-white">Studio A</span>
            </div>
            <button className="btn-modern w-full bg-gradient-to-r from-[#E33412] to-[#b9260e] text-white py-3 rounded-lg hover:from-[#b9260e] hover:to-[#E33412] transition-all duration-300 text-sm font-medium mt-4 shadow-lg shadow-[#E33412]/20 hover:shadow-[#E33412]/40 animate-glow">
              <span className="relative z-10">Training starten</span>
            </button>
          </div>
        </DataCard>

        {/* Progress Chart */}
        <DataCard
          title="Voortgang deze maand"
          value="87%"
          icon={<TrendIcon className="w-6 h-6 text-white" />}
          subtitle="van je doelen bereikt"
          className="lg:col-span-2 stagger-item"
        >
          <div className="space-y-4">
            {[
              { label: "Trainingen", value: 16, max: 18, percentage: 89, color: "bg-gradient-to-r from-[#E33412] to-[#ff4d24]" },
              { label: "Voeding", value: 24, max: 28, percentage: 86, color: "bg-gradient-to-r from-green-400 to-green-500" },
              { label: "Herstel", value: 26, max: 30, percentage: 87, color: "bg-gradient-to-r from-blue-400 to-blue-500" }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <DataCard
          title="Wekelijkse Voortgang"
          value=""
          icon={<ChartIcon className="w-6 h-6 text-white" />}
          className="stagger-item"
        >
          <ModernChart
            data={[
              { label: 'Ma', value: 85 },
              { label: 'Di', value: 92 },
              { label: 'Wo', value: 78 },
              { label: 'Do', value: 95 },
              { label: 'Vr', value: 88 },
              { label: 'Za', value: 90 },
              { label: 'Zo', value: 82 }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={handleSidebarClick} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[#1A1D29] border-b border-[#2A2D3A] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">
                {activeItem === 'dashboard' ? 'Dashboard' : 
                 activeItem === 'trainingen' ? 'Mijn Trainingen' :
                 activeItem === 'voeding' ? 'Voeding' :
                 activeItem === 'herstel' ? 'Herstel' :
                 activeItem === 'body-composition' ? 'Lichaamssamenstelling' :
                 activeItem === 'prestaties' ? 'Prestaties' :
                 activeItem === 'planning' ? 'Planning' :
                 activeItem === 'leermodules' ? 'Leermodules' :
                 activeItem === 'ai-insights' ? 'AI Insights' :
                 activeItem === 'chat' ? 'Chat' :
                 activeItem === 'instellingen' ? 'Instellingen' :
                 activeItem === 'help' ? 'Help & Support' : 'Dashboard'}
              </h1>
              <p className="text-gray-400 text-sm">
                {activeItem === 'dashboard' ? 'Welkom terug! Hier is je overzicht.' : 
                 activeItem === 'trainingen' ? 'Plan, volg en analyseer je workouts' :
                 activeItem === 'voeding' ? 'Track je macro\'s en bereik je doelen' :
                 activeItem === 'herstel' ? 'Monitor je slaap en recovery' :
                 activeItem === 'body-composition' ? 'Track je lichaamssamenstelling en progressie' :
                 activeItem === 'prestaties' ? 'Volg je vooruitgang en behaalde doelen' :
                 activeItem === 'planning' ? 'Beheer je trainingsschema en afspraken' :
                 activeItem === 'ai-insights' ? 'Gepersonaliseerde aanbevelingen op basis van je data' :
                 activeItem === 'chat' ? 'Communiceer met je coach en community' :
                 activeItem === 'instellingen' ? 'Beheer je profiel en voorkeuren' :
                 activeItem === 'help' ? 'Vind antwoorden op je vragen' : 'Welkom terug!'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-modern bg-gradient-to-r from-[#E33412] to-[#b9260e] text-white px-6 py-3 rounded-lg hover:from-[#b9260e] hover:to-[#E33412] transition-all duration-300 font-medium shadow-lg shadow-[#E33412]/20 hover:shadow-[#E33412]/40 flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <span className="relative z-10">Nieuwe Training</span>
              </button>
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:bg-[#2A2D3A] p-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">U</span>
                  </div>
                  <span className="text-white font-medium">Gebruiker</span>
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
                        ⚙️ Instellingen
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2A2D3A] transition-colors"
                      >
                        🚪 Uitloggen
                      </button>
                    </div>
                  </div>
                )}
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