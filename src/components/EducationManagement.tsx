import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'interactive';
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  videoUrl?: string;
  resources: string[];
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'anatomy' | 'nutrition' | 'training' | 'recovery' | 'psychology' | 'technology';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // total hours
  lessons: Lesson[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  thumbnail?: string;
  targetAudience: string[];
  prerequisites: string[];
  learningObjectives: string[];
  totalLessons: number;
  avgDuration: number; // minutes per lesson
  rating: number;
  participants: number;
  completionRate: number;
  certificate: boolean;
  price: number;
}

interface EducationStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  totalParticipants: number;
  avgRating: number;
  avgCompletionRate: number;
  categoryBreakdown: Record<string, number>;
  levelBreakdown: Record<string, number>;
  totalHours: number;
}

export default function EducationManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [educationStats, setEducationStats] = useState<EducationStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    totalParticipants: 0,
    avgRating: 0,
    avgCompletionRate: 0,
    categoryBreakdown: {},
    levelBreakdown: {},
    totalHours: 0
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Anatomie voor Sporters',
        description: 'Leer de basis van menselijke anatomie en hoe dit van toepassing is op sport en training.',
        category: 'anatomy',
        level: 'beginner',
        duration: 8,
        lessons: [],
        author: 'Dr. Sarah Wilson',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['anatomie', 'basis', 'sport', 'lichaam'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetAudience: ['Beginners', 'Sporters', 'Coaches'],
        prerequisites: ['Geen'],
        learningObjectives: ['Basis anatomie begrijpen', 'Spiergroepen identificeren', 'Bewegingspatronen herkennen'],
        totalLessons: 12,
        avgDuration: 40,
        rating: 4.8,
        participants: 156,
        completionRate: 85,
        certificate: true,
        price: 49
      },
      {
        id: '2',
        title: 'Voedingswetenschap Gevorderd',
        description: 'Diepgaande kennis over voeding, metabolisme en optimale prestaties.',
        category: 'nutrition',
        level: 'advanced',
        duration: 16,
        lessons: [],
        author: 'Prof. Mark Johnson',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        status: 'published',
        tags: ['voeding', 'wetenschap', 'metabolisme', 'prestatie'],
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
        targetAudience: ['Gevorderden', 'Nutritionisten', 'Atleten'],
        prerequisites: ['Basis voedingskennis', 'Wetenschappelijke achtergrond'],
        learningObjectives: ['Metabolisme begrijpen', 'Voedingsstrategieën ontwikkelen', 'Prestatie optimaliseren'],
        totalLessons: 20,
        avgDuration: 48,
        rating: 4.9,
        participants: 89,
        completionRate: 72,
        certificate: true,
        price: 99
      },
      {
        id: '3',
        title: 'Krachttraining Techniek',
        description: 'Master de fundamenten van krachttraining met focus op veiligheid en effectiviteit.',
        category: 'training',
        level: 'intermediate',
        duration: 12,
        lessons: [],
        author: 'Lisa de Vries',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19',
        status: 'published',
        tags: ['krachttraining', 'techniek', 'veiligheid', 'effectiviteit'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetAudience: ['Intermediate', 'Personal Trainers', 'Fitness enthousiasten'],
        prerequisites: ['Basis fitness ervaring'],
        learningObjectives: ['Juiste techniek beheersen', 'Veilige training uitvoeren', 'Progressie plannen'],
        totalLessons: 15,
        avgDuration: 45,
        rating: 4.7,
        participants: 234,
        completionRate: 78,
        certificate: true,
        price: 79
      },
      {
        id: '4',
        title: 'Herstel en Regeneratie',
        description: 'Optimaliseer je herstel voor betere prestaties en minder blessures.',
        category: 'recovery',
        level: 'intermediate',
        duration: 6,
        lessons: [],
        author: 'Tom van der Berg',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-15',
        status: 'draft',
        tags: ['herstel', 'regeneratie', 'blessurepreventie', 'prestatie'],
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        targetAudience: ['Intermediate', 'Atleten', 'Coaches'],
        prerequisites: ['Basis training kennis'],
        learningObjectives: ['Herstel strategieën begrijpen', 'Blessurepreventie toepassen', 'Prestatie verbeteren'],
        totalLessons: 8,
        avgDuration: 35,
        rating: 0,
        participants: 0,
        completionRate: 0,
        certificate: false,
        price: 39
      },
      {
        id: '5',
        title: 'Sportpsychologie',
        description: 'Ontwikkel mentale kracht en focus voor optimale sportprestaties.',
        category: 'psychology',
        level: 'beginner',
        duration: 10,
        lessons: [],
        author: 'Emma Jansen',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['psychologie', 'mentale kracht', 'focus', 'prestatie'],
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        targetAudience: ['Beginners', 'Atleten', 'Coaches'],
        prerequisites: ['Geen'],
        learningObjectives: ['Mentale technieken leren', 'Focus verbeteren', 'Prestatiedruk hanteren'],
        totalLessons: 10,
        avgDuration: 60,
        rating: 4.6,
        participants: 178,
        completionRate: 82,
        certificate: true,
        price: 59
      },
      {
        id: '6',
        title: 'Fitness App Technologie',
        description: 'Leer hoe je technologie kunt gebruiken om je fitness reis te optimaliseren.',
        category: 'technology',
        level: 'beginner',
        duration: 4,
        lessons: [],
        author: 'Mark Johnson',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        status: 'archived',
        tags: ['technologie', 'apps', 'tracking', 'digitale tools'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        targetAudience: ['Beginners', 'Tech enthousiasten'],
        prerequisites: ['Basis smartphone kennis'],
        learningObjectives: ['Fitness apps gebruiken', 'Data tracking begrijpen', 'Digitale tools implementeren'],
        totalLessons: 6,
        avgDuration: 30,
        rating: 4.2,
        participants: 67,
        completionRate: 65,
        certificate: false,
        price: 29
      }
    ];

    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
    calculateStats(mockCourses);
  }, []);

  const calculateStats = (courseList: Course[]) => {
    const stats: EducationStats = {
      total: courseList.length,
      published: courseList.filter(c => c.status === 'published').length,
      drafts: courseList.filter(c => c.status === 'draft').length,
      archived: courseList.filter(c => c.status === 'archived').length,
      totalParticipants: courseList.reduce((sum, c) => sum + c.participants, 0),
      avgRating: Math.round((courseList.reduce((sum, c) => sum + c.rating, 0) / courseList.length) * 10) / 10,
      avgCompletionRate: Math.round(courseList.reduce((sum, c) => sum + c.completionRate, 0) / courseList.length),
      categoryBreakdown: {},
      levelBreakdown: {},
      totalHours: courseList.reduce((sum, c) => sum + c.duration, 0)
    };

    // Calculate breakdowns
    courseList.forEach(c => {
      stats.categoryBreakdown[c.category] = (stats.categoryBreakdown[c.category] || 0) + 1;
      stats.levelBreakdown[c.level] = (stats.levelBreakdown[c.level] || 0) + 1;
    });

    setEducationStats(stats);
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(c => c.category === filterCategory);
    }

    if (filterLevel !== 'all') {
      filtered = filtered.filter(c => c.level === filterLevel);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterCourses();
  }, [searchTerm, filterStatus, filterCategory, filterLevel, courses]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/10';
      case 'draft': return 'text-yellow-400 bg-yellow-400/10';
      case 'archived': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anatomy': return 'text-[#E33412] bg-[#E33412]/10';
      case 'nutrition': return 'text-green-400 bg-green-400/10';
      case 'training': return 'text-blue-400 bg-blue-400/10';
      case 'recovery': return 'text-purple-400 bg-purple-400/10';
      case 'psychology': return 'text-pink-400 bg-pink-400/10';
      case 'technology': return 'text-cyan-400 bg-cyan-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'anatomy': return 'Anatomie';
      case 'nutrition': return 'Voeding';
      case 'training': return 'Training';
      case 'recovery': return 'Herstel';
      case 'psychology': return 'Psychologie';
      case 'technology': return 'Technologie';
      default: return category;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Gevorderd';
      case 'advanced': return 'Expert';
      default: return level;
    }
  };

  const handleCourseAction = (action: string, courseId: string) => {
    const courseItem = courses.find(c => c.id === courseId);
    if (courseItem) {
      setSelectedCourse(courseItem);
      setModalMode(action === 'edit' ? 'edit' : 'view');
      setShowCourseModal(true);
    }
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setModalMode('create');
    setShowCourseModal(true);
  };

  const handleCloseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (modalMode === 'create') {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || 'Nieuwe Cursus',
        description: courseData.description || '',
        category: courseData.category || 'training',
        level: courseData.level || 'beginner',
        duration: courseData.duration || 4,
        lessons: [],
        author: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        tags: courseData.tags || [],
        targetAudience: courseData.targetAudience || [],
        prerequisites: courseData.prerequisites || [],
        learningObjectives: courseData.learningObjectives || [],
        totalLessons: 0,
        avgDuration: 0,
        rating: 0,
        participants: 0,
        completionRate: 0,
        certificate: false,
        price: 0,
        ...courseData
      };
      setCourses(prev => [newCourse, ...prev]);
    } else if (selectedCourse) {
      setCourses(prev => prev.map(c => 
        c.id === selectedCourse.id 
          ? { ...c, ...courseData, updatedAt: new Date().toISOString() }
          : c
      ));
    }
    handleCloseModal();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Weet je zeker dat je deze cursus wilt verwijderen?')) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      handleCloseModal();
    }
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

  const formatPrice = (price: number) => {
    return `€${price}`;
  };

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Cursussen"
          value={educationStats.total}
          icon="📚"
          subtitle="cursussen"
          className="animate-fade-in"
        />
        <DataCard
          title="Gepubliceerd"
          value={educationStats.published}
          change={`${Math.round((educationStats.published / educationStats.total) * 100)}%`}
          changeType="positive"
          icon="✅"
          subtitle="van totaal"
          className="animate-fade-in"
        />
        <DataCard
          title="Totaal Uren"
          value={educationStats.totalHours}
          icon="⏱️"
          subtitle="leercontent"
          className="animate-fade-in"
        />
        <DataCard
          title="Gem. Voltooiing"
          value={`${educationStats.avgCompletionRate}%`}
          icon="📈"
          subtitle="success rate"
          className="animate-fade-in"
        />
      </div>

      {/* Filters and Search */}
      <DataCard title="Educatie Beheer" value="" icon="🎛️">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Zoek in cursussen..."
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
            >
              <option value="all">Alle Categorieën</option>
              <option value="anatomy">Anatomie</option>
              <option value="nutrition">Voeding</option>
              <option value="training">Training</option>
              <option value="recovery">Herstel</option>
              <option value="psychology">Psychologie</option>
              <option value="technology">Technologie</option>
            </select>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
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
              {filteredCourses.length} van {courses.length} cursussen
            </div>
            <button 
              onClick={handleCreateCourse}
              className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Nieuwe Cursus
            </button>
          </div>
        </div>
      </DataCard>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentCourses.map((course, index) => (
          <div
            key={course.id}
            className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 hover:border-[#E33412]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E33412]/10 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg group-hover:text-[#E33412] transition-colors duration-300 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative mb-4">
              <div className="aspect-video bg-[#2A2D3A] rounded-lg flex items-center justify-center overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-6xl">
                    {course.category === 'anatomy' && '🦴'}
                    {course.category === 'nutrition' && '🥗'}
                    {course.category === 'training' && '🏋️'}
                    {course.category === 'recovery' && '🧘'}
                    {course.category === 'psychology' && '🧠'}
                    {course.category === 'technology' && '📱'}
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {getStatusLabel(course.status)}
              </div>
              
              {/* Category Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                {getCategoryLabel(course.category)}
              </div>

              {/* Certificate Badge */}
              {course.certificate && (
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400">
                  🏆 Certificaat
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-[#E33412]/20 text-[#E33412]">
                {formatPrice(course.price)}
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-3">
              {/* Level */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {getLevelLabel(course.level)}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Duur</div>
                  <div className="text-white font-medium">{course.duration} uur</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Lessen</div>
                  <div className="text-white font-medium">{course.totalLessons}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Deelnemers</div>
                  <div className="text-white font-medium">{formatNumber(course.participants)}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Rating</div>
                  <div className="text-white font-medium">⭐ {course.rating}</div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Leerdoelen:</div>
                <div className="flex flex-wrap gap-1">
                  {course.learningObjectives.slice(0, 2).map((objective, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#E33412]/10 text-[#E33412] text-xs rounded">
                      {objective}
                    </span>
                  ))}
                  {course.learningObjectives.length > 2 && (
                    <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                      +{course.learningObjectives.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-[#2A2D3A]">
                <span>👤 {course.author}</span>
                <span>📅 {formatDate(course.updatedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => handleCourseAction('edit', course.id)}
                  className="flex-1 bg-[#2A2D3A] text-white px-3 py-2 rounded text-sm hover:bg-[#3A3D4A] transition-colors"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleCourseAction('view', course.id)}
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

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                {modalMode === 'create' ? 'Nieuwe Cursus' : 
                 modalMode === 'edit' ? 'Cursus Bewerken' : 'Cursus Bekijken'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {modalMode === 'view' && selectedCourse ? (
              <div className="space-y-6">
                {/* Course Header */}
                <div className="flex items-start gap-4">
                  <div className="w-32 h-24 bg-[#2A2D3A] rounded-lg overflow-hidden flex-shrink-0">
                    {selectedCourse.thumbnail ? (
                      <img src={selectedCourse.thumbnail} alt={selectedCourse.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        📚
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">{selectedCourse.title}</h3>
                    <p className="text-gray-400 mb-3">{selectedCourse.description}</p>
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCourse.status)}`}>
                        {getStatusLabel(selectedCourse.status)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedCourse.category)}`}>
                        {getCategoryLabel(selectedCourse.category)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedCourse.level)}`}>
                        {getLevelLabel(selectedCourse.level)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Cursus Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auteur:</span>
                        <span className="text-white">{selectedCourse.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duur:</span>
                        <span className="text-white">{selectedCourse.duration} uur</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lessen:</span>
                        <span className="text-white">{selectedCourse.totalLessons}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gem. les duur:</span>
                        <span className="text-white">{selectedCourse.avgDuration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Prijs:</span>
                        <span className="text-white">{formatPrice(selectedCourse.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Certificaat:</span>
                        <span className="text-white">{selectedCourse.certificate ? 'Ja' : 'Nee'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Statistieken</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deelnemers:</span>
                        <span className="text-white">{formatNumber(selectedCourse.participants)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-white">⭐ {selectedCourse.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Voltooiing:</span>
                        <span className="text-white">{selectedCourse.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Leerdoelen</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.learningObjectives.map((objective, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#E33412]/10 text-[#E33412] text-xs rounded">
                        {objective}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Doelgroep</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.targetAudience.map((audience, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#2A2D3A] text-gray-300 text-xs rounded">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#2A2D3A]">
                  <button
                    onClick={() => {
                      setModalMode('edit');
                    }}
                    className="bg-[#E33412] text-white px-4 py-2 rounded hover:bg-[#b9260e] transition-colors"
                  >
                    Bewerken
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourse.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Verwijderen
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-[#2A2D3A] text-white px-4 py-2 rounded hover:bg-[#3A3D4A] transition-colors"
                  >
                    Sluiten
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Titel</label>
                    <input
                      type="text"
                      defaultValue={selectedCourse?.title || ''}
                      className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                      placeholder="Cursus titel..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Categorie</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="anatomy">Anatomie</option>
                      <option value="nutrition">Voeding</option>
                      <option value="training">Training</option>
                      <option value="recovery">Herstel</option>
                      <option value="psychology">Psychologie</option>
                      <option value="technology">Technologie</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Beschrijving</label>
                  <textarea
                    defaultValue={selectedCourse?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                    placeholder="Cursus beschrijving..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Niveau</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Gevorderd</option>
                      <option value="advanced">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Duur (uren)</label>
                    <input
                      type="number"
                      defaultValue={selectedCourse?.duration || 4}
                      className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Prijs (€)</label>
                    <input
                      type="number"
                      defaultValue={selectedCourse?.price || 0}
                      className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Status</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="draft">Concept</option>
                      <option value="published">Gepubliceerd</option>
                      <option value="archived">Gearchiveerd</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleSaveCourse({})}
                    className="bg-[#E33412] text-white px-4 py-2 rounded hover:bg-[#b9260e] transition-colors"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-[#2A2D3A] text-white px-4 py-2 rounded hover:bg-[#3A3D4A] transition-colors"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 