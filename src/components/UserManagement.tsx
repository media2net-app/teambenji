import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'basic' | 'premium' | 'elite';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastLogin: string;
  coach?: string;
  totalSessions: number;
  avatar?: string;
  phone?: string;
  goals: string[];
  progress: {
    weight: { current: number; target: number };
    sessions: { completed: number; planned: number };
  };
}

interface UserStats {
  total: number;
  active: number;
  newThisMonth: number;
  subscriptionBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    subscriptionBreakdown: {},
    statusBreakdown: {}
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Jan Pietersen',
        email: 'jan.pietersen@email.com',
        subscription: 'premium',
        status: 'active',
        registrationDate: '2024-01-15',
        lastLogin: '2024-01-20',
        coach: 'Sarah Wilson',
        totalSessions: 24,
        phone: '+31 6 12345678',
        goals: ['Gewichtsverlies', 'Kracht opbouwen'],
        progress: {
          weight: { current: 78, target: 75 },
          sessions: { completed: 24, planned: 30 }
        }
      },
      {
        id: '2',
        name: 'Lisa de Vries',
        email: 'lisa.devries@email.com',
        subscription: 'elite',
        status: 'active',
        registrationDate: '2023-11-20',
        lastLogin: '2024-01-20',
        coach: 'Mark Johnson',
        totalSessions: 87,
        phone: '+31 6 87654321',
        goals: ['Marathon training', 'Uithoudingsvermogen'],
        progress: {
          weight: { current: 62, target: 60 },
          sessions: { completed: 87, planned: 100 }
        }
      },
      {
        id: '3',
        name: 'Tom van der Berg',
        email: 'tom.vandenberg@email.com',
        subscription: 'basic',
        status: 'active',
        registrationDate: '2024-01-10',
        lastLogin: '2024-01-19',
        totalSessions: 8,
        phone: '+31 6 11223344',
        goals: ['Algemene fitness'],
        progress: {
          weight: { current: 85, target: 80 },
          sessions: { completed: 8, planned: 12 }
        }
      },
      {
        id: '4',
        name: 'Emma Jansen',
        email: 'emma.jansen@email.com',
        subscription: 'premium',
        status: 'inactive',
        registrationDate: '2023-12-05',
        lastLogin: '2024-01-10',
        coach: 'Emma Jansen',
        totalSessions: 45,
        phone: '+31 6 55667788',
        goals: ['Spiermassa', 'Kracht'],
        progress: {
          weight: { current: 68, target: 70 },
          sessions: { completed: 45, planned: 50 }
        }
      },
      {
        id: '5',
        name: 'Pieter Smit',
        email: 'pieter.smit@email.com',
        subscription: 'basic',
        status: 'suspended',
        registrationDate: '2023-10-15',
        lastLogin: '2023-12-20',
        totalSessions: 15,
        phone: '+31 6 99887766',
        goals: ['Gewichtsverlies'],
        progress: {
          weight: { current: 95, target: 85 },
          sessions: { completed: 15, planned: 20 }
        }
      }
    ];

    setUsers(mockUsers);
    calculateStats(mockUsers);
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus, filterSubscription]);

  const calculateStats = (userList: User[]) => {
    const stats: UserStats = {
      total: userList.length,
      active: userList.filter(u => u.status === 'active').length,
      newThisMonth: userList.filter(u => {
        const regDate = new Date(u.registrationDate);
        const now = new Date();
        return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
      }).length,
      subscriptionBreakdown: {},
      statusBreakdown: {}
    };

    userList.forEach(user => {
      stats.subscriptionBreakdown[user.subscription] = (stats.subscriptionBreakdown[user.subscription] || 0) + 1;
      stats.statusBreakdown[user.status] = (stats.statusBreakdown[user.status] || 0) + 1;
    });

    setUserStats(stats);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    if (filterSubscription !== 'all') {
      filtered = filtered.filter(user => user.subscription === filterSubscription);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'basic': return 'bg-blue-500 bg-opacity-20 text-blue-400';
      case 'premium': return 'bg-orange-500 bg-opacity-20 text-orange-400';
      case 'elite': return 'bg-purple-500 bg-opacity-20 text-purple-400';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'inactive': return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      case 'suspended': return 'bg-red-500 bg-opacity-20 text-red-400';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const getSubscriptionLabel = (subscription: string) => {
    switch (subscription) {
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      case 'elite': return 'Elite';
      default: return subscription;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actief';
      case 'inactive': return 'Inactief';
      case 'suspended': return 'Geschorst';
      default: return status;
    }
  };

  const handleUserAction = (action: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'view':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case 'suspend':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'suspended' as const } : u
        ));
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'delete':
        if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
        }
        break;
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Gebruikers"
          value={userStats.total.toString()}
          icon="👥"
          subtitle="geregistreerd"
        />
        <DataCard
          title="Actieve Gebruikers"
          value={userStats.active.toString()}
          icon="✅"
          subtitle={`${Math.round((userStats.active / userStats.total) * 100)}% van totaal`}
        />
        <DataCard
          title="Nieuwe Deze Maand"
          value={userStats.newThisMonth.toString()}
          icon="🆕"
          subtitle="nieuwe registraties"
        />
        <DataCard
          title="Gemiddelde Sessies"
          value={Math.round(users.reduce((sum, u) => sum + u.totalSessions, 0) / users.length).toString()}
          icon="🏋️"
          subtitle="per gebruiker"
        />
      </div>

      {/* Filters and Search */}
      <DataCard title="Gebruikersbeheer" value="" icon="👥">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Zoek gebruikers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2A2D3A] text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#E33412] w-64"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
              >
                <option value="all">Alle statussen</option>
                <option value="active">Actief</option>
                <option value="inactive">Inactief</option>
                <option value="suspended">Geschorst</option>
              </select>
              
              <select
                value={filterSubscription}
                onChange={(e) => setFilterSubscription(e.target.value)}
                className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
              >
                <option value="all">Alle abonnementen</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            
            <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
              + Nieuwe Gebruiker
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3A3D4A]">
                  <th className="text-left text-gray-400 py-3 px-4">Gebruiker</th>
                  <th className="text-left text-gray-400 py-3 px-4">Abonnement</th>
                  <th className="text-left text-gray-400 py-3 px-4">Status</th>
                  <th className="text-left text-gray-400 py-3 px-4">Coach</th>
                  <th className="text-left text-gray-400 py-3 px-4">Sessies</th>
                  <th className="text-left text-gray-400 py-3 px-4">Laatste Login</th>
                  <th className="text-left text-gray-400 py-3 px-4">Acties</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#2A2D3A] hover:bg-[#2A2D3A] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E33412] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-gray-400 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSubscriptionColor(user.subscription)}`}>
                        {getSubscriptionLabel(user.subscription)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white">{user.coach || 'Niet toegewezen'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white">{user.totalSessions}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white">{new Date(user.lastLogin).toLocaleDateString('nl-NL')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUserAction('view', user.id)}
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Bekijk
                        </button>
                        {user.status === 'active' ? (
                          <button 
                            onClick={() => handleUserAction('suspend', user.id)}
                            className="text-yellow-400 hover:underline text-sm"
                          >
                            Schors
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUserAction('activate', user.id)}
                            className="text-green-400 hover:underline text-sm"
                          >
                            Activeer
                          </button>
                        )}
                        <button 
                          onClick={() => handleUserAction('delete', user.id)}
                          className="text-red-400 hover:underline text-sm"
                        >
                          Verwijder
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Toont {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} van {filteredUsers.length} gebruikers
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-[#2A2D3A] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3D4A] transition-colors"
                >
                  Vorige
                </button>
                <span className="px-3 py-1 text-white">
                  {currentPage} van {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-[#2A2D3A] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3D4A] transition-colors"
                >
                  Volgende
                </button>
              </div>
            </div>
          )}
        </div>
      </DataCard>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D29] rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Gebruiker Details</h2>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Naam</label>
                  <div className="text-white font-medium">{selectedUser.name}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Email</label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Telefoon</label>
                  <div className="text-white">{selectedUser.phone || 'Niet opgegeven'}</div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Registratie Datum</label>
                  <div className="text-white">{new Date(selectedUser.registrationDate).toLocaleDateString('nl-NL')}</div>
                </div>
              </div>

              {/* Subscription & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Abonnement</label>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getSubscriptionColor(selectedUser.subscription)}`}>
                    {getSubscriptionLabel(selectedUser.subscription)}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Status</label>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                    {getStatusLabel(selectedUser.status)}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Coach</label>
                  <div className="text-white">{selectedUser.coach || 'Niet toegewezen'}</div>
                </div>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Doelen</label>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.goals.map((goal, index) => (
                    <span key={index} className="px-2 py-1 bg-[#2A2D3A] text-white rounded text-sm">
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Voortgang</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#2A2D3A] rounded-lg">
                    <h4 className="text-white font-medium mb-2">Gewicht</h4>
                    <div className="text-white">
                      {selectedUser.progress.weight.current}kg → {selectedUser.progress.weight.target}kg
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2 mt-2">
                      <div 
                        className="bg-[#E33412] h-2 rounded-full"
                        style={{ 
                          width: `${Math.min((selectedUser.progress.weight.current / selectedUser.progress.weight.target) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#2A2D3A] rounded-lg">
                    <h4 className="text-white font-medium mb-2">Sessies</h4>
                    <div className="text-white">
                      {selectedUser.progress.sessions.completed} / {selectedUser.progress.sessions.planned}
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full"
                        style={{ 
                          width: `${(selectedUser.progress.sessions.completed / selectedUser.progress.sessions.planned) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
                <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors">
                  Bewerken
                </button>
                <button className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors">
                  Coach Toewijzen
                </button>
                <button className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors">
                  Sessie Historie
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 