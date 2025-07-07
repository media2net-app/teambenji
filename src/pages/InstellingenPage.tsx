import DataCard from '../components/DataCard';

export default function InstellingenPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Instellingen</h1>
          <p className="text-gray-400">Beheer je profiel en voorkeuren</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <DataCard title="Profiel Informatie" value="" icon="👤">
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-[#E33412] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">JD</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">John Doe</h3>
                  <p className="text-gray-400">john.doe@teambenji.nl</p>
                  <button className="text-[#E33412] text-sm hover:underline mt-1">
                    Profielfoto wijzigen
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Voornaam</label>
                  <input 
                    type="text" 
                    defaultValue="John" 
                    className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Achternaam</label>
                  <input 
                    type="text" 
                    defaultValue="Doe" 
                    className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue="john.doe@teambenji.nl" 
                    className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Telefoon</label>
                  <input 
                    type="tel" 
                    defaultValue="+31 6 1234 5678" 
                    className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </DataCard>

          <DataCard title="Fitness Profiel" value="" icon="💪">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Lengte (cm)</label>
                <input 
                  type="number" 
                  defaultValue="180" 
                  className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Gewicht (kg)</label>
                <input 
                  type="number" 
                  defaultValue="75" 
                  className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Geboortedatum</label>
                <input 
                  type="date" 
                  defaultValue="1990-01-01" 
                  className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Fitness Level</label>
                <select className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none">
                  <option>Beginner</option>
                  <option selected>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>
          </DataCard>

          <DataCard title="Doelen" value="" icon="🎯">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Primaire Doel</label>
                <select className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none">
                  <option>Gewicht verliezen</option>
                  <option selected>Spiermassa opbouwen</option>
                  <option>Kracht verbeteren</option>
                  <option>Conditie verbeteren</option>
                  <option>Algemene fitness</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Streefgewicht (kg)</label>
                <input 
                  type="number" 
                  defaultValue="80" 
                  className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Trainingen per week</label>
                <input 
                  type="number" 
                  defaultValue="4" 
                  className="w-full bg-[#2A2D3A] text-white p-3 rounded-lg border border-[#3A3D4A] focus:border-[#E33412] focus:outline-none"
                />
              </div>
            </div>
          </DataCard>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <DataCard title="App Voorkeuren" value="" icon="⚙️">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Notificaties</span>
                <button className="bg-[#E33412] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Dark Mode</span>
                <button className="bg-[#E33412] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Auto-sync</span>
                <button className="bg-[#E33412] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Wearable koppeling</span>
                <button className="bg-[#3A3D4A] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
            </div>
          </DataCard>

          <DataCard title="Privacy" value="" icon="🔒">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Profiel zichtbaar</span>
                <button className="bg-[#E33412] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Data delen</span>
                <button className="bg-[#3A3D4A] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Analytics</span>
                <button className="bg-[#E33412] relative inline-flex h-6 w-11 rounded-full transition-colors">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform mt-1"></span>
                </button>
              </div>
            </div>
          </DataCard>

          <DataCard title="Account" value="" icon="👥">
            <div className="space-y-3">
              <button className="w-full bg-[#3A3D4A] text-white p-3 rounded-lg hover:bg-[#4A4D5A] transition-colors text-left">
                Wachtwoord wijzigen
              </button>
              <button className="w-full bg-[#3A3D4A] text-white p-3 rounded-lg hover:bg-[#4A4D5A] transition-colors text-left">
                Twee-factor authenticatie
              </button>
              <button className="w-full bg-[#3A3D4A] text-white p-3 rounded-lg hover:bg-[#4A4D5A] transition-colors text-left">
                Data exporteren
              </button>
              <button className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors text-left">
                Account verwijderen
              </button>
            </div>
          </DataCard>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-[#E33412] text-white px-6 py-3 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
          Wijzigingen opslaan
        </button>
      </div>
    </div>
  );
} 