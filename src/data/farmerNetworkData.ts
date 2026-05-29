export interface NetworkFarmer {
  id: string;
  name: string;
  district: string;
  state: string;
  crops: string[];
  specialization: string;
  lat: number;
  lng: number;
  status: 'active' | 'offline';
  lastActive: string;
}

export const mockFarmerNetwork: NetworkFarmer[] = [
  {
    id: 'f1',
    name: 'Ramesh Gowda',
    district: 'Mandya',
    state: 'Karnataka',
    crops: ['Sugarcane', 'Paddy'],
    specialization: 'Organic Farming',
    lat: 12.5239,
    lng: 76.8943,
    status: 'active',
    lastActive: 'Just now'
  },
  {
    id: 'f2',
    name: 'Suresh Patil',
    district: 'Belagavi',
    state: 'Karnataka',
    crops: ['Sugarcane', 'Cotton'],
    specialization: 'Drip Irrigation',
    lat: 15.8497,
    lng: 74.4977,
    status: 'active',
    lastActive: '5m ago'
  },
  {
    id: 'f3',
    name: 'Anand Kumar',
    district: 'Mysuru',
    state: 'Karnataka',
    crops: ['Ragi', 'Vegetables'],
    specialization: 'Mixed Cropping',
    lat: 12.2958,
    lng: 76.6394,
    status: 'offline',
    lastActive: '2h ago'
  },
  {
    id: 'f4',
    name: 'Manjula H',
    district: 'Tumakuru',
    state: 'Karnataka',
    crops: ['Groundnut', 'Ragi'],
    specialization: 'Dryland Farming',
    lat: 13.3392,
    lng: 77.1016,
    status: 'active',
    lastActive: '12m ago'
  },
  {
    id: 'f5',
    name: 'Basavaraj S',
    district: 'Dharwad',
    state: 'Karnataka',
    crops: ['Wheat', 'Sorghum'],
    specialization: 'Seed Production',
    lat: 15.4589,
    lng: 75.0078,
    status: 'active',
    lastActive: '1m ago'
  },
  {
    id: 'f6',
    name: 'Kiran Reddy',
    district: 'Kolar',
    state: 'Karnataka',
    crops: ['Tomato', 'Potato'],
    specialization: 'Greenhouse Farming',
    lat: 13.1367,
    lng: 78.1292,
    status: 'offline',
    lastActive: '1d ago'
  },
  {
    id: 'f7',
    name: 'Shivanna',
    district: 'Hassan',
    state: 'Karnataka',
    crops: ['Potato', 'Maize'],
    specialization: 'Conventional',
    lat: 13.0033,
    lng: 76.1004,
    status: 'active',
    lastActive: 'Just now'
  }
];

export const getFarmerNetworkStats = () => {
  const total = mockFarmerNetwork.length;
  const active = mockFarmerNetwork.filter(f => f.status === 'active').length;
  const districts = new Set(mockFarmerNetwork.map(f => f.district)).size;
  return { total, active, districts };
};
