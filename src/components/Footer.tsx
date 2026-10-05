import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#f0f3fa] py-8 text-xs text-[#787b86]" data-purpose="site-footer">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <span>© 2025 TradingView</span>
          <button className="hover:text-[#131722] transition cursor-pointer">
            Terms of use
          </button>
          <button className="hover:text-[#131722] transition cursor-pointer">
            Privacy policy
          </button>
          <button className="hover:text-[#131722] transition cursor-pointer">
            Disclaimer
          </button>
        </div>
        <div className="text-[#787b86] text-center sm:text-right">
          Select market data provided by ICE Data Services &amp; Financial Exchanges.
        </div>
      </div>
    </footer>
  );
};
