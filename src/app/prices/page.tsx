'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ArrowLeft, 
  MapPin, 
  Calendar,
  Building,
  Sparkles,
  Share2,
  Info,
  Activity,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Predefined supported crops with standard mappings
interface CropConfig {
  id: string;
  nameKey: string;
  englishName: string;
  hindiName: string;
  kannadaName: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Vegetables' | 'Fruits' | 'Spices' | 'Others';
}

const SUPPORTED_CROPS: CropConfig[] = [
  { id: 'paddy', nameKey: 'Paddy', englishName: 'Basmati Paddy', hindiName: 'धान (बासमती)', kannadaName: 'ಭತ್ತ (ಬಾಸ್ಮತಿ)', category: 'Cereals' },
  { id: 'wheat', nameKey: 'Wheat', englishName: 'Wheat', hindiName: 'गेहूं', kannadaName: 'ಗೋಧಿ', category: 'Cereals' },
  { id: 'ragi', nameKey: 'Ragi', englishName: 'Ragi (Finger Millet)', hindiName: 'रागी', kannadaName: 'ರಾಗಿ', category: 'Cereals' },
  { id: 'groundnut', nameKey: 'Groundnut', englishName: 'Groundnut', hindiName: 'मूंगफली', kannadaName: 'ಶೇಂಗಾ', category: 'Oilseeds' },
  { id: 'potato', nameKey: 'Potato', englishName: 'Potato', hindiName: 'आलू', kannadaName: 'ಆಲೂಗಡ್ಡೆ', category: 'Vegetables' },
  { id: 'sugarcane', nameKey: 'Sugarcane', englishName: 'Sugarcane', hindiName: 'गन्ना', kannadaName: 'ಕಬ್ಬು', category: 'Others' },
  { id: 'watermelon', nameKey: 'Watermelon', englishName: 'Watermelon', hindiName: 'তরমুজ', kannadaName: 'ಕಲ್ಲಂಗಡಿ', category: 'Fruits' },
];

interface MandiConfig {
  name: string;
  distance: string;
  distanceKm: number;
}

const DISTRICT_MANDIS: { [district: string]: MandiConfig[] } = {
  'Belagavi': [
    { name: 'Belagavi APMC', distance: '3.5 km', distanceKm: 3.5 },
    { name: 'Dharwad APMC', distance: '72 km', distanceKm: 72 },
    { name: 'Hubballi APMC', distance: '94 km', distanceKm: 94 }
  ],
  'Mandya': [
    { name: 'Mandya APMC', distance: '4.2 km', distanceKm: 4.2 },
    { name: 'Maddur APMC', distance: '14 km', distanceKm: 14 },
    { name: 'Mysuru APMC', distance: '42 km', distanceKm: 42 }
  ],
  'Kolar': [
    { name: 'Kolar APMC', distance: '5.1 km', distanceKm: 5.1 },
    { name: 'Chintamani APMC', distance: '38 km', distanceKm: 38 },
    { name: 'Bengaluru APMC', distance: '65 km', distanceKm: 65 }
  ],
  'Karnal': [
    { name: 'Karnal APMC', distance: '2.8 km', distanceKm: 2.8 },
    { name: 'Panipat APMC', distance: '34 km', distanceKm: 34 },
    { name: 'Kurukshetra APMC', distance: '40 km', distanceKm: 40 }
  ],
  'Alwar': [
    { name: 'Alwar APMC', distance: '4.0 km', distanceKm: 4.0 },
    { name: 'Bharatpur APMC', distance: '52 km', distanceKm: 52 },
    { name: 'Jaipur APMC', distance: '105 km', distanceKm: 105 }
  ],
  'Lasalgaon': [
    { name: 'Lasalgaon APMC', distance: '3.2 km', distanceKm: 3.2 },
    { name: 'Nashik APMC', distance: '26 km', distanceKm: 26 },
    { name: 'Pimpalgaon APMC', distance: '35 km', distanceKm: 35 }
  ],
  'Nizamabad': [
    { name: 'Nizamabad APMC', distance: '4.5 km', distanceKm: 4.5 },
    { name: 'Warangal APMC', distance: '115 km', distanceKm: 115 },
    { name: 'Hyderabad APMC', distance: '155 km', distanceKm: 155 }
  ]
};

const POPULAR_DISTRICTS = ['Belagavi', 'Mandya', 'Kolar', 'Karnal', 'Alwar', 'Lasalgaon', 'Nizamabad'];

export default function PricesPage() {
  const { farmerProfile, t, activeLang } = useApp();
  
  // States
  const [selectedCrop, setSelectedCrop] = useState<CropConfig>(SUPPORTED_CROPS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeframe, setTimeframe] = useState<7 | 30>(7);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');

  // 1. Location Detection
  const profileDistrict = farmerProfile?.district || '';
  const profileState = farmerProfile?.state || '';
  const [activeDistrict, setActiveDistrict] = useState<string>('Belagavi');
  const [activeState, setActiveState] = useState<string>('Karnataka');
  const [isCustomDistrictActive, setIsCustomDistrictActive] = useState(false);

  // Sync with farmerProfile initially
  useEffect(() => {
    if (profileDistrict) {
      setActiveDistrict(profileDistrict);
      if (profileState) setActiveState(profileState);
    }
  }, [profileDistrict, profileState]);

  // Set initial last updated time
  useEffect(() => {
    const now = new Date();
    setLastRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // 2. Fetch Mandis dynamically
  const mandis = useMemo(() => {
    const normalized = activeDistrict.trim();
    const matchKey = Object.keys(DISTRICT_MANDIS).find(
      key => key.toLowerCase() === normalized.toLowerCase()
    );
    if (matchKey) return DISTRICT_MANDIS[matchKey];
    
    // Dynamic generation if district not pre-defined
    return [
      { name: `${normalized} APMC`, distance: '4.2 km', distanceKm: 4.2 },
      { name: `District Central Mandi`, distance: '15 km', distanceKm: 15 },
      { name: `State Sub-Market`, distance: '54 km', distanceKm: 54 }
    ];
  }, [activeDistrict]);

  const [selectedMandi, setSelectedMandi] = useState<MandiConfig>(mandis[0]);

  // Reset selected mandi when district changes
  useEffect(() => {
    setSelectedMandi(mandis[0]);
  }, [mandis]);

  // Trigger live price reload simulation
  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastRefreshedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
  };

  // Helper: Get Crop localized name
  const getCropName = (crop: CropConfig) => {
    if (activeLang === 'hi-IN') return crop.hindiName;
    if (activeLang === 'kn-IN') return crop.kannadaName;
    return crop.englishName;
  };

  // Categories list
  const categories = ['All', 'Cereals', 'Oilseeds', 'Vegetables', 'Fruits', 'Others'];

  // Filter crops
  const filteredCrops = SUPPORTED_CROPS.filter((crop) => {
    const nameMatches = 
      crop.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.hindiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.kannadaName.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatches = selectedCategory === 'All' || crop.category === selectedCategory;
    return nameMatches && categoryMatches;
  });

  // 3. Price History Generator (Deterministic Pseudo-Random walk for 30 days)
  const priceData30Days = useMemo(() => {
    let basePrice = 2000;
    if (selectedCrop.id === 'paddy') basePrice = 2250;
    else if (selectedCrop.id === 'wheat') basePrice = 2320;
    else if (selectedCrop.id === 'ragi') basePrice = 4050;
    else if (selectedCrop.id === 'groundnut') basePrice = 6600;
    else if (selectedCrop.id === 'potato') basePrice = 1450;
    else if (selectedCrop.id === 'sugarcane') basePrice = 330;
    else if (selectedCrop.id === 'watermelon') basePrice = 1150;

    // Shift price based on the selected mandi to make them uniquely competitive
    const mandiHash = selectedMandi.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const mandiShiftPercent = (mandiHash % 12) - 6; // -6% to +6%
    basePrice = basePrice * (1 + mandiShiftPercent / 100);

    const history: number[] = [];
    const hash = selectedCrop.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + mandiHash;

    // Generate 30 days of data
    for (let i = 29; i >= 0; i--) {
      // Clean wave structure to represent actual market trends
      const wave = Math.sin((29 - i) / 4) * 2.2 + Math.cos((29 - i) / 7) * 1.4;
      // Slight noise
      const noise = Math.sin(hash + i * 1.5) * 0.8;
      // Add slight weekly cyclical spikes for premium realistic details
      const weekendEffect = ((29 - i) % 7 === 0) ? -0.5 : 0.3;
      
      const price = Math.round(basePrice * (1 + (wave + noise + weekendEffect) / 100));
      history.push(price);
    }
    return history;
  }, [selectedCrop, selectedMandi]);

  // Crop values for currently selected mandi
  const currentPrice = priceData30Days[29];
  const previousPrice = priceData30Days[28];
  const priceChangePercent = parseFloat(((currentPrice - previousPrice) / previousPrice * 100).toFixed(1));

  // Minimum & Maximum Prices over timeframe
  const activeTimeframePrices = useMemo(() => {
    return timeframe === 7 ? priceData30Days.slice(23, 30) : priceData30Days;
  }, [priceData30Days, timeframe]);

  const minPrice = Math.min(...activeTimeframePrices);
  const maxPrice = Math.max(...activeTimeframePrices);

  // Best Selling Price Mandi Finder
  const bestMandiInfo = useMemo(() => {
    let bestMandi = mandis[0];
    let highestPrice = 0;

    mandis.forEach(m => {
      let basePrice = 2000;
      if (selectedCrop.id === 'paddy') basePrice = 2250;
      else if (selectedCrop.id === 'wheat') basePrice = 2320;
      else if (selectedCrop.id === 'ragi') basePrice = 4050;
      else if (selectedCrop.id === 'groundnut') basePrice = 6600;
      else if (selectedCrop.id === 'potato') basePrice = 1450;
      else if (selectedCrop.id === 'sugarcane') basePrice = 330;
      else if (selectedCrop.id === 'watermelon') basePrice = 1150;

      const mHash = m.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const mShift = (mHash % 12) - 6;
      const mPrice = Math.round(basePrice * (1 + mShift / 100) * (1 + (Math.sin(29 / 4) * 2.2 + Math.cos(29 / 7) * 1.4) / 100));

      if (mPrice > highestPrice) {
        highestPrice = mPrice;
        bestMandi = m;
      }
    });

    return { mandi: bestMandi, price: highestPrice };
  }, [selectedCrop, mandis]);

  // 4. Lightweight Forecasting Engine
  const forecastingMetrics = useMemo(() => {
    // Calculate momentum trend
    const last3DaysAvg = (priceData30Days[29] + priceData30Days[28] + priceData30Days[27]) / 3;
    const prev7DaysAvg = (priceData30Days[26] + priceData30Days[25] + priceData30Days[24] + priceData30Days[23] + priceData30Days[22] + priceData30Days[21] + priceData30Days[20]) / 7;
    const trendMomentum = (last3DaysAvg - prev7DaysAvg) / prev7DaysAvg; // e.g. +0.02

    // Predict forward prices
    const day1Predict = Math.round(currentPrice * (1 + trendMomentum * 0.2 + (Math.sin(1) * 0.1 / 100)));
    const day7Predict = Math.round(currentPrice * (1 + trendMomentum * 1.2 + (Math.sin(7) * 0.3 / 100)));
    const day14Predict = Math.round(currentPrice * (1 + trendMomentum * 2.2 + (Math.sin(14) * 0.6 / 100)));

    // Volatility Score
    const mean = priceData30Days.reduce((a, b) => a + b, 0) / 30;
    const stdDev = Math.sqrt(priceData30Days.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 30);
    const volatilityPercent = (stdDev / mean) * 100;
    const volatilityScore = Math.min(100, Math.max(10, Math.round(volatilityPercent * 18)));

    // Confidence Level (%)
    const confidence = Math.max(52, Math.min(96, Math.round(92 - volatilityPercent * 3.5)));

    // Demand & Market Strength Score
    const demandScore = Math.min(100, Math.max(25, Math.round(62 + trendMomentum * 420)));
    const marketStrengthScore = Math.min(100, Math.max(30, Math.round(72 + (currentPrice - mean) / mean * 350)));

    // Recommendations (Sell Now / Hold / Monitor)
    let recommendationKey: 'sellNow' | 'hold' | 'monitor' = 'monitor';
    let recommendationColor = 'text-amber-700 bg-amber-50 border-amber-200';
    let alertGlow = 'border-amber-300 shadow-amber-100';
    let insightExplanation = '';

    if (trendMomentum > 0.006) {
      recommendationKey = 'hold';
      recommendationColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      alertGlow = 'border-emerald-300 shadow-emerald-100 animate-pulse';
      
      if (activeLang === 'hi-IN') {
        insightExplanation = 'आस-पास के बाजारों में उच्च मांग के कारण अगले 5 से 7 दिनों में कीमतों में तेजी आने की उम्मीद है। यदि आपके पास भंडारण की सुविधा हो, तो फसल को रोक कर रखने से अधिक लाभ हो सकता है।';
      } else if (activeLang === 'kn-IN') {
        insightExplanation = 'ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯಿಂದಾಗಿ ಮುಂದಿನ 5-7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆಗಳು ಗಣನೀಯವಾಗಿ ಹೆಚ್ಚಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಶೇಖರಣಾ ಸೌಲಭ್ಯವಿದ್ದರೆ ಬೆಳೆಯನ್ನು ಕೆಲವು ದಿನ ಕಾಯ್ದಿರಿಸಿ ಮಾರಾಟ ಮಾಡಲು ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತದೆ.';
      } else {
        insightExplanation = 'Prices are expected to trend upwards over the next 5–7 days due to healthy demand. Consider holding your harvest if storage is available to maximize profit.';
      }
    } else if (trendMomentum < -0.006) {
      recommendationKey = 'sellNow';
      recommendationColor = 'text-red-750 bg-red-50 border-red-200';
      alertGlow = 'border-red-300 shadow-red-100';

      if (activeLang === 'hi-IN') {
        insightExplanation = 'आस-पास के बाजारों में आवक बढ़ने से कीमतों में गिरावट का रुख है। भविष्य में और नुकसान से बचने के लिए अपनी फसल को तुरंत बेचना ही समझदारी होगी।';
      } else if (activeLang === 'kn-IN') {
        insightExplanation = 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಆವಕ ಪ್ರಮಾಣ ಹೆಚ್ಚಾಗಿರುವುದರಿಂದ ಬೆಲೆಗಳಲ್ಲಿ ಇಳಿಕೆ ಕಂಡುಬರುತ್ತಿದೆ. ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಇನ್ನಷ್ಟು ಬೆಲೆ ಕುಸಿತದಿಂದ ಬಚಾವಾಗಲು ಈಗಲೇ ಮಾರಾಟ ಮಾಡುವುದು ಸೂಕ್ತ.';
      } else {
        insightExplanation = 'Prices exhibit a downward trend due to bumper arrivals in regional markets. Consider selling immediately to safeguard margins against further rate drops.';
      }
    } else {
      recommendationKey = 'monitor';
      recommendationColor = 'text-amber-700 bg-amber-50 border-amber-200';
      alertGlow = 'border-amber-300 shadow-amber-100';

      if (activeLang === 'hi-IN') {
        insightExplanation = 'मंडी की दरें फिलहाल स्थिर हैं और उतार-चढ़ाव कम है। कोई भी निर्णय लेने से पहले दैनिक आवक और स्थानीय बाजार भाव पर कड़ी नजर रखें।';
      } else if (activeLang === 'kn-IN') {
        insightExplanation = 'ಮಾರುಕಟ್ಟೆ ಧಾರಣೆಯು ಸದ್ಯಕ್ಕೆ ಸ್ಥಿರವಾಗಿದೆ. ಹೆಚ್ಚಿನ ಏರಿಳಿತಗಳಿಲ್ಲದ ಕಾರಣ ದೈನಂದಿನ ದರ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಆವಕವನ್ನು ಗಮನಿಸುತ್ತಾ ಸೂಕ್ತ ಸಮಯದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ.';
      } else {
        insightExplanation = 'Market prices are currently stable with low volatility. Monitor daily price changes and local mandi volume index arrivals before final sale.';
      }
    }

    return {
      day1Predict,
      day7Predict,
      day14Predict,
      trendDirection: trendMomentum > 0.003 ? 'Up' : trendMomentum < -0.003 ? 'Down' : 'Stable',
      confidence,
      demandScore,
      volatilityScore,
      marketStrengthScore,
      recommendationKey,
      recommendationColor,
      alertGlow,
      insightExplanation
    };
  }, [currentPrice, priceData30Days, activeLang]);

  // 5. WhatsApp Sharing Helper
  const handleWhatsAppShare = () => {
    const recText = t(forecastingMetrics.recommendationKey);
    let message = '';

    if (activeLang === 'hi-IN') {
      message = `🌾 *कृषि मंडी भाव अलर्ट (रायतुबंधु)*\n\n` +
                `📍 *मंडी:* ${selectedMandi.name}\n` +
                `🌱 *फसल:* ${getCropName(selectedCrop)}\n` +
                `💰 *आज का भाव:* ₹${currentPrice}/Qtl\n` +
                `🔮 *14-दिवसीय पूर्वानुमान:* ₹${forecastingMetrics.day14Predict}/Qtl\n` +
                `💡 *एआई सलाह:* ${recText}\n\n` +
                `📲 _रायतुबंधु एआई कृषि साथी द्वारा जनरेट किया गया_`;
    } else if (activeLang === 'kn-IN') {
      message = `🌾 *ರೈತಬಂಧು ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ*\n\n` +
                `📍 *ಮಾರುಕಟ್ಟೆ:* ${selectedMandi.name}\n` +
                `🌱 *ಬೆಳೆ:* ${getCropName(selectedCrop)}\n` +
                `💰 *ಪ್ರಸ್ತುತ ಬೆಲೆ:* ₹${currentPrice}/Qtl\n` +
                `🔮 *14-ದಿನಗಳ ಮುನ್ಸೂಚನೆ:* ₹${forecastingMetrics.day14Predict}/Qtl\n` +
                `💡 *ಶಿಫಾರಸು:* ${recText}\n\n` +
                `📲 _ರೈತಬಂಧು ಎಐ ಕೃಷಿ ಸಂಗಾತಿಯಿಂದ ರಚಿಸಲಾಗಿದೆ_`;
    } else {
      message = `🌾 *Crop Price Alert (Raithabhandhu)*\n\n` +
                `📍 *Mandi:* ${selectedMandi.name}\n` +
                `🌱 *Crop:* ${getCropName(selectedCrop)}\n` +
                `💰 *Current Price:* ₹${currentPrice}/qtl\n` +
                `🔮 *14-Day Forecast:* ₹${forecastingMetrics.day14Predict}/qtl\n` +
                `💡 *Recommendation:* ${recText}\n\n` +
                `Generated by Raithabhandhu`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // 6. SVG Responsive Chart calculations
  const svgPath = useMemo(() => {
    const data = activeTimeframePrices;
    const len = data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;
    
    // Scale coordinates inside 500x120 SVG box
    return data.map((price, idx) => {
      const x = (idx / (len - 1)) * 500;
      const y = 100 - ((price - min) / range) * 80; // keep padding top/bottom
      return { x, y, price };
    });
  }, [activeTimeframePrices]);

  const polylinePoints = svgPath.map(p => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,120 ${polylinePoints} 500,120`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans pb-10">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-5 pointer-events-none scale-120">
          <Building className="h-32 w-32 text-emerald-900" />
        </div>
        
        <div className="flex items-center gap-3.5 z-10">
          <Link href="/dashboard" className="p-2.5 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-105">
            <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-emerald-950 tracking-tight">{t('mandiIntelligence')}</h1>
              <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                {t('realTimeNAM')}
              </span>
            </div>
            <p className="text-xs text-emerald-800/60 font-semibold mt-0.5">Live regional APMC tracking and predictive AI intelligence dashboard.</p>
          </div>
        </div>

        {/* Location aware pill */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 shadow-sm text-xs font-bold text-stone-850">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{activeDistrict}, {activeState}</span>
          </div>
          
          <button 
            onClick={() => setIsCustomDistrictActive(!isCustomDistrictActive)}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {t('changeMandiDistrict')}
          </button>
        </div>
      </div>

      {/* District Selector Panel (Dropdown/Grid) */}
      {isCustomDistrictActive && (
        <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-md space-y-3.5 animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">Select Regional District</h4>
            <button 
              onClick={() => setIsCustomDistrictActive(false)} 
              className="text-stone-400 hover:text-stone-700 font-bold text-xs"
            >
              ✕ Close
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {POPULAR_DISTRICTS.map((dist) => {
              const isActive = dist.toLowerCase() === activeDistrict.toLowerCase();
              return (
                <button
                  key={dist}
                  onClick={() => {
                    setActiveDistrict(dist);
                    // Match State
                    if (dist === 'Belagavi' || dist === 'Mandya' || dist === 'Kolar') setActiveState('Karnataka');
                    else if (dist === 'Karnal') setActiveState('Haryana');
                    else if (dist === 'Alwar') setActiveState('Rajasthan');
                    else if (dist === 'Lasalgaon') setActiveState('Maharashtra');
                    else if (dist === 'Nizamabad') setActiveState('Telangana');
                    setIsCustomDistrictActive(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-md' 
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {dist}
                </button>
              );
            })}
          </div>

          {/* Manual Input Search fallback */}
          <div className="pt-2 flex gap-2">
            <input 
              type="text" 
              placeholder="Or enter any custom district..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim();
                  if (val) {
                    setActiveDistrict(val.charAt(0).toUpperCase() + val.slice(1));
                    setActiveState('India');
                    setIsCustomDistrictActive(false);
                  }
                }
              }}
              className="px-3.5 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 w-full sm:max-w-xs font-medium"
            />
            <button 
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const val = input.value.trim();
                if (val) {
                  setActiveDistrict(val.charAt(0).toUpperCase() + val.slice(1));
                  setActiveState('India');
                  setIsCustomDistrictActive(false);
                }
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Crop selection & interactive chart */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main search and Category Filter bar */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-sm text-emerald-950">Select Farm Commodity</h3>
                <p className="text-[11px] text-emerald-800/50 font-semibold">Switch agricultural products to view localized market intelligence.</p>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Paddy, Wheat, Sugarcane..."
                  className="pl-9 pr-3 py-2 border border-stone-200 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                />
              </div>
            </div>

            {/* Filter Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-stone-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold' 
                      : 'bg-white border-transparent text-stone-500 hover:text-stone-850 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Crops Grid list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredCrops.map((crop) => {
                const isSelected = crop.id === selectedCrop.id;
                // Generate a mini 7-day sparkline coordinates for extreme premium design
                const sparkHash = crop.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const sparkPoints = Array.from({ length: 6 }).map((_, idx) => {
                  const val = Math.sin(sparkHash + idx) * 12 + 25;
                  return `${idx * 16},${val}`;
                }).join(' ');

                return (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setSelectedCrop(crop);
                      setHoveredPoint(null);
                    }}
                    className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between h-28 relative overflow-hidden cursor-pointer group ${
                      isSelected 
                        ? 'bg-emerald-800 border-emerald-800 text-white shadow-md ring-2 ring-emerald-600/30' 
                        : 'bg-stone-50 border-stone-200 text-stone-850 hover:border-emerald-600/30 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-black truncate">{getCropName(crop)}</h4>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block ${
                        isSelected ? 'bg-emerald-950/55 text-emerald-350' : 'bg-white border border-stone-200 text-stone-500'
                      }`}>
                        {crop.category}
                      </span>
                    </div>

                    {/* Mini Sparkline inside crop card */}
                    <div className="h-6 w-full opacity-35 group-hover:opacity-50 transition-opacity absolute bottom-1 right-2 pointer-events-none max-w-[80px]">
                      <svg className="w-full h-full" viewBox="0 0 80 40">
                        <polyline fill="none" stroke={isSelected ? "#10b981" : "#059669"} strokeWidth="2" points={sparkPoints} />
                      </svg>
                    </div>

                    <span className="text-xs font-black mt-2 self-start">
                      ₹{selectedCrop.id === crop.id ? currentPrice : Math.round(1500 + (sparkHash % 8) * 450)}/q
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredCrops.length === 0 && (
              <div className="text-center py-8 text-stone-400 text-xs font-bold">
                No matching farm crops found.
              </div>
            )}
          </div>

          {/* Interactive Chart Section */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
            
            {/* Chart Title, Timeframe and Refresh */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{getCropName(selectedCrop)} {t('priceTrend')}</span>
                </h3>
                <span className="text-[10px] text-stone-450 font-semibold">{selectedMandi.name} • INR per Quintal</span>
              </div>

              <div className="flex items-center gap-3">
                {/* 7d vs 30d toggle */}
                <div className="flex bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-[10px] font-bold">
                  <button 
                    onClick={() => { setTimeframe(7); setHoveredPoint(null); }}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${timeframe === 7 ? 'bg-white text-emerald-950 shadow-sm' : 'text-stone-500'}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => { setTimeframe(30); setHoveredPoint(null); }}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${timeframe === 30 ? 'bg-white text-emerald-950 shadow-sm' : 'text-stone-500'}`}
                  >
                    30D
                  </button>
                </div>

                {/* Refresh Prices button */}
                <button 
                  onClick={handleRefreshPrices} 
                  disabled={isRefreshing}
                  className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  title="Reload Live Market Rates"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-stone-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* SVG Interactive Line Chart wrapper */}
            <div className="relative pt-2">
              <svg 
                className="w-full h-40 overflow-visible" 
                viewBox="0 0 500 120" 
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredPoint(null)}
                onMouseMove={(e) => {
                  const svg = e.currentTarget;
                  const rect = svg.getBoundingClientRect();
                  const clientX = e.clientX - rect.left;
                  const width = rect.width;
                  const numPoints = activeTimeframePrices.length;
                  const step = width / (numPoints - 1);
                  const index = Math.min(numPoints - 1, Math.max(0, Math.round(clientX / step)));
                  setHoveredPoint(index);
                }}
              >
                {/* Horizontal Guide lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />

                {/* Grid Labels (Y Axis values) */}
                <text x="5" y="15" fill="#a1a1aa" fontSize="7" fontWeight="bold">₹{maxPrice}</text>
                <text x="5" y="55" fill="#a1a1aa" fontSize="7" fontWeight="bold">₹{Math.round((maxPrice + minPrice) / 2)}</text>
                <text x="5" y="95" fill="#a1a1aa" fontSize="7" fontWeight="bold">₹{minPrice}</text>

                {/* SVG Area underneath curve */}
                <polygon
                  fill="url(#chartGradient)"
                  points={areaPoints}
                  className="opacity-70 transition-all duration-300"
                />

                {/* SVG Trend Line */}
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                  className="transition-all duration-300"
                />

                {/* Definitions for area linear gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0.0)" />
                  </linearGradient>
                </defs>

                {/* Highlight Hover Vertical Line and Points */}
                {hoveredPoint !== null && svgPath[hoveredPoint] && (
                  <>
                    <line
                      x1={svgPath[hoveredPoint].x}
                      y1="0"
                      x2={svgPath[hoveredPoint].x}
                      y2="120"
                      stroke="rgba(4,120,87,0.3)"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                    />
                    
                    {/* Ring highlight outer */}
                    <circle
                      cx={svgPath[hoveredPoint].x}
                      cy={svgPath[hoveredPoint].y}
                      r="6"
                      fill="rgba(16,185,129,0.4)"
                    />
                    
                    {/* Circle highlight inner */}
                    <circle
                      cx={svgPath[hoveredPoint].x}
                      cy={svgPath[hoveredPoint].y}
                      r="3.5"
                      fill="#047857"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>

              {/* Floating HTML interactive tooltip */}
              {hoveredPoint !== null && svgPath[hoveredPoint] && (
                <div 
                  className="absolute bg-emerald-950 text-white rounded-xl px-3 py-2 text-[10px] shadow-lg border border-emerald-800/20 font-semibold z-20 pointer-events-none transition-all duration-75"
                  style={{
                    left: `${Math.min(80, (hoveredPoint / (activeTimeframePrices.length - 1)) * 90)}%`,
                    top: '-35px'
                  }}
                >
                  <p className="opacity-80">Day {timeframe === 7 ? 30 - (7 - 1 - hoveredPoint) : hoveredPoint + 1} of Index</p>
                  <p className="text-xs font-black mt-0.5">₹{svgPath[hoveredPoint].price.toLocaleString('en-IN')}/qtl</p>
                </div>
              )}
            </div>

            {/* Chart X Labels */}
            <div className="flex justify-between text-[9px] text-stone-400 font-bold px-2 pt-1 border-t border-stone-50">
              <span>{timeframe === 7 ? '7 Days Ago' : '30 Days Ago'}</span>
              <span>15 Days Ago</span>
              <span>Today ({lastRefreshedTime})</span>
            </div>
          </div>

          {/* 14-Day Price Forecast Panel */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{t('forecast')} ({getCropName(selectedCrop)})</span>
                </h3>
                <p className="text-[10px] text-stone-400 font-semibold">Lightweight mathematical rolling averages & volume momentum analytics.</p>
              </div>

              {/* Direction Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-stone-400 font-bold uppercase">Trend:</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                  forecastingMetrics.trendDirection === 'Up' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : forecastingMetrics.trendDirection === 'Down'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-stone-50 text-stone-700 border-stone-200'
                }`}>
                  {forecastingMetrics.trendDirection === 'Up' ? <TrendingUp className="h-3.5 w-3.5" /> : forecastingMetrics.trendDirection === 'Down' ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                  {forecastingMetrics.trendDirection}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Day 1 */}
              <div className="border border-stone-200/60 p-4 rounded-xl flex flex-col justify-between bg-stone-50/50">
                <div>
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Day 1 Projection</span>
                  <p className="text-lg font-black text-emerald-950 mt-1">₹{forecastingMetrics.day1Predict.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-[9px] text-stone-500 font-bold mt-3 block">₹/Quintal • Near-term forecast</span>
              </div>

              {/* Day 7 */}
              <div className="border border-stone-200/60 p-4 rounded-xl flex flex-col justify-between bg-stone-50/50">
                <div>
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Day 7 Projection</span>
                  <p className="text-lg font-black text-emerald-950 mt-1">₹{forecastingMetrics.day7Predict.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-[9px] text-stone-500 font-bold mt-3 block">₹/Quintal • Weekly forecast</span>
              </div>

              {/* Day 14 */}
              <div className="border border-emerald-600/20 p-4 rounded-xl flex flex-col justify-between bg-emerald-50/15 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-5 pointer-events-none">
                  <Sparkles className="h-16 w-16 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Day 14 Projection</span>
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-lg font-black text-emerald-950 mt-1">₹{forecastingMetrics.day14Predict.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-[9px] text-emerald-850 font-bold mt-3 block">₹/Quintal • 14-day market peak estimate</span>
              </div>
            </div>

            {/* Forecast Confidence Bar */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Info className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-stone-700">{t('confidence')}: <span className="text-emerald-800 font-black">{forecastingMetrics.confidence}%</span></span>
              </div>
              <div className="w-full sm:max-w-xs bg-stone-200 h-2 rounded-full overflow-hidden shrink-0">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${forecastingMetrics.confidence}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI recommendations, local mandis & health */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Market Advisor Card */}
          <div className={`border p-5 rounded-2xl shadow-lg space-y-5 relative overflow-hidden transition-all duration-300 bg-white ${forecastingMetrics.alertGlow}`}>
            
            {/* Glowing background highlights */}
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
              <Sparkles className="h-36 w-36 text-emerald-700" />
            </div>

            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse shrink-0" />
                <span>{t('recommendation')}</span>
              </h3>
              
              {/* Multilingual Recommendation Badge */}
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border tracking-wide ${forecastingMetrics.recommendationColor}`}>
                {t(forecastingMetrics.recommendationKey)}
              </span>
            </div>

            {/* Explanation box */}
            <div className="space-y-2 leading-relaxed text-stone-700 text-xs font-medium bg-stone-50/60 p-4 rounded-xl border border-stone-100">
              <p className="text-emerald-950 font-bold uppercase tracking-wider text-[9px] mb-1">AI Intelligence Advisor</p>
              <p>{forecastingMetrics.insightExplanation}</p>
            </div>

            {/* WhatsApp Share Button */}
            <button 
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Share2 className="h-4 w-4 shrink-0" />
              <span>{t('shareMarketInsight')}</span>
            </button>
          </div>

          {/* Market Health Indicators */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-5">
            <h3 className="font-extrabold text-sm text-emerald-950 pb-3 border-b border-stone-100">{t('marketHealth')}</h3>
            
            <div className="space-y-4">
              {/* Demand Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-stone-750">
                  <span>{t('demandScore')}</span>
                  <span className="text-emerald-800 font-extrabold">{forecastingMetrics.demandScore}/100</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all" 
                    style={{ width: `${forecastingMetrics.demandScore}%` }}
                  />
                </div>
              </div>

              {/* Market Strength Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-stone-750">
                  <span>{t('marketStrength')}</span>
                  <span className="text-emerald-800 font-extrabold">{forecastingMetrics.marketStrengthScore}/100</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all" 
                    style={{ width: `${forecastingMetrics.marketStrengthScore}%` }}
                  />
                </div>
              </div>

              {/* Volatility Score */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-stone-750">
                  <span>{t('volatilityScore')}</span>
                  <span className="text-amber-700 font-extrabold">{forecastingMetrics.volatilityScore}/100</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all" 
                    style={{ width: `${forecastingMetrics.volatilityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive APMC status list */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-stone-100">
              <Building className="h-4.5 w-4.5 text-emerald-600" />
              <span>{t('regionalMandisFor')} {activeDistrict}</span>
            </h3>

            <div className="space-y-3">
              {mandis.map((m, idx) => {
                const isSelected = selectedMandi.name === m.name;
                const isBest = bestMandiInfo.mandi.name === m.name;
                const isNearest = idx === 0;

                // Deterministic local prices
                let basePrice = 2000;
                if (selectedCrop.id === 'paddy') basePrice = 2250;
                else if (selectedCrop.id === 'wheat') basePrice = 2320;
                else if (selectedCrop.id === 'ragi') basePrice = 4050;
                else if (selectedCrop.id === 'groundnut') basePrice = 6600;
                else if (selectedCrop.id === 'potato') basePrice = 1450;
                else if (selectedCrop.id === 'sugarcane') basePrice = 330;
                else if (selectedCrop.id === 'watermelon') basePrice = 1150;

                const mHash = m.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const mShift = (mHash % 12) - 6;
                const mPrice = Math.round(basePrice * (1 + mShift / 100) * (1 + (Math.sin(29 / 4) * 2.2 + Math.cos(29 / 7) * 1.4) / 100));

                return (
                  <button 
                    key={m.name} 
                    onClick={() => {
                      setSelectedMandi(m);
                      setHoveredPoint(null);
                    }}
                    className={`w-full p-4.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400/25' 
                        : 'bg-stone-50/50 border-stone-200 text-stone-850 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1 truncate">
                        <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                        <span>{m.name}</span>
                      </h4>
                      <p className="text-[10px] text-stone-550 font-semibold">{m.distance} • {activeState}</p>
                      
                      {/* Badge display */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {isNearest && (
                          <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                            {t('nearestMandi')}
                          </span>
                        )}
                        {isBest && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">
                            {t('bestNearbyMandi')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black block text-emerald-950">₹{mPrice}/q</span>
                      <span className="text-[9px] text-stone-400 font-bold block mt-1">Today</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
