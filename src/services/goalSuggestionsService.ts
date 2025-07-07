import { aiInsightsService } from './aiInsightsService';
import { bodyCompositionService } from './bodyCompositionService';

export interface GoalSuggestion {
  id: string;
  category: 'training' | 'nutrition' | 'recovery' | 'body_composition';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  reasoning: string;
  actionSteps: string[];
  estimatedImpact: string;
  prerequisites?: string[];
  icon: string;
  color: string;
  confidence: number;
  createdAt: string;
}

export interface UserGoalPreferences {
  primaryFocus: string[];
  timeCommitment: 'low' | 'medium' | 'high';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  specificTargets: Record<string, number>;
  avoidanceList: string[];
  motivationStyle: 'gradual' | 'aggressive' | 'balanced';
}

class GoalSuggestionsService {
  private readonly SUGGESTIONS_STORAGE_KEY = 'teambenji_goal_suggestions';
  private readonly PREFERENCES_STORAGE_KEY = 'teambenji_goal_preferences';

  // Generate goal suggestions based on user data and AI insights
  generateGoalSuggestions(): GoalSuggestion[] {
    const preferences = this.getGoalPreferences();
    const insights = aiInsightsService.getStoredInsights();
    const bodyData = bodyCompositionService.getLatestMeasurement();
    
    const suggestions: GoalSuggestion[] = [];

    // Training goal suggestions
    suggestions.push(...this.generateTrainingGoals(preferences, insights));
    
    // Nutrition goal suggestions
    suggestions.push(...this.generateNutritionGoals(preferences, insights));
    
    // Recovery goal suggestions
    suggestions.push(...this.generateRecoveryGoals(preferences, insights));
    
    // Body composition goal suggestions
    suggestions.push(...this.generateBodyCompositionGoals(preferences, insights, bodyData));

    // Sort by priority and confidence
    const sortedSuggestions = suggestions.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    // Store suggestions
    this.saveSuggestions(sortedSuggestions);
    
    return sortedSuggestions;
  }

  private generateTrainingGoals(preferences: UserGoalPreferences, insights: any[]): GoalSuggestion[] {
    const goals: GoalSuggestion[] = [];
    
    // Weekly training frequency goal
    if (preferences.primaryFocus.includes('strength') || preferences.primaryFocus.includes('general')) {
      goals.push({
        id: `training_frequency_${Date.now()}`,
        category: 'training',
        title: 'Verhoog trainingsfrequentie',
        description: 'Verhoog je wekelijkse trainingen voor betere resultaten',
        targetValue: preferences.timeCommitment === 'high' ? 5 : preferences.timeCommitment === 'medium' ? 4 : 3,
        currentValue: 2.5,
        unit: 'sessies/week',
        timeframe: 'month',
        difficulty: preferences.experienceLevel === 'beginner' ? 'easy' : 'medium',
        priority: 'high',
        reasoning: 'Consistente training is de basis voor alle fitness doelen. Meer frequentie leidt tot betere resultaten.',
        actionSteps: [
          'Plan je trainingen van tevoren in je agenda',
          'Start met kortere sessies als tijd een probleem is',
          'Zoek een trainingspartner voor extra motivatie',
          'Begin met 1 extra sessie per week'
        ],
        estimatedImpact: 'Verwachte verbetering van 25-40% in kracht en conditie binnen 8 weken',
        icon: '💪',
        color: 'orange',
        confidence: 85,
        createdAt: new Date().toISOString()
      });
    }

    // Strength progression goal
    if (preferences.primaryFocus.includes('strength')) {
      goals.push({
        id: `strength_progression_${Date.now()}`,
        category: 'training',
        title: 'Verhoog compound lifts',
        description: 'Verbeter je prestaties in squat, deadlift en bench press',
        targetValue: 10,
        currentValue: 0,
        unit: '% verbetering',
        timeframe: 'quarter',
        difficulty: 'medium',
        priority: 'medium',
        reasoning: 'Compound oefeningen vormen de basis van kracht en spiermassa ontwikkeling.',
        actionSteps: [
          'Focus op perfecte techniek eerst',
          'Verhoog gewicht geleidelijk (2.5-5kg per week)',
          'Zorg voor voldoende rust tussen sets',
          'Track je progressie nauwkeurig'
        ],
        estimatedImpact: '10-15% kracht verbetering in 12 weken',
        prerequisites: ['Verhoog trainingsfrequentie eerst'],
        icon: '🏋️',
        color: 'red',
        confidence: 78,
        createdAt: new Date().toISOString()
      });
    }

    // Cardio endurance goal
    if (preferences.primaryFocus.includes('cardio') || preferences.primaryFocus.includes('endurance')) {
      goals.push({
        id: `cardio_endurance_${Date.now()}`,
        category: 'training',
        title: 'Verbeter cardiovasculaire conditie',
        description: 'Verhoog je uithoudingsvermogen en hartslag recovery',
        targetValue: 30,
        currentValue: 20,
        unit: 'minuten continuous',
        timeframe: 'month',
        difficulty: 'easy',
        priority: 'medium',
        reasoning: 'Goede cardiovasculaire conditie verbetert algemene gezondheid en recovery.',
        actionSteps: [
          'Start met 20 minuten matige intensiteit',
          'Verhoog elke week met 2-3 minuten',
          'Wissel tussen verschillende cardio vormen',
          'Monitor je hartslag tijdens training'
        ],
        estimatedImpact: 'Betere recovery en algemene conditie binnen 4 weken',
        icon: '🏃',
        color: 'blue',
        confidence: 82,
        createdAt: new Date().toISOString()
      });
    }

    return goals;
  }

  private generateNutritionGoals(preferences: UserGoalPreferences, insights: any[]): GoalSuggestion[] {
    const goals: GoalSuggestion[] = [];

    // Protein intake goal
    goals.push({
      id: `protein_intake_${Date.now()}`,
      category: 'nutrition',
      title: 'Verhoog eiwitinname',
      description: 'Bereik optimale eiwitinname voor spierbehoud en -groei',
      targetValue: 2.0,
      currentValue: 1.4,
      unit: 'g/kg lichaamsgewicht',
      timeframe: 'month',
      difficulty: 'easy',
      priority: 'high',
      reasoning: 'Adequate eiwitinname is essentieel voor spierherstel en -groei.',
      actionSteps: [
        'Voeg een eiwitbron toe aan elke maaltijd',
        'Overweeg een eiwitshake na training',
        'Kies voor magere vleessoorten, vis en peulvruchten',
        'Plan je maaltijden van tevoren'
      ],
      estimatedImpact: 'Betere recovery en spierbehoud binnen 2 weken',
      icon: '🥩',
      color: 'green',
      confidence: 90,
      createdAt: new Date().toISOString()
    });

    // Hydration goal
    goals.push({
      id: `hydration_${Date.now()}`,
      category: 'nutrition',
      title: 'Verbeter hydratatie',
      description: 'Drink voldoende water voor optimale prestaties',
      targetValue: 3.0,
      currentValue: 2.2,
      unit: 'liter/dag',
      timeframe: 'week',
      difficulty: 'easy',
      priority: 'medium',
      reasoning: 'Goede hydratatie verbetert prestaties, recovery en algemene gezondheid.',
      actionSteps: [
        'Start elke dag met een glas water',
        'Drink water voor, tijdens en na training',
        'Gebruik een water app voor tracking',
        'Zet water flessen op strategische plekken'
      ],
      estimatedImpact: 'Betere energie en focus binnen 1 week',
      icon: '💧',
      color: 'blue',
      confidence: 85,
      createdAt: new Date().toISOString()
    });

    // Meal prep goal
    if (preferences.timeCommitment === 'medium' || preferences.timeCommitment === 'high') {
      goals.push({
        id: `meal_prep_${Date.now()}`,
        category: 'nutrition',
        title: 'Implementeer meal prep',
        description: 'Bereid je maaltijden van tevoren voor betere consistentie',
        targetValue: 80,
        currentValue: 20,
        unit: '% van maaltijden',
        timeframe: 'month',
        difficulty: 'medium',
        priority: 'medium',
        reasoning: 'Meal prep zorgt voor consistentie en helpt bij het bereiken van voedingsdoelen.',
        actionSteps: [
          'Kies 1-2 dagen per week voor meal prep',
          'Start met het voorbereiden van 3 maaltijden',
          'Investeer in goede containers',
          'Plan je maaltijden een week vooruit'
        ],
        estimatedImpact: 'Betere voedingsconsistentie en tijdsbesparing',
        icon: '🍱',
        color: 'purple',
        confidence: 75,
        createdAt: new Date().toISOString()
      });
    }

    return goals;
  }

  private generateRecoveryGoals(preferences: UserGoalPreferences, insights: any[]): GoalSuggestion[] {
    const goals: GoalSuggestion[] = [];

    // Sleep duration goal
    goals.push({
      id: `sleep_duration_${Date.now()}`,
      category: 'recovery',
      title: 'Verbeter slaapkwaliteit',
      description: 'Bereik 7-9 uur kwaliteitsslaap per nacht',
      targetValue: 8,
      currentValue: 6.8,
      unit: 'uur/nacht',
      timeframe: 'month',
      difficulty: 'medium',
      priority: 'high',
      reasoning: 'Kwaliteitsslaap is cruciaal voor recovery, hormoonbalans en prestaties.',
      actionSteps: [
        'Creëer een consistente slaaprutine',
        'Ga elke avond op hetzelfde tijdstip naar bed',
        'Vermijd schermen 1 uur voor bedtijd',
        'Houd je slaapkamer koel en donker'
      ],
      estimatedImpact: 'Betere recovery en energie binnen 2 weken',
      icon: '😴',
      color: 'purple',
      confidence: 88,
      createdAt: new Date().toISOString()
    });

    // Stress management goal
    goals.push({
      id: `stress_management_${Date.now()}`,
      category: 'recovery',
      title: 'Implementeer stressmanagement',
      description: 'Voeg dagelijkse ontspanningstechnieken toe aan je routine',
      targetValue: 7,
      currentValue: 0,
      unit: 'dagen/week',
      timeframe: 'month',
      difficulty: 'easy',
      priority: 'medium',
      reasoning: 'Stressmanagement verbetert recovery en algemene gezondheid.',
      actionSteps: [
        'Begin met 5 minuten meditatie per dag',
        'Probeer ademhalingsoefeningen',
        'Plan bewuste ontspanningsmomenten',
        'Overweeg yoga of tai chi'
      ],
      estimatedImpact: 'Lagere stress en betere recovery binnen 3 weken',
      icon: '🧘',
      color: 'green',
      confidence: 80,
      createdAt: new Date().toISOString()
    });

    return goals;
  }

  private generateBodyCompositionGoals(preferences: UserGoalPreferences, insights: any[], bodyData: any): GoalSuggestion[] {
    const goals: GoalSuggestion[] = [];

    if (!bodyData) return goals;

    // Weight management goal
    if (preferences.specificTargets.weight) {
      const targetWeight = preferences.specificTargets.weight;
      const currentWeight = bodyData.weight;
      const weightDiff = targetWeight - currentWeight;
      
      goals.push({
        id: `weight_management_${Date.now()}`,
        category: 'body_composition',
        title: weightDiff > 0 ? 'Gezonde gewichtstoename' : 'Gezonde gewichtsafname',
        description: `Bereik je streefgewicht van ${targetWeight}kg op een gezonde manier`,
        targetValue: targetWeight,
        currentValue: currentWeight,
        unit: 'kg',
        timeframe: Math.abs(weightDiff) > 5 ? 'quarter' : 'month',
        difficulty: Math.abs(weightDiff) > 10 ? 'hard' : 'medium',
        priority: 'high',
        reasoning: 'Geleidelijke gewichtsverandering is duurzamer en gezonder.',
        actionSteps: [
          'Creëer een calorie deficit/surplus van 300-500 kcal',
          'Combineer voeding met training',
          'Monitor je voortgang wekelijks',
          'Pas je plan aan op basis van resultaten'
        ],
        estimatedImpact: `${Math.abs(weightDiff)}kg gewichtsverandering in ${Math.abs(weightDiff) > 5 ? '12' : '8'} weken`,
        icon: '⚖️',
        color: 'orange',
        confidence: 85,
        createdAt: new Date().toISOString()
      });
    }

    // Body fat percentage goal
    if (bodyData.bodyFatPercentage) {
      const currentBF = bodyData.bodyFatPercentage;
      const targetBF = currentBF > 15 ? currentBF - 3 : currentBF - 1;
      
      goals.push({
        id: `body_fat_${Date.now()}`,
        category: 'body_composition',
        title: 'Verminder vetpercentage',
        description: `Verlaag je vetpercentage van ${currentBF}% naar ${targetBF}%`,
        targetValue: targetBF,
        currentValue: currentBF,
        unit: '%',
        timeframe: 'quarter',
        difficulty: 'medium',
        priority: 'medium',
        reasoning: 'Lager vetpercentage verbetert gezondheid en lichaamssamenstellling.',
        actionSteps: [
          'Combineer kracht- en cardiotraining',
          'Creëer een matig calorie deficit',
          'Focus op eiwitrijke voeding',
          'Monitor voortgang met metingen'
        ],
        estimatedImpact: `${currentBF - targetBF}% vetpercentage verlies in 12 weken`,
        prerequisites: ['Verhoog trainingsfrequentie', 'Verhoog eiwitinname'],
        icon: '📉',
        color: 'red',
        confidence: 75,
        createdAt: new Date().toISOString()
      });
    }

    return goals;
  }

  // Get user goal preferences
  private getGoalPreferences(): UserGoalPreferences {
    const stored = localStorage.getItem(this.PREFERENCES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default preferences
    return {
      primaryFocus: ['general', 'strength'],
      timeCommitment: 'medium',
      experienceLevel: 'intermediate',
      specificTargets: {
        weight: 75,
        bodyFatPercentage: 12
      },
      avoidanceList: [],
      motivationStyle: 'balanced'
    };
  }

  // Save suggestions to storage
  private saveSuggestions(suggestions: GoalSuggestion[]): void {
    try {
      localStorage.setItem(this.SUGGESTIONS_STORAGE_KEY, JSON.stringify(suggestions));
    } catch (error) {
      console.error('Error saving goal suggestions:', error);
    }
  }

  // Get stored suggestions
  getStoredSuggestions(): GoalSuggestion[] {
    try {
      const stored = localStorage.getItem(this.SUGGESTIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading goal suggestions:', error);
      return [];
    }
  }

  // Get suggestions by category
  getSuggestionsByCategory(category: GoalSuggestion['category']): GoalSuggestion[] {
    return this.getStoredSuggestions().filter(suggestion => suggestion.category === category);
  }

  // Get suggestions by priority
  getSuggestionsByPriority(priority: GoalSuggestion['priority']): GoalSuggestion[] {
    return this.getStoredSuggestions().filter(suggestion => suggestion.priority === priority);
  }

  // Accept a goal suggestion (convert to actual goal)
  acceptGoalSuggestion(suggestionId: string): void {
    const suggestions = this.getStoredSuggestions();
    const suggestion = suggestions.find(s => s.id === suggestionId);
    
    if (suggestion) {
      // Here you would typically save to a goals service
      console.log('Accepting goal suggestion:', suggestion);
      
      // Remove from suggestions
      const updatedSuggestions = suggestions.filter(s => s.id !== suggestionId);
      this.saveSuggestions(updatedSuggestions);
    }
  }

  // Dismiss a goal suggestion
  dismissGoalSuggestion(suggestionId: string): void {
    const suggestions = this.getStoredSuggestions();
    const updatedSuggestions = suggestions.filter(s => s.id !== suggestionId);
    this.saveSuggestions(updatedSuggestions);
  }

  // Update goal preferences
  updateGoalPreferences(preferences: Partial<UserGoalPreferences>): void {
    const current = this.getGoalPreferences();
    const updated = { ...current, ...preferences };
    
    try {
      localStorage.setItem(this.PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating goal preferences:', error);
    }
  }
}

export const goalSuggestionsService = new GoalSuggestionsService(); 