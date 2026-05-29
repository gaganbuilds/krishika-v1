'use client';

import React from 'react';
import { SupportedCrop, cropcycleData } from '@/data/cropcycleMappings';
import { FlaskConical, Target, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface ResidueAnalysisProps {
  selectedCrop: SupportedCrop;
}

export const ResidueAnalysis: React.FC<ResidueAnalysisProps> = ({ selectedCrop }) => {
  const { t } = useApp();
  const data = cropcycleData[selectedCrop];

  return (
    <div className="bg-white dark:bg-emerald-950/40 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-emerald-500" />
        {t('step2Title') || 'Step 2: Residue Analysis Engine'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Scores */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {t('usabilityScore') || 'Usability Score'}
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{data.usabilityScore}/100</span>
            </div>
            <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${data.usabilityScore}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {t('qualityScore') || 'Quality Score'}
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{data.qualityScore}/100</span>
            </div>
            <div className="h-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${data.qualityScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                {t('marketabilityScore') || 'Marketability Score'}
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{data.marketabilityScore}/100</span>
            </div>
            <div className="h-2 w-full bg-amber-100 dark:bg-amber-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${data.marketabilityScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Suitable Industries */}
        <div>
          <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" />
            {t('industryMatch') || 'Industry Match'}
          </h3>
          
          <div className="space-y-4">
            {data.industries.map((ind, idx) => (
              <div key={idx} className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-100">{ind.name}</h4>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{ind.type}</span>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {ind.matchScore}% Match
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Why Relevant:</strong> {ind.relevance}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Use Case:</strong> {ind.useCase}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Acceptance Criteria:</strong> {ind.acceptanceCriteria}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
