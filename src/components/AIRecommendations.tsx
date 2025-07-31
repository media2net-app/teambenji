import { useState, useEffect } from 'react';
import { aiInsightsService, type AIInsight } from '../services/aiInsightsService';

interface AIRecommendationsProps {
  category?: 'training' | 'nutrition' | 'recovery' | 'body_composition' | 'general';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  maxItems?: number;
  showControls?: boolean;
  compact?: boolean;
}

export default function AIRecommendations({ 
  category, 
  priority, 
  maxItems = 5, 
  showControls = true,
  compact = false 
}: AIRecommendationsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>(category || 'all');
  const [filterPriority, setFilterPriority] = useState<string>(priority || 'all');

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Clear expired insights first
      aiInsightsService.clearExpiredInsights();
      
      // Generate fresh insights
      const freshInsights = aiInsightsService.generateInsights();
      
      // Apply filters
      let filteredInsights = freshInsights;
      
      if (category) {
        filteredInsights = filteredInsights.filter(insight => insight.category === category);
      }
      
      if (priority) {
        filteredInsights = filteredInsights.filter(insight => insight.priority === priority);
      }
      
      // Apply UI filters
      if (filterCategory !== 'all') {
        filteredInsights = filteredInsights.filter(insight => insight.category === filterCategory);
      }
      
      if (filterPriority !== 'all') {
        filteredInsights = filteredInsights.filter(insight => insight.priority === filterPriority);
      }
      
      setInsights(filteredInsights.slice(0, maxItems));
    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500 bg-opacity-10';
      case 'high': return 'border-orange-500 bg-orange-500 bg-opacity-10';
      case 'medium': return 'border-yellow-500 bg-yellow-500 bg-opacity-10';
      case 'low': return 'border-green-500 bg-green-500 bg-opacity-10';
      default: return 'border-gray-500 bg-gray-500 bg-opacity-10';
    }
  };

  const getPriorityIcon = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '💡';
      case 'low': return 'ℹ️';
      default: return '💭';
    }
  };

  const getCategoryLabel = (category: AIInsight['category']) => {
    switch (category) {
      case 'training': return 'Training';
      case 'nutrition': return 'Nutrition';
      case 'recovery': return 'Recovery';
      case 'body_composition': return 'Body Composition';
      case 'general': return 'General';
      default: return 'Unknown';
    }
  };

  const toggleExpanded = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId);
  };

  const refreshInsights = () => {
    loadInsights();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E33412]"></div>
          <span className="text-gray-400">AI generating recommendations...</span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <span className="text-4xl">🤖</span>
        </div>
        <p className="text-gray-400 mb-4">No AI recommendations available</p>
                  <p className="text-gray-500 text-sm mb-4">Add more data for personalized advice</p>
        <button 
          onClick={refreshInsights}
          className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
        >
          Refresh Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      {showControls && !compact && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                loadInsights();
              }}
              className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none text-sm"
            >
              <option value="all">All categories</option>
              <option value="training">Training</option>
              <option value="nutrition">Nutrition</option>
              <option value="recovery">Recovery</option>
              <option value="body_composition">Body Composition</option>
              <option value="general">General</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                loadInsights();
              }}
              className="bg-[#2A2D3A] text-white px-3 py-2 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none text-sm"
            >
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <button 
            onClick={refreshInsights}
            className="bg-[#3A3D4A] text-white px-4 py-2 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm flex items-center gap-2"
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-lg border-l-4 transition-all duration-200 ${getPriorityColor(insight.priority)} ${
              compact ? 'p-3' : 'p-4'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{insight.icon}</span>
                  <span className="text-sm">{getPriorityIcon(insight.priority)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                    <span className="text-xs px-2 py-1 bg-[#3A3D4A] text-gray-300 rounded">
                      {getCategoryLabel(insight.category)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{insight.message}</p>
                  
                  {/* Data Points */}
                  {insight.dataPoints && insight.dataPoints.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-2">
                      {insight.dataPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs">
                          <span className="text-gray-400">{point.label}:</span>
                          <span className="text-white font-medium">{point.value}</span>
                          {point.trend && (
                            <span className={`text-xs ${
                              point.trend === 'up' ? 'text-green-400' : 
                              point.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {point.trend === 'up' ? '↗️' : point.trend === 'down' ? '↘️' : '➡️'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Action Items - Expandable */}
                  {insight.actionItems && insight.actionItems.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleExpanded(insight.id)}
                        className="text-[#E33412] hover:underline text-sm flex items-center gap-1"
                      >
                        <span>{expandedInsight === insight.id ? '▼' : '▶'}</span>
                        Action Points ({insight.actionItems.length})
                      </button>
                      
                      {expandedInsight === insight.id && (
                        <div className="mt-2 ml-4 space-y-1">
                          {insight.actionItems.map((action, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-[#E33412] mt-1">•</span>
                              <span className="text-gray-300">{action}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {!compact && (
                <div className="flex items-center gap-2 ml-4">
                  <button className="text-gray-400 hover:text-white transition-colors p-1">
                    <span className="text-sm">👍</span>
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-1">
                    <span className="text-sm">👎</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {!compact && insights.length > 0 && (
        <div className="mt-6 p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A]">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
            <span>📊</span>
            Recommendations Overview
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white text-lg font-bold">
                {insights.filter(i => i.priority === 'critical').length}
              </div>
              <div className="text-red-400 text-xs">Critical</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {insights.filter(i => i.priority === 'high').length}
              </div>
              <div className="text-orange-400 text-xs">High</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {insights.filter(i => i.priority === 'medium').length}
              </div>
              <div className="text-yellow-400 text-xs">Medium</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {insights.filter(i => i.priority === 'low').length}
              </div>
              <div className="text-green-400 text-xs">Low</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 