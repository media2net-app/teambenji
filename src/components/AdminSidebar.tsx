import { useState } from 'react';
import logo from '../logo.png';

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export default function AdminSidebar({ activeItem, onItemClick }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overzicht', icon: '📊', section: 'main' },
    { id: 'users', label: 'Gebruikers', icon: '👥', section: 'management' },
    { id: 'coaches', label: 'Coaches', icon: '👨‍🏫', section: 'management' },
    { id: 'analytics', label: 'Analytics', icon: '📈', section: 'data' },
    { id: 'content', label: 'Content', icon: '📝', section: 'content' },
    { id: 'programs', label: 'Programma\'s', icon: '🏋️', section: 'content' },
    { id: 'nutrition-plans', label: 'Voedingsplannen', icon: '🥗', section: 'content' },
    { id: 'education', label: 'Educatie', icon: '🎓', section: 'content' },
  ];

  const systemItems = [
    { id: 'settings', label: 'Instellingen', icon: '⚙️' },
    { id: 'logs', label: 'Logs', icon: '📋' },
    { id: 'backup', label: 'Backup', icon: '💾' },
    { id: 'support', label: 'Support', icon: '🆘' },
  ];

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'main': return 'Dashboard';
      case 'management': return 'Beheer';
      case 'data': return 'Data & Analytics';
      case 'content': return 'Content Management';
      default: return '';
    }
  };

  const renderMenuSection = (items: typeof menuItems, sectionName?: string) => {
    const groupedItems = sectionName 
      ? items.filter(item => item.section === sectionName)
      : items;

    if (groupedItems.length === 0) return null;

    return (
      <div className="space-y-1">
        {sectionName && !isCollapsed && (
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {getSectionLabel(sectionName)}
            </h3>
          </div>
        )}
        {groupedItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              activeItem === item.id
                ? 'bg-[#E33412] text-white shadow-lg'
                : 'text-gray-300 hover:bg-[#2A2D3A] hover:text-white'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`bg-[#1A1D29] h-screen flex flex-col transition-all duration-300 border-r border-[#2A2D3A] ${isCollapsed ? 'w-16' : 'w-72'}`}>
      {/* Header */}
      <div className="p-4 border-b border-[#2A2D3A]">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Team Benji Admin" className="h-8 w-8 rounded" />
          {!isCollapsed && (
            <div>
              <h1 className="text-white font-bold text-lg">Team Benji</h1>
              <p className="text-gray-400 text-xs">Admin Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-[#2A2D3A]">
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-[#E33412] text-white p-2 rounded-lg text-xs font-medium hover:bg-[#b9260e] transition-colors">
              + Gebruiker
            </button>
            <button className="bg-[#2A2D3A] text-white p-2 rounded-lg text-xs font-medium hover:bg-[#3A3D4A] transition-colors">
              + Coach
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Dashboard */}
          {renderMenuSection(menuItems, 'main')}
          
          {/* Management */}
          {renderMenuSection(menuItems, 'management')}
          
          {/* Data & Analytics */}
          {renderMenuSection(menuItems, 'data')}
          
          {/* Content Management */}
          {renderMenuSection(menuItems, 'content')}
        </div>
      </nav>

      {/* System Navigation */}
      <div className="p-2 border-t border-[#2A2D3A]">
        {!isCollapsed && (
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Systeem
            </h3>
          </div>
        )}
        <div className="space-y-1">
          {systemItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeItem === item.id
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-300 hover:bg-[#2A2D3A] hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* User Info & Collapse Toggle */}
      <div className="p-2 border-t border-[#2A2D3A]">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium text-sm">Admin User</div>
              <div className="text-gray-400 text-xs">admin@teambenji.nl</div>
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
              <span className="text-sm">⚡</span>
            </button>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#2A2D3A]"
        >
          <span className="text-lg">{isCollapsed ? '→' : '←'}</span>
        </button>
      </div>
    </div>
  );
} 