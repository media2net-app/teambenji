interface DataCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function DataCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  subtitle,
  children,
  className = ''
}: DataCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-400 bg-green-400/10';
      case 'negative': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <div className={`group relative bg-gradient-to-br from-[#1A1D29] to-[#161925] rounded-xl p-4 sm:p-6 border border-[#2A2D3A]/50 hover:border-[#E33412]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#E33412]/10 backdrop-blur-sm hover:scale-[1.02] transform animate-fade-in ${className}`}>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E33412]/0 via-[#E33412]/0 to-[#E33412]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-[#E33412]/10 rounded-lg group-hover:bg-[#E33412]/20 transition-all duration-300 group-hover:scale-110 transform">
              <div className="filter group-hover:brightness-110 transition-all duration-300">{icon}</div>
            </div>
          )}
          <h3 className="text-gray-300 text-xs sm:text-sm font-medium group-hover:text-white transition-colors duration-300">{title}</h3>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getChangeColor()}`}>
            <span className="text-xs animate-pulse-subtle">
              {getChangeIcon()}
            </span>
            {changeType === 'positive' && '+'}
            {change}
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="relative mb-2">
        <div className="text-white text-lg sm:text-2xl font-bold group-hover:text-[#E33412] transition-colors duration-300 animate-count-up">
          {value}
        </div>
        {subtitle && <div className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">{subtitle}</div>}
      </div>

      {/* Additional Content */}
      {children && (
        <div className="relative mt-4 group-hover:opacity-95 transition-opacity duration-300">
          {children}
        </div>
      )}
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E33412]/0 via-[#E33412]/20 to-[#E33412]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-transparent"></div>
    </div>
  );
} 