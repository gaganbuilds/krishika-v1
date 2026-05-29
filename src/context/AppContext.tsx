'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reminder, FarmActivity, CropPrice, Scheme, ChatMessage } from '../types';
import { mockDb } from '../database/mockDb';
import { aiService } from '../services/aiService';
import { translations, Language } from '../data/translations';

interface AppContextProps {
  reminders: Reminder[];
  activities: FarmActivity[];
  prices: CropPrice[];
  schemes: Scheme[];
  chatHistory: ChatMessage[];
  activeLang: Language;
  setActiveLang: (lang: Language) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  addReminder: (reminder: Omit<Reminder, 'id' | 'completed' | 'date' | 'time'> & { date?: string; time?: string }) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addActivity: (activity: Omit<FarmActivity, 'id' | 'date'>) => void;
  sendChatMessage: (text: string, isVoice?: boolean) => Promise<void>;
  clearChat: () => void;
  isLoadingAI: boolean;
  t: (key: keyof typeof translations['en-IN']) => string;
  isRegistered: boolean;
  farmerProfile: any;
  registerFarmer: (profile: any) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeLang, setActiveLang] = useState<Language>('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Registration States
  const [isRegistered, setIsRegistered] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);

  // Sync initial state from mockDb (which operates on localStorage safely in client)
  useEffect(() => {
    setReminders(mockDb.getReminders());
    setActivities(mockDb.getActivities());
    setPrices(mockDb.getCropPrices());
    setSchemes(mockDb.getSchemes());
    setChatHistory(mockDb.getChatHistory());
    
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('raithabhandhu_profile');
      if (storedProfile) {
        setFarmerProfile(JSON.parse(storedProfile));
        setIsRegistered(true);
      }
      
      const storedLang = localStorage.getItem('raithabhandhu_lang') as Language;
      if (storedLang) {
        setActiveLang(storedLang);
      }
    }
  }, []);

  // Translation function
  const t = (key: keyof typeof translations['en-IN']): string => {
    const langSet = translations[activeLang] || translations['en-IN'];
    return (langSet[key] as string) || (translations['en-IN'][key] as string) || String(key);
  };

  // Language setter with persistence
  const changeLang = (lang: Language) => {
    setActiveLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithabhandhu_lang', lang);
    }
  };

  // Registration handler
  const registerFarmer = (profile: any) => {
    setFarmerProfile(profile);
    setIsRegistered(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('raithabhandhu_profile', JSON.stringify(profile));
    }
  };

  // Text to Speech logic
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean text from bracketed English translations (to speak Hindi/Kannada naturally)
    const textToSpeak = text.replace(/\([^)]*\)/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = activeLang;
    
    // Find a suitable voice if possible
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(activeLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const addReminder = (reminder: Omit<Reminder, 'id' | 'completed' | 'date' | 'time'> & { date?: string; time?: string }) => {
    const defaultDate = new Date().toISOString().split('T')[0];
    const defaultTime = '08:00';
    const newRem = mockDb.addReminder({
      title: reminder.title,
      crop: reminder.crop,
      date: reminder.date || defaultDate,
      time: reminder.time || defaultTime,
      type: reminder.type
    });
    setReminders(mockDb.getReminders());
  };

  const toggleReminder = (id: string) => {
    const updated = mockDb.toggleReminder(id);
    setReminders(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = mockDb.deleteReminder(id);
    setReminders(updated);
  };

  const addActivity = (activity: Omit<FarmActivity, 'id' | 'date'>) => {
    mockDb.addActivity(activity);
    setActivities(mockDb.getActivities());
  };

  const sendChatMessage = async (text: string, isVoice: boolean = false) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = mockDb.addChatMessage('user', text, isVoice);
    setChatHistory(mockDb.getChatHistory());
    setIsLoadingAI(true);

    try {
      // Process with mock AI
      const result = await aiService.processFarmingQuery(text);
      
      // Add assistant response
      const assistantMsg = mockDb.addChatMessage('assistant', result.reply);
      setChatHistory(mockDb.getChatHistory());
      
      // Update states in case action was taken
      if (result.actionTaken === 'reminder') {
        setReminders(mockDb.getReminders());
      } else if (result.actionTaken === 'activity') {
        setActivities(mockDb.getActivities());
      }

      // Automatically speak the response
      speakText(result.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const clearChat = () => {
    mockDb.clearChatHistory();
    setChatHistory(mockDb.getChatHistory());
    stopSpeaking();
  };

  return (
    <AppContext.Provider
      value={{
        reminders,
        activities,
        prices,
        schemes,
        chatHistory,
        activeLang,
        setActiveLang: changeLang,
        speakText,
        stopSpeaking,
        isSpeaking,
        addReminder,
        toggleReminder,
        deleteReminder,
        addActivity,
        sendChatMessage,
        clearChat,
        isLoadingAI,
        t,
        isRegistered,
        farmerProfile,
        registerFarmer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
