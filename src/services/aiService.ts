import { mockDb } from '../database/mockDb';

interface AIResult {
  reply: string;
  actionTaken?: 'reminder' | 'activity' | 'price' | 'scheme' | 'general';
}

export const aiService = {
  processFarmingQuery: async (query: string): Promise<AIResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const lowerQuery = query.toLowerCase();

    // Intent: Crop Prices
    if (
      lowerQuery.includes('price') || 
      lowerQuery.includes('bhav') || 
      lowerQuery.includes('rate') || 
      lowerQuery.includes('ದಾಮ') || 
      lowerQuery.includes('ಧಾರಣೆ') ||
      lowerQuery.includes('ದರ') ||
      lowerQuery.includes('ರೇಟ್') ||
      lowerQuery.includes('दाम') || 
      lowerQuery.includes('भाव')
    ) {
      const prices = mockDb.getCropPrices();
      
      if (
        lowerQuery.includes('wheat') || 
        lowerQuery.includes('gehu') || 
        lowerQuery.includes('गेहूं') || 
        lowerQuery.includes('ಗೋಧಿ') || 
        lowerQuery.includes('godhi') || 
        lowerQuery.includes('kanak')
      ) {
        const wheat = prices.find(p => p.id === '1');
        return {
          reply: `ಕನ್ನಡ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗೋಧಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${wheat?.price} ತಲುಪಿದೆ. (Wheat price in Mandi is ₹${wheat?.price}/quintal.)`,
          actionTaken: 'price'
        };
      }
      
      if (
        lowerQuery.includes('paddy') || 
        lowerQuery.includes('dhan') || 
        lowerQuery.includes('धान') || 
        lowerQuery.includes('ಭತ್ತ') || 
        lowerQuery.includes('bhatta') || 
        lowerQuery.includes('basmati') || 
        lowerQuery.includes('rice')
      ) {
        const paddy = prices.find(p => p.id === '2');
        return {
          reply: `ಮಂಡ್ಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಭತ್ತದ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${paddy?.price} ಆಗಿದೆ. (Basmati Paddy price in Mandi is ₹${paddy?.price}/quintal.)`,
          actionTaken: 'price'
        };
      }

      if (
        lowerQuery.includes('tomato') || 
        lowerQuery.includes('tamatar') || 
        lowerQuery.includes('ಟೊಮೆಟೊ') || 
        lowerQuery.includes('ಟೊಮ್ಯಾಟೋ') || 
        lowerQuery.includes('टमाटर')
      ) {
        const tomato = prices.find(p => p.id === '5');
        return {
          reply: `ಕೋಲಾರ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮೆಟೊ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${tomato?.price} ತಲುಪಿದೆ. (Tomato price in Kolar APMC is ₹${tomato?.price}/quintal.)`,
          actionTaken: 'price'
        };
      }

      // Default price response
      return {
        reply: `ನಮ್ಮಲ್ಲಿ ಭತ್ತ (₹4350), ಗೋಧಿ (₹2275), ಹತ್ತಿ (₹7200), ಮತ್ತು ಟೊಮೆಟೊ (₹1800) ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳಿವೆ. ನಿಮಗೆ ಯಾವ ಬೆಳೆ ಬೇಕು?`,
        actionTaken: 'price'
      };
    }

    // Intent: Set Reminder
    if (
      lowerQuery.includes('reminder') || 
      lowerQuery.includes('remind') || 
      lowerQuery.includes('ಯಾದ') || 
      lowerQuery.includes('ಜ್ಞಾಪನೆ') || 
      lowerQuery.includes('ಇಡು') || 
      lowerQuery.includes('याद') || 
      lowerQuery.includes('अलार्म') || 
      lowerQuery.includes('schedule')
    ) {
      let crop = 'General';
      let title = 'Farming activity';
      let type: any = 'General';

      if (
        lowerQuery.includes('water') || 
        lowerQuery.includes('irrigate') || 
        lowerQuery.includes('sinchai') || 
        lowerQuery.includes('ನೀರಾವರಿ') || 
        lowerQuery.includes('ನೀರು') || 
        lowerQuery.includes('पानी')
      ) {
        title = 'Water the fields';
        type = 'Irrigation';
      } else if (
        lowerQuery.includes('fertilizer') || 
        lowerQuery.includes('खाद') || 
        lowerQuery.includes('ಗೊಬ್ಬರ') || 
        lowerQuery.includes('urea')
      ) {
        title = 'Apply fertilizer to crop';
        type = 'Fertilizer';
      } else if (
        lowerQuery.includes('spray') || 
        lowerQuery.includes('pesticide') || 
        lowerQuery.includes('dawayi') || 
        lowerQuery.includes('ಸಿಂಪಡಣೆ') || 
        lowerQuery.includes('दवाई')
      ) {
        title = 'Spray pesticide in field';
        type = 'Pesticides';
      }

      if (lowerQuery.includes('wheat') || lowerQuery.includes('gehu') || lowerQuery.includes('ಗೋಧಿ')) crop = 'Wheat';
      else if (lowerQuery.includes('rice') || lowerQuery.includes('paddy') || lowerQuery.includes('ಭತ್ತ')) crop = 'Paddy';
      else if (lowerQuery.includes('tomato') || lowerQuery.includes('ಟೊಮೆಟೊ')) crop = 'Tomato';

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      mockDb.addReminder({
        title: `${title} (${crop})`,
        crop,
        date: dateStr,
        time: '07:30',
        type
      });

      return {
        reply: `ನಾಳೆ ಬೆಳಿಗ್ಗೆ 7:30 ಕ್ಕೆ ನಾನು ನಿಮಗಾಗಿ "${title} (${crop})" ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿದ್ದೇನೆ. (I have set a reminder for tomorrow morning 07:30 AM to "${title}".)`,
        actionTaken: 'reminder'
      };
    }

    // Intent: Log Activity
    if (
      lowerQuery.includes('log') || 
      lowerQuery.includes('activity') || 
      lowerQuery.includes('ದಾಖಲಿಸು') || 
      lowerQuery.includes('ಹಾಕಿದೆ') || 
      lowerQuery.includes('किया') || 
      lowerQuery.includes('dala') || 
      lowerQuery.includes('completed')
    ) {
      let type: any = 'crop';
      let title = 'Farming task completed';
      let notes = 'Logged via voice-first helper.';

      if (
        lowerQuery.includes('water') || 
        lowerQuery.includes('irrigation') || 
        lowerQuery.includes('ನೀರು') || 
        lowerQuery.includes('pani')
      ) {
        title = 'Field Irrigation';
        type = 'water';
        notes = 'Completed irrigation for the main block.';
      } else if (
        lowerQuery.includes('spray') || 
        lowerQuery.includes('dawayi') || 
        lowerQuery.includes('ಸಿಂಪಡಣೆ')
      ) {
        title = 'Pest Control Spraying';
        type = 'pest';
        notes = 'Applied insecticide spray to protect crops.';
      } else if (
        lowerQuery.includes('soil') || 
        lowerQuery.includes('mitti') || 
        lowerQuery.includes('ಮಣ್ಣು') || 
        lowerQuery.includes('test')
      ) {
        title = 'Soil Sampling';
        type = 'soil';
        notes = 'Collected soil samples for health card verification.';
      }

      mockDb.addActivity({
        title,
        notes,
        status: 'Completed',
        type
      });

      return {
        reply: `ನಿಮ್ಮ ಕೃಷಿ ವೇಳಾಪಟ್ಟಿಯಲ್ಲಿ "${title}" ಕಾರ್ಯವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. (Successfully logged activity: "${title}" to your timeline.)`,
        actionTaken: 'activity'
      };
    }

    // Intent: Government Schemes
    if (
      lowerQuery.includes('scheme') || 
      lowerQuery.includes('yojana') || 
      lowerQuery.includes('ಯೋಜನೆ') || 
      lowerQuery.includes('ಸಾಲ') || 
      lowerQuery.includes('सरकारी') || 
      lowerQuery.includes('योजना') || 
      lowerQuery.includes('subsidy')
    ) {
      if (
        lowerQuery.includes('kisan credit') || 
        lowerQuery.includes('kcc') || 
        lowerQuery.includes('ಲೋನ್') || 
        lowerQuery.includes('loan')
      ) {
        return {
          reply: `ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) ಯೋಜನೆಯಡಿ 4% ಕಡಿಮೆ ಬಡ್ಡಿ ದರದಲ್ಲಿ ₹3 ಲಕ್ಷದವರೆಗೆ ಕೃಷಿ ಸಾಲ ಪಡೆಯಬಹುದು. (Under KCC Scheme, get farm loans up to ₹3 Lakh at 4% effective interest.)`,
          actionTaken: 'scheme'
        };
      }
      return {
        reply: `ರೈತರಿಗಾಗಿ ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಯೋಜನೆ (₹6000 ಆರ್ಥಿಕ ನೆರವು), ಕೃಷಿ ವಿಮಾ ಯೋಜನೆ (PMFBY), ಮತ್ತು ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಯೋಜನೆಗಳಿವೆ. ನೀವು ಯಾವುದರ ಬಗ್ಗೆ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
        actionTaken: 'scheme'
      };
    }

    // Default conversational responses
    if (
      lowerQuery.includes('hello') || 
      lowerQuery.includes('hi') || 
      lowerQuery.includes('namaste') || 
      lowerQuery.includes('ನಮಸ್ಕಾರ') || 
      lowerQuery.includes('नमस्ते')
    ) {
      return {
        reply: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕೃಷಿ ಸಹಾಯಕ. ನಾನು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ.`,
        actionTaken: 'general'
      };
    }

    return {
      reply: `ನನಗೆ ಅರ್ಥವಾಯಿತು. ನೀವು ಹೀಗೆ ಕೇಳಬಹುದು: "ಗೋಧಿ ಧಾರಣೆ ತಿಳಿಸಿ", "ನಾಳೆ ನೀರಾವರಿ ಜ್ಞಾಪನೆ ಇಡು", ಅಥವಾ "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಯಾವುವು?". ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಿದ್ದೇನೆ.`,
      actionTaken: 'general'
    };
  }
};
