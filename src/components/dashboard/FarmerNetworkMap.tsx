'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockFarmerNetwork, getFarmerNetworkStats } from '../../data/farmerNetworkData';
import { Users, MapPin, Sprout, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icon for Active Farmers (Green) and Offline (Gray)
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const offlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function FarmerNetworkMap() {
  const { activeLang } = useApp();
  const stats = getFarmerNetworkStats();
  const [filter, setFilter] = useState('');

  const filteredFarmers = mockFarmerNetwork.filter(farmer => 
    farmer.name.toLowerCase().includes(filter.toLowerCase()) || 
    farmer.district.toLowerCase().includes(filter.toLowerCase()) ||
    farmer.crops.some(c => c.toLowerCase().includes(filter.toLowerCase()))
  );

  const title = activeLang === 'hi-IN' ? 'किसान नेटवर्क' : activeLang === 'kn-IN' ? 'ರೈತ ಜಾಲ' : 'Farmer Network';

  return (
    <div className="bg-white rounded-2xl border border-emerald-800/10 shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-emerald-800/10 bg-emerald-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
        <div>
          <h2 className="font-black text-emerald-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            {title}
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full ml-2 flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
            </span>
          </h2>
          <p className="text-xs text-stone-500 font-semibold mt-0.5">Connecting registered farmers across districts.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-xs font-bold text-emerald-900">
            <div className="flex flex-col"><span className="text-stone-400 text-[10px] uppercase">Active</span><span>{stats.active}</span></div>
            <div className="flex flex-col"><span className="text-stone-400 text-[10px] uppercase">Total</span><span>{stats.total}</span></div>
            <div className="flex flex-col"><span className="text-stone-400 text-[10px] uppercase">Districts</span><span>{stats.districts}</span></div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search crop or district..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500 w-48 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[14.1, 76.2]} // Central Karnataka
          zoom={7} 
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredFarmers.map((farmer) => (
            <Marker 
              key={farmer.id} 
              position={[farmer.lat, farmer.lng]}
              icon={farmer.status === 'active' ? activeIcon : offlineIcon}
            >
              <Popup>
                <div className="min-w-[180px] p-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-emerald-950 text-sm m-0 leading-tight">{farmer.name}</h3>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${farmer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {farmer.status === 'active' ? 'Active' : farmer.lastActive}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-stone-500 font-semibold mb-2 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {farmer.district}, {farmer.state}
                  </p>
                  
                  <div className="bg-stone-50 p-2 rounded-lg border border-stone-100 mb-1">
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sprout className="w-3 h-3" /> Growing
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {farmer.crops.map(c => (
                        <span key={c} className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold border border-emerald-100">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-[10px] font-medium text-stone-500 mt-2">
                    Specialization: <strong className="text-emerald-900">{farmer.specialization}</strong>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
