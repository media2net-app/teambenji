import { useEffect, useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ModernChartProps {
  data: ChartData[];
  type: 'bar' | 'line' | 'donut' | 'area';
  title?: string;
  height?: number;
  showValues?: boolean;
  animated?: boolean;
}

export default function ModernChart({ 
  data, 
  type, 
  title, 
  height = 200, 
  showValues = true,
  animated = true 
}: ModernChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      // Start with zero values
      setAnimatedData(data.map(item => ({ ...item, value: 0 })));
      
      // Animate to actual values
      const timer = setTimeout(() => {
        setIsVisible(true);
        setAnimatedData(data);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
      setIsVisible(true);
    }
  }, [data, animated]);

  const maxValue = Math.max(...data.map(item => item.value));

  const renderBarChart = () => (
    <div className="flex items-end justify-between gap-2 h-full px-4">
      {animatedData.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center group">
          <div className="relative w-full flex justify-center mb-2">
            {showValues && (
              <span className={`text-xs font-medium text-white bg-[#2A2D3A] px-2 py-1 rounded transition-all duration-500 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
              }`} style={{ transitionDelay: `${index * 100}ms` }}>
                {item.value}
              </span>
            )}
          </div>
          <div
            className={`chart-bar w-full rounded-t-lg transition-all duration-1000 ease-out ${
              item.color || 'bg-gradient-to-t from-[#E33412] to-[#ff4d24]'
            } relative overflow-hidden`}
            style={{ 
              height: isVisible ? `${(item.value / maxValue) * (height - 60)}px` : '0px',
              transitionDelay: `${index * 150}ms`
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 animate-shimmer opacity-30"></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className={`text-gray-400 text-xs mt-2 font-medium transition-all duration-500 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
          }`} style={{ transitionDelay: `${index * 100}ms` }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = animatedData.map((item, index) => ({
      x: (index / (animatedData.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 80
    }));

    const pathData = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    const areaPath = `${pathData} L 100 100 L 0 100 Z`;

    return (
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#2A2D3A" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E33412" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#E33412" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#E33412"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
              strokeDasharray: isVisible ? 'none' : '200',
              strokeDashoffset: isVisible ? '0' : '200'
            }}
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#E33412"
              className={`transition-all duration-500 hover:r-5 cursor-pointer ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <title>{`${animatedData[index]?.label}: ${animatedData[index]?.value}`}</title>
            </circle>
          ))}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {animatedData.map((item, index) => (
            <span key={index} className={`text-gray-400 text-xs transition-all duration-500 ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
            }`} style={{ transitionDelay: `${index * 100}ms` }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderDonutChart = () => {
    const total = animatedData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const radius = 45;
    const centerX = 50;
    const centerY = 50;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {animatedData.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            const colors = [
              '#E33412', '#ff4d24', '#ff6b3d', '#ff8956', '#ffa76f', '#ffc588'
            ];

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || colors[index % colors.length]}
                className={`transition-all duration-1000 hover:opacity-80 cursor-pointer ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transformOrigin: '50% 50%'
                }}
              >
                <title>{`${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)`}</title>
              </path>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="20"
            fill="#1A1D29"
            className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          />
        </svg>
        
        {/* Center text */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center">
            <div className="text-white text-lg font-bold">{total}</div>
            <div className="text-gray-400 text-xs">Total</div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="flex flex-wrap justify-center gap-2">
            {animatedData.map((item, index) => {
              const colors = [
                '#E33412', '#ff4d24', '#ff6b3d', '#ff8956', '#ffa76f', '#ffc588'
              ];
              return (
                <div key={index} className={`flex items-center gap-1 transition-all duration-500 ${
                  isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                }`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color || colors[index % colors.length] }}
                  ></div>
                  <span className="text-gray-400 text-xs">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
      case 'area':
        return renderLineChart();
      case 'donut':
        return renderDonutChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-white font-semibold text-lg mb-4 animate-fade-in">{title}</h3>
      )}
      <div style={{ height: `${height}px` }} className="relative">
        {renderChart()}
      </div>
    </div>
  );
} 