'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';

interface SettingsSectionProps {
  t: (key: string) => string;
  onKeysChanged: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ t, onKeysChanged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [gmapsKey, setGmapsKey] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showGmaps, setShowGmaps] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOpenaiKey(localStorage.getItem('raithabhandhu_openai_key') || '');
      setGmapsKey(localStorage.getItem('raithabhandhu_gmaps_key') || '');
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithabhandhu_openai_key', openaiKey.trim());
      localStorage.setItem('raithabhandhu_gmaps_key', gmapsKey.trim());
      setSaved(true);
      onKeysChanged();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="bg-white border border-emerald-800/10 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-emerald-950 hover:bg-emerald-50/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <Key className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold">{t('apiSetup')}</h4>
            <p className="text-[11px] text-emerald-800/60 font-semibold mt-0.5">{t('apiSetupDesc')}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
          {isOpen ? 'Close' : 'Configure'}
        </span>
      </button>

      {/* Settings Body */}
      {isOpen && (
        <div className="p-5 border-t border-emerald-800/5 bg-emerald-50/10 space-y-4">
          {/* OpenAI Key Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('openaiKey')}</label>
            <div className="relative flex items-center">
              <input
                type={showOpenai ? 'text' : 'password'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-or..."
                className="w-full border border-emerald-800/15 bg-white rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
              <button 
                type="button" 
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-3 text-emerald-800/50 hover:text-emerald-800 cursor-pointer"
              >
                {showOpenai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Google Maps Key Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('gmapsKey')}</label>
            <div className="relative flex items-center">
              <input
                type={showGmaps ? 'text' : 'password'}
                value={gmapsKey}
                onChange={(e) => setGmapsKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full border border-emerald-800/15 bg-white rounded-xl pl-3.5 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
              />
              <button 
                type="button" 
                onClick={() => setShowGmaps(!showGmaps)}
                className="absolute right-3 text-emerald-800/50 hover:text-emerald-800 cursor-pointer"
              >
                {showGmaps ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
            <span className="text-[10px] text-emerald-800/50 leading-relaxed font-semibold max-w-md">
              {t('keysNotice')}
            </span>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{t('saveKeys')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
