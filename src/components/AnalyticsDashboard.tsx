import { useState, useEffect } from 'react';
import DataCard from './DataCard';

interface AnalyticsData {
  userGrowth: {
    labels: string[];
    data: number[];
  };
  revenueData: {
    labels: string[];
    data: number[];
  };
  subscriptionDistribution: {
    basic: number;
    premium: number;
    elite: number;
  };
  userActivity: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
  };
  coachPerformance: {
    topCoaches: Array<{
      name: string;
      clients: number;
      revenue: number;
      rating: number;
    }>;
  };
  contentEngagement: {
    mostPopularPrograms: Array<{
      name: string;
      completions: number;
      rating: number;
    }>;
    mostViewedContent: Array<{
      title: string;
      views: number;
      type: string;
    }>;
  };
  systemMetrics: {
    serverUptime: number;
    apiResponseTime: number;
    errorRate: number;
    storageUsage: number;
  };
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  useEffect(() => {
    // Mock analytics data - in real app this would come from API
    const mockData: AnalyticsData = {
      userGrowth: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        data: [120, 145, 167, 189, 234, 278]
      },
      revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        data: [12500, 15200, 18900, 22400, 28700, 34200]
      },
      subscriptionDistribution: {
        basic: 543,
        premium: 567,
        elite: 137
      },
      userActivity: {
        dailyActiveUsers: 892,
        weeklyActiveUsers: 1456,
        monthlyActiveUsers: 2134,
        averageSessionDuration: 28.5
      },
      coachPerformance: {
        topCoaches: [
          { name: 'Sarah Wilson', clients: 25, revenue: 6525, rating: 4.9 },
          { name: 'Emma Jansen', clients: 30, revenue: 7520, rating: 4.9 },
          { name: 'Mark Johnson', clients: 20, revenue: 5320, rating: 4.8 },
          { name: 'Lisa de Vries', clients: 15, revenue: 3250, rating: 4.7 }
        ]
      },
      contentEngagement: {
        mostPopularPrograms: [
          { name: 'HIIT Beginners', completions: 234, rating: 4.8 },
          { name: 'Kracht voor Vrouwen', completions: 189, rating: 4.9 },
          { name: 'Yoga Flow', completions: 167, rating: 4.7 },
          { name: 'Cardio Blast', completions: 145, rating: 4.6 }
        ],
        mostViewedContent: [
          { title: 'Basis Kracht Oefeningen', views: 1234, type: 'Video' },
          { title: 'Voeding voor Beginners', views: 987, type: 'Artikel' },
          { title: 'Stretching Routine', views: 756, type: 'Video' },
          { title: 'Macro Berekening', views: 654, type: 'Tool' }
        ]
      },
      systemMetrics: {
        serverUptime: 99.9,
        apiResponseTime: 145,
        errorRate: 0.02,
        storageUsage: 67.5
      }
    };

    setAnalyticsData(mockData);
  }, [selectedTimeRange]);

  if (!analyticsData) {
    return <div className="text-white">Loading analytics...</div>;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DataCard
          title="Dagelijks Actieve Gebruikers"
          value={analyticsData.userActivity.dailyActiveUsers.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon="👥"
          subtitle="vs vorige periode"
        />
        <DataCard
          title="Maandelijkse Omzet"
          value={`€${analyticsData.revenueData.data[analyticsData.revenueData.data.length - 1]?.toLocaleString()}`}
          change="+19.2%"
          changeType="positive"
          icon="💰"
          subtitle="vs vorige maand"
        />
        <DataCard
          title="Gebruiker Retentie"
          value="94.2%"
          change="+2.1%"
          changeType="positive"
          icon="📈"
          subtitle="7-dagen retentie"
        />
        <DataCard
          title="Gem. Sessie Duur"
          value={`${analyticsData.userActivity.averageSessionDuration} min`}
          change="+8.3%"
          changeType="positive"
          icon="⏱️"
          subtitle="per sessie"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <DataCard title="Gebruikers Groei" value="" icon="📊">
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {analyticsData.userGrowth.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-[#E33412] rounded-t transition-all duration-500 hover:bg-[#b9260e]"
                  style={{ height: `${(value / Math.max(...analyticsData.userGrowth.data)) * 200}px` }}
                ></div>
                <span className="text-gray-400 text-xs mt-2">
                  {analyticsData.userGrowth.labels[index]}
                </span>
                <span className="text-white text-xs font-medium">{value}</span>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Revenue Chart */}
        <DataCard title="Omzet Ontwikkeling" value="" icon="💰">
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {analyticsData.revenueData.data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-400 rounded-t transition-all duration-500 hover:bg-green-300"
                  style={{ height: `${(value / Math.max(...analyticsData.revenueData.data)) * 200}px` }}
                ></div>
                <span className="text-gray-400 text-xs mt-2">
                  {analyticsData.revenueData.labels[index]}
                </span>
                <span className="text-white text-xs font-medium">€{(value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Subscription Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataCard title="Abonnement Verdeling" value="" icon="📋">
          <div className="space-y-4">
            {Object.entries(analyticsData.subscriptionDistribution).map(([type, count]) => {
              const total = Object.values(analyticsData.subscriptionDistribution).reduce((a, b) => a + b, 0);
              const percentage = (count / total) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 capitalize">{type}</span>
                    <span className="text-white font-medium">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        type === 'basic' ? 'bg-blue-400' :
                        type === 'premium' ? 'bg-[#E33412]' : 'bg-purple-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </DataCard>

        {/* Top Coaches */}
        <DataCard title="Top Presterende Coaches" value="" icon="🏆">
          <div className="space-y-3">
            {analyticsData.coachPerformance.topCoaches.map((coach, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-[#2A2D3A] rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E33412] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{coach.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{coach.name}</div>
                    <div className="text-gray-400 text-xs">{coach.clients} klanten</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-semibold">€{coach.revenue}</div>
                  <div className="text-gray-400 text-xs">⭐ {coach.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* System Health */}
        <DataCard title="Systeem Prestaties" value="" icon="🖥️">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Server Uptime</span>
              <span className="text-green-400 font-medium">{analyticsData.systemMetrics.serverUptime}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">API Response Time</span>
              <span className="text-white font-medium">{analyticsData.systemMetrics.apiResponseTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Error Rate</span>
              <span className="text-green-400 font-medium">{analyticsData.systemMetrics.errorRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Storage Usage</span>
              <span className="text-yellow-400 font-medium">{analyticsData.systemMetrics.storageUsage}%</span>
            </div>
            <div className="w-full bg-[#3A3D4A] rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${analyticsData.systemMetrics.storageUsage}%` }}
              ></div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );

  const renderUserAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataCard
          title="Dagelijks Actief"
          value={analyticsData.userActivity.dailyActiveUsers.toLocaleString()}
          icon="📅"
          subtitle="gebruikers vandaag"
        />
        <DataCard
          title="Wekelijks Actief"
          value={analyticsData.userActivity.weeklyActiveUsers.toLocaleString()}
          icon="📊"
          subtitle="gebruikers deze week"
        />
        <DataCard
          title="Maandelijks Actief"
          value={analyticsData.userActivity.monthlyActiveUsers.toLocaleString()}
          icon="📈"
          subtitle="gebruikers deze maand"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement */}
        <DataCard title="Gebruiker Betrokkenheid" value="" icon="👥">
          <div className="space-y-4">
            <div className="p-4 bg-[#2A2D3A] rounded-lg">
              <h4 className="text-white font-medium mb-2">Sessie Statistieken</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Gem. Sessie Duur</span>
                  <span className="text-white">{analyticsData.userActivity.averageSessionDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sessies per Gebruiker</span>
                  <span className="text-white">4.2 / week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bounce Rate</span>
                  <span className="text-green-400">12.3%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#2A2D3A] rounded-lg">
              <h4 className="text-white font-medium mb-2">Gebruiker Retentie</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">1 dag</span>
                  <span className="text-white">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">7 dagen</span>
                  <span className="text-white">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">30 dagen</span>
                  <span className="text-white">87.8%</span>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Device & Platform */}
        <DataCard title="Platform Gebruik" value="" icon="📱">
          <div className="space-y-4">
            <div className="p-4 bg-[#2A2D3A] rounded-lg">
              <h4 className="text-white font-medium mb-2">Apparaat Types</h4>
              <div className="space-y-2">
                {[
                  { device: 'Mobile', percentage: 68, color: 'bg-[#E33412]' },
                  { device: 'Desktop', percentage: 24, color: 'bg-blue-400' },
                  { device: 'Tablet', percentage: 8, color: 'bg-green-400' }
                ].map((item) => (
                  <div key={item.device} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{item.device}</span>
                      <span className="text-white">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#3A3D4A] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-[#2A2D3A] rounded-lg">
              <h4 className="text-white font-medium mb-2">Besturingssystemen</h4>
              <div className="space-y-2">
                {[
                  { os: 'iOS', percentage: 45 },
                  { os: 'Android', percentage: 32 },
                  { os: 'Windows', percentage: 15 },
                  { os: 'macOS', percentage: 8 }
                ].map((item) => (
                  <div key={item.os} className="flex justify-between">
                    <span className="text-gray-400">{item.os}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );

  const renderContentAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Programs */}
        <DataCard title="Populairste Programma's" value="" icon="🏋️">
          <div className="space-y-3">
            {analyticsData.contentEngagement.mostPopularPrograms.map((program, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg">
                <div>
                  <div className="text-white font-medium">{program.name}</div>
                  <div className="text-gray-400 text-sm">{program.completions} voltooiingen</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">⭐ {program.rating}</div>
                  <div className="text-gray-400 text-xs">rating</div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Most Viewed Content */}
        <DataCard title="Meest Bekeken Content" value="" icon="👁️">
          <div className="space-y-3">
            {analyticsData.contentEngagement.mostViewedContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#2A2D3A] rounded-lg">
                <div>
                  <div className="text-white font-medium">{content.title}</div>
                  <div className="text-gray-400 text-sm">{content.views} weergaven</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    content.type === 'Video' ? 'bg-red-500 bg-opacity-20 text-red-400' :
                    content.type === 'Artikel' ? 'bg-blue-500 bg-opacity-20 text-blue-400' :
                    'bg-green-500 bg-opacity-20 text-green-400'
                  }`}>
                    {content.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Content Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Totaal Content"
          value="1,247"
          icon="📝"
          subtitle="actieve items"
        />
        <DataCard
          title="Gem. Voltooiing"
          value="78.5%"
          icon="✅"
          subtitle="voltooiingspercentage"
        />
        <DataCard
          title="Nieuwe Content"
          value="23"
          icon="🆕"
          subtitle="deze maand"
        />
        <DataCard
          title="Gem. Rating"
          value="4.6"
          icon="⭐"
          subtitle="van 5.0"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case 'users':
        return renderUserAnalytics();
      case 'content':
        return renderContentAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === 'overview'
                ? 'bg-[#E33412] text-white'
                : 'bg-[#2A2D3A] text-gray-400 hover:text-white'
            }`}
          >
            Overzicht
          </button>
          <button
            onClick={() => setSelectedMetric('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === 'users'
                ? 'bg-[#E33412] text-white'
                : 'bg-[#2A2D3A] text-gray-400 hover:text-white'
            }`}
          >
            Gebruikers
          </button>
          <button
            onClick={() => setSelectedMetric('content')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === 'content'
                ? 'bg-[#E33412] text-white'
                : 'bg-[#2A2D3A] text-gray-400 hover:text-white'
            }`}
          >
            Content
          </button>
        </div>
        
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
        >
          <option value="7d">Laatste 7 dagen</option>
          <option value="30d">Laatste 30 dagen</option>
          <option value="90d">Laatste 90 dagen</option>
          <option value="1y">Laatste jaar</option>
        </select>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
} 