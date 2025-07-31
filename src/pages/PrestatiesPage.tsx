import DataCard from '../components/DataCard';

export default function PrestatiesPage() {
  const personalRecords = [
    { exercise: 'Bench Press', weight: '85kg', date: '2 weken geleden', improvement: '+5kg' },
    { exercise: 'Squat', weight: '120kg', date: '1 week geleden', improvement: '+10kg' },
    { exercise: 'Deadlift', weight: '140kg', date: '3 dagen geleden', improvement: '+7.5kg' },
    { exercise: 'Pull-ups', reps: '15', date: '1 week geleden', improvement: '+3 reps' }
  ];

  const strengthProgress = [
    { month: 'Jan', bench: 70, squat: 90, deadlift: 110 },
    { month: 'Feb', bench: 72, squat: 95, deadlift: 115 },
    { month: 'Mar', bench: 75, squat: 100, deadlift: 120 },
    { month: 'Apr', bench: 78, squat: 105, deadlift: 125 },
    { month: 'Mei', bench: 80, squat: 110, deadlift: 130 },
    { month: 'Jun', bench: 85, squat: 120, deadlift: 140 }
  ];

  const achievements = [
    { title: 'Eerste 100kg Squat', date: 'Maart 2024', icon: '🏆' },
    { title: '30 Dagen Consistent', date: 'April 2024', icon: '🔥' },
    { title: 'Bodyweight Bench Press', date: 'Mei 2024', icon: '💪' },
    { title: '1000 Push-ups Challenge', date: 'Juni 2024', icon: '⭐' }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Prestaties</h1>
          <p className="text-gray-400 text-sm sm:text-base">Volg je vooruitgang en behaalde doelen</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto">
          Nieuwe PR loggen
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <DataCard
          title="Totaal PR's"
          value="23"
          change="+4"
          changeType="positive"
          icon="🏆"
          subtitle="deze maand"
        />
        <DataCard
          title="Sterkste lift"
          value="140kg"
          change="+7.5kg"
          changeType="positive"
          icon="💪"
          subtitle="Deadlift"
        />
        <DataCard
          title="Consistentie"
          value="87%"
          change="+12%"
          changeType="positive"
          icon="📈"
          subtitle="trainingen voltooid"
        />
        <DataCard
          title="Totaal volume"
          value="2,340kg"
          change="+18%"
          changeType="positive"
          icon="⚡"
          subtitle="deze week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Personal Records */}
        <div className="lg:col-span-2">
          <DataCard title="Persoonlijke Records" value="" icon="🏆">
            <div className="space-y-4">
              {personalRecords.map((pr, index) => (
                <div key={index} className="p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A] hover:border-[#E33412] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{pr.exercise}</h3>
                    <span className="text-green-400 font-bold">{pr.improvement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#E33412] font-bold text-lg">{pr.weight || pr.reps}</div>
                      <div className="text-gray-400 text-sm">{pr.date}</div>
                    </div>
                    <div className="text-2xl">🎯</div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Achievements */}
        <div className="space-y-6">
          <DataCard title="Achievements" value="" icon="🏅">
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-[#2A2D3A] rounded-lg flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{achievement.title}</h4>
                    <p className="text-gray-400 text-xs">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>

          <DataCard title="Volgende Doelen" value="" icon="🎯">
            <div className="space-y-3">
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <h4 className="text-white font-medium text-sm">150kg Deadlift</h4>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2 mt-2">
                  <div className="bg-[#E33412] h-2 rounded-full" style={{ width: '93%' }}></div>
                </div>
                <p className="text-gray-400 text-xs mt-1">93% - nog 10kg te gaan</p>
              </div>
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <h4 className="text-white font-medium text-sm">20 Pull-ups</h4>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2 mt-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-gray-400 text-xs mt-1">75% - nog 5 reps te gaan</p>
              </div>
              <div className="p-3 bg-[#2A2D3A] rounded-lg">
                <h4 className="text-white font-medium text-sm">90kg Bench Press</h4>
                <div className="w-full bg-[#3A3D4A] rounded-full h-2 mt-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <p className="text-gray-400 text-xs mt-1">94% - nog 5kg te gaan</p>
              </div>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Strength Progress Chart */}
      <DataCard title="Kracht Progressie (6 maanden)" value="" icon="📊">
        <div className="space-y-4">
          <div className="flex justify-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E33412] rounded-full"></div>
              <span className="text-gray-300 text-sm">Bench Press</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Squat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Deadlift</span>
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            {strengthProgress.map((month, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-400 text-xs mb-2">{month.month}</div>
                <div className="bg-[#2A2D3A] rounded-lg p-3 space-y-2">
                  <div className="space-y-1">
                    <div className="h-2 bg-[#E33412] rounded" style={{ height: `${month.bench / 2}px` }}></div>
                    <div className="text-white text-xs font-semibold">{month.bench}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-green-400 rounded" style={{ height: `${month.squat / 2}px` }}></div>
                    <div className="text-white text-xs font-semibold">{month.squat}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-blue-400 rounded" style={{ height: `${month.deadlift / 2}px` }}></div>
                    <div className="text-white text-xs font-semibold">{month.deadlift}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DataCard>
    </div>
  );
} 