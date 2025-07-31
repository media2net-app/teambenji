import DataCard from '../components/DataCard';

export default function PlanningPage() {
  const todaySchedule = [
    { time: '07:00', activity: 'Ochtend cardio', type: 'workout', duration: '30 min' },
    { time: '12:00', activity: 'Lunch met trainer', type: 'meeting', duration: '60 min' },
    { time: '18:00', activity: 'Push workout', type: 'workout', duration: '75 min' },
    { time: '20:00', activity: 'Yoga & stretching', type: 'recovery', duration: '45 min' }
  ];

  const weekSchedule = [
    { day: 'Ma', workouts: 2, meetings: 1, recovery: 1 },
    { day: 'Di', workouts: 1, meetings: 0, recovery: 1 },
    { day: 'Wo', workouts: 2, meetings: 1, recovery: 0 },
    { day: 'Do', workouts: 1, meetings: 2, recovery: 1 },
    { day: 'Vr', workouts: 2, meetings: 0, recovery: 1 },
    { day: 'Za', workouts: 1, meetings: 1, recovery: 2 },
    { day: 'Zo', workouts: 0, meetings: 0, recovery: 2 }
  ];

  const upcomingEvents = [
    { date: 'Morgen', title: 'Fitness assessment', time: '10:00', trainer: 'Sarah Wilson' },
    { date: 'Woensdag', title: 'Voedingsadvies', time: '14:00', trainer: 'Mike Chen' },
    { date: 'Vrijdag', title: 'Groepstraining', time: '19:00', trainer: 'Lisa Brown' },
    { date: 'Zaterdag', title: 'Personal training', time: '09:00', trainer: 'Mark Johnson' }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Planning</h1>
          <p className="text-gray-400 text-sm sm:text-base">Beheer je trainingsschema en afspraken</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium text-sm sm:text-base w-full sm:w-auto">
          + Afspraak maken
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <DataCard
          title="Vandaag"
          value="4"
          change="2 workouts"
          changeType="positive"
          icon="📅"
          subtitle="geplande activiteiten"
        />
        <DataCard
          title="Deze week"
          value="18"
          change="+3"
          changeType="positive"
          icon="🗓️"
          subtitle="totale sessies"
        />
        <DataCard
          title="Komende maand"
          value="72"
          change="+12"
          changeType="positive"
          icon="📊"
          subtitle="geplande uren"
        />
        <DataCard
          title="Trainers"
          value="4"
          change="Actief"
          changeType="positive"
          icon="👥"
          subtitle="beschikbare coaches"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <DataCard title="Today's Planning" value="" icon="⏰">
            <div className="space-y-4">
              {todaySchedule.map((item, index) => (
                <div key={index} className="p-4 bg-[#2A2D3A] rounded-lg border border-[#3A3D4A] hover:border-[#E33412] transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-[#E33412] font-bold text-lg">{item.time}</div>
                      <div>
                        <h3 className="text-white font-semibold">{item.activity}</h3>
                        <p className="text-gray-400 text-sm">{item.duration}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === 'workout' ? 'bg-[#E33412] text-white' :
                      item.type === 'meeting' ? 'bg-blue-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {item.type === 'workout' ? 'Workout' : 
                       item.type === 'meeting' ? 'Appointment' : 'Recovery'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-[#E33412] text-white px-3 py-1 rounded text-sm hover:bg-[#b9260e] transition-colors">
                      Start
                    </button>
                    <button className="bg-[#3A3D4A] text-white px-3 py-1 rounded text-sm hover:bg-[#4A4D5A] transition-colors">
                      Edit
                    </button>
                    <button className="bg-[#3A3D4A] text-white px-3 py-1 rounded text-sm hover:bg-[#4A4D5A] transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>
        </div>

        {/* Week Overview */}
        <div className="space-y-6">
          <DataCard title="Week Overview" value="" icon="📊">
            <div className="space-y-3">
              {weekSchedule.map((day, index) => (
                <div key={index} className="p-3 bg-[#2A2D3A] rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{day.day}</span>
                    <span className="text-gray-400 text-sm">
                      {day.workouts + day.meetings + day.recovery} activities
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-[#E33412] font-semibold">{day.workouts}</div>
                      <div className="text-gray-400">Workouts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">{day.meetings}</div>
                      <div className="text-gray-400">Meetings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-semibold">{day.recovery}</div>
                      <div className="text-gray-400">Recovery</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataCard>

          <DataCard title="Upcoming Appointments" value="" icon="🎯">
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 bg-[#2A2D3A] rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm">{event.title}</h4>
                      <p className="text-gray-400 text-xs">{event.trainer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[#E33412] font-semibold text-sm">{event.time}</div>
                      <div className="text-gray-400 text-xs">{event.date}</div>
                    </div>
                  </div>
                  <button className="w-full bg-[#3A3D4A] text-white py-1 rounded text-xs hover:bg-[#4A4D5A] transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      </div>

      {/* Calendar View */}
      <DataCard title="Calendar Overview" value="" icon="📅">
        <div className="grid grid-cols-7 gap-2">
          {/* Calendar Header */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-gray-400 font-medium p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i - 5; // Start from previous month
            const isCurrentMonth = dayNum > 0 && dayNum <= 30;
            const isToday = dayNum === 15;
            const hasWorkout = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29].includes(dayNum);
            
            return (
              <div
                key={i}
                className={`aspect-square p-2 rounded-lg border transition-all cursor-pointer ${
                  isCurrentMonth 
                    ? isToday 
                      ? 'bg-[#E33412] border-[#E33412] text-white' 
                      : 'bg-[#2A2D3A] border-[#3A3D4A] text-white hover:border-[#E33412]'
                    : 'bg-[#1A1D29] border-[#2A2D3A] text-gray-500'
                }`}
              >
                <div className="text-sm font-medium">
                  {isCurrentMonth ? dayNum : dayNum <= 0 ? 30 + dayNum : dayNum - 30}
                </div>
                {hasWorkout && isCurrentMonth && (
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </DataCard>
    </div>
  );
} 