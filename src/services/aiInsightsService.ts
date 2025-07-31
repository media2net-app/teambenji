import { bodyCompositionService, type BodyCompositionData } from './bodyCompositionService';

export interface AIInsight {
  id: string;
  category: 'training' | 'nutrition' | 'recovery' | 'body_composition' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionItems?: string[];
  dataPoints?: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' }[];
  confidence: number; // 0-100
  generatedAt: string;
  expiresAt?: string;
  icon: string;
  color: string;
  language?: 'nl' | 'en';
}

export interface UserDataProfile {
  // Training data
  weeklyTrainingSessions: number;
  averageSessionDuration: number;
  preferredTrainingTime: string;
  trainingConsistency: number; // 0-100
  lastTrainingDate?: string;
  
  // Nutrition data
  averageDailyCalories: number;
  macroBalance: { protein: number; carbs: number; fat: number };
  hydrationLevel: number;
  nutritionConsistency: number;
  
  // Recovery data
  averageSleepHours: number;
  sleepQuality: number; // 0-100
  stressLevel: number; // 0-100
  restDays: number;
  
  // Body composition data
  latestMeasurements?: BodyCompositionData;
  progressTrend: 'improving' | 'stable' | 'declining';
  goalProgress: Record<string, number>;
  
  // General profile
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryGoals: string[];
  preferences: {
    focusAreas: string[];
    avoidanceList: string[];
    motivationStyle: 'encouraging' | 'challenging' | 'analytical';
  };
}

class AIInsightsService {
  private readonly INSIGHTS_STORAGE_KEY = 'teambenji_ai_insights';
  private readonly USER_PROFILE_KEY = 'teambenji_user_profile';

  // Generate insights based on user data
  generateInsights(language: 'nl' | 'en' = 'en'): AIInsight[] {
    const userProfile = this.getUserProfile();
    const insights: AIInsight[] = [];

    // Training insights
    insights.push(...this.generateTrainingInsights(userProfile, language));
    
    // Nutrition insights
    insights.push(...this.generateNutritionInsights(userProfile, language));
    
    // Recovery insights
    insights.push(...this.generateRecoveryInsights(userProfile, language));
    
    // Body composition insights
    insights.push(...this.generateBodyCompositionInsights(userProfile, language));
    
    // General lifestyle insights
    insights.push(...this.generateGeneralInsights(userProfile, language));

    // Sort by priority and confidence
    const sortedInsights = insights.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    // Store insights
    this.saveInsights(sortedInsights);
    
    return sortedInsights.slice(0, 10); // Return top 10 insights
  }

  private generateTrainingInsights(profile: UserDataProfile, language: 'nl' | 'en'): AIInsight[] {
    const insights: AIInsight[] = [];

    // Training frequency analysis
    if (profile.weeklyTrainingSessions < 3) {
      insights.push({
        id: `training_frequency_${Date.now()}`,
        category: 'training',
        priority: 'high',
        title: language === 'nl' ? 'Verhoog je trainingsfrequentie' : 'Increase your training frequency',
        message: language === 'nl' 
          ? `Je traint momenteel ${profile.weeklyTrainingSessions}x per week. Voor optimale resultaten wordt 3-4x per week aanbevolen.`
          : `You currently train ${profile.weeklyTrainingSessions}x per week. For optimal results, 3-4x per week is recommended.`,
        actionItems: language === 'nl' ? [
          'Plan 1-2 extra trainingsessies deze week',
          'Start met kortere sessies (30-45 min) als tijd een probleem is',
          'Overweeg home workouts voor extra flexibiliteit'
        ] : [
          'Plan 1-2 extra training sessions this week',
          'Start with shorter sessions (30-45 min) if time is an issue',
          'Consider home workouts for extra flexibility'
        ],
        dataPoints: language === 'nl' ? [
          { label: 'Huidige frequentie', value: `${profile.weeklyTrainingSessions}x/week` },
          { label: 'Aanbevolen', value: '3-4x/week' }
        ] : [
          { label: 'Current frequency', value: `${profile.weeklyTrainingSessions}x/week` },
          { label: 'Recommended', value: '3-4x/week' }
        ],
        confidence: 85,
        generatedAt: new Date().toISOString(),
        icon: '💪',
        color: 'orange',
        language
      });
    }

    // Training consistency
    if (profile.trainingConsistency < 70) {
      insights.push({
        id: `training_consistency_${Date.now()}`,
        category: 'training',
        priority: 'medium',
        title: 'Improve your training consistency',
        message: `Your training consistency is ${profile.trainingConsistency}%. Regularity is crucial for progress.`,
        actionItems: [
          'Plan your workouts in advance in your calendar',
          'Set realistic goals and build up slowly',
          'Find a training partner for extra motivation'
        ],
        confidence: 78,
        generatedAt: new Date().toISOString(),
        icon: '📅',
        color: 'blue'
      });
    }

    // Session duration optimization
    if (profile.averageSessionDuration > 90) {
      insights.push({
        id: `session_duration_${Date.now()}`,
        category: 'training',
        priority: 'medium',
        title: 'Optimize your training length',
        message: `Your average session lasts ${profile.averageSessionDuration} minutes. Shorter, more intense workouts can be more effective.`,
        actionItems: [
          'Focus on compound exercises for more efficiency',
          'Reduce rest periods between sets',
          'Try HIIT workouts of 45-60 minutes'
        ],
        confidence: 72,
        generatedAt: new Date().toISOString(),
        icon: '⏱️',
        color: 'yellow'
      });
    }

    return insights;
  }

  private generateNutritionInsights(profile: UserDataProfile, language: 'nl' | 'en'): AIInsight[] {
    const insights: AIInsight[] = [];

    // Protein intake analysis
    const proteinPercentage = profile.macroBalance.protein;
    if (proteinPercentage < 25) {
      insights.push({
        id: `protein_intake_${Date.now()}`,
        category: 'nutrition',
        priority: 'high',
        title: language === 'nl' ? 'Verhoog je eiwitinname' : 'Increase your protein intake',
        message: language === 'nl' 
          ? `Je eiwitinname is ${proteinPercentage}% van je totale calorieën. Voor spierbehoud en -opbouw wordt 25-30% aanbevolen.`
          : `Your protein intake is ${proteinPercentage}% of your total calories. For muscle maintenance and building, 25-30% is recommended.`,
        actionItems: language === 'nl' ? [
          'Voeg een eiwitbron toe aan elke maaltijd',
          'Overweeg een eiwitshake na je training',
          'Kies voor magere vleessoorten, vis, eieren en peulvruchten'
        ] : [
          'Add a protein source to every meal',
          'Consider a protein shake after your workout',
          'Choose lean meats, fish, eggs and legumes'
        ],
        dataPoints: language === 'nl' ? [
          { label: 'Huidige eiwit', value: `${proteinPercentage}%` },
          { label: 'Aanbevolen', value: '25-30%' }
        ] : [
          { label: 'Current protein', value: `${proteinPercentage}%` },
          { label: 'Recommended', value: '25-30%' }
        ],
        confidence: 88,
        generatedAt: new Date().toISOString(),
        icon: '🥩',
        color: 'red',
        language
      });
    }

    // Hydration level
    if (profile.hydrationLevel < 80) {
      insights.push({
        id: `hydration_${Date.now()}`,
        category: 'nutrition',
        priority: 'medium',
        title: language === 'nl' ? 'Verbeter je hydratatie' : 'Improve your hydration',
        message: language === 'nl' 
          ? `Je hydratieniveau is ${profile.hydrationLevel}%. Goede hydratatie is essentieel voor prestaties en herstel.`
          : `Your hydration level is ${profile.hydrationLevel}%. Good hydration is essential for performance and recovery.`,
        actionItems: language === 'nl' ? [
          'Drink 2-3 liter water per dag',
          'Start elke dag met een glas water',
          'Drink extra water rondom je trainingen'
        ] : [
          'Drink 2-3 liters of water per day',
          'Start each day with a glass of water',
          'Drink extra water around your workouts'
        ],
        confidence: 82,
        generatedAt: new Date().toISOString(),
        icon: '💧',
        color: 'blue'
      });
    }

    // Calorie analysis based on goals
    if (profile.averageDailyCalories < 1500) {
      insights.push({
        id: `calorie_intake_${Date.now()}`,
        category: 'nutrition',
        priority: 'critical',
        title: language === 'nl' ? 'Te lage calorie-inname' : 'Too low calorie intake',
        message: language === 'nl' 
          ? `Je gemiddelde dagelijkse inname van ${profile.averageDailyCalories} kcal is mogelijk te laag voor je doelen.`
          : `Your average daily intake of ${profile.averageDailyCalories} kcal may be too low for your goals.`,
        actionItems: language === 'nl' ? [
          'Consulteer een voedingsdeskundige',
          'Voeg gezonde, calorie-rijke snacks toe',
          'Monitor je energieniveau en prestaties'
        ] : [
          'Consult a nutritionist',
          'Add healthy, calorie-rich snacks',
          'Monitor your energy levels and performance'
        ],
        confidence: 90,
        generatedAt: new Date().toISOString(),
        icon: '⚠️',
        color: 'red'
      });
    }

    return insights;
  }

  private generateRecoveryInsights(profile: UserDataProfile, language: 'nl' | 'en'): AIInsight[] {
    const insights: AIInsight[] = [];

    // Sleep analysis
    if (profile.averageSleepHours < 7) {
      insights.push({
        id: `sleep_duration_${Date.now()}`,
        category: 'recovery',
        priority: 'high',
        title: language === 'nl' ? 'Verhoog je slaaptijd' : 'Increase your sleep time',
        message: language === 'nl' 
          ? `Je slaapt gemiddeld ${profile.averageSleepHours} uur per nacht. Voor optimaal herstel wordt 7-9 uur aanbevolen.`
          : `You sleep an average of ${profile.averageSleepHours} hours per night. For optimal recovery, 7-9 hours is recommended.`,
        actionItems: language === 'nl' ? [
          'Ga 30 minuten eerder naar bed',
          'Creëer een consistente slaaprutine',
          'Vermijd schermen 1 uur voor bedtijd'
        ] : [
          'Go to bed 30 minutes earlier',
          'Create a consistent sleep routine',
          'Avoid screens 1 hour before bedtime'
        ],
        dataPoints: language === 'nl' ? [
          { label: 'Huidige slaap', value: `${profile.averageSleepHours}u` },
          { label: 'Aanbevolen', value: '7-9u' }
        ] : [
          { label: 'Current sleep', value: `${profile.averageSleepHours}h` },
          { label: 'Recommended', value: '7-9h' }
        ],
        confidence: 92,
        generatedAt: new Date().toISOString(),
        icon: '😴',
        color: 'purple'
      });
    }

    // Sleep quality
    if (profile.sleepQuality < 70) {
      insights.push({
        id: `sleep_quality_${Date.now()}`,
        category: 'recovery',
        priority: 'medium',
        title: 'Improve your sleep quality',
        message: `Your sleep quality score is ${profile.sleepQuality}%. Better sleep quality improves recovery and performance.`,
        actionItems: [
          'Keep your bedroom cool (16-19°C)',
          'Invest in a good mattress and pillow',
          'Try meditation or relaxation techniques'
        ],
        confidence: 75,
        generatedAt: new Date().toISOString(),
        icon: '🛏️',
        color: 'blue'
      });
    }

    // Stress level
    if (profile.stressLevel > 70) {
      insights.push({
        id: `stress_management_${Date.now()}`,
        category: 'recovery',
        priority: 'high',
        title: 'Manage your stress level',
        message: `Your stress level is ${profile.stressLevel}%. Chronic stress can negatively affect your fitness results.`,
        actionItems: [
          'Try 10 minutes of meditation daily',
          'Plan conscious relaxation moments',
          'Consider yoga or breathing exercises'
        ],
        confidence: 80,
        generatedAt: new Date().toISOString(),
        icon: '🧘',
        color: 'green'
      });
    }

    return insights;
  }

  private generateBodyCompositionInsights(profile: UserDataProfile, language: 'nl' | 'en'): AIInsight[] {
    const insights: AIInsight[] = [];

    if (!profile.latestMeasurements) return insights;

    // Progress trend analysis
    if (profile.progressTrend === 'declining') {
      insights.push({
        id: `progress_trend_${Date.now()}`,
        category: 'body_composition',
        priority: 'high',
        title: language === 'nl' ? 'Je voortgang stagneert' : 'Your progress is stagnating',
        message: language === 'nl' 
          ? 'Je lichaamssamenstelling toont een dalende trend. Het is tijd om je aanpak aan te passen.'
          : 'Your body composition shows a declining trend. It\'s time to adjust your approach.',
        actionItems: language === 'nl' ? [
          'Evalueer je huidige training- en voedingsplan',
          'Overweeg een deload week voor herstel',
          'Varieer je trainingsroutine om plateaus te doorbreken'
        ] : [
          'Evaluate your current training and nutrition plan',
          'Consider a deload week for recovery',
          'Vary your training routine to break plateaus'
        ],
        confidence: 85,
        generatedAt: new Date().toISOString(),
        icon: '📉',
        color: 'red',
        language
      });
    }

    // Goal progress analysis
    const avgProgress = Object.values(profile.goalProgress).reduce((sum, progress) => sum + progress, 0) / Object.values(profile.goalProgress).length;
    
    if (avgProgress > 80) {
      insights.push({
        id: `goal_achievement_${Date.now()}`,
        category: 'body_composition',
        priority: 'low',
        title: language === 'nl' ? 'Geweldige vooruitgang!' : 'Great progress!',
        message: language === 'nl' 
          ? `Je bent gemiddeld ${Math.round(avgProgress)}% van je doelen bereikt. Blijf doorgaan!`
          : `You have achieved an average of ${Math.round(avgProgress)}% of your goals. Keep going!`,
        actionItems: language === 'nl' ? [
          'Overweeg nieuwe, uitdagendere doelen te stellen',
          'Deel je succes met anderen voor extra motivatie',
          'Beloon jezelf voor je harde werk'
        ] : [
          'Consider setting new, more challenging goals',
          'Share your success with others for extra motivation',
          'Reward yourself for your hard work'
        ],
        confidence: 95,
        generatedAt: new Date().toISOString(),
        icon: '🎉',
        color: 'green',
        language
      });
    }

    return insights;
  }

  private generateGeneralInsights(profile: UserDataProfile, language: 'nl' | 'en'): AIInsight[] {
    const insights: AIInsight[] = [];

    // Beginner guidance
    if (profile.fitnessLevel === 'beginner') {
      insights.push({
        id: `beginner_guidance_${Date.now()}`,
        category: 'general',
        priority: 'medium',
        title: language === 'nl' ? 'Welkom bij je fitnessreis!' : 'Welcome to your fitness journey!',
        message: language === 'nl' 
          ? 'Als beginner is het belangrijk om langzaam op te bouwen en je lichaam te laten wennen.'
          : 'As a beginner, it\'s important to build up slowly and let your body adapt.',
        actionItems: language === 'nl' ? [
          'Start met 2-3 trainingen per week',
          'Focus op het leren van de juiste technieken',
          'Luister naar je lichaam en neem voldoende rust'
        ] : [
          'Start with 2-3 workouts per week',
          'Focus on learning the correct techniques',
          'Listen to your body and take sufficient rest'
        ],
        confidence: 88,
        generatedAt: new Date().toISOString(),
        icon: '🌱',
        color: 'green',
        language
      });
    }

    // Motivational insight based on consistency
    const overallConsistency = (profile.trainingConsistency + profile.nutritionConsistency) / 2;
    if (overallConsistency > 85) {
      insights.push({
        id: `motivation_high_${Date.now()}`,
        category: 'general',
        priority: 'low',
        title: language === 'nl' ? 'Je bent een voorbeeld van consistentie!' : 'You are an example of consistency!',
        message: language === 'nl' 
          ? `Met ${Math.round(overallConsistency)}% consistentie ben je op de goede weg naar je doelen.`
          : `With ${Math.round(overallConsistency)}% consistency, you are on the right track to your goals.`,
        actionItems: language === 'nl' ? [
          'Blijf je huidige routine volhouden',
          'Inspireer anderen met je discipline',
          'Overweeg je doelen uit te breiden'
        ] : [
          'Keep maintaining your current routine',
          'Inspire others with your discipline',
          'Consider expanding your goals'
        ],
        confidence: 90,
        generatedAt: new Date().toISOString(),
        icon: '🏆',
        color: 'gold',
        language
      });
    }

    return insights;
  }

  // Get user profile (mock data for now)
  private getUserProfile(): UserDataProfile {
    const stored = localStorage.getItem(this.USER_PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Generate mock profile based on available data
    const latestMeasurement = bodyCompositionService.getLatestMeasurement();
    const progress = bodyCompositionService.calculateProgress();

    return {
      weeklyTrainingSessions: 2.5,
      averageSessionDuration: 75,
      preferredTrainingTime: 'evening',
      trainingConsistency: 68,
      lastTrainingDate: '2024-01-14',
      
      averageDailyCalories: 2100,
      macroBalance: { protein: 22, carbs: 45, fat: 33 },
      hydrationLevel: 75,
      nutritionConsistency: 72,
      
      averageSleepHours: 6.8,
      sleepQuality: 73,
      stressLevel: 65,
      restDays: 2,
      
      latestMeasurements: latestMeasurement || undefined,
      progressTrend: 'improving',
      goalProgress: progress,
      
      fitnessLevel: 'intermediate',
      primaryGoals: ['weight_loss', 'muscle_gain', 'endurance'],
      preferences: {
        focusAreas: ['strength', 'cardio'],
        avoidanceList: ['high_impact'],
        motivationStyle: 'encouraging'
      }
    };
  }

  // Save insights to storage
  private saveInsights(insights: AIInsight[]): void {
    try {
      localStorage.setItem(this.INSIGHTS_STORAGE_KEY, JSON.stringify(insights));
    } catch (error) {
      console.error('Error saving AI insights:', error);
    }
  }

  // Get stored insights
  getStoredInsights(): AIInsight[] {
    try {
      const stored = localStorage.getItem(this.INSIGHTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading AI insights:', error);
      return [];
    }
  }

  // Get insights by category
  getInsightsByCategory(category: AIInsight['category']): AIInsight[] {
    return this.getStoredInsights().filter(insight => insight.category === category);
  }

  // Get insights by priority
  getInsightsByPriority(priority: AIInsight['priority']): AIInsight[] {
    return this.getStoredInsights().filter(insight => insight.priority === priority);
  }

  // Update user profile
  updateUserProfile(updates: Partial<UserDataProfile>): void {
    const current = this.getUserProfile();
    const updated = { ...current, ...updates };
    
    try {
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }

  // Clear old insights (older than 24 hours)
  clearExpiredInsights(): void {
    const insights = this.getStoredInsights();
    const now = new Date();
    
    const validInsights = insights.filter(insight => {
      if (insight.expiresAt) {
        return new Date(insight.expiresAt) > now;
      }
      // Default expiry: 24 hours
      const generatedAt = new Date(insight.generatedAt);
      const expiryTime = new Date(generatedAt.getTime() + 24 * 60 * 60 * 1000);
      return expiryTime > now;
    });
    
    this.saveInsights(validInsights);
  }
}

export const aiInsightsService = new AIInsightsService(); 