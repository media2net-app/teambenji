import { useState } from 'react';

interface MetricsLoggerProps {
  onSave: (metrics: BodyMetrics) => void;
  onCancel: () => void;
  initialData?: Partial<BodyMetrics>;
}

export interface BodyMetrics {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waistCircumference?: number;
  visceralFat?: number;
  bmr?: number;
  waterPercentage?: number;
  boneMass?: number;
  notes?: string;
}

export default function MetricsLogger({ onSave, onCancel, initialData }: MetricsLoggerProps) {
  const [metrics, setMetrics] = useState<BodyMetrics>({
    date: new Date().toISOString().split('T')[0],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BodyMetrics, value: string | number) => {
    setMetrics(prev => ({
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

  const validateMetrics = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (metrics.weight && (metrics.weight < 30 || metrics.weight > 300)) {
      newErrors.weight = 'Gewicht moet tussen 30 en 300 kg zijn';
    }

    if (metrics.bodyFat && (metrics.bodyFat < 3 || metrics.bodyFat > 50)) {
      newErrors.bodyFat = 'Vetpercentage moet tussen 3% en 50% zijn';
    }

    if (metrics.muscleMass && (metrics.muscleMass < 10 || metrics.muscleMass > 100)) {
      newErrors.muscleMass = 'Spiermassa moet tussen 10 en 100 kg zijn';
    }

    if (metrics.waistCircumference && (metrics.waistCircumference < 50 || metrics.waistCircumference > 200)) {
      newErrors.waistCircumference = 'Taille omtrek moet tussen 50 en 200 cm zijn';
    }

    if (metrics.visceralFat && (metrics.visceralFat < 1 || metrics.visceralFat > 30)) {
      newErrors.visceralFat = 'Visceraal vet moet tussen 1 en 30 zijn';
    }

    if (metrics.bmr && (metrics.bmr < 800 || metrics.bmr > 4000)) {
      newErrors.bmr = 'BMR moet tussen 800 en 4000 kcal zijn';
    }

    if (metrics.waterPercentage && (metrics.waterPercentage < 30 || metrics.waterPercentage > 80)) {
      newErrors.waterPercentage = 'Waterpercentage moet tussen 30% en 80% zijn';
    }

    if (metrics.boneMass && (metrics.boneMass < 1 || metrics.boneMass > 10)) {
      newErrors.boneMass = 'Botmassa moet tussen 1 en 10 kg zijn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateMetrics()) {
      onSave(metrics);
    }
  };

  const inputFields = [
    { key: 'weight', label: 'Gewicht', unit: 'kg', step: 0.1, icon: '⚖️' },
    { key: 'bodyFat', label: 'Vetpercentage', unit: '%', step: 0.1, icon: '📊' },
    { key: 'muscleMass', label: 'Spiermassa', unit: 'kg', step: 0.1, icon: '💪' },
    { key: 'waistCircumference', label: 'Taille Omtrek', unit: 'cm', step: 1, icon: '📏' },
    { key: 'visceralFat', label: 'Visceraal Vet', unit: 'level', step: 1, icon: '🫀' },
    { key: 'bmr', label: 'BMR', unit: 'kcal', step: 1, icon: '🔥' },
    { key: 'waterPercentage', label: 'Waterpercentage', unit: '%', step: 0.1, icon: '💧' },
    { key: 'boneMass', label: 'Botmassa', unit: 'kg', step: 0.1, icon: '🦴' }
  ];

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
            <span>📅</span>
            Datum
          </label>
          <input 
            type="date" 
            value={metrics.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inputFields.map((field) => (
          <div key={field.key}>
            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
              <span>{field.icon}</span>
              {field.label} ({field.unit})
            </label>
            <input 
              type="number" 
              step={field.step}
              value={metrics[field.key as keyof BodyMetrics] || ''}
              onChange={(e) => handleInputChange(field.key as keyof BodyMetrics, parseFloat(e.target.value) || '')}
              className={`w-full bg-[#2A2D3A] text-white p-3 rounded-lg border transition-colors focus:outline-none ${
                errors[field.key] 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-[#3A3D4A] focus:border-[#E33412]'
              }`}
              placeholder={`Bijv. ${field.key === 'weight' ? '75.2' : field.key === 'bodyFat' ? '12.5' : field.key === 'muscleMass' ? '42.8' : field.key === 'waistCircumference' ? '82' : field.key === 'visceralFat' ? '6' : field.key === 'bmr' ? '1847' : field.key === 'waterPercentage' ? '58.5' : '3.2'}`}
            />
            {errors[field.key] && (
              <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
          <span>📝</span>
          Notities (optioneel)
        </label>
        <textarea 
          value={metrics.notes || ''}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Voeg eventuele notities toe over je meting..."
          rows={3}
          className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#3A3D4A]">
        <button 
          onClick={handleSave}
          className="bg-[#E33412] text-white px-6 py-3 rounded-lg hover:bg-[#b9260e] transition-colors font-medium flex items-center gap-2"
        >
          <span>💾</span>
          Meting Opslaan
        </button>
        <button 
          onClick={onCancel}
          className="bg-[#3A3D4A] text-white px-6 py-3 rounded-lg hover:bg-[#4A4D5A] transition-colors font-medium flex items-center gap-2"
        >
          <span>❌</span>
          Annuleren
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-[#2A2D3A] p-4 rounded-lg border-l-4 border-blue-400">
        <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <span>💡</span>
          Tips voor nauwkeurige metingen
        </h4>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Meet altijd op hetzelfde tijdstip (bij voorkeur 's ochtends)</li>
          <li>• Zorg dat je nuchter bent voor de meting</li>
          <li>• Gebruik dezelfde weegschaal en meetapparatuur</li>
          <li>• Houd rekening met hydratatie en voedingsstatus</li>
          <li>• Noteer bijzonderheden die van invloed kunnen zijn</li>
        </ul>
      </div>
    </div>
  );
} 