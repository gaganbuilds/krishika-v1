'use client';

import React from 'react';
import { ShieldAlert, AlertCircle, HelpCircle, Activity, Heart, ShieldCheck, Sprout } from 'lucide-react';

interface ReportSectionProps {
  t: (key: string) => string;
  activeLang: string;
  report: {
    productName: string;
    category: string;
    ingredients: string;
    npk: string;
    toxicity: 'red' | 'yellow' | 'blue' | 'green';
    scores: {
      soilFertility: number;
      waterPollution: number;
      soilMicroorganism: number;
      chemicalResidue: number;
      carbonFootprint: number;
      sustainability: number;
      humanRisk: number;
      biodiversity: number;
    };
    aiSummary: string;
  };
}

export const ReportSection: React.FC<ReportSectionProps> = ({ t, activeLang, report }) => {
  const { productName, category, ingredients, npk, toxicity, scores, aiSummary } = report;

  // Determine toxicity styles
  const getToxicityConfig = (tox: string) => {
    switch (tox) {
      case 'red':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          label: t('toxicityRed'),
          indicator: 'bg-red-600',
          textColor: 'text-red-600'
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          label: t('toxicityYellow'),
          indicator: 'bg-amber-500',
          textColor: 'text-amber-600'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          label: t('toxicityBlue'),
          indicator: 'bg-blue-600',
          textColor: 'text-blue-600'
        };
      case 'green':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          label: t('toxicityGreen'),
          indicator: 'bg-emerald-600',
          textColor: 'text-emerald-600'
        };
    }
  };

  const toxConfig = getToxicityConfig(toxicity);

  // Setup list of scores to map over
  const scoreItems = [
    {
      key: 'soilFertility',
      label: t('scoreSoilFertility'),
      value: scores.soilFertility,
      isRisk: false, // high is good
      color: 'from-emerald-500 to-teal-600'
    },
    {
      key: 'waterPollution',
      label: t('scoreWaterPollution'),
      value: scores.waterPollution,
      isRisk: true, // high is bad
      color: 'from-red-400 to-rose-600'
    },
    {
      key: 'soilMicroorganism',
      label: t('scoreMicroorganism'),
      value: scores.soilMicroorganism,
      isRisk: false, // high is good
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      key: 'chemicalResidue',
      label: t('scoreResidue'),
      value: scores.chemicalResidue,
      isRisk: true, // high is bad
      color: 'from-orange-400 to-amber-600'
    },
    {
      key: 'carbonFootprint',
      label: t('scoreCarbon'),
      value: scores.carbonFootprint,
      isRisk: true, // high is bad
      color: 'from-stone-500 to-zinc-700',
      unit: ' kg'
    },
    {
      key: 'sustainability',
      label: t('scoreSustainability'),
      value: scores.sustainability,
      isRisk: false, // high is good
      color: 'from-teal-500 to-emerald-600',
      unit: '%'
    },
    {
      key: 'humanRisk',
      label: t('scoreHumanRisk'),
      value: scores.humanRisk,
      isRisk: true, // high is bad
      color: 'from-red-400 to-orange-600'
    },
    {
      key: 'biodiversity',
      label: t('scoreBiodiversity'),
      value: scores.biodiversity,
      isRisk: false, // high is good
      color: 'from-lime-500 to-emerald-600'
    }
  ];

  // Map translations to Kannada/Hindi for dynamic explanation headers
  const getHeaderTrans = (activeLang: string) => {
    switch (activeLang) {
      case 'kn-IN':
        return {
          title: 'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು',
          sub: 'ಲಭ್ಯವಿರುವ ರಾಸಾಯನಿಕ ಸಂಯೋಜನೆ',
          summary: 'ಎಐ ಪರಿಸರ ಸಾರಾಂಶ',
          npkLabel: 'ಎನ್‌ಪಿಕೆ ಅನುಪಾತ',
          compLabel: 'ಸಕ್ರಿಯ ಪದಾರ್ಥಗಳು',
          balancedTitle: 'ಸಮತೋಲಿತ ಬಳಕೆಯ ಸಲಹೆ'
        };
      case 'hi-IN':
        return {
          title: 'विश्लेषण परिणाम',
          sub: 'रासायनिक तत्वों का विवरण',
          summary: 'एआई पर्यावरण सारांश',
          npkLabel: 'एनपीके (NPK) अनुपात',
          compLabel: 'सक्रिय सामग्री',
          balancedTitle: 'संतुलित उपयोग सलाह'
        };
      case 'en-IN':
      default:
        return {
          title: 'Composition Analysis',
          sub: 'Extracted product details',
          summary: 'AI Environmental Summary',
          npkLabel: 'NPK Ratio',
          compLabel: 'Active Ingredients',
          balancedTitle: 'Balanced Usage Advice'
        };
    }
  };

  const headers = getHeaderTrans(activeLang);

  return (
    <div className="space-y-6">
      {/* Product Summary Header Card */}
      <div className="bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100">
            {category}
          </span>
          <h2 className="text-xl font-black text-emerald-950 tracking-tight mt-2">
            {productName}
          </h2>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-emerald-800/70 font-semibold">
            <div>
              <span className="opacity-60">{headers.npkLabel}:</span>{' '}
              <span className="text-emerald-950 font-bold bg-stone-50 px-2 py-0.5 rounded border border-stone-200/50">{npk}</span>
            </div>
            <div>
              <span className="opacity-60">{headers.compLabel}:</span>{' '}
              <span className="text-emerald-950 font-bold">{ingredients}</span>
            </div>
          </div>
        </div>

        {/* Toxicity Badge */}
        <div className={`flex items-center gap-3 border p-4.5 rounded-2xl shadow-inner max-w-sm ${toxConfig.bg}`}>
          <ShieldAlert className="h-6 w-6 shrink-0" />
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-wider">{t('toxicityLevel')}</h4>
            <p className="text-xs font-bold mt-0.5">{toxConfig.label}</p>
          </div>
        </div>
      </div>

      {/* Main Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreItems.map((item) => {
          // Color coding logic based on risk vs resource values
          let valColor = 'text-emerald-600';
          let borderStyle = 'border-emerald-800/10';
          let circleBg = 'bg-emerald-50';

          if (item.isRisk) {
            if (item.value >= 70) {
              valColor = 'text-red-600';
              circleBg = 'bg-red-50';
            } else if (item.value >= 40) {
              valColor = 'text-amber-600';
              circleBg = 'bg-amber-50';
            } else {
              valColor = 'text-emerald-600';
              circleBg = 'bg-emerald-50';
            }
          } else {
            // Non-risk (sustainability/microbe): higher is better
            if (item.value >= 70) {
              valColor = 'text-emerald-600';
              circleBg = 'bg-emerald-50';
            } else if (item.value >= 40) {
              valColor = 'text-amber-600';
              circleBg = 'bg-amber-50';
            } else {
              valColor = 'text-red-600';
              circleBg = 'bg-red-50';
            }
          }

          return (
            <div 
              key={item.key} 
              className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 ${borderStyle}`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold text-emerald-950/80 leading-snug">{item.label}</span>
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${item.isRisk && item.value >= 60 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              </div>

              <div className="my-3">
                {/* Numeric Display */}
                <div className="flex items-baseline gap-0.5">
                  <span className={`text-2xl font-black tracking-tight ${valColor}`}>{item.value}</span>
                  <span className="text-[10px] font-bold text-stone-400">{item.unit || '/100'}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-2 border border-stone-200/20">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                    style={{ width: `${Math.min(item.value, 100)}%` }}
                  />
                </div>
              </div>

              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                {item.isRisk ? 'Risk Metric' : 'Health Score'}
              </span>
            </div>
          );
        })}
      </div>

      {/* AI Explanation & Balanced Insight Card */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 scale-150 pointer-events-none group-hover:rotate-6 transition-transform duration-500">
          <Sprout className="h-48 w-48" />
        </div>

        <div className="lg:col-span-8 space-y-3 z-10">
          <h4 className="text-sm font-extrabold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
            {headers.summary}
          </h4>
          <p className="text-xs leading-relaxed opacity-95 font-medium">
            {aiSummary}
          </p>
        </div>

        <div className="lg:col-span-4 bg-emerald-900/60 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between z-10">
          <div className="flex gap-2.5 items-start">
            <Heart className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs leading-snug">
              <span className="text-amber-300 font-extrabold block uppercase tracking-wider mb-1">
                {headers.balancedTitle}
              </span>
              <span className="opacity-90 font-medium">
                {category === 'Pesticide'
                  ? 'Chemical pest control halts outbreaks instantly but degrades predators. Reduce doses gradually to maintain yield.'
                  : 'Chemical nitrogen yields rapid green leaves but damages soil carbon. Transition to a blend of compost to maintain biology.'}
              </span>
            </div>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest text-right mt-3 block">
            Raithabhandhu AI Companion
          </span>
        </div>
      </div>
    </div>
  );
};
