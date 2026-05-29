'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { SupportedCrop, cropcycleData } from '@/data/cropcycleMappings';
import { MapPin, Phone, MessageCircle, Navigation, Loader2 } from 'lucide-react';

// Fix Leaflet default marker icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customBuyerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface BuyerMapClientProps {
  selectedCrop: SupportedCrop | null;
  farmerProfile: any;
  t: (key: string) => string;
  setNearestDistance?: (dist: number) => void;
}

export default function BuyerMapClient({ selectedCrop, farmerProfile, t, setNearestDistance }: BuyerMapClientProps) {
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive center based on profile first to make loading faster
  useEffect(() => {
    // If farmer is from a specific district, we could geocode it. 
    // We'll use a standard fallback for demo, but try geolocation first.
    let profileLatLon: [number, number] = [12.9716, 77.5946]; // Bangalore
    if (farmerProfile?.district?.toLowerCase().includes('mandya')) profileLatLon = [12.5238, 76.8972];
    if (farmerProfile?.district?.toLowerCase().includes('mysore')) profileLatLon = [12.2958, 76.6394];
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLoc([lat, lon]);
          fetchNearbyBuyers(lat, lon);
        },
        (err) => {
          console.warn('Geolocation blocked, using fallback location based on profile');
          setUserLoc(profileLatLon);
          fetchNearbyBuyers(profileLatLon[0], profileLatLon[1]);
        }
      );
    } else {
      setUserLoc(profileLatLon);
      fetchNearbyBuyers(profileLatLon[0], profileLatLon[1]);
    }
  }, []);

  const fetchNearbyBuyers = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/overpass?lat=${lat}&lon=${lon}&radius=30000`);
      if (res.ok) {
        const data = await res.json();
        const locations = data.elements
          .filter((e: any) => e.type === 'node' || e.center)
          .map((e: any) => {
            const eLat = e.type === 'node' ? e.lat : e.center.lat;
            const eLon = e.type === 'node' ? e.lon : e.center.lon;
            return {
              id: e.id,
              name: e.tags?.name || (e.tags?.man_made === 'works' ? 'Processing Plant' : 'Industrial Unit'),
              type: e.tags?.landuse || e.tags?.man_made || 'Industry',
              lat: eLat,
              lon: eLon,
              distance: calculateDistance(lat, lon, eLat, eLon)
            };
          })
          .sort((a: any, b: any) => a.distance - b.distance)
          .slice(0, 10);
        
        setBuyers(locations);
        if (locations.length > 0 && setNearestDistance) {
          setNearestDistance(locations[0].distance);
        }
      }
    } catch (error) {
      console.error('Failed to fetch buyers', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (!userLoc) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-slate-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
        <p className="text-emerald-700 dark:text-emerald-300 font-medium">Acquiring location...</p>
      </div>
    );
  }

  const cropData = selectedCrop ? cropcycleData[selectedCrop] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden shadow-sm border border-emerald-200 dark:border-emerald-800/50 z-0 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
             <div className="bg-white dark:bg-emerald-900 p-4 rounded-xl shadow-lg flex items-center gap-3">
               <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
               <span className="font-semibold text-emerald-900 dark:text-emerald-100">Scanning for nearby industries...</span>
             </div>
          </div>
        )}
        <MapContainer center={userLoc} zoom={11} className="w-full h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <Marker position={userLoc}>
            <Popup>
              <div className="font-semibold">Your Farm</div>
            </Popup>
          </Marker>

          {buyers.map((buyer, idx) => {
            const mappedIndustry = cropData 
              ? cropData.industries[idx % cropData.industries.length]
              : null;
            const industryType = mappedIndustry ? mappedIndustry.name : buyer.type;
            
            return (
              <React.Fragment key={buyer.id}>
                <Marker position={[buyer.lat, buyer.lon]} icon={customBuyerIcon}>
                  <Popup>
                    <div className="font-semibold text-sm">{buyer.name === 'Processing Plant' && mappedIndustry ? mappedIndustry.name : buyer.name}</div>
                    <div className="text-xs font-medium text-emerald-600 mb-1">{industryType}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">{buyer.distance.toFixed(1)} km away</div>
                    
                    <div className="flex gap-2">
                       <a href={`tel:+919876543210`} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{t('callBtn') || 'Call'}</a>
                       <a href={`https://www.google.com/maps/dir/?api=1&destination=${buyer.lat},${buyer.lon}`} target="_blank" rel="noreferrer" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{t('routeBtn') || 'Route'}</a>
                    </div>
                  </Popup>
                </Marker>
                <Polyline 
                  positions={[userLoc, [buyer.lat, buyer.lon]]} 
                  pathOptions={{ color: '#10b981', weight: 2, dashArray: '5, 10' }} 
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Buyer List Section */}
      <div className="bg-white dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/50 p-4 overflow-y-auto h-[500px]">
        <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2 sticky top-0 bg-white dark:bg-[#062417] py-2 z-10">
          <MapPin className="w-5 h-5 text-emerald-500" />
          {t('nearbyBuyers') || 'Nearby Buyers'}
        </h3>
        
        {buyers.length === 0 && !loading && (
          <div className="text-sm text-slate-500 text-center mt-10">No industrial buyers found nearby.</div>
        )}

        <div className="space-y-4">
          {buyers.map((buyer, idx) => {
            const mappedIndustry = cropData 
              ? cropData.industries[idx % cropData.industries.length]
              : null;
            const buyerName = buyer.name === 'Processing Plant' && mappedIndustry ? mappedIndustry.name : buyer.name;

            return (
              <div key={buyer.id} className="p-3 bg-slate-50 dark:bg-emerald-900/20 border border-slate-100 dark:border-emerald-800/30 rounded-lg hover:border-emerald-300 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">{buyerName}</h4>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded whitespace-nowrap">
                    {buyer.distance.toFixed(1)} km
                  </span>
                </div>
                
                {mappedIndustry ? (
                  <>
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                      {mappedIndustry.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 leading-tight">
                      Use Case: {mappedIndustry.useCase}
                    </div>
                  </>
                ) : (
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                    Type: {buyer.type}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <a href={`tel:+919876543210`} className="flex-1 flex justify-center items-center gap-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800/50 dark:hover:bg-emerald-700/50 text-emerald-700 dark:text-emerald-300 py-1.5 rounded-md text-xs font-medium transition-colors">
                    <Phone className="w-3 h-3" /> {t('callBtn') || 'Call'}
                  </a>
                  <a href={`https://wa.me/919876543210`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40 text-green-700 dark:text-green-400 py-1.5 rounded-md text-xs font-medium transition-colors">
                    <MessageCircle className="w-3 h-3" /> {t('waBtn') || 'WhatsApp'}
                  </a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${buyer.lat},${buyer.lon}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-400 py-1.5 rounded-md text-xs font-medium transition-colors">
                    <Navigation className="w-3 h-3" /> {t('routeBtn') || 'Route'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
