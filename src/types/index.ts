export interface CropPrice {
  id: string;
  name: string;
  market: string;
  state: string;
  price: number; // in INR per quintal
  change: number; // percentage change, e.g. +2.5 or -1.2
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Vegetables' | 'Fruits' | 'Spices';
  date: string;
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  eligibility: string;
  benefits: string;
  link: string;
}

export interface Reminder {
  id: string;
  title: string;
  crop: string;
  date: string;
  time: string;
  type: 'Sowing' | 'Irrigation' | 'Fertilizer' | 'Harvesting' | 'Pesticides' | 'General';
  completed: boolean;
}

export interface FarmActivity {
  id: string;
  title: string;
  date: string;
  notes: string;
  status: 'Completed' | 'Scheduled' | 'Delayed';
  type: 'soil' | 'water' | 'crop' | 'pest' | 'harvest' | 'finance';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioUrl?: string;
  isVoiceInput?: boolean;
}
