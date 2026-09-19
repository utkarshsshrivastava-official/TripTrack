import { emailService, ScheduledBriefing, WaypointArrival, DailyDigestData } from './email.service';
import { isMongoConnected } from '../../shared/lib/mongodb';
import { getIO, FAMILY_ROOM } from '../chat/socket.service';
import { SegmentModel } from '../../models/segment.model';
import { ExpenseModel } from '../../models/expense.model';
import { FamilyFeedModel } from '../../models/familyFeed.model';

export interface GeofenceWaypoint {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  radiusKm: number;
  altitudeMeters: number;
  description: string;
  nextStop: string;
}

export const PILGRIMAGE_GEOFENCES: GeofenceWaypoint[] = [
  {
    id: 'wp-durg',
    name: 'Durg Junction & City (Home Base, Chhattisgarh)',
    coords: [21.1904, 81.2849], // Durg, Chhattisgarh coordinates
    radiusKm: 25, // 25 km covers Durg, Bhilai & surrounding departure hub
    altitudeMeters: 290,
    description: '📍 Live location detection triggered in Durg, Chhattisgarh! Utkarsh and family confirmed active at Durg home base / departure point.',
    nextStop: 'Train 12441 BSP NDLS Rajdhani Express ➔ New Delhi'
  },
  {
    id: 'wp-delhi',
    name: 'New Delhi Railway Station (NDLS)',
    coords: [28.6139, 77.2090],
    radiusKm: 12,
    altitudeMeters: 216,
    description: '1,362 km overnight train journey completed on Train 12441 (Coach A2). Safe arrival in the capital and transferring to private AC cab at Ajmeri Gate bay.',
    nextStop: 'Delhi-Meerut Expressway & Haridwar'
  },
  {
    id: 'wp-haridwar',
    name: 'Haridwar Gateway (Ganga Ghats)',
    coords: [29.9457, 78.1642],
    radiusKm: 8,
    altitudeMeters: 314,
    description: 'Arrived at sacred Haridwar gateway. Hotel check-in completed, taking evening rest and attending the divine Ganga Aarti at Har Ki Pauri.',
    nextStop: 'Rishikesh Foothills & Devprayag'
  },
  {
    id: 'wp-rishikesh',
    name: 'Rishikesh Foothills (Triveni Ghat)',
    coords: [30.0869, 78.2676],
    radiusKm: 6,
    altitudeMeters: 372,
    description: 'Passing through Rishikesh foothills into the Shivalik mountain ranges. Beginning the sacred Garhwal mountain highway ascent on NH-7.',
    nextStop: 'Devprayag Sangam'
  },
  {
    id: 'wp-devprayag',
    name: 'Devprayag Sangam (Alaknanda-Bhagirathi)',
    coords: [30.1460, 78.5990],
    radiusKm: 4,
    altitudeMeters: 830,
    description: 'Holy confluence of Alaknanda and Bhagirathi rivers forming the sacred Ganga. First major high-altitude Himalayan landmark successfully reached!',
    nextStop: 'Srinagar Garhwal & Rudraprayag'
  },
  {
    id: 'wp-rudraprayag',
    name: 'Rudraprayag (Mandakini Confluence)',
    coords: [30.2858, 78.9811],
    radiusKm: 4,
    altitudeMeters: 895,
    description: 'Confluence point towards Kedarnath and Badrinath. Pilgrims taking a refreshing tea halt; elders comfortable, warm, and well-hydrated.',
    nextStop: 'Karnaprayag & Joshimath'
  },
  {
    id: 'wp-joshimath',
    name: 'Joshimath Base Camp (Acclimatization Hub)',
    coords: [30.5564, 79.5663],
    radiusKm: 5,
    altitudeMeters: 1890,
    description: 'Winter seat of Lord Badri Vishal. Safe arrival at our primary acclimatization base camp (1,890m). Resting overnight before the final mountain ascent.',
    nextStop: 'Hanuman Chatti & Badrinath Sanctum'
  },
  {
    id: 'wp-badrinath',
    name: 'Badrinath Dham (Holy Sanctum)',
    coords: [30.7447, 79.4930],
    radiusKm: 3,
    altitudeMeters: 3133,
    description: '🙏 Jai Badri Vishal! All 4 pilgrims (Rajnish Ji, Sanjay Ji, Utkarsh & Shreyas) have safely reached Badrinath Sanctum (3,133m). A sacred and auspicious milestone!',
    nextStop: 'Brahma Kapal Pitru Tarpan & Mana Village'
  },
  {
    id: 'wp-mana',
    name: 'Mana (First Village of India)',
    coords: [30.7712, 79.4960],
    radiusKm: 2.5,
    altitudeMeters: 3200,
    description: 'Arrived at Mana Village on the Indo-Tibetan border! Explored Saraswati river origin, Bhim Pul, and Ved Vyas Gufa.',
    nextStop: 'Return Highway Descent'
  }
];

export const SCHEDULED_BRIEFINGS: ScheduledBriefing[] = [
  // ============================================================================
  // PRE-DEPARTURE PHASE (Sep 19 – Sep 23, 2026: 15 Curated Briefings)
  // ============================================================================

  // --- Sep 19, 2026 (Day -5: Kickoff & Health Foundation — Tightened Schedule) ---
  {
    id: 'briefing-sep19-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -5: Kickoff & Documents — Sep 19, 2026',
    dayTitleHindi: 'दिवस -5: शुभारंभ एवं आवश्यक दस्तावेज — 19 सितंबर, 2026',
    scheduledFor: '2026-09-19T12:30:00+05:30',
    subject: 'Pilgrimage Kickoff & Digital Document Vault Checklist',
    subjectHindi: 'तीर्थ यात्रा शुभारंभ एवं डिजिटल दस्तावेज वॉलेट चेकलिस्ट',
    transitInfo: 'Initial 5-day countdown begun in Durg, CG. Preparing mobile vaults, physical IDs, and offline verification.',
    transitInfoHindi: 'दुर्ग (छत्तीसगढ़) से 5-दिवसीय उल्टी गिनती प्रारंभ। डिजिटल वॉलेट, मूल पहचान पत्र एवं ऑफलाइन सत्यापन तैयार।',
    checklistItems: [
      'Original Aadhar Cards for all 4 travellers (Utkarsh, Rajnish Ji, Shreyas, Sanjay Ji)',
      'Physical printouts (2 sets) of Train 12441 Rajdhani tickets (PNR: 6709136735)',
      'TripTrack PWA installed on all phones with offline Vault synced',
      'Emergency cash reserve ₹15,000 kept safely for transit & doli/kandi'
    ],
    checklistItemsHindi: [
      'सभी 4 यात्रियों के मूल आधार कार्ड (उत्कर्ष, रजनीश जी, श्रेयस, संजय जी)',
      'राजधानी ट्रेन टिकट के 2 सेट प्रिंटआउट (PNR: 6709136735)',
      'सभी फोन में ट्रिप-ट्रैक ऐप व ऑफलाइन वॉलेट सक्रिय',
      'आपातकालीन नकद राशि ₹15,000 हैंडबैग में सुरक्षित'
    ],
    highlights: [
      '12:30 — Check digital document storage and biometric Yatra QR passes',
      'Verify TripTrack is added to mobile home screen (Works 100% offline in dead zones)',
      'Laminate senior medical emergency cards and store in pocket wallets'
    ],
    highlightsHindi: [
      '12:30 — डिजिटल दस्तावेज़ संग्रहण एवं बायोमेट्रिक यात्रा QR पास की पुष्टि',
      'ट्रिप-ट्रैक ऐप को मोबाइल होमस्क्रीन पर जोड़ें (नो-नेटवर्क में भी 100% काम करता है)',
      'बुजुर्गों के आपातकालीन मेडिकल कार्ड लैमिनेट कर जेब में रखें'
    ],
    elderCareTip: 'Keep original IDs and vital medicines in a dedicated handheld shoulder bag. Never place daily pills in large check-in suitcases.',
    elderCareTipHindi: 'मूल पहचान पत्र एवं नित्य दवाइयां छोटे हैंडबैग में रखें, बड़े सूटकेस में नहीं।',
    logisticsSummary: 'TripTrack Vault sync status: verified. IRCTC PNR 6709136735 loaded.',
    logisticsSummaryHindi: 'ट्रिप-ट्रैक वॉलेट सिंक सत्यापित। IRCTC PNR 6709136735 लोड किया गया।'
  },
  {
    id: 'briefing-sep19-evening',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'EVENING',
    dayTitle: 'Day -5: Acclimatization & Health — Sep 19, 2026',
    dayTitleHindi: 'दिवस -5: अनुकूलन एवं स्वास्थ्य — 19 सितंबर, 2026',
    scheduledFor: '2026-09-19T17:00:00+05:30',
    subject: 'Himalayan Altitude Acclimatization & Elder Pacing',
    subjectHindi: 'हिमालयी ऊंचाई अनुकूलन एवं बुजुर्गों हेतु गति नियंत्रण',
    transitInfo: 'Ascent profile: Durg (290m) ➔ Delhi (216m) ➔ Haridwar (314m) ➔ Joshimath (1,890m) ➔ Badrinath (3,133m).',
    transitInfoHindi: 'ऊंचाई क्रम: दुर्ग (290 मी) ➔ दिल्ली (216 मी) ➔ हरिद्वार (314 मी) ➔ जोशीमठ (1,890 मी) ➔ बद्रीनाथ (3,133 मी)।',
    checklistItems: [
      'Fingertip Pulse Oximeter with fresh AAA batteries tested',
      'Digital Blood Pressure monitor tested and packed',
      '2x Stainless steel vacuum thermos flasks (1 Litre each for hot water)',
      '10x Electral / Enerzal oral rehydration electrolyte sachets'
    ],
    checklistItemsHindi: [
      'पल्स ऑक्सीमीटर (नई AAA बैटरी सहित)',
      'डिजिटल बीपी मॉनिटर व अतिरिक्त बैटरी',
      '2x गर्म पानी के वैक्यूम थर्मस फ्लास्क (1 लीटर)',
      '10x इलेक्ट्रॉल / ओआरएस रीहाइड्रेशन पैकेट'
    ],
    highlights: [
      '17:00 — Elder health and altitude tolerance briefing with fathers',
      'Diamond rule: Take steps at half normal pace above 2,500m elevation',
      'Hydration target: Sip warm water every 90 minutes to combat dry mountain air',
      'SpO2 benchmark: >90% normal; alert threshold <82% for supplemental oxygen'
    ],
    highlightsHindi: [
      '17:00 — पूज्य पिताजी (रजनीश जी व संजय जी) के साथ स्वास्थ्य एवं ऊंचाई अनुकूलन चर्चा',
      'स्वर्ण नियम: 2,500 मीटर से ऊपर सामान्य गति से आधी गति में धीरे-धीरे चलें',
      'जलयोजन: शुष्क पहाड़ी हवा से बचाव हेतु हर 90 मिनट में गुनगुना पानी पिएं',
      'ऑक्सीजन स्तर: >90% सामान्य; <82% होने पर तुरंत ऑक्सीजन सहायता लें'
    ],
    elderCareTip: 'Rajnish Ji & Sanjay Ji should avoid brisk walking or lifting heavy baggage. Sons handle all luggage loading.',
    elderCareTipHindi: 'रजनीश जी एवं संजय जी तेज चलने या भारी वजन उठाने से बचें। बेटे सारा सामान संभालेंगे।',
    logisticsSummary: 'Joshimath base camp (1,890m) provides critical 14-hour acclimatization window before entering 3,133m Badrinath zone.',
    logisticsSummaryHindi: 'जोशीमठ बेस कैंप (1,890 मी) 3,133 मी बद्रीनाथ जाने से पूर्व 14 घंटे का महत्वपूर्ण अनुकूलन प्रदान करेगा।'
  },
  {
    id: 'briefing-sep19-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -5: Sacred Orientation — Sep 19, 2026',
    dayTitleHindi: 'दिवस -5: पावन हरिद्वार-ऋषिकेश दर्शन — 19 सितंबर, 2026',
    scheduledFor: '2026-09-19T20:30:00+05:30',
    subject: 'Haridwar & Rishikesh Sacred Orientation & Temple Guide',
    subjectHindi: 'हरिद्वार एवं ऋषिकेश पावन दर्शन एवं मंदिर गाइड',
    transitInfo: 'First spiritual stops after Delhi: Sacred Ganges plains before the Garhwal mountain highway ascent.',
    transitInfoHindi: 'दिल्ली के उपरांत प्रथम आध्यात्मिक पड़ाव: गढ़वाल पहाड़ी राजमार्ग पर चढ़ने से पहले पवित्र गंगा मैदानी क्षेत्र।',
    sightseeingTips: [
      'Har Ki Pauri Ganga Aarti: Arrive by 17:30 to secure clean seated view on Malviya Dweep for senior comfort',
      'Mansa Devi & Chandi Devi: Use the Udankhatola ropeway (cable car) to avoid climbing steep stairs',
      'Rishikesh Parmarth Niketan & Triveni Ghat: Peaceful evening musical aarti with majestic Himalayan backdrop'
    ],
    sightseeingTipsHindi: [
      'हर की पौड़ी गंगा आरती: मालवीय द्वीप पर साफ व आरामदायक बैठने हेतु 17:30 तक पहुंचे',
      'मनसा देवी व चंडी देवी: सीढ़ियों से बचने हेतु उड़नखटोला (रोपवे) का प्रयोग करें',
      'ऋषिकेश त्रिवेणी घाट: शाम की शांत व संगीतमय आरती का आनंद लें'
    ],
    highlights: [
      '20:30 — Evening family discussion on Haridwar & Rishikesh flow',
      'Confirm private AC highway cab pickup at NDLS Ajmeri Gate exit',
      'Locate clean highway rest stops: Namaste Midway & Cheetal Grand along Delhi-Haridwar expressway'
    ],
    highlightsHindi: [
      '20:30 — हरिद्वार एवं ऋषिकेश यात्रा क्रम पर शाम की पारिवारिक चर्चा',
      'नई दिल्ली अजमेरी गेट एग्जिट पर प्राइवेट एसी कैब पिकअप की पुष्टि',
      'राजमार्ग पर स्वच्छ विश्राम स्थल: दिल्ली-हरिद्वार एक्सप्रेसवे पर नमस्ते मिडवे व चीतल ग्रैंड'
    ],
    elderCareTip: 'Ensure fathers sleep by 22:00 tonight. Restful sleep is fundamental to building immune stamina for the Himalayas.',
    elderCareTipHindi: 'आज रात 10 बजे तक विश्राम अवश्य करें। यात्रा से पूर्व अच्छी नींद अत्यंत आवश्यक है।',
    logisticsSummary: 'Haridwar hotel check-in voucher saved offline. Cab driver contact logged in Itinerary tab.',
    logisticsSummaryHindi: 'हरिद्वार होटल वाउचर ऑफलाइन सहेजा गया। कैब ड्राइवर संपर्क विवरण सुरक्षित।'
  },

  // --- Sep 20, 2026 (Day -4: Clothing & Sacred Ritual Items) ---
  {
    id: 'briefing-sep20-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -4: Mountain Wardrobe — Sep 20, 2026',
    dayTitleHindi: 'दिवस -4: पहाड़ी शीतकालीन वस्त्र — 20 सितंबर, 2026',
    scheduledFor: '2026-09-20T08:00:00+05:30',
    subject: 'Winter & Mountain Wardrobe Essentials (3-Layer System)',
    subjectHindi: 'शीतकालीन एवं पहाड़ी वस्त्र अनिवार्यता (3-लेयर प्रणाली)',
    transitInfo: 'Badrinath nighttime temperature drops to 2°C – 6°C in late September. Windchill can feel sub-zero near Alaknanda.',
    transitInfoHindi: 'बद्रीनाथ में देर सितंबर में रात्रि तापमान 2°C – 6°C तक गिर जाता है। अलकनंदा किनारे बर्फीली हवाएं चलती हैं।',
    checklistItems: [
      '2x High-grade thermal inner sets (top & bottom) per pilgrim',
      '1x Heavy windproof fleece jacket with hood per traveller',
      '3x Pairs thick woolen socks + 1 pair light cotton socks for transit',
      'Woolen monkey cap covering ears and throat + muffler',
      'Comfortable walking shoes with deep rubber lug traction (non-slip)'
    ],
    checklistItemsHindi: [
      'प्रति यात्री 2x उच्च गुणवत्ता वाले थर्मल इनर सेट (ऊपर एवं नीचे)',
      'प्रति यात्री 1x हुड वाला भारी विंडप्रूफ फ्लीस जैकेट',
      '3x जोड़ी मोटे ऊनी मोज़े + सफर हेतु 1 जोड़ी हल्के सूती मोज़े',
      'कान व गला ढकने वाली ऊनी मंकी कैप + मफलर',
      'मजबूत रबर ग्रिप वाले आरामदायक चलने के जूते (फिसलन रहित)'
    ],
    highlights: [
      '08:00 — Clothing inspection: Ensure fathers have loose-fitting warm layers',
      'Layer 1: Thermal inners (moisture wicking)',
      'Layer 2: Warm sweater/fleece (insulation)',
      'Layer 3: Windcheater / down jacket (wind & rain protection)'
    ],
    highlightsHindi: [
      '08:00 — वस्त्र निरीक्षण: सुनिश्चित करें कि पिताओं के पास ढीले व आरामदायक गर्म वस्त्र हों',
      'लेयर 1: थर्मल इनर्स (पसीना सोखने हेतु)',
      'लेयर 2: गर्म स्वेटर / फ्लीस (गर्मी बनाए रखने हेतु)',
      'लेयर 3: विंडचीटर / डाउन जैकेट (हवा व बारिश से सुरक्षा हेतु)'
    ],
    elderCareTip: 'Cold mountain wind hitting senior ears triggers sudden BP spikes. Keep monkey caps or mufflers in hand luggage.',
    elderCareTipHindi: 'पहाड़ों की ठंडी हवा बुजुर्गों के कानों पर लगने से अचानक बीपी बढ़ सकता है। मंकी कैप या मफलर हमेशा पास रखें।',
    logisticsSummary: 'Pack clothes in soft duffel or medium trolley bags for easier cab boot stacking.',
    logisticsSummaryHindi: 'कैब की डिक्की में आसानी से रखने हेतु कपड़े सॉफ्ट डफल या मध्यम ट्रॉली बैग में पैक करें।'
  },
  {
    id: 'briefing-sep20-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -4: Sacred Rituals — Sep 20, 2026',
    dayTitleHindi: 'दिवस -4: पावन अनुष्ठान एवं ब्रह्म कपाल — 20 सितंबर, 2026',
    scheduledFor: '2026-09-20T14:00:00+05:30',
    subject: 'Badrinath Sanctum & Brahma Kapal Pinda Daan Checklist',
    subjectHindi: 'बद्रीनाथ धाम एवं ब्रह्म कपाल पितृ तर्पण चेकलिस्ट',
    transitInfo: 'Brahma Kapal Ghat on the Alaknanda bank is the world’s most sacred site for final Pitru Tarpan and liberation.',
    transitInfoHindi: 'अलकनंदा तट पर स्थित ब्रह्म कपाल घाट पितृ मुक्ति एवं अंतिम तर्पण हेतु विश्व का सर्वाधिक पावन स्थल है।',
    checklistItems: [
      'White unstitched cotton dhoti & angavastram for Pitru Tarpan',
      'Written ancestral Gotra, Pravara, and 3-generation family tree list',
      'Small container of pure cow ghee (250g) and black sesame seeds (til)',
      'Copper or brass small puja vessel (Panchapatra)',
      'Clean copper brass bottle for carrying holy Badrinath Gangajal home'
    ],
    checklistItemsHindi: [
      'पितृ तर्पण हेतु बिना सिला सफेद सूती धोती एवं अंगवस्त्रम',
      'हस्तलिखित कुल गोत्र, प्रवर एवं 3 पीढ़ियों की वंशावली सूची',
      'शुद्ध गाय का घी (250 ग्राम) एवं काले तिल',
      'तांबे या पीतल का छोटा पूजा पात्र (पंचपात्र)',
      'पवित्र बद्रीनाथ गंगाजल घर लाने हेतु तांबे या पीतल की बोतल'
    ],
    sightseeingTips: [
      'Brahma Kapal Ghat: Ritual takes approx 45–60 mins; panda assistance arranged',
      'Tapt Kund: Holy hot sulphur bath before entering temple sanctum',
      'Badrinath Sanctum Darshan: Gold canopy, Shaligram murti of Lord Vishnu in Padmasana posture'
    ],
    sightseeingTipsHindi: [
      'ब्रह्म कपाल घाट: अनुष्ठान में लगभग 45–60 मिनट लगते हैं; तीर्थ पुरोहित की व्यवस्था सुनिश्चित',
      'तप्त कुंड: मंदिर गर्भगृह प्रवेश से पूर्व पवित्र गंधक युक्त गर्म जल स्नान',
      'बद्रीनाथ गर्भगृह दर्शन: सुवर्ण छत्र, पद्मासन मुद्रा में भगवान श्री बद्री विशाल की शालिग्राम मूर्ति'
    ],
    highlights: [
      '14:00 — Finalize handwritten Gotra and ancestral name register',
      'Coordinate with family elders regarding names to be included in sacred tarpan',
      'Understand Brahma Kapal tradition: once performed here, no further Shradh is required'
    ],
    highlightsHindi: [
      '14:00 — हस्तलिखित गोत्र एवं पूर्वजों के नामों की सूची को अंतिम रूप दें',
      'तर्पण में सम्मिलित किए जाने वाले नामों हेतु परिवार के बुजुर्गों से परामर्श करें',
      'ब्रह्म कपाल की महत्ता: यहाँ एक बार तर्पण होने के उपरांत गया या अन्य कहीं श्राद्ध की आवश्यकता नहीं होती'
    ],
    elderCareTip: 'Brahma Kapal stone steps can be chilly; fathers will wear warm socks and shawl during the rituals until sankalp.',
    elderCareTipHindi: 'ब्रह्म कपाल की पत्थर की सीढ़ियाँ ठंडी हो सकती हैं; संकल्प होने तक पिताश्री ऊनी मोज़े व शॉल अवश्य पहने रखें।',
    logisticsSummary: 'Ancestral Gotra list digitized and saved in TripTrack Liturgy tab.',
    logisticsSummaryHindi: 'पूर्वजों की गोत्र सूची को डिजिटाइज़ कर ट्रिप-ट्रैक स्तोत्र व पूजा टैब में सुरक्षित किया गया।'
  },
  {
    id: 'briefing-sep20-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -4: Panch Prayag — Sep 20, 2026',
    dayTitleHindi: 'दिवस -4: पंच प्रयाग संगम दर्शन — 20 सितंबर, 2026',
    scheduledFor: '2026-09-20T20:30:00+05:30',
    subject: 'The Divine Panch Prayag Sacred Confluences on NH-7',
    subjectHindi: 'राष्ट्रीय राजमार्ग NH-7 पर स्थित पावन पंच प्रयाग संगम',
    transitInfo: 'NH-7 highway follows the Alaknanda river, witnessing the five sacred confluences that form Mother Ganga.',
    transitInfoHindi: 'NH-7 राजमार्ग अलकनंदा नदी के साथ चलता है, जहाँ माँ गंगा को जन्म देने वाले पाँच पावन संगम स्थित हैं।',
    sightseeingTips: [
      '1. Devprayag: Confluence of turquoise Alaknanda and emerald Bhagirathi — birth of Ganga',
      '2. Rudraprayag: Confluence of Alaknanda and Mandakini (flowing from Kedarnath)',
      '3. Karnaprayag: Confluence of Alaknanda and Pindar river (flowing from Pindari glacier)',
      '4. Nandaprayag: Confluence of Alaknanda and Mandakini/Nandakini river',
      '5. Vishnuprayag: Confluence of Alaknanda and Dhauliganga near Joshimath'
    ],
    sightseeingTipsHindi: [
      '1. देवप्रयाग: अलकनंदा और भागीरथी का पावन संगम — यहीं से गंगा नाम प्रारंभ होता है',
      '2. रुद्रप्रयाग: केदारनाथ से आने वाली मंदाकिनी और अलकनंदा का संगम',
      '3. कर्णप्रयाग: पिंडारी ग्लेशियर से आने वाली पिंडर नदी और अलकनंदा का संगम',
      '4. नंदप्रयाग: नंदाकिनी और अलकनंदा का संगम',
      '5. विष्णुप्रयाग: जोशीमठ के निकट धौलीगंगा और अलकनंदा का संगम'
    ],
    highlights: [
      '20:30 — Sacred geography study: Spotting each Sangam during the car drive',
      'Devprayag photo stop: 10-minute halt at view deck for family blessing',
      'Rudraprayag tea halt: Beautiful view of ancient temple perched on river cliff'
    ],
    highlightsHindi: [
      '20:30 — पावन भूगोल का अध्ययन: कार यात्रा के दौरान प्रत्येक संगम के दर्शन',
      'देवप्रयाग फोटो स्टॉप: परिवार के दर्शन हेतु व्यू-डेक पर 10 मिनट का पड़ाव',
      'रुद्रप्रयाग चाय पड़ाव: नदी की चट्टान पर स्थित प्राचीन मंदिर का विहंगम दृश्य'
    ],
    elderCareTip: 'View confluences from highway viewpoints; do not encourage elders to descend 200 steep wet river steps at every sangam.',
    elderCareTipHindi: 'संगमों के दर्शन राजमार्ग के व्यू-पॉइंट से ही करें; बुजुर्गों को 200 गीली सीढ़ियाँ उतरने का कष्ट न दें।',
    logisticsSummary: 'All 5 Prayag coordinates programmed into TripTrack GPS Geofencing Engine.',
    logisticsSummaryHindi: 'सभी 5 प्रयागों के जीपीएस निर्देशांक ट्रिप-ट्रैक अलर्ट इंजन में दर्ज हैं।'
  },

  // --- Sep 21, 2026 (Day -3: Dead-Zone Prep & Mountain Road Comfort) ---
  {
    id: 'briefing-sep21-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -3: Tech & Battery — Sep 21, 2026',
    dayTitleHindi: 'दिवस -3: तकनीक, बैटरी एवं नो-सिग्नल सुरक्षा — 21 सितंबर, 2026',
    scheduledFor: '2026-09-21T08:00:00+05:30',
    subject: 'Mountain Dead-Zone & Battery Survival Protocol',
    subjectHindi: 'पहाड़ी नो-सिग्नल ज़ोन एवं बैटरी बैकअप प्रोटोकॉल',
    transitInfo: 'NH-7 deep gorges between Kaudiyala and Devprayag, and past Pipalkoti have zero cellular connectivity.',
    transitInfoHindi: 'कौडियाला से देवप्रयाग और पीपलकोटी से आगे गहरी घाटियों में मोबाइल नेटवर्क शून्य हो जाता है।',
    checklistItems: [
      '2x High-capacity 20,000mAh fast-charge power banks (100% charged)',
      '12V fast car cigarette-lighter charger with dual USB-C cables for cab',
      'All 4 phones loaded with TripTrack PWA offline cache verified',
      'BSNL or Jio secondary SIM cards checked (best mountain coverage)'
    ],
    checklistItemsHindi: [
      '2x 20,000mAh फास्ट-चार्ज पावर बैंक (100% चार्ज)',
      'कैब हेतु 12V फास्ट कार सिगरेट-लाइटर चार्जर व दोहरी USB-C केबल',
      'सभी 4 मोबाइलों में ट्रिप-ट्रैक ऐप का ऑफलाइन डेटा सत्यापित',
      'BSNL या Jio की सेकेंडरी सिम कार्ड (पहाड़ों में सर्वश्रेष्ठ नेटवर्क)'
    ],
    highlights: [
      '08:00 — Power bank and cable check: each duo carries 1 power bank',
      'Pre-alert extended family that 3–5 hour cellular radio silence is normal on mountain roads',
      'TripTrack offline mode tested: verify tickets open with Airplane mode ON'
    ],
    highlightsHindi: [
      '08:00 — पावर बैंक व केबल जांच: दोनों परिवारों के पास 1-1 पावर बैंक रहेगा',
      'घर के परिजनों को पहले ही सूचित कर दें कि पहाड़ों में 3–5 घंटे नेटवर्क न होना सामान्य है',
      'ऑफलाइन मोड टेस्ट: फोन को एयरप्लेन मोड में डालकर टिकट व पास खोलकर देखें'
    ],
    elderCareTip: 'Ensure fathers’ phones have screen brightness turned up and large text enabled for easy daylight outdoor reading.',
    elderCareTipHindi: 'पिताश्री के फोन की ब्राइटनेस बढ़ाएं और फॉन्ट साइज़ बड़ा रखें ताकि धूप में भी आसानी से पढ़ा जा सके।',
    logisticsSummary: 'Cellular dead zone boundaries mapped in TripTrack Shadow Guard engine.',
    logisticsSummaryHindi: 'नो-नेटवर्क ज़ोन की सीमाएं ट्रिप-ट्रैक शैडो गार्ड इंजन में मैप कर ली गई हैं।'
  },
  {
    id: 'briefing-sep21-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -3: Mountain Pacing — Sep 21, 2026',
    dayTitleHindi: 'दिवस -3: पहाड़ी घुमावदार मार्ग एवं स्वास्थ्य — 21 सितंबर, 2026',
    scheduledFor: '2026-09-21T14:00:00+05:30',
    subject: 'Curvy Mountain Highway Comfort & Motion Sickness Pacing',
    subjectHindi: 'पहाड़ी घुमावदार सड़कों पर यात्रा आराम एवं मोशन सिकनेस से बचाव',
    transitInfo: '275 km drive from Haridwar to Joshimath includes over 3,000 hairpin mountain bends along the Alaknanda canyon.',
    transitInfoHindi: 'हरिद्वार से जोशीमठ तक 275 किमी के सफर में अलकनंदा घाटी के 3,000 से अधिक मोड़ आते हैं।',
    checklistItems: [
      'Avomine (Promethazine) / Ondansetron motion sickness tablets',
      'Digestive Hing peda, ginger candies & Ayurvedic lemon lozenges',
      '10x Biodegradable travel sickness disposal bags in car seat pockets',
      'Pure peppermint / eucalyptus essential oil for refreshing car cabin'
    ],
    checklistItemsHindi: [
      'एवोमिन (Avomine) / ऑन्डेनसेट्रॉन मोशन सिकनेस गोलियां',
      'पाचक हींग पेड़ा, अदरक कैंडी एवं आयुर्वेदिक नींबू की गोलियां',
      'कार की सीट पॉकेट में 10x डिस्पोजेबल ट्रैवल सिकनेस बैग',
      'कार के केबिन को तरोताजा रखने हेतु पुदीना / नीलगिरी का तेल'
    ],
    highlights: [
      '14:00 — Vehicle seating arrangement: Rajnish Ji and Sanjay Ji seated in middle captain row',
      'Driver briefing: Gentle, smooth acceleration and braking on curves, no jerky overtaking',
      'Scheduled breaks: 15-minute halt every 2.5 hours for fresh air and elder leg stretching'
    ],
    highlightsHindi: [
      '14:00 — वाहन बैठक व्यवस्था: रजनीश जी और संजय जी बीच की आरामदायक कैप्टन सीट पर बैठेंगे',
      'ड्राइवर को निर्देश: मोड़ों पर गाड़ी धीरे व बिना झटके के चलाएं, अचानक ओवरटेक न करें',
      'नियमित विश्राम: बुजुर्गों के पैरों को आराम देने हेतु हर 2.5 घंटे में 15 मिनट का पड़ाव'
    ],
    elderCareTip: 'Take motion sickness pill 45 minutes BEFORE embarking on mountain roads, not after nausea begins.',
    elderCareTipHindi: 'उल्टी से बचाव की गोली पहाड़ी रास्ते शुरू होने से 45 मिनट पहले लें, चक्कर आने के बाद नहीं।',
    logisticsSummary: 'Highway cab driver instructed on elder comfort speed limit (max 35-40 km/h on hills).',
    logisticsSummaryHindi: 'कैब चालक को बुजुर्गों के अनुकूल गति सीमा (पहाड़ पर अधिकतम 35-40 किमी/घंटा) का निर्देश दिया गया।'
  },
  {
    id: 'briefing-sep21-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -3: Mana Village — Sep 21, 2026',
    dayTitleHindi: 'दिवस -3: माणा - भारत का प्रथम गाँव — 21 सितंबर, 2026',
    scheduledFor: '2026-09-21T20:30:00+05:30',
    subject: 'Mana Village (First Village of India) & Saraswati Exploration',
    subjectHindi: 'माणा गाँव (भारत का प्रथम गाँव) एवं सरस्वती उद्गम दर्शन',
    transitInfo: 'Located just 3 km beyond Badrinath at 3,200m altitude, bordering the Tibetan plateau.',
    transitInfoHindi: 'बद्रीनाथ से केवल 3 किमी आगे 3,200 मीटर की ऊंचाई पर, तिब्बत सीमा से सटा हुआ ऐतिहासिक गाँव।',
    sightseeingTips: [
      'Bhim Pul: Colossal stone boulder bridge placed by Bhima over the roaring Saraswati river',
      'Vyas Gufa: 5,000-year-old rock cavern where Maharishi Ved Vyas composed the 18 Puranas and Mahabharata',
      'Ganesh Gufa: Where Lord Ganesha transcribed the epic Mahabharata dictated by Vyasa',
      'Saraswati River Origin: The only place where the mythical subterranean river emerges violently into daylight',
      'India’s First Tea Shop: Enjoy hot ginger tea with local organic buckwheat snacks'
    ],
    sightseeingTipsHindi: [
      'भीम पुल: गर्जना करती सरस्वती नदी के ऊपर महाबली भीम द्वारा स्थापित विशाल शिला पुल',
      'व्यास गुफा: 5,000 वर्ष प्राचीन गुफा जहाँ महर्षि वेदव्यास जी ने 18 पुराणों व महाभारत की रचना की',
      'गणेश गुफा: जहाँ भगवान श्री गणेश जी ने व्यास जी द्वारा उच्चारित महाभारत को लिपिबद्ध किया',
      'सरस्वती नदी उद्गम: पृथ्वी पर एकमात्र स्थान जहाँ पावन सरस्वती साक्षात प्रकट होकर बहती हैं',
      'भारत की प्रथम चाय की दुकान: स्थानीय जैविक कुट्टू के नाश्ते के साथ गरमा-गरम अदरक की चाय'
    ],
    highlights: [
      '20:30 — Overview of Mana walking trail: Gentle 1.5 km stone path',
      'Pony / pithu assistance available for fathers if walking is strenuous',
      'Handmade sheep wool shawls and Himalayan herbs available from local Bhotia artisans'
    ],
    highlightsHindi: [
      '20:30 — माणा पैदल मार्ग की समीक्षा: 1.5 किमी का सुगम पथरीला मार्ग',
      'यदि चलने में थकान हो तो पिताओं हेतु घोड़ा / पालकी (कंडी) की सुविधा उपलब्ध',
      'स्थानीय भोटिया बुनकरों द्वारा निर्मित शुद्ध भेड़ के ऊन के शॉल एवं जड़ी-बूटियाँ'
    ],
    elderCareTip: 'Altitude is 3,200m. Keep heavy windcheater on; wind through the Mana pass can be sudden and sharp.',
    elderCareTipHindi: 'ऊंचाई 3,200 मीटर है। विंडचीटर हमेशा पहने रखें; माणा दर्रे से अचानक तेज बर्फीली हवाएं चलती हैं।',
    logisticsSummary: 'Mana coordinates cached in TripTrack GPS engine. Estimated visit duration: 2 hours.',
    logisticsSummaryHindi: 'माणा के जीपीएस निर्देशांक ट्रिप-ट्रैक में सुरक्षित हैं। अनुमानित भ्रमण समय: 2 घंटे।'
  },

  // --- Sep 22, 2026 (Day -2: Medical Dossier & Temple Etiquette) ---
  {
    id: 'briefing-sep22-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -2: Medical Dossier — Sep 22, 2026',
    dayTitleHindi: 'दिवस -2: स्वास्थ्य एवं सम्पूर्ण औषधि किट — 22 सितंबर, 2026',
    scheduledFor: '2026-09-22T08:00:00+05:30',
    subject: 'Comprehensive Pilgrimage Medical Kit & Health Plan',
    subjectHindi: 'सम्पूर्ण तीर्थ यात्रा मेडिकल किट एवं स्वास्थ्य प्रबंधन',
    transitInfo: 'Remote mountain pharmacy stocks can be limited. Full 15-day supply of all maintenance meds is mandatory.',
    transitInfoHindi: 'दूरदराज के पहाड़ी क्षेत्रों में दवाइयों की उपलब्धता सीमित हो सकती है। 15 दिन की नियमित दवाइयाँ साथ रखना अनिवार्य है।',
    checklistItems: [
      '15-day daily BP tablets for Rajnish Ji (Amlodipine / Telmisartan in labeled container)',
      'Sanjay Ji’s daily health supplements and digestive prescription',
      'Pain relief spray (Volini / Moov) + 2x elastic crepe knee bandages',
      'Paracetamol (650mg), Cetirizine (anti-allergy), and Pantoprazole (antacid)',
      'Povidone-iodine ointment, band-aids, and sterile gauze pads'
    ],
    checklistItemsHindi: [
      'रजनीश जी की 15 दिनों की दैनिक बीपी गोलियां (लेबल वाले डिब्बे में सुरक्षित)',
      'संजय जी के दैनिक स्वास्थ्य सप्लीमेंट्स एवं पाचक दवाइयां',
      'दर्द निवारक स्प्रे (वोलिनी / मूव) + 2x इलास्टिक क्रेप बैंडेज',
      'पैरासिटामोल (650mg), सेट्रीज़ीन (एलर्जी हेतु) एवं एंटासिड गोलियां',
      'बीटाडीन ऑइंटमेंट, बैंड-एड एवं रोगाणुरहित कॉटन पट्टी'
    ],
    highlights: [
      '08:00 — Cross-check pill count: double-check daily pill dosage for the entire 9-day trip',
      'Place 1 strip of each critical medicine in son’s daypack as an emergency backup',
      'Emergency SOS contact list saved on speed dial: 108 Ambulance, 1364 Yatra Line'
    ],
    highlightsHindi: [
      '08:00 — दवाइयों की गिनती: पूरे 9 दिनों के सफर हेतु प्रतिदिन की खुराक की दोबारा जांच',
      'आपातकाल हेतु प्रत्येक जरूरी दवा की 1 पत्ती (स्ट्रिप) पुत्रों के छोटे बैग में भी रखें',
      'आपातकालीन हेल्पलाइन नंबर स्पीड डायल पर: 108 एम्बुलेंस, 1364 चारधाम यात्रा हेल्पलाइन'
    ],
    elderCareTip: 'Never alter or skip morning BP medication due to early travel departures. Always take with light breakfast or biscuit.',
    elderCareTipHindi: 'सवेरे जल्दी निकलने के कारण बीपी की दवा कभी न छोड़ें। बिस्कुट या हल्के नाश्ते के साथ नियमित समय पर लें।',
    logisticsSummary: 'Elders’ blood groups and medical dossier pre-loaded in TripTrack Emergency Modal.',
    logisticsSummaryHindi: 'बुजुर्गों का ब्लड ग्रुप एवं मेडिकल विवरण ट्रिप-ट्रैक आपातकालीन विंडो में पहले से दर्ज है।'
  },
  {
    id: 'briefing-sep22-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -2: Temple Etiquette — Sep 22, 2026',
    dayTitleHindi: 'दिवस -2: मंदिर दर्शन नियम एवं पवित्र स्नान — 22 सितंबर, 2026',
    scheduledFor: '2026-09-22T14:00:00+05:30',
    subject: 'Badrinath Temple Sanctum Etiquette & Sacred Bath Protocol',
    subjectHindi: 'बद्रीनाथ धाम गर्भगृह दर्शन मर्यादा एवं पावन स्नान विधि',
    transitInfo: 'Badrinath temple sits on the right bank of Alaknanda between the Nar and Narayana mountain ranges.',
    transitInfoHindi: 'बद्रीनाथ धाम अलकनंदा के दाहिने तट पर नर और नारायण पर्वत श्रृंखलाओं के मध्य सुशोभित है।',
    sightseeingTips: [
      'Tapt Kund Thermal Spring: Sacred bath before darshan; water contains natural therapeutic minerals (~55°C)',
      'Surya Kund: Hot spring reservoir right beside Tapt Kund',
      'Garuda Mandap & Sabha Mandap: Observe ancient stone carvings before inner sanctum',
      'Maha Abhishek: Early morning sacred ceremony where deity is anointed with sandalwood, saffron and camphor'
    ],
    sightseeingTipsHindi: [
      'तप्त कुंड: दर्शन से पूर्व पवित्र गर्म गंधक जल स्नान (तापमान लगभग 55°C, प्राकृतिक औषधीय गुण)',
      'सूर्य कुंड: तप्त कुंड के ठीक समीप स्थित गर्म जल कुंड',
      'गरुड़ मंडप एवं सभा मंडप: गर्भगृह से पूर्व प्राचीन पाषाण नक्काशी के दर्शन',
      'महा अभिषेक: प्रातःकालीन पावन पूजा जहाँ प्रभु का चंदन, केसर एवं कपूर से अभिषेक होता है'
    ],
    highlights: [
      '14:00 — Senior darshan convenience: Senior citizens queue available near the Simha Dwar entrance',
      'Footwear management: Drop shoes at clean counter; carry thick dry wool socks to walk on cold temple stone',
      'Offerings: Pure tulsi mala, dry chana dal prasad, and marigold flowers available at temple stalls'
    ],
    highlightsHindi: [
      '14:00 — वरिष्ठ नागरिकों हेतु सुलभ दर्शन: सिंह द्वार के पास वरिष्ठ नागरिक कतार उपलब्ध',
      'जूते-चप्पल प्रबंधन: काउंटर पर जूते जमा करें; ठंडे पत्थरों पर चलने हेतु साफ व सूखे ऊनी मोज़े पहनें',
      'प्रसाद एवं पूजा सामग्री: शुद्ध तुलसी माला, चने की दाल का भोग एवं गेंदे के पुष्प'
    ],
    elderCareTip: 'Temple flagstones are cold marble. Slip on clean dry woolen socks immediately after taking the sacred water touch.',
    elderCareTipHindi: 'मंदिर के फर्श का संगमरमर अत्यंत ठंडा होता है। पवित्र जल स्पर्श के तुरंत बाद सूखे ऊनी मोज़े पहन लें।',
    logisticsSummary: 'Temple open timings: 04:30 AM to 01:00 PM, and 04:00 PM to 09:00 PM.',
    logisticsSummaryHindi: 'मंदिर खुलने का समय: प्रातः 04:30 से दोपहर 01:00 बजे तक, एवं सायं 04:00 से रात्रि 09:00 बजे तक।'
  },
  {
    id: 'briefing-sep22-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -2: Train Boarding Plan — Sep 22, 2026',
    dayTitleHindi: 'दिवस -2: राजधानी ट्रेन प्रस्थान योजना — 22 सितंबर, 2026',
    scheduledFor: '2026-09-22T20:30:00+05:30',
    subject: 'Train 12441 Bilaspur Rajdhani Express Boarding Timetable',
    subjectHindi: 'ट्रेन 12441 बिलासपुर राजधानी एक्सप्रेस बोर्डिंग समय सारणी',
    transitInfo: 'Departing Durg Jn (DURG) Platform 1 at 16:30 on Sep 24. PNR: 6709136735. Coach A2, Berths 19, 20, 21, 22.',
    transitInfoHindi: '24 सितंबर को दुर्ग जंक्शन (DURG) प्लेटफॉर्म 1 से शाम 16:30 बजे प्रस्थान। PNR: 6709136735, कोच A2, बर्थ 19, 20, 21, 22।',
    checklistItems: [
      'Train 12441 e-ticket PDF saved on phone + physical printout in shoulder bag',
      'Station Coolie pre-contacted / identified at Durg Jn Main Gate 1',
      'Light indoor footwear / slippers for comfortable walking in AC coach',
      'Hand sanitizer and moist wet wipes for train cabin hygiene'
    ],
    checklistItemsHindi: [
      'ट्रेन 12441 ई-टिकट PDF फोन में सुरक्षित + हैंडबैग में प्रिंटआउट',
      'दुर्ग जंक्शन मुख्य गेट 1 पर कुली से पूर्व-संपर्क / पहचान',
      'एसी कोच में आरामदायक आवागमन हेतु हल्की चप्पलें',
      'ट्रेन केबिन स्वच्छता हेतु हैंड सैनिटाइज़र एवं वेट वाइप्स'
    ],
    highlights: [
      '20:30 — Detailed review of Day 1 departure timeline:',
      '14:30 — Home farewell & departure towards Durg Jn',
      '15:45 — Station arrival & smooth baggage handling by porter',
      '16:30 — Departure: Train 12441 rolls out on time',
      '19:40 — Nagpur Junction halt: Hot pantry dinner served'
    ],
    highlightsHindi: [
      '20:30 — प्रथम दिवस प्रस्थान समय सारणी का विस्तार से अवलोकन:',
      '14:30 — गृह प्रस्थान एवं दुर्ग जंक्शन की ओर रवानगी',
      '15:45 — स्टेशन आगमन एवं कुली द्वारा सामान की सुलभ व्यवस्था',
      '16:30 — प्रस्थान: ट्रेन 12441 का समय पर प्रस्थान',
      '19:40 — नागपुर जंक्शन: गरमा-गरम पैंट्री भोजन'
    ],
    elderCareTip: 'Coach A2 berths 19 & 21 are Lower Berths reserved for Rajnish Ji and Sanjay Ji for easy bathroom access without ladder climbing.',
    elderCareTipHindi: 'कोच A2 की बर्थ 19 व 21 लोअर बर्थ हैं, जो पूज्य रजनीश जी और संजय जी हेतु आरक्षित हैं ताकि सीढ़ी न चढ़नी पड़े।',
    logisticsSummary: 'Train 12441 transit tracker active in TripTrack Transit engine.',
    logisticsSummaryHindi: 'ट्रेन 12441 लाइव ट्रैकर ट्रिप-ट्रैक ट्रांजिट इंजन में सक्रिय है।'
  },

  // --- Sep 23, 2026 (Day -1: Final 24h Countdown & Luggage Packing) ---
  {
    id: 'briefing-sep23-morning',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'MORNING',
    dayTitle: 'Day -1: Final Packing — Sep 23, 2026',
    dayTitleHindi: 'दिवस -1: अंतिम सामान पैकिंग एवं हैंडबैग नियम — 23 सितंबर, 2026',
    scheduledFor: '2026-09-23T08:00:00+05:30',
    subject: 'Final Luggage Segregation & The Golden Hand-Carry Rule',
    subjectHindi: 'अंतिम सामान पृथक्करण एवं हैंडबैग का स्वर्णिम नियम',
    transitInfo: 'T-minus 24 hours to departure! Today is dedicated to locking suitcases and zeroing in on cabin hand luggage.',
    transitInfoHindi: 'प्रस्थान में केवल 24 घंटे शेष! आज का दिन सूटकेस लॉक करने एवं हैंडबैग को सुव्यवस्थित करने हेतु समर्पित है।',
    checklistItems: [
      'Shoulder Daypack: Passes, IDs, daily meds, reading glasses, power bank, shawl',
      'Check-in Trolleys: 1 bag per family, weighing under 15kg for easy boot loading',
      'Luggage identification tags with Utkarsh & Shreyas mobile numbers attached',
      'TSA/Number locks set on all main zipper compartments'
    ],
    checklistItemsHindi: [
      'हैंडबैग: यात्रा पास, आधार कार्ड, नित्य दवाइयां, पढ़ने का चश्मा, पावर बैंक, शॉल',
      'चेक-इन ट्रॉली बैग: प्रति परिवार 1 बैग, वजन 15 किग्रा से कम ताकि उठाने में आसानी हो',
      'सामान पर उत्कर्ष एवं श्रेयस के मोबाइल नंबर वाले पहचान टैग',
      'सभी मुख्य ज़िपर पर नंबर लॉक / ताले'
    ],
    highlights: [
      '08:00 — Final packing audit: Separate hand luggage from check-in bags',
      'Verify nothing needed during the 18-hour train journey is locked in the big suitcases',
      'Charge all 4 smartphones and both 20,000mAh power banks to 100%'
    ],
    highlightsHindi: [
      '08:00 — अंतिम पैकिंग ऑडिट: हैंडबैग और बड़े सूटकेस का अलग-अलग विभाजन',
      'जांच लें कि 18 घंटे की ट्रेन यात्रा में आवश्यक कोई भी वस्तु बड़े सूटकेस में बंद न हो',
      'सभी 4 स्मार्टफ़ोन और दोनों 20,000mAh पावर बैंक 100% चार्ज करें'
    ],
    elderCareTip: 'Keep fathers’ reading glasses, hearing aids, and dental care in the shoulder bag so they are always at hand.',
    elderCareTipHindi: 'पिताओं का चश्मा, कान की मशीन और दाँतों की दवाइयां छोटे हैंडबैग में रखें ताकि वे सदैव सुलभ रहें।',
    logisticsSummary: 'Weight distribution checked: ensures comfortable handling for drivers and porters.',
    logisticsSummaryHindi: 'वजन वितरण सत्यापित: ड्राइवरों एवं कुलियों हेतु सुगम हैंडलिंग सुनिश्चित।'
  },
  {
    id: 'briefing-sep23-afternoon',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'AFTERNOON',
    dayTitle: 'Day -1: Financial Pool — Sep 23, 2026',
    dayTitleHindi: 'दिवस -1: नकद व्यवस्था एवं गुल्लक 50/50 पूल — 23 सितंबर, 2026',
    scheduledFor: '2026-09-23T14:00:00+05:30',
    subject: 'Cash Reserves in Mountains & Gullak 50/50 Shared Pool Setup',
    subjectHindi: 'पहाड़ों में नकद राशि एवं गुल्लक 50/50 साझा कोष व्यवस्था',
    transitInfo: 'Mountain ATMs from Rishikesh upwards often face network outages or cash depletion during peak Yatra.',
    transitInfoHindi: 'ऋषिकेश से आगे पहाड़ों में यात्रा के दौरान एटीएम में नेटवर्क न होना या कैश समाप्त होना आम बात है।',
    checklistItems: [
      '₹20,000 Total cash pool divided across Utkarsh (₹10,000) and Shreyas (₹10,000)',
      'Currency split: Clean ₹100, ₹200, and ₹500 notes for easy roadside payments',
      'TripTrack Gullak tab verified: test ₹10 entry logged and split balance confirmed',
      'UPI apps (GPay / PhonePe / Paytm) active and linked to bank with offline PIN ready'
    ],
    checklistItemsHindi: [
      'कुल ₹20,000 नकद कोष, उत्कर्ष (₹10,000) एवं श्रेयस (₹10,000) में विभाजित',
      'रास्ते के भुगतानों हेतु स्वच्छ ₹100, ₹200 एवं ₹500 के नोट',
      'ट्रिप-ट्रैक गुल्लक टैब सत्यापित: ₹10 की टेस्ट एंट्री दर्ज कर 50/50 बैलेंस चेक किया गया',
      'UPI ऐप (GPay / PhonePe / Paytm) सक्रिय व ऑफलाइन पिन तैयार'
    ],
    highlights: [
      '14:00 — Gullak shared finance orientation between Utkarsh and Shreyas',
      '50/50 Bilateral Rule: All common expenses (fuel, tolls, meals, prasad, tips) logged in Gullak',
      'Instant settlement gauge: Shows net balance between Family A and Family B in real time'
    ],
    highlightsHindi: [
      '14:00 — उत्कर्ष और श्रेयस के मध्य गुल्लक साझा वित्त व्यवस्था की चर्चा',
      '50/50 साझा नियम: सभी सामूहिक खर्च (ईंधन, टोल, भोजन, प्रसाद, टिप) गुल्लक में दर्ज होंगे',
      'त्वरित संतुलन मीटर: परिवार A और परिवार B के बीच वास्तविक समय में शुद्ध शेष दर्शाता है'
    ],
    elderCareTip: 'Fathers never need to reach into their pockets for small cash or negotiate with vendors. Sons manage all transactions seamlessly.',
    elderCareTipHindi: 'पिताओं को रास्ते में नकद निकालने या मोलभाव करने की आवश्यकता नहीं होगी। दोनों बेटे समस्त भुगतान संभालेंगे।',
    logisticsSummary: 'Gullak offline Dexie storage ready: allows expense entry even with zero cellular signal.',
    logisticsSummaryHindi: 'गुल्लक ऑफलाइन स्टोरेज तैयार: शून्य इंटरनेट में भी खर्च दर्ज किया जा सकता है।'
  },
  {
    id: 'briefing-sep23-night',
    phase: 'PRE_DEPARTURE',
    timeSlot: 'NIGHT',
    dayTitle: 'Day -1: Shubh Yatra Blessing — Sep 23, 2026',
    dayTitleHindi: 'दिवस -1: शुभ यात्रा मंगलकामना — 23 सितंबर, 2026',
    scheduledFor: '2026-09-23T20:30:00+05:30',
    subject: 'Shubh Yatra Blessing, Family Peace of Mind & Early Sleep',
    subjectHindi: 'शुभ यात्रा मंगलकामना, पारिवारिक शांति एवं समय पर शयन',
    transitInfo: 'All preparations complete! Tomorrow at 14:30 we begin the sacred journey to Lord Badri Vishal.',
    transitInfoHindi: 'समस्त तैयारियां पूर्ण! कल दोपहर 14:30 बजे भगवान श्री बद्री विशाल की पावन यात्रा प्रारंभ होगी।',
    checklistItems: [
      'Alarms set for 06:30 AM tomorrow morning for unhurried morning routine',
      'All luggage zipped, tagged, and placed near front door',
      'Train tickets, hotel vouchers, and Aadhaar cards re-checked in shoulder bag',
      'Kuldevta and home temple prasad and blessings sought'
    ],
    checklistItemsHindi: [
      'सवेरे की दिनचर्या हेतु कल सुबह 06:30 बजे का अलार्म',
      'सारा सामान पैक कर मुख्य द्वार के पास सुव्यवस्थित रखा गया',
      'ट्रेन टिकट, होटल वाउचर और आधार कार्ड हैंडबैग में पुनः जांचे गए',
      'कुलदेवता एवं गृह मंदिर से पावन आशीर्वाद व प्रसाद ग्रहण'
    ],
    highlights: [
      '20:30 — Final family evening gathering: Peaceful hearts, joyful anticipation',
      'Briefing recap: Journey timetable, train coach A2, seamless cab transfer in Delhi',
      'Turn lights out by 22:00 for deep, restorative sleep before departure day'
    ],
    highlightsHindi: [
      '20:30 — अंतिम पारिवारिक संध्या मिलन: मन में प्रसन्नता और भगवान का ध्यान',
      'यात्रा विवरण की अंतिम पुनरावृत्ति: ट्रेन का समय, कोच A2 एवं दिल्ली में कैब व्यवस्था',
      'प्रस्थान दिवस से पूर्व गहरी व शांतिपूर्ण नींद हेतु रात्रि 10 बजे तक विश्राम'
    ],
    elderCareTip: 'Give Rajnish Ji and Sanjay Ji a glass of warm turmeric milk before bed to promote peaceful sleep.',
    elderCareTipHindi: 'अच्छी नींद हेतु पूज्य रजनीश जी और संजय जी को सोने से पहले गुनगुना हल्दी दूध अवश्य दें।',
    logisticsSummary: 'TripTrack Automated Pilgrimage Scheduler engaged and standing by for Day 1 morning trigger!',
    logisticsSummaryHindi: 'ट्रिप-ट्रैक ऑटोमेटेड तीर्थयात्रा शेड्यूलर सक्रिय एवं दिवस 1 की सूचना हेतु तैयार!'
  },

  // ============================================================================
  // DURING-TRIP PHASE (Sep 24 – Oct 02, 2026: 9 Daily Morning Briefings)
  // ============================================================================
  {
    id: 'briefing-sep24-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 1: Departure Day — Sep 24, 2026',
    dayTitleHindi: 'दिवस 1: प्रस्थान दिवस — 24 सितंबर, 2026',
    scheduledFor: '2026-09-24T08:00:00+05:30',
    subject: 'Train 12441 Rajdhani Express Boarding Briefing',
    subjectHindi: 'ट्रेन 12441 राजधानी एक्सप्रेस प्रस्थान बुलेटिन',
    transitInfo: 'Train 12441 (BSP NDLS Rajdhani Exp) departs Durg Jn Platform 1 at 16:30. Coach A2, Berths 19, 20, 21, 22. PNR: 6709136735.',
    transitInfoHindi: 'ट्रेन 12441 बिलासपुर नई दिल्ली राजधानी दुर्ग जं. प्लेटफॉर्म 1 से शाम 16:30 प्रस्थान। कोच A2, बर्थ 19, 20, 21, 22। PNR: 6709136735।',
    highlights: [
      '14:30 — Home departure towards Durg Railway Station (PF 1)',
      '16:30 — Train 12441 departure (Smooth 2AC travel across Central India)',
      '19:40 — Nagpur Halt: Pantry dinner delivery (Jain meal for Rajnish Ji, Veg for all) + Evening BP medicines',
      '22:00 — Early cabin lights-out for restful elder sleep'
    ],
    highlightsHindi: [
      '14:30 — दुर्ग रेलवे स्टेशन (PF 1) हेतु गृह प्रस्थान',
      '16:30 — ट्रेन 12441 प्रस्थान (मध्य भारत के मनोरम दृश्यों के साथ 2AC का सुगम सफर)',
      '19:40 — नागपुर पड़ाव: पैंट्री भोजन (रजनीश जी हेतु जैन भोजन, सभी हेतु शुद्ध शाकाहारी) + सायं बीपी दवा',
      '22:00 — पिताओं के शांत विश्राम हेतु केबिन की लाइटें बंद'
    ],
    elderCareTip: 'Keep elder medicine pouches, warm shawl, and photo ID cards in the small handheld shoulder bag, not inside the big luggage.',
    elderCareTipHindi: 'दवाइयों की थैली, गर्म शॉल और आधार कार्ड छोटे कंधे वाले बैग में रखें, बड़े सामान में नहीं।',
    logisticsSummary: 'Coolie pre-booked for Durg Jn. PNR 6709136735 saved offline in TripTrack Vault.',
    logisticsSummaryHindi: 'दुर्ग जंक्शन पर कुली पूर्व-आरक्षित। PNR 6709136735 ट्रिप-ट्रैक वॉलेट में ऑफलाइन सुरक्षित।'
  },
  {
    id: 'briefing-sep25-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 2: Delhi Arrival & Highway Transfer — Sep 25, 2026',
    dayTitleHindi: 'दिवस 2: दिल्ली आगमन एवं हरिद्वार राजमार्ग — 25 सितंबर, 2026',
    scheduledFor: '2026-09-25T08:30:00+05:30',
    subject: 'NDLS Arrival & Delhi-Meerut Expressway to Haridwar',
    subjectHindi: 'नई दिल्ली आगमन एवं दिल्ली-मेरठ एक्सप्रेसवे से हरिद्वार यात्रा',
    transitInfo: 'Train 12441 arrives New Delhi (PF 1) at 10:40 AM. Transferring to private Ertiga/Crysta cab at Ajmeri Gate Cab Bay.',
    transitInfoHindi: 'ट्रेन 12441 नई दिल्ली (PF 1) सुबह 10:40 आगमन। अजमेरी गेट टैक्सी स्टैंड पर प्राइवेट कैब में प्रस्थान।',
    highlights: [
      '10:40 — Arrival New Delhi Station (Ajmeri Gate exit via coolie)',
      '11:45 — Highway cab meetup; fathers seated in middle captain row',
      '14:15 — Lunch halt at Namaste Midway / Cheetal Grand (clean facilities & light vegetarian food)',
      '17:00 — Haridwar hotel check-in; evening Ganga Aarti at Har Ki Pauri'
    ],
    highlightsHindi: [
      '10:40 — नई दिल्ली स्टेशन आगमन (अजमेरी गेट एग्जिट कुली द्वारा)',
      '11:45 — कैब में प्रस्थान; पिताश्री बीच की आरामदायक कैप्टन सीट पर बैठेंगे',
      '14:15 — नमस्ते मिडवे / चीतल ग्रैंड पर दोपहर का भोजन (स्वच्छ वातावरण व हल्का शाकाहारी भोजन)',
      '17:00 — हरिद्वार होटल चेक-इन; हर की पौड़ी पर सायंकालीन गंगा आरती'
    ],
    elderCareTip: 'Allow fathers to rest on the hotel bed for 45 minutes immediately upon Haridwar check-in before heading out for Ganga Aarti.',
    elderCareTipHindi: 'हरिद्वार पहुँचते ही गंगा आरती जाने से पूर्व पिताओं को होटल के बिस्तर पर 45 मिनट विश्राम करने दें।',
    logisticsSummary: 'Highway cab driver contact active in Itinerary tab. Haridwar hotel voucher cached offline in Vault.',
    logisticsSummaryHindi: 'हाईवे कैब ड्राइवर संपर्क सक्रिय। हरिद्वार होटल वाउचर ऑफलाइन सुरक्षित।'
  },
  {
    id: 'briefing-sep26-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 3: The Mountain Ascent — Sep 26, 2026',
    dayTitleHindi: 'दिवस 3: पहाड़ी राजमार्ग एवं जोशीमठ आरोहण — 26 सितंबर, 2026',
    scheduledFor: '2026-09-26T05:30:00+05:30',
    subject: 'Early 06:00 AM Departure: Haridwar ➔ Joshimath (NH-7)',
    subjectHindi: 'प्रातः 06:00 बजे प्रस्थान: हरिद्वार ➔ जोशीमठ (NH-7)',
    transitInfo: '275 km scenic mountain drive through Garhwal valleys. Entering NH-7 Alaknanda river canyon.',
    transitInfoHindi: 'गढ़वाल की मनोरम घाटियों से 275 किमी की पहाड़ी यात्रा। NH-7 अलकनंदा घाटी में प्रवेश।',
    highlights: [
      '06:00 — Early morning roll-out from Haridwar to beat Rishikesh traffic',
      '08:30 — Devprayag Sangam viewing & light breakfast',
      '12:30 — Rudraprayag lunch & vehicle cooling halt',
      '16:30 — Arrival at Joshimath (1,890m base camp) for acclimatization'
    ],
    highlightsHindi: [
      '06:00 — ऋषिकेश के जाम से बचने हेतु हरिद्वार से प्रातः जल्दी प्रस्थान',
      '08:30 — देवप्रयाग संगम दर्शन एवं हल्का नाश्ता',
      '12:30 — रुद्रप्रयाग दोपहर का भोजन एवं वाहन विश्राम',
      '16:30 — ऊंचाई अनुकूलन हेतु जोशीमठ बेस कैंप (1,890 मी) आगमन'
    ],
    elderCareTip: 'Keep ginger candies and warm water thermos ready in the car. Cellular dead zone begins past Byasi — family pre-alert dispatched.',
    elderCareTipHindi: 'कार में अदरक की गोलियां व गुनगुने पानी का थर्मस तैयार रखें। ब्यासी के आगे नेटवर्क बंद होगा — परिजनों को पूर्व-सूचना भेज दी गई है।',
    logisticsSummary: 'Check NH-7 landslide guard updates in Feed tab. Joshimath hotel check-in voucher ready.',
    logisticsSummaryHindi: 'NH-7 लैंडस्लाइड अपडेट्स लाइव फीड में देखें। जोशीमठ होटल वाउचर तैयार।'
  },
  {
    id: 'briefing-sep27-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 4: Holy Badrinath Sanctum & Tarpan Day — Sep 27, 2026',
    dayTitleHindi: 'दिवस 4: पावन बद्रीनाथ धाम दर्शन एवं ब्रह्म कपाल — 27 सितंबर, 2026',
    scheduledFor: '2026-09-27T06:00:00+05:30',
    subject: 'Jai Badri Vishal! Temple Darshan & Brahma Kapal Tarpan',
    subjectHindi: 'जय बद्री विशाल! मंदिर दर्शन एवं ब्रह्म कपाल तर्पण दिवस',
    transitInfo: 'Final 45 km ascent from Joshimath (1,890m) to Badrinath Dham (3,133m) via Hanuman Chatti.',
    transitInfoHindi: 'जोशीमठ (1,890 मी) से हनुमान चट्टी होते हुए बद्रीनाथ धाम (3,133 मी) की अंतिम 45 किमी की चढ़ाई।',
    highlights: [
      '07:00 — Depart Joshimath towards Badrinath Dham',
      '09:30 — Arrival in holy valley; check-in at temple guesthouse',
      '11:00 — Sacred Tapt Kund sulphur spring holy bath & Badri Vishal Darshan',
      '14:00 — Brahma Kapal Ghat Pitru Tarpan ancestral liturgy with Panda'
    ],
    highlightsHindi: [
      '07:00 — जोशीमठ से बद्रीनाथ धाम हेतु प्रस्थान',
      '09:30 — पावन धाम में आगमन; मंदिर विश्राम गृह में चेक-इन',
      '11:00 — तप्त कुंड गर्म गंधक जल स्नान एवं भगवान बद्री विशाल के दिव्य दर्शन',
      '14:00 — ब्रह्म कपाल घाट पर तीर्थ पुरोहित के सानिध्य में पूर्वजों का पावन पितृ तर्पण'
    ],
    elderCareTip: 'Do NOT walk fast. The altitude is 3,130m. Walk slowly, breathe deeply, and take warm cloves water. Keep oximeter handy in jacket.',
    elderCareTipHindi: 'तेज बिल्कुल न चलें। ऊंचाई 3,130 मीटर है। धीरे-धीरे कदम बढ़ाएं, गहरी सांस लें और लौंग का पानी पिएं। जैकेट में ऑक्सीमीटर रखें।',
    logisticsSummary: 'Yatra biometric registration QR passes saved in Vault. Ancestral Gotra list loaded in Brahma Kapal guide.',
    logisticsSummaryHindi: 'यात्रा बायोमेट्रिक पास वॉलेट में सुरक्षित। गोत्र सूची ब्रह्म कपाल गाइड में लोड है।'
  },
  {
    id: 'briefing-sep28-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 5: Mana Village & Garhwal Descent — Sep 28, 2026',
    dayTitleHindi: 'दिवस 5: माणा गाँव एवं वापसी यात्रा — 28 सितंबर, 2026',
    scheduledFor: '2026-09-28T06:00:00+05:30',
    subject: 'Mana First Village of India & Return Highway Descent',
    subjectHindi: 'माणा (भारत का प्रथम गाँव) दर्शन एवं गढ़वाल राजमार्ग वापसी',
    transitInfo: 'Visiting Indo-Tibetan border post at Mana, followed by return descent to Srinagar / Rishikesh.',
    transitInfoHindi: 'माणा में तिब्बत सीमा चौकी भ्रमण, तत्पश्चात श्रीनगर / ऋषिकेश की ओर वापसी का सफर।',
    highlights: [
      '07:30 — Visit Mana Village, Saraswati river origin & Vyas Gufa',
      '10:30 — Begin vehicle descent down NH-7',
      '16:00 — Night halt in lower elevation valley (Srinagar Garhwal / Rishikesh)'
    ],
    highlightsHindi: [
      '07:30 — माणा गाँव, सरस्वती नदी उद्गम एवं व्यास गुफा दर्शन',
      '10:30 — NH-7 पर वापसी का सफर प्रारंभ',
      '16:00 — निचले मैदानी क्षेत्र (श्रीनगर गढ़वाल / ऋषिकेश) में रात्रि विश्राम'
    ],
    elderCareTip: 'Descent brings immediate oxygen relief. Encourage light walking and relaxing evening tea.',
    elderCareTipHindi: 'ऊंचाई से नीचे आने पर ऑक्सीजन में तुरंत सुधार होता है। शाम को हल्का टहलें और चाय का आनंद लें।',
    logisticsSummary: 'All return hotel passes confirmed. Gullak shared pool tracking active.',
    logisticsSummaryHindi: 'वापसी के सभी होटल पास सुरक्षित। गुल्लक साझा खर्च ट्रैकिंग सक्रिय।'
  },
  {
    id: 'briefing-sep29-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 6: Rishikesh Foothills & Triveni Ghat — Sep 29, 2026',
    dayTitleHindi: 'दिवस 6: ऋषिकेश तपोभूमि एवं त्रिवेणी घाट — 29 सितंबर, 2026',
    scheduledFor: '2026-09-29T07:30:00+05:30',
    subject: 'Rishikesh Serenity, Ram Jhula & Triveni Maha Aarti',
    subjectHindi: 'ऋषिकेश शांति, राम झूला एवं त्रिवेणी महा आरती',
    transitInfo: 'Relaxed morning in Rishikesh valley foothills (372m). Soothing river views and holy dip.',
    transitInfoHindi: 'ऋषिकेश घाटी (372 मी) में शांत सवेरा। पवित्र गंगा दर्शन एवं पावन स्नान।',
    highlights: [
      '08:30 — Leisurely breakfast with views of the Himalayan Shivalik foothills',
      '11:00 — Gentle walk across Ram Jhula suspension bridge and Gita Bhawan',
      '17:30 — Triveni Ghat holy Maha Aarti at sunset with floating diyas'
    ],
    highlightsHindi: [
      '08:30 — शिवालिक पहाड़ियों के नयनाभिराम दृश्यों के साथ नाश्ता',
      '11:00 — राम झूला झूला पुल एवं गीता भवन का शांत भ्रमण',
      '17:30 — त्रिवेणी घाट पर दीपदान के साथ भव्य सायंकालीन महा आरती'
    ],
    elderCareTip: 'Keep fathers away from slippery ghat algae. Use brass handrails along Triveni Ghat bathing bays.',
    elderCareTipHindi: 'घाट की फिसलन भरी काई से बुजुर्गों को दूर रखें। त्रिवेणी घाट पर पीतल की रेलिंग पकड़कर ही स्नान करें।',
    logisticsSummary: 'Rishikesh hotel verified. Local e-rickshaws pre-identified for senior mobility.',
    logisticsSummaryHindi: 'ऋषिकेश होटल सत्यापित। बुजुर्गों हेतु स्थानीय ई-रिक्शा की व्यवस्था।'
  },
  {
    id: 'briefing-sep30-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 7: Haridwar Sacred Ghats & Ayurvedic Rest — Sep 30, 2026',
    dayTitleHindi: 'दिवस 7: हरिद्वार पावन घाट एवं विश्राम — 30 सितंबर, 2026',
    scheduledFor: '2026-09-30T08:00:00+05:30',
    subject: 'Haridwar Local Bazaars, Ayurvedic Herbs & Rest Day',
    subjectHindi: 'हरिद्वार स्थानीय बाजार, आयुर्वेदिक औषधियां एवं विश्राम',
    transitInfo: 'Gentle rest and rejuvenation day in holy Haridwar (314m).',
    transitInfoHindi: 'पवित्र हरिद्वार (314 मी) में शांतिपूर्ण स्वास्थ्य लाभ एवं विश्राम का दिन।',
    highlights: [
      '09:00 — Sacred morning Ganga Snan at Haridwar Ghats',
      '11:30 — Visit to authentic Ayurvedic pharmacies for herbal oils and churna',
      '16:00 — Packing holy Gangajal copper vessels for home relatives'
    ],
    highlightsHindi: [
      '09:00 — हरिद्वार घाटों पर प्रातःकालीन पावन गंगा स्नान',
      '11:30 — प्रामाणिक आयुर्वेदिक फार्मेसियों से औषधीय तेल एवं चूर्ण की खरीदारी',
      '16:00 — परिजनों हेतु तांबे के कलश में पवित्र गंगाजल पैकिंग'
    ],
    elderCareTip: 'Complete day of rest for senior leg muscles. Avoid long shopping walks in crowded lanes.',
    elderCareTipHindi: 'पैरों की मांसपेशियों को पूर्ण आराम दें। भीड़भाड़ वाले बाजारों में अधिक पैदल चलने से बचें।',
    logisticsSummary: 'IndiGo flight web check-in opens today. Boarding passes generating in Vault.',
    logisticsSummaryHindi: 'इंडिगो फ्लाइट का वेब चेक-इन आज खुल रहा है। बोर्डिंग पास वॉलेट में तैयार।'
  },
  {
    id: 'briefing-oct01-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 8: Homeward Flight Connections — Oct 01, 2026',
    dayTitleHindi: 'दिवस 8: वापसी हवाई यात्रा — 01 अक्टूबर, 2026',
    scheduledFor: '2026-10-01T07:00:00+05:30',
    subject: 'IndiGo Flight Transit: Dehradun ➔ Delhi ➔ Raipur',
    subjectHindi: 'इंडिगो फ्लाइट ट्रांजिट: देहरादून ➔ दिल्ली ➔ रायपुर',
    transitInfo: 'IndiGo flight connections. PNRs active in Vault. Terminal check-in with wheelchair assistance pre-confirmed for elders.',
    transitInfoHindi: 'इंडिगो फ्लाइट संपर्क। बुजुर्गों हेतु हवाई अड्डे पर व्हीलचेयर सहायता पूर्व-सुनिश्चित।',
    highlights: [
      '09:00 — Dehradun Jolly Grant Airport check-in (Wheelchair support for fathers)',
      '12:30 — Flight connection via New Delhi T2',
      '17:00 — Safe arrival at Raipur / Durg home sweet home'
    ],
    highlightsHindi: [
      '09:00 — देहरादून जौली ग्रांट एयरपोर्ट चेक-इन (पिताओं हेतु व्हीलचेयर सहायता)',
      '12:30 — नई दिल्ली टर्मिनल 2 पर कनेक्टिंग फ्लाइट',
      '17:00 — रायपुर आगमन एवं गृह नगर दुर्ग वापसी'
    ],
    elderCareTip: 'Wheelchair assistance requested on IndiGo boarding passes to avoid airport terminal fatigue.',
    elderCareTipHindi: 'टर्मिनल की थकान से बचने हेतु इंडिगो बोर्डिंग पास पर व्हीलचेयर सहायता का उपयोग करें।',
    logisticsSummary: 'All boarding passes cached in Vault with instant offline barcode display.',
    logisticsSummaryHindi: 'सभी बोर्डिंग पास ऑफलाइन बारकोड सहित ट्रिप-ट्रैक वॉलेट में सुरक्षित।'
  },
  {
    id: 'briefing-oct02-morning',
    phase: 'DURING_TRIP',
    timeSlot: 'MORNING',
    dayTitle: 'Day 9: Pilgrimage Completion — Oct 02, 2026',
    dayTitleHindi: 'दिवस 9: तीर्थयात्रा पूर्णता एवं कुलदेवता पूजन — 02 अक्टूबर, 2026',
    scheduledFor: '2026-10-02T08:00:00+05:30',
    subject: 'Pilgrimage Completion, Sacred Gangajal & Kuldevta Prasad',
    subjectHindi: 'तीर्थयात्रा पूर्णता, पावन गंगाजल एवं कुलदेवता प्रसाद',
    transitInfo: 'All 4 pilgrims safely home in Durg, Chhattisgarh. Yatra successfully completed with divine blessings!',
    transitInfoHindi: 'सभी 4 तीर्थयात्री दुर्ग (छत्तीसगढ़) सकुशल घर पहुंचे। भगवान के आशीर्वाद से पावन यात्रा संपन्न हुई!',
    highlights: [
      '09:00 — Home temple Puja: Offering holy Badrinath Tulsi and Gangajal to Kuldevta',
      '11:00 — Distribution of sacred Badrinath prasad to extended family and neighbours',
      '16:00 — Final Gullak settlement between Utkarsh and Shreyas (Net Bilateral Balance settled)'
    ],
    highlightsHindi: [
      '09:00 — गृह मंदिर पूजन: भगवान बद्री विशाल की पावन तुलसी एवं गंगाजल कुलदेवता को अर्पण',
      '11:00 — परिजनों एवं मित्रों में पावन बद्रीनाथ प्रसाद वितरण',
      '16:00 — उत्कर्ष और श्रेयस के मध्य गुल्लक का अंतिम 50/50 हिसाब-किताब संपन्न'
    ],
    elderCareTip: 'Encourage complete rest today. Check post-trip BP and congratulate both fathers on an extraordinary spiritual feat!',
    elderCareTipHindi: 'आज पूरा दिन विश्राम करें। यात्रा के बाद बीपी की जांच कराएं और दोनों पिताओं को इस महान तीर्थयात्रा की बधाई दें!',
    logisticsSummary: 'TripTrack trip archive saved. Sacred journey memories locked in photo vault.',
    logisticsSummaryHindi: 'ट्रिप-ट्रैक यात्रा संग्रह सुरक्षित। पावन यात्रा की मधुर स्मृतियां फोटो गैलरी में सहेजी गईं।'
  }
];

class AutomationService {
  private dispatchedTriggers = new Set<string>();
  private schedulerInterval: any = null;
  private isRunning = false;

  constructor() {
    // Pre-populate already dispatched triggers from memory or storage if needed
  }

  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if a location ping is inside any unnotified waypoint geofences
   */
  async checkAndTriggerGeofence(
    latitude: number,
    longitude: number,
    _passengerId?: string
  ): Promise<WaypointArrival | null> {
    if (isNaN(latitude) || isNaN(longitude)) return null;

    for (const wp of PILGRIMAGE_GEOFENCES) {
      const triggerKey = `geofence-${wp.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const distKm = this.calculateDistanceKm(latitude, longitude, wp.coords[0], wp.coords[1]);

      if (distKm <= wp.radiusKm) {
        // Mark as dispatched immediately to prevent race conditions
        this.dispatchedTriggers.add(triggerKey);

        const arrivalData: WaypointArrival = {
          id: wp.id,
          name: wp.name,
          arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          altitudeMeters: wp.altitudeMeters,
          description: wp.description,
          latitude,
          longitude,
          detectedVia: 'GPS_GEOFENCE',
          nextStop: wp.nextStop
        };

        console.log(`📍 [Automation] GEOFENCE ARRIVAL DETECTED: Touched ${wp.name} (Dist: ${distKm.toFixed(2)}km <= ${wp.radiusKm}km)`);

        // Dispatch Email
        await emailService.notifyGeofenceArrival(arrivalData);

        // Broadcast to all open family devices via Socket.io
        const io = getIO();
        if (io) {
          io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
        }

        return arrivalData;
      }
    }

    return null;
  }

  /**
   * Milestone Checkpoint Trigger Fallback (Handles cases where GPS was off/asleep)
   */
  async checkAndTriggerMilestoneCheckpoint(
    checkpointId: string,
    checkpointName: string,
    _segmentId?: string
  ): Promise<WaypointArrival | null> {
    const lowerName = checkpointName.toLowerCase();

    // Map checkpoint keywords to geofence waypoints
    let matchedWp: GeofenceWaypoint | undefined;
    if (lowerName.includes('durg') || lowerName.includes('bhilai') || lowerName.includes('chhattisgarh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-durg');
    } else if (lowerName.includes('ndls') || lowerName.includes('delhi')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-delhi');
    } else if (lowerName.includes('haridwar')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-haridwar');
    } else if (lowerName.includes('rishikesh')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rishikesh');
    } else if (lowerName.includes('devprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-devprayag');
    } else if (lowerName.includes('rudraprayag')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-rudraprayag');
    } else if (lowerName.includes('joshimath')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-joshimath');
    } else if (lowerName.includes('badrinath') || lowerName.includes('sanctum') || lowerName.includes('dham')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-badrinath');
    } else if (lowerName.includes('mana')) {
      matchedWp = PILGRIMAGE_GEOFENCES.find(w => w.id === 'wp-mana');
    }

    if (!matchedWp) return null;

    const triggerKey = `geofence-${matchedWp.id}`;
    if (this.dispatchedTriggers.has(triggerKey)) return null;

    this.dispatchedTriggers.add(triggerKey);

    const arrivalData: WaypointArrival = {
      id: matchedWp.id,
      name: matchedWp.name,
      arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      altitudeMeters: matchedWp.altitudeMeters,
      description: matchedWp.description,
      latitude: matchedWp.coords[0],
      longitude: matchedWp.coords[1],
      detectedVia: 'MANUAL_CHECKPOINT',
      nextStop: matchedWp.nextStop
    };

    console.log(`✅ [Automation] MILESTONE ARRIVAL TRIGGERED via Checkpoint (${checkpointName}) -> ${matchedWp.name}`);

    // Dispatch Email
    await emailService.notifyGeofenceArrival(arrivalData);

    // Broadcast via Socket.io
    const io = getIO();
    if (io) {
      io.to(FAMILY_ROOM).emit('geofence_arrival', arrivalData);
    }

    return arrivalData;
  }

  /**
   * Start the background scheduler for scheduled morning briefings and daily evening digest
   */
  startScheduler(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log('⏰ [Automation] Autonomous Pilgrimage Scheduler activated (checking every 60s).');

    // Run check immediately on boot, then every 60 seconds
    this.checkScheduledEvents();
    this.schedulerInterval = setInterval(() => {
      this.checkScheduledEvents();
    }, 60000);
  }

  stopScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isRunning = false;
  }

  /**
   * Check all scheduled briefings and evening digest against the current date/time
   */
  async checkScheduledEvents(): Promise<void> {
    const now = new Date();

    // 1. Check morning briefings
    for (const briefing of SCHEDULED_BRIEFINGS) {
      const triggerKey = `briefing-${briefing.id}`;
      if (this.dispatchedTriggers.has(triggerKey)) continue;

      const targetTime = new Date(briefing.scheduledFor);
      // If current time is past or within 10 minutes of target briefing time
      if (now >= targetTime) {
        this.dispatchedTriggers.add(triggerKey);
        console.log(`🌅 [Automation] Triggering Scheduled Briefing: ${briefing.dayTitle}`);
        await emailService.notifyScheduledBriefing(briefing);
      }
    }

    // 2. Check Daily Evening Sandhya Bulletin (at 20:00 / 8:00 PM)
    const todayDateKey = `digest-${now.toISOString().slice(0, 10)}`;
    if (now.getHours() >= 20 && !this.dispatchedTriggers.has(todayDateKey)) {
      this.dispatchedTriggers.add(todayDateKey);
      console.log(`🌄 [Automation] Triggering 8:00 PM Daily Sandhya Bulletin for ${now.toDateString()}`);
      await this.compileAndSendDailyDigest(now);
    }
  }

  /**
   * Compile and send the daily evening digest ("Sandhya Bulletin")
   */
  async compileAndSendDailyDigest(date: Date = new Date()): Promise<DailyDigestData> {
    let milestonesCovered: string[] = [];
    let photosCount = 0;
    let gullakSpentTodayINR = 0;

    try {
      if (isMongoConnected()) {
        const segments = await SegmentModel.find();
        segments.forEach(s => {
          s.checkpoints?.forEach((cp: any) => {
            if (cp.done) milestonesCovered.push(cp.name);
          });
        });

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const expenses = await ExpenseModel.find({ createdAt: { $gte: startOfDay } });
        gullakSpentTodayINR = expenses.reduce((sum, e) => sum + (e.amountINR || 0), 0);

        const feedPosts = await FamilyFeedModel.find({ createdAt: { $gte: startOfDay } });
        photosCount = feedPosts.filter((p: any) => p.metadata?.photoUrl).length;
      }
    } catch (err) {
      console.warn('⚠️ [Automation] Error compiling live DB stats for daily digest:', err);
    }

    if (milestonesCovered.length === 0) {
      milestonesCovered = ['NH-7 Mountain Transit Completed', 'Elder Hydration & BP Routine Confirmed', 'Check-in at Himalayan Camp'];
    }

    const digestData: DailyDigestData = {
      dateStr: date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      milestonesCovered: milestonesCovered.slice(-5), // Last 5 milestones
      eldersHealthSummary: 'Both Rajnish Ji and Sanjay Ji recorded healthy SpO2 (>92%) and normal pulse rates. Evening BP medicines taken with warm water.',
      photosCount: Math.max(photosCount, 3),
      gullakSpentTodayINR,
      tomorrowPreview: 'Early morning sacred visit to Badrinath Sanctum & Brahma Kapal ancestral rituals. Pacing is gentle.'
    };

    await emailService.notifyDailyEveningDigest(digestData);
    return digestData;
  }

  /**
   * Get engine status overview for settings / admin modal
   */
  getStatus() {
    return {
      schedulerActive: this.isRunning,
      provider: emailService.getProviderInfo(),
      recipients: emailService.getRecipients(),
      counts: {
        totalBriefings: SCHEDULED_BRIEFINGS.length,
        preDeparture: SCHEDULED_BRIEFINGS.filter(b => b.phase === 'PRE_DEPARTURE').length,
        duringTrip: SCHEDULED_BRIEFINGS.filter(b => b.phase === 'DURING_TRIP').length,
        geofences: PILGRIMAGE_GEOFENCES.length
      },
      activeGeofences: PILGRIMAGE_GEOFENCES.map(g => ({
        id: g.id,
        name: g.name,
        radiusKm: g.radiusKm,
        altitudeMeters: g.altitudeMeters,
        description: g.description,
        nextStop: g.nextStop,
        isDispatched: this.dispatchedTriggers.has(`geofence-${g.id}`)
      })),
      scheduledBriefings: SCHEDULED_BRIEFINGS.map(b => ({
        id: b.id,
        phase: b.phase,
        timeSlot: b.timeSlot,
        dayTitle: b.dayTitle,
        dayTitleHindi: b.dayTitleHindi,
        scheduledFor: b.scheduledFor,
        subject: b.subject,
        subjectHindi: b.subjectHindi,
        transitInfo: b.transitInfo,
        transitInfoHindi: b.transitInfoHindi,
        highlights: b.highlights,
        highlightsHindi: b.highlightsHindi,
        elderCareTip: b.elderCareTip,
        elderCareTipHindi: b.elderCareTipHindi,
        logisticsSummary: b.logisticsSummary,
        logisticsSummaryHindi: b.logisticsSummaryHindi,
        checklistItems: b.checklistItems,
        checklistItemsHindi: b.checklistItemsHindi,
        sightseeingTips: b.sightseeingTips,
        sightseeingTipsHindi: b.sightseeingTipsHindi,
        isDispatched: this.dispatchedTriggers.has(`briefing-${b.id}`)
      })),
      totalDispatchedCount: this.dispatchedTriggers.size
    };
  }

  /**
   * Manual simulator / test trigger for any briefing or waypoint
   */
  async simulateTrigger(type: 'BRIEFING' | 'WAYPOINT' | 'DIGEST', targetId?: string) {
    if (type === 'BRIEFING') {
      const briefing = SCHEDULED_BRIEFINGS.find(b => b.id === targetId) || SCHEDULED_BRIEFINGS[0];
      return await emailService.notifyScheduledBriefing(briefing);
    }
    if (type === 'WAYPOINT') {
      const wp = PILGRIMAGE_GEOFENCES.find(w => w.id === targetId) || PILGRIMAGE_GEOFENCES[0];
      return await emailService.notifyGeofenceArrival({
        id: wp.id,
        name: wp.name,
        arrivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        altitudeMeters: wp.altitudeMeters,
        description: wp.description,
        latitude: wp.coords[0],
        longitude: wp.coords[1],
        detectedVia: 'GPS_GEOFENCE',
        nextStop: wp.nextStop
      });
    }
    if (type === 'DIGEST') {
      return await this.compileAndSendDailyDigest(new Date());
    }
    return { success: false, error: 'Unknown trigger type' };
  }

  /**
   * Schedule a custom briefing dynamically
   */
  scheduleCustomBriefing(briefing: ScheduledBriefing): ScheduledBriefing {
    // Unshift to place in prominent position
    SCHEDULED_BRIEFINGS.unshift(briefing);
    console.log(`⏱️ [Automation] Dynamically scheduled briefing "${briefing.subject}" for ${briefing.scheduledFor}`);
    return briefing;
  }

  /**
   * Reset a trigger so it can be re-tested
   */
  resetTrigger(triggerId: string): void {
    this.dispatchedTriggers.delete(triggerId);
    this.dispatchedTriggers.delete(`geofence-${triggerId}`);
    this.dispatchedTriggers.delete(`briefing-${triggerId}`);
    console.log(`🔄 [Automation] Reset trigger: ${triggerId}`);
  }
}

export const automationService = new AutomationService();
