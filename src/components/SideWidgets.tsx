import React from 'react';
import { WorldIndex, CryptoSpotlightItem, MarketItem } from '../types/market';
import { TrendingUp, BarChart3, Flame } from 'lucide-react';

interface SideWidgetsProps {
  worldIndices: WorldIndex[];
  cryptoItems: CryptoSpotlightItem[];
  onSelectIndex: (symbol: string) => void;
  onSelectCrypto: (pair: string) => void;
  onViewAllWorldIndices: () => void;
}

export const SideWidgets: React.FC<SideWidgetsProps> = ({
  worldIndices,
  cryptoItems,
  onSelectIndex,
  onSelectCrypto,
  onViewAllWorldIndices
}) => {
  return (
    <div className="space-y-6">
      {/* World Indices Widget Box */}
      <div className="bg-white border border-[#e0e3eb] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#131722]">World Indices</h3>
          <button
            onClick={onViewAllWorldIndices}
            className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
          >
            More →
          </button>
        </div>

        <div className="space-y-2.5 font-mono">
          {worldIndices.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                onClick={() => onSelectIndex(idx.symbol)}
                className="flex items-center justify-between py-2 hover:bg-[#f0f3fa] px-2.5 rounded-xl transition cursor-pointer select-none group"
              >
                <div className="font-sans">
                  <div className="font-semibold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                    {idx.symbol}
                  </div>
                  <div className="text-[11px] text-[#787b86] uppercase">
                    {idx.exchange} · {idx.region}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#131722] tabular-nums">
                    {idx.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div
                    className={`text-xs font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}{' '}
                    ({isPositive ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crypto Quick Rates Box */}
      <div className="bg-white border border-[#e0e3eb] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-[#131722]">Crypto Spotlight</h3>
          <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-emerald-50 text-[#089981] rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981] animate-pulse"></span>
            24h live
          </span>
        </div>

        <div className="space-y-2.5 font-mono">
          {cryptoItems.map((crypto) => {
            const isPositive = crypto.changePercent >= 0;
            return (
              <div
                key={crypto.pair}
                onClick={() => onSelectCrypto(crypto.pair)}
                className="flex items-center justify-between py-2 hover:bg-[#f0f3fa] px-2.5 rounded-xl transition cursor-pointer select-none group"
              >
                <div className="flex items-center space-x-2.5 font-sans">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      backgroundColor: crypto.iconBg,
                      color: crypto.iconColor || '#ffffff'
                    }}
                  >
                    {crypto.iconText}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                      {crypto.name}
                    </div>
                    <div className="text-[11px] text-[#787b86]">
                      {crypto.pair}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#131722] tabular-nums">
                    ${crypto.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div
                    className={`text-xs font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? `+${crypto.changePercent.toFixed(2)}%` : `${crypto.changePercent.toFixed(2)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market Breadth & Sentiment Card */}
      <div className="bg-white border border-[#e0e3eb] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-[#131722]">Market Pulse</h3>
          </div>
          <span className="text-[11px] font-bold text-[#089981] bg-emerald-50 px-2 py-0.5 rounded">
            68 · Greed
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Market Breadth</span>
              <span className="font-mono font-semibold text-gray-700">64% Advancing</span>
            </div>
            <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#089981] h-full" style={{ width: '64%' }}></div>
              <div className="bg-[#f23645] h-full" style={{ width: '36%' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 bg-[#f8f9fd] rounded-lg">
              <span className="text-gray-400 block text-[10px] uppercase">VIX Volatility</span>
              <span className="font-mono font-bold text-gray-800">14.82 (-2.4%)</span>
            </div>
            <div className="p-2 bg-[#f8f9fd] rounded-lg">
              <span className="text-gray-400 block text-[10px] uppercase">Yield 10Y</span>
              <span className="font-mono font-bold text-gray-800">3.98% (+1.2%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
