import { useState, useEffect } from 'react';
import { goalSuggestionsService, type GoalSuggestion } from '../services/goalSuggestionsService';

interface GoalSuggestionsProps {
  category?: 'training' | 'nutrition' | 'recovery' | 'body_composition';
  priority?: 'low' | 'medium' | 'high';
  maxItems?: number;
  showControls?: boolean;
  compact?: boolean;
}

export default function GoalSuggestions({
  category,
  priority,
  maxItems = 5,
  showControls = true,
  compact = false
}: GoalSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<GoalSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, [category, priority]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Generate fresh suggestions
      const freshSuggestions = goalSuggestionsService.generateGoalSuggestions();
      
      // Apply filters
      let filteredSuggestions = freshSuggestions;
      
      if (category) {
        filteredSuggestions = filteredSuggestions.filter(suggestion => suggestion.category === category);
      }
      
      if (priority) {
        filteredSuggestions = filteredSuggestions.filter(suggestion => suggestion.priority === priority);
      }
      
      setSuggestions(filteredSuggestions.slice(0, maxItems));
    } catch (error) {
      console.error('Error loading goal suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = (suggestionId: string) => {
    goalSuggestionsService.acceptGoalSuggestion(suggestionId);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    goalSuggestionsService.dismissGoalSuggestion(suggestionId);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getDifficultyColor = (difficulty: GoalSuggestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyIcon = (difficulty: GoalSuggestion['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: GoalSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-500 bg-opacity-10';
      case 'medium': return 'border-yellow-500 bg-yellow-500 bg-opacity-10';
      case 'low': return 'border-green-500 bg-green-500 bg-opacity-10';
      default: return 'border-gray-500 bg-gray-500 bg-opacity-10';
    }
  };

  const getTimeframeLabel = (timeframe: GoalSuggestion['timeframe']) => {
    switch (timeframe) {
      case 'week': return '1 week';
      case 'month': return '1 maand';
      case 'quarter': return '3 maanden';
      case 'year': return '1 jaar';
      default: return timeframe;
    }
  };

  const getCategoryLabel = (category: GoalSuggestion['category']) => {
    switch (category) {
      case 'training': return 'Training';
      case 'nutrition': return 'Voeding';
      case 'recovery': return 'Herstel';
      case 'body_composition': return 'Lichaamssamenstelling';
      default: return 'Onbekend';
    }
  };

  const toggleExpanded = (suggestionId: string) => {
    setExpandedSuggestion(expandedSuggestion === suggestionId ? null : suggestionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E33412]"></div>
          <span className="text-gray-400">AI genereert doelen...</span>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <span className="text-4xl">🎯</span>
        </div>
        <p className="text-gray-400 mb-4">Geen doelen suggesties beschikbaar</p>
        <p className="text-gray-500 text-sm mb-4">Voeg meer data toe voor gepersonaliseerde doelen</p>
        <button 
          onClick={loadSuggestions}
          className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors text-sm"
        >
          Vernieuw Suggesties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {showControls && !compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h3 className="text-white font-medium">Intelligente Doelen</h3>
            <span className="text-xs bg-[#E33412] text-white px-2 py-1 rounded">
              {suggestions.length} suggesties
            </span>
          </div>
          <button 
            onClick={loadSuggestions}
            className="bg-[#3A3D4A] text-white px-3 py-1 rounded-lg hover:bg-[#4A4D5A] transition-colors text-sm flex items-center gap-1"
          >
            <span>🔄</span>
            Vernieuw
          </button>
        </div>
      )}

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`rounded-lg border-l-4 transition-all duration-200 ${getPriorityColor(suggestion.priority)} ${
              compact ? 'p-3' : 'p-4'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="text-sm">{getDifficultyIcon(suggestion.difficulty)}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                    <span className="text-xs px-2 py-1 bg-[#3A3D4A] text-gray-300 rounded">
                      {getCategoryLabel(suggestion.category)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {getTimeframeLabel(suggestion.timeframe)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">{suggestion.description}</p>
                  
                  {/* Progress Info */}
                  <div className="flex items-center gap-4 mb-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Huidig:</span>
                      <span className="text-white font-medium">{suggestion.currentValue} {suggestion.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Doel:</span>
                      <span className="text-[#E33412] font-medium">{suggestion.targetValue} {suggestion.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Moeilijkheid:</span>
                      <span className={`font-medium ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#2A2D3A] rounded-full h-2 mb-2">
                    <div 
                      className="bg-[#E33412] h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((suggestion.currentValue / suggestion.targetValue) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  
                  {/* Reasoning */}
                  <p className="text-gray-400 text-xs mb-2 italic">"{suggestion.reasoning}"</p>
                  
                  {/* Action Steps - Expandable */}
                  {suggestion.actionSteps && suggestion.actionSteps.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleExpanded(suggestion.id)}
                        className="text-[#E33412] hover:underline text-sm flex items-center gap-1"
                      >
                        <span>{expandedSuggestion === suggestion.id ? '▼' : '▶'}</span>
                        Actiestappen ({suggestion.actionSteps.length})
                      </button>
                      
                      {expandedSuggestion === suggestion.id && (
                        <div className="mt-2 ml-4 space-y-1">
                          {suggestion.actionSteps.map((step, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-[#E33412] mt-1 font-bold">{index + 1}.</span>
                              <span className="text-gray-300">{step}</span>
                            </div>
                          ))}
                          
                          {suggestion.estimatedImpact && (
                            <div className="mt-3 p-2 bg-[#2A2D3A] rounded text-sm">
                              <span className="text-green-400 font-medium">Verwachte impact: </span>
                              <span className="text-gray-300">{suggestion.estimatedImpact}</span>
                            </div>
                          )}
                          
                          {suggestion.prerequisites && suggestion.prerequisites.length > 0 && (
                            <div className="mt-2 p-2 bg-yellow-500 bg-opacity-10 rounded text-sm">
                              <span className="text-yellow-400 font-medium">Vereisten: </span>
                              <span className="text-gray-300">{suggestion.prerequisites.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              {!compact && (
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => handleAcceptSuggestion(suggestion.id)}
                    className="bg-[#E33412] text-white px-3 py-1 rounded text-sm hover:bg-[#b9260e] transition-colors font-medium"
                  >
                    Accepteer
                  </button>
                  <button 
                    onClick={() => handleDismissSuggestion(suggestion.id)}
                    className="bg-[#3A3D4A] text-white px-3 py-1 rounded text-sm hover:bg-[#4A4D5A] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            
            {/* Compact Action Buttons */}
            {compact && (
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => handleAcceptSuggestion(suggestion.id)}
                  className="bg-[#E33412] text-white px-3 py-1 rounded text-xs hover:bg-[#b9260e] transition-colors font-medium"
                >
                  ✓ Accepteer
                </button>
                <button 
                  onClick={() => handleDismissSuggestion(suggestion.id)}
                  className="bg-[#3A3D4A] text-white px-3 py-1 rounded text-xs hover:bg-[#4A4D5A] transition-colors"
                >
                  ✗ Dismiss
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {!compact && suggestions.length > 0 && (
        <div className="mt-6 p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A]">
          <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
            <span>📊</span>
            Doelen Overzicht
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white text-lg font-bold">
                {suggestions.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-red-400 text-xs">Hoge prioriteit</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {suggestions.filter(s => s.difficulty === 'easy').length}
              </div>
              <div className="text-green-400 text-xs">Makkelijk</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {suggestions.filter(s => s.timeframe === 'month').length}
              </div>
              <div className="text-blue-400 text-xs">Deze maand</div>
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {Math.round(suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length)}%
              </div>
              <div className="text-gray-400 text-xs">Gem. zekerheid</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 