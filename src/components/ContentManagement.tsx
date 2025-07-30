import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface Content {
  id: string;
  title: string;
  type: 'article' | 'video' | 'document' | 'image';
  category: 'training' | 'nutrition' | 'recovery' | 'education' | 'motivation';
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  engagement: number;
  tags: string[];
  thumbnail?: string;
  description: string;
  content?: string;
  videoUrl?: string;
  documentUrl?: string;
  imageUrl?: string;
}

interface ContentStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  totalViews: number;
  avgEngagement: number;
  categoryBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

export default function ContentManagement() {
  const [content, setContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPerPage] = useState(8);
  const [contentStats, setContentStats] = useState<ContentStats>({
    total: 0,
    published: 0,
    drafts: 0,
    archived: 0,
    totalViews: 0,
    avgEngagement: 0,
    categoryBreakdown: {},
    typeBreakdown: {}
  });

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockContent: Content[] = [
      {
        id: '1',
        title: 'Basis Krachttraining: Deadlift Techniek',
        type: 'video',
        category: 'training',
        status: 'published',
        author: 'Mark Johnson',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-15',
        publishedAt: '2024-01-15',
        views: 1247,
        engagement: 89,
        tags: ['krachttraining', 'deadlift', 'techniek', 'beginners'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        description: 'Leer de juiste deadlift techniek voor maximale resultaten en veiligheid.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        content: 'In deze video leer je stap voor stap de juiste deadlift techniek. We beginnen met de basis setup en werken toe naar de volledige beweging.'
      },
      {
        id: '2',
        title: 'Voedingsplan voor Spieropbouw',
        type: 'article',
        category: 'nutrition',
        status: 'published',
        author: 'Sarah Wilson',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-12',
        publishedAt: '2024-01-12',
        views: 892,
        engagement: 76,
        tags: ['voeding', 'spieropbouw', 'macro\'s', 'eiwitten'],
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
        description: 'Complete gids voor voeding tijdens spieropbouw training.',
        content: 'Spieropbouw vereist niet alleen de juiste training, maar ook de juiste voeding. In dit artikel bespreken we de belangrijkste voedingsprincipes voor optimale spiergroei.'
      },
      {
        id: '3',
        title: 'Recovery Protocol na Intensieve Training',
        type: 'document',
        category: 'recovery',
        status: 'draft',
        author: 'Lisa de Vries',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-20',
        views: 0,
        engagement: 0,
        tags: ['recovery', 'herstel', 'stretching', 'foam rolling'],
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        description: 'Stap-voor-stap recovery protocol voor optimaal herstel.',
        documentUrl: '/documents/recovery-protocol.pdf',
        content: 'Herstel is net zo belangrijk als training zelf. Dit protocol helpt je om optimaal te herstellen na intensieve trainingen.'
      },
      {
        id: '4',
        title: 'Motivatie: Doelen Stellen en Behouden',
        type: 'article',
        category: 'motivation',
        status: 'published',
        author: 'Tom van der Berg',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-10',
        publishedAt: '2024-01-10',
        views: 1567,
        engagement: 92,
        tags: ['motivatie', 'doelen', 'psychologie', 'succes'],
        thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        description: 'Hoe je realistische doelen stelt en gemotiveerd blijft.',
        content: 'Motivatie is de drijvende kracht achter succes. Leer hoe je effectieve doelen stelt en je motivatie behoudt op de lange termijn.'
      },
      {
        id: '5',
        title: 'HIIT Workout Schema',
        type: 'document',
        category: 'training',
        status: 'published',
        author: 'Emma Jansen',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-16',
        publishedAt: '2024-01-16',
        views: 634,
        engagement: 68,
        tags: ['HIIT', 'cardio', 'workout', 'intensief'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        description: 'Complete HIIT workout schema voor vetverbranding.',
        documentUrl: '/documents/hiit-workout.pdf',
        content: 'HIIT trainingen zijn een van de meest effectieve manieren om vet te verbranden en je conditie te verbeteren.'
      },
      {
        id: '6',
        title: 'Progress Foto Tips',
        type: 'image',
        category: 'education',
        status: 'published',
        author: 'Mark Johnson',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-20',
        publishedAt: '2024-01-20',
        views: 445,
        engagement: 71,
        tags: ['progress', 'foto\'s', 'tracking', 'motivatie'],
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        description: 'Hoe je effectieve progress foto\'s maakt voor tracking.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        content: 'Progress foto\'s zijn een geweldige manier om je vooruitgang te tracken. Leer hoe je consistente en effectieve foto\'s maakt.'
      },
      {
        id: '7',
        title: 'Yoga voor Flexibiliteit',
        type: 'video',
        category: 'recovery',
        status: 'published',
        author: 'Lisa de Vries',
        createdAt: '2024-01-16',
        updatedAt: '2024-01-19',
        publishedAt: '2024-01-19',
        views: 789,
        engagement: 84,
        tags: ['yoga', 'flexibiliteit', 'stretching', 'ontspanning'],
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        description: 'Complete yoga routine voor verbeterde flexibiliteit.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        content: 'Deze yoga routine is perfect voor het verbeteren van je flexibiliteit en het verminderen van spierspanning.'
      },
      {
        id: '8',
        title: 'Voeding voor Endurance Sporters',
        type: 'article',
        category: 'nutrition',
        status: 'draft',
        author: 'Sarah Wilson',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        views: 0,
        engagement: 0,
        tags: ['endurance', 'voeding', 'duursport', 'energie'],
        thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
        description: 'Voedingsstrategieën voor duursporters en marathonlopers.',
        content: 'Endurance sporten vereisen specifieke voedingsstrategieën. Leer hoe je je lichaam optimaal voedt voor lange afstanden.'
      }
    ];

    setContent(mockContent);
    setFilteredContent(mockContent);
    calculateStats(mockContent);
  }, []);

  const calculateStats = (contentList: Content[]) => {
    const stats: ContentStats = {
      total: contentList.length,
      published: contentList.filter(c => c.status === 'published').length,
      drafts: contentList.filter(c => c.status === 'draft').length,
      archived: contentList.filter(c => c.status === 'archived').length,
      totalViews: contentList.reduce((sum, c) => sum + c.views, 0),
      avgEngagement: Math.round(contentList.reduce((sum, c) => sum + c.engagement, 0) / contentList.length),
      categoryBreakdown: {},
      typeBreakdown: {}
    };

    // Calculate breakdowns
    contentList.forEach(c => {
      stats.categoryBreakdown[c.category] = (stats.categoryBreakdown[c.category] || 0) + 1;
      stats.typeBreakdown[c.type] = (stats.typeBreakdown[c.type] || 0) + 1;
    });

    setContentStats(stats);
  };

  const filterContent = () => {
    let filtered = content;

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

    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(c => c.category === filterCategory);
    }

    setFilteredContent(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterContent();
  }, [searchTerm, filterStatus, filterType, filterCategory, content]);

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
      case 'video': return 'text-blue-400 bg-blue-400/10';
      case 'article': return 'text-purple-400 bg-purple-400/10';
      case 'document': return 'text-orange-400 bg-orange-400/10';
      case 'image': return 'text-pink-400 bg-pink-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'training': return 'text-[#E33412] bg-[#E33412]/10';
      case 'nutrition': return 'text-green-400 bg-green-400/10';
      case 'recovery': return 'text-blue-400 bg-blue-400/10';
      case 'education': return 'text-purple-400 bg-purple-400/10';
      case 'motivation': return 'text-yellow-400 bg-yellow-400/10';
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
      case 'video': return 'Video';
      case 'article': return 'Artikel';
      case 'document': return 'Document';
      case 'image': return 'Afbeelding';
      default: return type;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'training': return 'Training';
      case 'nutrition': return 'Voeding';
      case 'recovery': return 'Herstel';
      case 'education': return 'Educatie';
      case 'motivation': return 'Motivatie';
      default: return category;
    }
  };

  const handleContentAction = (action: string, contentId: string) => {
    const contentItem = content.find(c => c.id === contentId);
    if (contentItem) {
      setSelectedContent(contentItem);
      setModalMode(action === 'edit' ? 'edit' : 'view');
      setShowContentModal(true);
    }
  };

  const handleCreateContent = () => {
    setSelectedContent(null);
    setModalMode('create');
    setShowContentModal(true);
  };

  const handleCloseModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
  };

  const handleSaveContent = (contentData: Partial<Content>) => {
    if (modalMode === 'create') {
      const newContent: Content = {
        id: Date.now().toString(),
        title: contentData.title || 'Nieuw Content',
        type: contentData.type || 'article',
        category: contentData.category || 'training',
        status: 'draft',
        author: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        engagement: 0,
        tags: contentData.tags || [],
        description: contentData.description || '',
        content: contentData.content || '',
        ...contentData
      };
      setContent(prev => [newContent, ...prev]);
    } else if (selectedContent) {
      setContent(prev => prev.map(c => 
        c.id === selectedContent.id 
          ? { ...c, ...contentData, updatedAt: new Date().toISOString() }
          : c
      ));
    }
    handleCloseModal();
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm('Weet je zeker dat je dit content wilt verwijderen?')) {
      setContent(prev => prev.filter(c => c.id !== contentId));
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

  // Pagination
  const indexOfLastContent = currentPage * contentPerPage;
  const indexOfFirstContent = indexOfLastContent - contentPerPage;
  const currentContent = filteredContent.slice(indexOfFirstContent, indexOfLastContent);
  const totalPages = Math.ceil(filteredContent.length / contentPerPage);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Content"
          value={contentStats.total}
          icon="📄"
          subtitle="items"
          className="animate-fade-in"
        />
        <DataCard
          title="Gepubliceerd"
          value={contentStats.published}
          change={`${Math.round((contentStats.published / contentStats.total) * 100)}%`}
          changeType="positive"
          icon="✅"
          subtitle="van totaal"
          className="animate-fade-in"
        />
        <DataCard
          title="Totaal Views"
          value={formatNumber(contentStats.totalViews)}
          icon="👁️"
          subtitle="alle content"
          className="animate-fade-in"
        />
        <DataCard
          title="Gem. Engagement"
          value={`${contentStats.avgEngagement}%`}
          icon="📈"
          subtitle="interactie rate"
          className="animate-fade-in"
        />
      </div>

      {/* Filters and Search */}
      <DataCard title="Content Beheer" value="" icon="🎛️">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Zoek in content..."
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
              <option value="article">Artikel</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="image">Afbeelding</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent transition-all duration-200"
            >
              <option value="all">Alle Categorieën</option>
              <option value="training">Training</option>
              <option value="nutrition">Voeding</option>
              <option value="recovery">Herstel</option>
              <option value="education">Educatie</option>
              <option value="motivation">Motivatie</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              {filteredContent.length} van {content.length} content items
            </div>
            <button 
              onClick={handleCreateContent}
              className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2"
            >
              <span>➕</span>
              Nieuwe Content
            </button>
          </div>
        </div>
      </DataCard>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentContent.map((item, index) => (
          <div
            key={item.id}
            className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-4 hover:border-[#E33412]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E33412]/10 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative mb-4">
              <div className="aspect-video bg-[#2A2D3A] rounded-lg flex items-center justify-center overflow-hidden">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-4xl">
                    {item.type === 'video' && '🎥'}
                    {item.type === 'article' && '📄'}
                    {item.type === 'document' && '📋'}
                    {item.type === 'image' && '🖼️'}
                  </div>
                )}
              </div>
              
              {/* Status Badge */}
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {getStatusLabel(item.status)}
              </div>
              
              {/* Type Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                {getTypeLabel(item.type)}
              </div>
            </div>

            {/* Content Info */}
            <div className="space-y-3">
              <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-[#E33412] transition-colors duration-300">
                {item.title}
              </h3>
              
              <p className="text-gray-400 text-xs line-clamp-2">
                {item.description}
              </p>

              {/* Category */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                {getCategoryLabel(item.category)}
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>👁️ {formatNumber(item.views)}</span>
                <span>📈 {item.engagement}%</span>
                <span>📅 {formatDate(item.updatedAt)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#2A2D3A]">
                <button
                  onClick={() => handleContentAction('edit', item.id)}
                  className="flex-1 bg-[#2A2D3A] text-white px-2 py-1 rounded text-xs hover:bg-[#3A3D4A] transition-colors"
                >
                  Bewerken
                </button>
                <button
                  onClick={() => handleContentAction('view', item.id)}
                  className="flex-1 bg-[#E33412] text-white px-2 py-1 rounded text-xs hover:bg-[#b9260e] transition-colors"
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

      {/* Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1D29] border border-[#2A2D3A] rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">
                {modalMode === 'create' ? 'Nieuwe Content' : 
                 modalMode === 'edit' ? 'Content Bewerken' : 'Content Bekijken'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {modalMode === 'view' && selectedContent ? (
              <div className="space-y-6">
                {/* Content Header */}
                <div className="flex items-start gap-4">
                  <div className="w-32 h-24 bg-[#2A2D3A] rounded-lg overflow-hidden flex-shrink-0">
                    {selectedContent.thumbnail ? (
                      <img src={selectedContent.thumbnail} alt={selectedContent.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        {selectedContent.type === 'video' && '🎥'}
                        {selectedContent.type === 'article' && '📄'}
                        {selectedContent.type === 'document' && '📋'}
                        {selectedContent.type === 'image' && '🖼️'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-2">{selectedContent.title}</h3>
                    <p className="text-gray-400 mb-3">{selectedContent.description}</p>
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContent.status)}`}>
                        {getStatusLabel(selectedContent.status)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedContent.type)}`}>
                        {getTypeLabel(selectedContent.type)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedContent.category)}`}>
                        {getCategoryLabel(selectedContent.category)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Content Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auteur:</span>
                        <span className="text-white">{selectedContent.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gemaakt:</span>
                        <span className="text-white">{formatDate(selectedContent.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bijgewerkt:</span>
                        <span className="text-white">{formatDate(selectedContent.updatedAt)}</span>
                      </div>
                      {selectedContent.publishedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Gepubliceerd:</span>
                          <span className="text-white">{formatDate(selectedContent.publishedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-3">Statistieken</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Views:</span>
                        <span className="text-white">{formatNumber(selectedContent.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Engagement:</span>
                        <span className="text-white">{selectedContent.engagement}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContent.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#2A2D3A] text-gray-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Preview */}
                {selectedContent.content && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Content Preview</h4>
                    <div className="bg-[#2A2D3A] p-4 rounded-lg">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedContent.content}
                      </p>
                    </div>
                  </div>
                )}

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
                    onClick={() => handleDeleteContent(selectedContent.id)}
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
                      defaultValue={selectedContent?.title || ''}
                      className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                      placeholder="Content titel..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Type</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="article">Artikel</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="image">Afbeelding</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Beschrijving</label>
                  <textarea
                    defaultValue={selectedContent?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]"
                    placeholder="Content beschrijving..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Categorie</label>
                    <select className="w-full px-3 py-2 bg-[#2A2D3A] border border-[#3A3D4A] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#E33412]">
                      <option value="training">Training</option>
                      <option value="nutrition">Voeding</option>
                      <option value="recovery">Herstel</option>
                      <option value="education">Educatie</option>
                      <option value="motivation">Motivatie</option>
                    </select>
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
                    onClick={() => handleSaveContent({})}
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