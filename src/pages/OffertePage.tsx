import { useState } from 'react';
import DataCard from '../components/DataCard';

interface ServiceCost {
  name: string;
  plan: string;
  cost: string;
  description: string;
  icon: string;
}

interface PhaseCosts {
  phase: string;
  users: string;
  totalCost: string;
  services: {
    name: string;
    cost: string;
  }[];
}

export default function OffertePage() {
  const [selectedPhase, setSelectedPhase] = useState<'launch' | 'growth' | 'scale'>('launch');

  const serviceCosts: ServiceCost[] = [
    {
      name: 'Vercel',
      plan: 'Pro Plan',
      cost: '€20/maand',
      description: 'Hosting & Deployment - Onbeperkte deployments, custom domains, SSL certificates, CDN & edge functions, analytics',
      icon: '🚀'
    },
    {
      name: 'Supabase',
      plan: 'Pro Plan',
      cost: '€25/maand',
      description: 'Database & Auth - PostgreSQL database, real-time subscriptions, authentication, storage (50GB), edge functions',
      icon: '🗄️'
    },
    {
      name: 'AWS S3',
      plan: 'Pay-as-you-go',
      cost: '€5-15/maand',
      description: 'File Storage - Image storage, document uploads, backup storage, CDN delivery',
      icon: '☁️'
    },
    {
      name: 'OpenAI API',
      plan: 'Pay-per-use',
      cost: '€50-300/maand',
      description: 'AI & Machine Learning - GPT-4 voor AI chat en insights, €0.03/1K tokens',
      icon: '🤖'
    },
    {
      name: 'Stripe',
      plan: 'Standard',
      cost: '€0 + 1.4% + €0.25 per transactie',
      description: 'Payment Processing - Subscription management, payment processing, fraud protection, multi-currency support',
      icon: '💳'
    },
    {
      name: 'SendGrid',
      plan: 'Essentials',
      cost: '€15/maand',
      description: 'Email Service - 50.000 emails/maand, email templates, analytics, deliverability tools',
      icon: '📧'
    },
    {
      name: 'Sentry',
      plan: 'Team',
      cost: '€26/maand',
      description: 'Error Tracking - Error monitoring, performance tracking, user session replay, alert notifications',
      icon: '📊'
    }
  ];

  const phaseCosts: PhaseCosts[] = [
    {
      phase: 'Launch Phase',
      users: '0-100 gebruikers',
      totalCost: '€190/maand',
      services: [
        { name: 'Vercel', cost: '€20' },
        { name: 'Supabase', cost: '€25' },
        { name: 'AWS S3', cost: '€5' },
        { name: 'OpenAI', cost: '€50' },
        { name: 'SendGrid', cost: '€15' },
        { name: 'Sentry', cost: '€26' },
        { name: 'Media2Net Support', cost: '€49' }
      ]
    },
    {
      phase: 'Growth Phase',
      users: '100-1000 gebruikers',
      totalCost: '€495-795/maand',
      services: [
        { name: 'Vercel', cost: '€20' },
        { name: 'Supabase', cost: '€25' },
        { name: 'AWS S3', cost: '€10' },
        { name: 'OpenAI', cost: '€150' },
        { name: 'SendGrid', cost: '€15' },
        { name: 'Sentry', cost: '€26' },
        { name: 'Stripe', cost: '€200-500' },
        { name: 'Media2Net Support', cost: '€49' }
      ]
    },
    {
      phase: 'Scale Phase',
      users: '1000+ gebruikers',
      totalCost: '€1450-5450+/maand',
      services: [
        { name: 'Vercel', cost: '€20' },
        { name: 'Supabase', cost: '€25' },
        { name: 'AWS S3', cost: '€15' },
        { name: 'OpenAI', cost: '€300' },
        { name: 'SendGrid', cost: '€15' },
        { name: 'Sentry', cost: '€26' },
        { name: 'Stripe', cost: '€1000-5000+' },
        { name: 'Media2Net Support', cost: '€49' }
      ]
    }
  ];

  const developmentCosts = [
    { phase: 'Backend Foundation', weeks: 'Week 1-3', cost: '€8.000' },
    { phase: 'Core Features', weeks: 'Week 4-6', cost: '€7.000' },
    { phase: 'Advanced Features', weeks: 'Week 7-9', cost: '€5.000' },
    { phase: 'Polish & Launch', weeks: 'Week 10-12', cost: '€5.000' },
    { phase: 'Test Week & Revisies', weeks: 'Week 11-12', cost: 'Inbegrepen' }
  ];

  const stripeExamples = [
    { amount: '€25', cost: '€0.60 per transactie', breakdown: '€0.35 + €0.25' },
    { amount: '€50', cost: '€0.95 per transactie', breakdown: '€0.70 + €0.25' },
    { amount: '€100', cost: '€1.65 per transactie', breakdown: '€1.40 + €0.25' }
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            TeamBenji Platform - Ontwikkeling Offerte
          </h1>
          <p className="text-gray-400 text-lg">
            Complete kosten breakdown voor het fitness & coaching platform
          </p>
        </div>

        {/* Project Visie */}
        <DataCard title="👋 Project Visie" value="All-in-One Platform" className="mb-8">
          <div className="space-y-6">
            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Platform Doel</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Een <strong>all-in-one fitness & coaching platform</strong> dat gebruikers helpt met hun gezondheidsdoelen. 
                Het systeem combineert voedingsplannen, trainingen, educatie en AI-ondersteuning in één gebruiksvriendelijke 
                omgeving.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Het platform moet <strong>professioneel en schaalbaar</strong> zijn, met real-time data tracking, 
                persoonlijke aanbevelingen en een complete coaching ervaring. Gebruikers krijgen toegang tot 
                geautomatiseerde processen en AI-powered inzichten.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Met <strong>€25.000 budget en 12 weken tijd</strong> realiseren we een moderne web applicatie 
                met focus op kwaliteit, gebruiksvriendelijkheid en schaalbaarheid.
              </p>
            </div>
          </div>
        </DataCard>

        {/* Project Intro */}
        <DataCard title="🎯 Project Overzicht" value="Complete Platform" className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">✅ Wat We Bouwen</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">All-in-One Web Platform</div>
                      <div className="text-sm text-gray-400">Responsive web applicatie voor desktop, tablet en mobiel</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Admin Dashboard</div>
                      <div className="text-sm text-gray-400">Volledig beheer voor coaches en content management</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Gebruikers Dashboard</div>
                      <div className="text-sm text-gray-400">Persoonlijke interface voor klanten</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Voeding & Training Modules</div>
                      <div className="text-sm text-gray-400">Complete voedingsplannen en trainingsprogramma's + dummy content</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">AI Chat & Insights</div>
                      <div className="text-sm text-gray-400">OpenAI GPT-4 integratie voor persoonlijke begeleiding</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Educatie Module</div>
                      <div className="text-sm text-gray-400">Cursusbeheer en leermodules voor klanten + dummy content</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Betalingen & Abonnementen</div>
                      <div className="text-sm text-gray-400">Stripe integratie voor automatische betalingen</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Analytics & Rapportages</div>
                      <div className="text-sm text-gray-400">Real-time dashboards en performance tracking</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Dummy Content & Voorbeelden</div>
                      <div className="text-sm text-gray-400">Voorbeeld voedingsplannen, trainingschema's, cursussen en AI responses</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-lg">✓</div>
                    <div>
                      <div className="font-medium text-white">Wearable Integratie</div>
                      <div className="text-sm text-gray-400">WHOOP, Apple Watch, Oura Ring, Garmin & Fitbit API integratie</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">❌ Wat We Niet Bouwen</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">Native Mobile Apps</div>
                      <div className="text-sm text-gray-400">Geen iOS/Android apps - wel responsive web app</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">Marketing Website</div>
                      <div className="text-sm text-gray-400">Geen publieke marketing site - alleen platform</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">Custom Content Creatie</div>
                      <div className="text-sm text-gray-400">Geen specifieke content voor jouw business - wel dummy content</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">SEO & Marketing</div>
                      <div className="text-sm text-gray-400">Geen zoekmachine optimalisatie of marketing</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">White-label Versie</div>
                      <div className="text-sm text-gray-400">Geen multi-tenant systeem voor meerdere merken</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">API voor Externe Integraties</div>
                      <div className="text-sm text-gray-400">Geen publieke API voor derden</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-red-400 text-lg">✗</div>
                    <div>
                      <div className="font-medium text-white">Onderhoud & Support</div>
                      <div className="text-sm text-gray-400">Geen doorlopende onderhoud na oplevering</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 Project Scope Samenvatting</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#E33412] mb-2">12 Weken</div>
                  <div className="text-white font-medium">Ontwikkelingstijd</div>
                  <div className="text-sm text-gray-400">Van start tot oplevering</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#E33412] mb-2">€25.000</div>
                  <div className="text-white font-medium">Ontwikkeling</div>
                  <div className="text-sm text-gray-400">Eenmalige investering</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#E33412] mb-2">Web Platform</div>
                  <div className="text-white font-medium">Type Applicatie</div>
                  <div className="text-sm text-gray-400">Responsive web app</div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Functie Overzicht */}
        <DataCard title="🔧 Volledig Functie Overzicht" value="200+ Features" className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📊 Admin & Beheer (4 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Admin Dashboard</strong> - Centraal beheer & real-time statistieken</li>
                  <li>• <strong>Gebruikersbeheer</strong> - User management & rollen beheer</li>
                  <li>• <strong>Coach Beheer</strong> - Coach administratie & commission systeem</li>
                  <li>• <strong>Analytics Dashboard</strong> - Business intelligence & rapportages</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🥗 Voeding & Gezondheid (3 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Voedingsplan Beheer</strong> - Complete voedingsplannen met afbeeldingen</li>
                  <li>• <strong>Gebruikers Voeding</strong> - Dagelijkse voeding tracking & calorieën</li>
                  <li>• <strong>Body Composition</strong> - Lichaamssamenstelling & progressie</li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🏋️ Training & Coaching (3 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Programma Beheer</strong> - Trainingsprogramma's & oefeningen database</li>
                  <li>• <strong>Gebruikers Training</strong> - Workout tracking & oefening logging</li>
                  <li>• <strong>Prestaties Tracking</strong> - Performance monitoring & PR's</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📚 Educatie & Leren (3 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Educatie Beheer</strong> - Cursusbeheer & video content</li>
                  <li>• <strong>Gebruikers Educatie</strong> - Leermodules & certificaten</li>
                  <li>• <strong>Leerpaden</strong> - Gestructureerde leerwegen</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🤖 AI & Intelligente Features (4 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>AI Insights</strong> - Persoonlijke inzichten & aanbevelingen</li>
                  <li>• <strong>AI Aanbevelingen</strong> - Op maat gemaakte suggesties</li>
                  <li>• <strong>AI Chat</strong> - Intelligente conversatie & support</li>
                  <li>• <strong>Doel Suggesties</strong> - AI-powered doel setting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📱 Gebruikerservaring (5 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Hoofd Dashboard</strong> - Centrale hub & quick stats</li>
                  <li>• <strong>Planning</strong> - Week/dag planning & reminders</li>
                  <li>• <strong>Herstel Tracking</strong> - Recovery monitoring & wearable integratie</li>
                  <li>• <strong>Instellingen</strong> - App configuratie & privacy</li>
                  <li>• <strong>Help & Support</strong> - FAQ & support systeem</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🎨 UI/UX Componenten (5 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Modern Charts</strong> - Data visualisatie & grafieken</li>
                  <li>• <strong>Floating Chat Widget</strong> - AI chat interface</li>
                  <li>• <strong>Photo Upload</strong> - Media upload & gallery</li>
                  <li>• <strong>Metrics Logger</strong> - Data logging & analytics</li>
                  <li>• <strong>Icons Library</strong> - Custom iconen & styling</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🔧 Technische Features (4 Modules)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Authenticatie & Beveiliging</strong> - JWT, RBAC, 2FA</li>
                  <li>• <strong>API & Integraties</strong> - RESTful API, WebSockets</li>
                  <li>• <strong>Database & Storage</strong> - PostgreSQL, backups</li>
                  <li>• <strong>Performance & Scalability</strong> - Caching, CDN, monitoring</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">⌚ Wearable Integratie (1 Module)</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>WHOOP API</strong> - Recovery data, strain, sleep analysis</li>
                  <li>• <strong>Apple Health</strong> - Apple Watch data integratie</li>
                  <li>• <strong>Oura Ring</strong> - Sleep tracking & recovery metrics</li>
                  <li>• <strong>Garmin Connect</strong> - Activity & performance data</li>
                  <li>• <strong>Fitbit API</strong> - Activity tracking & health metrics</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📊 Data Integratie</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <strong>Automatische Sync</strong> - Real-time data synchronisatie</li>
                  <li>• <strong>Data Normalisatie</strong> - Gestandaardiseerde metrics</li>
                  <li>• <strong>Recovery Insights</strong> - AI-powered recovery adviezen</li>
                  <li>• <strong>Trend Analyse</strong> - Patronen herkenning</li>
                  <li>• <strong>Privacy Compliance</strong> - GDPR & data beveiliging</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-lg font-semibold text-white mb-4">📊 Platform Statistieken</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-[#2A2D3A] rounded-lg p-3">
                  <div className="text-xl font-bold text-[#E33412]">15.000+</div>
                  <div className="text-xs text-gray-400">Regels Code</div>
                </div>
                <div className="bg-[#2A2D3A] rounded-lg p-3">
                  <div className="text-xl font-bold text-[#E33412]">32</div>
                  <div className="text-xs text-gray-400">Modules</div>
                </div>
                <div className="bg-[#2A2D3A] rounded-lg p-3">
                  <div className="text-xl font-bold text-[#E33412]">200+</div>
                  <div className="text-xs text-gray-400">Features</div>
                </div>
                <div className="bg-[#2A2D3A] rounded-lg p-3">
                  <div className="text-xl font-bold text-[#E33412]">100%</div>
                  <div className="text-xs text-gray-400">Responsive</div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Development Costs */}
        <DataCard title="💼 Ontwikkeling Kosten" value="€25.000" className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">12-Weken Ontwikkeling</h3>
                <div className="bg-[#1A1D29] rounded-lg p-4">
                  <div className="space-y-3">
                    {developmentCosts.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-[#2A2D3A] last:border-b-0">
                        <div>
                          <div className="font-medium text-white">{item.phase}</div>
                          <div className="text-sm text-gray-400">{item.weeks}</div>
                        </div>
                        <div className="text-[#E33412] font-bold">{item.cost}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2A2D3A]">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-white">Totaal Ontwikkeling</div>
                      <div className="text-2xl font-bold text-[#E33412]">€25.000</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Betalingsplan</h3>
                <div className="bg-[#1A1D29] rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-[#2A2D3A]">
                      <div>
                        <div className="font-medium text-white">Aanbetaling</div>
                        <div className="text-sm text-gray-400">Contract ondertekening</div>
                      </div>
                      <div className="text-[#E33412] font-bold">€5.000</div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium text-white">Oplevering</div>
                        <div className="text-sm text-gray-400">Week 12 - Platform klaar</div>
                      </div>
                      <div className="text-[#E33412] font-bold">€20.000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Operational Costs */}
        <DataCard title="🚀 Operationele Kosten per Fase" value="" className="mb-8">
          <div className="space-y-6">
            {/* Phase Selector */}
            <div className="flex space-x-2">
              {phaseCosts.map((phase, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhase(['launch', 'growth', 'scale'][index] as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedPhase === ['launch', 'growth', 'scale'][index]
                      ? 'bg-[#E33412] text-white'
                      : 'bg-[#2A2D3A] text-gray-300 hover:bg-[#3A3D4A]'
                  }`}
                >
                  {phase.phase}
                </button>
              ))}
            </div>

            {/* Selected Phase Details */}
            <div className="bg-[#1A1D29] rounded-lg p-6">
              {(() => {
                const phase = phaseCosts[selectedPhase === 'launch' ? 0 : selectedPhase === 'growth' ? 1 : 2];
                return (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{phase.phase}</h3>
                        <p className="text-gray-400">{phase.users}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#E33412]">{phase.totalCost}</div>
                        <div className="text-gray-400">per maand</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phase.services.map((service, index) => (
                        <div key={index} className="bg-[#2A2D3A] rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-white">{service.name}</div>
                            <div className="text-[#E33412] font-bold">{service.cost}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </DataCard>

        {/* Test Week & Revisions */}
        <DataCard title="🧪 Test Week & Revisies" value="Inbegrepen" className="mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🧪 Test Week (Week 11)</h3>
                <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>Test gebruikers</strong> - Door Benjamin aan te leveren</li>
                    <li>• <strong>1 week toegang</strong> - Volledige platform test</li>
                    <li>• <strong>Feedback verzameling</strong> - Gebruikerservaring & bugs</li>
                    <li>• <strong>Performance testen</strong> - Load testing & optimalisatie</li>
                    <li>• <strong>Bug fixes</strong> - Kritieke problemen oplossen</li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🔄 Revisie Rondes</h3>
                <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
                  <ul className="space-y-3 text-gray-300">
                    <li>• <strong>2 revisie rondes</strong> - Kosteloos inbegrepen</li>
                    <li>• <strong>Functionele aanpassingen</strong> - Features & workflow</li>
                    <li>• <strong>UI/UX verbeteringen</strong> - Design & gebruiksvriendelijkheid</li>
                    <li>• <strong>Bug fixes</strong> - Alle gevonden problemen</li>
                    <li>• <strong>Performance optimalisatie</strong> - Snelheid & stabiliteit</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-lg font-semibold text-white mb-4">📋 Test Week Planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-[#2A2D3A] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#E33412]">Week 11</div>
                  <div className="text-sm text-gray-400">Test Week</div>
                  <div className="text-xs text-gray-500 mt-1">Gebruikers testen platform</div>
                </div>
                <div className="bg-[#2A2D3A] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#E33412]">Week 12</div>
                  <div className="text-sm text-gray-400">Revisies</div>
                  <div className="text-xs text-gray-500 mt-1">2 rondes aanpassingen</div>
                </div>
                <div className="bg-[#2A2D3A] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#E33412]">Live</div>
                  <div className="text-sm text-gray-400">Oplevering</div>
                  <div className="text-xs text-gray-500 mt-1">Productie-ready platform</div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Wearable API Integrations */}
        <DataCard title="⌚ Wearable API Integraties" value="5 Devices" className="mb-8">
          <div className="space-y-6">
            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-lg font-semibold text-white mb-4">🔗 Officiële API Integraties</h3>
              <p className="text-gray-300 mb-6">
                Alle wearables in het platform hebben officiële API integraties voor volledig geautomatiseerde data synchronisatie.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📱 Smartwatches</h3>
                <div className="space-y-4">
                  <div className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">⌚</div>
                      <div>
                        <div className="font-semibold text-white">Apple Watch</div>
                        <div className="text-sm text-gray-400">Apple HealthKit API</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Activity tracking & heart rate</li>
                      <li>• Sleep monitoring & health data</li>
                      <li>• Privacy-first OAuth 2.0</li>
                    </ul>
                  </div>
                  <div className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">🏃</div>
                      <div>
                        <div className="font-semibold text-white">Garmin Connect</div>
                        <div className="text-sm text-gray-400">Garmin Connect API</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Workouts & performance metrics</li>
                      <li>• Training load & VO2 max</li>
                      <li>• Real-time device sync</li>
                    </ul>
                  </div>
                  <div className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">📱</div>
                      <div>
                        <div className="font-semibold text-white">Fitbit</div>
                        <div className="text-sm text-gray-400">Fitbit Web API</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Steps, calories & distance</li>
                      <li>• Heart rate & sleep tracking</li>
                      <li>• OAuth 2.0 authentication</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">💍 Recovery Devices</h3>
                <div className="space-y-4">
                  <div className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">💍</div>
                      <div>
                        <div className="font-semibold text-white">Oura Ring</div>
                        <div className="text-sm text-gray-400">Oura API v2</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Sleep stages & quality</li>
                      <li>• Recovery & readiness scores</li>
                      <li>• Temperature & HRV tracking</li>
                    </ul>
                  </div>
                  <div className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-2xl">🏆</div>
                      <div>
                        <div className="font-semibold text-white">WHOOP 4.0</div>
                        <div className="text-sm text-gray-400">WHOOP API</div>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Recovery & strain tracking</li>
                      <li>• Sleep analysis & HRV</li>
                      <li>• Webhook real-time updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
              <h3 className="text-lg font-semibold text-white mb-4">🔧 Technische Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E33412] mb-2">5</div>
                  <div className="text-sm text-gray-400">Wearable APIs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E33412] mb-2">Real-time</div>
                  <div className="text-sm text-gray-400">Data Sync</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E33412] mb-2">OAuth 2.0</div>
                  <div className="text-sm text-gray-400">Security</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#E33412] mb-2">GDPR</div>
                  <div className="text-sm text-gray-400">Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </DataCard>

        {/* Service Details */}
        <DataCard title="🔧 Service Details" value="7 Services" className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {serviceCosts.map((service, index) => (
              <div key={index} className="bg-[#1A1D29] rounded-lg p-6 border border-[#2A2D3A]">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 text-2xl flex items-center justify-center">{service.icon}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                        <p className="text-sm text-gray-400">{service.plan}</p>
                      </div>
                      <div className="text-[#E33412] font-bold text-lg">{service.cost}</div>
                    </div>
                    <p className="text-gray-300 text-sm">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Stripe Examples */}
        <DataCard title="💳 Stripe Transactie Kosten" value="1.4% + €0.25" className="mb-8">
          <div className="bg-[#1A1D29] rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Hoe Stripe Kosten Werken</h3>
              <p className="text-gray-300">
                Stripe rekent <strong>1.4% van het bedrag + €0.25 vaste kosten</strong> per transactie. 
                Geen maandelijkse kosten - alleen per transactie.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stripeExamples.map((example, index) => (
                <div key={index} className="bg-[#2A2D3A] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-2">{example.amount}</div>
                  <div className="text-[#E33412] font-bold mb-1">{example.cost}</div>
                  <div className="text-sm text-gray-400">{example.breakdown}</div>
                </div>
              ))}
            </div>
          </div>
        </DataCard>

        {/* Free Services */}
        <DataCard title="🆓 Gratis Services" value="€0/maand" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'GitHub', description: 'Code repository, CI/CD pipelines, issue tracking' },
              { name: 'Google Analytics', description: 'User behavior tracking, conversion analytics, real-time reports' },
              { name: 'Cloudflare', description: 'DNS management, DDoS protection, SSL certificates' },
              { name: 'PostHog', description: 'Product analytics (1M events/maand free tier)' }
            ].map((service, index) => (
              <div key={index} className="bg-[#1A1D29] rounded-lg p-4 border border-[#2A2D3A]">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white mb-2">{service.name}</div>
                  <div className="text-[#10B981] font-bold mb-2">€0/maand</div>
                  <p className="text-gray-300 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        {/* Summary */}
        <DataCard title="📊 Kosten Samenvatting" value="€25.000 + €141/maand" className="mb-8">
          <div className="bg-[#1A1D29] rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E33412] mb-2">€25.000</div>
                <div className="text-white font-semibold mb-1">Ontwikkeling</div>
                <div className="text-gray-400 text-sm">Eenmalige investering</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E33412] mb-2">€141</div>
                <div className="text-white font-semibold mb-1">Maandelijkse kosten</div>
                <div className="text-gray-400 text-sm">Launch phase (0-100 gebruikers)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#E33412] mb-2">12 weken</div>
                <div className="text-white font-semibold mb-1">Ontwikkelingstijd</div>
                <div className="text-gray-400 text-sm">Van start tot oplevering</div>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
} 