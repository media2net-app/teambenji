

import { useState } from 'react';

interface LanguageSwitcherProps {
  currentLanguage: 'nl' | 'en';
  onLanguageChange: (language: 'nl' | 'en') => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#2A2D3A] text-white rounded-lg hover:bg-[#3A3D4A] transition-colors text-sm"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1A1D29] border border-[#2A2D3A] rounded-lg shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code as 'nl' | 'en');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  currentLanguage === language.code
                    ? 'bg-[#E33412] text-white'
                    : 'text-gray-300 hover:bg-[#2A2D3A] hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 