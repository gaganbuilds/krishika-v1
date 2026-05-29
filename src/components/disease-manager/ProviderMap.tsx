'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import providerData from '../../data/providerData.json';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

// Fix Leaflet marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const ProviderMap: React.FC = () => {
  // Default to a central location (e.g., a farming district in North India)
  const defaultCenter: [number, number] = [28.7041, 77.1025];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-emerald-800/10 shadow-sm relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {providerData.map((provider) => (
          <Marker key={provider.id} position={[provider.lat, provider.lng]}>
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-emerald-950 text-sm mb-1">{provider.name}</h3>
                <p className="text-[10px] text-emerald-800/60 font-semibold mb-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {provider.address}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {provider.products.map(p => (
                    <span key={p} className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded font-bold">
                      {p}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <a 
                    href={`tel:${provider.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </a>
                  <a 
                    href={`https://wa.me/${provider.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-3 w-3" /> WhatsApp
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ProviderMap;
