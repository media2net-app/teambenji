import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'bodyweight';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string;
  videoUrl?: string;
  imageUrl?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
}

interface Workout {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps?: number;
    duration?: number;
    restTime: number;
    order: number;
  }[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscleGroups: string[];
  equipment: string[];
  calories: number;
}

interface Program {
  id: string;
  name: string;
  description: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'weight-loss' | 'muscle-gain' | 'endurance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  workouts: Workout[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  thumbnail?: string;
  targetAudience: string[];
  prerequisites: string[];
  goals: string[];
  equipment: string[];
  totalWorkouts: number;
  totalDuration: number; // total hours
  rating: number;
  participants: number;
  completionRate: number;
}

interface ProgramStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  totalParticipants: number;
  avgRating: number;
  avgCompletionRate: number;
  typeBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
}

export default function ProgramManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [programsPerPage] = useState(6);
  const [programStats, setProgramStats] = useState<ProgramStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    totalParticipants: 0,
    avgRating: 0,
    avgCompletionRate: 0,
    typeBreakdown: {},
    difficultyBreakdown: {}
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockPrograms: Program[] = [
      {
        id: '1',
        name: 'Kracht Opbouw 12 Weken',
        description: 'Complete krachttraining programma voor beginners tot gevorderden. Focus op compound oefeningen en progressieve overload.',
        type: 'strength',
        difficulty: 'intermediate',
        duration: 12,
        workouts: [],
        author: 'Mark Johnson',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['krachttraining', 'compound', 'progressie', 'beginners'],
        thumbnail: '/thumbnails/strength-program.jpg',
        targetAudience: ['Beginners', 'Intermediate'],
        prerequisites: ['Basis fitness niveau', 'Toegang tot gym'],
        goals: ['Spieropbouw', 'Kracht toename', 'Algemene fitness'],
        equipment: ['Barbell', 'Dumbbells', 'Squat rack', 'Bench'],
        totalWorkouts: 36,
        totalDuration: 72,
        rating: 4.8,
        participants: 234,
        completionRate: 78
      },
      {
        id: '2',
        name: 'HIIT Fat Burner',
        description: 'Intensief interval training programma voor maximale vetverbranding en cardiovasculaire conditie.',
        type: 'hiit',
        difficulty: 'advanced',
        duration: 8,
        workouts: [],
        author: 'Sarah Wilson',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        status: 'published',
        tags: ['HIIT', 'vetverbranding', 'cardio', 'intensief'],
        thumbnail: '/thumbnails/hiit-program.jpg',
        targetAudience: ['Intermediate', 'Advanced'],
        prerequisites: ['Goede conditie', 'Gezonde gewrichten'],
        goals: ['Vetverbranding', 'Conditie verbetering', 'Uithoudingsvermogen'],
        equipment: ['Geen', 'Optioneel: dumbbells'],
        totalWorkouts: 24,
        totalDuration: 32,
        rating: 4.6,
        participants: 156,
        completionRate: 65
      },
      {
        id: '3',
        name: 'Yoga Flow voor Flexibiliteit',
        description: 'Dagelijkse yoga routine voor verbeterde flexibiliteit, balans en mentale rust.',
        type: 'flexibility',
        difficulty: 'beginner',
        duration: 6,
        workouts: [],
        author: 'Lisa de Vries',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19',
        status: 'published',
        tags: ['yoga', 'flexibiliteit', 'balans', 'ontspanning'],
        thumbnail: '/thumbnails/yoga-program.jpg',
        targetAudience: ['Beginners', 'Alle niveaus'],
        prerequisites: ['Geen'],
        goals: ['Flexibiliteit', 'Balans', 'Stress reductie', 'Mentale rust'],
        equipment: ['Yoga mat'],
        totalWorkouts: 42,
        totalDuration: 42,
        rating: 4.9,
        participants: 89,
        completionRate: 92
      },
      {
        id: '4',
        name: 'Marathon Training Plan',
        description: '16-weken programma voor het trainen van je eerste marathon met geleidelijke opbouw.',
        type: 'endurance',
        difficulty: 'intermediate',
        duration: 16,
        workouts: [],
        author: 'Tom van der Berg',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-15',
        status: 'draft',
        tags: ['marathon', 'hardlopen', 'endurance', 'duurtraining'],
        thumbnail: '/thumbnails/marathon-program.jpg',
        targetAudience: ['Intermediate', 'Advanced'],
        prerequisites: ['Basis hardloop ervaring', '10km kunnen lopen'],
        goals: ['Marathon voltooien', 'Endurance opbouwen', 'Hardloop techniek'],
        equipment: ['Hardloopschoenen', 'GPS watch'],
        totalWorkouts: 64,
        totalDuration: 128,
        rating: 0,
        participants: 0,
        completionRate: 0
      },
      {
        id: '5',
        name: 'Bodyweight Mastery',
        description: 'Gebruik je eigen lichaamsgewicht voor een complete transformatie zonder apparatuur.',
        type: 'strength',
        difficulty: 'beginner',
        duration: 10,
        workouts: [],
        author: 'Emma Jansen',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['bodyweight', 'thuis training', 'functioneel', 'calisthenics'],
        thumbnail: '/thumbnails/bodyweight-program.jpg',
        targetAudience: ['Beginners', 'Intermediate'],
        prerequisites: ['Geen'],
        goals: ['Functionele kracht', 'Lichaamscontrole', 'Thuis fitness'],
        equipment: ['Geen'],
        totalWorkouts: 30,
        totalDuration: 45,
        rating: 4.7,
        participants: 312,
        completionRate: 85
      },
      {
        id: '6',
        name: 'Powerlifting Fundamentals',
        description: 'Leer de drie grote lifts: squat, bench press en deadlift met perfecte techniek.',
        type: 'strength',
        difficulty: 'advanced',
        duration: 14,
        workouts: [],
        author: 'Mark Johnson',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        status: 'archived',
        tags: ['powerlifting', 'squat', 'bench', 'deadlift', 'techniek'],
        thumbnail: '/thumbnails/powerlifting-program.jpg',
        targetAudience: ['Advanced'],
        prerequisites: ['Ervaring met compound lifts', 'Toegang tot powerlifting setup'],
        goals: ['Powerlifting techniek', 'Maximale kracht', 'Competitie voorbereiding'],
        equipment: ['Powerlifting setup', 'Weightlifting belt', 'Wrist wraps'],
        totalWorkouts: 42,
        totalDuration: 84,
        rating: 4.5,
        participants: 67,
        completionRate: 58
      }
    ];

    setPrograms(mockPrograms);
    setFilteredPrograms(mockPrograms);
    calculateStats(mockPrograms);
  }, []);

  const calculateStats = (programList: Program[]) => {
    const stats: ProgramStats = {
      total: programList.length,
      published: programList.filter(p => p.status === 'published').length,
      drafts: programList.filter(p => p.status === 'draft').length,
      archived: programList.filter(p => p.status === 'archived').length,
      totalParticipants: programList.reduce((sum, p) => sum + p.participants, 0),
      avgRating: Math.round((programList.reduce((sum, p) => sum + p.rating, 0) / programList.length) * 10) / 10,
      avgCompletionRate: Math.round(programList.reduce((sum, p) => sum + p.completionRate, 0) / programList.length),
      typeBreakdown: {},
      difficultyBreakdown: {}
    };

    // Calculate breakdowns
    programList.forEach(p => {
      stats.typeBreakdown[p.type] = (stats.typeBreakdown[p.type] || 0) + 1;
      stats.difficultyBreakdown[p.difficulty] = (stats.difficultyBreakdown[p.difficulty] || 0) + 1;
    });

    setProgramStats(stats);
  };

  const filterPrograms = () => {
    let filtered = programs;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === filterDifficulty);
    }

    setFilteredPrograms(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterPrograms();
  }, [searchTerm, filterStatus, filterType, filterDifficulty, programs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/10';
      case 'draft': return 'text-yellow-400 bg-yellow-400/10';
      case 'archived': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-[#E33412] bg-[#E33412]/10';
      case 'cardio': return 'text-blue-400 bg-blue-400/10';
      case 'flexibility': return 'text-purple-400 bg-purple-400/10';
      case 'hiit': return 'text-orange-400 bg-orange-400/10';
      case 'weight-loss': return 'text-green-400 bg-green-400/10';
      case 'muscle-gain': return 'text-pink-400 bg-pink-400/10';
      case 'endurance': return 'text-cyan-400 bg-cyan-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10';
      case 'advanced': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Gepubliceerd';
      case 'draft': return 'Concept';
      case 'archived': return 'Gearchiveerd';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'strength': return 'Kracht';
      case 'cardio': return 'Cardio';
      case 'flexibility': return 'Flexibiliteit';
      case 'hiit': return 'HIIT';
      case 'weight-loss': return 'Gewichtsverlies';
      case 'muscle-gain': return 'Spieropbouw';
      case 'endurance': return 'Uithoudingsvermogen';
      default: return type;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Gevorderd';
      case 'advanced': return 'Expert';
      default: return difficulty;
    }
  };

  const handleProgramAction = (action: string, programId: string) => {
    console.log(`${action} program ${programId}`);
    // Implement action logic
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Pagination
  const indexOfLastProgram = currentPage * programsPerPage;
  const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
  const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
  const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Programma's"
          value={programStats.total}
          icon="🏋️"
          subtitle="programma's"
          className="animate-fade-in"
        />
        <DataCard
          title="Gepubliceerd"
          value={programStats.published}
          change={`${Math.round((programStats.published / programStats.total) * 100)}%`}
          changeType="positive"
          icon="✅"
          subtitle="van totaal"
          className="animate-fade-in"
        />
        <DataCard
          title="Totaal Deelnemers"
          value={formatNumber(programStats.totalParticipants)}
          icon="👥"
          subtitle="actieve gebruikers"
          className="animate-fade-in"
        />
        <DataCard
          title="Gem. Voltooiing"
          value={`${programStats.avgCompletionRate}%`}
          icon="📈"
          subtitle="success rate"
          className="animate-fade-in"
        />
      </div>

      {/* Filters and Search */}
      <DataCard title="Programma Beheer" value="" icon="🎛️">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Zoek in programma's..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
            >
              <option value="all">Alle Statussen</option>
              <option value="published">Gepubliceerd</option>
              <option value="draft">Concept</option>
              <option value="archived">Gearchiveerd</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
            >
              <option value="all">Alle Types</option>
              <option value="strength">Kracht</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibiliteit</option>
              <option value="hiit">HIIT</option>
              <option value="weight-loss">Gewichtsverlies</option>
              <option value="muscle-gain">Spieropbouw</option>
              <option value="endurance">Uithoudingsvermogen</option>
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
            >
              <option value="all">Alle Niveaus</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Gevorderd</option>
              <option value="advanced">Expert</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              {filteredPrograms.length} van {programs.length} programma's
            </div>
            <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2">
              <span>➕</span>
              Nieuw Programma
            </button>
          </div>
        </div>
      </DataCard>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentPrograms.map((program, index) => (
          <div
            key={program.id}
            className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 hover:border-[#E33412]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E33412]/10 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg group-hover:text-[#E33412] transition-colors duration-300 line-clamp-2">
                  {program.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {program.description}
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative mb-4">
              <div className="aspect-video bg-[#2A2D3A] rounded-lg flex items-center justify-center overflow-hidden">
                {program.thumbnail ? (
                  <img src={program.thumbnail} alt={program.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-6xl">
                    {program.type === 'strength' && '🏋️'}
                    {program.type === 'cardio' && '🏃'}
                    {program.type === 'flexibility' && '🧘'}
                    {program.type === 'hiit' && '⚡'}
                    {program.type === 'weight-loss' && '🔥'}
                    {program.type === 'muscle-gain' && '💪'}
                    {program.type === 'endurance' && '🏃‍♂️'}
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                {getStatusLabel(program.status)}
              </div>
              
              {/* Type Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(program.type)}`}>
                {getTypeLabel(program.type)}
              </div>
            </div>

            {/* Program Details */}
            <div className="space-y-3">
              {/* Difficulty */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(program.difficulty)}`}>
                {getDifficultyLabel(program.difficulty)}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Duur</div>
                  <div className="text-white font-medium">{program.duration} weken</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Workouts</div>
                  <div className="text-white font-medium">{program.totalWorkouts}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Deelnemers</div>
                  <div className="text-white font-medium">{formatNumber(program.participants)}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Rating</div>
                  <div className="text-white font-medium">⭐ {program.rating}</div>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Doelen:</div>
                <div className="flex flex-wrap gap-1">
                  {program.goals.slice(0, 3).map((goal, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#E33412]/10 text-[#E33412] text-xs rounded">
                      {goal}
                    </span>
                  ))}
                  {program.goals.length > 3 && (
                    <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                      +{program.goals.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-[#2A2D3A]">
                <span>👤 {program.author}</span>
                <span>📅 {formatDate(program.updatedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => handleProgramAction('edit', program.id)}
                  className="flex-1 bg-[#2A2D3A] text-white px-3 py-2 rounded text-sm hover:bg-[#3A3D4A] transition-colors"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleProgramAction('view', program.id)}
                  className="flex-1 bg-[#E33412] text-white px-3 py-2 rounded text-sm hover:bg-[#b9260e] transition-colors"
                >
                  Bekijken
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <DataCard title="Paginering" value="" icon="📄">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#2A2D3A] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3D4A] transition-colors"
            >
              ← Vorige
            </button>
            
            <span className="text-white text-sm">
              Pagina {currentPage} van {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-[#2A2D3A] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3A3D4A] transition-colors"
            >
              Volgende →
            </button>
          </div>
        </DataCard>
      )}
    </div>
  );
} 