'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  Mic, 
  MessageSquare, 
  CalendarDays, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  CheckCircle,
  Volume2
} from 'lucide-react';

export default function LandingPage() {
  const { t, activeLang, setActiveLang, isRegistered } = useApp();
  const router = useRouter();

  const features = [
    {
      icon: Mic,
      title: 'Voice Farming Assistant',
      titleHindi: 'आवाज सहायक',
      desc: 'Speak in Kannada, Hindi, or English to log activities, check prices, or schedule tasks hands-free.',
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
    },
    {
      icon: MessageSquare,
      title: 'AI Chatbot Companion',
      titleHindi: 'कृषि एआई चैटबॉट',
      desc: 'Conversational assistant offering expert answers to crop diseases, watering cycles, and soil health.',
      color: 'bg-amber-500/10 text-amber-700 border-amber-500/20'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Mandi Rates',
      titleHindi: 'लाइव मंडी भाव',
      desc: 'Track local market trends and profitable crop indicators directly synced from official systems.',
      color: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
    },
    {
      icon: FileText,
      title: 'Subsidies & Schemes',
      titleHindi: 'सरकारी योजनाएं',
      desc: 'Apply for central crop insurance, credit cards, and direct benefits with guided checklists.',
      color: 'bg-purple-500/10 text-purple-700 border-purple-500/20'
    }
  ];

  const testimonials = [
    {
      quote: "Raithabhandhu has made tracking my paddy irrigation so simple. I just say 'Remind me to water tomorrow' and it's done!",
      author: "Shivalingappa Gowda",
      role: "Paddy Farmer",
      location: "Mandya, Karnataka"
    },
    {
      quote: "मंडी के भाव जानने के लिए मुझे अब रोज़ बाज़ार जाने की ज़रूरत नहीं पड़ती। मैं सीधे घर बैठे अपने मोबाइल पर भाव देख लेता हूँ।",
      author: "Ramesh Choudhary",
      role: "Wheat cultivator",
      location: "Indore, Madhya Pradesh"
    }
  ];

  const handleGetStarted = () => {
    if (isRegistered) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-700 p-2 rounded-xl text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-xl text-emerald-950 tracking-tight">Raithabhandhu</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Language select on landing */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-sm text-xs font-semibold text-stone-700">
            <Globe className="h-4 w-4 text-emerald-700" />
            <select
              value={activeLang}
              onChange={(e) => setActiveLang(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="kn-IN">ಕನ್ನಡ</option>
              <option value="hi-IN">हिन्दी</option>
              <option value="en-IN">English</option>
            </select>
          </div>
          
          <button
            onClick={handleGetStarted}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {t('getStarted')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold"
          >
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>AI-Powered Agriculture Startup</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-emerald-950 tracking-tight leading-[1.1] md:max-w-2xl"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-600 font-medium text-sm sm:text-base leading-relaxed max-w-xl"
          >
            {t('heroSub')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-emerald-950 font-bold border border-stone-200 px-8 py-4 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 active:scale-95 text-sm cursor-pointer"
            >
              <span>{t('howItWorks')}</span>
            </a>
          </motion.div>
        </div>

        {/* Hero Visual Graph (Abstract Farm illustration) */}
        <div className="lg:col-span-5 flex justify-center relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[420px] bg-gradient-to-tr from-emerald-700 via-emerald-800 to-amber-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
          >
            {/* Visual background rings */}
            <div className="absolute right-0 bottom-0 h-48 w-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-0 top-0 h-32 w-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
                <Volume2 className="h-5 w-5 text-amber-400 animate-bounce" />
                <span className="text-xs font-bold">Voice Active</span>
              </div>
              <span className="text-[10px] bg-emerald-950/40 text-emerald-300 font-bold tracking-widest uppercase px-2 py-0.5 rounded">Agri AI</span>
            </div>

            <div className="space-y-4 mb-8 bg-emerald-950/30 border border-white/5 p-4.5 rounded-2xl">
              <p className="text-xs text-emerald-200 font-mono">&gt; Farmer spoke in Kannada:</p>
              <p className="text-sm font-bold leading-normal italic">&quot;ರೈತಬಂಧು, ನಾಳೆ ಭತ್ತದ ಗದ್ದೆಗೆ ನೀರು ಹಾಯಿಸಲು ನೆನಪಿಸು&quot;</p>
              <div className="h-0.5 w-full bg-white/10" />
              <p className="text-xs text-amber-300 font-mono">&gt; Raithabhandhu Response:</p>
              <p className="text-xs leading-relaxed font-semibold">ನಾಳೆ ಬೆಳಿಗ್ಗೆ 6:00 ಗಂಟೆಗೆ ನಾನು ನಿಮಗಾಗಿ ಭತ್ತದ ನೀರಾವರಿ ಜ್ಞಾಪನೆಯನ್ನು ಹೊಂದಿಸಿದ್ದೇನೆ. 👍</p>
            </div>

            <div className="flex items-center gap-4 bg-white/15 p-4 rounded-2xl border border-white/10">
              <div className="h-10 w-10 bg-emerald-700 flex items-center justify-center rounded-xl font-black text-white shrink-0 shadow-md">
                RB
              </div>
              <div>
                <p className="text-xs font-bold">Smart Crop Advisor</p>
                <p className="text-[10px] opacity-75 mt-0.5">Weather suggestions dynamic alert system</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              {t('whyChooseUs')}
            </h2>
            <h3 className="text-3xl font-black tracking-tight text-emerald-950">
              {t('featuresTitle')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-stone-50 border border-stone-200/60 rounded-2xl p-6 transition-all hover:shadow-lg hover:border-emerald-600/20 group"
                >
                  <div className={`p-3 rounded-xl border w-fit ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-extrabold text-emerald-950 text-base mt-5 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-stone-600 text-xs font-semibold leading-relaxed mt-2.5">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-stone-50 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Simple steps
            </h2>
            <h3 className="text-3xl font-black tracking-tight text-emerald-950">
              {t('howItWorks')}
            </h3>
            <p className="text-xs text-stone-650 font-medium">
              {t('howItWorksSub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-center space-y-3">
              <h4 className="font-extrabold text-emerald-950 text-base">{t('step1Title')}</h4>
              <p className="text-stone-600 text-xs leading-relaxed font-semibold">{t('step1Text')}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-center space-y-3">
              <h4 className="font-extrabold text-emerald-950 text-base">{t('step2Title')}</h4>
              <p className="text-stone-600 text-xs leading-relaxed font-semibold">{t('step2Text')}</p>
            </div>
            <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-center space-y-3">
              <h4 className="font-extrabold text-emerald-950 text-base">{t('step3Title')}</h4>
              <p className="text-stone-600 text-xs leading-relaxed font-semibold">{t('step3Text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 border-t border-stone-200/50">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-2xl font-black tracking-tight text-center text-emerald-950 mb-12">
            {t('testimonialTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="bg-stone-50 border border-stone-200 p-6.5 rounded-2xl shadow-inner relative flex flex-col justify-between"
              >
                <p className="text-stone-750 text-sm font-semibold italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-200">
                  <div className="h-9 w-9 bg-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {t.author[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-emerald-950">{t.author}</h5>
                    <p className="text-[10px] text-stone-500 font-semibold">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 py-10 mt-auto border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-sm text-white">Raithabhandhu AI</span>
          </div>
          <span className="text-xs opacity-75 font-semibold">
            {t('footerText')}
          </span>
        </div>
      </footer>
    </div>
  );
}
