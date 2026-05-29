'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { translations } from '../data/translations';
import { 
  LayoutDashboard, 
  Mic, 
  MessageSquare, 
  CalendarDays, 
  BellRing, 
  TrendingUp, 
  FileText, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Languages, 
  Sprout,
  ShieldAlert,
  Users,
  BookOpen,
  Tractor
} from 'lucide-react';

interface NavItem {
  translationKey: keyof typeof translations['en-IN'];
  nameHindi: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { translationKey: 'dashboard', nameHindi: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', path: '/dashboard', icon: LayoutDashboard },
  { translationKey: 'voiceAssistant', nameHindi: 'ಧ್ವನಿ ಸಹಾಯಕ', path: '/voice', icon: Mic },
  { translationKey: 'chatbot', nameHindi: 'ಎಐ ಚಾಟ್‌ಬಾಟ್', path: '/chatbot', icon: MessageSquare },
  { translationKey: 'timeline', nameHindi: 'ಕೃಷಿ ವೇಳಾಪಟ್ಟಿ', path: '/timeline', icon: CalendarDays },
  { translationKey: 'reminders', nameHindi: 'ಜ್ಞಾಪನೆಗಳು', path: '/reminders', icon: BellRing },
  { translationKey: 'prices', nameHindi: 'ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ', path: '/prices', icon: TrendingUp },
  { translationKey: 'schemes', nameHindi: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', path: '/schemes', icon: FileText },
  { translationKey: 'greenshift', nameHindi: 'ಗ್ರೀನ್‌ಶಿಫ್ಟ್', path: '/greenshift', icon: Sprout },
  { translationKey: 'diseaseManager', nameHindi: 'रोग प्रबंधक', path: '/disease-manager', icon: ShieldAlert },
  { translationKey: 'cropPlanner', nameHindi: 'फसल योजनाकार', path: '/crop-planner', icon: Tractor },
  { translationKey: 'expertsBlogs', nameHindi: 'विशेषज्ञ ब्लॉग', path: '/experts-blogs', icon: BookOpen },
  { translationKey: 'raithaGnyana', nameHindi: 'रैथज्ञान फ़ीड', path: '/raitha-gnyana', icon: Users },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeLang, setActiveLang, isSpeaking, stopSpeaking, t, farmerProfile } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveLang(e.target.value as any);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'hi-IN': return 'हिन्दी';
      case 'kn-IN': return 'ಕನ್ನಡ';
      case 'en-IN': return 'English';
      default: return 'English';
    }
  };

  const farmerName = farmerProfile?.name || 'Karan Singh';
  const farmerVillage = farmerProfile?.village 
    ? `${farmerProfile.village}, ${farmerProfile.district}` 
    : 'Khanna, Punjab';

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between bg-emerald-900 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-emerald-400" />
          <span className="font-bold text-lg tracking-wider">RAITHABHANDHU</span>
        </div>
        <div className="flex items-center gap-3">
          {isSpeaking && (
            <button 
              onClick={stopSpeaking} 
              className="p-1.5 bg-red-600 rounded-full animate-pulse text-white"
              title="Stop speaking"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-emerald-950 text-emerald-100 flex flex-col border-r border-emerald-800/30 z-40 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        {/* Brand Logo */}
        <div className="hidden md:flex items-center gap-2.5 px-6 py-6 border-b border-emerald-800/40">
          <div className="bg-emerald-800 p-2 rounded-xl">
            <Sprout className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">Raithabhandhu</h1>
            <span className="text-xs text-emerald-400/80 font-medium tracking-widest uppercase">{t('tagline')}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group font-medium
                  ${isActive 
                    ? 'bg-emerald-700/80 text-white shadow-lg shadow-emerald-900/30 font-semibold' 
                    : 'hover:bg-emerald-900/40 text-emerald-300 hover:text-white'
                  }
                `}
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'}`} />
                <div className="flex flex-col">
                  <span className="text-sm">{t(item.translationKey)}</span>
                  <span className="text-[9px] opacity-60 font-normal -mt-0.5">{item.nameHindi}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Language & Voice Settings */}
        <div className="p-4 border-t border-emerald-800/40 bg-emerald-950/80 space-y-3.5">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-emerald-900/50 rounded-xl px-3 py-2 border border-emerald-800/30">
            <Languages className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <select
              value={activeLang}
              onChange={handleLangChange}
              className="bg-transparent text-xs text-emerald-100 font-medium focus:outline-none w-full cursor-pointer select-none"
            >
              <option value="kn-IN" className="bg-emerald-950 text-emerald-100">ಕನ್ನಡ (Kannada)</option>
              <option value="hi-IN" className="bg-emerald-950 text-emerald-100">हिन्दी (Hindi)</option>
              <option value="en-IN" className="bg-emerald-950 text-emerald-100">English</option>
            </select>
          </div>

          {/* Active Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-between bg-red-950/60 border border-red-800/30 rounded-xl px-3 py-2 text-xs text-red-200">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-red-400 animate-bounce" />
                <span>AI Speaking...</span>
              </div>
              <button 
                onClick={stopSpeaking} 
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1 rounded-lg transition-colors"
                title="Stop speech feedback"
              >
                <VolumeX className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* User profile footer */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="h-9 w-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-emerald-200 border border-emerald-700/50 shadow-inner">
              {farmerName[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">{farmerName}</span>
              <span className="text-[10px] text-emerald-400/80 truncate">{farmerVillage}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
