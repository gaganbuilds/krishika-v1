export type SupportedCrop = 'Paddy' | 'Wheat' | 'Ragi' | 'Groundnut' | 'Sugarcane' | 'Maize' | 'Cotton' | 'Banana' | 'Watermelon' | 'Potato';

export interface IndustryMatch {
  name: string;
  type: string; // e.g., 'Biomass Plant', 'Paper Mill', 'Biofuel'
  matchScore: number; // 0-100
  processingReqs: string;
  expectedPricePerTon: number;
  relevance: string;
  useCase: string;
  acceptanceCriteria: string;
}

export interface CropResidueData {
  cropName: SupportedCrop;
  residueType: string;
  usabilityScore: number;
  qualityScore: number;
  marketabilityScore: number;
  industries: IndustryMatch[];
  alternativeUses: string[];
  co2ReductionPerTon: number; // kg CO2 avoided by not burning
  collectionCostPerTon: number;
  loadingCostPerTon: number;
  demandTrend: 'High' | 'Medium' | 'Low';
  imageFallback: string; // just in case
}

export const cropcycleData: Record<SupportedCrop, CropResidueData> = {
  Paddy: {
    cropName: 'Paddy',
    residueType: 'Paddy Straw / Stubble',
    usabilityScore: 85,
    qualityScore: 78,
    marketabilityScore: 90,
    industries: [
      { 
        name: 'Biofuel Units', type: 'Bio-Ethanol', matchScore: 95, processingReqs: 'Baling, Moisture < 15%', expectedPricePerTon: 2500,
        relevance: 'High cellulose content ideal for fermentation.', useCase: 'Conversion to 2G Bioethanol.', acceptanceCriteria: 'Moisture must be strictly below 15% to prevent fungal growth.'
      },
      { 
        name: 'Packaging Industry', type: 'Eco-Packaging', matchScore: 80, processingReqs: 'Cleaned, Dry', expectedPricePerTon: 3000,
        relevance: 'Strong fibers suitable for molded pulp.', useCase: 'Manufacturing biodegradable packaging boxes.', acceptanceCriteria: 'Free from soil and stones.'
      },
      { 
        name: 'Biomass Power Plants', type: 'Energy', matchScore: 90, processingReqs: 'Baling', expectedPricePerTon: 2000,
        relevance: 'Good calorific value for co-firing.', useCase: 'Direct burning for electricity generation.', acceptanceCriteria: 'Baled properly for transport efficiency.'
      }
    ],
    alternativeUses: ['Mushroom Cultivation', 'Livestock Feed', 'Mulching'],
    co2ReductionPerTon: 1460, // approx
    collectionCostPerTon: 800,
    loadingCostPerTon: 300,
    demandTrend: 'High',
    imageFallback: '🌾'
  },
  Wheat: {
    cropName: 'Wheat',
    residueType: 'Wheat Straw',
    usabilityScore: 90,
    qualityScore: 85,
    marketabilityScore: 95,
    industries: [
      { 
        name: 'Livestock Feed Plants', type: 'Animal Feed', matchScore: 98, processingReqs: 'Chaffed', expectedPricePerTon: 4000,
        relevance: 'High demand as dry fodder in dairy.', useCase: 'Mixed with concentrates for cattle feed.', acceptanceCriteria: 'Golden yellow color, no fungal contamination.'
      },
      { 
        name: 'Paper Mills', type: 'Paper', matchScore: 75, processingReqs: 'Baled, Dry', expectedPricePerTon: 3500,
        relevance: 'Good source of short fibers.', useCase: 'Pulping for craft paper production.', acceptanceCriteria: 'Low moisture and dust free.'
      }
    ],
    alternativeUses: ['Bedding for animals', 'Composting'],
    co2ReductionPerTon: 1300,
    collectionCostPerTon: 700,
    loadingCostPerTon: 250,
    demandTrend: 'High',
    imageFallback: '🌾'
  },
  Sugarcane: {
    cropName: 'Sugarcane',
    residueType: 'Bagasse & Trash',
    usabilityScore: 95,
    qualityScore: 90,
    marketabilityScore: 95,
    industries: [
      { 
        name: 'Paper Mills', type: 'Paper & Pulp', matchScore: 95, processingReqs: 'Baled', expectedPricePerTon: 2500,
        relevance: 'Excellent fibrous nature replaces wood pulp.', useCase: 'Production of writing and printing paper.', acceptanceCriteria: 'Separated from mud and pith.'
      },
      { 
        name: 'Biomass Plants', type: 'Energy', matchScore: 90, processingReqs: 'Direct', expectedPricePerTon: 1800,
        relevance: 'High energy density.', useCase: 'Cogeneration of power and steam.', acceptanceCriteria: 'Moisture below 50%.'
      }
    ],
    alternativeUses: ['Composting', 'Biochar'],
    co2ReductionPerTon: 1200,
    collectionCostPerTon: 500,
    loadingCostPerTon: 200,
    demandTrend: 'High',
    imageFallback: '🎋'
  },
  Cotton: {
    cropName: 'Cotton',
    residueType: 'Cotton Stalk',
    usabilityScore: 80,
    qualityScore: 75,
    marketabilityScore: 85,
    industries: [
      { 
        name: 'Biomass Industry', type: 'Pellets/Briquettes', matchScore: 95, processingReqs: 'Chipped/Shredded', expectedPricePerTon: 2200,
        relevance: 'Woody structure with high calorific value.', useCase: 'Manufacturing industrial briquettes.', acceptanceCriteria: 'Must be shredded at farm level.'
      },
      { 
        name: 'Board Manufacturing', type: 'Particle Board', matchScore: 80, processingReqs: 'Dried, Clean', expectedPricePerTon: 2800,
        relevance: 'Strong woody stems.', useCase: 'Core material for particle boards.', acceptanceCriteria: 'Free from roots and soil.'
      }
    ],
    alternativeUses: ['Biochar', 'Composting'],
    co2ReductionPerTon: 1500,
    collectionCostPerTon: 900,
    loadingCostPerTon: 350,
    demandTrend: 'Medium',
    imageFallback: '☁️'
  },
  Groundnut: {
    cropName: 'Groundnut',
    residueType: 'Groundnut Shells & Haulms',
    usabilityScore: 90,
    qualityScore: 85,
    marketabilityScore: 90,
    industries: [
      { 
        name: 'Fuel Industry', type: 'Briquettes', matchScore: 95, processingReqs: 'Direct', expectedPricePerTon: 3000,
        relevance: 'Excellent burning properties.', useCase: 'Direct fuel in boilers or briquetting.', acceptanceCriteria: 'Dry shells only.'
      },
      { 
        name: 'Feed Industry', type: 'Animal Feed', matchScore: 85, processingReqs: 'Cleaned', expectedPricePerTon: 4500,
        relevance: 'Haulms are protein-rich.', useCase: 'Nutritious fodder for ruminants.', acceptanceCriteria: 'Free from aflatoxin contamination.'
      }
    ],
    alternativeUses: ['Composting', 'Mulch'],
    co2ReductionPerTon: 1100,
    collectionCostPerTon: 400,
    loadingCostPerTon: 200,
    demandTrend: 'High',
    imageFallback: '🥜'
  },
  Maize: {
    cropName: 'Maize',
    residueType: 'Maize Stover & Cobs',
    usabilityScore: 85,
    qualityScore: 80,
    marketabilityScore: 85,
    industries: [
      { 
        name: 'Biomass Plants', type: 'Energy', matchScore: 90, processingReqs: 'Dried, Baled', expectedPricePerTon: 1800,
        relevance: 'High volume availability.', useCase: 'Cofiring in power plants.', acceptanceCriteria: 'Moisture < 20%.'
      },
      { 
        name: 'Bio-chemicals', type: 'Furfural Production', matchScore: 80, processingReqs: 'Cobs only', expectedPricePerTon: 3200,
        relevance: 'Cobs are rich in hemicellulose.', useCase: 'Extraction of furfural for solvents.', acceptanceCriteria: 'Only clean cobs, no stover mixed.'
      }
    ],
    alternativeUses: ['Silage', 'Biochar'],
    co2ReductionPerTon: 1350,
    collectionCostPerTon: 750,
    loadingCostPerTon: 300,
    demandTrend: 'Medium',
    imageFallback: '🌽'
  },
  Ragi: {
    cropName: 'Ragi',
    residueType: 'Ragi Straw',
    usabilityScore: 80,
    qualityScore: 85,
    marketabilityScore: 80,
    industries: [
      { 
        name: 'Livestock Feed', type: 'Fodder', matchScore: 95, processingReqs: 'Dried', expectedPricePerTon: 3500,
        relevance: 'Highly preferred fodder in drylands.', useCase: 'Direct feeding to cattle.', acceptanceCriteria: 'Well-dried, no fungal spots.'
      },
      { 
        name: 'Biomass Plants', type: 'Energy', matchScore: 70, processingReqs: 'Baled', expectedPricePerTon: 1500,
        relevance: 'Can be co-fired if excess is available.', useCase: 'Electricity generation.', acceptanceCriteria: 'Baled without stones.'
      }
    ],
    alternativeUses: ['Roof Thatching', 'Compost'],
    co2ReductionPerTon: 900,
    collectionCostPerTon: 600,
    loadingCostPerTon: 200,
    demandTrend: 'Medium',
    imageFallback: '🌾'
  },
  Banana: {
    cropName: 'Banana',
    residueType: 'Pseudostem & Leaves',
    usabilityScore: 75,
    qualityScore: 70,
    marketabilityScore: 80,
    industries: [
      { 
        name: 'Textile Industry', type: 'Banana Fiber', matchScore: 95, processingReqs: 'Fresh stems', expectedPricePerTon: 5000,
        relevance: 'Strong natural fibers.', useCase: 'Woven into eco-friendly textiles and bags.', acceptanceCriteria: 'Fresh stems required within 48h of harvest.'
      },
      { 
        name: 'Handicrafts & Paper', type: 'Eco-products', matchScore: 85, processingReqs: 'Extracted fiber', expectedPricePerTon: 6000,
        relevance: 'Excellent for handmade paper.', useCase: 'Artisan paper and craft items.', acceptanceCriteria: 'Semi-processed fibers.'
      }
    ],
    alternativeUses: ['Vermicompost', 'Liquid Fertilizer'],
    co2ReductionPerTon: 600,
    collectionCostPerTon: 1000,
    loadingCostPerTon: 400,
    demandTrend: 'High',
    imageFallback: '🍌'
  },
  Watermelon: {
    cropName: 'Watermelon',
    residueType: 'Vines & Rinds',
    usabilityScore: 60,
    qualityScore: 50,
    marketabilityScore: 50,
    industries: [
      { 
        name: 'Compost Facilities', type: 'Organic Manure', matchScore: 90, processingReqs: 'Chopped', expectedPricePerTon: 800,
        relevance: 'High moisture and nitrogen content.', useCase: 'Accelerates composting process.', acceptanceCriteria: 'Delivered fresh.'
      }
    ],
    alternativeUses: ['Livestock Feed (Rinds)', 'In-situ Incorporation'],
    co2ReductionPerTon: 300,
    collectionCostPerTon: 800,
    loadingCostPerTon: 300,
    demandTrend: 'Low',
    imageFallback: '🍉'
  },
  Potato: {
    cropName: 'Potato',
    residueType: 'Vines & Peels',
    usabilityScore: 65,
    qualityScore: 60,
    marketabilityScore: 60,
    industries: [
      { 
        name: 'Biogas Plants', type: 'Anaerobic Digestion', matchScore: 90, processingReqs: 'Fresh', expectedPricePerTon: 1200,
        relevance: 'Easily digestible biomass.', useCase: 'Methane production.', acceptanceCriteria: 'Fresh, not dried.'
      },
      { 
        name: 'Feed Industry', type: 'Animal Feed', matchScore: 75, processingReqs: 'Dried Peels', expectedPricePerTon: 1500,
        relevance: 'Good source of carbohydrates.', useCase: 'Mixed animal feed.', acceptanceCriteria: 'Properly dried to avoid rotting.'
      }
    ],
    alternativeUses: ['Compost'],
    co2ReductionPerTon: 400,
    collectionCostPerTon: 700,
    loadingCostPerTon: 250,
    demandTrend: 'Low',
    imageFallback: '🥔'
  }
};
