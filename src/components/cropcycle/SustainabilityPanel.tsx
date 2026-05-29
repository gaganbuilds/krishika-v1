'use client';

import React from 'react';
import { SupportedCrop, cropcycleData } from '@/data/cropcycleMappings';
import { Sprout, Wind, Recycle, Lightbulb } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SustainabilityPanelProps {
  selectedCrop: SupportedCrop;
  quantity: number;
}

export const SustainabilityPanel: React.FC<SustainabilityPanelProps> = ({ selectedCrop, quantity }) => {
  const { t } = useApp();
  const data = cropcycleData[selectedCrop];

  const co2Avoided = (data.co2ReductionPerTon * quantity).toLocaleString();
  const envImpactScore = Math.min(100, Math.floor((data.co2ReductionPerTon * quantity) / 50));
  const wasteDiversionScore = Math.min(100, Math.floor((data.usabilityScore + data.qualityScore) / 2));

  return (
    <div className="bg-white dark:bg-emerald-950/40 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
        <Sprout className="w-5 h-5 text-emerald-500" />
        {t('step5Title') || 'Step 5: Sustainability & Alternatives'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30 flex flex-col items-center justify-center text-center">
          <Wind className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-bold text-blue-900 dark:text-blue-100 text-2xl">{co2Avoided} kg</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">Avoided CO₂ Emissions</p>
          <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-1">by not open burning {selectedCrop} residue</p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/30 flex flex-col items-center justify-center text-center">
          <Recycle className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-2xl">{wasteDiversionScore}/100</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Waste Diversion Score</p>
          <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-1">based on crop quality</p>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-xl border border-amber-100 dark:border-amber-800/30 flex flex-col items-center justify-center text-center">
          <Sprout className="w-8 h-8 text-amber-500 mb-3" />
          <h3 className="font-bold text-amber-900 dark:text-amber-100 text-2xl">{envImpactScore} Points</h3>
          <p className="text-sm text-amber-700 dark:text-amber-300">{t('envImpactScore') || 'Environmental Impact Score'}</p>
          <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-1">added to your GreenShift profile</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-slate-100 dark:border-emerald-800/50">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-emerald-500" />
          {t('altUtilGuide') || 'Alternative Utilization Guide'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          If industrial buyers are too far, consider these on-farm uses for {data.residueType}:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.alternativeUses.map((use, idx) => (
            <div key={idx} className="bg-white dark:bg-emerald-950 px-4 py-3 rounded-lg border border-emerald-100 dark:border-emerald-800 text-sm font-medium text-emerald-800 dark:text-emerald-200 text-center shadow-sm">
              {use}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
