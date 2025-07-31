import { useState, useEffect } from 'react';
import DataCard from '../components/DataCard';
import AIRecommendations from '../components/AIRecommendations';
import GoalSuggestions from '../components/GoalSuggestions';
import { aiInsightsService } from '../services/aiInsightsService';

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState('insights');
  const [insightStats, setInsightStats] = useState({
    total: 0,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    avgConfidence: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const insights = aiInsightsService.getStoredInsights();
    
    const byCategory = insights.reduce((acc, insight) => {
      acc[insight.category] = (acc[insight.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = insights.reduce((acc, insight) => {
      acc[insight.priority] = (acc[insight.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgConfidence = insights.length > 0 
      ? insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length 
      : 0;

    setInsightStats({
      total: insights.length,
      byCategory,
      byPriority,
      avgConfidence: Math.round(avgConfidence)
    });
  };

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCard title="AI Aanbevelingen" value="" icon="🤖">
          <AIRecommendations 
            maxItems={6} 
            showControls={true} 
            compact={false}
          />
        </DataCard>
        
        <DataCard title="Intelligente Doelen" value="" icon="🎯">
          <GoalSuggestions 
            maxItems={6} 
            showControls={true} 
            compact={false}
          />
        </DataCard>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <DataCard
          title="Totaal Aanbevelingen"
          value={insightStats.total.toString()}
          icon="🤖"
          subtitle="Deze sessie"
        />
        <DataCard
          title="Gemiddelde Zekerheid"
          value={`${insightStats.avgConfidence}%`}
          icon="🎯"
          subtitle="AI betrouwbaarheid"
        />
        <DataCard
          title="Kritieke Items"
          value={(insightStats.byPriority.critical || 0).toString()}
          icon="🚨"
          subtitle="Directe aandacht vereist"
        />
        <DataCard
          title="Actieve Categorieën"
          value={Object.keys(insightStats.byCategory).length.toString()}
          icon="📊"
          subtitle="Verschillende gebieden"
        />
      </div>

      {/* Category Breakdown */}
      <DataCard title="Aanbevelingen per Categorie" value="" icon="📈">
        <div className="space-y-4">
          {Object.entries(insightStats.byCategory).map(([category, count]) => {
            const categoryLabels: Record<string, { label: string; icon: string; color: string }> = {
              training: { label: 'Training', icon: '💪', color: 'bg-orange-500' },
              nutrition: { label: 'Voeding', icon: '🥗', color: 'bg-green-500' },
              recovery: { label: 'Herstel', icon: '😴', color: 'bg-blue-500' },
              body_composition: { label: 'Lichaamssamenstelling', icon: '⚖️', color: 'bg-purple-500' },
              general: { label: 'Algemeen', icon: '🎯', color: 'bg-gray-500' }
            };

            const config = categoryLabels[category] || { label: category, icon: '❓', color: 'bg-gray-500' };
            const percentage = insightStats.total > 0 ? Math.round((count / insightStats.total) * 100) : 0;

            return (
              <div key={category} className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{config.icon}</span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{config.label}</h4>
                    <p className="text-gray-400 text-xs">{count} aanbevelingen</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-[#3A3D4A] rounded-full h-2">
                    <div 
                      className={`${config.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm font-medium w-8">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </DataCard>

      {/* Priority Distribution */}
      <DataCard title="Prioriteit Verdeling" value="" icon="⚡">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'critical', label: 'Kritiek', icon: '🚨', color: 'text-red-400' },
            { key: 'high', label: 'Hoog', icon: '⚠️', color: 'text-orange-400' },
            { key: 'medium', label: 'Gemiddeld', icon: '💡', color: 'text-yellow-400' },
            { key: 'low', label: 'Laag', icon: 'ℹ️', color: 'text-green-400' }
          ].map((priority) => (
            <div key={priority.key} className="text-center p-4 bg-[#2A2D3A] rounded-lg">
              <div className={`text-2xl mb-2 ${priority.color}`}>{priority.icon}</div>
              <div className="text-white text-xl font-bold">
                {insightStats.byPriority[priority.key] || 0}
              </div>
              <div className={`text-sm ${priority.color}`}>{priority.label}</div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* AI Preferences */}
      <DataCard title="AI Voorkeuren" value="" icon="⚙️">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Motivatiestijl</label>
            <select className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none">
              <option value="encouraging">Bemoedigend</option>
              <option value="challenging">Uitdagend</option>
              <option value="analytical">Analytisch</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Focus Gebieden</label>
            <div className="grid grid-cols-2 gap-2">
              {['Kracht', 'Cardio', 'Flexibiliteit', 'Voeding', 'Herstel', 'Mindset'].map((area) => (
                <label key={area} className="flex items-center gap-2 p-2 bg-[#2A2D3A] rounded cursor-pointer hover:bg-[#3A3D4A] transition-colors">
                  <input type="checkbox" className="text-[#E33412] bg-[#3A3D4A] border-[#4A4D5A] rounded focus:ring-[#E33412]" />
                  <span className="text-white text-sm">{area}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">Aanbevelingen Frequentie</label>
            <select className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none">
              <option value="realtime">Realtime</option>
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
          <button className="bg-[#E33412] text-white px-6 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
            Voorkeuren Opslaan
          </button>
          <button 
            onClick={() => {
              aiInsightsService.generateInsights();
              calculateStats();
            }}
            className="bg-[#3A3D4A] text-white px-6 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors font-medium"
          >
            Aanbevelingen Vernieuwen
          </button>
        </div>
      </DataCard>

      {/* Data Sources */}
      <DataCard title="Data Bronnen" value="" icon="📊">
        <div className="space-y-3">
          {[
            { source: 'Training Data', status: 'Actief', lastUpdate: '2 min geleden', icon: '💪' },
            { source: 'Voeding Data', status: 'Actief', lastUpdate: '1 uur geleden', icon: '🥗' },
            { source: 'Slaap Data', status: 'Beperkt', lastUpdate: '1 dag geleden', icon: '😴' },
            { source: 'Body Composition', status: 'Actief', lastUpdate: '3 uur geleden', icon: '⚖️' },
            { source: 'Hartslag Data', status: 'Niet verbonden', lastUpdate: 'Nooit', icon: '❤️' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <h4 className="text-white font-medium text-sm">{item.source}</h4>
                  <p className="text-gray-400 text-xs">Laatste update: {item.lastUpdate}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                item.status === 'Actief' ? 'bg-green-500 bg-opacity-20 text-green-400' :
                item.status === 'Beperkt' ? 'bg-yellow-500 bg-opacity-20 text-yellow-400' :
                'bg-red-500 bg-opacity-20 text-red-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-bold">AI Insights</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gepersonaliseerde aanbevelingen op basis van je data</p>
        </div>
        <button 
          onClick={() => {
            aiInsightsService.generateInsights();
            calculateStats();
          }}
          className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto"
        >
          <span>🔄</span>
          Vernieuw AI
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap sm:flex-nowrap space-x-1 bg-[#2A2D3A] p-1 rounded-lg">
        {[
          { id: 'insights', label: 'Aanbevelingen', icon: '🤖' },
          { id: 'analytics', label: 'Analytics', icon: '📊' },
          { id: 'settings', label: 'Instellingen', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#E33412] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#3A3D4A]'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'insights' && renderInsights()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}
    </div>
  );
} 