'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Volume2, Mic, MicOff, Trash2, Sprout, Sparkles } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const Chatbot: React.FC = () => {
  const { 
    chatHistory, 
    sendChatMessage, 
    clearChat, 
    isLoadingAI, 
    activeLang, 
    speakText, 
    isSpeaking,
    t
  } = useApp();

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoadingAI]);

  // Sync speech input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoadingAI) return;
    const textToSend = input;
    setInput('');
    resetTranscript();
    await sendChatMessage(textToSend, false);
  };

  const handleVoiceSubmit = () => {
    if (isListening) {
      stopListening();
      if (input.trim()) {
        sendChatMessage(input, true);
        setInput('');
        resetTranscript();
      }
    } else {
      setInput('');
      resetTranscript();
      startListening(activeLang);
    }
  };

  const handleSuggestionClick = async (text: string) => {
    setInput('');
    await sendChatMessage(text, false);
  };

  const suggestions = {
    'hi-IN': [
      "टमाटर का भाव बताओ (Tomato price)",
      "पीएम किसान योजना क्या है? (PM Kisan info)",
      "कल सिंचाई का रिमाइंडर लगाओ (Water reminder)",
      "आज मौसम की क्या सलाह है? (Weather advice)"
    ],
    'kn-IN': [
      "ಭತ್ತದ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು? (Paddy rate)",
      "ನೀರಾವರಿ ಜ್ಞಾಪನೆ ಇಡು (Water reminder)",
      "ಕೃಷಿ ಸಾಲ ಯೋಜನೆ ತಿಳಿಸಿ (KCC loan info)",
      "ಹವಾಮಾನ ಸಲಹೆ ಏನಿದೆ? (Weather advice)"
    ],
    'en-IN': [
      "What is the price of Wheat?",
      "Tell me about Crop Insurance scheme",
      "Add watering reminder for tomorrow",
      "Is rain expected today?"
    ]
  };

  const currentSuggestions = suggestions[activeLang] || suggestions['en-IN'];

  return (
    <div className="flex flex-col bg-white border border-emerald-800/10 rounded-2xl shadow-xl h-[580px] max-w-2xl mx-auto w-full overflow-hidden">
      {/* Chat Header */}
      <div className="bg-emerald-900 px-6 py-4 flex items-center justify-between text-white border-b border-emerald-950">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 p-2 rounded-xl border border-emerald-700/50">
            <Sprout className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm leading-tight">ಕೃಷಿ ಮಿತ್ರ AI (Agri Mitra)</h3>
            <span className="text-[10px] text-emerald-300 font-semibold">Online • Speech enabled in Kannada, Hindi, English</span>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-emerald-50/5">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm leading-relaxed
                  ${isUser 
                    ? 'bg-emerald-600 text-white rounded-br-none font-semibold' 
                    : 'bg-white text-emerald-950 border border-emerald-800/10 rounded-bl-none font-medium'
                  }
                `}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between mt-2.5 gap-4 text-[9px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 rounded hover:bg-emerald-50 transition-colors flex items-center gap-1 text-emerald-700 font-extrabold cursor-pointer"
                      title="Listen to reply"
                    >
                      <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                      <span>ಕೇಳಿ / सुनें (Listen)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoadingAI && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-800/10 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce delay-0" />
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce delay-150" />
              <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-emerald-800/5 bg-stone-50/50">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s)}
              className="text-[10px] bg-white border border-emerald-800/10 text-emerald-850 px-3 py-1.5 rounded-xl transition-colors hover:bg-emerald-50 hover:border-emerald-600/30 shrink-0 font-semibold cursor-pointer shadow-sm"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="border-t border-emerald-800/10 p-4 bg-white flex items-center gap-3">
        <button
          type="button"
          onClick={handleVoiceSubmit}
          className={`
            p-3 rounded-xl text-white transition-all transform active:scale-95 cursor-pointer shrink-0 shadow-md
            ${isListening 
              ? 'bg-red-500 animate-pulse hover:bg-red-600' 
              : 'bg-emerald-750 hover:bg-emerald-800'
            }
          `}
          title={isListening ? 'Stop recording & parse' : 'Speak message'}
        >
          {isListening ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? t('listening') : t('chatPlaceholder')}
          className="flex-1 bg-emerald-50/20 border border-emerald-850/10 rounded-xl px-4 py-2.5 text-xs text-emerald-950 placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-semibold"
          disabled={isLoadingAI}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoadingAI}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl transition-all shadow-md shrink-0 active:scale-95 disabled:scale-100 cursor-pointer"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
};
export default Chatbot;
