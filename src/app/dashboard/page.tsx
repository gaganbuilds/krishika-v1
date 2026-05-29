'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sprout,
  CloudSun,
  Bell,
  Mic,
  ArrowRight,
  Wind,
  Droplets,
  CloudRain,
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import {
  QuickActions,
  CropPricesWidget,
  RemindersWidget,
  FarmActivitiesWidget,
  DiseaseManagerWidget,
  ExpertsBlogsWidget,
  CropPlannerWidget
} from '../../components/DashboardCards';
import { mockDb } from '../../database/mockDb';
import { greenshiftTranslations } from '../../data/greenshiftTranslations';
import dynamic from 'next/dynamic';

const FarmerNetworkMap = dynamic(
  () => import('../../components/dashboard/FarmerNetworkMap'),
  { ssr: false, loading: () => <div className="h-[500px] w-full bg-stone-50 animate-pulse rounded-2xl flex items-center justify-center text-stone-500 font-bold border border-emerald-800/10">Loading Farmer Network...</div> }
);


export default function DashboardPage() {
  const { reminders, t, farmerProfile, activeLang } = useApp();
  const pendingReminders = reminders.filter(r => !r.completed).length;

  const greenShiftStats = mockDb.getGreenShiftScore();
  const greenShiftHistory = mockDb.getGreenShiftHistory();
  const latestGreenShift = greenShiftHistory.length > 0 ? greenShiftHistory[0] : null;

  const gsT = (key: string): string => {
    const langDict = greenshiftTranslations[activeLang] || greenshiftTranslations['en-IN'];
    return (langDict as any)[key] || (greenshiftTranslations['en-IN'] as any)[key] || key;
  };

  const [selectedCropTab, setSelectedCropTab] = useState('Crop A');

  const farmerName = farmerProfile?.name || 'Karan Singh';
  const farmSize = farmerProfile?.farmSize || '5.5';
  const soilType = farmerProfile?.soilType || 'Black Soil';
  const primaryCrops = farmerProfile?.mainCrops || 'Wheat, Paddy';

  // Crop growth statuses
  const cropStatuses = [
    {
      tab: 'Crop A',
      name: 'Wheat (गेहूं)',
      stage: 'Flowering Stage (फूल आने की अवस्था)',
      progress: 75,
      health: 'Good (अच्छा)',
      waterAlert: 'Irrigation due in 2 days (२ दिन में सिंचाई आवश्यक)',
      seeding: 'Completed',
      vegetative: 'Completed',
      flowering: 'In Progress',
      harvesting: 'Pending'
    },
    {
      tab: 'Crop B',
      name: 'Paddy (धान)',
      stage: 'Vegetative Stage (वानस्पतिक अवस्था)',
      progress: 40,
      health: 'Excellent (उत्कृष्ट)',
      waterAlert: 'Water level optimal (पानी का स्तर सामान्य)',
      seeding: 'Completed',
      vegetative: 'In Progress',
      flowering: 'Pending',
      harvesting: 'Pending'
    }
  ];

  const currentCrop = cropStatuses.find(c => c.tab === selectedCropTab) || cropStatuses[0];

  // News ticker data
  const newsItems = [
    "Government increases PM-KISAN installment limits by ₹2,000 for 2026. (पीएम-किसान किस्त में ₹2,000 की वृद्धि।)",
    "Rain forecasted for Khanna district tomorrow. Postpone pesticide sprays! (खन्ना में कल बारिश की चेतावनी। कीटनाशक छिड़काव रोकें!)",
    "Wheat market prices at Khanna Mandi jump to ₹2,350 per quintal. (गेहूं का दाम खन्ना मंडी में ₹2,350 पहुंचा।)",
    "New subsidy scheme for solar irrigation pumps active now. Apply in Schemes section. (सोलर पंपों पर भारी सब्सिडी उपलब्ध।)"
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Marquee Ticker */}
      <div className="bg-amber-500 text-emerald-950 px-4 py-2 rounded-xl flex items-center gap-3 overflow-hidden shadow-sm border border-amber-600/20">
        <span className="font-extrabold text-[10px] uppercase bg-emerald-950 text-amber-400 px-2 py-0.5 rounded tracking-widest shrink-0">
          {t('newsTicker')}
        </span>
        <div className="relative w-full overflow-hidden h-5">
          <div className="absolute flex whitespace-nowrap gap-10 animate-marquee text-xs font-bold leading-5">
            {newsItems.map((n, idx) => (
              <span key={idx}>{n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
            <Sprout className="h-7 w-7 text-emerald-600" />
            {t('welcomeBack')}, {farmerName}!
          </h1>
          <p className="text-xs text-emerald-800/60 font-semibold mt-1">
            {farmSize} Acres • {soilType} • Crops: {primaryCrops}
          </p>
        </div>

        {pendingReminders > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-850 text-xs font-bold px-4 py-2.5 rounded-xl shadow-inner">
            <Bell className="h-4.5 w-4.5 text-emerald-700 shrink-0" />
            <span>{pendingReminders} {t('tasksRemaining')}</span>
          </div>
        )}
      </div>

      {/* Weather Advisory Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detailed Weather Stats */}
        <div className="lg:col-span-8 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between border border-emerald-700/30 relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 scale-150 group-hover:scale-160 transition-transform duration-500">
            <CloudSun className="h-48 w-48" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
            <div>
              <h3 className="font-extrabold text-sm text-emerald-300 uppercase tracking-widest">{t('weatherTitle')}</h3>
              <p className="text-2xl font-black tracking-tight mt-1.5 flex items-center gap-2">
                <span>31°C</span>
                <span className="text-base font-bold opacity-80">• Sunny (धूप)</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="text-center">
                <Wind className="h-4 w-4 mx-auto text-emerald-300" />
                <span className="text-[10px] block opacity-75 mt-1">Wind</span>
                <span className="text-xs font-bold block">14 km/h</span>
              </div>
              <div className="text-center">
                <Droplets className="h-4 w-4 mx-auto text-blue-300" />
                <span className="text-[10px] block opacity-75 mt-1">Humidity</span>
                <span className="text-xs font-bold block">42%</span>
              </div>
              <div className="text-center">
                <CloudRain className="h-4 w-4 mx-auto text-blue-400" />
                <span className="text-[10px] block opacity-75 mt-1">Rain</span>
                <span className="text-xs font-bold block">10%</span>
              </div>
            </div>
          </div>

          {/* AI Advisory Panel */}
          <div className="bg-emerald-950/50 border border-white/10 p-4.5 rounded-2xl mt-6 flex gap-3.5 items-start z-10">
            <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-semibold">
              <p className="text-amber-300 font-extrabold uppercase tracking-wider">{t('recommendations')}</p>
              <p className="opacity-90 mt-1">{t('weatherSunnyAdvice')}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Disease Manager Panel */}
        <div className="lg:col-span-4 space-y-6">
          <QuickActions />
          <DiseaseManagerWidget />
        </div>
      </div>

      {/* Crop Growth Status Segment */}
      <div className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-800/5 pb-3">
          <div>
            <h3 className="font-extrabold text-emerald-950 text-base">{t('cropStatusTitle')}</h3>
            <p className="text-[11px] text-emerald-800/50 font-semibold mt-0.5">Real-time status monitoring for your registered crops.</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-2">
            {cropStatuses.map((crop) => (
              <button
                key={crop.tab}
                onClick={() => setSelectedCropTab(crop.tab)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer
                  ${selectedCropTab === crop.tab
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : 'bg-emerald-50/50 border-emerald-850/15 text-emerald-850'
                  }
                `}
              >
                {crop.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="flex justify-between text-xs font-bold text-emerald-950">
              <span>Current Stage: <span className="text-emerald-700">{currentCrop.stage}</span></span>
              <span>{currentCrop.progress}% Complete</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${currentCrop.progress}%` }}
              />
            </div>

            {/* Stages Visual Nodes */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] font-bold">
              <div className="space-y-1">
                <span className={`block h-1.5 rounded-full ${currentCrop.seeding === 'Completed' ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                <span>Seeding</span>
              </div>
              <div className="space-y-1">
                <span className={`block h-1.5 rounded-full ${currentCrop.vegetative === 'Completed' ? 'bg-emerald-600' : currentCrop.vegetative === 'In Progress' ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                <span>Vegetative</span>
              </div>
              <div className="space-y-1">
                <span className={`block h-1.5 rounded-full ${currentCrop.flowering === 'Completed' ? 'bg-emerald-600' : currentCrop.flowering === 'In Progress' ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                <span>Flowering</span>
              </div>
              <div className="space-y-1">
                <span className={`block h-1.5 rounded-full ${currentCrop.harvesting === 'Completed' ? 'bg-emerald-600' : currentCrop.harvesting === 'In Progress' ? 'bg-emerald-400' : 'bg-stone-200'}`} />
                <span>Harvesting</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-emerald-50/40 border border-emerald-800/10 p-4.5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-950">
              <span>Crop Health Rating:</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">{currentCrop.health}</span>
            </div>

            <div className="flex gap-2.5 items-start text-xs text-amber-800 border border-amber-200/50 bg-amber-50/50 p-2.5 rounded-xl font-semibold">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{currentCrop.waterAlert}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GreenShift Engine Summary Card */}
      <div className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-emerald-800/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-sm">{gsT('title')} Status</h3>
              <p className="text-[10px] text-emerald-800/50 font-semibold mt-0.5">Monitoring chemical-to-organic transition & carbon credits</p>
            </div>
          </div>
          <Link
            href="/greenshift"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span>Open Engine</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sustainability Score */}
          <div className="bg-emerald-50/10 border border-emerald-800/5 p-4 rounded-xl flex items-center gap-3">
            <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#f4f4f5" strokeWidth="4" fill="transparent" />
                <circle cx="24" cy="24" r="20" stroke="#059669" strokeWidth="4" fill="transparent"
                  strokeDasharray={String(2 * Math.PI * 20)}
                  strokeDashoffset={String(2 * Math.PI * 20 * (1 - greenShiftStats.sustainabilityScore / 100))}
                />
              </svg>
              <span className="absolute text-xs font-black text-emerald-950">{greenShiftStats.sustainabilityScore}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">{gsT('overallScore')}</span>
              <span className="text-[10px] font-semibold text-emerald-800/70 mt-0.5 block">
                {greenShiftStats.sustainabilityScore >= 70 ? 'Excellent Ecosystem' : 'Improving soil biology'}
              </span>
            </div>
          </div>

          {/* Carbon Offset */}
          <div className="bg-emerald-50/10 border border-emerald-800/5 p-4 rounded-xl flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">{gsT('carbonOffset')}</span>
              <span className="text-sm font-black text-emerald-950 block mt-0.5">{greenShiftStats.carbonOffset} kg CO₂e</span>
            </div>
          </div>

          {/* Active Transition Roadmap */}
          <div className="bg-emerald-50/10 border border-emerald-800/5 p-4 rounded-xl flex items-center gap-3">
            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">{gsT('activeRoadmap')}</span>
              <span className="text-[11px] font-bold text-emerald-950 block mt-0.5 truncate max-w-[180px]">
                {latestGreenShift
                  ? `${latestGreenShift.productName} (Season 1)`
                  : 'No Active Transition Plan'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Prices, Reminders, Activities, Blogs, Planner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <CropPricesWidget />
        <RemindersWidget />
        <FarmActivitiesWidget />
        <ExpertsBlogsWidget />
        <CropPlannerWidget />
      </div>

      {/* Real-time Farmer Network Map */}
      <div className="pt-4">
        <FarmerNetworkMap />
      </div>
    </div>
  );
}
