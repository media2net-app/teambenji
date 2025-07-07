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
  generateInsights(): AIInsight[] {
    const userProfile = this.getUserProfile();
    const insights: AIInsight[] = [];

    // Training insights
    insights.push(...this.generateTrainingInsights(userProfile));
    
    // Nutrition insights
    insights.push(...this.generateNutritionInsights(userProfile));
    
    // Recovery insights
    insights.push(...this.generateRecoveryInsights(userProfile));
    
    // Body composition insights
    insights.push(...this.generateBodyCompositionInsights(userProfile));
    
    // General lifestyle insights
    insights.push(...this.generateGeneralInsights(userProfile));

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

  private generateTrainingInsights(profile: UserDataProfile): AIInsight[] {
    const insights: AIInsight[] = [];

    // Training frequency analysis
    if (profile.weeklyTrainingSessions < 3) {
      insights.push({
        id: `training_frequency_${Date.now()}`,
        category: 'training',
        priority: 'high',
        title: 'Verhoog je trainingsfrequentie',
        message: `Je traint momenteel ${profile.weeklyTrainingSessions}x per week. Voor optimale resultaten wordt 3-4x per week aanbevolen.`,
        actionItems: [
          'Plan 1-2 extra trainingsessies deze week',
          'Start met kortere sessies (30-45 min) als tijd een probleem is',
          'Overweeg home workouts voor extra flexibiliteit'
        ],
        dataPoints: [
          { label: 'Huidige frequentie', value: `${profile.weeklyTrainingSessions}x/week` },
          { label: 'Aanbevolen', value: '3-4x/week' }
        ],
        confidence: 85,
        generatedAt: new Date().toISOString(),
        icon: '💪',
        color: 'orange'
      });
    }

    // Training consistency
    if (profile.trainingConsistency < 70) {
      insights.push({
        id: `training_consistency_${Date.now()}`,
        category: 'training',
        priority: 'medium',
        title: 'Verbeter je training consistentie',
        message: `Je training consistentie is ${profile.trainingConsistency}%. Regelmatigheid is cruciaal voor vooruitgang.`,
        actionItems: [
          'Plan je trainingen van tevoren in je agenda',
          'Stel realistische doelen en bouw langzaam op',
          'Zoek een trainingspartner voor extra motivatie'
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
        title: 'Optimaliseer je trainingslengte',
        message: `Je gemiddelde sessie duurt ${profile.averageSessionDuration} minuten. Kortere, intensievere workouts kunnen effectiever zijn.`,
        actionItems: [
          'Focus op compound oefeningen voor meer efficiëntie',
          'Verminder rustpauzes tussen sets',
          'Probeer HIIT workouts van 45-60 minuten'
        ],
        confidence: 72,
        generatedAt: new Date().toISOString(),
        icon: '⏱️',
        color: 'yellow'
      });
    }

    return insights;
  }

  private generateNutritionInsights(profile: UserDataProfile): AIInsight[] {
    const insights: AIInsight[] = [];

    // Protein intake analysis
    const proteinPercentage = profile.macroBalance.protein;
    if (proteinPercentage < 25) {
      insights.push({
        id: `protein_intake_${Date.now()}`,
        category: 'nutrition',
        priority: 'high',
        title: 'Verhoog je eiwitinname',
        message: `Je eiwitinname is ${proteinPercentage}% van je totale calorieën. Voor spierbehoud en -opbouw wordt 25-30% aanbevolen.`,
        actionItems: [
          'Voeg een eiwitbron toe aan elke maaltijd',
          'Overweeg een eiwitshake na je training',
          'Kies voor magere vleessoorten, vis, eieren en peulvruchten'
        ],
        dataPoints: [
          { label: 'Huidige eiwit', value: `${proteinPercentage}%` },
          { label: 'Aanbevolen', value: '25-30%' }
        ],
        confidence: 88,
        generatedAt: new Date().toISOString(),
        icon: '🥩',
        color: 'red'
      });
    }

    // Hydration level
    if (profile.hydrationLevel < 80) {
      insights.push({
        id: `hydration_${Date.now()}`,
        category: 'nutrition',
        priority: 'medium',
        title: 'Verbeter je hydratatie',
        message: `Je hydratieniveau is ${profile.hydrationLevel}%. Goede hydratatie is essentieel voor prestaties en herstel.`,
        actionItems: [
          'Drink 2-3 liter water per dag',
          'Start elke dag met een glas water',
          'Drink extra water rondom je trainingen'
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
        title: 'Te lage calorie-inname',
        message: `Je gemiddelde dagelijkse inname van ${profile.averageDailyCalories} kcal is mogelijk te laag voor je doelen.`,
        actionItems: [
          'Consulteer een voedingsdeskundige',
          'Voeg gezonde, calorie-rijke snacks toe',
          'Monitor je energieniveau en prestaties'
        ],
        confidence: 90,
        generatedAt: new Date().toISOString(),
        icon: '⚠️',
        color: 'red'
      });
    }

    return insights;
  }

  private generateRecoveryInsights(profile: UserDataProfile): AIInsight[] {
    const insights: AIInsight[] = [];

    // Sleep analysis
    if (profile.averageSleepHours < 7) {
      insights.push({
        id: `sleep_duration_${Date.now()}`,
        category: 'recovery',
        priority: 'high',
        title: 'Verhoog je slaaptijd',
        message: `Je slaapt gemiddeld ${profile.averageSleepHours} uur per nacht. Voor optimaal herstel wordt 7-9 uur aanbevolen.`,
        actionItems: [
          'Ga 30 minuten eerder naar bed',
          'Creëer een consistente slaaprutine',
          'Vermijd schermen 1 uur voor bedtijd'
        ],
        dataPoints: [
          { label: 'Huidige slaap', value: `${profile.averageSleepHours}u` },
          { label: 'Aanbevolen', value: '7-9u' }
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
        title: 'Verbeter je slaapkwaliteit',
        message: `Je slaapkwaliteit score is ${profile.sleepQuality}%. Betere slaapkwaliteit verbetert herstel en prestaties.`,
        actionItems: [
          'Houd je slaapkamer koel (16-19°C)',
          'Investeer in een goede matras en kussen',
          'Probeer meditatie of ontspanningstechnieken'
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
        title: 'Beheer je stressniveau',
        message: `Je stressniveau is ${profile.stressLevel}%. Chronische stress kan je fitnessresultaten negatief beïnvloeden.`,
        actionItems: [
          'Probeer dagelijks 10 minuten meditatie',
          'Plan bewust ontspanningsmomenten in',
          'Overweeg yoga of ademhalingsoefeningen'
        ],
        confidence: 80,
        generatedAt: new Date().toISOString(),
        icon: '🧘',
        color: 'green'
      });
    }

    return insights;
  }

  private generateBodyCompositionInsights(profile: UserDataProfile): AIInsight[] {
    const insights: AIInsight[] = [];

    if (!profile.latestMeasurements) return insights;

    // Progress trend analysis
    if (profile.progressTrend === 'declining') {
      insights.push({
        id: `progress_trend_${Date.now()}`,
        category: 'body_composition',
        priority: 'high',
        title: 'Je voortgang stagneert',
        message: 'Je lichaamssamenstelling toont een dalende trend. Het is tijd om je aanpak aan te passen.',
        actionItems: [
          'Evalueer je huidige training- en voedingsplan',
          'Overweeg een deload week voor herstel',
          'Varieer je trainingsroutine om plateaus te doorbreken'
        ],
        confidence: 85,
        generatedAt: new Date().toISOString(),
        icon: '📉',
        color: 'red'
      });
    }

    // Goal progress analysis
    const avgProgress = Object.values(profile.goalProgress).reduce((sum, progress) => sum + progress, 0) / Object.values(profile.goalProgress).length;
    
    if (avgProgress > 80) {
      insights.push({
        id: `goal_achievement_${Date.now()}`,
        category: 'body_composition',
        priority: 'low',
        title: 'Geweldige vooruitgang!',
        message: `Je bent gemiddeld ${Math.round(avgProgress)}% van je doelen bereikt. Blijf doorgaan!`,
        actionItems: [
          'Overweeg nieuwe, uitdagendere doelen te stellen',
          'Deel je succes met anderen voor extra motivatie',
          'Beloon jezelf voor je harde werk'
        ],
        confidence: 95,
        generatedAt: new Date().toISOString(),
        icon: '🎉',
        color: 'green'
      });
    }

    return insights;
  }

  private generateGeneralInsights(profile: UserDataProfile): AIInsight[] {
    const insights: AIInsight[] = [];

    // Beginner guidance
    if (profile.fitnessLevel === 'beginner') {
      insights.push({
        id: `beginner_guidance_${Date.now()}`,
        category: 'general',
        priority: 'medium',
        title: 'Welkom bij je fitnessreis!',
        message: 'Als beginner is het belangrijk om langzaam op te bouwen en je lichaam te laten wennen.',
        actionItems: [
          'Start met 2-3 trainingen per week',
          'Focus op het leren van de juiste technieken',
          'Luister naar je lichaam en neem voldoende rust'
        ],
        confidence: 88,
        generatedAt: new Date().toISOString(),
        icon: '🌱',
        color: 'green'
      });
    }

    // Motivational insight based on consistency
    const overallConsistency = (profile.trainingConsistency + profile.nutritionConsistency) / 2;
    if (overallConsistency > 85) {
      insights.push({
        id: `motivation_high_${Date.now()}`,
        category: 'general',
        priority: 'low',
        title: 'Je bent een voorbeeld van consistentie!',
        message: `Met ${Math.round(overallConsistency)}% consistentie ben je op de goede weg naar je doelen.`,
        actionItems: [
          'Blijf je huidige routine volhouden',
          'Inspireer anderen met je discipline',
          'Overweeg je doelen uit te breiden'
        ],
        confidence: 90,
        generatedAt: new Date().toISOString(),
        icon: '🏆',
        color: 'gold'
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
    const goals = bodyCompositionService.getGoals();
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
      
      latestMeasurements: latestMeasurement,
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