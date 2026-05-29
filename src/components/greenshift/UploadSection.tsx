'use client';

import React, { useState, useRef } from 'react';
import { Upload, Camera, FileImage, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface UploadSectionProps {
  t: (key: string) => string;
  onAnalysisComplete: (result: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const sampleFertilizers = [
  { id: 'urea', name: 'Urea (Chemical)', desc: 'Nitrogen 46% Bag', fileName: 'urea.jpg' },
  { id: 'dap', name: 'DAP (Chemical)', desc: '18-46-0 Phosphorus', fileName: 'dap.jpg' },
  { id: 'npk19', name: 'NPK 19-19-19', desc: 'NPK Complex', fileName: 'npk19.jpg' },
  { id: 'potash', name: 'Potash (MOP)', desc: 'Potassium Chloride', fileName: 'potash.jpg' },
  { id: 'glyphosate', name: 'Glyphosate (Weed Killer)', desc: 'Systemic Herbicide', fileName: 'glyphosate.jpg' },
  { id: 'chlorpyrifos', name: 'Chlorpyrifos (Pesticide)', desc: 'Organophosphate Liquid', fileName: 'chlorpyrifos.jpg' },
  { id: 'neem', name: 'Neem Bio-Pest (Organic)', desc: 'Neem-based insect spray', fileName: 'neem.jpg' },
  { id: 'biofertilizer', name: 'Bio-NPK (Bio)', desc: 'Liquid consortia culture', fileName: 'biofertilizer.jpg' }
];

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  t, 
  onAnalysisComplete, 
  isLoading, 
  setIsLoading 
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSample, setActiveSample] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    setSelectedFile(file);
    setActiveSample(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof sampleFertilizers[0]) => {
    setActiveSample(sample.id);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const triggerAnalyze = async () => {
    setIsLoading(true);
    try {
      let requestPayload: any = {};
      
      if (activeSample) {
        requestPayload = {
          fileName: `${activeSample}.jpg`,
          categoryHint: activeSample === 'glyphosate' || activeSample === 'chlorpyrifos' || activeSample === 'neem' ? 'pesticide' : 'fertilizer'
        };
      } else if (imagePreview) {
        requestPayload = {
          image: imagePreview,
          fileName: selectedFile?.name || 'uploaded_image.jpg',
          categoryHint: selectedFile?.name.toLowerCase().includes('spray') || selectedFile?.name.toLowerCase().includes('pesticide') ? 'pesticide' : 'fertilizer'
        };
      } else {
        alert('Please upload an image or select a sample package.');
        setIsLoading(false);
        return;
      }

      // Retrieve OpenAI key if set in settings
      const customOpenAiKey = localStorage.getItem('raithabhandhu_openai_key') || '';

      const response = await fetch('/api/greenshift/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customOpenAiKey ? { 'x-openai-key': customOpenAiKey } : {})
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error('Analysis failed.');
      }

      const result = await response.json();
      onAnalysisComplete(result);
    } catch (err) {
      console.error(err);
      alert('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setActiveSample(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Upload Zone */}
      <div className="lg:col-span-7 bg-white border border-emerald-800/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div>
          <h3 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600 animate-pulse" />
            {t('uploadTitle')}
          </h3>
          <p className="text-xs text-emerald-800/60 font-medium mt-1 leading-relaxed">
            {t('uploadDesc')}
          </p>
        </div>

        {/* Drag Drop Area */}
        <div className="my-5 flex-1 min-h-64 flex flex-col items-center justify-center">
          {imagePreview ? (
            <div className="relative w-full h-64 border border-emerald-800/15 rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              
              {/* Scanning Active Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-emerald-900/30 flex flex-col items-center justify-center backdrop-blur-[2px]">
                  {/* Glowing Laser Scan Bar */}
                  <div className="absolute left-0 right-0 h-1.5 bg-emerald-400 opacity-80 shadow-[0_0_15px_#10b981] animate-scanner" />
                  <div className="bg-emerald-950/90 text-emerald-300 font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl shadow-lg border border-emerald-700/50 flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t('analyzing')}</span>
                  </div>
                </div>
              )}

              {!isLoading && (
                <button 
                  onClick={resetUpload} 
                  className="absolute bottom-4 right-4 bg-emerald-950/80 hover:bg-emerald-950 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-lg border border-white/10 transition-all active:scale-95 cursor-pointer"
                >
                  {t('retake')}
                </button>
              )}
            </div>
          ) : activeSample ? (
            <div className="w-full h-64 border-2 border-dashed border-emerald-600/30 bg-emerald-50/10 rounded-2xl flex flex-col items-center justify-center p-6 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-emerald-900/30 flex flex-col items-center justify-center rounded-2xl backdrop-blur-[2px]">
                  <div className="absolute left-0 right-0 h-1.5 bg-emerald-400 opacity-80 shadow-[0_0_15px_#10b981] animate-scanner" />
                  <div className="bg-emerald-950/90 text-emerald-300 font-extrabold text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl shadow-lg border border-emerald-700/50 flex items-center gap-2.5">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t('analyzing')}</span>
                  </div>
                </div>
              )}
              
              <div className="bg-emerald-600/10 p-4.5 rounded-2xl border border-emerald-600/20 mb-3.5">
                <FileImage className="h-10 w-10 text-emerald-600 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-sm text-emerald-950">{sampleFertilizers.find(s => s.id === activeSample)?.name}</h4>
              <p className="text-[11px] text-emerald-800/60 font-semibold mt-1">Sample product loaded successfully.</p>
              
              {!isLoading && (
                <button 
                  onClick={resetUpload}
                  className="mt-4 border border-emerald-800/10 text-emerald-900 font-bold text-xs py-2 px-4 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  Clear Selection
                </button>
              )}
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                isDragOver 
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-inner' 
                  : 'border-emerald-800/15 hover:border-emerald-600 hover:bg-emerald-50/20'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg, image/webp" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
              />

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-3">
                <Upload className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-emerald-950">{t('dragDropText')}</p>
              <p className="text-[10px] text-emerald-800/50 font-medium mt-1">PNG, JPG, JPEG or WEBP up to 8MB</p>
              
              <div className="relative flex items-center justify-center w-full my-4.5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-emerald-800/5" /></div>
                <span className="relative bg-white px-3 text-[10px] text-emerald-800/40 uppercase tracking-widest font-extrabold">OR</span>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-700/20 font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="h-4 w-4 text-emerald-700" />
                <span>{t('cameraOption')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={triggerAnalyze}
          disabled={isLoading || (!imagePreview && !activeSample)}
          className={`w-full py-3.5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isLoading || (!imagePreview && !activeSample)
              ? 'bg-emerald-900/10 text-emerald-900/35 shadow-none border border-emerald-900/5 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]'
          }`}
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span>{t('analyzeBtn')}</span>
        </button>
      </div>

      {/* Sample Options */}
      <div className="lg:col-span-5 bg-white border border-emerald-800/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-600" />
            Quick Test Samples
          </h3>
          <p className="text-xs text-emerald-800/60 font-medium mt-1 leading-relaxed">
            Select a sample package below to instantly run a dynamic mock scan without uploading your own images.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-5 flex-1 overflow-y-auto max-h-72 pr-1">
          {sampleFertilizers.map((sample) => {
            const isSelected = activeSample === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`text-left p-3.5 rounded-2xl border text-xs transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  isSelected 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                    : 'bg-emerald-50/20 border-emerald-850/10 text-emerald-950 hover:bg-emerald-50/40 hover:border-emerald-600/30'
                }`}
              >
                <div>
                  <span className={`font-bold block truncate ${isSelected ? 'text-white' : 'text-emerald-950'}`}>
                    {sample.name}
                  </span>
                  <span className={`text-[10px] block font-medium mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-emerald-800/60'}`}>
                    {sample.desc}
                  </span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider block ${isSelected ? 'text-white/80' : 'text-emerald-600'}`}>
                  {isSelected ? '✓ Loaded' : 'Load Sample'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-emerald-50/40 border border-emerald-800/10 p-3 rounded-2xl text-[10px] leading-relaxed font-semibold text-emerald-900">
          💡 <span className="font-bold">Pro-Tip:</span> Select Glyphosate or Chlorpyrifos to see Pesticide-specific safety warning labels and organic neem-alternatives!
        </div>
      </div>
    </div>
  );
};
