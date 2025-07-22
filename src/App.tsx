import logo from './logo.png'
import { useState } from 'react'
import FloatingChatWidget from './components/FloatingChatWidget';
import DemoLock from './components/DemoLock';

function App() {
  const [email, setEmail] = useState('demo@teambenji.nl')
  const [password, setPassword] = useState('wachtwoord123')
  const [role, setRole] = useState<'user' | 'admin'>('user')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo is locked - no navigation allowed
    // The DemoLock overlay will prevent access to any pages
  }

  return (
    <>
      <div className="min-h-screen w-full bg-[#1F1F1F] flex items-center justify-center">
        <div className="bg-[#1F1F1F] p-8 rounded-lg shadow-md w-full max-w-md border border-[#222] animate-fadein">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Team Benji logo" className="h-16 w-auto animate-logo-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6 animate-fadein-slow">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent text-white bg-[#232323] placeholder-gray-400 transition-all duration-200"
                placeholder="je@email.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Wachtwoord
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent text-white bg-[#232323] placeholder-gray-400 transition-all duration-200"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-1">
                Login als
              </label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value as 'user' | 'admin')}
                className="w-full px-3 py-2 border border-[#333] rounded-md focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:border-transparent text-white bg-[#232323] transition-all duration-200"
              >
                <option value="user">Gebruiker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E33412] text-white py-2 px-4 rounded-md hover:bg-[#b9260e] focus:outline-none focus:ring-2 focus:ring-[#E33412] focus:ring-offset-2 transition-all duration-200 font-semibold scale-100 hover:scale-105 active:scale-95"
            >
              Inloggen
            </button>
          </form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-[#E33412] hover:underline transition-colors duration-200 hover:text-white">
              Wachtwoord vergeten?
            </a>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Nog geen account?{' '}
              <a href="#" className="text-[#E33412] hover:underline font-semibold transition-colors duration-200 hover:text-white">
                Registreer hier
              </a>
            </p>
          </div>
          <div className="mt-4 text-center">
            <a href="/admin" className="text-xs text-gray-400 hover:text-[#E33412] transition-colors duration-200">
              Admin Dashboard
            </a>
          </div>
        </div>
      </div>
      <DemoLock />
      <FloatingChatWidget />
      <style>{`
        .animate-fadein {
          animation: fadein 1s ease;
        }
        .animate-fadein-slow {
          animation: fadein 2s ease;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-logo-bounce {
          animation: logo-bounce 1.2s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes logo-bounce {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  )
}

export default App
