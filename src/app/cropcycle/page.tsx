'use client';

import React, { useState } from 'react';
import { SupportedCrop } from '@/data/cropcycleMappings';
import { CropSelection } from '@/components/cropcycle/CropSelection';
import { ResidueAnalysis } from '@/components/cropcycle/ResidueAnalysis';
import { BuyerMap } from '@/components/cropcycle/BuyerMap';
import { FinancialDashboard } from '@/components/cropcycle/FinancialDashboard';
import { SustainabilityPanel } from '@/components/cropcycle/SustainabilityPanel';
import { useApp } from '@/context/AppContext';

export default function CropCyclePage() {
  const { t } = useApp();
  const [selectedCrop, setSelectedCrop] = useState<SupportedCrop | null>(null);
  const [quantity, setQuantity] = useState<number>(5);
  const [moisture, setMoisture] = useState<string>('Dry');
  const [storageStatus, setStorageStatus] = useState<string>('In Field');
  const [nearestDistance, setNearestDistance] = useState<number>(25); // Default 25km until map loads

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
          {t('cropcycleTitle') || 'CropCycle Exchange'}
        </h1>
        <p className="text-emerald-700 dark:text-emerald-300">{t('cropcycleSub') || 'From Crop Waste to Additional Income'}</p>
      </div>

      <CropSelection 
        selectedCrop={selectedCrop} 
        setSelectedCrop={setSelectedCrop}
        quantity={quantity}
        setQuantity={setQuantity}
        moisture={moisture}
        setMoisture={setMoisture}
        storageStatus={storageStatus}
        setStorageStatus={setStorageStatus}
      />

      {selectedCrop && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <ResidueAnalysis selectedCrop={selectedCrop} />
          <BuyerMap selectedCrop={selectedCrop} setNearestDistance={setNearestDistance} />
          <FinancialDashboard selectedCrop={selectedCrop} quantity={quantity} distance={nearestDistance} />
          <SustainabilityPanel selectedCrop={selectedCrop} quantity={quantity} />
        </div>
      )}
    </div>
  );
}
