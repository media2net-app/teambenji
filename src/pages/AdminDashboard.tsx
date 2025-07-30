import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import DataCard from '../components/DataCard';
import UserManagement from '../components/UserManagement';
import CoachManagement from '../components/CoachManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ContentManagement from '../components/ContentManagement';
import ProgramManagement from '../components/ProgramManagement';

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState('overview');
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

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
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Gebruikers"
          value="1,247"
          change="+12%"
          changeType="positive"
          icon="👥"
          subtitle="deze maand"
        />
        <DataCard
          title="Actieve Coaches"
          value="23"
          change="+2"
          changeType="positive"
          icon="👨‍🏫"
          subtitle="van 25 totaal"
        />
        <DataCard
          title="Maandelijkse Omzet"
          value="€47,850"
          change="+8.5%"
          changeType="positive"
          icon="💰"
          subtitle="deze maand"
        />
        <DataCard
          title="Gebruiker Retentie"
          value="94.2%"
          change="+2.1%"
          changeType="positive"
          icon="📈"
          subtitle="afgelopen 3 maanden"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <DataCard title="Recente Activiteit" value="" icon="📝">
            <div className="space-y-4">
              {[
                { 
                  action: 'Nieuwe gebruiker geregistreerd', 
                  user: 'Jan Pietersen', 
                  time: '5 min geleden', 
                  type: 'user',
                  details: 'Premium abonnement'
                },
                { 
                  action: 'Coach toegewezen', 
                  user: 'Sarah Wilson → Lisa de Vries', 
                  time: '12 min geleden', 
                  type: 'coach',
                  details: 'Kracht training specialisatie'
                },
                { 
                  action: 'Nieuw programma gepubliceerd', 
                  user: 'Mark Johnson', 
                  time: '1 uur geleden', 
                  type: 'content',
                  details: 'HIIT Beginners 6-weken programma'
                },
                { 
                  action: 'Systeem backup voltooid', 
                  user: 'Systeem', 
                  time: '2 uur geleden', 
                  type: 'system',
                  details: 'Alle data succesvol opgeslagen'
                },
                { 
                  action: 'Gebruiker upgrade', 
                  user: 'Tom van der Berg', 
                  time: '3 uur geleden', 
                  type: 'user',
                  details: 'Basic → Premium abonnement'
                },
                { 
                  action: 'Nieuwe voedingsplan toegevoegd', 
                  user: 'Emma Jansen', 
                  time: '4 uur geleden', 
                  type: 'content',
                  details: 'Vegetarisch gewichtsverlies plan'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'user' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                    item.type === 'coach' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                    item.type === 'content' ? 'bg-purple-500 bg-opacity-20 text-purple-400' :
                    'bg-gray-500 bg-opacity-20 text-gray-400'
                  }`}>
                    <span className="text-sm">
                      {item.type === 'user' ? '👤' : 
                       item.type === 'coach' ? '👨‍🏫' : 
                       item.type === 'content' ? '📝' : '⚙️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium text-sm">{item.action}</h4>
                      <span className="text-gray-400 text-xs">{item.time}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{item.user}</p>
                    <p className="text-gray-400 text-xs">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* User Growth */}
          <DataCard title="Gebruikers Groei" value="" icon="📊">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deze week</span>
                  <span className="text-white">+47 nieuwe gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-[#E33412] h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deze maand</span>
                  <span className="text-white">+156 nieuwe gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Dit kwartaal</span>
                  <span className="text-white">+423 nieuwe gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </DataCard>

          {/* Top Coaches */}
          <DataCard title="Top Coaches" value="" icon="🏆">
            <div className="space-y-3">
              {[
                { name: 'Sarah Wilson', clients: 45, rating: 4.9, specialty: 'Kracht' },
                { name: 'Mark Johnson', clients: 38, rating: 4.8, specialty: 'HIIT' },
                { name: 'Emma Jansen', clients: 32, rating: 4.9, specialty: 'Voeding' },
                { name: 'Lisa de Vries', clients: 28, rating: 4.7, specialty: 'Yoga' }
              ].map((coach, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[#2A2D3A] rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{coach.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{coach.name}</div>
                      <div className="text-gray-400 text-xs">{coach.specialty}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-semibold">{coach.clients}</div>
                    <div className="text-gray-400 text-xs">⭐ {coach.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <DataCard title="Systeem Status" value="" icon="💚">
          <div className="space-y-4">
            {[
              { service: 'API Server', status: 'Actief', uptime: '99.9%', color: 'green' },
              { service: 'Database', status: 'Actief', uptime: '99.8%', color: 'green' },
              { service: 'File Storage', status: 'Actief', uptime: '99.7%', color: 'green' },
              { service: 'Email Service', status: 'Onderhoudt', uptime: '98.2%', color: 'yellow' },
              { service: 'Payment Gateway', status: 'Actief', uptime: '99.9%', color: 'green' },
              { service: 'Analytics', status: 'Actief', uptime: '99.5%', color: 'green' }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.color === 'green' ? 'bg-green-400' : 
                    service.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-white font-medium text-sm">{service.service}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    service.color === 'green' ? 'text-green-400' : 
                    service.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {service.status}
                  </div>
                  <div className="text-gray-400 text-xs">{service.uptime} uptime</div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Revenue Overview */}
        <DataCard title="Omzet Overzicht" value="" icon="💰">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <div className="text-white text-lg font-bold">€15,420</div>
                <div className="text-gray-400 text-xs">Deze week</div>
                <div className="text-green-400 text-xs">+12.5%</div>
              </div>
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <div className="text-white text-lg font-bold">€47,850</div>
                <div className="text-gray-400 text-xs">Deze maand</div>
                <div className="text-green-400 text-xs">+8.5%</div>
              </div>
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <div className="text-white text-lg font-bold">€138,920</div>
                <div className="text-gray-400 text-xs">Dit kwartaal</div>
                <div className="text-green-400 text-xs">+15.2%</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-white font-medium text-sm">Abonnement Verdeling</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Basic (€19/maand)</span>
                  <span className="text-white font-medium">543 gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Premium (€39/maand)</span>
                  <span className="text-white font-medium">567 gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-[#E33412] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Elite (€79/maand)</span>
                  <span className="text-white font-medium">137 gebruikers</span>
                </div>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case 'users':
        return <UserManagement />;
      case 'coaches':
        return <CoachManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'content':
        return <ContentManagement />;
      case 'programs':
        return <ProgramManagement />;
      case 'nutrition-plans':
        return <div className="text-white">Voedingsplan Beheer - Coming Soon</div>;
      case 'education':
        return <div className="text-white">Educatie Content - Coming Soon</div>;
      case 'settings':
        return <div className="text-white">Systeem Instellingen - Coming Soon</div>;
      case 'logs':
        return <div className="text-white">Systeem Logs - Coming Soon</div>;
      case 'backup':
        return <div className="text-white">Backup Beheer - Coming Soon</div>;
      case 'support':
        return <div className="text-white">Support Dashboard - Coming Soon</div>;
      default:
        return renderOverview();
    }
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case 'users': return 'Gebruikersbeheer';
      case 'coaches': return 'Coach Beheer';
      case 'analytics': return 'Analytics Dashboard';
      case 'content': return 'Content Management';
      case 'programs': return 'Programma Beheer';
      case 'nutrition-plans': return 'Voedingsplan Beheer';
      case 'education': return 'Educatie Content';
      case 'settings': return 'Systeem Instellingen';
      case 'logs': return 'Systeem Logs';
      case 'backup': return 'Backup Beheer';
      case 'support': return 'Support Dashboard';
      default: return 'Admin Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activeItem) {
      case 'users': return 'Beheer alle gebruikers, abonnementen en toegangsrechten';
      case 'coaches': return 'Beheer coaches, specialisaties en klant toewijzingen';
      case 'analytics': return 'Inzichten in gebruikersgedrag en platform prestaties';
      case 'content': return 'Beheer alle content, programma\'s en educatief materiaal';
      case 'programs': return 'Maak en beheer trainingsprogramma\'s';
      case 'nutrition-plans': return 'Maak en beheer voedingsplannen';
      case 'education': return 'Beheer educatieve content en cursussen';
      case 'settings': return 'Configureer systeem instellingen en parameters';
      case 'logs': return 'Bekijk systeem logs en foutmeldingen';
      case 'backup': return 'Beheer data backups en herstel opties';
      case 'support': return 'Support tickets en klantservice tools';
      default: return 'Overzicht van alle platform activiteiten en statistieken';
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex">
      {/* Admin Sidebar */}
      <AdminSidebar activeItem={activeItem} onItemClick={handleSidebarClick} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-[#1A1D29] border-b border-[#2A2D3A] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">{getPageTitle()}</h1>
              <p className="text-gray-400 text-sm">{getPageDescription()}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 bg-[#E33412] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium text-sm">
                  + Nieuwe Actie
                </button>
                <button className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors font-medium text-sm">
                  Exporteer Data
                </button>
              </div>
              
              {/* Admin Profile */}
              <div className="relative" ref={adminMenuRef}>
                <button 
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-2 hover:bg-[#2A2D3A] p-2 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <span className="text-white font-medium">Admin</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1D29] border border-[#2A2D3A] rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => setActiveItem('settings')}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A2D3A] transition-colors"
                      >
                        ⚙️ Systeem Instellingen
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
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
} 