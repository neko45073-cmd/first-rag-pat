import React, { useState } from 'react';
import { MarketItem, SubFilter } from '../types/market';
import { ArrowUpDown, Star } from 'lucide-react';

interface StocksTableProps {
  title?: string;
  items: MarketItem[];
  subFilter: SubFilter;
  onSubFilterChange: (filter: SubFilter) => void;
  onSelectItem: (item: MarketItem) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  flashingItems?: Record<string, 'up' | 'down'>;
}

export const StocksTable: React.FC<StocksTableProps> = ({
  title = 'Most Active Stocks',
  items,
  subFilter,
  onSubFilterChange,
  onSelectItem,
  watchlist,
  onToggleWatchlist,
  flashingItems = {}
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortField, setSortField] = useState<keyof MarketItem | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filter based on sub-tab
  let displayedItems = [...items];
  if (subFilter === 'Gainers') {
    displayedItems = displayedItems.filter((i) => i.changePercent > 0);
  } else if (subFilter === 'Losers') {
    displayedItems = displayedItems.filter((i) => i.changePercent < 0);
  }

  // Sort
  if (sortField) {
    displayedItems.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }

  // Pagination / slice
  const visibleItems = showAll ? displayedItems : displayedItems.slice(0, 5);

  const handleSort = (field: keyof MarketItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header controls: Title, Filter Tabs, View all link */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-[#131722]">{title}</h2>
          <div className="flex space-x-1 text-xs font-semibold">
            {(['Popular', 'Gainers', 'Losers'] as SubFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => onSubFilterChange(tab)}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer select-none ${
                  subFilter === tab
                    ? 'bg-[#131722] text-white shadow-xs'
                    : 'text-[#787b86] hover:bg-[#f0f3fa]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
        >
          {showAll ? 'Show top 5 ←' : 'View all active →'}
        </button>
      </div>

      {/* Financial Stocks Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" data-purpose="stocks-table">
          <thead>
            <tr className="text-xs uppercase text-[#787b86] border-b border-gray-100 select-none">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 font-medium cursor-pointer hover:text-black transition-colors"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Symbol / Company</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 text-right font-medium cursor-pointer hover:text-black transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-end w-full">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('change')}
                className="py-3 text-right font-medium cursor-pointer hover:text-black transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-end w-full">
                  <span>Change</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3 text-right font-medium cursor-pointer hover:text-black transition-colors"
              >
                <div className="inline-flex items-center gap-1 justify-end w-full">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 text-right font-medium hidden sm:table-cell">
                Market Cap
              </th>
              <th className="py-3 text-right font-medium hidden md:table-cell">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono">
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 font-sans text-sm">
                  No symbols found for the selected filter.
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => {
                const isPositive = item.change >= 0;
                const isWatchlisted = watchlist.includes(item.symbol);
                const flash = flashingItems[item.symbol];

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`hover:bg-[#f0f3fa]/80 cursor-pointer transition select-none group ${
                      flash === 'up'
                        ? 'bg-emerald-50/70'
                        : flash === 'down'
                        ? 'bg-rose-50/70'
                        : ''
                    }`}
                  >
                    {/* Symbol / Company */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(item.symbol);
                          }}
                          aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 hover:text-amber-500 cursor-pointer text-gray-300"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isWatchlisted
                                ? 'fill-amber-400 text-amber-400 opacity-100'
                                : ''
                            }`}
                          />
                        </button>
                        <div
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-sans font-bold text-white text-[10px] shadow-2xs"
                          style={{ backgroundColor: item.logoBg }}
                        >
                          {item.logoText}
                        </div>
                        <div>
                          <div className="font-sans font-bold text-[#131722] text-sm group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </div>
                          <div className="font-sans text-xs text-[#787b86] truncate max-w-[130px] sm:max-w-[200px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 text-right font-bold text-[#131722] tabular-nums">
                      ${item.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 10 ? 4 : 2
                      })}
                    </td>

                    {/* Change */}
                    <td
                      className={`py-3.5 text-right font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? `+${item.change.toFixed(2)}` : item.change.toFixed(2)}
                    </td>

                    {/* Change % */}
                    <td className="py-3.5 text-right font-semibold tabular-nums">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                          isPositive
                            ? 'bg-emerald-50 text-[#089981]'
                            : 'bg-rose-50 text-[#f23645]'
                        }`}
                      >
                        {isPositive
                          ? `+${item.changePercent.toFixed(2)}%`
                          : `${item.changePercent.toFixed(2)}%`}
                      </span>
                    </td>

                    {/* Market Cap */}
                    <td className="py-3.5 text-right text-[#787b86] text-xs hidden sm:table-cell tabular-nums">
                      {item.marketCap || '—'}
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 text-right text-[#787b86] text-xs hidden md:table-cell tabular-nums">
                      {item.volume || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
