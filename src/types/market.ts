export type MarketCategory = 
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type SubFilter = 'Popular' | 'Gainers' | 'Losers';

export interface PricePoint {
  time: string;
  price: number;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  volume?: string;
  currency?: string;
  exchange?: string;
  logoText: string;
  logoBg: string;
  badgeNumber?: string;
  sparkline: number[];
  high52w?: number;
  low52w?: number;
  peRatio?: number;
  divYield?: number;
  description?: string;
  sector?: string;
  history?: {
    '1D': PricePoint[];
    '5D': PricePoint[];
    '1M': PricePoint[];
    '1Y': PricePoint[];
    'ALL': PricePoint[];
    candles?: CandlePoint[];
  };
}

export interface WorldIndex {
  symbol: string;
  name: string;
  exchange: string;
  region: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface CryptoSpotlightItem {
  symbol: string;
  name: string;
  pair: string;
  price: number;
  changePercent: number;
  iconText: string;
  iconBg: string;
  iconColor?: string;
}
