import { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import MetricsLogger, { type BodyMetrics } from '../components/MetricsLogger';
import PhotoUpload from '../components/PhotoUpload';
import GoalsManager from '../components/GoalsManager';
import GoalSuggestions from '../components/GoalSuggestions';
import { bodyCompositionService, type BodyCompositionData } from '../services/bodyCompositionService';

export default function BodyCompositionPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMetricsLogger, setShowMetricsLogger] = useState(false);
  const [showGoalsManager, setShowGoalsManager] = useState(false);
  const [measurements, setMeasurements] = useState<BodyCompositionData[]>([]);
  const [editingMeasurement, setEditingMeasurement] = useState<BodyCompositionData | null>(null);

  useEffect(() => {
    loadMeasurements();
  }, []);

  const loadMeasurements = () => {
    const data = bodyCompositionService.getAllMeasurements();
    setMeasurements(data);
  };

  const handleSaveMeasurement = (metrics: BodyMetrics) => {
    if (editingMeasurement) {
      bodyCompositionService.updateMeasurement(editingMeasurement.id, metrics);
      setEditingMeasurement(null);
    } else {
      bodyCompositionService.saveMeasurement(metrics);
    }
    loadMeasurements();
    setShowMetricsLogger(false);
  };

  const handleDeleteMeasurement = (id: string) => {
    if (confirm('Weet je zeker dat je deze meting wilt verwijderen?')) {
      bodyCompositionService.deleteMeasurement(id);
      loadMeasurements();
    }
  };

  const handleEditMeasurement = (measurement: BodyCompositionData) => {
    setEditingMeasurement(measurement);
    setShowMetricsLogger(true);
  };

  const handleCancelLogger = () => {
    setShowMetricsLogger(false);
    setEditingMeasurement(null);
  };

  const handleGoalsSaved = () => {
    setShowGoalsManager(false);
    loadMeasurements(); // Reload to update progress calculations
  };

  const handleCancelGoals = () => {
    setShowGoalsManager(false);
  };

  // Get latest measurement for current stats
  const latestMeasurement = measurements.length > 0 
    ? measurements.reduce((latest, current) => 
        new Date(current.metrics.date) > new Date(latest.metrics.date) ? current : latest
      )
    : null;

  // Current measurements - use real data or defaults
  const goals = bodyCompositionService.getGoals();
  const currentStats = latestMeasurement ? {
    weight: { 
      value: latestMeasurement.metrics.weight || 0, 
      change: 0, // TODO: Calculate change from previous measurement
      unit: 'kg', 
      goal: goals.weight || 75.0 
    },
    bodyFat: { 
      value: latestMeasurement.metrics.bodyFat || 0, 
      change: 0, 
      unit: '%', 
      goal: goals.bodyFat || 12.0 
    },
    muscleMass: { 
      value: latestMeasurement.metrics.muscleMass || 0, 
      change: 0, 
      unit: 'kg', 
      goal: goals.muscleMass || 45.0 
    },
    waistCircumference: { 
      value: latestMeasurement.metrics.waistCircumference || 0, 
      change: 0, 
      unit: 'cm', 
      goal: goals.waistCircumference || 80 
    },
    visceralFat: { 
      value: latestMeasurement.metrics.visceralFat || 0, 
      change: 0, 
      unit: 'level', 
      goal: goals.visceralFat || 5 
    },
    bmr: { 
      value: latestMeasurement.metrics.bmr || 0, 
      change: 0, 
      unit: 'kcal', 
      goal: goals.bmr || 1900 
    }
  } : {
    weight: { value: 0, change: 0, unit: 'kg', goal: 75.0 },
    bodyFat: { value: 0, change: 0, unit: '%', goal: 12.0 },
    muscleMass: { value: 0, change: 0, unit: 'kg', goal: 45.0 },
    waistCircumference: { value: 0, change: 0, unit: 'cm', goal: 80 },
    visceralFat: { value: 0, change: 0, unit: 'level', goal: 5 },
    bmr: { value: 0, change: 0, unit: 'kcal', goal: 1900 }
  };

  // Measurement history - use real data
  const measurementHistory = measurements
    .sort((a, b) => new Date(b.metrics.date).getTime() - new Date(a.metrics.date).getTime())
    .slice(0, 10); // Show last 10 measurements

  // Progress photos
  const progressPhotos = [
    { date: '2024-01-15', front: '/progress/front-jan15.jpg', side: '/progress/side-jan15.jpg', back: '/progress/back-jan15.jpg' },
    { date: '2024-01-01', front: '/progress/front-jan01.jpg', side: '/progress/side-jan01.jpg', back: '/progress/back-jan01.jpg' },
    { date: '2023-12-15', front: '/progress/front-dec15.jpg', side: '/progress/side-dec15.jpg', back: '/progress/back-dec15.jpg' }
  ];

  // Goals progress
  const goalsProgress = [
    { metric: 'Gewicht', current: 75.2, goal: 73.0, unit: 'kg', progress: 73 },
    { metric: 'Vetpercentage', current: 12.5, goal: 10.0, unit: '%', progress: 60 },
    { metric: 'Spiermassa', current: 42.8, goal: 45.0, unit: 'kg', progress: 82 },
    { metric: 'Taille omtrek', current: 82, goal: 78, unit: 'cm', progress: 50 }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataCard
          title="Gewicht"
          value={`${currentStats.weight.value} ${currentStats.weight.unit}`}
          change={`${currentStats.weight.change > 0 ? '+' : ''}${currentStats.weight.change} kg`}
          changeType={currentStats.weight.change <= 0 ? 'positive' : 'negative'}
          icon="⚖️"
          subtitle={`Doel: ${currentStats.weight.goal} kg`}
        />
        <DataCard
          title="Vetpercentage"
          value={`${currentStats.bodyFat.value}${currentStats.bodyFat.unit}`}
          change={`${currentStats.bodyFat.change > 0 ? '+' : ''}${currentStats.bodyFat.change}%`}
          changeType={currentStats.bodyFat.change <= 0 ? 'positive' : 'negative'}
          icon="📊"
          subtitle={`Doel: ${currentStats.bodyFat.goal}%`}
        />
        <DataCard
          title="Spiermassa"
          value={`${currentStats.muscleMass.value} ${currentStats.muscleMass.unit}`}
          change={`${currentStats.muscleMass.change > 0 ? '+' : ''}${currentStats.muscleMass.change} kg`}
          changeType={currentStats.muscleMass.change >= 0 ? 'positive' : 'negative'}
          icon="💪"
          subtitle={`Doel: ${currentStats.muscleMass.goal} kg`}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataCard
          title="Taille Omtrek"
          value={`${currentStats.waistCircumference.value} ${currentStats.waistCircumference.unit}`}
          change={`${currentStats.waistCircumference.change > 0 ? '+' : ''}${currentStats.waistCircumference.change} cm`}
          changeType={currentStats.waistCircumference.change <= 0 ? 'positive' : 'negative'}
          icon="📏"
          subtitle={`Doel: ${currentStats.waistCircumference.goal} cm`}
        />
        <DataCard
          title="Visceraal Vet"
          value={`${currentStats.visceralFat.value} ${currentStats.visceralFat.unit}`}
          change={`${currentStats.visceralFat.change > 0 ? '+' : ''}${currentStats.visceralFat.change}`}
          changeType={currentStats.visceralFat.change <= 0 ? 'positive' : 'negative'}
          icon="🫀"
          subtitle={`Doel: ${currentStats.visceralFat.goal} level`}
        />
        <DataCard
          title="Basaal Metabolisme"
          value={`${currentStats.bmr.value} ${currentStats.bmr.unit}`}
          change={`${currentStats.bmr.change > 0 ? '+' : ''}${currentStats.bmr.change} kcal`}
          changeType={currentStats.bmr.change >= 0 ? 'positive' : 'negative'}
          icon="🔥"
          subtitle={`Doel: ${currentStats.bmr.goal} kcal`}
        />
      </div>

      {/* Goals Progress */}
      <DataCard title="Doelen Voortgang" value="" icon="🎯">
        <div className="space-y-4">
          {goalsProgress.map((goal, index) => (
            <div key={index} className="p-4 bg-[#2A2D3A] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-medium">{goal.metric}</h4>
                <span className="text-gray-400 text-sm">
                  {goal.current} / {goal.goal} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-[#3A3D4A] rounded-full h-3 mb-2">
                <div 
                  className="bg-[#E33412] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{goal.progress}% voltooid</span>
                <span>
                  {goal.metric === 'Gewicht' || goal.metric === 'Taille omtrek' || goal.metric === 'Vetpercentage' 
                    ? `${(goal.current - goal.goal).toFixed(1)} ${goal.unit} te gaan`
                    : `${(goal.goal - goal.current).toFixed(1)} ${goal.unit} te gaan`
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );

  const renderMeasurements = () => (
    <div className="space-y-6">
      {/* Add New Measurement */}
      {showMetricsLogger ? (
        <DataCard title={editingMeasurement ? "Meting Bewerken" : "Nieuwe Meting Toevoegen"} value="" icon="➕">
          <MetricsLogger 
            onSave={handleSaveMeasurement}
            onCancel={handleCancelLogger}
            initialData={editingMeasurement?.metrics}
          />
        </DataCard>
      ) : (
        <DataCard title="Nieuwe Meting Toevoegen" value="" icon="➕">
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Voeg een nieuwe meting toe om je voortgang bij te houden</p>
            <button 
              onClick={() => setShowMetricsLogger(true)}
              className="bg-[#E33412] text-white px-6 py-3 rounded-lg hover:bg-[#b9260e] transition-colors font-medium"
            >
              Nieuwe Meting Toevoegen
            </button>
          </div>
        </DataCard>
      )}

      {/* Measurement History */}
      <DataCard title="Meetgeschiedenis" value="" icon="📈">
        {measurementHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#3A3D4A]">
                  <th className="text-left text-gray-400 py-3 px-2">Datum</th>
                  <th className="text-left text-gray-400 py-3 px-2">Gewicht</th>
                  <th className="text-left text-gray-400 py-3 px-2">Vetpercentage</th>
                  <th className="text-left text-gray-400 py-3 px-2">Spiermassa</th>
                  <th className="text-left text-gray-400 py-3 px-2">Taille</th>
                  <th className="text-left text-gray-400 py-3 px-2">Acties</th>
                </tr>
              </thead>
              <tbody>
                {measurementHistory.map((measurement) => (
                  <tr key={measurement.id} className="border-b border-[#2A2D3A] hover:bg-[#2A2D3A] transition-colors">
                    <td className="py-3 px-2 text-white">{new Date(measurement.metrics.date).toLocaleDateString('nl-NL')}</td>
                    <td className="py-3 px-2 text-white">{measurement.metrics.weight || '-'} kg</td>
                    <td className="py-3 px-2 text-white">{measurement.metrics.bodyFat || '-'}%</td>
                    <td className="py-3 px-2 text-white">{measurement.metrics.muscleMass || '-'} kg</td>
                    <td className="py-3 px-2 text-white">{measurement.metrics.waistCircumference || '-'} cm</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditMeasurement(measurement)}
                          className="text-[#E33412] hover:underline text-sm"
                        >
                          Bewerken
                        </button>
                        <button 
                          onClick={() => handleDeleteMeasurement(measurement.id)}
                          className="text-red-400 hover:underline text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-gray-400 mb-4">Nog geen metingen gevonden</p>
            <p className="text-gray-500 text-sm">Voeg je eerste meting toe om je voortgang bij te houden</p>
          </div>
        )}
      </DataCard>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Progress Charts */}
      <DataCard title="Trend Grafieken" value="" icon="📊">
        <div className="space-y-6">
          {/* Weight Trend */}
          <div>
            <h4 className="text-white font-medium mb-3">Gewicht Trend (6 weken)</h4>
            <div className="h-64 bg-[#2A2D3A] rounded-lg p-4 flex items-end justify-between">
              {measurementHistory.slice().reverse().map((measurement, index) => (
                <div key={measurement.id} className="flex flex-col items-center">
                  <div 
                    className="bg-[#E33412] rounded-t w-8 mb-2"
                    style={{ height: `${((measurement.metrics.weight || 70) - 70) * 4}px` }}
                  ></div>
                  <span className="text-white text-xs font-semibold">{measurement.metrics.weight || '-'}</span>
                  <span className="text-gray-400 text-xs">{new Date(measurement.metrics.date).getDate()}/{new Date(measurement.metrics.date).getMonth() + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Fat Trend */}
          <div>
            <h4 className="text-white font-medium mb-3">Vetpercentage Trend (6 weken)</h4>
            <div className="h-64 bg-[#2A2D3A] rounded-lg p-4 flex items-end justify-between">
              {measurementHistory.map((measurement) => (
                <div key={measurement.id} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-400 rounded-t w-8 mb-2"
                    style={{ height: `${(measurement.metrics.bodyFat || 0) * 10}px` }}
                  ></div>
                  <span className="text-white text-xs font-semibold">{measurement.metrics.bodyFat || '-'}%</span>
                  <span className="text-gray-400 text-xs">{new Date(measurement.metrics.date).getDate()}/{new Date(measurement.metrics.date).getMonth() + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DataCard>

      {/* Body Composition Breakdown */}
      <DataCard title="Lichaamssamenstelling Breakdown" value="" icon="🫁">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-medium">Huidige Verdeling</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Spiermassa</span>
                <span className="text-white font-semibold">42.8 kg (57%)</span>
              </div>
              <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vetmassa</span>
                <span className="text-white font-semibold">9.4 kg (12.5%)</span>
              </div>
              <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Botmassa</span>
                <span className="text-white font-semibold">3.2 kg (4.3%)</span>
              </div>
              <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '4.3%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Water</span>
                <span className="text-white font-semibold">19.8 kg (26.2%)</span>
              </div>
              <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '26.2%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-medium">Ideale Verdeling</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Spiermassa</span>
                <span className="text-green-400 font-semibold">45.0 kg (62%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Vetmassa</span>
                <span className="text-yellow-400 font-semibold">7.3 kg (10%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Botmassa</span>
                <span className="text-gray-400 font-semibold">3.2 kg (4.4%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Water</span>
                <span className="text-blue-400 font-semibold">17.5 kg (23.6%)</span>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-[#2A2D3A] rounded-lg border-l-4 border-[#E33412]">
              <h5 className="text-white font-medium text-sm mb-1">Aanbeveling</h5>
              <p className="text-gray-300 text-sm">
                Focus op spiermassa opbouw en vet verlies. Verhoog eiwit inname naar 2.2g per kg lichaamsgewicht.
              </p>
            </div>
          </div>
        </div>
      </DataCard>
    </div>
  );

  const handlePhotosUploaded = (photos: { front?: string; side?: string; back?: string }) => {
    // TODO: Save photos to localStorage or service
    console.log('Photos uploaded:', photos);
  };

  const renderGoals = () => (
    <div className="space-y-6">
      {/* Goals Manager */}
      {showGoalsManager ? (
        <DataCard title="Doelen Beheren" value="" icon="🎯">
          <GoalsManager 
            onGoalsSaved={handleGoalsSaved}
            onCancel={handleCancelGoals}
          />
        </DataCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataCard title="Mijn Doelen" value="" icon="🎯">
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">Stel je doelen in om je voortgang bij te houden</p>
              <button 
                onClick={() => setShowGoalsManager(true)}
                className="bg-[#E33412] text-white px-6 py-3 rounded-lg hover:bg-[#b9260e] transition-colors font-medium"
              >
                Doelen Instellen
              </button>
            </div>
          </DataCard>
          
          <DataCard title="AI Doelen Suggesties" value="" icon="🤖">
            <GoalSuggestions 
              category="body_composition"
              maxItems={4} 
              showControls={false} 
              compact={true}
            />
          </DataCard>
        </div>
      )}

      {/* Current Goals Overview */}
      {!showGoalsManager && (
        <DataCard title="Huidige Doelen" value="" icon="📋">
          {(() => {
            const goals = bodyCompositionService.getGoals();
            const hasGoals = Object.keys(goals).some(key => key !== 'targetDate' && goals[key as keyof typeof goals]);
            
            if (!hasGoals) {
              return (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <p className="text-gray-400 mb-4">Nog geen doelen ingesteld</p>
                  <p className="text-gray-500 text-sm">Stel doelen in om je voortgang bij te houden</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {goals.targetDate && (
                  <div className="p-4 bg-[#2A2D3A] rounded-lg border-l-4 border-blue-400">
                    <h4 className="text-white font-medium text-sm mb-1">Streefdatum</h4>
                    <p className="text-gray-300">{new Date(goals.targetDate).toLocaleDateString('nl-NL')}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(goals).map(([key, value]) => {
                    if (key === 'targetDate' || !value) return null;
                    
                    const labels: Record<string, { label: string; unit: string; icon: string }> = {
                      weight: { label: 'Gewicht', unit: 'kg', icon: '⚖️' },
                      bodyFat: { label: 'Vetpercentage', unit: '%', icon: '📊' },
                      muscleMass: { label: 'Spiermassa', unit: 'kg', icon: '💪' },
                      waistCircumference: { label: 'Taille Omtrek', unit: 'cm', icon: '📏' },
                      visceralFat: { label: 'Visceraal Vet', unit: 'level', icon: '🫀' },
                      bmr: { label: 'BMR', unit: 'kcal', icon: '🔥' }
                    };
                    
                    const config = labels[key];
                    if (!config) return null;
                    
                    return (
                      <div key={key} className="p-4 bg-[#2A2D3A] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{config.icon}</span>
                          <h4 className="text-white font-medium text-sm">{config.label}</h4>
                        </div>
                        <p className="text-white text-lg font-semibold">
                          {value} {config.unit}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
                  <button 
                    onClick={() => setShowGoalsManager(true)}
                    className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm font-medium"
                  >
                    Doelen Bewerken
                  </button>
                </div>
              </div>
            );
          })()}
        </DataCard>
      )}
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-6">
      {/* Upload New Photos */}
      <DataCard title="Nieuwe Progress Foto's" value="" icon="📸">
        <PhotoUpload onPhotosUploaded={handlePhotosUploaded} />
      </DataCard>

      {/* Progress Photo History */}
      <DataCard title="Progress Foto Geschiedenis" value="" icon="🖼️">
        <div className="space-y-6">
          {progressPhotos.map((photoSet, index) => (
            <div key={index} className="p-4 bg-[#2A2D3A] rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-medium">{new Date(photoSet.date).toLocaleDateString('nl-NL')}</h4>
                <div className="flex gap-2">
                  <button className="text-[#E33412] hover:underline text-sm">Bewerken</button>
                  <button className="text-red-400 hover:underline text-sm">Verwijderen</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">Voorkant</label>
                  <div className="aspect-[3/4] bg-[#3A3D4A] rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">📷 Voorkant foto</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">Zijkant</label>
                  <div className="aspect-[3/4] bg-[#3A3D4A] rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">📷 Zijkant foto</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm">Achterkant</label>
                  <div className="aspect-[3/4] bg-[#3A3D4A] rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">📷 Achterkant foto</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Lichaamssamenstelling</h1>
          <p className="text-gray-400">Track je lichaamssamenstelling en progressie</p>
        </div>
        <button 
          onClick={() => setShowMetricsLogger(true)}
          className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium"
        >
          + Nieuwe Meting
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#2A2D3A] p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overzicht', icon: '📊' },
          { id: 'measurements', label: 'Metingen', icon: '📏' },
          { id: 'progress', label: 'Progressie', icon: '📈' },
          { id: 'goals', label: 'Doelen', icon: '🎯' },
          { id: 'photos', label: 'Foto\'s', icon: '📸' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#E33412] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#3A3D4A]'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'measurements' && renderMeasurements()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'goals' && renderGoals()}
      {activeTab === 'photos' && renderPhotos()}
    </div>
  );
} 