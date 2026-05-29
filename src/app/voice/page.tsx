import React from 'react';
import { VoiceLogger } from '../../components/VoiceLogger';
import { Mic, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VoicePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboard" 
          className="p-2 bg-white border border-emerald-800/10 hover:bg-emerald-50 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-emerald-900" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-emerald-950">ಆವಾಝ್ ಸಹಾಯಕ (Voice Assistant)</h1>
          <p className="text-xs text-emerald-800/60 font-medium">Control Raithabhandhu directly with your voice commands.</p>
        </div>
      </div>

      <VoiceLogger />

      {/* Helpful tips card */}
      <div className="bg-emerald-50/50 border border-emerald-800/15 rounded-2xl p-5 text-emerald-950">
        <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-emerald-800">Example Voice Commands:</h4>
        <ul className="space-y-2 text-xs leading-relaxed font-medium">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">•</span>
            <span>&quot;गेहूं का भाव बताओ&quot; / &quot;ಭತ್ತದ ಧಾರಣೆ ತಿಳಿಸಿ&quot; - To fetch latest crop rates.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 font-bold">•</span>
            <span>&quot;कल सुबह पानी देने का रिमाइंडर लगाओ&quot; / &quot;ಜ್ಞಾಪನೆ ಇಡು&quot; - To schedule irrigation.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
