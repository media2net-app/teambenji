export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'training' | 'nutrition' | 'recovery' | 'mindset' | 'general';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  estimatedTime: string;
  thumbnail: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  content: {
    videos: Video[];
    articles: Article[];
    quizzes: Quiz[];
    downloads: Download[];
  };
  prerequisites: string[]; // module IDs
  tags: string[];
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  isCompleted: boolean;
  completionRate: number; // 0-100
  lastAccessed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail: string;
  videoUrl: string;
  subtitles?: string[];
  isWatched: boolean;
  watchProgress: number; // 0-100
  notes: string;
  bookmarks: number[]; // timestamps in seconds
  quality: '720p' | '1080p' | '4K';
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  readingTime: number; // in minutes
  author: string;
  isRead: boolean;
  readProgress: number; // 0-100
  highlights: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  attempts: QuizAttempt[];
  maxAttempts: number;
  isCompleted: boolean;
  bestScore: number;
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, string | string[]>;
  score: number;
  passed: boolean;
  timeSpent: number; // in seconds
}

export interface Download {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'image' | 'audio' | 'video' | 'document';
  fileUrl: string;
  fileName: string;
  fileSize: number; // in bytes
  downloadCount: number;
  isDownloaded: boolean;
  downloadedAt?: string;
  createdAt: string;
}

export interface LearningProgress {
  userId: string;
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  completionPercentage: number;
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedItems: {
    videos: string[];
    articles: string[];
    quizzes: string[];
    downloads: string[];
  };
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  moduleId: string;
  moduleName: string;
  issuedAt: string;
  expiresAt?: string;
  certificateUrl: string;
  credentialId: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  modules: string[]; // module IDs in order
  estimatedDuration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'training' | 'nutrition' | 'recovery' | 'mindset' | 'general';
  isEnrolled: boolean;
  progress: number; // 0-100
  createdAt: string;
}

class EducationService {
  private readonly MODULES_KEY = 'teambenji_learning_modules';
  private readonly PROGRESS_KEY = 'teambenji_learning_progress';
  private readonly PATHS_KEY = 'teambenji_learning_paths';
  private readonly CERTIFICATES_KEY = 'teambenji_certificates';

  // Learning Modules Management
  getAllModules(): LearningModule[] {
    try {
      const data = localStorage.getItem(this.MODULES_KEY);
      return data ? JSON.parse(data) : this.generateInitialModules();
    } catch (error) {
      console.error('Error loading learning modules:', error);
      return this.generateInitialModules();
    }
  }

  getModuleById(id: string): LearningModule | null {
    const modules = this.getAllModules();
    return modules.find(module => module.id === id) || null;
  }

  getModulesByCategory(category: string): LearningModule[] {
    const modules = this.getAllModules();
    return modules.filter(module => module.category === category);
  }

  getModulesByLevel(level: string): LearningModule[] {
    const modules = this.getAllModules();
    return modules.filter(module => module.level === level);
  }

  searchModules(query: string): LearningModule[] {
    const modules = this.getAllModules();
    const searchTerm = query.toLowerCase();
    
    return modules.filter(module =>
      module.title.toLowerCase().includes(searchTerm) ||
      module.description.toLowerCase().includes(searchTerm) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      module.instructor.name.toLowerCase().includes(searchTerm)
    );
  }

  enrollInModule(moduleId: string): boolean {
    const modules = this.getAllModules();
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    
    if (moduleIndex === -1) return false;
    
    // Create progress entry
    const progress = this.getProgress();
    const existingProgress = progress.find(p => p.moduleId === moduleId);
    
    if (!existingProgress) {
      progress.push({
        userId: 'current_user',
        moduleId,
        status: 'in_progress',
        completionPercentage: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString(),
        completedItems: {
          videos: [],
          articles: [],
          quizzes: [],
          downloads: []
        },
        certificates: []
      });
      
      this.saveProgress(progress);
    }
    
    return true;
  }

  // Progress Management
  getProgress(): LearningProgress[] {
    try {
      const data = localStorage.getItem(this.PROGRESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading learning progress:', error);
      return [];
    }
  }

  getModuleProgress(moduleId: string): LearningProgress | null {
    const progress = this.getProgress();
    return progress.find(p => p.moduleId === moduleId) || null;
  }

  updateProgress(moduleId: string, updates: Partial<LearningProgress>): void {
    const progress = this.getProgress();
    const existingIndex = progress.findIndex(p => p.moduleId === moduleId);
    
    if (existingIndex !== -1) {
      progress[existingIndex] = { ...progress[existingIndex], ...updates };
      this.saveProgress(progress);
    }
  }

  markVideoWatched(moduleId: string, videoId: string): void {
    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;
    
    if (!progress.completedItems.videos.includes(videoId)) {
      progress.completedItems.videos.push(videoId);
      progress.lastAccessed = new Date().toISOString();
      this.updateProgress(moduleId, progress);
      this.calculateModuleCompletion(moduleId);
    }
  }

  markArticleRead(moduleId: string, articleId: string): void {
    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;
    
    if (!progress.completedItems.articles.includes(articleId)) {
      progress.completedItems.articles.push(articleId);
      progress.lastAccessed = new Date().toISOString();
      this.updateProgress(moduleId, progress);
      this.calculateModuleCompletion(moduleId);
    }
  }

  markQuizCompleted(moduleId: string, quizId: string): void {
    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;
    
    if (!progress.completedItems.quizzes.includes(quizId)) {
      progress.completedItems.quizzes.push(quizId);
      progress.lastAccessed = new Date().toISOString();
      this.updateProgress(moduleId, progress);
      this.calculateModuleCompletion(moduleId);
    }
  }

  markDownloadCompleted(moduleId: string, downloadId: string): void {
    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;
    
    if (!progress.completedItems.downloads.includes(downloadId)) {
      progress.completedItems.downloads.push(downloadId);
      progress.lastAccessed = new Date().toISOString();
      this.updateProgress(moduleId, progress);
      this.calculateModuleCompletion(moduleId);
    }
  }

  // Quiz Management
  submitQuizAttempt(moduleId: string, quizId: string, answers: Record<string, string | string[]>): QuizAttempt {
    const module = this.getModuleById(moduleId);
    if (!module) throw new Error('Module not found');
    
    const quiz = module.content.quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');
    
    const attempt: QuizAttempt = {
      id: this.generateId(),
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      answers,
      score: this.calculateQuizScore(quiz, answers),
      passed: false,
      timeSpent: 0
    };
    
    attempt.passed = attempt.score >= quiz.passingScore;
    
    // Update quiz attempts
    quiz.attempts.push(attempt);
    
    // Update best score
    if (attempt.score > quiz.bestScore) {
      quiz.bestScore = attempt.score;
    }
    
    // Mark as completed if passed
    if (attempt.passed && !quiz.isCompleted) {
      quiz.isCompleted = true;
      this.markQuizCompleted(moduleId, quizId);
    }
    
    this.saveModules(this.getAllModules());
    
    return attempt;
  }

  // Certificate Management
  getCertificates(): Certificate[] {
    try {
      const data = localStorage.getItem(this.CERTIFICATES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading certificates:', error);
      return [];
    }
  }

  generateCertificate(moduleId: string): Certificate | null {
    const module = this.getModuleById(moduleId);
    const progress = this.getModuleProgress(moduleId);
    
    if (!module || !progress || progress.completionPercentage < 100) {
      return null;
    }
    
    const certificate: Certificate = {
      id: this.generateId(),
      moduleId,
      moduleName: module.title,
      issuedAt: new Date().toISOString(),
      certificateUrl: `https://teambenji.nl/certificates/${this.generateId()}.pdf`,
      credentialId: this.generateCredentialId()
    };
    
    const certificates = this.getCertificates();
    certificates.push(certificate);
    this.saveCertificates(certificates);
    
    // Update progress
    progress.certificates.push(certificate);
    this.updateProgress(moduleId, progress);
    
    return certificate;
  }

  // Learning Paths
  getLearningPaths(): LearningPath[] {
    try {
      const data = localStorage.getItem(this.PATHS_KEY);
      return data ? JSON.parse(data) : this.generateInitialPaths();
    } catch (error) {
      console.error('Error loading learning paths:', error);
      return this.generateInitialPaths();
    }
  }

  enrollInLearningPath(pathId: string): boolean {
    const paths = this.getLearningPaths();
    const pathIndex = paths.findIndex(p => p.id === pathId);
    
    if (pathIndex === -1) return false;
    
    paths[pathIndex].isEnrolled = true;
    this.savePaths(paths);
    
    // Enroll in all modules in the path
    const path = paths[pathIndex];
    path.modules.forEach(moduleId => {
      this.enrollInModule(moduleId);
    });
    
    return true;
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateCredentialId(): string {
    return 'TB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
  }

  private calculateQuizScore(quiz: Quiz, answers: Record<string, string | string[]>): number {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (this.isAnswerCorrect(question, userAnswer)) {
        earnedPoints += question.points;
      }
    });
    
    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  }

  private isAnswerCorrect(question: Question, userAnswer: string | string[]): boolean {
    if (!userAnswer) return false;
    
    if (Array.isArray(question.correctAnswer)) {
      if (!Array.isArray(userAnswer)) return false;
      return question.correctAnswer.every(answer => userAnswer.includes(answer)) &&
             userAnswer.every(answer => question.correctAnswer.includes(answer));
    }
    
    return question.correctAnswer === userAnswer;
  }

  private calculateModuleCompletion(moduleId: string): void {
    const module = this.getModuleById(moduleId);
    const progress = this.getModuleProgress(moduleId);
    
    if (!module || !progress) return;
    
    const totalItems = 
      module.content.videos.length +
      module.content.articles.length +
      module.content.quizzes.length +
      module.content.downloads.length;
    
    const completedItems = 
      progress.completedItems.videos.length +
      progress.completedItems.articles.length +
      progress.completedItems.quizzes.length +
      progress.completedItems.downloads.length;
    
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    progress.completionPercentage = completionPercentage;
    progress.status = completionPercentage === 100 ? 'completed' : 'in_progress';
    
    this.updateProgress(moduleId, progress);
    
    // Generate certificate if module is completed
    if (completionPercentage === 100 && progress.certificates.length === 0) {
      this.generateCertificate(moduleId);
    }
  }

  private generateInitialModules(): LearningModule[] {
    const modules: LearningModule[] = [
      {
        id: 'training-basics',
        title: 'Training Fundamentals',
        description: 'Leer de basisprincipes van effectief trainen en bouw een sterke foundation op.',
        category: 'training',
        level: 'beginner',
        duration: 45,
        estimatedTime: '45 min',
        thumbnail: '/thumbnails/training-basics.jpg',
        instructor: {
          name: 'Sarah Wilson',
          title: 'Certified Personal Trainer',
          avatar: '/avatars/sarah.jpg'
        },
        content: {
          videos: [
            {
              id: 'video-1',
              title: 'Introductie tot Training',
              description: 'Een overzicht van de basisprincipes van training',
              duration: 900,
              thumbnail: '/thumbnails/intro-training.jpg',
              videoUrl: '/videos/intro-training.mp4',
              isWatched: false,
              watchProgress: 0,
              notes: '',
              bookmarks: [],
              quality: '1080p',
              createdAt: new Date().toISOString()
            },
            {
              id: 'video-2',
              title: 'Warming-up en Cooling-down',
              description: 'Het belang van warming-up en cooling-down',
              duration: 720,
              thumbnail: '/thumbnails/warmup.jpg',
              videoUrl: '/videos/warmup.mp4',
              isWatched: false,
              watchProgress: 0,
              notes: '',
              bookmarks: [],
              quality: '1080p',
              createdAt: new Date().toISOString()
            }
          ],
          articles: [
            {
              id: 'article-1',
              title: 'Progressive Overload Principe',
              content: 'Progressive overload is het geleidelijk verhogen van stress op het lichaam tijdens training...',
              summary: 'Leer hoe je progressief kunt overbelasten voor optimale resultaten.',
              readingTime: 5,
              author: 'Sarah Wilson',
              isRead: false,
              readProgress: 0,
              highlights: [],
              notes: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          quizzes: [
            {
              id: 'quiz-1',
              title: 'Training Basics Quiz',
              description: 'Test je kennis van de training fundamentals',
              questions: [
                {
                  id: 'q1',
                  type: 'multiple_choice',
                  question: 'Wat is progressive overload?',
                  options: [
                    'Het geleidelijk verhogen van trainingsintensiteit',
                    'Het verlagen van trainingsfrequentie',
                    'Het skippen van rust dagen',
                    'Het doen van dezelfde oefeningen'
                  ],
                  correctAnswer: 'Het geleidelijk verhogen van trainingsintensiteit',
                  explanation: 'Progressive overload betekent het geleidelijk verhogen van stress op het lichaam.',
                  points: 10,
                  difficulty: 'easy'
                }
              ],
              timeLimit: 15,
              passingScore: 70,
              attempts: [],
              maxAttempts: 3,
              isCompleted: false,
              bestScore: 0,
              createdAt: new Date().toISOString()
            }
          ],
          downloads: [
            {
              id: 'download-1',
              title: 'Training Log Template',
              description: 'Een handige template om je trainingen bij te houden',
              type: 'pdf',
              fileUrl: '/downloads/training-log.pdf',
              fileName: 'training-log-template.pdf',
              fileSize: 1024000,
              downloadCount: 0,
              isDownloaded: false,
              createdAt: new Date().toISOString()
            }
          ]
        },
        prerequisites: [],
        tags: ['training', 'basics', 'beginner', 'foundation'],
        rating: 4.8,
        reviewCount: 127,
        enrollmentCount: 1543,
        isCompleted: false,
        completionRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'nutrition-essentials',
        title: 'Nutrition Essentials',
        description: 'Ontdek de fundamenten van gezonde voeding en macro-nutriënten.',
        category: 'nutrition',
        level: 'beginner',
        duration: 60,
        estimatedTime: '1 uur',
        thumbnail: '/thumbnails/nutrition-essentials.jpg',
        instructor: {
          name: 'Mike Chen',
          title: 'Registered Dietitian',
          avatar: '/avatars/mike.jpg'
        },
        content: {
          videos: [
            {
              id: 'video-3',
              title: 'Macro-nutriënten Uitgelegd',
              description: 'Alles wat je moet weten over eiwitten, koolhydraten en vetten',
              duration: 1200,
              thumbnail: '/thumbnails/macros.jpg',
              videoUrl: '/videos/macros.mp4',
              isWatched: false,
              watchProgress: 0,
              notes: '',
              bookmarks: [],
              quality: '1080p',
              createdAt: new Date().toISOString()
            }
          ],
          articles: [
            {
              id: 'article-2',
              title: 'Calorie Deficit vs Surplus',
              content: 'Het verschil tussen calorie deficit en surplus en wanneer je welke toepast...',
              summary: 'Leer wanneer je een calorie deficit of surplus moet hanteren.',
              readingTime: 7,
              author: 'Mike Chen',
              isRead: false,
              readProgress: 0,
              highlights: [],
              notes: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          quizzes: [
            {
              id: 'quiz-2',
              title: 'Nutrition Knowledge Check',
              description: 'Test je kennis van voeding en macro-nutriënten',
              questions: [
                {
                  id: 'q2',
                  type: 'multiple_choice',
                  question: 'Hoeveel calorieën bevat 1 gram eiwit?',
                  options: ['4 calorieën', '7 calorieën', '9 calorieën', '2 calorieën'],
                  correctAnswer: '4 calorieën',
                  explanation: 'Eiwit bevat 4 calorieën per gram, net als koolhydraten.',
                  points: 10,
                  difficulty: 'easy'
                }
              ],
              timeLimit: 10,
              passingScore: 80,
              attempts: [],
              maxAttempts: 3,
              isCompleted: false,
              bestScore: 0,
              createdAt: new Date().toISOString()
            }
          ],
          downloads: [
            {
              id: 'download-2',
              title: 'Healthy Meal Plans',
              description: 'Voorbeelden van gezonde maaltijdplannen voor verschillende doelen',
              type: 'pdf',
              fileUrl: '/downloads/meal-plans.pdf',
              fileName: 'healthy-meal-plans.pdf',
              fileSize: 2048000,
              downloadCount: 0,
              isDownloaded: false,
              createdAt: new Date().toISOString()
            }
          ]
        },
        prerequisites: [],
        tags: ['nutrition', 'macros', 'beginner', 'healthy eating'],
        rating: 4.9,
        reviewCount: 89,
        enrollmentCount: 1234,
        isCompleted: false,
        completionRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sleep-recovery',
        title: 'Sleep & Recovery Optimization',
        description: 'Optimaliseer je slaap en recovery voor betere prestaties.',
        category: 'recovery',
        level: 'intermediate',
        duration: 90,
        estimatedTime: '1.5 uur',
        thumbnail: '/thumbnails/sleep-recovery.jpg',
        instructor: {
          name: 'Dr. Lisa Brown',
          title: 'Sleep Specialist',
          avatar: '/avatars/lisa.jpg'
        },
        content: {
          videos: [
            {
              id: 'video-4',
              title: 'Sleep Cycles & Quality',
              description: 'Begrijp hoe slaap werkt en hoe je de kwaliteit kunt verbeteren',
              duration: 1800,
              thumbnail: '/thumbnails/sleep-cycles.jpg',
              videoUrl: '/videos/sleep-cycles.mp4',
              isWatched: false,
              watchProgress: 0,
              notes: '',
              bookmarks: [],
              quality: '1080p',
              createdAt: new Date().toISOString()
            }
          ],
          articles: [
            {
              id: 'article-3',
              title: 'Recovery Strategies',
              content: 'Verschillende strategieën om je recovery te optimaliseren...',
              summary: 'Praktische tips voor betere recovery.',
              readingTime: 8,
              author: 'Dr. Lisa Brown',
              isRead: false,
              readProgress: 0,
              highlights: [],
              notes: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          quizzes: [
            {
              id: 'quiz-3',
              title: 'Sleep & Recovery Assessment',
              description: 'Test je kennis van slaap en recovery',
              questions: [
                {
                  id: 'q3',
                  type: 'multiple_choice',
                  question: 'Hoeveel slaapfases zijn er?',
                  options: ['3 fases', '4 fases', '5 fases', '6 fases'],
                  correctAnswer: '4 fases',
                  explanation: 'Er zijn 4 hoofdfases van slaap: N1, N2, N3 en REM.',
                  points: 15,
                  difficulty: 'medium'
                }
              ],
              timeLimit: 20,
              passingScore: 75,
              attempts: [],
              maxAttempts: 3,
              isCompleted: false,
              bestScore: 0,
              createdAt: new Date().toISOString()
            }
          ],
          downloads: [
            {
              id: 'download-3',
              title: 'Sleep Optimization Guide',
              description: 'Complete gids voor het optimaliseren van je slaap',
              type: 'pdf',
              fileUrl: '/downloads/sleep-guide.pdf',
              fileName: 'sleep-optimization-guide.pdf',
              fileSize: 3072000,
              downloadCount: 0,
              isDownloaded: false,
              createdAt: new Date().toISOString()
            }
          ]
        },
        prerequisites: [],
        tags: ['sleep', 'recovery', 'intermediate', 'optimization'],
        rating: 4.7,
        reviewCount: 56,
        enrollmentCount: 789,
        isCompleted: false,
        completionRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    this.saveModules(modules);
    return modules;
  }

  private generateInitialPaths(): LearningPath[] {
    const paths: LearningPath[] = [
      {
        id: 'beginner-path',
        title: 'Beginner Fitness Journey',
        description: 'Een complete leerroute voor beginners in fitness en gezondheid',
        modules: ['training-basics', 'nutrition-essentials'],
        estimatedDuration: 2,
        difficulty: 'beginner',
        category: 'general',
        isEnrolled: false,
        progress: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: 'advanced-performance',
        title: 'Advanced Performance Optimization',
        description: 'Geavanceerde technieken voor het optimaliseren van prestaties',
        modules: ['training-basics', 'nutrition-essentials', 'sleep-recovery'],
        estimatedDuration: 4,
        difficulty: 'advanced',
        category: 'training',
        isEnrolled: false,
        progress: 0,
        createdAt: new Date().toISOString()
      }
    ];
    
    this.savePaths(paths);
    return paths;
  }

  private saveModules(modules: LearningModule[]): void {
    try {
      localStorage.setItem(this.MODULES_KEY, JSON.stringify(modules));
    } catch (error) {
      console.error('Error saving learning modules:', error);
    }
  }

  private saveProgress(progress: LearningProgress[]): void {
    try {
      localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving learning progress:', error);
    }
  }

  private savePaths(paths: LearningPath[]): void {
    try {
      localStorage.setItem(this.PATHS_KEY, JSON.stringify(paths));
    } catch (error) {
      console.error('Error saving learning paths:', error);
    }
  }

  private saveCertificates(certificates: Certificate[]): void {
    try {
      localStorage.setItem(this.CERTIFICATES_KEY, JSON.stringify(certificates));
    } catch (error) {
      console.error('Error saving certificates:', error);
    }
  }
}

export const educationService = new EducationService(); 