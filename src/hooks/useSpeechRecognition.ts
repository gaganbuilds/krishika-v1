import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: (lang?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  supported: boolean;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setTranscript(resultText);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event);
          setError(event.error || 'Speech recognition failed');
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = (lang: string = 'hi-IN') => {
    if (!supported || !recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    try {
      recognitionRef.current.lang = lang; // Set language (e.g. hi-IN, en-IN, pa-IN)
      recognitionRef.current.start();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to start listening');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    supported,
  };
};
