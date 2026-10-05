import React from 'react';
import { MarketItem } from '../types/market';

interface IndicesSummaryCardsProps {
  indices: MarketItem[];
  onSelectIndex: (item: MarketItem) => void;
  onViewAllIndices?: () => void;
}

export const IndicesSummaryCards: React.FC<IndicesSummaryCardsProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices
}) => {
  return (
    <section data-purpose="indices-cards" className="w-full">
      {/* Section Title Link */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={onViewAllIndices}
          className="group inline-flex items-center text-2xl lg:text-3xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer text-left"
        >
          <span>Indices</span>
          <svg
            className="w-6 h-6 ml-1.5 transform group-hover:translate-x-1 transition-transform stroke-current"
            fill="none"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* Ticker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className="market-card-hover bg-[#f0f3fa] rounded-2xl p-5 cursor-pointer border border-transparent hover:border-gray-200 select-none group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectIndex(idx)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs shrink-0"
                    style={{ backgroundColor: idx.logoBg }}
                  >
                    {idx.logoText}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-[#131722] leading-tight group-hover:text-[#2962ff] transition-colors">
                      {idx.symbol}
                    </h3>
                    <span className="text-xs text-[#787b86] uppercase">
                      {idx.exchange || 'INDEX'}
                    </span>
                  </div>
                </div>

                {/* Mini Sparkline SVG */}
                <div className="w-24 h-10 flex-shrink-0">
                  {isPositive ? (
                    <svg
                      className="w-full h-full stroke-[#089981] fill-[#089981]/10"
                      viewBox="0 0 100 40"
                    >
                      <path
                        d="M0,32 Q15,35 30,22 T60,18 T80,10 L100,5 L100,40 L0,40 Z"
                      />
                      <path
                        d="M0,32 Q15,35 30,22 T60,18 T80,10 L100,5"
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-full h-full stroke-[#f23645] fill-[#f23645]/10"
                      viewBox="0 0 100 40"
                    >
                      <path
                        d="M0,8 Q25,6 50,19 T80,24 L100,34 L100,40 L0,40 Z"
                      />
                      <path
                        d="M0,8 Q25,6 50,19 T80,24 L100,34"
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono tracking-tight text-[#131722] tabular-nums">
                  {idx.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <div
                  className={`flex items-center space-x-1 font-mono text-sm font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  <span>{isPositive ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}</span>
                  <span>
                    ({isPositive ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
