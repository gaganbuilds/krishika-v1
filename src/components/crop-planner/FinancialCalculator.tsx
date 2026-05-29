'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, Sprout, Droplets } from 'lucide-react';
import { CropData } from '../../data/cropPlannerData';

interface FinancialCalculatorProps {
  crop: CropData;
}

export default function FinancialCalculator({ crop }: FinancialCalculatorProps) {
  const [area, setArea] = useState<number>(1);
  const [method, setMethod] = useState<'Conventional' | 'Organic'>('Conventional');
  const [irrigation, setIrrigation] = useState<'Full' | 'Partial' | 'Rainfed'>('Full');
  const [showResult, setShowResult] = useState(false);

  // Default values from crop
  const { financials } = crop;
  
  // Modifiers based on user input
  const methodModifier = method === 'Organic' ? 1.15 : 1.0; // Organic costs a bit more in labor/inputs initially
  const irrigationYieldModifier = irrigation === 'Full' ? 1.0 : irrigation === 'Partial' ? 0.75 : 0.5;

  // Calculate results
  const totalInvestment = Math.round(financials.baseInvestmentPerAcre * area * methodModifier);
  const fertilizerCost = Math.round(totalInvestment * financials.fertilizerCostRatio);
  const laborCost = Math.round(totalInvestment * financials.laborCostRatio);
  
  const estimatedYield = Math.round(financials.expectedYieldPerAcre * area * irrigationYieldModifier);
  const estimatedRevenue = estimatedYield * financials.pricePerUnit;
  const expectedProfit = estimatedRevenue - totalInvestment;
  
  const roi = Math.round((expectedProfit / totalInvestment) * 100);

  const getAIInsight = () => {
    let insight = `For ${area} acre(s) of ${method.toLowerCase()} ${crop.name} cultivation with ${irrigation.toLowerCase()} irrigation, `;
    
    if (roi > 100) {
      insight += `you are looking at highly profitable returns. Your estimated profit margin is ${roi}%, which is excellent. `;
    } else if (roi > 50) {
      insight += `expect moderate to good profitability. `;
    } else if (roi > 0) {
      insight += `returns are positive but marginal. Consider optimizing your input costs or improving irrigation to boost yield. `;
    } else {
      insight += `the current setup poses a high financial risk with potential losses. Re-evaluate your method or irrigation plan. `;
    }

    if (method === 'Organic') {
      insight += `Going organic increases your initial labor and input costs slightly, but you can potentially sell at a premium in specialized markets to offset this.`;
    }

    if (irrigation === 'Rainfed' && crop.waterRequirement.includes('High')) {
      insight += ` Warning: ${crop.name} has high water requirements. Relying purely on rainfed irrigation significantly drops your expected yield.`;
    }

    return insight;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-800/10 p-6 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-black text-emerald-950 text-lg">Smart Financial Calculator</h3>
          <p className="text-xs text-stone-500 font-semibold">AI-driven investment & profit estimation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Land Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-900 block">Land Area (Acres)</label>
          <input 
            type="number" 
            min="0.5" 
            step="0.5"
            value={area}
            onChange={(e) => setArea(Number(e.target.value) || 0)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Farming Method */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5" /> Farming Method
          </label>
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="Conventional">Conventional</option>
            <option value="Organic">Organic</option>
          </select>
        </div>

        {/* Irrigation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-emerald-900 block flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5" /> Irrigation Availability
          </label>
          <select 
            value={irrigation}
            onChange={(e) => setIrrigation(e.target.value as any)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="Full">Full (Borewell/Canal)</option>
            <option value="Partial">Partial</option>
            <option value="Rainfed">Rainfed Only</option>
          </select>
        </div>
      </div>

      <button 
        onClick={() => setShowResult(true)}
        className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 mb-6"
      >
        <Sparkles className="w-5 h-5 text-emerald-300" />
        Calculate Estimates
      </button>

      {showResult && (
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <h4 className="font-bold text-emerald-950 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Projected Financials
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-3 rounded-lg border border-emerald-100/50">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Est. Investment</p>
              <p className="text-lg font-black text-red-600">₹{totalInvestment.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-100/50">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Est. Yield</p>
              <p className="text-lg font-black text-emerald-700">{estimatedYield} Qtl</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-100/50">
              <p className="text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Est. Revenue</p>
              <p className="text-lg font-black text-emerald-600">₹{estimatedRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-600 p-3 rounded-lg shadow-sm">
              <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-200 mb-1">Expected Profit</p>
              <p className="text-lg font-black text-white flex items-center gap-1">
                <DollarSign className="w-4 h-4 opacity-70" />
                ₹{expectedProfit.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white/60 p-4 rounded-xl text-sm font-medium text-emerald-900 border border-emerald-200/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{getAIInsight()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
