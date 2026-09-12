export interface StotraVerse {
  verseNumber: number;
  sanskrit: string;
  hindiMeaning: string;
}

export interface Stotra {
  id: string;
  titleHindi: string;
  titleEnglish: string;
  deity: string;
  significance: string;
  verses: StotraVerse[];
}

export const SACRED_STOTRAS: Stotra[] = [
  {
    id: 'stotra-badrinath-aarti',
    titleHindi: 'श्री बद्रीनाथ जी की आरती',
    titleEnglish: 'Shri Badrinath Ji Ki Aarti',
    deity: 'Lord Badri Vishal (Narayana)',
    significance: 'Sung daily during Shayan and Shringar Darshan in the golden sanctum of Badrinath.',
    verses: [
      {
        verseNumber: 1,
        sanskrit: 'पवन मंद सुगंध शीतल, हेम मंदिर शोभितम्।\nनिकट गंगा बहत निर्मल, श्री बद्रीनाथ विश्वम्भरम्॥',
        hindiMeaning: 'जहाँ मंद, सुगंधित और शीतल पवन बहती है और स्वर्ण मंदिर शोभायमान है; जिसके समीप पवित्र अलकनंदा गंगा बहती है, उन विश्वंभर श्री बद्रीनाथ जी को प्रणाम।'
      },
      {
        verseNumber: 2,
        sanskrit: 'शेष सुमरिन करत निशदिन, धरत ध्यान महेश्वरम्।\nश्री बद्रीनाथ विश्वम्भरम्, जय बद्रीनाथ दयालवम्॥',
        hindiMeaning: 'शेषनाग जिनका रात-दिन स्मरण करते हैं और स्वयं भगवान महेश्वर जिनका ध्यान धरते हैं; ऐसे कृपालु और दयालु भगवान बद्रीनाथ जी की जय हो।'
      },
      {
        verseNumber: 3,
        sanskrit: 'इंद्र चंद्र कुबेर ध्यावत, नारद शारद करत गानम्।\nश्री बद्रीनाथ विश्वम्भरम्, जय बद्रीनाथ दयालवम्॥',
        hindiMeaning: 'इंद्र, चंद्र और कुबेर जिनका ध्यान करते हैं, देवर्षि नारद और माता सरस्वती जिनके दिव्य गुणों का गान करते हैं।'
      },
      {
        verseNumber: 4,
        sanskrit: 'शक्ति गौरी गणेश श्रीहरि, ध्यान धरत निरंतरम्।\nतुलसी माला कंठ शोभित, श्री बद्रीनाथ विश्वम्भरम्॥',
        hindiMeaning: 'माता शक्ति, गौरी और गणेश जी जिनका निरंतर ध्यान करते हैं, जिनके श्रीकंठ में दिव्य वनमाला और तुलसी माला सुशोभित है।'
      }
    ]
  },
  {
    id: 'stotra-vishnu-sahasranama',
    titleHindi: 'विष्णु सहस्रनाम ध्यानम्',
    titleEnglish: 'Vishnu Sahasranama Dhyanam',
    deity: 'Lord Maha Vishnu',
    significance: 'Revealed by Bhishma Pitamaha on the bed of arrows; grants peace, protection, and Moksha.',
    verses: [
      {
        verseNumber: 1,
        sanskrit: 'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥',
        hindiMeaning: 'श्वेत वस्त्र धारण करने वाले, चंद्रमा के समान कांतिमान, चार भुजाओं वाले, प्रसन्न मुख श्री विष्णु का समस्त विघ्नों की शांति हेतु ध्यान करें।'
      },
      {
        verseNumber: 2,
        sanskrit: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं\nवन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
        hindiMeaning: 'शांत स्वरूप, शेषशय्या पर शयन करने वाले, नाभि में कमल धारण करने वाले, देवों के ईश, संसार के आधार, मेघवर्ण वाले, लक्ष्मीपति, कमलनयन और संसार के समस्त भय को हरने वाले भगवान विष्णु की मैं वंदना करता हूँ।'
      }
    ]
  },
  {
    id: 'stotra-hanuman-chalisa',
    titleHindi: 'श्री हनुमान चालीसा',
    titleEnglish: 'Shri Hanuman Chalisa',
    deity: 'Lord Hanuman (Sankat Mochan)',
    significance: 'Chanted along the winding Alaknanda mountain ghats for courage, protection, and removal of road obstacles.',
    verses: [
      {
        verseNumber: 1,
        sanskrit: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।\nबरनऊँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
        hindiMeaning: 'गुरु महाराज के चरण कमलों की रज से अपने मन रूपी दर्पण को पवित्र करके, मैं श्री रघुवीर के निर्मल यश का वर्णन करता हूँ, जो चारों फल (धर्म, अर्थ, काम, मोक्ष) देने वाला है।'
      },
      {
        verseNumber: 2,
        sanskrit: 'बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।\nबल बुधि बिद्या देहु मोहिं, हरहु कलेस बिकार॥',
        hindiMeaning: 'हे पवनपुत्र! मैं स्वयं को निर्बल और बुद्धिहीन जानकर आपका स्मरण करता हूँ; मुझे बल, बुद्धि और विद्या प्रदान करें और मेरे समस्त क्लेशों व विकारों को दूर करें।'
      },
      {
        verseNumber: 3,
        sanskrit: 'जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर॥\nराम दूत अतुलित बल धामा। अंजनि-पुत्र पवनसुत नामा॥',
        hindiMeaning: 'ज्ञान और गुणों के सागर श्री हनुमान जी की जय हो! तीनों लोकों में आपका पराक्रम प्रसिद्ध है। आप भगवान श्री राम के अतुलनीय बलशाली दूत और माता अंजनी के पवनपुत्र हैं।'
      },
      {
        verseNumber: 4,
        sanskrit: 'भूत पिसाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥\nनासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥',
        hindiMeaning: 'महावीर श्री हनुमान जी का नाम स्मरण करने से समस्त नकारात्मक शक्तियाँ दूर भागती हैं। उनके नाम के निरंतर जाप से समस्त रोग और कष्ट नष्ट हो जाते हैं।'
      }
    ]
  },
  {
    id: 'stotra-maha-mrityunjaya',
    titleHindi: 'महामृत्युंजय मंत्र (१०८ जप)',
    titleEnglish: 'Maha Mrityunjaya Mantra (108 Japa)',
    deity: 'Lord Tryambaka (Shiva)',
    significance: 'Supreme protective Vedic mantra for mountain safety, good health of elders, and longevity.',
    verses: [
      {
        verseNumber: 1,
        sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्यgroupोर्मुक्षीय मामृतात्॥',
        hindiMeaning: 'हम त्रिनेत्रधारी सुगंधित और पुष्टि का संवर्धन करने वाले भगवान शिव की वंदना करते हैं। जिस प्रकार पका हुआ खरबूजा बेल से मुक्त हो जाता है, उसी प्रकार हम मृत्यु के बंधनों से मुक्त होकर अमरत्व को प्राप्त हों।'
      }
    ]
  }
];
