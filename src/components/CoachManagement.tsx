import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  certifications: string[];
  experience: number; // years
  status: 'active' | 'inactive' | 'on-leave';
  clients: string[];
  maxClients: number;
  rating: number;
  totalSessions: number;
  joinDate: string;
  avatar?: string;
  bio: string;
  hourlyRate: number;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  performance: {
    clientRetention: number;
    averageRating: number;
    sessionsThisMonth: number;
    revenue: number;
  };
}

interface CoachStats {
  total: number;
  active: number;
  totalClients: number;
  averageRating: number;
  totalRevenue: number;
  specializationBreakdown: Record<string, number>;
}

export default function CoachManagement() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [coachStats, setCoachStats] = useState<CoachStats>({
    total: 0,
    active: 0,
    totalClients: 0,
    averageRating: 0,
    totalRevenue: 0,
    specializationBreakdown: {}
  });

  // Mock data
  useEffect(() => {
    const mockCoaches: Coach[] = [
      {
        id: '1',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@teambenji.nl',
        phone: '+31 6 12345678',
        specializations: ['Kracht Training', 'Gewichtsverlies', 'Functionele Training'],
        certifications: ['NASM-CPT', 'Precision Nutrition Level 1', 'FMS Level 2'],
        experience: 8,
        status: 'active',
        clients: ['1', '3', '7', '12', '18'],
        maxClients: 25,
        rating: 4.9,
        totalSessions: 1247,
        joinDate: '2020-03-15',
        bio: 'Gepassioneerde personal trainer met focus op kracht en conditie. Helpt klanten hun doelen te bereiken door gepersonaliseerde trainingsplannen.',
        hourlyRate: 75,
        availability: {
          monday: ['09:00-12:00', '14:00-18:00'],
          tuesday: ['09:00-12:00', '14:00-18:00'],
          wednesday: ['09:00-12:00', '14:00-18:00'],
          thursday: ['09:00-12:00', '14:00-18:00'],
          friday: ['09:00-12:00', '14:00-16:00'],
          saturday: ['09:00-14:00'],
          sunday: []
        },
        performance: {
          clientRetention: 95,
          averageRating: 4.9,
          sessionsThisMonth: 87,
          revenue: 6525
        }
      },
      {
        id: '2',
        name: 'Mark Johnson',
        email: 'mark.johnson@teambenji.nl',
        phone: '+31 6 87654321',
        specializations: ['HIIT', 'Cardio Training', 'Sport Specifiek'],
        certifications: ['ACSM-CPT', 'TRX Certified', 'Kettlebell Instructor'],
        experience: 6,
        status: 'active',
        clients: ['2', '5', '9', '14', '20', '22'],
        maxClients: 20,
        rating: 4.8,
        totalSessions: 892,
        joinDate: '2021-01-20',
        bio: 'Specialist in high-intensity training en cardiovasculaire conditie. Ervaren in het trainen van atleten en recreatieve sporters.',
        hourlyRate: 70,
        availability: {
          monday: ['08:00-12:00', '15:00-19:00'],
          tuesday: ['08:00-12:00', '15:00-19:00'],
          wednesday: ['08:00-12:00', '15:00-19:00'],
          thursday: ['08:00-12:00', '15:00-19:00'],
          friday: ['08:00-12:00'],
          saturday: ['08:00-16:00'],
          sunday: ['10:00-14:00']
        },
        performance: {
          clientRetention: 88,
          averageRating: 4.8,
          sessionsThisMonth: 76,
          revenue: 5320
        }
      },
      {
        id: '3',
        name: 'Emma Jansen',
        email: 'emma.jansen@teambenji.nl',
        phone: '+31 6 11223344',
        specializations: ['Voeding', 'Gewichtsverlies', 'Lifestyle Coaching'],
        certifications: ['Registered Dietitian', 'Precision Nutrition Level 2', 'Lifestyle Coach'],
        experience: 10,
        status: 'active',
        clients: ['4', '6', '8', '11', '15', '17', '19'],
        maxClients: 30,
        rating: 4.9,
        totalSessions: 1456,
        joinDate: '2019-09-10',
        bio: 'Geregistreerd diëtist en lifestyle coach. Gespecialiseerd in duurzame gewichtsbeheersing en gezonde voedingsgewoonten.',
        hourlyRate: 80,
        availability: {
          monday: ['09:00-17:00'],
          tuesday: ['09:00-17:00'],
          wednesday: ['09:00-17:00'],
          thursday: ['09:00-17:00'],
          friday: ['09:00-15:00'],
          saturday: [],
          sunday: []
        },
        performance: {
          clientRetention: 97,
          averageRating: 4.9,
          sessionsThisMonth: 94,
          revenue: 7520
        }
      },
      {
        id: '4',
        name: 'Lisa de Vries',
        email: 'lisa.devries@teambenji.nl',
        phone: '+31 6 55667788',
        specializations: ['Yoga', 'Pilates', 'Flexibiliteit', 'Mindfulness'],
        certifications: ['RYT-500', 'Pilates Mat Certified', 'Mindfulness Instructor'],
        experience: 5,
        status: 'on-leave',
        clients: ['10', '13', '16'],
        maxClients: 15,
        rating: 4.7,
        totalSessions: 567,
        joinDate: '2022-02-14',
        bio: 'Yoga en Pilates instructeur met focus op mindfulness en lichaamsbesef. Helpt klanten stress te verminderen en flexibiliteit te verbeteren.',
        hourlyRate: 65,
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        performance: {
          clientRetention: 92,
          averageRating: 4.7,
          sessionsThisMonth: 0,
          revenue: 0
        }
      }
    ];

    setCoaches(mockCoaches);
    calculateStats(mockCoaches);
  }, []);

  const calculateStats = (coachList: Coach[]) => {
    const stats: CoachStats = {
      total: coachList.length,
      active: coachList.filter(c => c.status === 'active').length,
      totalClients: coachList.reduce((sum, c) => sum + c.clients.length, 0),
      averageRating: coachList.reduce((sum, c) => sum + c.rating, 0) / coachList.length,
      totalRevenue: coachList.reduce((sum, c) => sum + c.performance.revenue, 0),
      specializationBreakdown: {}
    };

    coachList.forEach(coach => {
      coach.specializations.forEach(spec => {
        stats.specializationBreakdown[spec] = (stats.specializationBreakdown[spec] || 0) + 1;
      });
    });

    setCoachStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 bg-opacity-20 text-green-400';
      case 'inactive': return 'bg-gray-500 bg-opacity-20 text-gray-400';
      case 'on-leave': return 'bg-yellow-500 bg-opacity-20 text-yellow-400';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Actief';
      case 'inactive': return 'Inactief';
      case 'on-leave': return 'Met verlof';
      default: return status;
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coach.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || coach.status === filterStatus;
    const matchesSpecialization = filterSpecialization === 'all' || 
                                 coach.specializations.includes(filterSpecialization);
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const handleCoachAction = (action: string, coachId: string) => {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach) return;

    switch (action) {
      case 'view':
        setSelectedCoach(coach);
        setShowCoachModal(true);
        break;
      case 'assign':
        setSelectedCoach(coach);
        setShowAssignModal(true);
        break;
      case 'deactivate':
        setCoaches(prev => prev.map(c => 
          c.id === coachId ? { ...c, status: 'inactive' as const } : c
        ));
        break;
      case 'activate':
        setCoaches(prev => prev.map(c => 
          c.id === coachId ? { ...c, status: 'active' as const } : c
        ));
        break;
    }
  };

  const allSpecializations = Array.from(new Set(coaches.flatMap(c => c.specializations)));

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Coaches"
          value={coachStats.total.toString()}
          icon="👨‍🏫"
          subtitle="geregistreerd"
        />
        <DataCard
          title="Actieve Coaches"
          value={coachStats.active.toString()}
          icon="✅"
          subtitle={`${Math.round((coachStats.active / coachStats.total) * 100)}% van totaal`}
        />
        <DataCard
          title="Totaal Klanten"
          value={coachStats.totalClients.toString()}
          icon="👥"
          subtitle="toegewezen"
        />
        <DataCard
          title="Gem. Rating"
          value={coachStats.averageRating.toFixed(1)}
          icon="⭐"
          subtitle="van 5.0"
        />
      </div>

      {/* Coach Management */}
      <DataCard title="Coach Beheer" value="" icon="👨‍🏫">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Zoek coaches..."
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
                <option value="on-leave">Met verlof</option>
              </select>
              
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
              >
                <option value="all">Alle specialisaties</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            
            <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
              + Nieuwe Coach
            </button>
          </div>

          {/* Coaches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div key={coach.id} className="bg-[#2A2D3A] rounded-lg p-6 hover:bg-[#3A3D4A] transition-colors">
                {/* Coach Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#E33412] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{coach.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{coach.name}</h3>
                    <p className="text-gray-400 text-sm">{coach.email}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(coach.status)}`}>
                      {getStatusLabel(coach.status)}
                    </span>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <h4 className="text-gray-400 text-sm mb-2">Specialisaties</h4>
                  <div className="flex flex-wrap gap-1">
                    {coach.specializations.slice(0, 3).map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-[#3A3D4A] text-white rounded text-xs">
                        {spec}
                      </span>
                    ))}
                    {coach.specializations.length > 3 && (
                      <span className="px-2 py-1 bg-[#3A3D4A] text-gray-400 rounded text-xs">
                        +{coach.specializations.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-white font-semibold">{coach.clients.length}/{coach.maxClients}</div>
                    <div className="text-gray-400 text-xs">Klanten</div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-1 mt-1">
                      <div 
                        className={`h-1 rounded-full ${
                          (coach.clients.length / coach.maxClients) >= 0.9 ? 'bg-red-400' :
                          (coach.clients.length / coach.maxClients) >= 0.75 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${(coach.clients.length / coach.maxClients) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">⭐ {coach.rating}</div>
                    <div className="text-gray-400 text-xs">Rating</div>
                    <div className="text-gray-400 text-xs mt-1">{coach.experience} jaar ervaring</div>
                  </div>
                </div>

                {/* Performance This Month */}
                <div className="mb-4 p-3 bg-[#1A1D29] rounded-lg">
                  <h4 className="text-gray-400 text-sm mb-2">Deze Maand</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white font-medium">{coach.performance.sessionsThisMonth}</span>
                      <span className="text-gray-400 ml-1">sessies</span>
                    </div>
                    <div>
                      <span className="text-white font-medium">€{coach.performance.revenue}</span>
                      <span className="text-gray-400 ml-1">omzet</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCoachAction('view', coach.id)}
                    className="flex-1 bg-[#E33412] text-white py-2 rounded text-sm hover:bg-[#b9260e] transition-colors"
                  >
                    Bekijk
                  </button>
                  <button 
                    onClick={() => handleCoachAction('assign', coach.id)}
                    className="flex-1 bg-[#3A3D4A] text-white py-2 rounded text-sm hover:bg-[#4A4D5A] transition-colors"
                  >
                    Toewijzen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DataCard>

      {/* Coach Detail Modal */}
      {showCoachModal && selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D29] rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Coach Details - {selectedCoach.name}</h2>
              <button 
                onClick={() => setShowCoachModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#E33412] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{selectedCoach.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold">{selectedCoach.name}</h3>
                  <p className="text-gray-400">{selectedCoach.email}</p>
                  <p className="text-gray-400">{selectedCoach.phone}</p>
                </div>

                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Specialisaties</h4>
                  <div className="space-y-1">
                    {selectedCoach.specializations.map((spec, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {spec}</div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Certificeringen</h4>
                  <div className="space-y-1">
                    {selectedCoach.certifications.map((cert, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {cert}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column - Performance */}
              <div className="space-y-6">
                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-4">Prestaties</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Klant Retentie</span>
                      <span className="text-white font-medium">{selectedCoach.performance.clientRetention}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gem. Rating</span>
                      <span className="text-white font-medium">⭐ {selectedCoach.performance.averageRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sessies deze maand</span>
                      <span className="text-white font-medium">{selectedCoach.performance.sessionsThisMonth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Omzet deze maand</span>
                      <span className="text-white font-medium">€{selectedCoach.performance.revenue}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-4">Klant Capaciteit</h4>
                  <div className="text-center mb-3">
                    <span className={`text-2xl font-bold ${getCapacityColor(selectedCoach.clients.length, selectedCoach.maxClients)}`}>
                      {selectedCoach.clients.length}/{selectedCoach.maxClients}
                    </span>
                  </div>
                  <div className="w-full bg-[#3A3D4A] rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        (selectedCoach.clients.length / selectedCoach.maxClients) >= 0.9 ? 'bg-red-400' :
                        (selectedCoach.clients.length / selectedCoach.maxClients) >= 0.75 ? 'bg-yellow-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${(selectedCoach.clients.length / selectedCoach.maxClients) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-center mt-2 text-gray-400 text-sm">
                    {Math.round((selectedCoach.clients.length / selectedCoach.maxClients) * 100)}% capaciteit
                  </div>
                </div>

                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Bio</h4>
                  <p className="text-gray-300 text-sm">{selectedCoach.bio}</p>
                </div>
              </div>

              {/* Right Column - Schedule */}
              <div className="space-y-6">
                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-4">Beschikbaarheid</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedCoach.availability).map(([day, times]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{day}</span>
                        <div className="text-right">
                          {times.length > 0 ? (
                            times.map((time, index) => (
                              <div key={index} className="text-white text-sm">{time}</div>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">Niet beschikbaar</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#2A2D3A] rounded-lg">
                  <h4 className="text-white font-medium mb-2">Tarieven</h4>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-white">€{selectedCoach.hourlyRate}</span>
                    <span className="text-gray-400 ml-1">per uur</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-[#E33412] text-white py-2 rounded-lg hover:bg-[#b9260e] transition-colors">
                    Bewerken
                  </button>
                  <button className="w-full bg-[#2A2D3A] text-white py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors">
                    Klanten Toewijzen
                  </button>
                  <button className="w-full bg-[#2A2D3A] text-white py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors">
                    Schema Bekijken
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D29] rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-bold">Klant Toewijzen - {selectedCoach.name}</h2>
              <button 
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                Selecteer klanten om toe te wijzen aan {selectedCoach.name}. 
                Huidige capaciteit: {selectedCoach.clients.length}/{selectedCoach.maxClients}
              </p>
              
              {/* Available clients would be listed here */}
              <div className="text-center py-8">
                <span className="text-gray-400">Klant toewijzing interface - Coming Soon</span>
              </div>
              
              <div className="flex gap-3">
                <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors">
                  Toewijzen
                </button>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg hover:bg-[#3A3D4A] transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 