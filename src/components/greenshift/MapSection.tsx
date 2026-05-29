'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, MessageSquare, Navigation, AlertCircle, RefreshCw, Star } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  distance: string;
  rating: number;
  phone: string;
  whatsapp: string;
  products: string[];
  address: string;
  lat: number;
  lng: number;
}

interface MapSectionProps {
  t: (key: string) => string;
  activeLang: string;
  farmerProfile: any;
}

export const MapSection: React.FC<MapSectionProps> = ({ t, activeLang, farmerProfile }) => {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.5218, 76.8973]); // Default Mandya, Karnataka
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);

  // Get active location parameters based on profile
  const village = farmerProfile?.village || 'Khanna';
  const district = farmerProfile?.district || 'Ludhiana';
  const state = farmerProfile?.state || 'Punjab';

  // Determine regional coordinates and mock data on mount/profile change
  useEffect(() => {
    let lat = 12.5218; // Default Mandya
    let lng = 76.8973;

    const lowerState = state.toLowerCase();
    const lowerDistrict = district.toLowerCase();

    if (lowerState.includes('karnataka') || activeLang === 'kn-IN') {
      if (lowerDistrict.includes('mandya')) {
        lat = 12.5218;
        lng = 76.8973;
      } else if (lowerDistrict.includes('mysuru') || lowerDistrict.includes('mysore')) {
        lat = 12.2958;
        lng = 76.6394;
      } else if (lowerDistrict.includes('belagavi') || lowerDistrict.includes('belgaum')) {
        lat = 15.8497;
        lng = 74.4977;
      } else if (lowerDistrict.includes('dharwad') || lowerDistrict.includes('hubli')) {
        lat = 15.4589;
        lng = 75.0078;
      } else {
        // Bangalore default
        lat = 12.9716;
        lng = 77.5946;
      }
    } else if (lowerState.includes('punjab')) {
      if (lowerDistrict.includes('ludhiana')) {
        lat = 30.9010;
        lng = 75.8573;
      } else if (lowerDistrict.includes('amritsar')) {
        lat = 31.6340;
        lng = 74.8723;
      } else if (lowerDistrict.includes('patiala')) {
        lat = 30.3398;
        lng = 76.3869;
      } else {
        lat = 30.7333;
        lng = 76.7794; // Chandigarh
      }
    } else if (lowerState.includes('haryana')) {
      lat = 29.9695;
      lng = 76.8783; // Kurukshetra
    } else if (lowerState.includes('uttar prandesh') || lowerState.includes('up') || lowerState.includes('uttar')) {
      lat = 26.8467;
      lng = 80.9462; // Lucknow
    } else if (lowerState.includes('indore') || lowerState.includes('madhya') || lowerState.includes('mp')) {
      lat = 22.7196;
      lng = 75.8577; // Indore
    }

    setMapCenter([lat, lng]);

    // Generate dynamic suppliers localized to their district and village
    const mockSuppliers: Supplier[] = [
      {
        id: 'sup-1',
        name: `${district} Bio-Inputs & Vermicompost Co-op`,
        distance: '2.4 km',
        rating: 4.8,
        phone: '+919876543210',
        whatsapp: '919876543210',
        products: ['Vermicompost', 'Neem Cake Powder', 'Azotobacter Culture'],
        address: `Shop No. 12, APMC Market Yard, near Main Road, ${district}, ${state}`,
        lat: lat + 0.008,
        lng: lng - 0.005
      },
      {
        id: 'sup-2',
        name: `${village} Organic Farmers Resource Center`,
        distance: '4.8 km',
        rating: 4.9,
        phone: '+919988776655',
        whatsapp: '919988776655',
        products: ['Bio-NPK Liquid Consortia', 'Panchagavya', 'Trichoderma Viride'],
        address: `Opposite Cooperative Bank, Village ${village}, ${district} District, ${state}`,
        lat: lat - 0.006,
        lng: lng + 0.012
      },
      {
        id: 'sup-3',
        name: `Prithvi Eco-Farming Solutions`,
        distance: '7.1 km',
        rating: 4.5,
        phone: '+918877665544',
        whatsapp: '918877665544',
        products: ['Seaweed Extract', 'Organic Potash', 'Pheromone Traps'],
        address: `104, Industrial Area Phase 1, City Center, ${district}, ${state}`,
        lat: lat + 0.012,
        lng: lng + 0.004
      }
    ];

    setSuppliers(mockSuppliers);
  }, [village, district, state, activeLang]);

  // Load Map scripts
  useEffect(() => {
    const gmapsKey = localStorage.getItem('raithabhandhu_gmaps_key');
    
    if (gmapsKey) {
      // Load Google Maps API
      if ((window as any).google && (window as any).google.maps) {
        setGoogleMapsLoaded(true);
        return;
      }

      const scriptId = 'google-maps-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${gmapsKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMapsLoaded(true);
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', () => setGoogleMapsLoaded(true));
      }
    } else {
      // Fallback: Load Leaflet.js
      const leafletCssId = 'leaflet-css';
      const leafletJsId = 'leaflet-js';

      if (!document.getElementById(leafletCssId)) {
        const link = document.createElement('link');
        link.id = leafletCssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById(leafletJsId)) {
        const script = document.createElement('script');
        script.id = leafletJsId;
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setLeafletLoaded(true);
        document.head.appendChild(script);
      } else {
        // If script element exists, verify if loaded, or set load handler
        if ((window as any).L) {
          setLeafletLoaded(true);
        } else {
          const scriptEl = document.getElementById(leafletJsId);
          scriptEl?.addEventListener('load', () => setLeafletLoaded(true));
        }
      }
    }

    return () => {
      // Cleanup leaflet map instance on unmount
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
      googleMapInstanceRef.current = null;
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!leafletLoaded || googleMapsLoaded || !mapRef.current || suppliers.length === 0) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy existing instance to avoid duplicate containers
    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.remove();
      leafletMarkersRef.current = [];
    }

    // Initialize Map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView(mapCenter, 12);
    
    leafletMapInstanceRef.current = map;

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom Icon Definition
    const createCustomIcon = (isSelected: boolean) => {
      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute h-9 w-9 rounded-full ${isSelected ? 'bg-emerald-500/30' : 'bg-emerald-600/20'} animate-ping duration-1000" />
            <div class="relative h-7 w-7 rounded-full ${isSelected ? 'bg-emerald-500 scale-110' : 'bg-emerald-700'} border-2 border-white shadow-md flex items-center justify-center text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout"><path d="M7 20h10"/><path d="M10 20h4"/><path d="M12 20v-8"/><path d="M12 12c-2-2.67-4-3-6-3a6 6 0 0 0-4 4c0 3.33 3 6 6 6 2 0 3.33-1 4-2"/><path d="M12 12c2-2.67 4-3 6-3a6 6 0 0 1 4 4c0 3.33-3 6-6 6-2 0-3.33-1-4-2"/></svg>
            </div>
          </div>
        `,
        className: 'custom-leaflet-icon-wrapper',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
    };

    // Add User Location Marker
    L.marker(mapCenter, {
      icon: L.divIcon({
        html: `
          <div class="h-6 w-6 bg-blue-500/20 rounded-full border border-blue-500 flex items-center justify-center shadow-inner">
            <div class="h-3 w-3 bg-blue-600 rounded-full border border-white animate-pulse" />
          </div>
        `,
        className: 'user-location-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    })
    .addTo(map)
    .bindPopup(`<strong class="text-xs font-bold text-emerald-950">Your Farm (${village})</strong>`)
    .openPopup();

    // Add Supplier Markers
    suppliers.forEach((sup) => {
      const isSelected = selectedSupplier === sup.id;
      const marker = L.marker([sup.lat, sup.lng], {
        icon: createCustomIcon(isSelected)
      })
      .addTo(map)
      .on('click', () => {
        setSelectedSupplier(sup.id);
      });

      // Bind elegant popup HTML
      marker.bindPopup(`
        <div class="p-1 max-w-sm space-y-1">
          <strong class="text-xs font-black text-emerald-950 block">${sup.name}</strong>
          <span class="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">${sup.distance} away</span>
          <p class="text-[10px] text-stone-500 font-medium leading-tight pt-1">${sup.address}</p>
        </div>
      `);

      leafletMarkersRef.current.push({ id: sup.id, marker });
    });

  }, [leafletLoaded, googleMapsLoaded, mapCenter, suppliers, selectedSupplier]);

  // Handle zooming / selection animation on card click
  const handleSupplierSelect = (sup: Supplier) => {
    setSelectedSupplier(sup.id);
    setMapCenter([sup.lat, sup.lng]);

    if (googleMapsLoaded && googleMapInstanceRef.current) {
      googleMapInstanceRef.current.panTo({ lat: sup.lat, lng: sup.lng });
      googleMapInstanceRef.current.setZoom(14);
    } else if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([sup.lat, sup.lng], 14, { animate: true, duration: 1 });
      const targetMarker = leafletMarkersRef.current.find(m => m.id === sup.id);
      if (targetMarker) {
        targetMarker.marker.openPopup();
      }
    }
  };

  // Pre-filled WhatsApp Link Generator
  const getWhatsAppLink = (sup: Supplier) => {
    const defaultProduct = sup.products[0] || 'Organic Fertilizers';
    let text = `Hello, I am a farmer registered on Raithabhandhu. I saw your organic inputs on the GreenShift directory. Do you have "${defaultProduct}" in stock?`;
    
    if (activeLang === 'hi-IN') {
      text = `नमस्ते, मैं रायथुबंधु ऐप पर पंजीकृत एक किसान हूँ। मैंने ग्रीनशिफ्ट डायरेक्टरी में आपके जैविक इनपुट देखे। क्या आपके पास "${defaultProduct}" स्टॉक में उपलब्ध है?`;
    } else if (activeLang === 'kn-IN') {
      text = `ನಮಸ್ಕಾರ, ನಾನು ರೈತಬಂಧು ಆ್ಯಪ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತ ರೈತ. ಗ್ರೀನ್‌ಶಿಫ್ಟ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸಾವಯವ ಗೊಬ್ಬರಗಳ ವಿವರ ನೋಡಿದೆ. ನಿಮ್ಮಲ್ಲಿ "${defaultProduct}" ದಾಸ್ತಾನು ಇದೆಯೇ?`;
    }

    return `https://wa.me/${sup.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const getDirectionsLink = (sup: Supplier) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${sup.lat},${sup.lng}`;
  };

  return (
    <div className="bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm">
      
      {/* Header */}
      <div className="border-b border-emerald-800/5 pb-4.5">
        <h3 className="font-extrabold text-emerald-950 text-lg flex items-center gap-2">
          <MapPin className="h-5.5 w-5.5 text-emerald-600 shrink-0" />
          {t('mapTitle')}
        </h3>
        <p className="text-xs text-emerald-800/60 font-semibold mt-1 leading-relaxed max-w-3xl">
          {t('mapDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Suppliers List */}
        <div className="lg:col-span-5 space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {suppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-stone-400">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
              <p className="text-xs font-bold">Locating nearby centers...</p>
            </div>
          ) : (
            suppliers.map((sup) => {
              const isSelected = selectedSupplier === sup.id;
              return (
                <div 
                  key={sup.id}
                  onClick={() => handleSupplierSelect(sup)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50/40 border-emerald-600 shadow-md ring-2 ring-emerald-500/15' 
                      : 'bg-stone-50/30 border-emerald-800/5 hover:bg-emerald-50/10 hover:border-emerald-600/30'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-black text-emerald-950 leading-tight">
                        {sup.name}
                      </h4>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                        {sup.distance}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-amber-500 font-bold">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="ml-1 mt-0.5">{sup.rating}</span>
                      </div>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-400 font-semibold truncate max-w-xs">{sup.address}</span>
                    </div>
                  </div>

                  {/* Available Products badges */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {sup.products.map((p, idx) => (
                      <span key={idx} className="text-[9px] font-bold text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded-full">
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="grid grid-cols-3 gap-2 border-t border-emerald-800/5 pt-3">
                    <a 
                      href={`tel:${sup.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 py-2 border border-emerald-700/15 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 text-emerald-900 font-bold text-[10px] rounded-xl transition-colors cursor-pointer text-center"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{t('callBtn')}</span>
                    </a>
                    
                    <a 
                      href={getWhatsAppLink(sup)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 py-2 border border-emerald-700/15 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 text-emerald-900 font-bold text-[10px] rounded-xl transition-colors cursor-pointer text-center"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    
                    <a 
                      href={getDirectionsLink(sup)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl transition-colors cursor-pointer text-center"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{t('directionsBtn')}</span>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Map Rendering Container */}
        <div className="lg:col-span-7 bg-stone-50 border border-emerald-800/10 rounded-2xl h-[420px] overflow-hidden relative shadow-inner">
          <div ref={mapRef} className="w-full h-full z-10" />

          {/* Map Controls / Labels */}
          {!googleMapsLoaded && !leafletLoaded && (
            <div className="absolute inset-0 bg-stone-50/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-6 text-center">
              <RefreshCw className="h-7 w-7 animate-spin text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-emerald-950">Initializing interactive green directory map...</p>
            </div>
          )}

          {/* Notice box overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 border border-emerald-800/10 p-2.5 rounded-xl shadow-md backdrop-blur-sm z-20 max-w-xs text-[9px] leading-snug font-semibold text-emerald-900 pointer-events-none">
            <span className="font-bold flex items-center gap-1 mb-0.5">
              <AlertCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Active Target Zone: {district}
            </span>
            {t('noProviders')}
          </div>
        </div>

      </div>
    </div>
  );
};
