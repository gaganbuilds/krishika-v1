'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, User, Layers, Wheat, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { registerFarmer, t } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form Fields State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [familyCount, setFamilyCount] = useState('4');
  
  const [farmSize, setFarmSize] = useState('');
  const [soilType, setSoilType] = useState('Black Soil');
  const [irrigationType, setIrrigationType] = useState('Borewell');
  const [fieldCount, setFieldCount] = useState('1');
  const [experience, setExperience] = useState('');
  const [livestock, setLivestock] = useState('');

  const [mainCrops, setMainCrops] = useState('');
  const [cropSeasons, setCropSeasons] = useState('Kharif');

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = {
      name,
      age: parseInt(age) || 0,
      gender,
      mobile,
      address,
      state,
      district,
      village,
      aadhaar,
      familyCount: parseInt(familyCount) || 1,
      farmSize: parseFloat(farmSize) || 0,
      soilType,
      irrigationType,
      fieldCount: parseInt(fieldCount) || 1,
      experience: parseInt(experience) || 0,
      livestock,
      mainCrops,
      cropSeasons
    };

    registerFarmer(profile);
    router.push('/dashboard');
  };

  return (
    <div className="bg-stone-50 min-h-screen flex items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white border border-emerald-800/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-emerald-900 text-white p-6 flex justify-between items-center border-b border-emerald-950">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 p-2 rounded-xl">
              <Sprout className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight">{t('registerTitle')}</h1>
              <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">Please provide your details to personalize your companion.</p>
            </div>
          </div>
          <span className="text-xs bg-emerald-800 border border-emerald-700/50 px-3 py-1.5 rounded-xl font-bold">
            {t('step')} {step} / 3
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5 flex">
          <div 
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 border-b border-emerald-800/5 pb-2">
                  <User className="h-5 w-5 text-emerald-600" />
                  <span>1. {t('personalDetails')}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('farmerName')} *</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Karan Singh"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('age')} *</label>
                      <input 
                        type="number" 
                        required 
                        value={age} 
                        onChange={(e) => setAge(e.target.value)} 
                        placeholder="e.g. 45"
                        className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('gender')}</label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                      >
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                        <option value="Other">{t('other')}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('mobileNumber')} *</label>
                    <input 
                      type="tel" 
                      required 
                      value={mobile} 
                      onChange={(e) => setMobile(e.target.value)} 
                      placeholder="e.g. 9876543210"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('aadhaar')} *</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={12}
                      value={aadhaar} 
                      onChange={(e) => setAadhaar(e.target.value)} 
                      placeholder="12 digit Aadhaar placeholder"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('state')} *</label>
                    <input 
                      type="text" 
                      required 
                      value={state} 
                      onChange={(e) => setState(e.target.value)} 
                      placeholder="Punjab / Karnataka"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('district')} *</label>
                    <input 
                      type="text" 
                      required 
                      value={district} 
                      onChange={(e) => setDistrict(e.target.value)} 
                      placeholder="Ludhiana"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('village')} *</label>
                    <input 
                      type="text" 
                      required 
                      value={village} 
                      onChange={(e) => setVillage(e.target.value)} 
                      placeholder="Khanna"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('familyCount')}</label>
                    <input 
                      type="number" 
                      value={familyCount} 
                      onChange={(e) => setFamilyCount(e.target.value)} 
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('address')}</label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Detailed address"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 border-b border-emerald-800/5 pb-2">
                  <Layers className="h-5 w-5 text-emerald-600" />
                  <span>2. {t('farmDetails')}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('farmSize')} *</label>
                    <input 
                      type="number" 
                      required 
                      step="0.1"
                      value={farmSize} 
                      onChange={(e) => setFarmSize(e.target.value)} 
                      placeholder="e.g. 5.5"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('soilType')}</label>
                    <select 
                      value={soilType} 
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    >
                      <option value="Black Soil">काली मिट्टी (Black Soil)</option>
                      <option value="Red Soil">लाल मिट्टी (Red Soil)</option>
                      <option value="Alluvial Soil">जलोढ़ मिट्टी (Alluvial Soil)</option>
                      <option value="Sandy Soil">बलुई मिट्टी (Sandy Soil)</option>
                      <option value="Clay Soil">चिकनी मिट्टी (Clay Soil)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('irrigationType')}</label>
                    <select 
                      value={irrigationType} 
                      onChange={(e) => setIrrigationType(e.target.value)}
                      className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    >
                      <option value="Borewell">बोरवेल / नलकूप (Borewell)</option>
                      <option value="Canal">नहर (Canal)</option>
                      <option value="Drip Irrigation">टपकन सिंचाई (Drip)</option>
                      <option value="Rainfed">वर्षा आधारित (Rainfed)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('fieldCount')}</label>
                    <input 
                      type="number" 
                      value={fieldCount} 
                      onChange={(e) => setFieldCount(e.target.value)} 
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('experience')} *</label>
                    <input 
                      type="number" 
                      required
                      value={experience} 
                      onChange={(e) => setExperience(e.target.value)} 
                      placeholder="e.g. 15"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('livestock')}</label>
                    <input 
                      type="text" 
                      value={livestock} 
                      onChange={(e) => setLivestock(e.target.value)} 
                      placeholder="e.g. 2 Cows, 1 Buffalo"
                      className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2 border-b border-emerald-800/5 pb-2">
                  <Wheat className="h-5 w-5 text-emerald-600" />
                  <span>3. {t('cropDetails')}</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('mainCrops')} *</label>
                  <input 
                    type="text" 
                    required
                    value={mainCrops} 
                    onChange={(e) => setMainCrops(e.target.value)} 
                    placeholder="e.g. Wheat, Paddy, Cotton"
                    className="w-full border border-emerald-800/10 rounded-xl px-3.5 py-2.5 text-xs placeholder-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                  />
                  <span className="text-[10px] text-emerald-800/50 block">Enter your main crops separated by commas.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-emerald-950 uppercase tracking-wider block">{t('cropSeasons')}</label>
                  <select 
                    value={cropSeasons} 
                    onChange={(e) => setCropSeasons(e.target.value)}
                    className="w-full border border-emerald-800/10 bg-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-medium"
                  >
                    <option value="Kharif">खरीफ (Kharif - Monsoon)</option>
                    <option value="Rabi">रबी (Rabi - Winter)</option>
                    <option value="Zaid">जायद (Zaid - Summer)</option>
                    <option value="Year-Round">वर्षभर (Whole Year)</option>
                  </select>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-800/15 rounded-xl p-4 flex gap-3 text-emerald-900 mt-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-[10px] leading-relaxed font-semibold">
                    <p className="font-bold text-emerald-950">Safe & Secure Data Policy</p>
                    <p className="opacity-80 mt-0.5">Your profiling answers are stored securely inside local storage to personalize your voice companion experience. We never share Aadhaar or farming logs outside your device.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-stone-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 border border-emerald-800/10 hover:bg-emerald-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-emerald-900"
              >
                {t('prev')}
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
              >
                {t('next')}
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ml-auto"
              >
                {t('submit')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
