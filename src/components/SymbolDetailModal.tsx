import React, { useState } from 'react';
import { MarketItem, PricePoint } from '../types/market';
import { X, Star, TrendingUp, TrendingDown, Clock, ShieldCheck, DollarSign, BarChart2 } from 'lucide-react';

interface SymbolDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '1Y' | 'ALL';
type ChartStyle = 'line' | 'candles';

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  const isPositive = item.change >= 0;
  const historyData: PricePoint[] = item.history?.[timeframe] || item.history?.['1D'] || [];
  const candles = item.history?.candles || [];

  // Chart coordinate calculations
  const prices = historyData.map((d) => d.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.998 : item.price * 0.98;
  const maxPrice = prices.length ? Math.max(...prices) * 1.002 : item.price * 1.02;
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 20;

  const getCoordinates = (p: number, i: number, total: number) => {
    const x = paddingX + (i / (total - 1 || 1)) * (svgWidth - 2 * paddingX);
    const y = svgHeight - paddingY - ((p - minPrice) / priceRange) * (svgHeight - 2 * paddingY);
    return { x, y };
  };

  const linePoints = historyData
    .map((d, i) => {
      const { x, y } = getCoordinates(d.price, i, historyData.length);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = historyData.length
    ? `${getCoordinates(historyData[0].price, 0, historyData.length).x},${svgHeight} ` +
      linePoints +
      ` ${getCoordinates(historyData[historyData.length - 1].price, historyData.length - 1, historyData.length).x},${svgHeight}`
    : '';

  const activePoint = hoverIndex !== null && historyData[hoverIndex] ? historyData[hoverIndex] : null;
  const currentDisplayPrice = activePoint ? activePoint.price : item.price;

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`Simulated ${type} Order executed for 10 shares of ${item.symbol} at $${currentDisplayPrice.toFixed(2)}`);
    setTimeout(() => {
      setOrderNotification(null);
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <span
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0"
              style={{ backgroundColor: item.logoBg }}
            >
              {item.logoText}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722]">{item.symbol}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {item.exchange || 'INDEX'}
                </span>
                {item.sector && (
                  <span className="hidden sm:inline-block text-xs text-gray-400 font-medium">
                    · {item.sector}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#787b86] font-medium">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWatchlist(item.symbol)}
              className={`p-2 rounded-xl border border-gray-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isWatchlisted
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  isWatchlisted ? 'fill-amber-400 text-amber-400' : 'text-gray-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Price & Change Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#131722] tabular-nums">
                ${currentDisplayPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: currentDisplayPrice < 10 ? 4 : 2
                })}
              </div>
              <div
                className={`flex items-center gap-1.5 font-mono text-sm font-semibold mt-1 tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositive ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}</span>
                <span>({isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`})</span>
                <span className="text-gray-400 font-sans text-xs ml-1 font-normal">Today</span>
              </div>
            </div>

            {/* Timeframe & Chart Style Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex bg-[#f0f3fa] p-1 rounded-xl gap-0.5">
                {(['1D', '5D', '1M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoverIndex(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-[#131722] shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex bg-[#f0f3fa] p-1 rounded-xl">
                <button
                  onClick={() => setChartStyle('line')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    chartStyle === 'line'
                      ? 'bg-white text-[#131722] shadow-xs'
                      : 'text-gray-500'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartStyle('candles')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    chartStyle === 'candles'
                      ? 'bg-white text-[#131722] shadow-xs'
                      : 'text-gray-500'
                  }`}
                >
                  Candles
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="relative bg-[#f8f9fd] border border-gray-100 rounded-2xl p-3 sm:p-4">
            {activePoint && (
              <div className="absolute top-3 left-4 bg-white/90 backdrop-blur-xs border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs text-xs font-mono z-10">
                <span className="text-gray-500">{activePoint.time}</span>
                <span className="font-bold text-[#131722] ml-2">${activePoint.price.toFixed(2)}</span>
              </div>
            )}

            {chartStyle === 'line' ? (
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-48 sm:h-56 select-none overflow-visible cursor-crosshair"
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#089981' : '#f23645'}
                      stopOpacity="0.22"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#089981' : '#f23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1={paddingX}
                    y1={svgHeight * pct}
                    x2={svgWidth - paddingX}
                    y2={svgHeight * pct}
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Filled Area */}
                {areaPoints && (
                  <polygon points={areaPoints} fill="url(#chartGradient)" />
                )}

                {/* Line Path */}
                {linePoints && (
                  <polyline
                    fill="none"
                    stroke={isPositive ? '#089981' : '#f23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePoints}
                  />
                )}

                {/* Hover Interaction Areas */}
                {historyData.map((d, idx) => {
                  const { x, y } = getCoordinates(d.price, idx, historyData.length);
                  const isHovered = hoverIndex === idx;
                  return (
                    <g key={idx}>
                      <rect
                        x={x - 10}
                        y={0}
                        width={20}
                        height={svgHeight}
                        fill="transparent"
                        onMouseEnter={() => setHoverIndex(idx)}
                      />
                      {isHovered && (
                        <>
                          <line
                            x1={x}
                            y1={paddingY}
                            x2={x}
                            y2={svgHeight - paddingY}
                            stroke="#787b86"
                            strokeDasharray="2 2"
                            strokeWidth="1"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill={isPositive ? '#089981' : '#f23645'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* Candlestick Rendering */
              <div className="w-full h-48 sm:h-56 flex items-end justify-between gap-1 px-2 pt-4">
                {candles.map((c, i) => {
                  const isGreen = c.close >= c.open;
                  const bodyHeight = Math.max(
                    4,
                    (Math.abs(c.close - c.open) / (maxPrice - minPrice)) * 140
                  );
                  const wickHeight = Math.max(
                    8,
                    ((c.high - c.low) / (maxPrice - minPrice)) * 160
                  );
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                      title={`${c.time}: O ${c.open} H ${c.high} L ${c.low} C ${c.close}`}
                    >
                      <div
                        className="w-[1.5px]"
                        style={{
                          height: `${wickHeight}px`,
                          backgroundColor: isGreen ? '#089981' : '#f23645'
                        }}
                      />
                      <div
                        className="w-full max-w-[12px] rounded-2xs"
                        style={{
                          height: `${bodyHeight}px`,
                          backgroundColor: isGreen ? '#089981' : '#f23645'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Key Fundamentals &amp; Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">52W High</span>
                <span className="font-mono font-bold text-gray-900">
                  ${item.high52w ? item.high52w.toFixed(2) : (item.price * 1.15).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">52W Low</span>
                <span className="font-mono font-bold text-gray-900">
                  ${item.low52w ? item.low52w.toFixed(2) : (item.price * 0.75).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">Market Cap</span>
                <span className="font-mono font-bold text-gray-900">{item.marketCap || '—'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">Volume</span>
                <span className="font-mono font-bold text-gray-900">{item.volume || '—'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">P/E Ratio</span>
                <span className="font-mono font-bold text-gray-900">{item.peRatio ? item.peRatio.toFixed(1) : '—'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">Div Yield</span>
                <span className="font-mono font-bold text-gray-900">{item.divYield !== undefined ? `${item.divYield}%` : '—'}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">Category</span>
                <span className="font-medium text-gray-900">{item.category}</span>
              </div>
              <div className="bg-[#f8f9fd] p-3 rounded-xl">
                <span className="text-[#787b86] block mb-0.5">Rating</span>
                <span className="font-bold text-[#089981]">Strong Buy (4.6/5)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="bg-gray-50/70 p-4 rounded-xl text-xs text-gray-600 leading-relaxed border border-gray-100">
              <span className="font-semibold text-gray-900 block mb-1">Company Overview</span>
              {item.description}
            </div>
          )}

          {/* Simulated Trading Order Confirmation Banner */}
          {orderNotification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#089981]" />
                {orderNotification}
              </span>
              <button
                onClick={() => setOrderNotification(null)}
                className="text-emerald-900 font-bold hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#f8f9fd] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Quotes delayed by 15 mins · Paper Trading simulator</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOrder('SELL')}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-[#f23645] rounded-xl text-xs font-bold transition active:scale-98 cursor-pointer"
            >
              Paper Sell
            </button>
            <button
              onClick={() => handleOrder('BUY')}
              className="px-5 py-2 bg-[#089981] hover:bg-[#06806c] text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-98 cursor-pointer"
            >
              Paper Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
