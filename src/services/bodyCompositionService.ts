import type { BodyMetrics } from '../components/MetricsLogger';

export interface BodyCompositionData {
  id: string;
  userId: string;
  metrics: BodyMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface BodyCompositionGoals {
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waistCircumference?: number;
  visceralFat?: number;
  bmr?: number;
  targetDate?: string;
}

class BodyCompositionService {
  private readonly STORAGE_KEY = 'teambenji_body_composition';
  private readonly GOALS_KEY = 'teambenji_body_goals';

  // Get all measurements
  getAllMeasurements(): BodyCompositionData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading measurements:', error);
      return [];
    }
  }

  // Get measurements for a specific date range
  getMeasurementsByDateRange(startDate: string, endDate: string): BodyCompositionData[] {
    const measurements = this.getAllMeasurements();
    return measurements.filter(measurement => 
      measurement.metrics.date >= startDate && measurement.metrics.date <= endDate
    );
  }

  // Get latest measurement
  getLatestMeasurement(): BodyCompositionData | null {
    const measurements = this.getAllMeasurements();
    if (measurements.length === 0) return null;
    
    return measurements.reduce((latest, current) => 
      new Date(current.metrics.date) > new Date(latest.metrics.date) ? current : latest
    );
  }

  // Save measurement
  saveMeasurement(metrics: BodyMetrics): BodyCompositionData {
    const measurements = this.getAllMeasurements();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newMeasurement: BodyCompositionData = {
      id,
      userId: 'current_user', // In a real app, this would be the actual user ID
      metrics,
      createdAt: now,
      updatedAt: now
    };

    measurements.push(newMeasurement);
    this.saveMeasurements(measurements);
    
    return newMeasurement;
  }

  // Update measurement
  updateMeasurement(id: string, metrics: BodyMetrics): BodyCompositionData | null {
    const measurements = this.getAllMeasurements();
    const index = measurements.findIndex(m => m.id === id);
    
    if (index === -1) return null;
    
    measurements[index] = {
      ...measurements[index],
      metrics,
      updatedAt: new Date().toISOString()
    };
    
    this.saveMeasurements(measurements);
    return measurements[index];
  }

  // Delete measurement
  deleteMeasurement(id: string): boolean {
    const measurements = this.getAllMeasurements();
    const filteredMeasurements = measurements.filter(m => m.id !== id);
    
    if (filteredMeasurements.length === measurements.length) {
      return false; // No measurement was found
    }
    
    this.saveMeasurements(filteredMeasurements);
    return true;
  }

  // Get goals
  getGoals(): BodyCompositionGoals {
    try {
      const data = localStorage.getItem(this.GOALS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading goals:', error);
      return {};
    }
  }

  // Save goals
  saveGoals(goals: BodyCompositionGoals): void {
    try {
      localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  }

  // Calculate progress towards goals
  calculateProgress(): Record<string, number> {
    const goals = this.getGoals();
    const latest = this.getLatestMeasurement();
    
    if (!latest) return {};
    
    const progress: Record<string, number> = {};
    
    Object.entries(goals).forEach(([key, goalValue]) => {
      if (key === 'targetDate' || !goalValue) return;
      
      const currentValue = latest.metrics[key as keyof BodyMetrics] as number;
      if (!currentValue) return;
      
      // Calculate progress percentage based on goal direction
      if (key === 'weight' || key === 'bodyFat' || key === 'waistCircumference' || key === 'visceralFat') {
        // For these metrics, lower is better
        const startValue = this.getStartingValue(key as keyof BodyMetrics);
        if (startValue) {
          const totalChange = startValue - goalValue;
          const currentChange = startValue - currentValue;
          progress[key] = Math.max(0, Math.min(100, (currentChange / totalChange) * 100));
        }
      } else {
        // For these metrics, higher is better
        const startValue = this.getStartingValue(key as keyof BodyMetrics);
        if (startValue) {
          const totalChange = goalValue - startValue;
          const currentChange = currentValue - startValue;
          progress[key] = Math.max(0, Math.min(100, (currentChange / totalChange) * 100));
        }
      }
    });
    
    return progress;
  }

  // Get starting value for progress calculation
  private getStartingValue(metric: keyof BodyMetrics): number | null {
    const measurements = this.getAllMeasurements();
    if (measurements.length === 0) return null;
    
    // Get the oldest measurement
    const oldest = measurements.reduce((oldest, current) => 
      new Date(current.metrics.date) < new Date(oldest.metrics.date) ? current : oldest
    );
    
    return oldest.metrics[metric] as number || null;
  }

  // Export data
  exportData(): string {
    const measurements = this.getAllMeasurements();
    const goals = this.getGoals();
    
    const exportData = {
      measurements,
      goals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.measurements || !Array.isArray(importData.measurements)) {
        throw new Error('Invalid data format');
      }
      
      // Validate data structure
      importData.measurements.forEach((measurement: any) => {
        if (!measurement.id || !measurement.metrics || !measurement.metrics.date) {
          throw new Error('Invalid measurement data');
        }
      });
      
      // Save imported data
      this.saveMeasurements(importData.measurements);
      if (importData.goals) {
        this.saveGoals(importData.goals);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Get statistics
  getStatistics(): {
    totalMeasurements: number;
    firstMeasurement: string | null;
    lastMeasurement: string | null;
    averageWeight: number | null;
    weightChange: number | null;
    bodyFatChange: number | null;
    muscleMassChange: number | null;
  } {
    const measurements = this.getAllMeasurements();
    
    if (measurements.length === 0) {
      return {
        totalMeasurements: 0,
        firstMeasurement: null,
        lastMeasurement: null,
        averageWeight: null,
        weightChange: null,
        bodyFatChange: null,
        muscleMassChange: null
      };
    }
    
    const sorted = measurements.sort((a, b) => 
      new Date(a.metrics.date).getTime() - new Date(b.metrics.date).getTime()
    );
    
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    const weights = measurements
      .map(m => m.metrics.weight)
      .filter((w): w is number => w !== undefined);
    
    const averageWeight = weights.length > 0 
      ? weights.reduce((sum, w) => sum + w, 0) / weights.length 
      : null;
    
    const weightChange = first.metrics.weight && last.metrics.weight
      ? last.metrics.weight - first.metrics.weight
      : null;
    
    const bodyFatChange = first.metrics.bodyFat && last.metrics.bodyFat
      ? last.metrics.bodyFat - first.metrics.bodyFat
      : null;
    
    const muscleMassChange = first.metrics.muscleMass && last.metrics.muscleMass
      ? last.metrics.muscleMass - first.metrics.muscleMass
      : null;
    
    return {
      totalMeasurements: measurements.length,
      firstMeasurement: first.metrics.date,
      lastMeasurement: last.metrics.date,
      averageWeight,
      weightChange,
      bodyFatChange,
      muscleMassChange
    };
  }

  // Private helper methods
  private saveMeasurements(measurements: BodyCompositionData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(measurements));
    } catch (error) {
      console.error('Error saving measurements:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const bodyCompositionService = new BodyCompositionService(); 