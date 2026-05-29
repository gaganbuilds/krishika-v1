'use client';

import React from 'react';
import { Sprout, Leaf, HeartHandshake, Eye, Sparkles } from 'lucide-react';

interface AlternativesSectionProps {
  t: (key: string) => string;
  activeLang: string;
  report: {
    productName: string;
    category: string;
    alternatives?: {
      biofertilizer: string;
      compost: string;
      pest: string;
    };
  };
}

export const AlternativesSection: React.FC<AlternativesSectionProps> = ({ t, activeLang, report }) => {
  const { productName, category, alternatives } = report;
  const isPesticide = category === 'Pesticide';

  // Fallbacks if not provided in the report
  const alts = alternatives || {
    biofertilizer: isPesticide
      ? 'Trichoderma viride or Pseudomonas fluorescens culture for biological pathogen suppression.'
      : 'Azotobacter & Phosphate Solubilizing Bacteria (PSB) liquid culture consortia.',
    compost: isPesticide
      ? 'Neem Cake powder or Castor cake mixed in soil bed at 150 kg/acre to prevent soil-borne grubs.'
      : 'Vermicompost or Farm Yard Manure (FYM) enriched with bio-agents at 2.5 tons/acre.',
    pest: isPesticide
      ? 'Neem Oil spray (10,000 PPM) at 3ml/liter + soap solution, or ginger-garlic-chili botanical extract.'
      : 'Green manure crops (Sunnhemp / Dhaincha) incorporated into soil 45 days before sowing.'
  };

  // Detailed info card specs
  const applicationMethods = {
    biofertilizer: {
      'en-IN': 'Seed treatment (mix 10ml/kg seed) or soil drenching (mix 1 liter in 200 liters of water per acre).',
      'hi-IN': 'बीज उपचार (10 मिली/किग्रा बीज मिलाएं) या मिट्टी में ड्रेंचिंग (1 लीटर पानी को 200 लीटर पानी में प्रति एकड़ मिलाएं)।',
      'kn-IN': 'ಬೀಜೋಪಚಾರ (10ml/ಕೆಜಿ ಬೀಜಕ್ಕೆ ಮಿಶ್ರಣ ಮಾಡಿ) ಅಥವಾ ಮಣ್ಣಿಗೆ ಉಣಿಸುವುದು (ಎಕರೆಗೆ 1 ಲೀಟರ್ ಜೈವಿಕ ದ್ರಾವಣವನ್ನು 200 ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ).'
    },
    compost: {
      'en-IN': 'Incorporate fully during land preparation or top-dress near the root zone during weeding.',
      'hi-IN': 'खेत की तैयारी के दौरान पूरी तरह मिलाएं या निराई के दौरान जड़ों के पास टॉप-ड्रेसिंग करें।',
      'kn-IN': 'ಭೂಮಿ ಸಿದ್ಧತೆಯ ಸಮಯದಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಮಿಶ್ರಣ ಮಾಡಿ ಅಥವಾ ಕಳೆ ತೆಗೆಯುವಾಗ ಬೇರಿನ ಹತ್ತಿರ ಉಣಿಸಿ.'
    },
    pest: {
      'en-IN': 'Foliar spray during early morning or late evening hours. Spray on both upper and lower leaf surfaces.',
      'hi-IN': 'सुबह जल्दी या देर शाम को पत्तों पर छिड़काव करें। पत्तियों की ऊपरी और निचली दोनों सतहों पर स्प्रे करें।',
      'kn-IN': 'ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ. ಎಲೆಯ ಮೇಲ್ಭಾಗ ಮತ್ತು ಕೆಳಭಾಗ ಎರಡಕ್ಕೂ ತಲುಪುವಂತೆ ಸಿಂಪಡಿಸಿ.'
    }
  };

  const activeLangKey = activeLang === 'hi-IN' || activeLang === 'kn-IN' ? activeLang : 'en-IN';

  const alternativeCards = [
    {
      type: 'biofertilizer',
      title: t('altBiofertilizer'),
      desc: alts.biofertilizer,
      icon: <Sprout className="h-5 w-5 text-emerald-600" />,
      apply: applicationMethods.biofertilizer[activeLangKey],
      badge: isPesticide ? 'Bio-Control Agent' : 'Microbial Fixer',
      color: 'border-emerald-100 bg-emerald-50/20'
    },
    {
      type: 'compost',
      title: t('altCompost'),
      desc: alts.compost,
      icon: <Leaf className="h-5 w-5 text-amber-600" />,
      apply: applicationMethods.compost[activeLangKey],
      badge: 'Soil Conditioner',
      color: 'border-amber-100 bg-amber-50/20'
    },
    {
      type: 'pest',
      title: t('altPest'),
      desc: alts.pest,
      icon: <HeartHandshake className="h-5 w-5 text-teal-600" />,
      apply: applicationMethods.pest[activeLangKey],
      badge: isPesticide ? 'Botanical Repellent' : 'Organic Manure',
      color: 'border-teal-100 bg-teal-50/20'
    }
  ];

  return (
    <div className="bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm">
      <div>
        <h3 className="font-extrabold text-emerald-950 text-lg flex items-center gap-2">
          <Sparkles className="h-5.5 w-5.5 text-emerald-600" />
          {t('altTitle')}
        </h3>
        <p className="text-xs text-emerald-800/60 font-semibold mt-1 leading-relaxed">
          {t('altDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {alternativeCards.map((card) => (
          <div 
            key={card.type} 
            className={`border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all duration-300 ${card.color}`}
          >
            <div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                  {card.badge}
                </span>
                <div className="p-1.5 bg-white rounded-lg border border-emerald-800/5 shadow-sm shrink-0">
                  {card.icon}
                </div>
              </div>

              <h4 className="text-xs font-black text-emerald-950 mt-4 leading-tight">
                {card.title}
              </h4>
              
              <p className="text-xs leading-relaxed text-emerald-900/80 font-medium mt-2">
                {card.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-800/5">
              <h5 className="text-[9px] font-black text-emerald-950/70 uppercase tracking-widest mb-1">
                {t('applyMethod')}
              </h5>
              <p className="text-[10px] leading-relaxed text-stone-500 font-semibold">
                {card.apply}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
