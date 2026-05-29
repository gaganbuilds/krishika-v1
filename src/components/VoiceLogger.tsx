'use client';

import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, AlertCircle, Sparkles, Send, Volume2, Globe } from 'lucide-react';

export const VoiceLogger: React.FC = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    error, 
    supported 
  } = useSpeechRecognition();

  const { sendChatMessage, activeLang, setActiveLang, isLoadingAI, t } = useApp();
  const [typedInput, setTypedInput] = useState('');

  // Sync speech transcript live
  useEffect(() => {
    if (transcript) {
      setTypedInput(transcript);
    }
  }, [transcript]);

  const handleStartVoice = () => {
    resetTranscript();
    setTypedInput('');
    startListening(activeLang);
  };

  const handleSend = async () => {
    if (!typedInput.trim()) return;
    await sendChatMessage(typedInput, true);
    setTypedInput('');
    resetTranscript();
  };

  const handleSuggestionClick = (text: string) => {
    setTypedInput(text);
  };

  const suggestions = {
    'hi-IN': [
      { label: 'गेहूं का भाव', action: 'गेहूं का क्या भाव चल रहा है?' },
      { label: 'सिंचाई का रिमाइंडर', action: 'कल सुबह पानी देने का रिमाइंडर लगा दो' },
      { label: 'दवाई छिड़काव', action: 'टाइमलाइन पर डालो: टमाटर में दवाई स्प्रे किया' },
    ],
    'kn-IN': [
      { label: 'ಭತ್ತದ ಧಾರಣೆ', action: 'ಭತ್ತದ ಮಾರುಕಟ್ಟೆ ರೇಟ್ ಎಷ್ಟು ನಡೀತಿದೆ?' },
      { label: 'ನೀರಾವರಿ ಜ್ಞಾಪನೆ', action: 'ನಾಳೆ ಬೆಳಿಗ್ಗೆ ನೀರು ಹಾಯಿಸಲು ಜ್ಞಾಪನೆ ಇಡು' },
      { label: 'ಕಾರ್ಯ ದಾಖಲಿಸು', action: 'ಗೋಧಿ ಬೆಳೆಗೆ ಗೊಬ್ಬರ ಹಾಕಿದೆ ಎಂದು ದಾಖಲಿಸು' },
    ],
    'en-IN': [
      { label: 'Wheat Price', action: 'What is the price of Wheat?' },
      { label: 'Water Reminder', action: 'Set irrigation reminder for tomorrow morning' },
      { label: 'Log Activity', action: 'Log soil sample completed on my timeline' },
    ]
  };

  const currentSuggestions = suggestions[activeLang] || suggestions['en-IN'];

  return (
    <div className="bg-white/80 backdrop-blur-md border border-emerald-800/10 shadow-xl rounded-2xl p-6 flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
        <h2 className="text-base font-black text-emerald-950">AI Voice Assistant (ಆವಾಜ್ ಸಂಗಾತಿ)</h2>
      </div>
      
      <p className="text-[11px] text-emerald-800/60 text-center mb-6 leading-relaxed">
        Speak naturally. We support automatic transcription for Kannada (ಕನ್ನಡ), Hindi (हिन्दी), and English.
      </p>

      {/* Voice visualizer wave */}
      <div className="relative flex items-center justify-center mb-6">
        {isListening ? (
          <div className="absolute inset-0 flex items-center justify-center gap-1 text-emerald-500 scale-150 pointer-events-none">
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
            <span className="audio-bar" />
          </div>
        ) : (
          <span className="absolute inline-flex h-20 w-20 rounded-full bg-emerald-500/5" />
        )}
        <button
          onClick={isListening ? stopListening : handleStartVoice}
          disabled={!supported || isLoadingAI}
          className={`
            relative z-10 p-5 rounded-full text-white shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 hover:scale-105' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105'
            }
            ${(!supported || isLoadingAI) && 'opacity-50 cursor-not-allowed'}
          `}
        >
          {isListening ? (
            <MicOff className="h-7 w-7 animate-pulse" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Listening / Loading Caption Indicator */}
      <div className="text-center mb-6 h-6">
        {isListening ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
            {t('listening')}
          </span>
        ) : isLoadingAI ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 animate-pulse">
            {t('processing')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
            {t('pressToSpeak')}
          </span>
        )}
      </div>

      {/* Browser compatibility check */}
      {!supported && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl text-xs w-full mb-5">
          <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Speech Recognition Unsupported</p>
            <p className="opacity-95 mt-0.5">Your browser doesn&apos;t support the Web Speech API. You can still type commands in the input below.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs w-full mb-4">
          Error: {error}
        </div>
      )}

      {/* Transcript / Input text area */}
      <div className="w-full space-y-4">
        <div className="relative">
          <textarea
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder={isListening ? "Listening transcript appearing here live..." : "Type or speak your farming requests..."}
            rows={3}
            className="w-full border border-emerald-800/10 rounded-xl px-4 py-3 text-xs text-emerald-950 placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-emerald-50/20 resize-none font-semibold leading-relaxed"
          />
          {typedInput.trim() && (
            <button
              onClick={handleSend}
              disabled={isLoadingAI}
              className="absolute bottom-3.5 right-3.5 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dynamic Suggestions */}
        <div>
          <span className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-wider block mb-2">
            {t('suggestions')}
          </span>
          <div className="flex flex-wrap gap-2">
            {currentSuggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s.action)}
                className="text-[11px] bg-emerald-50 hover:bg-emerald-100/80 text-emerald-850 border border-emerald-800/10 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
