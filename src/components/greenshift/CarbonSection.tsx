'use client';

import React from 'react';
import { Award, Leaf, TrendingUp, Landmark, ShieldCheck, DollarSign } from 'lucide-react';

interface CarbonSectionProps {
  t: (key: string) => string;
  activeLang: string;
  stats: {
    sustainabilityScore: number;
    carbonOffset: number;
    greenCredits: number;
  };
  historyLength: number;
}

export const CarbonSection: React.FC<CarbonSectionProps> = ({ 
  t, 
  activeLang, 
  stats, 
  historyLength 
}) => {
  const { carbonOffset, greenCredits } = stats;

  // Let's compute estimated yield value (e.g. ₹2,000 per credit)
  const rupeeRate = 2000;
  const estimatedValue = Math.round(greenCredits * rupeeRate);

  // Check which achievements are unlocked
  const achievements = [
    {
      id: 'pioneer',
      name: t('badgeOrganicPioneer'),
      desc: t('badgeOrganicPioneerDesc'),
      unlocked: historyLength > 0,
      icon: <Leaf className="h-6 w-6" />,
      color: 'bg-emerald-500 text-white border-emerald-600',
      lockedColor: 'bg-stone-100 text-stone-400 border-stone-300'
    },
    {
      id: 'guardian',
      name: t('badgeSoilGuardian'),
      desc: t('badgeSoilGuardianDesc'),
      unlocked: historyLength >= 2,
      icon: <ShieldCheck className="h-6 w-6" />,
      color: 'bg-amber-500 text-white border-amber-600',
      lockedColor: 'bg-stone-100 text-stone-400 border-stone-300'
    },
    {
      id: 'saver',
      name: t('badgeCarbonSaver'),
      desc: t('badgeCarbonSaverDesc'),
      unlocked: carbonOffset >= 100,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-teal-500 text-white border-teal-600',
      lockedColor: 'bg-stone-100 text-stone-400 border-stone-300'
    }
  ];

  // Specific environment offsets
  const soilRunoffPrevented = Math.round(carbonOffset * 0.45); // kg of active chemicals
  const waterSaved = Math.round(carbonOffset * 15.2); // liters of contaminated runoff prevented

  return (
    <div className="space-y-6">
      
      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carbon Offset Logged */}
        <div className="bg-white border border-emerald-800/10 p-5 rounded-3xl shadow-sm flex items-center gap-4.5">
          <div className="p-4.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
            <Leaf className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">
              {t('carbonOffset')}
            </h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-950 tracking-tight">{carbonOffset}</span>
              <span className="text-xs font-bold text-stone-500">kg CO₂e</span>
            </div>
            <p className="text-[10px] text-emerald-800/60 font-semibold mt-1">
              {t('carbonOffsetDesc')}
            </p>
          </div>
        </div>

        {/* Green Credits Earned */}
        <div className="bg-white border border-emerald-800/10 p-5 rounded-3xl shadow-sm flex items-center gap-4.5">
          <div className="p-4.5 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100 shrink-0">
            <Landmark className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">
              {t('creditsEarned')}
            </h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-teal-950 tracking-tight">{greenCredits}</span>
              <span className="text-xs font-bold text-stone-500">credits</span>
            </div>
            <p className="text-[10px] text-emerald-800/60 font-semibold mt-1">
              {t('carbonCreditsPotential')}
            </p>
          </div>
        </div>

        {/* Estimated Green Value */}
        <div className="bg-white border border-emerald-800/10 p-5 rounded-3xl shadow-sm flex items-center gap-4.5">
          <div className="p-4.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shrink-0">
            <DollarSign className="h-7 w-7" />
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">
              {t('monetaryValue')}
            </h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-950 tracking-tight">₹{estimatedValue.toLocaleString()}</span>
              <span className="text-xs font-bold text-stone-500">INR</span>
            </div>
            <p className="text-[10px] text-emerald-800/60 font-semibold mt-1">
              Estimated direct payout value from organic crop yield premium & credits.
            </p>
          </div>
        </div>

      </div>

      {/* Carbon Ledger Details & Ecosystem Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Environmental impact tracker */}
        <div className="lg:col-span-6 bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm space-y-4">
          <h4 className="font-extrabold text-emerald-950 text-sm border-b border-emerald-800/5 pb-3">
            Ecosystem Protection Ledger
          </h4>
          
          <div className="space-y-4">
            {/* Runoff */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1">
                <span>Chemical Runoff Prevented</span>
                <span className="font-extrabold text-emerald-700">{soilRunoffPrevented} kg</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(soilRunoffPrevented * 2, 100)}%` }} />
              </div>
            </div>

            {/* Ground water saved */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1">
                <span>Contaminated Groundwater Saved</span>
                <span className="font-extrabold text-blue-700">{waterSaved} Liters</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(waterSaved / 20, 100)}%` }} />
              </div>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-800/5 rounded-xl p-3.5 text-[10px] leading-relaxed text-emerald-900 font-semibold">
              🌱 <span className="font-bold">Did you know?</span> Each 10kg reduction of chemical Urea avoids 18.2kg of Carbon Dioxide Equivalent (CO₂e) emissions from fertilizer production and nitrous oxide soil volatilization.
            </div>
          </div>
        </div>

        {/* Milestones and Badges */}
        <div className="lg:col-span-6 bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm space-y-4">
          <h4 className="font-extrabold text-emerald-950 text-sm border-b border-emerald-800/5 pb-3 flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-emerald-600" />
            {t('achievements')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((ach) => {
              const Icon = ach.icon;
              return (
                <div 
                  key={ach.id}
                  className={`border rounded-2xl p-4 text-center flex flex-col items-center gap-2.5 transition-all relative overflow-hidden ${
                    ach.unlocked 
                      ? 'border-emerald-600 bg-emerald-50/10 shadow-sm' 
                      : 'border-stone-200 bg-stone-50/40 opacity-50'
                  }`}
                >
                  {/* Lock Indicator */}
                  {!ach.unlocked && (
                    <div className="absolute top-1.5 right-1.5 bg-stone-200 text-stone-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                      LOCKED
                    </div>
                  )}

                  <div className={`p-3 rounded-full border-2 ${ach.unlocked ? ach.color : ach.lockedColor}`}>
                    {ach.icon}
                  </div>
                  
                  <div>
                    <h5 className="text-[10px] font-black text-emerald-950 block truncate">
                      {ach.name}
                    </h5>
                    <p className="text-[9px] text-stone-500 font-semibold mt-1 leading-snug">
                      {ach.desc}
                    </p>
                  </div>

                  {ach.unlocked && (
                    <span className="text-[9px] font-black text-emerald-700 tracking-wider uppercase mt-1">
                      ✓ Earned
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
