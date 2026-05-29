'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SupportedCrop } from '@/data/cropcycleMappings';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';

const BuyerMapClient = dynamic(() => import('./BuyerMapClient'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 dark:bg-emerald-900/10 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-emerald-500 font-medium">Loading Map...</span>
    </div>
  )
});

interface BuyerMapProps {
  selectedCrop: SupportedCrop | null;
  setNearestDistance: (dist: number) => void;
}

export const BuyerMap: React.FC<BuyerMapProps> = ({ selectedCrop, setNearestDistance }) => {
  const { t, farmerProfile } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-emerald-950/40 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50"
    >
      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-emerald-500" />
        {t('step3Title')}
      </h2>
      
      <BuyerMapClient selectedCrop={selectedCrop} farmerProfile={farmerProfile} t={t} setNearestDistance={setNearestDistance} />
      
    </motion.div>
  );
};
