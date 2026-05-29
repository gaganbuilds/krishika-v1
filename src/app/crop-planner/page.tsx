'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { cropPlannerData } from '../../data/cropPlannerData';
import { Search, Tractor, Leaf, CloudSun, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CropPlannerListingPage() {
  const { t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');

  // We are supporting limited crops (7 specific ones). 
  // We added fully detailed mock data for Paddy, Wheat, Groundnut.
  // The system allows other 4 dynamically if they were added to the data file.
  
  const filteredCrops = cropPlannerData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeason = seasonFilter === 'All' || crop.season.includes(seasonFilter);
    return matchesSearch && matchesSeason;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header section */}
      <div className="bg-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
          <Tractor className="w-96 h-96 text-emerald-400" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md px-3 py-1.5 rounded-full text-emerald-200 text-xs font-bold mb-6 border border-emerald-700/50">
            <TrendingUp className="w-4 h-4" />
            <span>Intelligent Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Crop Planner</h1>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Select a crop to get an intelligent timeline, disease handbook, fertilizer suggestions, and financial intelligence tailored to your region.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-emerald-800/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search crops..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Kharif', 'Rabi', 'Summer'].map(season => (
            <button
              key={season}
              onClick={() => setSeasonFilter(season)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                seasonFilter === season 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Grid */}
      {filteredCrops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/crop-planner/${crop.id}`} className="block group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-emerald-800/10 flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={crop.imageUrl} 
                      alt={crop.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <h3 className="text-2xl font-black text-white">{crop.name}</h3>
                      <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                        {crop.season}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-stone-600 leading-relaxed mb-4 flex-1">
                      {crop.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-emerald-900 mb-5">
                      <div className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        <CloudSun className="w-4 h-4 text-emerald-600" />
                        <span className="truncate">{crop.climateBadge}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <Leaf className="w-4 h-4 text-blue-600" />
                        <span className="truncate">{crop.waterRequirement.split(' ')[0]} Water</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm font-bold text-emerald-600 group-hover:text-emerald-800 transition-colors">
                      <span>View Planning System</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
          <Tractor className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-700">No crops found</h3>
          <p className="text-stone-500 text-sm mt-1">Try adjusting your search or season filter.</p>
        </div>
      )}
    </div>
  );
}
