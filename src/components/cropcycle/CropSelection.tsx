'use client';

import React from 'react';
import { SupportedCrop, cropcycleData } from '@/data/cropcycleMappings';
import { Leaf, Droplets, PackageOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

interface CropSelectionProps {
  selectedCrop: SupportedCrop | null;
  setSelectedCrop: (crop: SupportedCrop) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  moisture: string;
  setMoisture: (moisture: string) => void;
  storageStatus: string;
  setStorageStatus: (status: string) => void;
}

export const CropSelection: React.FC<CropSelectionProps> = ({
  selectedCrop,
  setSelectedCrop,
  quantity,
  setQuantity,
  moisture,
  setMoisture,
  storageStatus,
  setStorageStatus
}) => {
  const { t } = useApp();
  const crops = Object.values(cropcycleData);

  return (
    <div className="bg-white dark:bg-emerald-950/40 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
      <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center gap-2">
        <Leaf className="w-5 h-5 text-emerald-500" />
        {t('step1Title') || 'Step 1: Select Crop & Residue Details'}
      </h2>

      {/* Crop Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {crops.map((crop) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={crop.cropName}
            onClick={() => setSelectedCrop(crop.cropName)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200
              ${selectedCrop === crop.cropName
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-emerald-950'
                : 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800/40'
              }`}
          >
            <span className="text-3xl">{crop.imageFallback}</span>
            <span className="font-semibold text-sm">{crop.cropName}</span>
            <span className={`text-[10px] text-center leading-tight ${selectedCrop === crop.cropName ? 'text-emerald-50' : 'text-emerald-600/70 dark:text-emerald-400/70'}`}>
              {crop.residueType}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Details Form */}
      {selectedCrop && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-emerald-100 dark:border-emerald-800/50"
        >
          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <PackageOpen className="w-4 h-4" /> {t('estimatedQty') || 'Estimated Quantity (Tons)'}
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full bg-white dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-2.5 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., 5"
            />
          </div>

          {/* Moisture */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <Droplets className="w-4 h-4" /> {t('moistureCond') || 'Moisture Condition'}
            </label>
            <select
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className="w-full bg-white dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-2.5 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value="Dry">Dry (Ideal for burning/baling)</option>
              <option value="Semi-Dry">Semi-Dry</option>
              <option value="Wet">Wet (Freshly harvested)</option>
            </select>
          </div>

          {/* Storage Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <PackageOpen className="w-4 h-4" /> {t('storageStat') || 'Storage Status'}
            </label>
            <select
              value={storageStatus}
              onChange={(e) => setStorageStatus(e.target.value)}
              className="w-full bg-white dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-2.5 text-emerald-900 dark:text-emerald-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              <option value="In Field">In Field (Uncollected)</option>
              <option value="Collected">Collected & Piled</option>
              <option value="Baled">Baled & Stored</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
};
