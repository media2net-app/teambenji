import DataCard from '../components/DataCard';
import AIRecommendations from '../components/AIRecommendations';

export default function TrainingenPage() {
  const upcomingWorkouts = [
    { id: 1, name: 'Push Day - Chest & Triceps', date: 'Vandaag', time: '18:00', trainer: 'Mark Johnson', duration: '60 min', location: 'Studio A' },
    { id: 2, name: 'Pull Day - Back & Biceps', date: 'Morgen', time: '19:00', trainer: 'Sarah Wilson', duration: '75 min', location: 'Studio B' },
    { id: 3, name: 'Leg Day - Quads & Glutes', date: 'Woensdag', time: '17:30', trainer: 'Mike Chen', duration: '90 min', location: 'Studio A' },
    { id: 4, name: 'Cardio & Core', date: 'Donderdag', time: '18:30', trainer: 'Lisa Brown', duration: '45 min', location: 'Cardio Zone' },
  ];

  const workoutHistory = [
    { id: 1, name: 'Upper Body Strength', date: '2 dagen geleden', duration: '65 min', calories: 420, sets: 18, reps: 156 },
    { id: 2, name: 'HIIT Cardio', date: '4 dagen geleden', duration: '30 min', calories: 380, sets: 8, reps: 240 },
    { id: 3, name: 'Full Body Circuit', date: '6 dagen geleden', duration: '55 min', calories: 395, sets: 15, reps: 180 },
    { id: 4, name: 'Yoga & Stretching', date: '1 week geleden', duration: '45 min', calories: 180, sets: 12, reps: 0 },
  ];

  const exercises = [
    { name: 'Bench Press', sets: '4x8', weight: '80kg', lastWeek: '77.5kg' },
    { name: 'Squat', sets: '4x10', weight: '100kg', lastWeek: '95kg' },
    { name: 'Deadlift', sets: '3x6', weight: '120kg', lastWeek: '115kg' },
    { name: 'Pull-ups', sets: '3x12', weight: 'Bodyweight', lastWeek: 'Bodyweight' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Mijn Trainingen</h1>
          <p className="text-gray-400">Plan, volg en analyseer je workouts</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
          + Nieuwe Training
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Deze week"
          value="4"
          change="+1"
          changeType="positive"
          icon="💪"
          subtitle="van 5 gepland"
        />
        <DataCard
          title="Totale tijd"
          value="5.2u"
          change="+45m"
          changeType="positive"
          icon="⏱️"
          subtitle="deze week"
        />
        <DataCard
          title="Calories verbrand"
          value="1,680"
          change="+12%"
          changeType="positive"
          icon="🔥"
          subtitle="deze week"
        />
        <DataCard
          title="PR's behaald"
          value="3"
          change="+2"
          changeType="positive"
          icon="🏆"
          subtitle="deze maand"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Workouts */}
        <div className="lg:col-span-2">
          <DataCard title="Komende Trainingen" value="" icon="📅">
            <div className="space-y-4">
              {upcomingWorkouts.map((workout) => (
                <div key={workout.id} className="p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A] hover:border-[#E33412] transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{workout.name}</h3>
                    <span className="text-[#E33412] text-sm font-medium">{workout.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-400">Tijd: <span className="text-white">{workout.time}</span></div>
                    <div className="text-gray-400">Duur: <span className="text-white">{workout.duration}</span></div>
                    <div className="text-gray-400">Trainer: <span className="text-white">{workout.trainer}</span></div>
                    <div className="text-gray-400">Locatie: <span className="text-white">{workout.location}</span></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-[#E33412] text-white px-3 py-1 rounded text-sm hover:bg-[#b9260e] transition-colors">
                      Start Training
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

        {/* Current Exercises */}
        <div className="lg:col-span-1">
          <DataCard title="Huidige Oefeningen" value="" icon="🏋️">
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="p-3 bg-[#2A2D3A] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium text-sm">{exercise.name}</h4>
                    <span className="text-[#E33412] text-xs">{exercise.sets}</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Huidig:</span>
                      <span className="text-white">{exercise.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vorige week:</span>
                      <span className="text-gray-300">{exercise.lastWeek}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout History */}
        <DataCard title="Training Historie" value="" icon="📊">
          <div className="space-y-3">
            {workoutHistory.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-4 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E33412] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💪</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{workout.name}</h3>
                    <p className="text-gray-400 text-sm">{workout.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-white font-semibold">{workout.duration}</div>
                    <div className="text-gray-400 text-xs">Duur</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{workout.calories}</div>
                    <div className="text-gray-400 text-xs">Calories</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* AI Training Recommendations */}
        <DataCard title="AI Training Aanbevelingen" value="" icon="🤖">
          <AIRecommendations 
            category="training"
            maxItems={4} 
            showControls={false} 
            compact={true}
          />
        </DataCard>
      </div>
    </div>
  );
} 