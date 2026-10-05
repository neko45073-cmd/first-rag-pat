import React, { useState } from 'react';
import { MarketCategory } from '../types/market';
import { ChevronDown, Check, Activity, Radio } from 'lucide-react';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  isLiveUpdating,
  onToggleLive
}) => {
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy'
  ];

  const regions = [
    'everywhere',
    'United States',
    'Europe & UK',
    'Asia-Pacific',
    'Emerging Markets'
  ];

  return (
    <section className="pt-8 md:pt-10 pb-4 px-4 lg:px-8 max-w-[1440px] mx-auto w-full text-center" data-purpose="hero-title">
      {/* Big Title with Chevron */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowRegionMenu(!showRegionMenu)}
          className="inline-flex items-center justify-center group cursor-pointer space-x-2.5 focus:outline-none select-none"
          aria-expanded={showRegionMenu}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#131722]">
            Markets, {selectedRegion}
          </h1>
          <svg
            className={`w-7 h-7 md:w-9 md:h-9 text-[#131722] transition-transform stroke-current ${
              showRegionMenu ? 'rotate-180' : 'group-hover:translate-y-0.5'
            }`}
            fill="none"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>

        {showRegionMenu && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-30 text-left animate-in fade-in zoom-in-95"
            onMouseLeave={() => setShowRegionMenu(false)}
          >
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Select Market Geography
            </div>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  onSelectRegion(region);
                  setShowRegionMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#f0f3fa] text-sm font-semibold text-[#131722] transition cursor-pointer"
              >
                <span className="capitalize">Markets, {region}</span>
                {selectedRegion === region && (
                  <Check className="w-4 h-4 text-[#2962ff]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Market Pulse Indicator and Category Filter Bar */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <nav
          aria-label="Market Categories"
          className="inline-flex items-center p-1.5 bg-white border border-[#e0e3eb] rounded-full overflow-x-auto no-scrollbar max-w-full shadow-xs gap-1"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#131722] text-white shadow-xs font-semibold'
                    : 'text-[#131722] hover:bg-[#f0f3fa]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Live quote stream indicator */}
        <div className="flex items-center gap-4 text-xs text-gray-500 font-sans pt-1">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveUpdating ? 'bg-emerald-400' : 'bg-gray-300'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveUpdating ? 'bg-[#089981]' : 'bg-gray-400'}`}></span>
            </span>
            <span className="font-medium text-gray-700">Real-time Stream</span>
            <span className="text-gray-400">·</span>
            <span>NYSE / NASDAQ / CME</span>
          </div>

          <button
            onClick={onToggleLive}
            title="Toggle live price oscillation simulation"
            className="inline-flex items-center gap-1 text-[11px] text-[#2962ff] hover:underline font-semibold cursor-pointer"
          >
            <Activity className="w-3 h-3" />
            {isLiveUpdating ? 'Simulating Ticks: ON' : 'Paused (Resume)'}
          </button>
        </div>
      </div>
    </section>
  );
};
