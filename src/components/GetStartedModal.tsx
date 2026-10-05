import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col p-6 sm:p-8 animate-in zoom-in-95 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successMsg ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-[#089981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#131722]">Welcome to TradingView!</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Your paper trading workspace is ready with a simulated $100,000 balance and real-time streaming.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2962ff] text-xs font-semibold rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Track All Markets
              </div>
              <h2 className="text-2xl font-extrabold text-[#131722] tracking-tight">
                Get started with TradingView
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Join over 60M+ traders and investors scanning global indices, stocks, and crypto.
              </p>
            </div>

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('free')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                  selectedPlan === 'free'
                    ? 'border-[#131722] bg-gray-50/70'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-bold text-sm text-[#131722]">Basic Explorer</div>
                <div className="text-xl font-extrabold text-[#131722] mt-1">$0</div>
                <div className="text-xs text-gray-500 mt-2">
                  Paper trading &amp; essential charts
                </div>
              </div>

              <div
                onClick={() => setSelectedPlan('pro')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer relative ${
                  selectedPlan === 'pro'
                    ? 'border-[#2962ff] bg-blue-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-gradient-to-r from-[#2962ff] to-[#7b1fa2] text-white text-[10px] font-bold rounded-full">
                  POPULAR
                </span>
                <div className="font-bold text-sm text-[#131722]">Pro Trader</div>
                <div className="text-xl font-extrabold text-[#2962ff] mt-1">
                  $14.95<span className="text-xs text-gray-400 font-normal">/mo</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Realtime data &amp; 5 indicators/chart
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Work or Personal Email
                </label>
                <input
                  type="email"
                  required
                  defaultValue="trader@markets.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#2962ff] focus:ring-2 focus:ring-blue-100 outline-none text-sm transition"
                  placeholder="name@example.com"
                />
              </div>

              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span>30-day money-back guarantee · Cancel anytime in 1 click.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2962ff] to-[#7b1fa2] hover:opacity-95 shadow-xs transition active:scale-98 cursor-pointer"
            >
              Launch My TradingView Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
