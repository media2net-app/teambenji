import { useState, useEffect } from 'react';
import { bodyCompositionService, type BodyCompositionGoals } from '../services/bodyCompositionService';

interface GoalsManagerProps {
  onGoalsSaved: () => void;
  onCancel: () => void;
}

export default function GoalsManager({ onGoalsSaved, onCancel }: GoalsManagerProps) {
  const [goals, setGoals] = useState<BodyCompositionGoals>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const existingGoals = bodyCompositionService.getGoals();
    setGoals(existingGoals);
  }, []);

  const handleInputChange = (field: keyof BodyCompositionGoals, value: string | number) => {
    setGoals(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateGoals = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (goals.weight && (goals.weight < 30 || goals.weight > 300)) {
      newErrors.weight = 'Gewichtsdoel moet tussen 30 en 300 kg zijn';
    }

    if (goals.bodyFat && (goals.bodyFat < 3 || goals.bodyFat > 50)) {
      newErrors.bodyFat = 'Vetpercentage doel moet tussen 3% en 50% zijn';
    }

    if (goals.muscleMass && (goals.muscleMass < 10 || goals.muscleMass > 100)) {
      newErrors.muscleMass = 'Spiermassa doel moet tussen 10 en 100 kg zijn';
    }

    if (goals.waistCircumference && (goals.waistCircumference < 50 || goals.waistCircumference > 200)) {
      newErrors.waistCircumference = 'Taille omtrek doel moet tussen 50 en 200 cm zijn';
    }

    if (goals.visceralFat && (goals.visceralFat < 1 || goals.visceralFat > 30)) {
      newErrors.visceralFat = 'Visceraal vet doel moet tussen 1 en 30 zijn';
    }

    if (goals.bmr && (goals.bmr < 800 || goals.bmr > 4000)) {
      newErrors.bmr = 'BMR doel moet tussen 800 en 4000 kcal zijn';
    }

    if (goals.targetDate && new Date(goals.targetDate) < new Date()) {
      newErrors.targetDate = 'Streefdatum moet in de toekomst liggen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateGoals()) {
      bodyCompositionService.saveGoals(goals);
      onGoalsSaved();
    }
  };

  const getCurrentValue = (field: keyof BodyCompositionGoals): number | undefined => {
    const latest = bodyCompositionService.getLatestMeasurement();
    if (!latest) return undefined;
    
    switch (field) {
      case 'weight':
        return latest.metrics.weight;
      case 'bodyFat':
        return latest.metrics.bodyFat;
      case 'muscleMass':
        return latest.metrics.muscleMass;
      case 'waistCircumference':
        return latest.metrics.waistCircumference;
      case 'visceralFat':
        return latest.metrics.visceralFat;
      case 'bmr':
        return latest.metrics.bmr;
      default:
        return undefined;
    }
  };

  const goalFields = [
    { key: 'weight', label: 'Gewicht', unit: 'kg', step: 0.1, icon: '⚖️' },
    { key: 'bodyFat', label: 'Vetpercentage', unit: '%', step: 0.1, icon: '📊' },
    { key: 'muscleMass', label: 'Spiermassa', unit: 'kg', step: 0.1, icon: '💪' },
    { key: 'waistCircumference', label: 'Taille Omtrek', unit: 'cm', step: 1, icon: '📏' },
    { key: 'visceralFat', label: 'Visceraal Vet', unit: 'level', step: 1, icon: '🫀' },
    { key: 'bmr', label: 'BMR', unit: 'kcal', step: 1, icon: '🔥' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#2A2D3A] p-4 rounded-lg border-l-4 border-[#E33412]">
        <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <span>🎯</span>
          Stel je doelen in
        </h4>
        <p className="text-gray-300 text-sm">
          Bepaal waar je naartoe wilt werken. Je kunt altijd je doelen aanpassen naarmate je vordert.
        </p>
      </div>

      {/* Target Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
            <span>📅</span>
            Streefdatum (optioneel)
          </label>
          <input 
            type="date" 
            value={goals.targetDate || ''}
            onChange={(e) => handleInputChange('targetDate', e.target.value)}
            className={`w-full bg-[#2A2D3A] text-white p-3 rounded-lg border transition-colors focus:outline-none ${
              errors.targetDate 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-[#3A3D4A] focus:border-[#E33412]'
            }`}
          />
          {errors.targetDate && (
            <p className="text-red-400 text-xs mt-1">{errors.targetDate}</p>
          )}
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goalFields.map((field) => {
          const currentValue = getCurrentValue(field.key as keyof BodyCompositionGoals);
          
          return (
            <div key={field.key} className="p-4 bg-[#2A2D3A] rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{field.icon}</span>
                <h4 className="text-white font-medium">{field.label}</h4>
              </div>
              
              {currentValue && (
                <div className="text-sm text-gray-400 mb-2">
                  Huidige waarde: {currentValue} {field.unit}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step={field.step}
                  value={goals[field.key as keyof BodyCompositionGoals] || ''}
                  onChange={(e) => handleInputChange(field.key as keyof BodyCompositionGoals, parseFloat(e.target.value) || '')}
                  placeholder={`Bijv. ${field.key === 'weight' ? '70.0' : field.key === 'bodyFat' ? '10.0' : field.key === 'muscleMass' ? '45.0' : field.key === 'waistCircumference' ? '80' : field.key === 'visceralFat' ? '4' : '2000'}`}
                  className={`flex-1 bg-[#3A3D4A] text-white p-3 rounded-lg border transition-colors focus:outline-none ${
                    errors[field.key] 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-[#4A4D5A] focus:border-[#E33412]'
                  }`}
                />
                <span className="text-gray-400 text-sm">{field.unit}</span>
              </div>
              
              {errors[field.key] && (
                <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
              )}
              
              {/* Progress indicator */}
              {currentValue && goals[field.key as keyof BodyCompositionGoals] && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Voortgang</span>
                    <span>
                      {field.key === 'weight' || field.key === 'bodyFat' || field.key === 'waistCircumference' || field.key === 'visceralFat'
                        ? `${Math.abs(currentValue - (goals[field.key as keyof BodyCompositionGoals] as number)).toFixed(1)} ${field.unit} te gaan`
                        : `${Math.abs((goals[field.key as keyof BodyCompositionGoals] as number) - currentValue).toFixed(1)} ${field.unit} te gaan`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-[#4A4D5A] rounded-full h-2">
                    <div 
                      className="bg-[#E33412] h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 
                          field.key === 'weight' || field.key === 'bodyFat' || field.key === 'waistCircumference' || field.key === 'visceralFat'
                            ? ((currentValue - (goals[field.key as keyof BodyCompositionGoals] as number)) / currentValue) * 100
                            : (((goals[field.key as keyof BodyCompositionGoals] as number) - currentValue) / (goals[field.key as keyof BodyCompositionGoals] as number)) * 100
                        ))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
        <button 
          onClick={handleSave}
          className="bg-[#E33412] text-white px-6 py-3 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2"
        >
          <span>💾</span>
          Doelen Opslaan
        </button>
        <button 
          onClick={onCancel}
          className="bg-[#3A3D4A] text-white px-6 py-3 rounded-lg hover:bg-[#4A4D5A] transition-colors font-medium flex items-center gap-2"
        >
          <span>❌</span>
          Annuleren
        </button>
      </div>

      {/* Tips */}
      <div className="bg-[#2A2D3A] p-4 rounded-lg border-l-4 border-green-400">
        <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <span>💡</span>
          Tips voor realistische doelen
        </h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Stel SMART doelen: Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden</li>
          <li>• Gewichtsverlies: 0.5-1 kg per week is gezond en haalbaar</li>
          <li>• Vetpercentage: 1-2% per maand is een realistische doelstelling</li>
          <li>• Spiermassa: 0.5-1 kg per maand voor beginners, minder voor gevorderden</li>
          <li>• Geef jezelf voldoende tijd om je doelen te bereiken</li>
        </ul>
      </div>
    </div>
  );
} 