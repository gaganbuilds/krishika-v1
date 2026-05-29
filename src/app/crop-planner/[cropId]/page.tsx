'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { cropPlannerData } from '../../../data/cropPlannerData';
import TimelineTracker from '../../../components/crop-planner/TimelineTracker';
import FinancialCalculator from '../../../components/crop-planner/FinancialCalculator';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, 
  MapPin, 
  Sprout, 
  ShieldAlert, 
  Bug, 
  Droplets, 
  ThermometerSun, 
  Activity, 
  CloudRain,
  Leaf
} from 'lucide-react';

const ProviderMap = dynamic(
  () => import('../../../components/disease-manager/ProviderMap'),
  { ssr: false, loading: () => <div className="h-[400px] w-full bg-emerald-50 animate-pulse rounded-2xl flex items-center justify-center text-emerald-800 font-bold">Loading Map...</div> }
);

export default function CropDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useApp();
  
  const cropId = params.cropId as string;
  const crop = cropPlannerData.find(c => c.id === cropId);

  if (!crop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-stone-700">Crop not found</h2>
        <button onClick={() => router.push('/crop-planner')} className="mt-4 text-emerald-600 font-bold hover:underline">
          Return to Planner
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-emerald-950 shadow-xl">
        <div className="absolute inset-0">
          <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />
        </div>
        
        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between min-h-[300px]">
          <button 
            onClick={() => router.push('/crop-planner')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit text-sm font-bold bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Crops
          </button>
          
          <div className="mt-auto pt-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                {crop.season}
              </span>
              <span className="bg-blue-500/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
                <ThermometerSun className="w-3 h-3" /> {crop.climateBadge}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">{crop.name} Cultivation</h1>
            <p className="text-emerald-100 font-medium text-lg max-w-2xl leading-relaxed">
              {crop.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Timeline & Calculator */}
        <div className="xl:col-span-7 space-y-8">
          <TimelineTracker cropId={crop.id} timeline={crop.timeline} />
          
          <FinancialCalculator crop={crop} />
          
          {/* Disease & Pest Handbook */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
              <h3 className="font-black text-stone-800 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Disease & Pest Handbook
              </h3>
              <p className="text-xs text-stone-500 font-semibold mt-1">Crop-specific risks and treatments</p>
            </div>
            
            <div className="divide-y divide-stone-100">
              {crop.handbook.map((issue, idx) => (
                <div key={idx} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-stone-800 flex items-center gap-2">
                      {issue.type === 'disease' ? <Activity className="w-4 h-4 text-rose-500" /> : <Bug className="w-4 h-4 text-amber-500" />}
                      {issue.name}
                    </h4>
                    <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{issue.type}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                      <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider mb-2">Symptoms</p>
                      <ul className="text-xs text-stone-600 font-medium list-disc pl-4 space-y-1">
                        {issue.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-2">Treatment</p>
                      <p className="text-xs text-stone-600 font-medium">{issue.treatment}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-stone-500 font-medium flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    <Activity className="w-3.5 h-3.5 text-stone-400" />
                    High Risk Stage: <span className="font-bold text-stone-700">{issue.riskStage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Climate, Fertilizer, Map */}
        <div className="xl:col-span-5 space-y-8">
          
          {/* Climate & Water */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <h3 className="font-black text-stone-800 text-lg mb-4 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-500" />
              Climate & Water Needs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" /> Requirement</p>
                <p className="text-sm font-bold text-blue-950">{crop.waterRequirement}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1"><ThermometerSun className="w-3 h-3" /> Temperature</p>
                <p className="text-sm font-bold text-amber-950">{crop.climateCompatibility.temp}</p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl col-span-2 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Rainfall Needed</p>
                  <p className="text-sm font-bold text-stone-800">{crop.climateCompatibility.rainfall}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Humidity</p>
                  <p className="text-sm font-bold text-stone-800">{crop.climateCompatibility.humidity}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fertilizer & Organic */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-6">
            <h3 className="font-black text-emerald-900 text-lg mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              Nutrient Management
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Recommended Application</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {crop.fertilizerManure.recommended.map((f, i) => (
                    <span key={i} className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-1 rounded-md">{f}</span>
                  ))}
                </div>
                <p className="text-xs text-stone-600 font-medium bg-stone-50 p-2 rounded-lg">{crop.fertilizerManure.timing}</p>
              </div>

              <div className="pt-4 border-t border-emerald-100">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Organic Alternatives
                </h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {crop.fertilizerManure.organicAlternatives.map((o, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2 py-1 rounded-md">{o}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Provider Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <div>
                <h3 className="font-black text-stone-800 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Nearby Fertilizer Providers
                </h3>
                <p className="text-[10px] text-stone-500 font-semibold mt-0.5">Real-time local shop availability</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ProviderMap />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
