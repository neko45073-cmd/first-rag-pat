import { MarketCategory, MarketItem, WorldIndex, CryptoSpotlightItem, CandlePoint, PricePoint } from '../types/market';

// Helper to generate realistic historical price curve
export function generateHistory(basePrice: number, changePercent: number): {
  '1D': PricePoint[];
  '5D': PricePoint[];
  '1M': PricePoint[];
  '1Y': PricePoint[];
  'ALL': PricePoint[];
  candles: CandlePoint[];
} {
  const pointsCount = 30;
  const isUp = changePercent >= 0;
  
  // 1D
  const oneDay: PricePoint[] = [];
  const startPrice1D = basePrice / (1 + changePercent / 100);
  for (let i = 0; i <= pointsCount; i++) {
    const progress = i / pointsCount;
    const noise = (Math.sin(i * 1.5) * 0.4 + Math.cos(i * 2.3) * 0.3) * (basePrice * 0.008);
    const trend = (basePrice - startPrice1D) * Math.pow(progress, 0.85);
    const p = Number((startPrice1D + trend + noise).toFixed(2));
    const h = 9 + Math.floor((i * 6.5) / pointsCount);
    const m = Math.floor(((i * 6.5 * 60) / pointsCount) % 60);
    const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    oneDay.push({ time: timeStr, price: Math.max(0.01, p) });
  }

  // 1M
  const oneMonth: PricePoint[] = [];
  const startPrice1M = basePrice * (isUp ? 0.92 : 1.08);
  for (let i = 0; i <= 30; i++) {
    const noise = Math.sin(i * 0.8) * (basePrice * 0.025);
    const p = Number((startPrice1M + ((basePrice - startPrice1M) * (i / 30)) + noise).toFixed(2));
    oneMonth.push({ time: `Day ${i + 1}`, price: Math.max(0.01, p) });
  }

  // 1Y
  const oneYear: PricePoint[] = [];
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  months.forEach((m, idx) => {
    const val = basePrice * (0.8 + (idx / 11) * 0.2 + (Math.sin(idx) * 0.05));
    oneYear.push({ time: m, price: Number(val.toFixed(2)) });
  });

  // Candlesticks (last 20 sessions)
  const candles: CandlePoint[] = [];
  let curr = startPrice1D;
  for (let i = 0; i < 20; i++) {
    const delta = (Math.random() - 0.46) * (basePrice * 0.02);
    const open = curr;
    const close = Number((open + delta).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * (basePrice * 0.012)).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * (basePrice * 0.012)).toFixed(2));
    const vol = Math.floor(1000000 + Math.random() * 5000000);
    candles.push({
      time: `T-${20 - i}`,
      open,
      high,
      low,
      close,
      volume: vol
    });
    curr = close;
  }

  return {
    '1D': oneDay,
    '5D': oneDay.slice(0, 15),
    '1M': oneMonth,
    '1Y': oneYear,
    'ALL': oneYear,
    candles
  };
}

export const BENCHMARK_INDICES: MarketItem[] = [
  {
    id: 'spx',
    symbol: 'S&P 500',
    name: 'S&P 500 Index',
    category: 'US stocks',
    price: 5751.13,
    change: 24.13,
    changePercent: 0.42,
    exchange: 'INDEX · SPX',
    logoText: '500',
    logoBg: '#f23645',
    badgeNumber: '500',
    sparkline: [32, 35, 22, 18, 10, 5],
    high52w: 5767.37,
    low52w: 4103.78,
    peRatio: 27.4,
    description: 'The S&P 500 tracks the stock performance of 500 of the largest companies listed on stock exchanges in the United States.',
    history: generateHistory(5751.13, 0.42)
  },
  {
    id: 'ndx',
    symbol: 'Nasdaq 100',
    name: 'Nasdaq 100 Index',
    category: 'US stocks',
    price: 20028.91,
    change: 162.80,
    changePercent: 0.82,
    exchange: 'INDEX · NDX',
    logoText: '100',
    logoBg: '#0089ff',
    badgeNumber: '100',
    sparkline: [28, 38, 15, 12, 4],
    high52w: 20690.97,
    low52w: 14058.33,
    peRatio: 31.8,
    description: 'The Nasdaq-100 includes 100 of the largest domestic and international non-financial companies listed on the Nasdaq Stock Market.',
    history: generateHistory(20028.91, 0.82)
  },
  {
    id: 'dji',
    symbol: 'Dow 30',
    name: 'Dow Jones Industrial Average',
    category: 'US stocks',
    price: 42114.40,
    change: -184.93,
    changePercent: -0.44,
    exchange: 'INDEX · DJI',
    logoText: '30',
    logoBg: '#00b2e2',
    badgeNumber: '30',
    sparkline: [8, 6, 19, 24, 34],
    high52w: 42628.32,
    low52w: 32327.42,
    peRatio: 22.1,
    description: 'The Dow Jones Industrial Average is a price-weighted stock market index of 30 prominent companies listed on stock exchanges in the US.',
    history: generateHistory(42114.40, -0.44)
  }
];

export const ALL_MARKET_ITEMS: MarketItem[] = [
  // US Stocks (Exact matching screenshot first)
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'US stocks',
    price: 121.75,
    change: 4.65,
    changePercent: 3.97,
    marketCap: '2.98T',
    volume: '48.2M',
    exchange: 'NASDAQ',
    logoText: 'NV',
    logoBg: '#76b900',
    sparkline: [116, 117, 119, 120, 121.75],
    high52w: 140.76,
    low52w: 39.23,
    peRatio: 52.8,
    divYield: 0.03,
    sector: 'Semiconductors & AI',
    description: 'NVIDIA Corporation designs graphics processing units (GPUs) for gaming and professional markets, as well as system on a chip units for the mobile computing and automotive market.',
    history: generateHistory(121.75, 3.97)
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'US stocks',
    price: 227.37,
    change: 1.15,
    changePercent: 0.51,
    marketCap: '3.46T',
    volume: '39.7M',
    exchange: 'NASDAQ',
    logoText: 'AP',
    logoBg: '#333333',
    sparkline: [225, 226, 226.5, 227, 227.37],
    high52w: 237.23,
    low52w: 164.08,
    peRatio: 34.2,
    divYield: 0.44,
    sector: 'Consumer Electronics',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    history: generateHistory(227.37, 0.51)
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'US stocks',
    price: 238.77,
    change: -3.95,
    changePercent: -1.63,
    marketCap: '762.5B',
    volume: '62.1M',
    exchange: 'NASDAQ',
    logoText: 'TS',
    logoBg: '#e82127',
    sparkline: [244, 242, 241, 239, 238.77],
    high52w: 271.00,
    low52w: 138.80,
    peRatio: 64.1,
    divYield: 0.0,
    sector: 'Automotive & Clean Energy',
    description: 'Tesla designs and manufactures electric vehicles, battery energy storage from home to grid-scale, solar panels and solar roof tiles, and related products and services.',
    history: generateHistory(238.77, -1.63)
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'US stocks',
    price: 416.06,
    change: 0.78,
    changePercent: 0.19,
    marketCap: '3.09T',
    volume: '17.4M',
    exchange: 'NASDAQ',
    logoText: 'MS',
    logoBg: '#00a4ef',
    sparkline: [415, 415.5, 415.2, 416, 416.06],
    high52w: 468.35,
    low52w: 326.93,
    peRatio: 35.4,
    divYield: 0.72,
    sector: 'Enterprise Software & Cloud',
    description: 'Microsoft produces computer software, consumer electronics, personal computers, and related services including Azure Cloud, Windows, and Office 365.',
    history: generateHistory(416.06, 0.19)
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    category: 'US stocks',
    price: 186.40,
    change: 2.23,
    changePercent: 1.21,
    marketCap: '1.94T',
    volume: '26.8M',
    exchange: 'NASDAQ',
    logoText: 'AM',
    logoBg: '#ff9900',
    sparkline: [183, 184, 185.2, 186, 186.40],
    high52w: 201.20,
    low52w: 118.35,
    peRatio: 43.6,
    divYield: 0.0,
    sector: 'E-Commerce & Cloud Computing',
    description: 'Amazon focuses on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    history: generateHistory(186.40, 1.21)
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    category: 'US stocks',
    price: 589.34,
    change: 9.80,
    changePercent: 1.69,
    marketCap: '1.49T',
    volume: '14.2M',
    exchange: 'NASDAQ',
    logoText: 'ME',
    logoBg: '#0668e1',
    sparkline: [578, 582, 585, 588, 589.34],
    high52w: 602.95,
    low52w: 279.40,
    peRatio: 28.7,
    divYield: 0.34,
    sector: 'Interactive Media & Ads',
    description: 'Meta Platforms operates Facebook, Instagram, WhatsApp, and develops augmented and virtual reality technologies.',
    history: generateHistory(589.34, 1.69)
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    category: 'US stocks',
    price: 165.12,
    change: -1.02,
    changePercent: -0.61,
    marketCap: '2.05T',
    volume: '21.5M',
    exchange: 'NASDAQ',
    logoText: 'GO',
    logoBg: '#ea4335',
    sparkline: [167, 166.5, 166, 165.5, 165.12],
    high52w: 191.75,
    low52w: 120.21,
    peRatio: 24.1,
    divYield: 0.48,
    sector: 'Internet & Search',
    description: 'Alphabet is a multinational technology conglomerate holding company created through a restructuring of Google.',
    history: generateHistory(165.12, -0.61)
  },
  {
    id: 'amd',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    category: 'US stocks',
    price: 171.45,
    change: 7.90,
    changePercent: 4.83,
    marketCap: '277.8B',
    volume: '54.6M',
    exchange: 'NASDAQ',
    logoText: 'AM',
    logoBg: '#ed1c24',
    sparkline: [162, 164, 168, 170, 171.45],
    high52w: 227.30,
    low52w: 94.04,
    peRatio: 112.5,
    divYield: 0.0,
    sector: 'Semiconductors',
    description: 'AMD develops computer processors and related technologies for business and consumer markets.',
    history: generateHistory(171.45, 4.83)
  },

  // World Stocks
  {
    id: 'asml',
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    category: 'World stocks',
    price: 789.20,
    change: 14.80,
    changePercent: 1.91,
    marketCap: '315.4B',
    volume: '3.1M',
    exchange: 'Euronext Amsterdam',
    logoText: 'AS',
    logoBg: '#002664',
    sparkline: [772, 778, 782, 786, 789.2],
    high52w: 1020.00,
    low52w: 550.00,
    peRatio: 42.0,
    sector: 'Semiconductor Equipment',
    description: 'ASML is the world leader in photolithography machines used in manufacturing computer microchips.',
    history: generateHistory(789.20, 1.91)
  },
  {
    id: 'tsm',
    symbol: 'TSM',
    name: 'Taiwan Semiconductor Mfg.',
    category: 'World stocks',
    price: 181.25,
    change: 3.45,
    changePercent: 1.94,
    marketCap: '940.1B',
    volume: '18.9M',
    exchange: 'TWSE',
    logoText: 'TS',
    logoBg: '#c8102e',
    sparkline: [176, 178, 179, 180, 181.25],
    high52w: 193.47,
    low52w: 84.50,
    peRatio: 29.8,
    sector: 'Foundry & Microchips',
    description: 'TSMC is the world’s most valuable semiconductor company and largest dedicated independent semiconductor foundry.',
    history: generateHistory(181.25, 1.94)
  },
  {
    id: 'sap',
    symbol: 'SAP',
    name: 'SAP SE',
    category: 'World stocks',
    price: 204.60,
    change: -1.20,
    changePercent: -0.58,
    marketCap: '248.6B',
    volume: '2.4M',
    exchange: 'XETRA',
    logoText: 'SA',
    logoBg: '#008fd3',
    sparkline: [206, 205.5, 205, 204.8, 204.6],
    high52w: 209.15,
    low52w: 121.20,
    peRatio: 38.4,
    sector: 'Enterprise Software',
    description: 'SAP is a German multinational software company based in Walldorf, Baden-Württemberg.',
    history: generateHistory(204.60, -0.58)
  },

  // Crypto
  {
    id: 'btcusd',
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    category: 'Crypto',
    price: 62714.00,
    change: 1134.00,
    changePercent: 1.84,
    marketCap: '1.24T',
    volume: '28.4B',
    exchange: 'Crypto',
    logoText: '₿',
    logoBg: '#f7931a',
    sparkline: [61200, 61800, 62100, 62450, 62714],
    high52w: 73750.00,
    low52w: 26500.00,
    description: 'Bitcoin is the first decentralized digital currency, enabling peer-to-peer transfers without intermediaries.',
    history: generateHistory(62714.00, 1.84)
  },
  {
    id: 'ethusd',
    symbol: 'ETHUSD',
    name: 'Ethereum',
    category: 'Crypto',
    price: 2442.15,
    change: -15.48,
    changePercent: -0.63,
    marketCap: '293.8B',
    volume: '14.1B',
    exchange: 'Crypto',
    logoText: 'Ξ',
    logoBg: '#627eea',
    sparkline: [2470, 2465, 2455, 2448, 2442.15],
    high52w: 4091.00,
    low52w: 1520.00,
    description: 'Ethereum is a decentralized open-source blockchain featuring smart contract functionality and decentralized finance.',
    history: generateHistory(2442.15, -0.63)
  },
  {
    id: 'solusd',
    symbol: 'SOLUSD',
    name: 'Solana',
    category: 'Crypto',
    price: 144.30,
    change: 4.77,
    changePercent: 3.42,
    marketCap: '67.4B',
    volume: '3.8B',
    exchange: 'Crypto',
    logoText: 'S',
    logoBg: '#14f195',
    sparkline: [138, 140, 142, 143.5, 144.3],
    high52w: 209.90,
    low52w: 21.15,
    description: 'Solana is a high-performance public blockchain platform designed for fast, secure, and scalable decentralized applications.',
    history: generateHistory(144.30, 3.42)
  },

  // Futures
  {
    id: 'cl1',
    symbol: 'CL1!',
    name: 'Crude Oil WTI',
    category: 'Futures',
    price: 74.38,
    change: 1.12,
    changePercent: 1.53,
    volume: '438K',
    exchange: 'NYMEX',
    logoText: 'CL',
    logoBg: '#2d3748',
    sparkline: [73, 73.4, 73.8, 74.1, 74.38],
    description: 'Light Sweet Crude Oil futures contract is the world’s most liquid energy contract.',
    history: generateHistory(74.38, 1.53)
  },
  {
    id: 'gc1',
    symbol: 'GC1!',
    name: 'Gold Futures',
    category: 'Futures',
    price: 2658.40,
    change: -4.20,
    changePercent: -0.16,
    volume: '194K',
    exchange: 'COMEX',
    logoText: 'GC',
    logoBg: '#d4af37',
    sparkline: [2664, 2662, 2660, 2659, 2658.4],
    description: 'Gold futures provide liquidity and price discovery for global precious metals market participants.',
    history: generateHistory(2658.40, -0.16)
  },

  // Forex
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'Forex',
    price: 1.0968,
    change: -0.0022,
    changePercent: -0.20,
    exchange: 'FX_IDC',
    logoText: 'EU',
    logoBg: '#003399',
    sparkline: [1.099, 1.0985, 1.0978, 1.0972, 1.0968],
    description: 'The EUR/USD currency pair represents the world’s two largest economic areas and is the most traded pair globally.',
    history: generateHistory(1.0968, -0.20)
  },
  {
    id: 'usdjpy',
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'Forex',
    price: 148.65,
    change: 0.74,
    changePercent: 0.50,
    exchange: 'FX_IDC',
    logoText: 'UJ',
    logoBg: '#bc002d',
    sparkline: [147.8, 148.1, 148.3, 148.5, 148.65],
    description: 'USD/JPY reflects the benchmark exchange rate between the United States dollar and the Japanese yen.',
    history: generateHistory(148.65, 0.50)
  },

  // Government bonds
  {
    id: 'us10y',
    symbol: 'US10Y',
    name: 'US 10 Year Treasury Yield',
    category: 'Government bonds',
    price: 3.98,
    change: 0.05,
    changePercent: 1.27,
    exchange: 'BOND · US',
    logoText: '10',
    logoBg: '#1e3a8a',
    sparkline: [3.92, 3.94, 3.95, 3.97, 3.98],
    description: 'The 10-year US Treasury note yield is used as a proxy for mortgage rates and broader economic growth prospects.',
    history: generateHistory(3.98, 1.27)
  },

  // Corporate bonds
  {
    id: 'lqd',
    symbol: 'LQD',
    name: 'iShares iBoxx Investment Grade',
    category: 'Corporate bonds',
    price: 110.45,
    change: -0.28,
    changePercent: -0.25,
    volume: '12.8M',
    exchange: 'NYSE Arca',
    logoText: 'LQ',
    logoBg: '#374151',
    sparkline: [110.8, 110.7, 110.6, 110.5, 110.45],
    description: 'An exchange-traded fund tracking high-grade US corporate bonds across diversified industry sectors.',
    history: generateHistory(110.45, -0.25)
  },

  // ETFs
  {
    id: 'spy',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    category: 'ETFs',
    price: 574.80,
    change: 2.34,
    changePercent: 0.41,
    marketCap: '584.2B',
    volume: '56.1M',
    exchange: 'NYSE Arca',
    logoText: 'SP',
    logoBg: '#0f766e',
    sparkline: [572, 573, 573.8, 574.2, 574.8],
    description: 'The SPDR S&P 500 ETF trust is the largest and oldest exchange-traded fund in the world.',
    history: generateHistory(574.80, 0.41)
  },
  {
    id: 'qqq',
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    category: 'ETFs',
    price: 489.15,
    change: 4.10,
    changePercent: 0.85,
    marketCap: '298.5B',
    volume: '34.7M',
    exchange: 'NASDAQ',
    logoText: 'QQ',
    logoBg: '#1d4ed8',
    sparkline: [484, 486, 487.5, 488.5, 489.15],
    description: 'Tracks the NASDAQ-100 Index, holding top tech powerhouses and innovative global growth companies.',
    history: generateHistory(489.15, 0.85)
  },

  // Economy
  {
    id: 'cpi',
    symbol: 'CPI-US',
    name: 'US Consumer Price Index (YoY)',
    category: 'Economy',
    price: 2.5,
    change: -0.4,
    changePercent: -13.79,
    exchange: 'BLS · USA',
    logoText: 'CP',
    logoBg: '#4f46e5',
    sparkline: [3.4, 3.2, 3.0, 2.9, 2.5],
    description: 'Headline annual change in the consumer price index, representing overall cost of living and inflation trajectory.',
    history: generateHistory(2.5, -13.79)
  }
];

export const WORLD_INDICES_DATA: WorldIndex[] = [
  {
    symbol: 'FTSE 100',
    name: 'Financial Times Stock Exchange 100',
    exchange: 'UKX',
    region: 'UK',
    price: 8280.63,
    change: -1.89,
    changePercent: -0.02
  },
  {
    symbol: 'DAX Index',
    name: 'Deutscher Aktienindex',
    exchange: 'DAX',
    region: 'Germany',
    price: 19004.78,
    change: 104.22,
    changePercent: 0.55
  },
  {
    symbol: 'Nikkei 225',
    name: 'Nikkei Stock Average',
    exchange: 'NI225',
    region: 'Japan',
    price: 39380.89,
    change: 114.49,
    changePercent: 0.30
  },
  {
    symbol: 'Hang Seng',
    name: 'Hang Seng Index',
    exchange: 'HSI',
    region: 'Hong Kong',
    price: 20926.79,
    change: 598.93,
    changePercent: 2.95
  }
];

export const CRYPTO_SPOTLIGHT_DATA: CryptoSpotlightItem[] = [
  {
    symbol: 'Bitcoin',
    name: 'Bitcoin',
    pair: 'BTCUSD',
    price: 62714.00,
    changePercent: 1.84,
    iconText: '₿',
    iconBg: '#f7931a'
  },
  {
    symbol: 'Ethereum',
    name: 'Ethereum',
    pair: 'ETHUSD',
    price: 2442.15,
    changePercent: -0.63,
    iconText: 'Ξ',
    iconBg: '#627eea'
  },
  {
    symbol: 'Solana',
    name: 'Solana',
    pair: 'SOLUSD',
    price: 144.30,
    changePercent: 3.42,
    iconText: 'S',
    iconBg: '#14f195',
    iconColor: '#000000'
  }
];
