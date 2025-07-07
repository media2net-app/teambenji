import { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import { recoveryService, type SleepData, type RecoveryMetrics, type WearableDevice, type RecoveryRecommendation } from '../services/recoveryService';

export default function HerstelPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [recoveryMetrics, setRecoveryMetrics] = useState<RecoveryMetrics[]>([]);
  const [wearableDevices, setWearableDevices] = useState<WearableDevice[]>([]);
  const [recommendations, setRecommendations] = useState<RecoveryRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeviceManager, setShowDeviceManager] = useState(false);

  useEffect(() => {
    loadRecoveryData();
  }, []);

  const loadRecoveryData = () => {
    setSleepData(recoveryService.getAllSleepData());
    setRecoveryMetrics(recoveryService.getAllRecoveryMetrics());
    setWearableDevices(recoveryService.getWearableDevices());
    setRecommendations(recoveryService.generateRecoveryRecommendations());
  };

  const handleSyncDevice = async (deviceId: string) => {
    setIsLoading(true);
    try {
      const success = await recoveryService.syncDevice(deviceId);
      if (success) {
        loadRecoveryData();
        alert('Synchronisatie succesvol voltooid!');
      } else {
        alert('Synchronisatie mislukt. Probeer opnieuw.');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Er is een fout opgetreden tijdens synchronisatie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectDevice = () => {
    // Simulate connecting a new device
    const newDevice = recoveryService.connectDevice({
      name: 'Apple Watch Series 9',
      type: 'apple_watch',
      model: 'Series 9',
      batteryLevel: 78,
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
        dataRetention: 60
      }
    });
    
    setWearableDevices([...wearableDevices, newDevice]);
    setShowDeviceManager(false);
  };

  const handleDisconnectDevice = (deviceId: string) => {
    if (confirm('Weet je zeker dat je dit apparaat wilt ontkoppelen?')) {
      recoveryService.disconnectDevice(deviceId);
      loadRecoveryData();
    }
  };

  // Get latest data for display
  const latestSleep = sleepData.length > 0 ? sleepData[sleepData.length - 1] : null;
  const latestRecovery = recoveryMetrics.length > 0 ? recoveryMetrics[recoveryMetrics.length - 1] : null;
  const sleepTrends = recoveryService.getSleepTrends(7);
  const recoveryTrends = recoveryService.getRecoveryTrends(7);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Recovery Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Slaapscore"
          value={latestSleep?.quality || 0}
          change={sleepTrends.averageQuality > 80 ? "+5" : "-2"}
          changeType={sleepTrends.averageQuality > 80 ? "positive" : "negative"}
          icon="😴"
          subtitle="van 100"
        />
        <DataCard
          title="Slaapduur"
          value={latestSleep ? `${latestSleep.duration.toFixed(1)}u` : "0u"}
          change={sleepTrends.averageDuration > 7.5 ? "+30m" : "-15m"}
          changeType={sleepTrends.averageDuration > 7.5 ? "positive" : "negative"}
          icon="⏰"
          subtitle="afgelopen nacht"
        />
        <DataCard
          title="Readiness"
          value={latestRecovery ? `${latestRecovery.readinessScore}%` : "0%"}
          change={latestRecovery && latestRecovery.readinessScore > 80 ? "Uitstekend" : latestRecovery && latestRecovery.readinessScore > 60 ? "Goed" : "Matig"}
          changeType={latestRecovery && latestRecovery.readinessScore > 80 ? "positive" : latestRecovery && latestRecovery.readinessScore > 60 ? "neutral" : "negative"}
          icon="⚡"
          subtitle="voor training"
        />
        <DataCard
          title="HRV Score"
          value={latestRecovery?.hrv.value || 0}
          change={latestRecovery?.hrv.status === 'excellent' ? "+6" : latestRecovery?.hrv.status === 'good' ? "+2" : "-3"}
          changeType={latestRecovery?.hrv.status === 'excellent' || latestRecovery?.hrv.status === 'good' ? "positive" : "negative"}
          icon="❤️"
          subtitle={`ms (baseline: ${latestRecovery?.hrv.baseline || 38})`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sleep Analysis */}
        <div className="lg:col-span-2">
          <DataCard title="Slaap Analyse" value="" icon="🌙">
            <div className="space-y-6">
              {latestSleep && (
                <>
                  {/* Sleep Phases */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Slaapfases (afgelopen nacht)</h4>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-blue-400 font-semibold text-lg">{latestSleep.duration.toFixed(1)}u</div>
                        <div className="text-gray-400 text-xs">Totaal</div>
                      </div>
                      <div className="text-center p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-purple-400 font-semibold text-lg">{Math.round(latestSleep.stages.deep / 60 * 10) / 10}u</div>
                        <div className="text-gray-400 text-xs">Diepe slaap</div>
                      </div>
                      <div className="text-center p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-green-400 font-semibold text-lg">{Math.round(latestSleep.stages.rem / 60 * 10) / 10}u</div>
                        <div className="text-gray-400 text-xs">REM slaap</div>
                      </div>
                      <div className="text-center p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-yellow-400 font-semibold text-lg">{Math.round(latestSleep.stages.light / 60 * 10) / 10}u</div>
                        <div className="text-gray-400 text-xs">Lichte slaap</div>
                      </div>
                    </div>
                  </div>

                  {/* Sleep Metrics */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Slaapmetrieken</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-gray-400 text-sm">Efficiëntie</div>
                        <div className="text-white font-semibold text-lg">{latestSleep.efficiency.toFixed(0)}%</div>
                      </div>
                      <div className="p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-gray-400 text-sm">Rust hartslag</div>
                        <div className="text-white font-semibold text-lg">{latestSleep.heartRate.resting} bpm</div>
                      </div>
                      <div className="p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-gray-400 text-sm">HRV</div>
                        <div className="text-white font-semibold text-lg">{latestSleep.hrv} ms</div>
                      </div>
                      <div className="p-3 bg-[#2A2D3A] rounded-lg">
                        <div className="text-gray-400 text-sm">SpO2</div>
                        <div className="text-white font-semibold text-lg">{latestSleep.oxygenSaturation}%</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Weekly Trend */}
              <div>
                <h4 className="text-white font-medium mb-3">Week Overzicht</h4>
                <div className="grid grid-cols-7 gap-2">
                  {sleepTrends.trendData.slice(-7).map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-gray-400 text-xs mb-1">
                        {new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'short' })}
                      </div>
                      <div className="bg-[#2A2D3A] rounded-lg p-2">
                        <div className="text-white font-semibold text-sm">{day.duration.toFixed(1)}u</div>
                        <div className="text-gray-400 text-xs">{day.quality.toFixed(0)}%</div>
                        <div className="w-full bg-[#3A3D4A] rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-400 h-1 rounded-full"
                            style={{ width: `${day.quality}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DataCard>
        </div>

        {/* Recovery Status & Recommendations */}
        <div className="space-y-6">
          <DataCard title="Recovery Status" value="" icon="📊">
            <div className="space-y-4">
              {latestRecovery && (
                <>
                  <div className="flex justify-between items-center p-3 bg-[#2A2D3A] rounded-lg">
                    <span className="text-gray-300">HRV</span>
                    <span className={`font-semibold ${
                      latestRecovery.hrv.status === 'excellent' ? 'text-green-400' :
                      latestRecovery.hrv.status === 'good' ? 'text-blue-400' :
                      latestRecovery.hrv.status === 'fair' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {latestRecovery.hrv.status === 'excellent' ? 'Uitstekend' :
                       latestRecovery.hrv.status === 'good' ? 'Goed' :
                       latestRecovery.hrv.status === 'fair' ? 'Matig' : 'Slecht'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#2A2D3A] rounded-lg">
                    <span className="text-gray-300">Rust hartslag</span>
                    <span className={`font-semibold ${
                      latestRecovery.restingHeartRate.status === 'excellent' ? 'text-green-400' :
                      latestRecovery.restingHeartRate.status === 'good' ? 'text-blue-400' :
                      latestRecovery.restingHeartRate.status === 'fair' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {latestRecovery.restingHeartRate.status === 'excellent' ? 'Uitstekend' :
                       latestRecovery.restingHeartRate.status === 'good' ? 'Goed' :
                       latestRecovery.restingHeartRate.status === 'fair' ? 'Matig' : 'Slecht'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#2A2D3A] rounded-lg">
                    <span className="text-gray-300">Stress niveau</span>
                    <span className={`font-semibold ${
                      latestRecovery.stressLevel < 30 ? 'text-green-400' :
                      latestRecovery.stressLevel < 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {latestRecovery.stressLevel < 30 ? 'Laag' :
                       latestRecovery.stressLevel < 60 ? 'Gemiddeld' : 'Hoog'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#2A2D3A] rounded-lg">
                    <span className="text-gray-300">Body Battery</span>
                    <span className={`font-semibold ${
                      latestRecovery.bodyBattery > 75 ? 'text-green-400' :
                      latestRecovery.bodyBattery > 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {latestRecovery.bodyBattery}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </DataCard>

          <DataCard title="Aanbevelingen" value="" icon="💡">
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className={`p-3 bg-[#2A2D3A] rounded-lg border-l-4 border-${rec.color}-400`}>
                  <h4 className="text-white font-medium text-sm">{rec.title}</h4>
                  <p className="text-gray-300 text-sm mt-1">{rec.description}</p>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-xl font-bold">Gekoppelde Apparaten</h3>
        <button
          onClick={() => setShowDeviceManager(true)}
          className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium"
        >
          + Apparaat toevoegen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wearableDevices.map((device) => (
          <DataCard key={device.id} title={device.name} value="" icon="⌚">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Status</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${device.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className={`text-sm ${device.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                    {device.isConnected ? 'Verbonden' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Batterij</span>
                <span className="text-white">{device.batteryLevel}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Laatste sync</span>
                <span className="text-white text-sm">
                  {new Date(device.lastSync).toLocaleString('nl-NL')}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleSyncDevice(device.id)}
                  disabled={!device.isConnected || isLoading}
                  className="flex-1 bg-[#3A3D4A] text-white px-3 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Synchroniseren...' : 'Sync Nu'}
                </button>
                <button
                  onClick={() => handleDisconnectDevice(device.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Ontkoppelen
                </button>
              </div>
            </div>
          </DataCard>
        ))}
      </div>

      {/* Device Manager Modal */}
      {showDeviceManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1A1D29] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-bold mb-4">Apparaat Toevoegen</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleConnectDevice}
                  className="p-4 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-center"
                >
                  <div className="text-2xl mb-2">⌚</div>
                  <div className="text-white font-medium">Apple Watch</div>
                </button>
                <button
                  onClick={handleConnectDevice}
                  className="p-4 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-center"
                >
                  <div className="text-2xl mb-2">💍</div>
                  <div className="text-white font-medium">Oura Ring</div>
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeviceManager(false)}
                  className="flex-1 bg-[#3A3D4A] text-white px-4 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      <h3 className="text-white text-xl font-bold">Recovery Insights</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCard title="Slaaptrends (7 dagen)" value="" icon="📈">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde duur</span>
              <span className="text-white font-semibold">{sleepTrends.averageDuration.toFixed(1)}u</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde kwaliteit</span>
              <span className="text-white font-semibold">{sleepTrends.averageQuality.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde efficiëntie</span>
              <span className="text-white font-semibold">{sleepTrends.averageEfficiency.toFixed(0)}%</span>
            </div>
          </div>
        </DataCard>

        <DataCard title="Recovery Trends (7 dagen)" value="" icon="⚡">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde readiness</span>
              <span className="text-white font-semibold">{recoveryTrends.averageReadiness.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde recovery</span>
              <span className="text-white font-semibold">{recoveryTrends.averageRecovery.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Gemiddelde strain</span>
              <span className="text-white font-semibold">{recoveryTrends.averageStrain.toFixed(1)}</span>
            </div>
          </div>
        </DataCard>
      </div>

      <DataCard title="Alle Aanbevelingen" value="" icon="🎯">
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className={`p-4 bg-[#2A2D3A] rounded-lg border-l-4 border-${rec.color}-400`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{rec.icon}</span>
                  <h4 className="text-white font-medium">{rec.title}</h4>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  rec.priority === 'critical' ? 'bg-red-600 text-white' :
                  rec.priority === 'high' ? 'bg-orange-600 text-white' :
                  rec.priority === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {rec.priority === 'critical' ? 'Kritiek' :
                   rec.priority === 'high' ? 'Hoog' :
                   rec.priority === 'medium' ? 'Gemiddeld' : 'Laag'}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
              <div className="space-y-2">
                <p className="text-gray-400 text-xs"><strong>Verwachte impact:</strong> {rec.expectedImpact}</p>
                <p className="text-gray-400 text-xs"><strong>Tijdsbestek:</strong> {rec.timeframe}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.actionItems.map((action, actionIndex) => (
                    <span key={actionIndex} className="text-xs bg-[#3A3D4A] text-gray-300 px-2 py-1 rounded">
                      {action}
                    </span>
                  ))}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Herstel</h1>
          <p className="text-gray-400">Monitor je slaap, recovery en wearable devices</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
          Handmatige invoer
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[#2A2D3A] p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-[#E33412] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overzicht
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'devices'
              ? 'bg-[#E33412] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Apparaten
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-[#E33412] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'devices' && renderDevices()}
      {activeTab === 'insights' && renderInsights()}
    </div>
  );
} 