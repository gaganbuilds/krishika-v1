import { NextResponse } from 'next/server';

// Local database of highly detailed scientific responses for popular chemical and organic products in Indian farming
const localAnalysisDatabase: Record<string, any> = {
  urea: {
    productName: 'Urea (Technical Grade Nitrogen 46%)',
    category: 'Fertilizer',
    ingredients: 'Nitrogen (46%), Biuret (1.5% max), Moisture (1% max)',
    npk: '46-0-0',
    toxicity: 'blue',
    scores: {
      soilFertility: 35, // score out of 100 (moderate-low due to acidification)
      waterPollution: 80, // high risk of runoff
      soilMicroorganism: 25, // reduces microbial diversity over time
      chemicalResidue: 40, // temporary, breaks down to ammonium
      carbonFootprint: 88, // high energy production footprint
      sustainability: 30, // low long-term sustainability if used alone
      humanRisk: 30, // moderate risk if contact or well water contaminated
      biodiversity: 38 // moderate disruption
    },
    alternatives: {
      biofertilizer: 'Azotobacter culture (for nitrogen fixation) & liquid consortia.',
      compost: 'Well-decomposed vermicompost at 2 tons per acre to build organic carbon.',
      pest: 'N/A (Nutrient only)'
    },
    transitionPlan: {
      season1: 'Reduce chemical urea by 20%. Apply 80% of normal dose, combined with 200kg vermicompost and Azotobacter seed treatment (10ml/kg).',
      season2: 'Reduce chemical urea by 40%. Apply 60% chemical dose, supplemented with soil application of Azotobacter (500ml/acre in water) and Neem Cake (150kg/acre).',
      season3: 'Reduce chemical urea by 60%. Apply 40% chemical dose, rely on green manuring (dhaincha/sunnhemp sown and incorporated before planting) + bio-fertilizers.'
    },
    aiSummary: 'Urea is highly effective for rapid vegetative growth and greening. However, overuse acidifies soil, kills beneficial earthworms, and causes nitrogen leaching into nearby aquifers. A phased transition allows soil microbes to recover and naturally cycle nitrogen.'
  },
  dap: {
    productName: 'DAP (Diammonium Phosphate 18-46-0)',
    category: 'Fertilizer',
    ingredients: 'Nitrogen (18%), Phosphate (46%), Moisture (2.5% max)',
    npk: '18-46-0',
    toxicity: 'blue',
    scores: {
      soilFertility: 45,
      waterPollution: 65, // risk of phosphate accumulation and eutrophication
      soilMicroorganism: 40,
      chemicalResidue: 48,
      carbonFootprint: 75,
      sustainability: 38,
      humanRisk: 25,
      biodiversity: 42
    },
    alternatives: {
      biofertilizer: 'Phosphate Solubilizing Bacteria (PSB) which release locked-up soil phosphorus.',
      compost: 'Phospho-compost or enriched compost with rock phosphate.',
      pest: 'N/A'
    },
    transitionPlan: {
      season1: 'Apply 80% DAP + 20% organic phosphate (PSB culture at 500ml/acre mixed with 100kg organic manure).',
      season2: 'Apply 60% DAP + 40% organic alternative (PSB seed treatment + Rock Phosphate at 100kg/acre + Vermicompost).',
      season3: 'Apply 40% DAP + 60% organic alternative (Green manuring + PSB inoculation + VAM mycorrhiza for root uptake).'
    },
    aiSummary: 'DAP provides essential phosphorus for root development. However, over 70% of applied phosphorus becomes chemically locked in the soil and unavailable to plants. Introducing PSB (Phosphate Solubilizing Bacteria) helps tap into these reserves and reduces chemical fertilizer needs.'
  },
  npk19: {
    productName: 'NPK Complex (19-19-19 / 15-15-15)',
    category: 'Fertilizer',
    ingredients: 'Nitrogen (19%), Phosphorus (19%), Potassium (19%)',
    npk: '19-19-19',
    toxicity: 'blue',
    scores: {
      soilFertility: 50,
      waterPollution: 60,
      soilMicroorganism: 35,
      chemicalResidue: 40,
      carbonFootprint: 78,
      sustainability: 40,
      humanRisk: 20,
      biodiversity: 45
    },
    alternatives: {
      biofertilizer: 'NPK Consortia (Liquid bio-fertilizer combining Azotobacter, PSB, and KSB).',
      compost: 'Enriched vermicompost or composted poultry manure (rich in nitrogen and phosphorus).',
      pest: 'N/A'
    },
    transitionPlan: {
      season1: 'Replace 20% of NPK complex dose with NPK bio-consortia (soil treatment) + 1.5 tons of vermicompost.',
      season2: 'Replace 40% NPK complex. Shift to organic manure base + NPK bio-fertilizer foliar sprays at vegetative stages.',
      season3: 'Replace 60% NPK complex. Use bio-fertilizer seed inoculation + Panchagavya foliar spray + Organic compost.'
    },
    aiSummary: 'Complex NPK provides balanced primary nutrients. While effective for overall crop health, continuous chemical application inhibits natural plant-microbe relationships. Integrating liquid NPK consortia helps plants absorb nutrients naturally.'
  },
  potash: {
    productName: 'MOP Potash (Muriate of Potash / Potassium Chloride)',
    category: 'Fertilizer',
    ingredients: 'Potassium (60% as K2O), Chlorine (47% approx)',
    npk: '0-0-60',
    toxicity: 'blue',
    scores: {
      soilFertility: 52,
      waterPollution: 50,
      soilMicroorganism: 38,
      chemicalResidue: 55, // chloride accumulation in soil
      carbonFootprint: 60,
      sustainability: 42,
      humanRisk: 15,
      biodiversity: 48
    },
    alternatives: {
      biofertilizer: 'Potassium Solubilizing Bacteria (KSB / Frateuria aurantia).',
      compost: 'Wood ash (rich in potassium) or banana peel compost.',
      pest: 'N/A'
    },
    transitionPlan: {
      season1: 'Apply 80% Potash + KSB culture (500ml/acre in soil) + organic waste compost.',
      season2: 'Apply 60% Potash + Wood ash (50kg/acre) + KSB inoculation of crop seeds.',
      season3: 'Apply 40% Potash + Wood ash (100kg/acre) + KSB + composted farm residue.'
    },
    aiSummary: 'Potash improves drought resistance and crop quality. However, muriate of potash contains high levels of chloride, which can build up and harm sensitive soil organisms. Substituting potassium solubilizing bacteria (KSB) makes existing soil potassium bio-available.'
  },
  glyphosate: {
    productName: 'Glyphosate (Systemic Herbicide)',
    category: 'Pesticide',
    ingredients: 'Glyphosate Isopropylamine salt (41% w/w), Surfactants (15%)',
    npk: 'N/A',
    toxicity: 'yellow',
    scores: {
      soilFertility: 25,
      waterPollution: 78, // high risk of runoff and contamination
      soilMicroorganism: 15, // severe toxic impact on beneficial mycorrhizae
      chemicalResidue: 75, // high persistence in soil particles
      carbonFootprint: 70,
      sustainability: 15, // extremely low long-term sustainability
      humanRisk: 70, // high toxicity risk for operators and consumption
      biodiversity: 18 // decimates local flora and insect ecosystems
    },
    alternatives: {
      biofertilizer: 'N/A (Weed control)',
      compost: 'N/A',
      pest: 'Manual/mechanical weeding, cover cropping (cowpea/mulching), or organic vinegar-based natural sprays.'
    },
    transitionPlan: {
      season1: 'Reduce herbicide use by 30%. Employ mechanical weeding during early crop stage + spot-spraying instead of blanket spraying.',
      season2: 'Reduce herbicide use by 60%. Implement straw mulching or plastic mulching sheets between rows to suppress weed germination naturally.',
      season3: 'Eliminate chemical herbicide. Use cover crops (e.g. cowpea or dhaincha) to choke weeds naturally, or practice inter-cropping.'
    },
    aiSummary: 'Glyphosate is a highly effective, non-selective weed killer. However, it destroys soil microbial life, harms beneficial insects, and is classified as a probable human carcinogen. Transitioning to cover crops and mechanical mulching restores weed control naturally.'
  },
  chlorpyrifos: {
    productName: 'Chlorpyrifos (Organophosphate Insecticide)',
    category: 'Pesticide',
    ingredients: 'Chlorpyrifos (20% EC or 50% EC)',
    npk: 'N/A',
    toxicity: 'red',
    scores: {
      soilFertility: 20,
      waterPollution: 85, // highly toxic to aquatic life
      soilMicroorganism: 10, // kills soil micro-arthropods and worms
      chemicalResidue: 80, // high persistence on food crops
      carbonFootprint: 65,
      sustainability: 10,
      humanRisk: 85, // high acute neurotoxicity risk
      biodiversity: 12 // extremely harmful to honeybees, birds, and predators
    },
    alternatives: {
      biofertilizer: 'N/A',
      compost: 'N/A',
      pest: 'Neem Oil spray (10,000 ppm), Neem Seed Kernel Extract (NSKE), or bio-pesticides like Bacillus thuringiensis (Bt) or Beauveria bassiana.'
    },
    transitionPlan: {
      season1: 'Replace 50% of insecticide applications with bio-control agent sprays (Neem oil at 5ml/liter + liquid soap) at early pest notice.',
      season2: 'Replace 80% of chemical spray. Deploy pheromone traps (5-10 per acre) and yellow sticky traps to catch pests early, spraying Bt solution.',
      season3: '100% Organic Pest Management. Use beneficial insect conservation (ladybugs, trichogramma cards) + periodic Neem/NSKE sprays.'
    },
    aiSummary: 'Chlorpyrifos is a powerful chemical insecticide but is highly toxic to human health, honeybees, and soil health. It destroys beneficial predator bugs, causing secondary pest outbreaks. Switching to bio-pesticides like Beauveria and Neem protects crops safely.'
  },
  neem: {
    productName: 'Neem-based Bio-Pesticide (Azadirachtin 1% / 10000 ppm)',
    category: 'Pesticide',
    ingredients: 'Azadirachtin (1%), Neem oil extract, natural emulsifiers',
    npk: 'N/A',
    toxicity: 'green',
    scores: {
      soilFertility: 85, // positive organic matter contribution
      waterPollution: 10, // low risk, highly biodegradable
      soilMicroorganism: 92, // supports soil biology
      chemicalResidue: 8, // breaks down in UV light within 3-5 days
      carbonFootprint: 15, // very low production emissions
      sustainability: 95, // excellent long-term sustainability
      humanRisk: 5, // non-toxic to humans and mammals
      biodiversity: 90 // safe for honeybees, earthworms, and ladybugs
    },
    alternatives: {
      biofertilizer: 'N/A',
      compost: 'N/A',
      pest: 'This is already an organic pesticide! You can also prepare Dashparni Ark or Neem Seed Kernel Extract (NSKE) at home.'
    },
    transitionPlan: {
      season1: 'Maintain organic spraying. Combine with sticky traps to monitor pest threshold before spraying.',
      season2: 'Continue organic schedule. Implement crop rotation to break specific pest breeding cycles.',
      season3: 'Fully integrated natural farming. Use companion planting (like marigold with tomato) to repel insects.'
    },
    aiSummary: 'This is an excellent organic pest repellent. Azadirachtin disrupts the growth and feeding of insect pests without harming bees or earthworms. Regular preventative application is key, as it acts as a deterrent rather than an instant chemical poison.'
  },
  biofertilizer: {
    productName: 'Bio-NPK Liquid Consortia (Organic microbial inoculant)',
    category: 'Fertilizer',
    ingredients: 'Azotobacter chroococcum, Bacillus megaterium (PSB), Frateuria aurantia (KSB)',
    npk: 'Bio-NPK',
    toxicity: 'green',
    scores: {
      soilFertility: 95, // builds long-term organic carbon and fertility
      waterPollution: 5, // no chemical run-off risk
      soilMicroorganism: 98, // directly inoculates beneficial microflora
      chemicalResidue: 0, // leaves no toxic residues
      carbonFootprint: 8, // zero-emission production
      sustainability: 98, // fully sustainable indefinitely
      humanRisk: 2, // completely safe for consumption and handling
      biodiversity: 96 // enhances ecosystem biodiversity
    },
    alternatives: {
      biofertilizer: 'Already a biofertilizer! Rotate with Mycorrhiza (VAM) for trace minerals.',
      compost: 'Apply with vermicompost (1-2 tons/acre) as a carrier media.',
      pest: 'N/A'
    },
    transitionPlan: {
      season1: 'Use this bio-fertilizer alongside 50% of your chemical fertilizer. Mix with organic manure for best activation.',
      season2: 'Shift to 30% chemical fertilizer. Inoculate all seeds with the consortia and apply to soil during irrigation.',
      season3: 'Can achieve 100% natural nutrition when combined with crop rotation, green manures, and compost.'
    },
    aiSummary: 'A state-of-the-art biological inoculant containing active bacteria that fix atmospheric nitrogen, solubilize fixed soil phosphorus, and mobilize potassium. This restores the soil microbiome and naturally feeds the crops.'
  }
};

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { image, fileName, categoryHint } = body;
    
    // Check for API key (prioritizing custom header from user settings, then env variable)
    const customOpenAiKey = request.headers.get('x-openai-key');
    const systemOpenAiKey = process.env.OPENAI_API_KEY;
    const apiKey = customOpenAiKey || systemOpenAiKey;

    // Determine the product type based on file name or image metadata
    const nameLower = (fileName || '').toLowerCase();
    let productKey = 'urea'; // default

    if (nameLower.includes('dap') || nameLower.includes('diammonium') || nameLower.includes('phosphate')) {
      productKey = 'dap';
    } else if (nameLower.includes('19') || nameLower.includes('npk') || nameLower.includes('complex')) {
      productKey = 'npk19';
    } else if (nameLower.includes('potash') || nameLower.includes('mop') || nameLower.includes('muriate') || nameLower.includes('potassium')) {
      productKey = 'potash';
    } else if (nameLower.includes('glypho') || nameLower.includes('roundup') || nameLower.includes('weed') || nameLower.includes('herbicide')) {
      productKey = 'glyphosate';
    } else if (nameLower.includes('chlorpy') || nameLower.includes('insect') || nameLower.includes('pest') || nameLower.includes('dawayi') || nameLower.includes('spray')) {
      productKey = 'chlorpyrifos';
    } else if (nameLower.includes('neem') || nameLower.includes('bio-pest') || nameLower.includes('organic-pest')) {
      productKey = 'neem';
    } else if (nameLower.includes('bio') || nameLower.includes('consortia') || nameLower.includes('microb')) {
      productKey = 'biofertilizer';
    } else if (categoryHint === 'pesticide') {
      productKey = 'chlorpyrifos';
    }

    // Dynamic Live AI Vision Execution if API Key is configured
    if (apiKey && apiKey.startsWith('sk-') && image) {
      try {
        // Strip out the data:image/...;base64, prefix if it exists
        const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
        const mimeType = image.includes('data:') ? image.split(';')[0].split(':')[1] : 'image/jpeg';

        const promptText = `
          Analyze this fertilizer or pesticide packaging/label image. Extract the composition, ingredients, NPK ratio (if applicable), and chemical compounds. 
          Return a raw JSON object (strictly formatted, without any markdown formatting wrappers or \`\`\`json blocks) containing the following fields:
          {
            "productName": "Name of fertilizer/pesticide",
            "category": "Fertilizer" | "Pesticide",
            "ingredients": "Comma separated ingredients with percentages",
            "npk": "NPK ratio like 18-46-0 or N/A",
            "toxicity": "red" | "yellow" | "blue" | "green" (based on hazard label color: Ia/Ib is red, II yellow, III blue, IV green),
            "scores": {
              "soilFertility": soil fertility impact rating (-100 to 100 where organic is positive, chemical is negative/hazard),
              "waterPollution": water contamination risk (0 to 100),
              "soilMicroorganism": soil microbe impact score (-100 to 100 where organic is positive, chemical is negative),
              "chemicalResidue": chemical residue persistence score (0 to 100),
              "carbonFootprint": CO2 footprint rating (0 to 100),
              "sustainability": long-term environmental sustainability percentage (0 to 100),
              "humanRisk": risk to human consumption health (0 to 100),
              "biodiversity": ecological biodiversity impact rating (0 to 100)
            },
            "alternatives": {
              "biofertilizer": "specific biofertilizer or organic nutrient alternative recommendation",
              "compost": "vermicompost, green manure, or compost dosage advice",
              "pest": "organic pest control suggestion"
            },
            "transitionPlan": {
              "season1": "specific crop-safe transition recipe for season 1",
              "season2": "specific crop-safe transition recipe for season 2",
              "season3": "specific crop-safe transition recipe for season 3"
            },
            "aiSummary": "A balanced explanation of the chemical's impact, explaining pros (fast yield) and cons (soil degradation) without blind organic bias."
          }
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'user',
                content: [
                  { type: 'text', text: promptText },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${base64Data}`
                    }
                  }
                ]
              }
            ]
          })
        });

        if (response.ok) {
          const chatResult = await response.json();
          const parsedContent = JSON.parse(chatResult.choices[0].message.content);
          return NextResponse.json({
            ...parsedContent,
            mode: 'live-ai'
          });
        } else {
          const errText = await response.text();
          console.error('OpenAI Vision API Error:', errText);
          // Fall back to local database instead of crashing
        }
      } catch (err) {
        console.error('Failed to run OpenAI Vision API:', err);
        // Fall back to local database instead of crashing
      }
    }

    // Local Dynamic Analysis Fallback
    // Return the matched dataset from our database, simulating an active server analysis
    const resultData = localAnalysisDatabase[productKey] || localAnalysisDatabase['urea'];
    
    // Simulate minor API latency for premium loading UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      ...resultData,
      mode: 'local-smart'
    });
  } catch (error: any) {
    console.error('Internal API error in greenshift:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
