

interface LanguageSwitcherProps {
  currentLanguage: 'nl' | 'en';
  onLanguageChange: (language: 'nl' | 'en') => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onLanguageChange('nl')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentLanguage === 'nl'
            ? 'bg-[#E33412] text-white'
            : 'bg-[#2A2D3A] text-gray-300 hover:bg-[#3A3D4A]'
        }`}
      >
        NL
      </button>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          currentLanguage === 'en'
            ? 'bg-[#E33412] text-white'
            : 'bg-[#2A2D3A] text-gray-300 hover:bg-[#3A3D4A]'
        }`}
      >
        EN
      </button>
    </div>
  );
} 