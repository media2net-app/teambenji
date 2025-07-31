import { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import { educationService, type LearningModule, type LearningPath, type LearningProgress, type Certificate } from '../services/educationService';

export default function LeermodulePage() {
  const [activeTab, setActiveTab] = useState('modules');
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [showModuleDetail, setShowModuleDetail] = useState(false);

  useEffect(() => {
    loadEducationData();
  }, []);

  const loadEducationData = () => {
    setModules(educationService.getAllModules());
    setLearningPaths(educationService.getLearningPaths());
    setProgress(educationService.getProgress());
    setCertificates(educationService.getCertificates());
  };

  const handleEnrollModule = (moduleId: string) => {
    const success = educationService.enrollInModule(moduleId);
    if (success) {
      loadEducationData();
      alert('Je bent succesvol ingeschreven voor deze module!');
    }
  };

  const handleEnrollPath = (pathId: string) => {
    const success = educationService.enrollInLearningPath(pathId);
    if (success) {
      loadEducationData();
      alert('Je bent succesvol ingeschreven voor dit leerpad!');
    }
  };

  const handleViewModule = (module: LearningModule) => {
    setSelectedModule(module);
    setShowModuleDetail(true);
  };

  const handleMarkVideoWatched = (moduleId: string, videoId: string) => {
    educationService.markVideoWatched(moduleId, videoId);
    loadEducationData();
  };

  const handleMarkArticleRead = (moduleId: string, articleId: string) => {
    educationService.markArticleRead(moduleId, articleId);
    loadEducationData();
  };

  const handleDownloadFile = (moduleId: string, downloadId: string) => {
    educationService.markDownloadCompleted(moduleId, downloadId);
    loadEducationData();
    alert('Download gestart!');
  };

  // Filter modules based on search, category, and level
  const filteredModules = modules.filter(module => {
    const matchesSearch = searchQuery === '' || 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || module.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getModuleProgress = (moduleId: string) => {
    return progress.find(p => p.moduleId === moduleId);
  };

  const renderModules = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Zoek modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2A2D3A] text-white px-4 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
        >
          <option value="all">Alle categorieën</option>
          <option value="training">Training</option>
          <option value="nutrition">Voeding</option>
          <option value="recovery">Herstel</option>
          <option value="mindset">Mindset</option>
          <option value="general">Algemeen</option>
        </select>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-[#2A2D3A] text-white px-4 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
        >
          <option value="all">Alle niveaus</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const moduleProgress = getModuleProgress(module.id);
          const isEnrolled = !!moduleProgress;
          
          return (
            <DataCard key={module.id} title={module.title} value="" icon="📚">
              <div className="space-y-4">
                <div className="aspect-video bg-[#3A3D4A] rounded-lg flex items-center justify-center">
                  <span className="text-4xl">{module.category === 'training' ? '🏋️' : module.category === 'nutrition' ? '🥗' : module.category === 'recovery' ? '😴' : '🧠'}</span>
                </div>
                
                <div>
                  <p className="text-gray-300 text-sm mb-2">{module.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      module.level === 'beginner' ? 'bg-green-600 text-white' :
                      module.level === 'intermediate' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {module.level === 'beginner' ? 'Beginner' :
                       module.level === 'intermediate' ? 'Intermediate' : 'Advanced'}
                    </span>
                    <span className="text-gray-400 text-xs">⏱️ {module.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white text-sm">{module.rating}</span>
                    <span className="text-gray-400 text-sm">({module.reviewCount} reviews)</span>
                  </div>
                </div>

                {isEnrolled && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Voortgang</span>
                      <span className="text-white text-sm">{moduleProgress.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                      <div 
                        className="bg-[#E33412] h-2 rounded-full transition-all"
                        style={{ width: `${moduleProgress.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewModule(module)}
                    className="flex-1 bg-[#3A3D4A] text-white px-3 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm"
                  >
                    Bekijken
                  </button>
                  {!isEnrolled && (
                    <button
                      onClick={() => handleEnrollModule(module.id)}
                      className="flex-1 bg-[#E33412] text-white px-3 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
                    >
                      Inschrijven
                    </button>
                  )}
                </div>
              </div>
            </DataCard>
          );
        })}
      </div>
    </div>
  );

  const renderPaths = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Leerpaden</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPaths.map((path) => (
          <DataCard key={path.id} title={path.title} value="" icon="🛤️">
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">{path.description}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">⏱️ {path.estimatedDuration}u</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    path.difficulty === 'beginner' ? 'bg-green-600 text-white' :
                    path.difficulty === 'intermediate' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {path.difficulty === 'beginner' ? 'Beginner' :
                     path.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Modules ({path.modules.length})</h4>
                <div className="space-y-1">
                  {path.modules.map((moduleId, index) => {
                    const module = modules.find(m => m.id === moduleId);
                    return (
                      <div key={moduleId} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">{index + 1}.</span>
                        <span className="text-white">{module?.title || 'Module niet gevonden'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {path.isEnrolled && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-sm">Voortgang</span>
                    <span className="text-white text-sm">{path.progress}%</span>
                  </div>
                  <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                    <div 
                      className="bg-[#E33412] h-2 rounded-full transition-all"
                      style={{ width: `${path.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!path.isEnrolled && (
                  <button
                    onClick={() => handleEnrollPath(path.id)}
                    className="flex-1 bg-[#E33412] text-white px-3 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
                  >
                    Inschrijven
                  </button>
                )}
                {path.isEnrolled && (
                  <button
                    className="flex-1 bg-[#3A3D4A] text-white px-3 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm"
                  >
                    Doorgaan
                  </button>
                )}
              </div>
            </div>
          </DataCard>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Mijn Voortgang</h3>
      
      {progress.length === 0 ? (
        <DataCard title="Geen voortgang" value="" icon="📊">
          <p className="text-gray-300 text-center py-8">
            Je hebt je nog niet ingeschreven voor modules. Ga naar de Modules tab om te beginnen!
          </p>
        </DataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progress.map((prog) => {
            const module = modules.find(m => m.id === prog.moduleId);
            if (!module) return null;
            
            return (
              <DataCard key={prog.moduleId} title={module.title} value="" icon="📈">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      prog.status === 'completed' ? 'bg-green-600 text-white' :
                      prog.status === 'in_progress' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {prog.status === 'completed' ? 'Voltooid' :
                       prog.status === 'in_progress' ? 'Bezig' : 'Niet gestart'}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Voortgang</span>
                      <span className="text-white text-sm">{prog.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                      <div 
                        className="bg-[#E33412] h-2 rounded-full transition-all"
                        style={{ width: `${prog.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Video's</span>
                      <div className="text-white">
                        {prog.completedItems.videos.length} / {module.content.videos.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Artikelen</span>
                      <div className="text-white">
                        {prog.completedItems.articles.length} / {module.content.articles.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Quizzen</span>
                      <div className="text-white">
                        {prog.completedItems.quizzes.length} / {module.content.quizzes.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Downloads</span>
                      <div className="text-white">
                        {prog.completedItems.downloads.length} / {module.content.downloads.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Tijd besteed</span>
                    <span className="text-white">{prog.timeSpent} min</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Laatst bekeken</span>
                    <span className="text-white">
                      {new Date(prog.lastAccessed).toLocaleDateString('nl-NL')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewModule(module)}
                    className="w-full bg-[#E33412] text-white px-3 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
                  >
                    Doorgaan
                  </button>
                </div>
              </DataCard>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Mijn Certificaten</h3>
      
      {certificates.length === 0 ? (
        <DataCard title="Geen certificaten" value="" icon="🏆">
          <p className="text-gray-300 text-center py-8">
            Je hebt nog geen certificaten behaald. Voltooi modules om certificaten te verdienen!
          </p>
        </DataCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <DataCard key={cert.id} title={cert.moduleName} value="" icon="🏆">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <h4 className="text-white font-medium">{cert.moduleName}</h4>
                  <p className="text-gray-400 text-sm">Certificaat behaald</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uitgegeven</span>
                    <span className="text-white">
                      {new Date(cert.issuedAt).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Credential ID</span>
                    <span className="text-white text-xs">{cert.credentialId}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(cert.certificateUrl, '_blank')}
                    className="flex-1 bg-[#E33412] text-white px-3 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(cert.credentialId)}
                    className="flex-1 bg-[#3A3D4A] text-white px-3 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm"
                  >
                    Deel
                  </button>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );

  const renderModuleDetail = () => {
    if (!selectedModule) return null;
    
    const moduleProgress = getModuleProgress(selectedModule.id);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowModuleDetail(false)}
            className="bg-[#3A3D4A] text-white px-3 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors"
          >
            ← Terug
          </button>
          <div>
            <h2 className="text-white text-2xl font-bold">{selectedModule.title}</h2>
            <p className="text-gray-400">{selectedModule.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Videos */}
            <DataCard title="Video's" value="" icon="🎥">
              <div className="space-y-3">
                {selectedModule.content.videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-3 p-3 bg-[#2A2D3A] rounded-lg">
                    <div className="w-16 h-12 bg-[#3A3D4A] rounded flex items-center justify-center">
                      <span className="text-2xl">🎥</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-gray-400 text-sm">{Math.floor(video.duration / 60)} min</p>
                    </div>
                    <button
                      onClick={() => handleMarkVideoWatched(selectedModule.id, video.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        video.isWatched ? 'bg-green-600 text-white' : 'bg-[#E33412] text-white hover:bg-[#b9260e]'
                      }`}
                    >
                      {video.isWatched ? 'Bekeken' : 'Bekijk'}
                    </button>
                  </div>
                ))}
              </div>
            </DataCard>

            {/* Articles */}
            <DataCard title="Artikelen" value="" icon="📖">
              <div className="space-y-3">
                {selectedModule.content.articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 p-3 bg-[#2A2D3A] rounded-lg">
                    <div className="w-16 h-12 bg-[#3A3D4A] rounded flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{article.title}</h4>
                      <p className="text-gray-400 text-sm">{article.readingTime} min lezen</p>
                    </div>
                    <button
                      onClick={() => handleMarkArticleRead(selectedModule.id, article.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        article.isRead ? 'bg-green-600 text-white' : 'bg-[#E33412] text-white hover:bg-[#b9260e]'
                      }`}
                    >
                      {article.isRead ? 'Gelezen' : 'Lees'}
                    </button>
                  </div>
                ))}
              </div>
            </DataCard>

            {/* Quizzes */}
            <DataCard title="Quizzen" value="" icon="❓">
              <div className="space-y-3">
                {selectedModule.content.quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center gap-3 p-3 bg-[#2A2D3A] rounded-lg">
                    <div className="w-16 h-12 bg-[#3A3D4A] rounded flex items-center justify-center">
                      <span className="text-2xl">❓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{quiz.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {quiz.questions.length} vragen • {quiz.timeLimit} min
                      </p>
                      {quiz.bestScore > 0 && (
                        <p className="text-green-400 text-sm">Beste score: {quiz.bestScore}%</p>
                      )}
                    </div>
                    <button
                      className={`px-3 py-1 rounded text-sm ${
                        quiz.isCompleted ? 'bg-green-600 text-white' : 'bg-[#E33412] text-white hover:bg-[#b9260e]'
                      }`}
                    >
                      {quiz.isCompleted ? 'Voltooid' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </DataCard>

            {/* Downloads */}
            <DataCard title="Downloads" value="" icon="📁">
              <div className="space-y-3">
                {selectedModule.content.downloads.map((download) => (
                  <div key={download.id} className="flex items-center gap-3 p-3 bg-[#2A2D3A] rounded-lg">
                    <div className="w-16 h-12 bg-[#3A3D4A] rounded flex items-center justify-center">
                      <span className="text-2xl">📁</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{download.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {download.type.toUpperCase()} • {Math.round(download.fileSize / 1024)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(selectedModule.id, download.id)}
                      className={`px-3 py-1 rounded text-sm ${
                        download.isDownloaded ? 'bg-green-600 text-white' : 'bg-[#E33412] text-white hover:bg-[#b9260e]'
                      }`}
                    >
                      {download.isDownloaded ? 'Gedownload' : 'Download'}
                    </button>
                  </div>
                ))}
              </div>
            </DataCard>
          </div>

          <div className="space-y-6">
            <DataCard title="Module Info" value="" icon="ℹ️">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Instructeur</span>
                  <span className="text-white">{selectedModule.instructor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Niveau</span>
                  <span className="text-white capitalize">{selectedModule.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duur</span>
                  <span className="text-white">{selectedModule.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white">⭐ {selectedModule.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Inschrijvingen</span>
                  <span className="text-white">{selectedModule.enrollmentCount}</span>
                </div>
              </div>
            </DataCard>

            {moduleProgress && (
              <DataCard title="Jouw Voortgang" value="" icon="📊">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Voltooid</span>
                      <span className="text-white text-sm">{moduleProgress.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                      <div 
                        className="bg-[#E33412] h-2 rounded-full transition-all"
                        style={{ width: `${moduleProgress.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Video's</span>
                      <div className="text-white">
                        {moduleProgress.completedItems.videos.length} / {selectedModule.content.videos.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Artikelen</span>
                      <div className="text-white">
                        {moduleProgress.completedItems.articles.length} / {selectedModule.content.articles.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Quizzen</span>
                      <div className="text-white">
                        {moduleProgress.completedItems.quizzes.length} / {selectedModule.content.quizzes.length}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Downloads</span>
                      <div className="text-white">
                        {moduleProgress.completedItems.downloads.length} / {selectedModule.content.downloads.length}
                      </div>
                    </div>
                  </div>
                </div>
              </DataCard>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Learning Modules</h1>
                      <p className="text-gray-400 text-sm sm:text-base">Develop your knowledge with our expert modules</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto">
          Zoek modules
        </button>
      </div>

      {!showModuleDetail ? (
        <>
          {/* Tab Navigation */}
          <div className="flex flex-wrap sm:flex-nowrap space-x-1 bg-[#2A2D3A] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'modules'
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => setActiveTab('paths')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'paths'
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Leerpaden
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Voortgang
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'certificates'
                  ? 'bg-[#E33412] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Certificaten
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'modules' && renderModules()}
          {activeTab === 'paths' && renderPaths()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'certificates' && renderCertificates()}
        </>
      ) : (
        renderModuleDetail()
      )}
    </div>
  );
} 