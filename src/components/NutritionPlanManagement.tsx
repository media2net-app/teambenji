import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  fiber: number; // grams
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macros: MacroNutrients;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    calories: number;
  }[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  imageUrl?: string;
  tags: string[];
}

interface NutritionPlan {
  id: string;
  name: string;
  description: string;
  type: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'performance' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // weeks
  targetCalories: number;
  targetMacros: MacroNutrients;
  meals: Meal[];
  author: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  thumbnail?: string;
  targetAudience: string[];
  prerequisites: string[];
  goals: string[];
  restrictions: string[];
  totalMeals: number;
  avgPrepTime: number; // minutes
  avgCalories: number;
  rating: number;
  participants: number;
  completionRate: number;
  costLevel: 'budget' | 'moderate' | 'premium';
}

interface NutritionStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  totalParticipants: number;
  avgRating: number;
  avgCompletionRate: number;
  typeBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  avgCalories: number;
}

export default function NutritionPlanManagement() {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<NutritionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(6);
  const [nutritionStats, setNutritionStats] = useState<NutritionStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    totalParticipants: 0,
    avgRating: 0,
    avgCompletionRate: 0,
    typeBreakdown: {},
    difficultyBreakdown: {},
    avgCalories: 0
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockNutritionPlans: NutritionPlan[] = [
      {
        id: '1',
        name: 'Spieropbouw Voedingsplan',
        description: 'Hoog eiwit voedingsplan voor optimale spiergroei en herstel. Perfect voor krachtsporters.',
        type: 'muscle-gain',
        difficulty: 'intermediate',
        duration: 12,
        targetCalories: 2800,
        targetMacros: {
          protein: 180,
          carbs: 300,
          fats: 80,
          fiber: 35
        },
        meals: [],
        author: 'Sarah Wilson',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['spieropbouw', 'hoog eiwit', 'krachtsport', 'bulking'],
        thumbnail: '/thumbnails/muscle-gain-nutrition.jpg',
        targetAudience: ['Krachtsporters', 'Intermediate', 'Advanced'],
        prerequisites: ['Basis kennis voeding', 'Toegang tot kwaliteitsvoeding'],
        goals: ['Spieropbouw', 'Kracht toename', 'Optimaal herstel'],
        restrictions: ['Geen'],
        totalMeals: 84,
        avgPrepTime: 25,
        avgCalories: 2800,
        rating: 4.7,
        participants: 189,
        completionRate: 72,
        costLevel: 'moderate'
      },
      {
        id: '2',
        name: 'Vetverbranding Plan',
        description: 'Calorie deficit plan voor effectief gewichtsverlies met behoud van spiermassa.',
        type: 'weight-loss',
        difficulty: 'beginner',
        duration: 8,
        targetCalories: 1800,
        targetMacros: {
          protein: 150,
          carbs: 150,
          fats: 60,
          fiber: 30
        },
        meals: [],
        author: 'Lisa de Vries',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-18',
        status: 'published',
        tags: ['vetverbranding', 'calorie deficit', 'gewichtsverlies', 'cutting'],
        thumbnail: '/thumbnails/weight-loss-nutrition.jpg',
        targetAudience: ['Beginners', 'Intermediate'],
        prerequisites: ['Geen'],
        goals: ['Gewichtsverlies', 'Vetverbranding', 'Spiermassa behoud'],
        restrictions: ['Geen'],
        totalMeals: 56,
        avgPrepTime: 20,
        avgCalories: 1800,
        rating: 4.5,
        participants: 234,
        completionRate: 68,
        costLevel: 'budget'
      },
      {
        id: '3',
        name: 'Vegetarisch Performance Plan',
        description: 'Complete vegetarische voeding voor atleten en actieve sporters.',
        type: 'vegetarian',
        difficulty: 'intermediate',
        duration: 10,
        targetCalories: 2200,
        targetMacros: {
          protein: 120,
          carbs: 250,
          fats: 70,
          fiber: 40
        },
        meals: [],
        author: 'Tom van der Berg',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-19',
        status: 'published',
        tags: ['vegetarisch', 'performance', 'atleten', 'plant-based'],
        thumbnail: '/thumbnails/vegetarian-nutrition.jpg',
        targetAudience: ['Vegetariërs', 'Atleten', 'Intermediate'],
        prerequisites: ['Vegetarische levensstijl', 'Basis kookvaardigheden'],
        goals: ['Performance optimalisatie', 'Duurzame voeding', 'Balans'],
        restrictions: ['Geen vlees', 'Geen vis'],
        totalMeals: 70,
        avgPrepTime: 30,
        avgCalories: 2200,
        rating: 4.8,
        participants: 156,
        completionRate: 85,
        costLevel: 'moderate'
      },
      {
        id: '4',
        name: 'Keto Fat Burner',
        description: 'Ketogeen dieet voor snelle vetverbranding en mentale helderheid.',
        type: 'keto',
        difficulty: 'advanced',
        duration: 6,
        targetCalories: 2000,
        targetMacros: {
          protein: 120,
          carbs: 25,
          fats: 160,
          fiber: 20
        },
        meals: [],
        author: 'Emma Jansen',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-15',
        status: 'draft',
        tags: ['keto', 'vetverbranding', 'low-carb', 'ketose'],
        thumbnail: '/thumbnails/keto-nutrition.jpg',
        targetAudience: ['Advanced', 'Keto ervaring'],
        prerequisites: ['Keto kennis', 'Dokter consultatie'],
        goals: ['Snelle vetverbranding', 'Ketose', 'Mentale helderheid'],
        restrictions: ['Zeer low-carb', 'Geen suikers'],
        totalMeals: 42,
        avgPrepTime: 35,
        avgCalories: 2000,
        rating: 0,
        participants: 0,
        completionRate: 0,
        costLevel: 'premium'
      },
      {
        id: '5',
        name: 'Mediterraans Gezondheidsplan',
        description: 'Gebaseerd op traditionele mediterrane voeding voor langdurige gezondheid.',
        type: 'mediterranean',
        difficulty: 'beginner',
        duration: 16,
        targetCalories: 2100,
        targetMacros: {
          protein: 100,
          carbs: 200,
          fats: 90,
          fiber: 35
        },
        meals: [],
        author: 'Mark Johnson',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        status: 'published',
        tags: ['mediterraans', 'gezondheid', 'duurzaam', 'hart-gezond'],
        thumbnail: '/thumbnails/mediterranean-nutrition.jpg',
        targetAudience: ['Beginners', 'Gezondheidsbewust', 'Alle leeftijden'],
        prerequisites: ['Geen'],
        goals: ['Langdurige gezondheid', 'Hart gezondheid', 'Balans'],
        restrictions: ['Geen'],
        totalMeals: 112,
        avgPrepTime: 25,
        avgCalories: 2100,
        rating: 4.9,
        participants: 298,
        completionRate: 91,
        costLevel: 'moderate'
      },
      {
        id: '6',
        name: 'Vegan Power Plan',
        description: '100% plantaardig voedingsplan voor kracht en uithoudingsvermogen.',
        type: 'vegan',
        difficulty: 'advanced',
        duration: 14,
        targetCalories: 2400,
        targetMacros: {
          protein: 140,
          carbs: 280,
          fats: 75,
          fiber: 45
        },
        meals: [],
        author: 'Lisa de Vries',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        status: 'archived',
        tags: ['vegan', 'plantaardig', 'kracht', 'duurzaam'],
        thumbnail: '/thumbnails/vegan-nutrition.jpg',
        targetAudience: ['Vegans', 'Advanced', 'Milieubewust'],
        prerequisites: ['Vegan levensstijl', 'Geavanceerde kookvaardigheden'],
        goals: ['Plantaardige kracht', 'Duurzaamheid', 'Performance'],
        restrictions: ['Geen dierlijke producten'],
        totalMeals: 98,
        avgPrepTime: 40,
        avgCalories: 2400,
        rating: 4.3,
        participants: 87,
        completionRate: 62,
        costLevel: 'premium'
      }
    ];

    setNutritionPlans(mockNutritionPlans);
    setFilteredPlans(mockNutritionPlans);
    calculateStats(mockNutritionPlans);
  }, []);

  const calculateStats = (planList: NutritionPlan[]) => {
    const stats: NutritionStats = {
      total: planList.length,
      published: planList.filter(p => p.status === 'published').length,
      drafts: planList.filter(p => p.status === 'draft').length,
      archived: planList.filter(p => p.status === 'archived').length,
      totalParticipants: planList.reduce((sum, p) => sum + p.participants, 0),
      avgRating: Math.round((planList.reduce((sum, p) => sum + p.rating, 0) / planList.length) * 10) / 10,
      avgCompletionRate: Math.round(planList.reduce((sum, p) => sum + p.completionRate, 0) / planList.length),
      typeBreakdown: {},
      difficultyBreakdown: {},
      avgCalories: Math.round(planList.reduce((sum, p) => sum + p.avgCalories, 0) / planList.length)
    };

    // Calculate breakdowns
    planList.forEach(p => {
      stats.typeBreakdown[p.type] = (stats.typeBreakdown[p.type] || 0) + 1;
      stats.difficultyBreakdown[p.difficulty] = (stats.difficultyBreakdown[p.difficulty] || 0) + 1;
    });

    setNutritionStats(stats);
  };

  const filterPlans = () => {
    let filtered = nutritionPlans;

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

    setFilteredPlans(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterPlans();
  }, [searchTerm, filterStatus, filterType, filterDifficulty, nutritionPlans]);

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
      case 'weight-loss': return 'text-green-400 bg-green-400/10';
      case 'muscle-gain': return 'text-[#E33412] bg-[#E33412]/10';
      case 'maintenance': return 'text-blue-400 bg-blue-400/10';
      case 'performance': return 'text-purple-400 bg-purple-400/10';
      case 'vegetarian': return 'text-orange-400 bg-orange-400/10';
      case 'vegan': return 'text-pink-400 bg-pink-400/10';
      case 'keto': return 'text-cyan-400 bg-cyan-400/10';
      case 'mediterranean': return 'text-yellow-400 bg-yellow-400/10';
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

  const getCostColor = (costLevel: string) => {
    switch (costLevel) {
      case 'budget': return 'text-green-400 bg-green-400/10';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10';
      case 'premium': return 'text-purple-400 bg-purple-400/10';
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
      case 'weight-loss': return 'Gewichtsverlies';
      case 'muscle-gain': return 'Spieropbouw';
      case 'maintenance': return 'Onderhoud';
      case 'performance': return 'Performance';
      case 'vegetarian': return 'Vegetarisch';
      case 'vegan': return 'Vegan';
      case 'keto': return 'Keto';
      case 'mediterranean': return 'Mediterraans';
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

  const getCostLabel = (costLevel: string) => {
    switch (costLevel) {
      case 'budget': return 'Budget';
      case 'moderate': return 'Gemiddeld';
      case 'premium': return 'Premium';
      default: return costLevel;
    }
  };

  const handlePlanAction = (action: string, planId: string) => {
    const planItem = nutritionPlans.find(p => p.id === planId);
    if (planItem) {
      setSelectedPlan(planItem);
      setModalMode(action === 'edit' ? 'edit' : 'view');
      setShowPlanModal(true);
    }
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setModalMode('create');
    setShowPlanModal(true);
  };

  const handleCloseModal = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleSavePlan = (planData: Partial<NutritionPlan>) => {
    if (modalMode === 'create') {
      const newPlan: NutritionPlan = {
        id: Date.now().toString(),
        name: planData.name || 'Nieuw Voedingsplan',
        description: planData.description || '',
        type: planData.type || 'weight-loss',
        difficulty: planData.difficulty || 'beginner',
        duration: planData.duration || 4,
        targetCalories: planData.targetCalories || 2000,
        targetMacros: planData.targetMacros || {
          protein: 150,
          carbs: 200,
          fats: 70,
          fiber: 30
        },
        meals: [],
        author: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft',
        tags: planData.tags || [],
        targetAudience: planData.targetAudience || [],
        prerequisites: planData.prerequisites || [],
        goals: planData.goals || [],
        restrictions: planData.restrictions || [],
        totalMeals: 0,
        avgPrepTime: 0,
        avgCalories: 0,
        rating: 0,
        participants: 0,
        completionRate: 0,
        costLevel: 'moderate',
        ...planData
      };
      setNutritionPlans(prev => [newPlan, ...prev]);
    } else if (selectedPlan) {
      setNutritionPlans(prev => prev.map(p => 
        p.id === selectedPlan.id 
          ? { ...p, ...planData, updatedAt: new Date().toISOString() }
          : p
      ));
    }
    handleCloseModal();
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm('Weet je zeker dat je dit voedingsplan wilt verwijderen?')) {
      setNutritionPlans(prev => prev.filter(p => p.id !== planId));
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

  const formatCalories = (calories: number) => {
    return calories.toLocaleString('nl-NL');
  };

  // Pagination
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Voedingsplannen"
          value={nutritionStats.total}
          icon="🥗"
          subtitle="plannen"
          className="animate-fade-in"
        />
        <DataCard
          title="Gepubliceerd"
          value={nutritionStats.published}
          change={`${Math.round((nutritionStats.published / nutritionStats.total) * 100)}%`}
          changeType="positive"
          icon="✅"
          subtitle="van totaal"
          className="animate-fade-in"
        />
        <DataCard
          title="Gem. Calorieën"
          value={formatCalories(nutritionStats.avgCalories)}
          icon="🔥"
          subtitle="per dag"
          className="animate-fade-in"
        />
        <DataCard
          title="Gem. Voltooiing"
          value={`${nutritionStats.avgCompletionRate}%`}
          icon="📈"
          subtitle="success rate"
          className="animate-fade-in"
        />
      </div>

      {/* Filters and Search */}
      <DataCard title="Voedingsplan Beheer" value="" icon="🎛️">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Zoek in voedingsplannen..."
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
              <option value="weight-loss">Gewichtsverlies</option>
              <option value="muscle-gain">Spieropbouw</option>
              <option value="maintenance">Onderhoud</option>
              <option value="performance">Performance</option>
              <option value="vegetarian">Vegetarisch</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="mediterranean">Mediterraans</option>
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
              {filteredPlans.length} van {nutritionPlans.length} voedingsplannen
            </div>
            <button 
              onClick={handleCreatePlan}
              className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Nieuw Voedingsplan
            </button>
          </div>
        </div>
      </DataCard>

      {/* Nutrition Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentPlans.map((plan, index) => (
          <div
            key={plan.id}
            className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 hover:border-[#E33412]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E33412]/10 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg group-hover:text-[#E33412] transition-colors duration-300 line-clamp-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {plan.description}
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="relative mb-4">
              <div className="aspect-video bg-[#2A2D3A] rounded-lg flex items-center justify-center overflow-hidden">
                {plan.thumbnail ? (
                  <img src={plan.thumbnail} alt={plan.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-6xl">
                    {plan.type === 'weight-loss' && '🔥'}
                    {plan.type === 'muscle-gain' && '💪'}
                    {plan.type === 'maintenance' && '⚖️'}
                    {plan.type === 'performance' && '🏃'}
                    {plan.type === 'vegetarian' && '🥬'}
                    {plan.type === 'vegan' && '🌱'}
                    {plan.type === 'keto' && '🥑'}
                    {plan.type === 'mediterranean' && '🍷'}
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                {getStatusLabel(plan.status)}
              </div>
              
              {/* Type Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(plan.type)}`}>
                {getTypeLabel(plan.type)}
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-3">
              {/* Difficulty and Cost */}
              <div className="flex gap-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plan.difficulty)}`}>
                  {getDifficultyLabel(plan.difficulty)}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(plan.costLevel)}`}>
                  {getCostLabel(plan.costLevel)}
                </div>
              </div>

              {/* Macro Overview */}
              <div className="bg-[#2A2D3A] p-3 rounded-lg">
                <div className="text-gray-400 text-xs mb-2">Macro's per dag:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-red-400">Eiwit:</span>
                    <span className="text-white">{plan.targetMacros.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-400">Koolhydraten:</span>
                    <span className="text-white">{plan.targetMacros.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">Vetten:</span>
                    <span className="text-white">{plan.targetMacros.fats}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-400">Vezels:</span>
                    <span className="text-white">{plan.targetMacros.fiber}g</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Calorieën</div>
                  <div className="text-white font-medium">{formatCalories(plan.targetCalories)}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Maaltijden</div>
                  <div className="text-white font-medium">{plan.totalMeals}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Deelnemers</div>
                  <div className="text-white font-medium">{formatNumber(plan.participants)}</div>
                </div>
                <div className="bg-[#2A2D3A] p-2 rounded">
                  <div className="text-gray-400">Rating</div>
                  <div className="text-white font-medium">⭐ {plan.rating}</div>
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Doelen:</div>
                <div className="flex flex-wrap gap-1">
                  {plan.goals.slice(0, 2).map((goal, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[#E33412]/10 text-[#E33412] text-xs rounded">
                      {goal}
                    </span>
                  ))}
                  {plan.goals.length > 2 && (
                    <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                      +{plan.goals.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Author and Date */}
              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-[#2A2D3A]">
                <span>👤 {plan.author}</span>
                <span>📅 {formatDate(plan.updatedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => handlePlanAction('edit', plan.id)}
                  className="flex-1 bg-[#2A2D3A] text-white px-3 py-2 rounded text-sm hover:bg-[#3A3D4A] transition-colors"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handlePlanAction('view', plan.id)}
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

      {/* Nutrition Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                {modalMode === 'create' ? 'Nieuw Voedingsplan' : 
                 modalMode === 'edit' ? 'Voedingsplan Bewerken' : 'Voedingsplan Bekijken'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {modalMode === 'view' && selectedPlan ? (
              <div className="space-y-6">
                {/* Plan Header */}
                <div className="flex items-start gap-4">
                  <div className="w-32 h-24 bg-[#2A2D3A] rounded-lg overflow-hidden flex-shrink-0">
                    {selectedPlan.thumbnail ? (
                      <img src={selectedPlan.thumbnail} alt={selectedPlan.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        🥗
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">{selectedPlan.name}</h3>
                    <p className="text-gray-400 mb-3">{selectedPlan.description}</p>
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPlan.status)}`}>
                        {getStatusLabel(selectedPlan.status)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedPlan.type)}`}>
                        {getTypeLabel(selectedPlan.type)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedPlan.difficulty)}`}>
                        {getDifficultyLabel(selectedPlan.difficulty)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Plan Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auteur:</span>
                        <span className="text-white">{selectedPlan.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duur:</span>
                        <span className="text-white">{selectedPlan.duration} weken</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Maaltijden:</span>
                        <span className="text-white">{selectedPlan.totalMeals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gem. prep tijd:</span>
                        <span className="text-white">{selectedPlan.avgPrepTime} min</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Statistieken</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deelnemers:</span>
                        <span className="text-white">{formatNumber(selectedPlan.participants)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-white">⭐ {selectedPlan.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Voltooiing:</span>
                        <span className="text-white">{selectedPlan.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro Breakdown */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Macro Breakdown</h4>
                  <div className="bg-[#2A2D3A] p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-red-400 font-medium">{selectedPlan.targetMacros.protein}g</div>
                        <div className="text-gray-400">Eiwit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-medium">{selectedPlan.targetMacros.carbs}g</div>
                        <div className="text-gray-400">Koolhydraten</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-medium">{selectedPlan.targetMacros.fats}g</div>
                        <div className="text-gray-400">Vetten</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-medium">{selectedPlan.targetMacros.fiber}g</div>
                        <div className="text-gray-400">Vezels</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Doelen</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.goals.map((goal, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#E33412]/10 text-[#E33412] text-xs rounded">
                        {goal}
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
                    onClick={() => handleDeletePlan(selectedPlan.id)}
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
                    <label className="block text-gray-400 text-sm mb-2">Naam</label>
                    <input
                      type="text"
                      defaultValue={selectedPlan?.name || ''}
                      className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                      placeholder="Voedingsplan naam..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="weight-loss">Gewichtsverlies</option>
                      <option value="muscle-gain">Spieropbouw</option>
                      <option value="maintenance">Onderhoud</option>
                      <option value="performance">Performance</option>
                      <option value="vegetarian">Vegetarisch</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="mediterranean">Mediterraans</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Beschrijving</label>
                  <textarea
                    defaultValue={selectedPlan?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                    placeholder="Voedingsplan beschrijving..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Niveau</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Gevorderd</option>
                      <option value="advanced">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Duur (weken)</label>
                    <input
                      type="number"
                      defaultValue={selectedPlan?.duration || 4}
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
                    onClick={() => handleSavePlan({})}
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