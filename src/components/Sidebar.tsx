import { useState } from 'react';
import logo from '../logo.png';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  DashboardIcon, 
  WorkoutIcon, 
  NutritionIcon, 
  SleepIcon, 
  BodyCompositionIcon, 
  PerformanceIcon, 
  CalendarIcon, 
  BrainIcon, 
  SettingsIcon, 
  HelpIcon,
  SearchIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from './Icons';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { language } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: language === 'nl' ? 'Dashboard' : 'Dashboard', icon: DashboardIcon },
    { id: 'trainingen', label: language === 'nl' ? 'Mijn Trainingen' : 'My Workouts', icon: WorkoutIcon },
    { id: 'voeding', label: language === 'nl' ? 'Voeding' : 'Nutrition', icon: NutritionIcon },
    { id: 'herstel', label: language === 'nl' ? 'Herstel' : 'Recovery', icon: SleepIcon },
    { id: 'body-composition', label: language === 'nl' ? 'Lichaamssamenstelling' : 'Body Composition', icon: BodyCompositionIcon },
    { id: 'prestaties', label: language === 'nl' ? 'Prestaties' : 'Performance', icon: PerformanceIcon },
    { id: 'planning', label: language === 'nl' ? 'Planning' : 'Planning', icon: CalendarIcon },
    { id: 'leermodules', label: language === 'nl' ? 'Leermodules' : 'Learning Modules', icon: () => <span className="text-xl">📚</span> },
    { id: 'ai-insights', label: language === 'nl' ? 'AI Inzichten' : 'AI Insights', icon: BrainIcon },
    { id: 'chat', label: language === 'nl' ? 'Chat' : 'Chat', icon: () => <span className="text-xl">💬</span> },
  ];

  const bottomItems = [
    { id: 'instellingen', label: language === 'nl' ? 'Instellingen' : 'Settings', icon: SettingsIcon },
    { id: 'help', label: language === 'nl' ? 'Help & Ondersteuning' : 'Help & Support', icon: HelpIcon },
  ];

  return (
    <div className={`bg-gradient-to-b from-[#1A1D29] to-[#161925] h-screen flex flex-col transition-all duration-500 border-r border-[#2A2D3A]/50 backdrop-blur-sm ${isCollapsed ? 'w-16' : 'w-64 lg:w-64'} animate-slide-in-left`}>
      {/* Header */}
      <div className="p-4 border-b border-[#2A2D3A]/50">
        <div className="flex items-center gap-3 group">
          <div className="p-2 bg-[#E33412]/10 rounded-lg group-hover:bg-[#E33412]/20 transition-all duration-300 animate-float">
            <img src={logo} alt="Team Benji" className="h-6 w-6 rounded filter group-hover:brightness-110 transition-all duration-300" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-white font-bold text-lg group-hover:text-[#E33412] transition-colors duration-300">Team Benji</h1>
              <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">High Performance</p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 animate-fade-in">
          <div className="relative group">
            <input
              type="text"
              placeholder={language === 'nl' ? 'Zoeken...' : 'Search...'}
              className="w-full bg-[#2A2D3A]/50 text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#E33412] transition-all duration-300 focus:bg-[#2A2D3A] backdrop-blur-sm border border-transparent focus:border-[#E33412]/30"
            />
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-[#E33412] transition-colors duration-300" />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 stagger-item ${
                activeItem === item.id
                  ? 'bg-gradient-to-r from-[#E33412] to-[#b9260e] text-white shadow-lg shadow-[#E33412]/20 animate-glow'
                  : 'text-gray-300 hover:bg-[#2A2D3A]/50 hover:text-white hover:shadow-md'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-1 rounded transition-all duration-300 ${
                activeItem === item.id 
                  ? 'bg-white/20' 
                  : 'group-hover:bg-[#E33412]/20'
              }`}>
                <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              {!isCollapsed && <span className="font-medium transition-all duration-300">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-2 border-t border-[#2A2D3A]">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-300 hover:bg-[#2A2D3A] hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <ArrowRightIcon className="w-5 h-5" /> : <ArrowLeftIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
} 