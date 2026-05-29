'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockDb } from '../../database/mockDb';
import { greenshiftTranslations } from '../../data/greenshiftTranslations';
import { SettingsSection } from '../../components/greenshift/SettingsSection';
import { UploadSection } from '../../components/greenshift/UploadSection';
import { ReportSection } from '../../components/greenshift/ReportSection';
import { TransitionSection } from '../../components/greenshift/TransitionSection';
import { AlternativesSection } from '../../components/greenshift/AlternativesSection';
import { MapSection } from '../../components/greenshift/MapSection';
import { CarbonSection } from '../../components/greenshift/CarbonSection';

import { 
  Sprout, 
  Plus, 
  History, 
  Activity, 
  Map, 
  Award, 
  Sparkles, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function GreenShiftPage() {
  const { activeLang, farmerProfile } = useApp();
  const [activeReport, setActiveReport] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'report' | 'alternatives' | 'transition' | 'map' | 'carbon'>('report');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  // Translation helper
  const t = (key: string): string => {
    const langDict = greenshiftTranslations[activeLang] || greenshiftTranslations['en-IN'];
    return (langDict as any)[key] || (greenshiftTranslations['en-IN'] as any)[key] || key;
  };

  // Load history and select active report on mount
  useEffect(() => {
    const hist = mockDb.getGreenShiftHistory();
    setHistory(hist);
    if (hist.length > 0) {
      setActiveReport(hist[0]);
    }
  }, []);

  // Update history state when api keys or calculations change
  const refreshHistory = () => {
    const hist = mockDb.getGreenShiftHistory();
    setHistory(hist);
    // Refresh active report if it matches one in history
    if (activeReport) {
      const updatedReport = hist.find(h => h.id === activeReport.id);
      if (updatedReport) {
        setActiveReport(updatedReport);
      }
    }
  };

  const handleAnalysisComplete = (result: any) => {
    // Add to DB
    const updatedHistory = mockDb.addGreenShiftAnalysis(result);
    setHistory(updatedHistory);
    // Set as active report
    setActiveReport(updatedHistory[0]);
    setActiveTab('report');
  };

  const handleSelectHistory = (reportItem: any) => {
    setActiveReport(reportItem);
    setActiveTab('report');
    setShowHistorySidebar(false);
  };

  const handleStartNewScan = () => {
    setActiveReport(null);
  };

  // Calculations for dynamic stats
  const stats = mockDb.getGreenShiftScore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2.5">
            <Sprout className="h-7 w-7 text-emerald-600 animate-pulse" />
            {t('title')}
          </h1>
          <p className="text-xs text-emerald-800/60 font-semibold mt-1 max-w-xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {history.length > 0 && (
            <button
              onClick={() => setShowHistorySidebar(!showHistorySidebar)}
              className="flex-1 md:flex-none px-4 py-2.5 border border-emerald-800/10 hover:border-emerald-600 bg-white text-emerald-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <History className="h-4 w-4 text-emerald-700" />
              <span>History ({history.length})</span>
            </button>
          )}

          {activeReport && (
            <button
              onClick={handleStartNewScan}
              className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Scan Product</span>
            </button>
          )}
        </div>
      </div>

      {/* API Key configuration banner */}
      <SettingsSection t={t} onKeysChanged={refreshHistory} />

      {/* Main Panel Content */}
      {!activeReport ? (
        // Upload & Scan screen
        <div className="space-y-6">
          <UploadSection 
            t={t}
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          
          {/* Show history underneath when no report is selected */}
          {history.length > 0 && (
            <div className="bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm">
              <h3 className="font-extrabold text-emerald-950 text-base mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-emerald-600" />
                Previous Scans
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectHistory(item)}
                    className="p-4 border border-emerald-800/5 bg-stone-50/20 hover:bg-emerald-50/20 hover:border-emerald-600/30 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between h-32"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-black text-xs text-emerald-950 truncate max-w-[150px]">
                          {item.productName}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          item.toxicity === 'red' ? 'bg-red-50 text-red-700 border border-red-100' :
                          item.toxicity === 'yellow' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          item.toxicity === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {item.toxicity}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800/60 font-semibold block mt-1">
                        {item.category} • {item.npk}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-stone-400 font-bold border-t border-emerald-850/5 pt-2 mt-2 w-full">
                      <span>{item.timestamp}</span>
                      <span className="text-emerald-600 flex items-center gap-0.5">
                        View Report <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Active Analysis Report Panel
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Workspace (Report + Sections Tabs) */}
          <div className="lg:col-span-12 space-y-6">
            
            {/* Horizontal Navigation Tabs */}
            <div className="bg-white border border-emerald-800/10 p-2 rounded-2xl shadow-sm flex flex-wrap gap-1.5 overflow-x-auto">
              
              {/* Report Tab */}
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <Activity className="h-4.5 w-4.5" />
                <span>Report Card</span>
              </button>

              {/* Alternatives Tab */}
              <button
                onClick={() => setActiveTab('alternatives')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'alternatives'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <Sparkles className="h-4.5 w-4.5" />
                <span>Organic Alternatives</span>
              </button>

              {/* Transition Tab */}
              <button
                onClick={() => setActiveTab('transition')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'transition'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Transition Roadmap</span>
              </button>

              {/* Map Tab */}
              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <Map className="h-4.5 w-4.5" />
                <span>Nearby Providers</span>
              </button>

              {/* Carbon Tab */}
              <button
                onClick={() => setActiveTab('carbon')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  activeTab === 'carbon'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-900/60 hover:text-emerald-950 hover:bg-emerald-50/50'
                }`}
              >
                <Award className="h-4.5 w-4.5" />
                <span>Carbon Ledger</span>
              </button>

            </div>

            {/* Render Active Tab Screen */}
            <div className="transition-all duration-300">
              {activeTab === 'report' && (
                <ReportSection 
                  t={t}
                  activeLang={activeLang}
                  report={activeReport}
                />
              )}

              {activeTab === 'alternatives' && (
                <AlternativesSection 
                  t={t}
                  activeLang={activeLang}
                  report={activeReport}
                />
              )}

              {activeTab === 'transition' && (
                <TransitionSection 
                  t={t}
                  activeLang={activeLang}
                  report={activeReport}
                />
              )}

              {activeTab === 'map' && (
                <MapSection 
                  t={t}
                  activeLang={activeLang}
                  farmerProfile={farmerProfile}
                />
              )}

              {activeTab === 'carbon' && (
                <CarbonSection 
                  t={t}
                  activeLang={activeLang}
                  stats={stats}
                  historyLength={history.length}
                />
              )}
            </div>

          </div>
        </div>
      )}

      {/* History Slide-out Drawer / Sidebar */}
      {showHistorySidebar && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-hidden">
            <div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <h3 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
                  <History className="h-5 w-5 text-emerald-600" />
                  Scan History
                </h3>
                <button 
                  onClick={() => setShowHistorySidebar(false)}
                  className="p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mt-4 overflow-y-auto max-h-[80vh] pr-1">
                {history.map((item) => {
                  const isCurrent = activeReport?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className={`w-full text-left p-3.5 rounded-xl border flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-emerald-50/50 border-emerald-600 shadow-inner' 
                          : 'bg-white border-stone-200 hover:bg-stone-50/55'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-xs font-black text-emerald-950 truncate max-w-[220px]">
                          {item.productName}
                        </strong>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          item.toxicity === 'red' ? 'bg-red-50 text-red-700 border border-red-100' :
                          item.toxicity === 'yellow' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          item.toxicity === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {item.toxicity}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800/60 font-semibold mt-0.5">
                        {item.category} • {item.npk}
                      </span>
                      <span className="text-[9px] text-stone-400 font-bold mt-2 pt-2 border-t border-stone-100 w-full block">
                        {item.timestamp}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button 
              onClick={() => {
                setShowHistorySidebar(false);
                handleStartNewScan();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Analyze New Product
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
