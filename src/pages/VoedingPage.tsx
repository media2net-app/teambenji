import DataCard from '../components/DataCard';
import AIRecommendations from '../components/AIRecommendations';

export default function VoedingPage() {
  const macros = {
    calories: { current: 2340, target: 2500, percentage: 94 },
    protein: { current: 165, target: 180, percentage: 92 },
    carbs: { current: 280, target: 320, percentage: 88 },
    fats: { current: 78, target: 85, percentage: 92 }
  };

  const meals = [
    {
      id: 1,
      name: 'Ontbijt',
      time: '07:30',
      calories: 520,
      protein: 28,
      carbs: 65,
      fats: 18,
      foods: ['Havermout met banaan', 'Griekse yoghurt', 'Amandelen', 'Honing']
    },
    {
      id: 2,
      name: 'Lunch',
      time: '12:30',
      calories: 680,
      protein: 45,
      carbs: 72,
      fats: 22,
      foods: ['Kip salade', 'Volkoren brood', 'Avocado', 'Olijfolie']
    },
    {
      id: 3,
      name: 'Pre-workout',
      time: '17:00',
      calories: 280,
      protein: 25,
      carbs: 35,
      fats: 8,
      foods: ['Protein shake', 'Banaan', 'Pindakaas']
    },
    {
      id: 4,
      name: 'Diner',
      time: '19:30',
      calories: 720,
      protein: 52,
      carbs: 85,
      fats: 24,
      foods: ['Zalm filet', 'Zoete aardappel', 'Broccoli', 'Olijfolie']
    }
  ];

  const waterIntake = { current: 2.4, target: 3.0 };

  const weeklyProgress = [
    { day: 'Ma', calories: 2450, target: 2500 },
    { day: 'Di', calories: 2380, target: 2500 },
    { day: 'Wo', calories: 2520, target: 2500 },
    { day: 'Do', calories: 2340, target: 2500 },
    { day: 'Vr', calories: 2480, target: 2500 },
    { day: 'Za', calories: 2650, target: 2500 },
    { day: 'Zo', calories: 2420, target: 2500 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Voeding</h1>
          <p className="text-gray-400">Track je macro's en bereik je doelen</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
          + Maaltijd toevoegen
        </button>
      </div>

      {/* Macro Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Calories"
          value={`${macros.calories.current}`}
          change={`${macros.calories.percentage}%`}
          changeType="positive"
          icon="🔥"
          subtitle={`van ${macros.calories.target} kcal`}
        >
          <div className="w-full bg-[#2A2D3A] rounded-full h-2 mt-2">
            <div className="bg-[#E33412] h-2 rounded-full" style={{ width: `${macros.calories.percentage}%` }}></div>
          </div>
        </DataCard>

        <DataCard
          title="Eiwit"
          value={`${macros.protein.current}g`}
          change={`${macros.protein.percentage}%`}
          changeType="positive"
          icon="🥩"
          subtitle={`van ${macros.protein.target}g`}
        >
          <div className="w-full bg-[#2A2D3A] rounded-full h-2 mt-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: `${macros.protein.percentage}%` }}></div>
          </div>
        </DataCard>

        <DataCard
          title="Koolhydraten"
          value={`${macros.carbs.current}g`}
          change={`${macros.carbs.percentage}%`}
          changeType="neutral"
          icon="🍞"
          subtitle={`van ${macros.carbs.target}g`}
        >
          <div className="w-full bg-[#2A2D3A] rounded-full h-2 mt-2">
            <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${macros.carbs.percentage}%` }}></div>
          </div>
        </DataCard>

        <DataCard
          title="Vetten"
          value={`${macros.fats.current}g`}
          change={`${macros.fats.percentage}%`}
          changeType="positive"
          icon="🥑"
          subtitle={`van ${macros.fats.target}g`}
        >
          <div className="w-full bg-[#2A2D3A] rounded-full h-2 mt-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${macros.fats.percentage}%` }}></div>
          </div>
        </DataCard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Meals */}
        <div className="lg:col-span-2">
          <DataCard title="Vandaag's Maaltijden" value="" icon="🍽️">
            <div className="space-y-4">
              {meals.map((meal) => (
                <div key={meal.id} className="p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A] hover:border-[#E33412] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{meal.name}</h3>
                      <span className="text-gray-400 text-sm">{meal.time}</span>
                    </div>
                    <span className="text-[#E33412] font-semibold">{meal.calories} kcal</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div className="text-center">
                      <div className="text-green-400 font-semibold">{meal.protein}g</div>
                      <div className="text-gray-400 text-xs">Eiwit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">{meal.carbs}g</div>
                      <div className="text-gray-400 text-xs">Koolhydraten</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-semibold">{meal.fats}g</div>
                      <div className="text-gray-400 text-xs">Vetten</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {meal.foods.map((food, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {food}</div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="bg-[#E33412] text-white px-3 py-1 rounded text-sm hover:bg-[#b9260e] transition-colors">
                      Bewerken
                    </button>
                    <button className="bg-[#3A3D4A] text-white px-3 py-1 rounded text-sm hover:bg-[#4A4D5A] transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Water Intake */}
          <DataCard title="Water Inname" value={`${waterIntake.current}L`} icon="💧" subtitle={`van ${waterIntake.target}L`}>
            <div className="space-y-3">
              <div className="w-full bg-[#2A2D3A] rounded-full h-3">
                <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${(waterIntake.current / waterIntake.target) * 100}%` }}></div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                  <div
                    key={glass}
                    className={`h-8 rounded ${glass <= waterIntake.current * 4 ? 'bg-blue-400' : 'bg-[#2A2D3A]'} flex items-center justify-center text-xs text-white`}
                  >
                    💧
                  </div>
                ))}
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                + Glas water
              </button>
            </div>
          </DataCard>

          {/* Quick Add */}
          <DataCard title="Snel toevoegen" value="" icon="⚡">
            <div className="space-y-2">
              {['Protein shake', 'Banaan', 'Amandelen', 'Griekse yoghurt', 'Havermout'].map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 bg-[#2A2D3A] rounded hover:bg-[#3A3D4A] transition-colors text-white text-sm"
                >
                  + {item}
                </button>
              ))}
            </div>
          </DataCard>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <DataCard title="Week Overzicht" value="" icon="📊">
          <div className="grid grid-cols-7 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-400 text-sm mb-2">{day.day}</div>
                <div className="bg-[#2A2D3A] rounded-lg p-3">
                  <div className="text-white font-semibold text-sm">{day.calories}</div>
                  <div className="text-gray-400 text-xs">van {day.target}</div>
                  <div className="w-full bg-[#3A3D4A] rounded-full h-1 mt-2">
                    <div 
                      className={`h-1 rounded-full ${day.calories >= day.target ? 'bg-green-400' : 'bg-[#E33412]'}`}
                      style={{ width: `${Math.min((day.calories / day.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* AI Nutrition Recommendations */}
        <DataCard title="AI Voeding Aanbevelingen" value="" icon="🤖">
          <AIRecommendations 
            category="nutrition"
            maxItems={4} 
            showControls={false} 
            compact={true}
          />
        </DataCard>
      </div>
    </div>
  );
} 