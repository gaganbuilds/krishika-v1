'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  UploadCloud, 
  Camera, 
  X, 
  Activity, 
  ArrowRight,
  Stethoscope,
  Info,
  Thermometer,
  ShieldCheck,
  CalendarPlus,
  Loader2,
  RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import axios from 'axios';
import diseaseDataJson from '../../data/diseaseData.json';

// Dynamic import for Leaflet map to prevent SSR issues
const ProviderMap = dynamic(
  () => import('../../components/disease-manager/ProviderMap'),
  { ssr: false, loading: () => <div className="h-[400px] w-full bg-emerald-50 animate-pulse rounded-2xl flex items-center justify-center text-emerald-800 font-bold">Loading Map...</div> }
);

const diseaseData = diseaseDataJson as Record<string, any>;

export default function DiseaseManagerPage() {
  const { t, activeLang, addActivity } = useApp();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setError(null);
        setStatusMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
        setError(null);
        setStatusMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setError(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const analyzeImage = async () => {
    if (!imageFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    setStatusMessage(null);
    
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.post('/api/disease-detect', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 90000,
        });

        // Response from HuggingFace is typically an array of predictions
        const predictions = response.data;
        
        if (Array.isArray(predictions) && predictions.length > 0) {
          const topPrediction = predictions[0];
          const label = topPrediction.label;
          
          // Map prediction label to our local disease data
          let matchedData = diseaseData['healthy'];
          const labelLower = label.toLowerCase();
          
          // Try exact key match first
          if (diseaseData[label]) {
            matchedData = diseaseData[label];
          } else if (labelLower.includes('bacterial_spot')) {
            matchedData = diseaseData['Tomato___Bacterial_spot'];
          } else if (labelLower.includes('early_blight')) {
            matchedData = diseaseData['Tomato___Early_blight'];
          } else if (labelLower.includes('late_blight')) {
            matchedData = diseaseData['Potato___Late_blight'];
          } else if (labelLower.includes('healthy')) {
            matchedData = diseaseData['healthy'];
          }

          setAnalysisResult({
            prediction: label,
            confidence: Math.round(topPrediction.score * 100),
            details: matchedData,
            allPredictions: predictions.slice(0, 5)
          });
          setStatusMessage(null);
          setIsAnalyzing(false);
          return; // Success — exit the retry loop
        } else {
          setError('Could not analyze the image. Please try a clearer picture.');
          setIsAnalyzing(false);
          return;
        }
      } catch (err: any) {
        const status = err.response?.status;
        const data = err.response?.data;

        // Model is loading (503) — wait and retry
        if (status === 503 && data?.error === 'model_loading') {
          const waitSecs = Math.ceil(data.estimated_time || 20);
          setStatusMessage(`🤖 AI model is warming up... retrying in ${waitSecs}s (attempt ${attempt}/${MAX_RETRIES})`);
          await delay(waitSecs * 1000);
          continue; // retry
        }

        // Any other error — show it and stop
        console.error('Disease detection error:', err);
        if (data?.error === 'HUGGINGFACE_API_KEY is not configured.') {
          setError('HuggingFace API key is not configured. Add HUGGINGFACE_API_KEY to your .env file and restart the server.');
        } else {
          setError(data?.details || data?.error || 'Analysis failed. Please check your internet connection and try again.');
        }
        setIsAnalyzing(false);
        return;
      }
    }

    // Exhausted all retries
    setError('AI model is still loading. Please wait a minute and try again.');
    setStatusMessage(null);
    setIsAnalyzing(false);
  };

  const scheduleTask = (taskName: string, category: 'crop' | 'pest' | 'soil' | 'water') => {
    addActivity({
      title: taskName,
      type: category,
      notes: 'Scheduled via Disease Manager AI analysis.',
      status: 'Scheduled'
    });
    alert('Task added to Farm Timeline!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-emerald-600" />
            {activeLang === 'hi-IN' ? 'रोग प्रबंधक' : activeLang === 'kn-IN' ? 'ರೋಗ ನಿರ್ವಾಹಕ' : 'Disease Manager'}
          </h1>
          <p className="text-xs text-emerald-800/60 font-semibold mt-1">
            AI-powered crop disease intelligence and prevention system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload & Main Results */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Box */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-emerald-950 text-sm mb-4 flex items-center gap-2">
              <Camera className="h-4.5 w-4.5 text-emerald-600" />
              Upload Crop Image
            </h3>

            {!selectedImage ? (
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-800/20 rounded-xl h-64 flex flex-col items-center justify-center bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-colors group"
              >
                <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-emerald-950">Tap to upload or drag image</p>
                <p className="text-[10px] text-emerald-800/50 font-semibold mt-1">Supports JPG, PNG, WEBP</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-emerald-800/10 bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImage} alt="Crop" className="w-full h-64 object-cover" />
                  <button 
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-600 text-white rounded-lg backdrop-blur-md transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {!analysisResult && (
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-5 w-5" />
                        Analyze Disease
                      </>
                    )}
                  </button>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center space-y-2">
                    <p>{error}</p>
                    <button
                      onClick={analyzeImage}
                      className="text-[10px] font-bold text-red-600 hover:text-red-800 underline"
                    >
                      Retry Analysis
                    </button>
                  </div>
                )}

                {statusMessage && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {statusMessage}
                  </div>
                )}
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>

          {/* AI Predictions Summary */}
          {analysisResult && (
            <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-xl border border-emerald-800/50 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 scale-150">
                <Activity className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-4">AI Analysis Complete</h3>
                
                <div className="space-y-3">
                  {analysisResult.allPredictions?.map((pred: any, idx: number) => (
                    <div key={idx} className={`p-3 rounded-xl border ${idx === 0 ? 'bg-emerald-900/80 border-emerald-700/50' : 'bg-emerald-900/30 border-transparent'}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold truncate pr-2">{pred.label.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-black">{Math.round(pred.score * 100)}%</span>
                      </div>
                      <div className="w-full bg-emerald-950 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${idx === 0 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.round(pred.score * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={analyzeImage}
                  className="mt-5 text-[10px] font-bold text-emerald-300 hover:text-white flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <RefreshCcw className="h-3 w-3" /> Re-scan
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Intelligence & Action */}
        <div className="lg:col-span-7 space-y-6">
          
          {analysisResult ? (
            <>
              {/* Detailed Intelligence Panel */}
              <div className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-black text-emerald-950">{analysisResult.details.name}</h2>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 ${
                      analysisResult.details.severity === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                      analysisResult.details.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Severity: {analysisResult.details.severity}
                    </span>
                  </div>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Thermometer className="h-6 w-6" />
                  </div>
                </div>

                <p className="text-sm text-emerald-950/70 font-medium leading-relaxed mb-6">
                  {analysisResult.details.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-800/5">
                    <h4 className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                      <Info className="h-4 w-4" /> Symptoms
                    </h4>
                    <ul className="text-xs font-semibold text-emerald-800/70 space-y-1.5 pl-5 list-disc">
                      {analysisResult.details.symptoms.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-800/5">
                    <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" /> Causes
                    </h4>
                    <ul className="text-xs font-semibold text-amber-800/70 space-y-1.5 pl-5 list-disc">
                      {analysisResult.details.causes.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-emerald-800/10 pt-5">
                  <h3 className="font-bold text-emerald-950 text-sm mb-3">Treatment Plan</h3>
                  <div className="space-y-3 text-xs font-medium text-emerald-950/80">
                    <div className="flex gap-3"><strong className="w-24 shrink-0 text-emerald-900">Fertilizer:</strong> {analysisResult.details.treatment.fertilizer}</div>
                    <div className="flex gap-3"><strong className="w-24 shrink-0 text-emerald-900">Chemical:</strong> {analysisResult.details.treatment.pesticide}</div>
                    <div className="flex gap-3"><strong className="w-24 shrink-0 text-emerald-900">Organic:</strong> {analysisResult.details.treatment.organicAlternatives}</div>
                    <div className="flex gap-3"><strong className="w-24 shrink-0 text-emerald-900">Dosage:</strong> {analysisResult.details.treatment.usageQuantity}</div>
                  </div>
                  
                  <button 
                    onClick={() => scheduleTask(`Treat ${analysisResult.details.name}`, 'pest')}
                    className="mt-5 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CalendarPlus className="h-4 w-4" /> Add to Timeline
                  </button>
                </div>
              </div>

              {/* Prevention & Setup Map */}
              <div className="bg-white border border-emerald-800/10 p-6 rounded-2xl shadow-sm">
                <h3 className="font-bold text-emerald-950 text-sm mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                  Local Providers & Prevention
                </h3>
                
                <p className="text-xs text-emerald-800/70 font-semibold mb-4">
                  Find nearby stores carrying the recommended treatments (Pesticides, Copper Fungicides, Neem Oil).
                </p>

                <ProviderMap />

                <div className="mt-5 border-t border-emerald-800/10 pt-5">
                  <h4 className="text-xs font-bold text-emerald-900 mb-2">Future Prevention Checklist</h4>
                  <ul className="text-xs font-semibold text-emerald-800/70 space-y-2">
                    {analysisResult.details.prevention.map((p: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-emerald-800/10 rounded-2xl flex flex-col items-center justify-center bg-emerald-50/20 text-center p-6">
              <div className="p-4 bg-emerald-50 rounded-full text-emerald-300 mb-4">
                <Stethoscope className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-emerald-900 text-lg mb-2">Awaiting Image Analysis</h3>
              <p className="text-xs text-emerald-800/60 font-medium max-w-md">
                Upload a clear photo of the affected crop leaf or stem. Our AI will identify the disease and provide local treatment options instantly.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Simple check icon for list
const CheckCircleIcon = (props: any) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
