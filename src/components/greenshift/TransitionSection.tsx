'use client';

import React, { useState } from 'react';
import { Calendar, Sprout, ShieldAlert, AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

interface TransitionSectionProps {
  t: (key: string) => string;
  activeLang: string;
  report: {
    productName: string;
    category: string;
    transitionPlan?: {
      season1: string;
      season2: string;
      season3: string;
    };
  };
}

export const TransitionSection: React.FC<TransitionSectionProps> = ({ t, activeLang, report }) => {
  const [selectedSeason, setSelectedSeason] = useState<'season1' | 'season2' | 'season3'>('season1');

  const { productName, category, transitionPlan } = report;
  const isPesticide = category === 'Pesticide';

  // Fallbacks if not provided in the report
  const plan = transitionPlan || {
    season1: isPesticide 
      ? '80% Chemical Spray + 20% Neem oil extract spray during early vegetative stage.' 
      : '80% Chemical NPK + 20% Bio-fertilizers & Vermicompost top-dress.',
    season2: isPesticide 
      ? '60% Chemical Spray + 40% Neem oil + garlic-chili extract sprays.' 
      : '60% Chemical NPK + 40% Bio-fertilizers & Vermicompost.',
    season3: isPesticide 
      ? '40% Chemical Spray + 60% Bio-pesticides (Bacillus thuringiensis) & mechanical traps.' 
      : '40% Chemical NPK + 60% Bio-fertilizers & Vermicompost.'
  };

  const seasonsData = {
    season1: {
      ratio: { chemical: 80, organic: 20 },
      planText: plan.season1,
      guidance: {
        'en-IN': isPesticide
          ? 'Apply chemical spray only when pest threshold is crossed. Begin spraying neem oil extract at 3% concentration during early stage.'
          : 'Apply microbial culture (Azotobacter/PSB) to soil 7 days before chemical application. Avoid mixing chemical fertilizer and bio-fertilizer directly.',
        'hi-IN': isPesticide
          ? 'केवल तभी रासायनिक स्प्रे करें जब कीट दहलीज पार हो जाए। शुरुआती चरण में 3% सांद्रता पर नीम के तेल के अर्क का छिड़काव शुरू करें।'
          : 'रासायनिक उपयोग से 7 दिन पहले मिट्टी में सूक्ष्मजीव संस्कृति (एज़ोटोबैक्टर/पीएसबी) डालें। रासायनिक और जैविक खाद को सीधे मिलाने से बचें।',
        'kn-IN': isPesticide
          ? 'ಕೀಟಗಳ ಸಂಖ್ಯೆ ಮಿತಿ ಮೀರಿದಾಗ ಮಾತ್ರ ರಾಸಾಯನಿಕ ಸಿಂಪಡಿಸಿ. ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ 3% ಸಾಂದ್ರತೆಯ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಲು ಪ್ರಾರಂಭಿಸಿ.'
          : 'ರಾಸಾಯನಿಕ ಗೊಬ್ಬರ ಬಳಸುವ 7 ದಿನಗಳ ಮೊದಲು ಜೈವಿಕ ಗೊಬ್ಬರವನ್ನು ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ. ರಾಸಾಯನಿಕ ಮತ್ತು ಜೈವಿಕ ಗೊಬ್ಬರವನ್ನು ನೇರವಾಗಿ ಬೆರೆಸಬೇಡಿ.'
      },
      precautions: {
        'en-IN': isPesticide
          ? 'Spray neem oil in late evenings to avoid burning tender leaves. Monitor pest population every 3 days.'
          : 'Keep a gap of at least 10 days between bio-fertilizer application and chemical pesticide sprays.',
        'hi-IN': isPesticide
          ? 'कोमल पत्तियों को जलने से बचाने के लिए देर शाम को नीम के तेल का छिड़काव करें। हर 3 दिन में कीटों की निगरानी करें।'
          : 'जैविक खाद और रासायनिक कीटनाशक के छिड़काव के बीच कम से कम 10 दिनों का अंतर रखें।',
        'kn-IN': isPesticide
          ? 'ಎಳೆಯ ಎಲೆಗಳು ಸುಡುವುದನ್ನು ತಪ್ಪಿಸಲು ಸಂಜೆ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ. ಪ್ರತಿ 3 ದಿನಗಳಿಗೊಮ್ಮೆ ಕೀಟಗಳ ಪ್ರಮಾಣ ಪರಿಶೀಲಿಸಿ.'
          : 'ಜೈವಿಕ ಗೊಬ್ಬರ ಮತ್ತು ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕಗಳ ನಡುವೆ ಕನಿಷ್ಠ 10 ದಿನಗಳ ಅಂತರವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.'
      },
      risk: {
        'en-IN': isPesticide
          ? 'If infestation exceeds economic threshold (ETL) by 15%, apply a selective chemical pesticide target rescue spray.'
          : 'Soil organic carbon might be low. Add farmyard manure to provide carbon support for microbes.',
        'hi-IN': isPesticide
          ? 'यदि कीट का प्रकोप आर्थिक सीमा (ETL) से 15% अधिक हो जाता है, तो रासायनिक कीटनाशक का चयनात्मक छिड़काव करें।'
          : 'मिट्टी में कार्बन कम हो सकता है। रोगाणुओं के विकास के लिए गोबर की खाद या कम्पोस्ट अवश्य मिलाएं।',
        'kn-IN': isPesticide
          ? 'ಒಂದು ವೇಳೆ ಕೀಟಗಳ ಕಾಟ 15% ಹೆಚ್ಚಾದರೆ, ತಕ್ಷಣವೇ ನಿಯಂತ್ರಿಸಲು ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ.'
          : 'ಮಣ್ಣಿನಲ್ಲಿ ಇಂಗಾಲ ಕಡಿಮೆ ಇರಬಹುದು. ಸೂಕ್ಷ್ಮಜೀವಿಗಳಿಗೆ ಇಂಗಾಲದ ಪೋಷಣೆ ನೀಡಲು ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರವನ್ನು ಬಳಸಿ.'
      },
      benefits: {
        'en-IN': isPesticide
          ? 'Reduces initial chemical residue on crops. Useful beneficial predators begin to survive in the field.'
          : 'Initial soil biological activation. 5-10% improvement in moisture retention observed.',
        'hi-IN': isPesticide
          ? 'फसलों पर शुरुआती रासायनिक अवशेषों को कम करता है। खेत में मित्र कीट जीवित रहने लगते हैं।'
          : 'मिट्टी के जैविक तत्वों की शुरुआती सक्रियता। नमी बनाए रखने में 5-10% का सुधार देखा गया।',
        'kn-IN': isPesticide
          ? 'ಬೆಳೆಗಳ ಮೇಲಿನ ಆರಂಭಿಕ ರಾಸಾಯನಿಕ ಶೇಷಗಳನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ. ಜಮೀನಿನಲ್ಲಿ ಮಿತ್ರ ಕೀಟಗಳು ಬದುಕುಳಿಯಲು ಪ್ರಾರಂಭಿಸುತ್ತವೆ.'
          : 'ಮಣ್ಣಿನ ಜೈವಿಕ ಕ್ರಿಯೆಗಳು ಆರಂಭಗೊಳ್ಳುತ್ತವೆ. ಮಣ್ಣಿನಲ್ಲಿ ಶೇ 5-10 ರಷ್ಟು ತೇವಾಂಶ ಸುಧಾರಿಸುತ್ತದೆ.'
      }
    },
    season2: {
      ratio: { chemical: 60, organic: 40 },
      planText: plan.season2,
      guidance: {
        'en-IN': isPesticide
          ? 'Use sticky yellow cards (10 per acre) for monitoring. Spray homemade ginger-garlic-chili extract to repel pests.'
          : 'Increase organic compost volume. Inoculate compost heap with Trichoderma viride to prevent root rot diseases.',
        'hi-IN': isPesticide
          ? 'निगरानी के लिए चिपचिपे पीले कार्ड (10 प्रति एकड़) लगाएं। कीटों को भगाने के लिए अदरक-लहसुन-मिर्च का काढ़ा छिड़कें।'
          : 'जैविक कम्पोस्ट की मात्रा बढ़ाएं। जड़ सड़न रोगों से बचाव के लिए कम्पोस्ट में ट्राइकोडर्मा मिलाएं।',
        'kn-IN': isPesticide
          ? 'ಕೀಟಗಳ ವೀಕ್ಷಣೆಗೆ ಹಳದಿ ಅಂಟು ಕಾರ್ಡ್‌ಗಳನ್ನು (ಎಕರೆಗೆ 10) ಬಳಸಿ. ಶುಂಠಿ-ಬೆಳ್ಳುಳ್ಳಿ-ಮೆಣಸಿನಕಾಯಿ ಕಷಾಯವನ್ನು ಸಿಂಪಡಿಸಿ.'
          : 'ಸಾವಯವ ಕಾಂಪೋಸ್ಟ್ ಪ್ರಮಾಣವನ್ನು ಹೆಚ್ಚಿಸಿ. ಬೇರು ಕೊಳೆತ ರೋಗಗಳನ್ನು ತಡೆಗಟ್ಟಲು ಕಾಂಪೋಸ್ಟ್‌ಗೆ ಟ್ರೈಕೋಡರ್ಮ ಮಿಶ್ರಣ ಮಾಡಿ.'
      },
      precautions: {
        'en-IN': isPesticide
          ? 'Apply herbal spray pre-emptively before pest populations peak. Ensure complete leaf coverage.'
          : 'Ensure compost is fully decomposed. Un-decomposed compost can attract termites and root pests.',
        'hi-IN': isPesticide
          ? 'कीटों की आबादी बढ़ने से पहले ही एहतियातन हर्बल स्प्रे डालें। पत्तों के दोनों तरफ छिड़काव सुनिश्चित करें।'
          : 'सुनिश्चित करें कि कम्पोस्ट पूरी तरह से सड़ा हुआ हो। कच्ची खाद दीमक और अन्य कीटों को आकर्षित कर सकती है।',
        'kn-IN': isPesticide
          ? 'ಕೀಟಗಳು ಹೆಚ್ಚಾಗುವ ಮೊದಲೇ ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಗಿಡಮೂಲಿಕೆ ಕಷಾಯ ಸಿಂಪಡಿಸಿ. ಎಲೆಗಳ ಎಲ್ಲಾ ಭಾಗಗಳಿಗೆ ಸಿಂಪರಣೆ ತಲುಪಲಿ.'
          : 'ಕಾಂಪೋಸ್ಟ್ ಸಂಪೂರ್ಣವಾಗಿ ಕೊಳೆತಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ಹಸಿ ಗೊಬ್ಬರವು ಗೆದ್ದಲುಗಳನ್ನು ಆಕರ್ಷಿಸಬಹುದು.'
      },
      risk: {
        'en-IN': isPesticide
          ? 'In case of severe sucking pest outbreak, use green-labeled botanical pesticide like Azadirachtin 10000 PPM.'
          : 'If crop shows temporary nitrogen yellowing, apply vermiwash foliar spray (diluted 1:10) for instant absorption.',
        'hi-IN': isPesticide
          ? 'गंभीर रस चूसने वाले कीटों के प्रकोप में, अजाडिरेक्टिन 10000 PPM जैसे हरे-लेबल वाले वानस्पतिक कीटनाशक का उपयोग करें।'
          : 'यदि फसल में अस्थायी नाइट्रोजन की कमी (पीलापन) दिखे, तो तुरंत सोखने के लिए वर्मीवाश (1:10 पतला) का छिड़काव करें।',
        'kn-IN': isPesticide
          ? 'ರಸ ಹೀರುವ ಕೀಟಗಳ ಕಾಟ ತೀವ್ರವಾದರೆ, ಹಸಿರು ಲೇಬಲ್ ಹೊಂದಿರುವ ಅಜಾಡಿರಾಕ್ಟಿನ್ 10000 PPM ಸಸ್ಯಜನ್ಯ ಕೀಟನಾಶಕ ಬಳಸಿ.'
          : 'ಬೆಳೆಯಲ್ಲಿ ಸಾರಜನಕದ ಕೊರತೆಯಿಂದ ಹಳದಿ ಬಣ್ಣ ಕಂಡುಬಂದರೆ, ವರ್ಮಿವಾಶ್ (1:10 ಪ್ರಮಾಣದಲ್ಲಿ ನೀರು ಬೆರೆಸಿ) ಸಿಂಪಡಿಸಿ.'
      },
      benefits: {
        'en-IN': isPesticide
          ? 'Natural predators (ladybugs, spiders) increase by 40%. Chemical spray cost reduced by 30%.'
          : 'Soil earthworm activity becomes visible. Fertilizer costs decrease by 20% with stable yield.',
        'hi-IN': isPesticide
          ? 'प्राकृतिक मित्र कीट (लेडीबग, मकड़ी) 40% बढ़ जाते हैं। रासायनिक स्प्रे की लागत 30% कम हो जाती है।'
          : 'केंचुओं की गतिविधि दिखाई देने लगती है। स्थिर उपज के साथ उर्वरक लागत 20% तक कम हो जाती है।',
        'kn-IN': isPesticide
          ? 'ಮಿತ್ರ ಕೀಟಗಳು (ಲೇಡಿಬಗ್ಸ್, ಜೇಡಗಳು) ಶೇ 40 ರಷ್ಟು ಹೆಚ್ಚುತ್ತವೆ. ರಾಸಾಯನಿಕ ಸಿಂಪರಣಾ ವೆಚ್ಚ ಶೇ 30 ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ.'
          : 'ಮಣ್ಣಿನಲ್ಲಿ ಎರೆಹುಳುಗಳ ಚಟುವಟಿಕೆ ಕಾಣಿಸುತ್ತದೆ. ಸ್ಥಿರ ಇಳುವರಿಯೊಂದಿಗೆ ರಸಗೊಬ್ಬರ ವೆಚ್ಚ ಶೇ 20 ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ.'
      }
    },
    season3: {
      ratio: { chemical: 40, organic: 60 },
      planText: plan.season3,
      guidance: {
        'en-IN': isPesticide
          ? 'Deploy pheromone traps (5 per acre) for fruit/shoot borers. Use entomopathogenic fungi (Beauveria bassiana) for soil pests.'
          : 'Apply concentrated liquid bio-NPK consortia alongside irrigation water. Add neem cake to soil bed to suppress root nematodes.',
        'hi-IN': isPesticide
          ? 'फल/तना छेदक के लिए फेरोमोन जाल (5 प्रति एकड़) लगाएं। मिट्टी के कीड़ों के लिए ब्युवेरिया बासियाना फंगस का उपयोग करें।'
          : 'सिंचाई के पानी के साथ तरल बायो-NPK कंसोर्टिया डालें। सूत्रकृमि (nematodes) से बचाव के लिए मिट्टी में नीम की खली मिलाएं।',
        'kn-IN': isPesticide
          ? 'ಕಾಯಿ ಕೊರಕ ಕೀಟಗಳಿಗಾಗಿ ಮೋಹಕ ಬಲೆಗಳನ್ನು (ಎಕರೆಗೆ 5) ಬಳಸಿ. ಮಣ್ಣಿನ ಕೀಟಗಳಿಗಾಗಿ ಬೋವೇರಿಯಾ ಬ್ಯಾಸಿಯಾನಾ ಶಿಲೀಂಧ್ರ ಬಳಸಿ.'
          : 'ನೀರಾವರಿ ನೀರಿನೊಂದಿಗೆ ದ್ರವರೂಪದ ಬಯೋ-NPK ಮಿಶ್ರಣವನ್ನು ಬಳಸಿ. ಬೇರು ಹುಳುಗಳನ್ನು ತಡೆಗಟ್ಟಲು ಬೇವಿನ ಹಿಂಡಿ ಮಿಶ್ರಣ ಮಾಡಿ.'
      },
      precautions: {
        'en-IN': isPesticide
          ? 'Do not mix bio-agents like Beauveria with chemical fungicides. Keep tools thoroughly cleaned.'
          : 'Apply bio-fertilizer during early morning or evening hours. UV rays from direct sunlight kill beneficial bacteria.',
        'hi-IN': isPesticide
          ? 'ब्युवेरिया जैसे जैविक एजेंटों को रासायनिक फफूंदनाशकों के साथ न मिलाएं। उपकरणों को अच्छी तरह साफ रखें।'
          : 'सुबह या शाम के समय ही जैविक खाद डालें। सीधी धूप की यूवी किरणें मित्र बैक्टीरिया को नष्ट कर सकती हैं।',
        'kn-IN': isPesticide
          ? 'ಬೋವೇರಿಯಾದಂತಹ ಜೈವಿಕ ಏಜೆಂಟ್‌ಗಳನ್ನು ರಾಸಾಯನಿಕ ಶಿಲೀಂಧ್ರನಾಶಕಗಳೊಂದಿಗೆ ಬೆರೆಸಬೇಡಿ. ಉಪಕರಣಗಳನ್ನು ಶುದ್ಧವಾಗಿಡಿ.'
          : 'ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ವೇಳೆ ಜೈವಿಕ ಗೊಬ್ಬರ ಬಳಸಿ. ನೇರ ಸೂರ್ಯನ ಬಿಸಿಲು ಉಪಕಾರಿ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳನ್ನು ಕೊಲ್ಲುತ್ತದೆ.'
      },
      risk: {
        'en-IN': isPesticide
          ? 'If crop loss exceeds 10% on test patches, spray organic formulation with spinosad (soil bacterium product).'
          : 'If potassium deficiency occurs, supplement with organic potash (obtained from molasses or seaweed extract).',
        'hi-IN': isPesticide
          ? 'यदि परीक्षण पैच पर फसल का नुकसान 10% से अधिक होता है, तो स्पिनोसैड (जैविक बैक्टीरिया उत्पाद) का छिड़काव करें।'
          : 'यदि पोटाश की कमी हो, तो जैविक पोटाश (शीरा या समुद्री शैवाल के अर्क से प्राप्त) का छिड़काव करें।',
        'kn-IN': isPesticide
          ? 'ಬೆಳೆ ನಷ್ಟ ಶೇ 10 ಕ್ಕಿಂತ ಹೆಚ್ಚಾದರೆ, ಸ್ಪಿನೋಸ್ಯಾಡ್ (ಜೈವಿಕ ಬ್ಯಾಕ್ಟೀರಿಯಾ ಉತ್ಪನ್ನ) ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.'
          : 'ಪೊಟ್ಯಾಷಿಯಂ ಕೊರತೆ ಕಂಡುಬಂದರೆ, ಸಾವಯವ ಪೊಟ್ಯಾಷ್ (ಕಬ್ಬಿನ ರಸದ ಉಪಉತ್ಪನ್ನ ಅಥವಾ ಪಾಚಿ ಸಾರ) ಬಳಸಿ.'
      },
      benefits: {
        'en-IN': isPesticide
          ? 'Natural biodiversity is restored. Chemical expenses drop by 50%. Certified organic premium pricing potential.'
          : 'Soil organic carbon increases by 0.15%. Root depth and plant immunity show visible improvement.',
        'hi-IN': isPesticide
          ? 'प्राकृतिक जैव विविधता पुनर्जीवित होती है। रासायनिक खर्च 50% घट जाता है। जैविक फसल के रूप में प्रीमियम दाम की संभावना।'
          : 'मृदा जैविक कार्बन में 0.15% की वृद्धि। जड़ों की गहराई और पौधों की रोग प्रतिरोधक क्षमता में सुधार।',
        'kn-IN': isPesticide
          ? 'ನೈಸರ್ಗಿಕ ಜೀವವೈವಿಧ್ಯತೆ ಪುನಃಸ್ಥಾಪನೆಯಾಗುತ್ತದೆ. ವೆಚ್ಚ ಶೇ 50 ರಷ್ಟು ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಸಾವಯವ ಬೆಳೆಗೆ ಹೆಚ್ಚಿನ ಬೆಲೆ ಸಿಗುವ ಸಾಧ್ಯತೆ.'
          : 'ಮಣ್ಣಿನ ಸಾವಯವ ಇಂಗಾಲ ಶೇ 0.15 ರಷ್ಟು ಹೆಚ್ಚುತ್ತದೆ. ಬೇರುಗಳ ಬೆಳವಣಿಗೆ ಮತ್ತು ಗಿಡಗಳ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ ಸುಧಾರಿಸುತ್ತದೆ.'
      }
    }
  };

  const getLangKey = (lang: string): 'en-IN' | 'hi-IN' | 'kn-IN' => {
    if (lang === 'hi-IN' || lang === 'kn-IN') return lang;
    return 'en-IN';
  };

  const activeLangKey = getLangKey(activeLang);
  const selectedData = seasonsData[selectedSeason];

  return (
    <div className="bg-white border border-emerald-800/10 p-6 rounded-3xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-800/5 pb-5">
        <div>
          <h3 className="font-extrabold text-emerald-950 text-lg flex items-center gap-2">
            <Calendar className="h-5.5 w-5.5 text-emerald-600" />
            {t('transitionTitle')}
          </h3>
          <p className="text-xs text-emerald-800/60 font-semibold mt-1 leading-relaxed max-w-2xl">
            {t('transitionSubtitle')}
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex bg-emerald-50/50 border border-emerald-800/5 p-1 rounded-xl shrink-0">
          {(['season1', 'season2', 'season3'] as const).map((season) => {
            const isSelected = selectedSeason === season;
            const seasonLabels = {
              season1: activeLangKey === 'kn-IN' ? 'ಹಂಗಾಮು ೧' : activeLangKey === 'hi-IN' ? 'सीज़न १' : 'Season 1',
              season2: activeLangKey === 'kn-IN' ? 'ಹಂಗಾಮು ೨' : activeLangKey === 'hi-IN' ? 'सीज़न २' : 'Season 2',
              season3: activeLangKey === 'kn-IN' ? 'ಹಂಗಾಮು ೩' : activeLangKey === 'hi-IN' ? 'सीज़न ೩' : 'Season 3'
            };
            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-50/50'
                }`}
              >
                {seasonLabels[season]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Phased Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Visual Ratio Card & Description */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-emerald-50/20 border border-emerald-800/5 p-5 rounded-2xl">
          <div>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              {t('recommendedRatio')}
            </span>
            
            {/* Visual Ratio Progress Bar */}
            <div className="mt-4.5 space-y-3">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-600">{t('chemicalRatio')} ({selectedData.ratio.chemical}%)</span>
                <span className="text-emerald-700">{t('organicRatio')} ({selectedData.ratio.organic}%)</span>
              </div>
              
              <div className="w-full h-4.5 rounded-full overflow-hidden flex border border-stone-200">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-500" 
                  style={{ width: `${selectedData.ratio.chemical}%` }} 
                />
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500" 
                  style={{ width: `${selectedData.ratio.organic}%` }} 
                />
              </div>
            </div>

            <div className="mt-5 p-4 bg-white border border-emerald-800/10 rounded-xl">
              <h5 className="text-[10px] font-black text-emerald-950/80 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                Action Strategy
              </h5>
              <p className="text-xs leading-relaxed text-emerald-900/90 font-medium">
                {selectedData.planText}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-emerald-850/5 pt-3.5 flex items-center gap-2 text-[10px] text-emerald-800/50 font-semibold leading-snug">
            <HelpCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>Values adapt automatically based on the label chemistry detected.</span>
          </div>
        </div>

        {/* Technical Guidelines Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Soil Adaptation */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl hover:shadow-sm transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                <Sprout className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-950">{t('soilGuidance')}</h4>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 font-medium mt-1">
              {selectedData.guidance[activeLangKey]}
            </p>
          </div>

          {/* Crop Safety */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl hover:shadow-sm transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-950">{t('safetyPrecautions')}</h4>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 font-medium mt-1">
              {selectedData.precautions[activeLangKey]}
            </p>
          </div>

          {/* Risk Buffer Management */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl hover:shadow-sm transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-950">{t('riskManagement')}</h4>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 font-medium mt-1">
              {selectedData.risk[activeLangKey]}
            </p>
          </div>

          {/* Expected Benefits */}
          <div className="bg-white border border-emerald-800/10 p-5 rounded-2xl hover:shadow-sm transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-950">{t('benefits')}</h4>
            </div>
            <p className="text-xs leading-relaxed text-stone-600 font-medium mt-1">
              {selectedData.benefits[activeLangKey]}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
