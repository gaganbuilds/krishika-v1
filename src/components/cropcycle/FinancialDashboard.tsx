'use client';

import React from 'react';
import { SupportedCrop, cropcycleData } from '@/data/cropcycleMappings';
import { Receipt, Truck, PlusCircle, MinusCircle, Wallet, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface FinancialDashboardProps {
  selectedCrop: SupportedCrop;
  quantity: number;
  distance: number;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ selectedCrop, quantity, distance }) => {
  const { t } = useApp();
  const data = cropcycleData[selectedCrop];
  
  // Use distance to calculate transport cost (assuming ₹15/km per trip, assuming 1 trip for this quantity)
  // Or simpler: base cost per ton + distance * ₹5 per ton
  const collectionCost = data.collectionCostPerTon * quantity;
  const loadingCost = data.loadingCostPerTon * quantity;
  
  // Dynamic transport rate based on distance
  const transportRatePerTon = Math.max(100, Math.floor(distance * 8)); // ₹8 per km per ton
  const transportCost = transportRatePerTon * quantity;
  
  const totalExpenses = collectionCost + loadingCost + transportCost;
  
  // Get highest paying industry
  const expectedPricePerTon = Math.max(...data.industries.map(i => i.expectedPricePerTon));
  const grossRevenue = expectedPricePerTon * quantity;
  
  const netIncome = grossRevenue - totalExpenses;

  return (
    <div className="bg-white dark:bg-emerald-950/40 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-emerald-500" />
        {t('step4Title') || 'Step 4: Financial Dashboard'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Expenses */}
        <div className="bg-slate-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-slate-100 dark:border-emerald-800/30">
          <h3 className="font-bold text-slate-800 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <MinusCircle className="w-4 h-4 text-red-500" />
            {t('processingExpenses') || 'Processing Expenses'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Collection (₹{data.collectionCostPerTon}/t)</span>
              <span className="font-semibold text-slate-800 dark:text-emerald-100">₹{collectionCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Loading (₹{data.loadingCostPerTon}/t)</span>
              <span className="font-semibold text-slate-800 dark:text-emerald-100">₹{loadingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Transport ({distance.toFixed(1)} km)</span>
              <span className="font-semibold text-slate-800 dark:text-emerald-100">₹{transportCost.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-emerald-800/30 flex justify-between">
              <span className="font-bold text-slate-800 dark:text-emerald-100">Total Expenses</span>
              <span className="font-bold text-red-600 dark:text-red-400">₹{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            {t('expectedRevenue') || 'Expected Revenue'}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 dark:text-emerald-300">Base Price Rate</span>
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">₹{expectedPricePerTon.toLocaleString()}/t</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 dark:text-emerald-300">Market Demand</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{data.demandTrend}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 dark:text-emerald-300">Estimated Quantity</span>
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">{quantity} Tons</span>
            </div>
            <div className="pt-3 border-t border-emerald-200 dark:border-emerald-800/30 flex justify-between">
              <span className="font-bold text-emerald-900 dark:text-emerald-100">Gross Revenue</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{grossRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 rounded-xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20">
            <Wallet className="w-32 h-32" />
          </div>
          <h3 className="font-bold text-emerald-50 mb-1 z-10 relative">
            {t('estNetIncome') || 'Estimated Net Income'}
          </h3>
          <p className="text-emerald-100 text-sm mb-6 z-10 relative">For {quantity} Tons of {data.residueType}</p>
          
          <div className="text-4xl font-bold mb-4 z-10 relative">
            ₹{netIncome.toLocaleString()}
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm z-10 relative flex items-center gap-2">
             <TrendingUp className="w-4 h-4 text-emerald-200" />
             <span className="text-sm font-medium text-emerald-100">Converting waste to wealth locally</span>
          </div>
        </div>

      </div>
    </div>
  );
};
