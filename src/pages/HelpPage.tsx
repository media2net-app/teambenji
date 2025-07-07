import DataCard from '../components/DataCard';

export default function HelpPage() {
  const faqs = [
    {
      question: "Hoe kan ik mijn trainingsschema aanpassen?",
      answer: "Ga naar de Planning pagina en klik op een bestaande training om deze te bewerken, of gebruik de '+ Afspraak maken' knop om een nieuwe training toe te voegen."
    },
    {
      question: "Waar kan ik mijn voedingsgegevens bijhouden?",
      answer: "Op de Voeding pagina kun je je dagelijkse maaltijden loggen, macro's bijhouden en je waterinname tracken. Gebruik de '+ Maaltijd toevoegen' knop om te beginnen."
    },
    {
      question: "Hoe werkt de slaaptracking?",
      answer: "De app synchroniseert automatisch met je wearable device. Je kunt ook handmatig slaapgegevens invoeren via de Herstel pagina."
    },
    {
      question: "Kan ik mijn data exporteren?",
      answer: "Ja, ga naar Instellingen > Account en klik op 'Data exporteren' om al je gegevens te downloaden."
    },
    {
      question: "Hoe kan ik mijn doelen wijzigen?",
      answer: "In de Instellingen pagina kun je onder 'Doelen' je primaire doel, streefgewicht en trainingsfrequentie aanpassen."
    }
  ];

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Direct contact met onze support team",
      icon: "💬",
      action: "Start chat",
      available: true
    },
    {
      title: "Email Support",
      description: "support@teambenji.nl",
      icon: "📧",
      action: "Email versturen",
      available: true
    },
    {
      title: "Telefonisch",
      description: "+31 20 123 4567",
      icon: "📞",
      action: "Bellen",
      available: true
    },
    {
      title: "Video Call",
      description: "Persoonlijke ondersteuning",
      icon: "🎥",
      action: "Afspraak maken",
      available: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Help & Support</h1>
          <p className="text-gray-400">Vind antwoorden op je vragen</p>
        </div>
        <button className="bg-[#E33412] text-white px-4 py-2 rounded-lg hover:bg-[#b9260e] transition-colors font-medium">
          Contact opnemen
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DataCard
          title="Actieve tickets"
          value="0"
          change="Geen open issues"
          changeType="positive"
          icon="🎫"
          subtitle="support aanvragen"
        />
        <DataCard
          title="Response tijd"
          value="< 2u"
          change="Gemiddeld"
          changeType="positive"
          icon="⏱️"
          subtitle="voor antwoord"
        />
        <DataCard
          title="Documentatie"
          value="24/7"
          change="Beschikbaar"
          changeType="positive"
          icon="📚"
          subtitle="online hulp"
        />
        <DataCard
          title="Community"
          value="1,200+"
          change="Actieve leden"
          changeType="positive"
          icon="👥"
          subtitle="in forum"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <DataCard title="Veelgestelde Vragen" value="" icon="❓">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[#3A3D4A] pb-4 last:border-b-0">
                  <h3 className="text-white font-semibold mb-2 cursor-pointer hover:text-[#E33412] transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-[#3A3D4A]">
              <p className="text-gray-400 text-sm">
                Staat je vraag er niet bij? 
                <button className="text-[#E33412] hover:underline ml-1">
                  Stel een nieuwe vraag
                </button>
              </p>
            </div>
          </DataCard>
        </div>

        {/* Contact Options */}
        <div className="space-y-6">
          <DataCard title="Contact Opties" value="" icon="📞">
            <div className="space-y-3">
              {contactOptions.map((option, index) => (
                <div key={index} className="p-4 bg-[#2A2D3A] rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <h4 className="text-white font-medium">{option.title}</h4>
                      <p className="text-gray-400 text-sm">{option.description}</p>
                    </div>
                  </div>
                  <button 
                    className={`w-full py-2 rounded text-sm font-medium transition-colors ${
                      option.available 
                        ? 'bg-[#E33412] text-white hover:bg-[#b9260e]' 
                        : 'bg-[#3A3D4A] text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!option.available}
                  >
                    {option.action}
                  </button>
                </div>
              ))}
            </div>
          </DataCard>

          <DataCard title="Snelle Links" value="" icon="🔗">
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-white">
                📖 Gebruikershandleiding
              </button>
              <button className="w-full text-left p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-white">
                🎥 Video tutorials
              </button>
              <button className="w-full text-left p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-white">
                🔄 App updates
              </button>
              <button className="w-full text-left p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-white">
                🐛 Bug rapport
              </button>
              <button className="w-full text-left p-3 bg-[#2A2D3A] rounded-lg hover:bg-[#3A3D4A] transition-colors text-white">
                💡 Feature verzoek
              </button>
            </div>
          </DataCard>
        </div>
      </div>

      {/* System Status */}
      <DataCard title="Systeem Status" value="" icon="🔧">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#2A2D3A] rounded-lg">
            <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
            <h4 className="text-white font-medium">App Services</h4>
            <p className="text-green-400 text-sm">Operationeel</p>
          </div>
          <div className="text-center p-4 bg-[#2A2D3A] rounded-lg">
            <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
            <h4 className="text-white font-medium">Database</h4>
            <p className="text-green-400 text-sm">Operationeel</p>
          </div>
          <div className="text-center p-4 bg-[#2A2D3A] rounded-lg">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
            <h4 className="text-white font-medium">Sync Services</h4>
            <p className="text-yellow-400 text-sm">Beperkt</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-[#2A2D3A] rounded-lg">
          <p className="text-gray-400 text-sm">
            <strong className="text-white">Laatste update:</strong> 2 minuten geleden
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Alle systemen functioneren normaal. Sync services ondervinden momenteel lichte vertragingen.
          </p>
        </div>
      </DataCard>
    </div>
  );
} 