import React from 'react';
import { Chatbot } from '../../components/Chatbot';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatbotPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-emerald-950">ಕೃಷಿ ಮಿತ್ರ AI (Agri Mitra)</h1>
          <p className="text-xs text-emerald-800/60 font-medium">Text and voice chat with your smart farming companion.</p>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}
