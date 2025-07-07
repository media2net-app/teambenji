export interface SleepData {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in hours
  efficiency: number; // percentage
  quality: number; // 0-100 score
  stages: {
    awake: number; // minutes
    light: number; // minutes
    deep: number; // minutes
    rem: number; // minutes
  };
  restlessness: number; // 0-100, lower is better
  temperature: number; // body temperature variation
  heartRate: {
    resting: number;
    average: number;
    lowest: number;
  };
  hrv: number; // heart rate variability in ms
  respiratoryRate: number; // breaths per minute
  oxygenSaturation: number; // SpO2 percentage
  createdAt: string;
  updatedAt: string;
  source: 'oura' | 'whoop' | 'manual' | 'apple_health' | 'google_fit';
}

export interface RecoveryMetrics {
  id: string;
  date: string;
  readinessScore: number; // 0-100
  recoveryScore: number; // 0-100
  strain: number; // 0-21 (WHOOP scale)
  hrv: {
    value: number;
    baseline: number;
    status: 'poor' | 'fair' | 'good' | 'excellent';
  };
  restingHeartRate: {
    value: number;
    baseline: number;
    status: 'poor' | 'fair' | 'good' | 'excellent';
  };
  stressLevel: number; // 0-100
  energyLevel: number; // 0-100
  mood: 'very_poor' | 'poor' | 'fair' | 'good' | 'excellent';
  bodyBattery: number; // 0-100 (Garmin-style)
  temperature: {
    deviation: number; // from baseline
    status: 'low' | 'normal' | 'elevated';
  };
  createdAt: string;
  updatedAt: string;
  source: 'oura' | 'whoop' | 'manual' | 'apple_health' | 'google_fit';
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'oura' | 'whoop' | 'apple_watch' | 'garmin' | 'fitbit' | 'other';
  model: string;
  batteryLevel?: number;
  lastSync: string;
  isConnected: boolean;
  syncEnabled: boolean;
  permissions: {
    sleep: boolean;
    heartRate: boolean;
    activity: boolean;
    recovery: boolean;
  };
  settings: {
    autoSync: boolean;
    notificationsEnabled: boolean;
    dataRetention: number; // days
  };
}

export interface RecoveryRecommendation {
  id: string;
  type: 'sleep' | 'activity' | 'stress' | 'nutrition' | 'hydration' | 'recovery';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reasoning: string;
  actionItems: string[];
  expectedImpact: string;
  timeframe: string;
  confidence: number; // 0-100
  icon: string;
  color: string;
  createdAt: string;
  expiresAt?: string;
}

class RecoveryService {
  private readonly SLEEP_DATA_KEY = 'teambenji_sleep_data';
  private readonly RECOVERY_METRICS_KEY = 'teambenji_recovery_metrics';
  private readonly WEARABLE_DEVICES_KEY = 'teambenji_wearable_devices';
  private readonly RECOMMENDATIONS_KEY = 'teambenji_recovery_recommendations';

  // Sleep Data Management
  getAllSleepData(): SleepData[] {
    try {
      const data = localStorage.getItem(this.SLEEP_DATA_KEY);
      return data ? JSON.parse(data) : this.generateInitialSleepData();
    } catch (error) {
      console.error('Error loading sleep data:', error);
      return this.generateInitialSleepData();
    }
  }

  getLatestSleepData(): SleepData | null {
    const allData = this.getAllSleepData();
    if (allData.length === 0) return null;
    
    return allData.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
  }

  saveSleepData(sleepData: Omit<SleepData, 'id' | 'createdAt' | 'updatedAt'>): SleepData {
    const allData = this.getAllSleepData();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newSleepData: SleepData = {
      ...sleepData,
      id,
      createdAt: now,
      updatedAt: now
    };

    allData.push(newSleepData);
    this.saveSleepDataToStorage(allData);
    
    return newSleepData;
  }

  // Recovery Metrics Management
  getAllRecoveryMetrics(): RecoveryMetrics[] {
    try {
      const data = localStorage.getItem(this.RECOVERY_METRICS_KEY);
      return data ? JSON.parse(data) : this.generateInitialRecoveryMetrics();
    } catch (error) {
      console.error('Error loading recovery metrics:', error);
      return this.generateInitialRecoveryMetrics();
    }
  }

  getLatestRecoveryMetrics(): RecoveryMetrics | null {
    const allData = this.getAllRecoveryMetrics();
    if (allData.length === 0) return null;
    
    return allData.reduce((latest, current) => 
      new Date(current.date) > new Date(latest.date) ? current : latest
    );
  }

  saveRecoveryMetrics(metrics: Omit<RecoveryMetrics, 'id' | 'createdAt' | 'updatedAt'>): RecoveryMetrics {
    const allData = this.getAllRecoveryMetrics();
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newMetrics: RecoveryMetrics = {
      ...metrics,
      id,
      createdAt: now,
      updatedAt: now
    };

    allData.push(newMetrics);
    this.saveRecoveryMetricsToStorage(allData);
    
    return newMetrics;
  }

  // Wearable Device Management
  getWearableDevices(): WearableDevice[] {
    try {
      const data = localStorage.getItem(this.WEARABLE_DEVICES_KEY);
      return data ? JSON.parse(data) : this.generateInitialDevices();
    } catch (error) {
      console.error('Error loading wearable devices:', error);
      return this.generateInitialDevices();
    }
  }

  connectDevice(deviceInfo: Omit<WearableDevice, 'id' | 'lastSync' | 'isConnected'>): WearableDevice {
    const devices = this.getWearableDevices();
    const id = this.generateId();
    
    const newDevice: WearableDevice = {
      ...deviceInfo,
      id,
      lastSync: new Date().toISOString(),
      isConnected: true
    };

    devices.push(newDevice);
    this.saveWearableDevicesToStorage(devices);
    
    return newDevice;
  }

  disconnectDevice(deviceId: string): boolean {
    const devices = this.getWearableDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);
    
    if (deviceIndex === -1) return false;
    
    devices[deviceIndex].isConnected = false;
    devices[deviceIndex].syncEnabled = false;
    
    this.saveWearableDevicesToStorage(devices);
    return true;
  }

  syncDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate sync delay
      setTimeout(() => {
        const devices = this.getWearableDevices();
        const deviceIndex = devices.findIndex(d => d.id === deviceId);
        
        if (deviceIndex === -1) {
          resolve(false);
          return;
        }
        
        devices[deviceIndex].lastSync = new Date().toISOString();
        this.saveWearableDevicesToStorage(devices);
        
        // Generate new data after sync
        this.generateNewSyncData(devices[deviceIndex]);
        
        resolve(true);
      }, 2000);
    });
  }

  // Recovery Recommendations
  generateRecoveryRecommendations(): RecoveryRecommendation[] {
    const latestSleep = this.getLatestSleepData();
    const latestRecovery = this.getLatestRecoveryMetrics();
    const recommendations: RecoveryRecommendation[] = [];

    if (latestSleep) {
      recommendations.push(...this.generateSleepRecommendations(latestSleep));
    }

    if (latestRecovery) {
      recommendations.push(...this.generateRecoveryMetricsRecommendations(latestRecovery));
    }

    recommendations.push(...this.generateGeneralRecoveryRecommendations());

    // Sort by priority and confidence
    const sortedRecommendations = recommendations.sort((a, b) => {
      const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    this.saveRecommendationsToStorage(sortedRecommendations);
    return sortedRecommendations;
  }

  getStoredRecommendations(): RecoveryRecommendation[] {
    try {
      const data = localStorage.getItem(this.RECOMMENDATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading recovery recommendations:', error);
      return [];
    }
  }

  // Analytics and Insights
  getSleepTrends(days: number = 30): {
    averageDuration: number;
    averageQuality: number;
    averageEfficiency: number;
    trendData: Array<{ date: string; duration: number; quality: number; efficiency: number }>;
  } {
    const sleepData = this.getAllSleepData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = sleepData.filter(data => 
      new Date(data.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (recentData.length === 0) {
      return {
        averageDuration: 0,
        averageQuality: 0,
        averageEfficiency: 0,
        trendData: []
      };
    }

    const averageDuration = recentData.reduce((sum, data) => sum + data.duration, 0) / recentData.length;
    const averageQuality = recentData.reduce((sum, data) => sum + data.quality, 0) / recentData.length;
    const averageEfficiency = recentData.reduce((sum, data) => sum + data.efficiency, 0) / recentData.length;

    const trendData = recentData.map(data => ({
      date: data.date,
      duration: data.duration,
      quality: data.quality,
      efficiency: data.efficiency
    }));

    return {
      averageDuration,
      averageQuality,
      averageEfficiency,
      trendData
    };
  }

  getRecoveryTrends(days: number = 30): {
    averageReadiness: number;
    averageRecovery: number;
    averageStrain: number;
    trendData: Array<{ date: string; readiness: number; recovery: number; strain: number }>;
  } {
    const recoveryData = this.getAllRecoveryMetrics();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentData = recoveryData.filter(data => 
      new Date(data.date) >= cutoffDate
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (recentData.length === 0) {
      return {
        averageReadiness: 0,
        averageRecovery: 0,
        averageStrain: 0,
        trendData: []
      };
    }

    const averageReadiness = recentData.reduce((sum, data) => sum + data.readinessScore, 0) / recentData.length;
    const averageRecovery = recentData.reduce((sum, data) => sum + data.recoveryScore, 0) / recentData.length;
    const averageStrain = recentData.reduce((sum, data) => sum + data.strain, 0) / recentData.length;

    const trendData = recentData.map(data => ({
      date: data.date,
      readiness: data.readinessScore,
      recovery: data.recoveryScore,
      strain: data.strain
    }));

    return {
      averageReadiness,
      averageRecovery,
      averageStrain,
      trendData
    };
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateInitialSleepData(): SleepData[] {
    const data: SleepData[] = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const bedtime = new Date(date);
      bedtime.setHours(22 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      
      const wakeTime = new Date(date);
      wakeTime.setDate(wakeTime.getDate() + 1);
      wakeTime.setHours(6 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
      
      const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
      const efficiency = 75 + Math.random() * 20;
      const quality = 65 + Math.random() * 30;
      
      const totalMinutes = duration * 60;
      const awakeMinutes = totalMinutes * (1 - efficiency / 100);
      const sleepMinutes = totalMinutes - awakeMinutes;
      
      data.push({
        id: this.generateId(),
        date: date.toISOString().split('T')[0],
        bedtime: bedtime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        duration,
        efficiency,
        quality,
        stages: {
          awake: Math.round(awakeMinutes),
          light: Math.round(sleepMinutes * 0.5),
          deep: Math.round(sleepMinutes * 0.25),
          rem: Math.round(sleepMinutes * 0.25)
        },
        restlessness: Math.round(Math.random() * 30),
        temperature: -0.5 + Math.random(),
        heartRate: {
          resting: 55 + Math.round(Math.random() * 15),
          average: 60 + Math.round(Math.random() * 15),
          lowest: 50 + Math.round(Math.random() * 10)
        },
        hrv: 35 + Math.round(Math.random() * 20),
        respiratoryRate: 12 + Math.round(Math.random() * 6),
        oxygenSaturation: 95 + Math.round(Math.random() * 4),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: Math.random() > 0.5 ? 'oura' : 'whoop'
      });
    }
    
    this.saveSleepDataToStorage(data);
    return data;
  }

  private generateInitialRecoveryMetrics(): RecoveryMetrics[] {
    const data: RecoveryMetrics[] = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const readinessScore = 60 + Math.round(Math.random() * 35);
      const recoveryScore = 65 + Math.round(Math.random() * 30);
      const strain = 8 + Math.random() * 8;
      
      const hrvValue = 35 + Math.round(Math.random() * 20);
      const hrvBaseline = 38;
      const rhrValue = 55 + Math.round(Math.random() * 15);
      const rhrBaseline = 62;
      
      data.push({
        id: this.generateId(),
        date: date.toISOString().split('T')[0],
        readinessScore,
        recoveryScore,
        strain,
        hrv: {
          value: hrvValue,
          baseline: hrvBaseline,
          status: hrvValue > hrvBaseline + 5 ? 'excellent' : 
                  hrvValue > hrvBaseline ? 'good' : 
                  hrvValue > hrvBaseline - 5 ? 'fair' : 'poor'
        },
        restingHeartRate: {
          value: rhrValue,
          baseline: rhrBaseline,
          status: rhrValue < rhrBaseline - 5 ? 'excellent' : 
                  rhrValue < rhrBaseline ? 'good' : 
                  rhrValue < rhrBaseline + 5 ? 'fair' : 'poor'
        },
        stressLevel: Math.round(Math.random() * 60),
        energyLevel: 40 + Math.round(Math.random() * 50),
        mood: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)] as any,
        bodyBattery: 30 + Math.round(Math.random() * 60),
        temperature: {
          deviation: -1 + Math.random() * 2,
          status: Math.random() > 0.8 ? 'elevated' : Math.random() > 0.1 ? 'normal' : 'low'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: Math.random() > 0.5 ? 'oura' : 'whoop'
      });
    }
    
    this.saveRecoveryMetricsToStorage(data);
    return data;
  }

  private generateInitialDevices(): WearableDevice[] {
    const devices: WearableDevice[] = [
      {
        id: this.generateId(),
        name: 'Oura Ring Gen 3',
        type: 'oura',
        model: 'Generation 3',
        batteryLevel: 85,
        lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        isConnected: true,
        syncEnabled: true,
        permissions: {
          sleep: true,
          heartRate: true,
          activity: true,
          recovery: true
        },
        settings: {
          autoSync: true,
          notificationsEnabled: true,
          dataRetention: 90
        }
      },
      {
        id: this.generateId(),
        name: 'WHOOP 4.0',
        type: 'whoop',
        model: '4.0',
        batteryLevel: 62,
        lastSync: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        isConnected: false,
        syncEnabled: false,
        permissions: {
          sleep: true,
          heartRate: true,
          activity: true,
          recovery: true
        },
        settings: {
          autoSync: false,
          notificationsEnabled: false,
          dataRetention: 30
        }
      }
    ];
    
    this.saveWearableDevicesToStorage(devices);
    return devices;
  }

  private generateNewSyncData(device: WearableDevice): void {
    // Generate new sleep data
    const today = new Date().toISOString().split('T')[0];
    const existingSleepData = this.getAllSleepData();
    
    if (!existingSleepData.some(data => data.date === today)) {
      const bedtime = new Date();
      bedtime.setHours(22 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60));
      bedtime.setDate(bedtime.getDate() - 1);
      
      const wakeTime = new Date();
      wakeTime.setHours(6 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
      
      const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
      const efficiency = 75 + Math.random() * 20;
      const quality = 65 + Math.random() * 30;
      
      const totalMinutes = duration * 60;
      const awakeMinutes = totalMinutes * (1 - efficiency / 100);
      const sleepMinutes = totalMinutes - awakeMinutes;
      
      this.saveSleepData({
        date: today,
        bedtime: bedtime.toISOString(),
        wakeTime: wakeTime.toISOString(),
        duration,
        efficiency,
        quality,
        stages: {
          awake: Math.round(awakeMinutes),
          light: Math.round(sleepMinutes * 0.5),
          deep: Math.round(sleepMinutes * 0.25),
          rem: Math.round(sleepMinutes * 0.25)
        },
        restlessness: Math.round(Math.random() * 30),
        temperature: -0.5 + Math.random(),
        heartRate: {
          resting: 55 + Math.round(Math.random() * 15),
          average: 60 + Math.round(Math.random() * 15),
          lowest: 50 + Math.round(Math.random() * 10)
        },
        hrv: 35 + Math.round(Math.random() * 20),
        respiratoryRate: 12 + Math.round(Math.random() * 6),
        oxygenSaturation: 95 + Math.round(Math.random() * 4),
        source: device.type === 'apple_watch' ? 'apple_health' : device.type as 'oura' | 'whoop' | 'manual' | 'apple_health' | 'google_fit'
      });
    }

    // Generate new recovery metrics
    const existingRecoveryData = this.getAllRecoveryMetrics();
    
    if (!existingRecoveryData.some(data => data.date === today)) {
      const readinessScore = 60 + Math.round(Math.random() * 35);
      const recoveryScore = 65 + Math.round(Math.random() * 30);
      const strain = 8 + Math.random() * 8;
      
      const hrvValue = 35 + Math.round(Math.random() * 20);
      const hrvBaseline = 38;
      const rhrValue = 55 + Math.round(Math.random() * 15);
      const rhrBaseline = 62;
      
      this.saveRecoveryMetrics({
        date: today,
        readinessScore,
        recoveryScore,
        strain,
        hrv: {
          value: hrvValue,
          baseline: hrvBaseline,
          status: hrvValue > hrvBaseline + 5 ? 'excellent' : 
                  hrvValue > hrvBaseline ? 'good' : 
                  hrvValue > hrvBaseline - 5 ? 'fair' : 'poor'
        },
        restingHeartRate: {
          value: rhrValue,
          baseline: rhrBaseline,
          status: rhrValue < rhrBaseline - 5 ? 'excellent' : 
                  rhrValue < rhrBaseline ? 'good' : 
                  rhrValue < rhrBaseline + 5 ? 'fair' : 'poor'
        },
        stressLevel: Math.round(Math.random() * 60),
        energyLevel: 40 + Math.round(Math.random() * 50),
        mood: ['poor', 'fair', 'good', 'excellent'][Math.floor(Math.random() * 4)] as any,
        bodyBattery: 30 + Math.round(Math.random() * 60),
        temperature: {
          deviation: -1 + Math.random() * 2,
          status: Math.random() > 0.8 ? 'elevated' : Math.random() > 0.1 ? 'normal' : 'low'
        },
        source: device.type === 'apple_watch' ? 'apple_health' : device.type as 'oura' | 'whoop' | 'manual' | 'apple_health' | 'google_fit'
      });
    }
  }

  private generateSleepRecommendations(sleepData: SleepData): RecoveryRecommendation[] {
    const recommendations: RecoveryRecommendation[] = [];

    if (sleepData.duration < 7) {
      recommendations.push({
        id: this.generateId(),
        type: 'sleep',
        priority: 'high',
        title: 'Verhoog je slaaptijd',
        description: `Je sliep ${sleepData.duration.toFixed(1)} uur. Streef naar 7-9 uur per nacht.`,
        reasoning: 'Onvoldoende slaap vermindert recovery en prestaties.',
        actionItems: [
          'Ga 30 minuten eerder naar bed',
          'Creëer een consistente slaaprutine',
          'Vermijd cafeïne na 14:00'
        ],
        expectedImpact: 'Betere recovery en energie binnen 1 week',
        timeframe: '1-2 weken',
        confidence: 90,
        icon: '😴',
        color: 'purple',
        createdAt: new Date().toISOString()
      });
    }

    if (sleepData.efficiency < 80) {
      recommendations.push({
        id: this.generateId(),
        type: 'sleep',
        priority: 'medium',
        title: 'Verbeter slaapefficiëntie',
        description: `Je slaapefficiëntie is ${sleepData.efficiency.toFixed(0)}%. Optimaal is >85%.`,
        reasoning: 'Lage slaapefficiëntie betekent veel tijd wakker in bed.',
        actionItems: [
          'Houd je slaapkamer koel (16-19°C)',
          'Gebruik blackout gordijnen',
          'Overweeg een slaapmasker of oordopjes'
        ],
        expectedImpact: 'Diepere, meer herstellende slaap',
        timeframe: '2-3 weken',
        confidence: 80,
        icon: '🛏️',
        color: 'blue',
        createdAt: new Date().toISOString()
      });
    }

    return recommendations;
  }

  private generateRecoveryMetricsRecommendations(recoveryData: RecoveryMetrics): RecoveryRecommendation[] {
    const recommendations: RecoveryRecommendation[] = [];

    if (recoveryData.readinessScore < 70) {
      recommendations.push({
        id: this.generateId(),
        type: 'recovery',
        priority: 'high',
        title: 'Focus op herstel',
        description: `Je readiness score is ${recoveryData.readinessScore}%. Overweeg een lichtere trainingsdag.`,
        reasoning: 'Lage readiness score suggereert dat je lichaam meer herstel nodig heeft.',
        actionItems: [
          'Kies voor lichte beweging of yoga',
          'Zorg voor extra hydratatie',
          'Plan een vroege bedtijd',
          'Overweeg een massage of stretching'
        ],
        expectedImpact: 'Betere recovery en voorkoming van overtraining',
        timeframe: '1-2 dagen',
        confidence: 85,
        icon: '🔋',
        color: 'orange',
        createdAt: new Date().toISOString()
      });
    }

    if (recoveryData.stressLevel > 70) {
      recommendations.push({
        id: this.generateId(),
        type: 'stress',
        priority: 'high',
        title: 'Beheer stress niveau',
        description: `Je stress niveau is ${recoveryData.stressLevel}%. Hoge stress belemmert recovery.`,
        reasoning: 'Chronische stress verhoogt cortisol en verstoort recovery.',
        actionItems: [
          'Probeer 10 minuten meditatie',
          'Doe ademhalingsoefeningen',
          'Plan bewuste ontspanningsmomenten',
          'Overweeg een wandeling in de natuur'
        ],
        expectedImpact: 'Lagere stress en betere recovery',
        timeframe: '1 week',
        confidence: 75,
        icon: '🧘',
        color: 'green',
        createdAt: new Date().toISOString()
      });
    }

    return recommendations;
  }

  private generateGeneralRecoveryRecommendations(): RecoveryRecommendation[] {
    const recommendations: RecoveryRecommendation[] = [];

    // Hydration recommendation
    recommendations.push({
      id: this.generateId(),
      type: 'hydration',
      priority: 'medium',
      title: 'Optimaliseer hydratatie',
      description: 'Goede hydratatie is essentieel voor optimale recovery.',
      reasoning: 'Dehydratatie verstoort alle recovery processen.',
      actionItems: [
        'Drink 2-3 liter water per dag',
        'Start elke dag met een glas water',
        'Monitor je urine kleur',
        'Drink extra na het sporten'
      ],
      expectedImpact: 'Betere recovery en energie',
      timeframe: 'Direct',
      confidence: 90,
      icon: '💧',
      color: 'blue',
      createdAt: new Date().toISOString()
    });

    return recommendations;
  }

  private saveSleepDataToStorage(data: SleepData[]): void {
    try {
      localStorage.setItem(this.SLEEP_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  }

  private saveRecoveryMetricsToStorage(data: RecoveryMetrics[]): void {
    try {
      localStorage.setItem(this.RECOVERY_METRICS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving recovery metrics:', error);
    }
  }

  private saveWearableDevicesToStorage(devices: WearableDevice[]): void {
    try {
      localStorage.setItem(this.WEARABLE_DEVICES_KEY, JSON.stringify(devices));
    } catch (error) {
      console.error('Error saving wearable devices:', error);
    }
  }

  private saveRecommendationsToStorage(recommendations: RecoveryRecommendation[]): void {
    try {
      localStorage.setItem(this.RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
    } catch (error) {
      console.error('Error saving recovery recommendations:', error);
    }
  }
}

export const recoveryService = new RecoveryService(); 