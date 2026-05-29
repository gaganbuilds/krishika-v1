import { CropPrice, Scheme, Reminder, FarmActivity, ChatMessage } from '../types';
import { mockCropPrices, mockSchemes, mockReminders, mockFarmActivities } from '../data/mockData';

const IS_SERVER = typeof window === 'undefined';

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (IS_SERVER) return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage key', key, error);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage key', key, error);
  }
};

export const mockDb = {
  getReminders: (): Reminder[] => {
    return getLocalStorageItem<Reminder[]>('farmer_os_reminders', mockReminders);
  },
  
  saveReminders: (reminders: Reminder[]): void => {
    setLocalStorageItem('farmer_os_reminders', reminders);
  },

  addReminder: (reminder: Omit<Reminder, 'id' | 'completed'>): Reminder => {
    const reminders = mockDb.getReminders();
    const newReminder: Reminder = {
      ...reminder,
      id: Math.random().toString(36).substring(2, 9),
      completed: false
    };
    mockDb.saveReminders([newReminder, ...reminders]);
    return newReminder;
  },

  toggleReminder: (id: string): Reminder[] => {
    const reminders = mockDb.getReminders();
    const updated = reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r);
    mockDb.saveReminders(updated);
    return updated;
  },

  deleteReminder: (id: string): Reminder[] => {
    const reminders = mockDb.getReminders();
    const updated = reminders.filter(r => r.id !== id);
    mockDb.saveReminders(updated);
    return updated;
  },

  getActivities: (): FarmActivity[] => {
    return getLocalStorageItem<FarmActivity[]>('farmer_os_activities', mockFarmActivities);
  },

  saveActivities: (activities: FarmActivity[]): void => {
    setLocalStorageItem('farmer_os_activities', activities);
  },

  addActivity: (activity: Omit<FarmActivity, 'id' | 'date'>): FarmActivity => {
    const activities = mockDb.getActivities();
    const newActivity: FarmActivity = {
      ...activity,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    mockDb.saveActivities([newActivity, ...activities]);
    return newActivity;
  },

  getCropPrices: (): CropPrice[] => {
    return getLocalStorageItem<CropPrice[]>('farmer_os_crop_prices', mockCropPrices);
  },

  getSchemes: (): Scheme[] => {
    return mockSchemes; // Schemes are static for this mock
  },

  getChatHistory: (): ChatMessage[] => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: 'नमस्ते! मैं आपका कृषि साथी हूँ। आज आपके खेत में क्या काम चल रहा है? (Hello! I am your farming assistant. What work is happening in your farm today?)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    return getLocalStorageItem<ChatMessage[]>('farmer_os_chat_history', welcomeMessages);
  },

  saveChatHistory: (chatHistory: ChatMessage[]): void => {
    setLocalStorageItem('farmer_os_chat_history', chatHistory);
  },

  addChatMessage: (sender: 'user' | 'assistant', text: string, isVoice: boolean = false): ChatMessage => {
    const history = mockDb.getChatHistory();
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      text,
      isVoiceInput: isVoice,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    mockDb.saveChatHistory([...history, newMessage]);
    return newMessage;
  },

  getGreenShiftHistory: (): any[] => {
    const defaultHistory = [
      {
        id: 'gs-init-1',
        productName: 'Urea (46-0-0)',
        category: 'Fertilizer',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
        ingredients: 'Nitrogen (46%), Biuret (1.5% max)',
        npk: '46-0-0',
        toxicity: 'blue',
        scores: {
          soilFertility: 40, // score out of 100 (where high is better or color-coded appropriately)
          waterPollution: 70, // hazard risk
          soilMicroorganism: 30, // health score
          chemicalResidue: 65, // risk
          carbonFootprint: 82, // emissions (kg)
          sustainability: 35, // sustainability %
          humanRisk: 45, // risk
          biodiversity: 40 // score
        },
        alternatives: {
          biofertilizer: 'Azotobacter & Phosphate Solubilizing Bacteria (PSB) culture.',
          compost: 'Vermicompost or Farm Yard Manure (FYM) at 2.5 tons/acre.',
          pest: 'Neem Cake powder mixed in soil bed.'
        },
        transitionPlan: {
          season1: '80% Chemical Nitrogen + 20% Bio-fertilizers & Vermicompost top-dress.',
          season2: '60% Chemical Nitrogen + 40% Bio-fertilizers & Vermicompost.',
          season3: '40% Chemical Nitrogen + 60% Bio-fertilizers & Vermicompost.'
        },
        aiSummary: 'Urea provides rapid vegetative growth due to high Nitrogen, but continuous over-application degrades soil structure, suppresses nitrogen-fixing bacteria, and causes nitrate leaching into groundwater. A phased reduction coupled with microbial cultures will restore soil biology.'
      }
    ];
    return getLocalStorageItem<any[]>('raithabhandhu_greenshift_history', defaultHistory);
  },

  addGreenShiftAnalysis: (analysis: any): any[] => {
    const history = mockDb.getGreenShiftHistory();
    const newAnalysis = {
      ...analysis,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString()
    };
    const updated = [newAnalysis, ...history];
    setLocalStorageItem('raithabhandhu_greenshift_history', updated);
    return updated;
  },

  getGreenShiftScore: (): { sustainabilityScore: number; carbonOffset: number; greenCredits: number } => {
    const history = mockDb.getGreenShiftHistory();
    if (history.length === 0) {
      return { sustainabilityScore: 35, carbonOffset: 0, greenCredits: 0 };
    }
    
    // Compute dynamic dashboard metrics based on scanned history
    let scoreTotal = 45;
    let co2Offset = 15;
    let credits = 0.5;

    history.forEach(item => {
      // Analyze toxicity level and give dynamic contribution
      if (item.toxicity === 'green' || item.productName?.toLowerCase().includes('neem') || item.productName?.toLowerCase().includes('bio')) {
        scoreTotal += 12;
        co2Offset += 45;
        credits += 2.0;
      } else if (item.toxicity === 'blue') {
        scoreTotal += 6;
        co2Offset += 20;
        credits += 0.8;
      } else if (item.toxicity === 'yellow') {
        scoreTotal += 2;
        co2Offset += 10;
        credits += 0.3;
      } else {
        // Red toxicity
        scoreTotal -= 5;
        co2Offset += 5;
        credits += 0.1;
      }
    });

    return {
      sustainabilityScore: Math.min(Math.max(scoreTotal, 10), 100),
      carbonOffset: Math.round(co2Offset),
      greenCredits: parseFloat(credits.toFixed(1))
    };
  },

  clearChatHistory: (): void => {
    if (IS_SERVER) return;
    localStorage.removeItem('farmer_os_chat_history');
  }
};
