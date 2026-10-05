import React, { useState } from 'react';
import { Search, Globe, User, ChevronDown, Check, Sparkles, Moon, Sun, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  watchlistCount: number;
  onOpenWatchlist?: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenGetStarted,
  watchlistCount,
  onOpenWatchlist,
  activeNav,
  setActiveNav
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [currency, setCurrency] = useState('USD ($)');
  const [darkModeSim, setDarkModeSim] = useState(false);

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'JA', name: '日本語' },
    { code: 'FR', name: 'Français' },
    { code: 'ZH', name: '简体中文' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#f0f3fa] select-none" data-purpose="global-header">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Left side: Brand Logo and Search Bar */}
        <div className="flex items-center space-x-6">
          {/* TradingView Geometric Logo Mark */}
          <button 
            onClick={() => setActiveNav('Markets')}
            aria-label="TradingView Home" 
            className="flex items-center text-[#131722] hover:opacity-80 transition cursor-pointer"
          >
            <svg className="h-8 w-11 fill-current" fill="none" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.05882 0H0V28H7.05882V0Z"></path>
              <path d="M21.1765 0H14.1176V28H21.1765V0Z"></path>
              <path d="M35.2941 0H28.2353V18.6667H35.2941V0Z"></path>
              <path d="M35.2941 21.7778H28.2353V28H35.2941V21.7778Z"></path>
            </svg>
          </button>

          {/* Global Search Input Pill */}
          <div className="relative w-64 md:w-72" data-purpose="global-search">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center text-left pl-10 pr-4 py-2 bg-[#f0f3fa] hover:bg-[#e0e3eb] focus:bg-white text-sm rounded-full border-none text-[#787b86] cursor-pointer transition-colors group"
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#787b86] group-hover:text-[#131722]">
                <Search className="w-4 h-4 stroke-current" />
              </div>
              <span className="text-sm font-normal">Search (Ctrl+K)</span>
              <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/70 border border-black/5 rounded text-gray-500 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#131722] relative">
          {navItems.map((item) => {
            const isActive = activeNav === item;
            if (item === 'More') {
              return (
                <div key={item} className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`flex items-center space-x-1 hover:text-[#2962ff] transition-colors py-5 cursor-pointer ${
                      isActive ? 'text-[#2962ff] font-semibold' : ''
                    }`}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showMoreMenu && (
                    <div 
                      className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                      onMouseLeave={() => setShowMoreMenu(false)}
                    >
                      <button 
                        onClick={() => { setActiveNav('Markets'); setShowMoreMenu(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#f0f3fa] flex items-center justify-between font-medium text-gray-700"
                      >
                        <span>Stock Screener</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">Pro</span>
                      </button>
                      <button 
                        onClick={() => { setActiveNav('Markets'); setShowMoreMenu(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#f0f3fa] text-gray-700"
                      >
                        Economic Calendar
                      </button>
                      <button 
                        onClick={() => { setActiveNav('Markets'); setShowMoreMenu(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#f0f3fa] text-gray-700"
                      >
                        Market Heatmaps
                      </button>
                      <button 
                        onClick={() => { setActiveNav('Markets'); setShowMoreMenu(false); }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-[#f0f3fa] text-gray-700"
                      >
                        Pine Script™ Editor
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`transition-colors relative py-5 cursor-pointer ${
                  isActive
                    ? 'text-[#2962ff] font-semibold'
                    : 'hover:text-[#2962ff]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962ff] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowUserMenu(false);
              }}
              aria-label="Select Language"
              className="flex items-center space-x-1.5 text-[#131722] hover:text-[#2962ff] px-2 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              <Globe className="w-5 h-5 text-gray-700" />
              <span>{currentLang}</span>
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
                onMouseLeave={() => setShowLangMenu(false)}
              >
                <div className="px-3 py-1.5 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f0f3fa] text-gray-800 text-left cursor-pointer"
                  >
                    <span>{l.name}</span>
                    {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
                <div className="h-[1px] bg-gray-100 my-1.5" />
                <div className="px-3 py-1.5 font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Currency
                </div>
                {['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowLangMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#f0f3fa] text-gray-700 text-left cursor-pointer"
                  >
                    <span>{curr}</span>
                    {currency === curr && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Icon Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowLangMenu(false);
              }}
              aria-label="Account Settings"
              className="p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition cursor-pointer relative"
            >
              <User className="w-5 h-5 text-gray-700" />
              {watchlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2962ff]" />
              )}
            </button>

            {showUserMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 text-xs"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="p-3 bg-[#f8f9fd] rounded-lg mb-2">
                  <div className="font-bold text-sm text-[#131722]">Guest Trader</div>
                  <div className="text-[11px] text-gray-500">Free Account · Paper Trading</div>
                </div>

                {onOpenWatchlist && (
                  <button 
                    onClick={() => {
                      onOpenWatchlist();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f0f3fa] text-gray-700 cursor-pointer font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#2962ff]" />
                      My Watchlist
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[11px] font-mono font-semibold">
                      {watchlistCount}
                    </span>
                  </button>
                )}

                <button 
                  onClick={() => setDarkModeSim(!darkModeSim)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#f0f3fa] text-gray-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    {darkModeSim ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    Dark Mode (Preview)
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {darkModeSim ? 'On' : 'Off'}
                  </span>
                </button>

                <div className="h-[1px] bg-gray-100 my-1" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left px-3 py-2 text-[#2962ff] font-semibold hover:bg-blue-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: "Get started" */}
          <button
            onClick={onOpenGetStarted}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2962ff] to-[#7b1fa2] hover:opacity-95 shadow-xs transition active:scale-98 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
