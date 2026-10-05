import React, { useState, useEffect, useRef } from 'react';
import { MarketItem } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    if (activeCategory === 'All') return matchesQuery;
    if (activeCategory === 'Stocks') return matchesQuery && (item.category === 'US stocks' || item.category === 'World stocks');
    if (activeCategory === 'Crypto') return matchesQuery && item.category === 'Crypto';
    if (activeCategory === 'Forex') return matchesQuery && item.category === 'Forex';
    return matchesQuery;
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        if (filteredItems[selectedIndex]) {
          onSelectItem(filteredItems[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedIndex, onClose, onSelectItem]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbol, company, crypto, or forex (e.g., NVDA, Bitcoin)..."
            className="w-full bg-transparent border-none outline-none text-[#131722] text-base placeholder-gray-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-gray-100 text-gray-500 rounded border border-gray-200">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-gray-50 flex gap-1.5 overflow-x-auto no-scrollbar bg-gray-50/50 text-xs">
          {['All', 'Stocks', 'Crypto', 'Forex'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full font-medium transition cursor-pointer select-none ${
                activeCategory === cat
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto divide-y divide-gray-50 p-2 max-h-96">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No financial symbols matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = selectedIndex === index;
              const isPositive = item.change >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl transition cursor-pointer select-none ${
                    isSelected ? 'bg-[#f0f3fa]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ backgroundColor: item.logoBg }}
                    >
                      {item.logoText}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#131722] flex items-center gap-1.5">
                        {item.symbol}
                        <span className="text-[10px] text-gray-400 font-normal">
                          {item.exchange || item.category}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-[#131722] tabular-nums">
                      ${item.price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 10 ? 4 : 2
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>
            Navigate with <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200">↓</kbd>
          </span>
          <span>
            Select with <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-gray-200">↵ Enter</kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
