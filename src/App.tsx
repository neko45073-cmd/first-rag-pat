/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketCategory, SubFilter, MarketItem, WorldIndex, CryptoSpotlightItem } from './types/market';
import {
  BENCHMARK_INDICES,
  ALL_MARKET_ITEMS,
  WORLD_INDICES_DATA,
  CRYPTO_SPOTLIGHT_DATA
} from './data/mockMarketData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesSummaryCards } from './components/IndicesSummaryCards';
import { StocksTable } from './components/StocksTable';
import { SideWidgets } from './components/SideWidgets';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState<string>('everywhere');
  const [subFilter, setSubFilter] = useState<SubFilter>('Popular');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'BTCUSD']);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Dynamic live prices state
  const [indices, setIndices] = useState<MarketItem[]>(BENCHMARK_INDICES);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(ALL_MARKET_ITEMS);
  const [worldIndices, setWorldIndices] = useState<WorldIndex[]>(WORLD_INDICES_DATA);
  const [cryptoSpotlight, setCryptoSpotlight] = useState<CryptoSpotlightItem[]>(CRYPTO_SPOTLIGHT_DATA);
  const [flashingItems, setFlashingItems] = useState<Record<string, 'up' | 'down'>>({});

  // Global hotkey for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate live price ticks
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Pick random market item to update
      const randomIndex = Math.floor(Math.random() * marketItems.length);
      const targetItem = marketItems[randomIndex];
      if (!targetItem) return;

      const isUp = Math.random() > 0.48;
      const percentDelta = (Math.random() * 0.25 + 0.05) * (isUp ? 1 : -1);
      const priceDelta = Number(((targetItem.price * percentDelta) / 100).toFixed(2));
      const newPrice = Math.max(0.01, Number((targetItem.price + priceDelta).toFixed(2)));
      const newChange = Number((targetItem.change + priceDelta).toFixed(2));
      const newChangePercent = Number((targetItem.changePercent + percentDelta).toFixed(2));

      // Trigger flash highlight
      setFlashingItems((prev) => ({
        ...prev,
        [targetItem.symbol]: isUp ? 'up' : 'down'
      }));

      setTimeout(() => {
        setFlashingItems((prev) => {
          const next = { ...prev };
          delete next[targetItem.symbol];
          return next;
        });
      }, 1200);

      // Update state
      setMarketItems((prev) =>
        prev.map((item, idx) =>
          idx === randomIndex
            ? {
                ...item,
                price: newPrice,
                change: newChange,
                changePercent: newChangePercent
              }
            : item
        )
      );

      // Also occasionally nudge an index
      if (Math.random() > 0.6) {
        const randIndexCard = Math.floor(Math.random() * indices.length);
        setIndices((prev) =>
          prev.map((idx, i) => {
            if (i === randIndexCard) {
              const delta = (Math.random() * 2 - 0.95);
              return {
                ...idx,
                price: Number((idx.price + delta).toFixed(2)),
                change: Number((idx.change + delta).toFixed(2))
              };
            }
            return idx;
          })
        );
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveUpdating, marketItems, indices]);

  // Filter items matching active category
  const activeCategoryItems = marketItems.filter((item) => {
    if (selectedCategory === 'US stocks') return item.category === 'US stocks';
    if (selectedCategory === 'World stocks') return item.category === 'World stocks';
    if (selectedCategory === 'Crypto') return item.category === 'Crypto';
    if (selectedCategory === 'Futures') return item.category === 'Futures';
    if (selectedCategory === 'Forex') return item.category === 'Forex';
    if (selectedCategory === 'Government bonds') return item.category === 'Government bonds';
    if (selectedCategory === 'Corporate bonds') return item.category === 'Corporate bonds';
    if (selectedCategory === 'ETFs') return item.category === 'ETFs';
    if (selectedCategory === 'Economy') return item.category === 'Economy';
    return true;
  });

  // Toggle watchlist
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Click on index from side widget
  const handleSelectIndexBySymbol = (symbol: string) => {
    const found = marketItems.find((i) => i.symbol === symbol) || indices.find((i) => i.symbol === symbol);
    if (found) {
      setSelectedItem(found);
    } else {
      // Find from world indices
      const w = worldIndices.find((i) => i.symbol === symbol);
      if (w) {
        setSelectedItem({
          id: w.symbol.toLowerCase(),
          symbol: w.symbol,
          name: w.name,
          category: 'World stocks',
          price: w.price,
          change: w.change,
          changePercent: w.changePercent,
          exchange: `${w.exchange} · ${w.region}`,
          logoText: w.symbol.slice(0, 2),
          logoBg: '#1e3a8a',
          sparkline: [w.price * 0.99, w.price * 1.002, w.price]
        });
      }
    }
  };

  // Click on crypto from spotlight
  const handleSelectCryptoByPair = (pair: string) => {
    const found = marketItems.find((i) => i.symbol === pair || i.name.toLowerCase() === pair.toLowerCase());
    if (found) {
      setSelectedItem(found);
    } else {
      const c = cryptoSpotlight.find((item) => item.pair === pair);
      if (c) {
        setSelectedItem({
          id: c.pair.toLowerCase(),
          symbol: c.pair,
          name: c.name,
          category: 'Crypto',
          price: c.price,
          change: (c.price * c.changePercent) / 100,
          changePercent: c.changePercent,
          exchange: 'Crypto · Spot',
          logoText: c.iconText,
          logoBg: c.iconBg,
          sparkline: [c.price * 0.98, c.price * 1.01, c.price]
        });
      }
    }
  };

  // Dynamic table title based on category
  const tableTitle =
    selectedCategory === 'US stocks'
      ? 'Most Active Stocks'
      : selectedCategory === 'Crypto'
      ? 'Top Crypto Assets'
      : selectedCategory === 'Forex'
      ? 'Major Currency Pairs'
      : selectedCategory === 'Futures'
      ? 'Commodities & Futures'
      : `${selectedCategory} Leaders`;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-100">
      {/* BEGIN: MainHeader */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => {
          setSelectedCategory('US stocks');
          setSubFilter('Popular');
        }}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />
      {/* END: MainHeader */}

      {/* BEGIN: HeroHeadlineSection */}
      <HeroSection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
      />
      {/* END: HeroHeadlineSection */}

      {/* BEGIN: MainContent */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-4 space-y-12">
        {/* BEGIN: IndicesSummaryCards */}
        <IndicesSummaryCards
          indices={indices}
          onSelectIndex={(item) => setSelectedItem(item)}
          onViewAllIndices={() => {
            setSelectedCategory('World stocks');
          }}
        />
        {/* END: IndicesSummaryCards */}

        {/* BEGIN: MarketMoversAndWorldIndices */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-purpose="market-data-grid">
          {/* Left Column: Popular US Leaders / Market Movers (8 Columns) */}
          <div className="lg:col-span-8">
            <StocksTable
              title={tableTitle}
              items={activeCategoryItems.length > 0 ? activeCategoryItems : marketItems}
              subFilter={subFilter}
              onSubFilterChange={setSubFilter}
              onSelectItem={(item) => setSelectedItem(item)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              flashingItems={flashingItems}
            />
          </div>

          {/* Right Column: World Markets & Crypto Highlights (4 Columns) */}
          <div className="lg:col-span-4">
            <SideWidgets
              worldIndices={worldIndices}
              cryptoItems={cryptoSpotlight}
              onSelectIndex={handleSelectIndexBySymbol}
              onSelectCrypto={handleSelectCryptoByPair}
              onViewAllWorldIndices={() => setSelectedCategory('World stocks')}
            />
          </div>
        </section>
        {/* END: MarketMoversAndWorldIndices */}
      </main>
      {/* END: MainContent */}

      {/* BEGIN: MinimalFooter */}
      <Footer />
      {/* END: MinimalFooter */}

      {/* Interactive Detail Modal / Chart Inspector */}
      {selectedItem && (
        <SymbolDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          isWatchlisted={watchlist.includes(selectedItem.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {/* Global Command / Symbol Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketItems}
        onSelectItem={(item) => setSelectedItem(item)}
      />

      {/* Get Started / Registration Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
