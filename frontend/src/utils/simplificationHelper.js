/**
 * Medical Simplification & Educational Knowledge Helper
 * Strictly non-diagnostic and non-prescriptive.
 * Provides plain-language explanations in English, Hindi, and Hinglish.
 */

/**
 * Safely resolves localized strings whether the input is a string or an object { en, hi, hinglish }.
 * Prevents React child rendering errors.
 */
export function resolveLocalizedText(val, lang = 'en') {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const l = String(lang).toLowerCase().trim();
    if (l === 'hi' || l === 'hindi') {
      return val.hi || val.hinglish || val.en || '';
    }
    if (l === 'hinglish') {
      return val.hinglish || val.hi || val.en || '';
    }
    return val.en || val.hinglish || val.hi || '';
  }
  return String(val);
}

/**
 * Derives a clean category badge tag for any biomarker (e.g. Hemoglobin, Blood Sugar, Leukocytes).
 */
export function getBiomarkerCategoryTag(name = '') {
  const n = String(name).toLowerCase();
  if (n.includes('hemo') || n.includes('hb')) return 'Hemoglobin';
  if (n.includes('glucose') || n.includes('sugar') || n.includes('hba1c') || n.includes('ppbs')) return 'Blood Sugar';
  if (n.includes('wbc') || n.includes('white blood') || n.includes('leukocyte')) return 'Leukocytes';
  if (n.includes('platelet') || n.includes('thrombo')) return 'Thrombocytes';
  if (n.includes('alt') || n.includes('sgpt') || n.includes('ast') || n.includes('sgot') || n.includes('bilirubin')) return 'Liver Enzyme';
  if (n.includes('creatinine') || n.includes('bun') || n.includes('urea') || n.includes('egfr')) return 'Kidney Marker';
  if (n.includes('fsh') || n.includes('follicle')) return 'Hormone';
  if (n.includes('prolactin')) return 'Pituitary Hormone';
  if (n.includes('cholesterol') || n.includes('lipid') || n.includes('triglyceride') || n.includes('hdl') || n.includes('ldl')) return 'Lipid Profile';
  if (n.includes('tsh') || n.includes('thyroid') || n.includes('t3') || n.includes('t4')) return 'Thyroid';
  if (n.includes('vitamin')) return 'Vitamin';
  if (n.includes('calcium') || n.includes('sodium') || n.includes('potassium')) return 'Electrolyte';
  return name.split(' ')[0] || 'Biomarker';
}

export const MEDICAL_DICTIONARY = {
  hemoglobin: {
    tag: 'Hemoglobin',
    term: {
      en: 'Hemoglobin (Hb)',
      hi: 'हीमोग्लोबिन (Hb)',
      hinglish: 'Hemoglobin (Hb)',
    },
    meaning: {
      en: 'Oxygen-carrying protein in red blood cells that delivers oxygen throughout the body.',
      hi: 'लाल रक्त कोशिकाओं में ऑक्सीजन ले जाने वाला मुख्य प्रोटीन।',
      hinglish: 'Red blood cells me oxygen carry karne wala protein',
    },
  },
  creatinine: {
    tag: 'Kidney Marker',
    term: {
      en: 'Serum Creatinine',
      hi: 'सीरम क्रिएटिनिन',
      hinglish: 'Serum Creatinine',
    },
    meaning: {
      en: 'A natural waste product filtered by kidneys to assess renal filtration function.',
      hi: 'मांसपेशियों से निकलने वाला अपशिष्ट पदार्थ जिसे किडनी रक्त से छानती है।',
      hinglish: 'Muscles se nikalne wala waste jo kidney saaf karti hai',
    },
  },
  alt: {
    tag: 'Liver Enzyme',
    term: {
      en: 'ALT (Alanine Aminotransferase)',
      hi: 'एएलटी (लिवर एंजाइम)',
      hinglish: 'ALT (Alanine Aminotransferase)',
    },
    meaning: {
      en: 'An enzyme produced inside liver cells, measured to check liver health and cell integrity.',
      hi: 'लिवर कोशिकाओं में पाया जाने वाला एंजाइम जो लिवर स्वास्थ्य की निगरानी करता है।',
      hinglish: 'Liver cells ke andar ka protein enzyme',
    },
  },
  ast: {
    tag: 'Liver Enzyme',
    term: {
      en: 'AST (Aspartate Aminotransferase)',
      hi: 'एएसटी (एंजाइम)',
      hinglish: 'AST (Aspartate Aminotransferase)',
    },
    meaning: {
      en: 'An enzyme found in liver and muscle cells, released when cells experience strain.',
      hi: 'लिवर और मांसपेशियों में पाया जाने वाला एंजाइम।',
      hinglish: 'Liver aur muscle cells me paya jane wala enzyme jo strain me release hota hai.',
    },
  },
  glucose: {
    tag: 'Blood Sugar',
    term: {
      en: 'Fasting Blood Glucose',
      hi: 'फास्टिंग ब्लड ग्लूकोज (शुगर)',
      hinglish: 'Fasting Blood Glucose',
    },
    meaning: {
      en: 'Energy sugar circulating in bloodstream after an overnight fast.',
      hi: 'रात भर उपवास के बाद रक्त में मौजूद मुख्य ऊर्जा शर्करा (शुगर)।',
      hinglish: 'Blood me present energy sugar',
    },
  },
  wbc: {
    tag: 'Leukocytes',
    term: {
      en: 'White Blood Cell (WBC)',
      hi: 'श्वेत रक्त कोशिकाएं (WBC)',
      hinglish: 'White Blood Cell (WBC)',
    },
    meaning: {
      en: 'Infection-fighting immune defense cells that guard your body.',
      hi: 'संक्रमण और बीमारियों से लड़ने वाली प्रतिरक्षा कोशिकाएं।',
      hinglish: 'Infection se ladne wali immune cells',
    },
  },
  platelet: {
    tag: 'Thrombocytes',
    term: {
      en: 'Platelet Count',
      hi: 'प्लेटलेट काउंट',
      hinglish: 'Platelet Count',
    },
    meaning: {
      en: 'Blood cells that form clots to stop bleeding when blood vessels are injured.',
      hi: 'चोट लगने पर रक्त का थक्का बनाकर रक्तस्राव रोकने वाली कोशिकाएं।',
      hinglish: 'Cut lagne par blood clot banane wali cells',
    },
  },
  fsh: {
    tag: 'Hormone',
    term: {
      en: 'FSH (Follicle Stimulating Hormone)',
      hi: 'एफएसएच (हार्मोन)',
      hinglish: 'FSH (Follicle Stimulating Hormone)',
    },
    meaning: {
      en: 'A pituitary hormone that regulates reproductive cycles, ovaries, and egg development.',
      hi: 'पिट्यूटरी ग्रंथि द्वारा निर्मित हार्मोन जो प्रजनन चक्र और डिंबोत्सर्जन को नियंत्रित करता है।',
      hinglish: 'Pituitary hormone jo reproductive cycle aur hormone balance regulate karta hai.',
    },
  },
  prolactin: {
    tag: 'Pituitary Hormone',
    term: {
      en: 'Prolactin',
      hi: 'प्रोलैक्टिन',
      hinglish: 'Prolactin',
    },
    meaning: {
      en: 'A hormone produced by anterior pituitary gland, involved in metabolism and reproductive health.',
      hi: 'पिट्यूटरी ग्रंथि द्वारा निर्मित हार्मोन जो चयापचय और प्रजनन स्वास्थ्य में सहायक है।',
      hinglish: 'Pituitary gland dwara banne wala hormone jo reproductive health se juda hai.',
    },
  },
  hba1c: {
    tag: 'Blood Sugar',
    term: {
      en: 'HbA1c (Glycated Hemoglobin)',
      hi: 'एचबीए1सी (3 माह का औसत शुगर)',
      hinglish: 'HbA1c (Glycated Hemoglobin)',
    },
    meaning: {
      en: 'Average blood sugar levels over the past 2 to 3 months.',
      hi: 'पिछले 2 से 3 महीनों का औसत ब्लड शुगर स्तर।',
      hinglish: 'Pichhle 2-3 months ka average blood sugar level.',
    },
  },
  cholesterol: {
    tag: 'Lipid Profile',
    term: {
      en: 'Total Cholesterol',
      hi: 'कोलेस्ट्रॉल (कुल वसा)',
      hinglish: 'Total Cholesterol',
    },
    meaning: {
      en: 'Total lipid fat circulating in your bloodstream.',
      hi: 'रक्त में मौजूद कुल वसा (लिपिड)।',
      hinglish: 'Blood me present total fat (cholesterol) level.',
    },
  },
  tsh: {
    tag: 'Thyroid',
    term: {
      en: 'TSH (Thyroid Stimulating Hormone)',
      hi: 'टीएसएच (थायरॉयड हार्मोन)',
      hinglish: 'TSH (Thyroid Stimulating Hormone)',
    },
    meaning: {
      en: 'Hormone from pituitary gland that directs thyroid gland metabolism.',
      hi: 'थायरॉयड ग्रंथि की कार्यप्रणाली और मेटाबॉलिज्म को नियंत्रित करने वाला हार्मोन।',
      hinglish: 'Thyroid gland ki activity aur metabolism control karne wala hormone.',
    },
  },
};

/**
 * Matches raw biomarker test names to dictionary keys.
 */
export function getDictionaryKey(rawName = '') {
  if (!rawName) return null;
  const clean = rawName.toLowerCase();

  if (clean.includes('hemo') || clean.includes('hb') || clean.includes('haemo')) return 'hemoglobin';
  if (clean.includes('fsh') || clean.includes('follicle')) return 'fsh';
  if (clean.includes('prolactin')) return 'prolactin';
  if (clean.includes('creatinine')) return 'creatinine';
  if (clean.includes('alt') || clean.includes('sgpt')) return 'alt';
  if (clean.includes('ast') || clean.includes('sgot')) return 'ast';
  if (clean.includes('glucose') || clean.includes('sugar')) return 'glucose';
  if (clean.includes('wbc') || clean.includes('white blood') || clean.includes('leukocyte')) return 'wbc';
  if (clean.includes('platelet') || clean.includes('thrombo')) return 'platelet';
  if (clean.includes('hba1c') || clean.includes('glycated')) return 'hba1c';
  if (clean.includes('cholesterol') || clean.includes('lipid')) return 'cholesterol';
  if (clean.includes('tsh') || clean.includes('thyroid')) return 'tsh';

  return null;
}

/**
 * Returns clean, verified plain-language breakdown for each biomarker test.
 */
export function getTestDetailedExplanation(test, language = 'en') {
  if (!test) return {};

  const normLang = String(language).toLowerCase().startsWith('hi')
    ? (String(language).toLowerCase() === 'hinglish' ? 'hinglish' : 'hi')
    : (String(language).toLowerCase() === 'hinglish' ? 'hinglish' : 'en');

  const name = test.name || test.testName || 'Clinical Biomarker';
  const val = test.value !== undefined && test.value !== null ? String(test.value) : 'Recorded';
  const unit = test.unit || '';
  const ref = test.referenceRange || 'Not Specified';
  const status = (test.status || 'unable_to_determine').toLowerCase();
  const dictKey = getDictionaryKey(name);
  const dictEntry = dictKey ? MEDICAL_DICTIONARY[dictKey] : null;

  // 1. Clinical Meaning (Subtitle)
  let simpleMeaning = '';
  if (test.simpleMeaning) {
    simpleMeaning = resolveLocalizedText(test.simpleMeaning, normLang);
  }
  if (!simpleMeaning && dictEntry) {
    simpleMeaning = dictEntry.meaning[normLang] || dictEntry.meaning.en;
  }
  if (!simpleMeaning) {
    if (normLang === 'hi') {
      simpleMeaning = `रक्त में ${name} के स्तर की जांच करने वाला परीक्षण।`;
    } else if (normLang === 'hinglish') {
      simpleMeaning = `Blood me ${name} ke level ko assess karne wala biomarker.`;
    } else {
      simpleMeaning = `Measures circulating levels of ${name} in blood.`;
    }
  }

  // 2. Category Tag
  const categoryTag = dictEntry?.tag || getBiomarkerCategoryTag(name);

  // 3. What it means (Simple Explanation for table card)
  let whatItMeans = '';
  // Check if test already has a pre-tailored explanation (e.g. from mockReports or backend)
  if (test.explanation) {
    const candidate = resolveLocalizedText(test.explanation, normLang);
    if (candidate && !candidate.toLowerCase().includes('teststatus')) {
      whatItMeans = candidate;
    }
  }
  if (!whatItMeans && test.simpleExplanation) {
    const candidate = resolveLocalizedText(test.simpleExplanation, normLang);
    if (candidate && !candidate.toLowerCase().includes('teststatus')) {
      whatItMeans = candidate;
    }
  }

  // If no clean explanation was provided, generate standard patient explanation
  if (!whatItMeans) {
    const minVal = test.minRange !== undefined ? test.minRange : test.min;
    const maxVal = test.maxRange !== undefined ? test.maxRange : test.max;

    if (status === 'low') {
      const limitText = minVal !== undefined && minVal !== null ? `${minVal}` : (ref !== 'Not Specified' ? ref : 'normal limit');
      if (normLang === 'hi') {
        whatItMeans = `परिणाम (${val}) सामान्य सीमा ${limitText} से थोड़ा कम है। हल्की थकान या ऊर्जा में कमी महसूस हो सकती है।`;
      } else if (normLang === 'hinglish') {
        whatItMeans = `Result (${val}) normal limit ${limitText} se thoda kam hai. Isse halki thakan feel ho sakti hai.`;
      } else {
        whatItMeans = `Result (${val} ${unit}) is below the normal limit (${limitText}). Mild fatigue or lower energy may occur.`;
      }
    } else if (status === 'high') {
      const limitText = maxVal !== undefined && maxVal !== null ? `${maxVal}` : (ref !== 'Not Specified' ? ref : 'normal limit');
      if (normLang === 'hi') {
        whatItMeans = `परिणाम (${val}) सामान्य सीमा ${limitText} से अधिक है। खान-पान या हाल के तनाव से स्तर बढ़ सकता है।`;
      } else if (normLang === 'hinglish') {
        whatItMeans = `Result (${val}) normal limit ${limitText} se thoda zyada hai. Diet ya temporary biological variation se ho sakta hai.`;
      } else {
        whatItMeans = `Result (${val} ${unit}) is above the normal limit (${limitText}). May be influenced by diet, hydration, or activity.`;
      }
    } else if (status === 'normal') {
      if (normLang === 'hi') {
        whatItMeans = `सामान्य परिणाम! यह बायोमार्कर पूरी तरह स्वस्थ और संतुलित सीमा में है।`;
      } else if (normLang === 'hinglish') {
        whatItMeans = `Normal result! Is biomarker ka regulation healthy hai aur koi abnormality nahi hai.`;
      } else {
        whatItMeans = `Normal result! Value falls comfortably within the healthy biological reference range.`;
      }
    } else {
      if (normLang === 'hi') {
        whatItMeans = `परिणाम ${val} ${unit} दर्ज है। रिपोर्ट पर कोई स्पष्ट संदर्भ सीमा उल्लेखित नहीं है।`;
      } else if (normLang === 'hinglish') {
        whatItMeans = `Result ${val} ${unit}. Lab reference range report par clearly mention nahi hai.`;
      } else {
        whatItMeans = `Result recorded as ${val} ${unit}. Reference range was not specified on this report.`;
      }
    }
  }

  // 4. Discussion with doctor
  let whatToDiscuss = '';
  if (status === 'high' || status === 'low') {
    if (normLang === 'hi') {
      whatToDiscuss = `यह परिणाम अपने डॉक्टर को दिखाएं। उनसे पूछें कि क्या दोबारा जांच या जीवनशैली में बदलाव की आवश्यकता है।`;
    } else if (normLang === 'hinglish') {
      whatToDiscuss = `Ye result apne doctor ke sath review karein. Unse poochhein ki kya repeat test ya lifestyle adjustment ki zaroorat hai.`;
    } else {
      whatToDiscuss = `Review this finding with your doctor to discuss whether follow-up testing or lifestyle adjustments are helpful.`;
    }
  } else if (status === 'normal') {
    if (normLang === 'hi') {
      whatToDiscuss = `इस टेस्ट के लिए किसी विशेष चिकित्सा हस्तक्षेप की आवश्यकता नहीं है। स्वस्थ आदतें जारी रखें।`;
    } else if (normLang === 'hinglish') {
      whatToDiscuss = `Is test ke liye koi specific urgency nahi hai. Healthy nutrition aur regular wellness habits continue rakhein.`;
    } else {
      whatToDiscuss = `No specific medical action needed. Continue your balanced nutrition and routine wellness habits.`;
    }
  } else {
    if (normLang === 'hi') {
      whatToDiscuss = `यह रिपोर्ट डॉक्टर को दिखाएं ताकि वे प्रयोगशाला के मानकों के अनुसार इसका मूल्यांकन कर सकें।`;
    } else if (normLang === 'hinglish') {
      whatToDiscuss = `Doctor ko original report dikhayein taaki wo lab ke specific internal reference thresholds ke mutabiq assess kar sakein.`;
    } else {
      whatToDiscuss = `Present this original report to your healthcare provider for evaluation against their diagnostic standards.`;
    }
  }

  return {
    id: test.id,
    name: dictEntry ? dictEntry.term[normLang] : name,
    rawName: name,
    value: val,
    unit,
    referenceRange: ref,
    status,
    categoryTag,
    simpleMeaning,
    whatItMeans,
    whatToDiscuss,
  };
}

/**
 * Builds high-level 4-section executive summary.
 */
export function generateSimpleReportSummary(report, language = 'en') {
  if (!report) return null;

  const normLang = String(language).toLowerCase().startsWith('hi')
    ? (String(language).toLowerCase() === 'hinglish' ? 'hinglish' : 'hi')
    : (String(language).toLowerCase() === 'hinglish' ? 'hinglish' : 'en');

  const tests = Array.isArray(report.tests) ? report.tests : [];
  const abnormalTests = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
  });
  const normalTests = tests.filter((t) => (t.status || '').toLowerCase() === 'normal');
  const unableTests = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'unable_to_determine' || !s;
  });

  // Overall text
  let overall = '';
  if (report.summary) {
    overall = resolveLocalizedText(report.summary, normLang);
  }
  if (!overall) {
    if (abnormalTests.length === 0) {
      if (normLang === 'hi') {
        overall = `इस रिपोर्ट के सभी ${tests.length} बायोमार्कर सामान्य संदर्भ सीमाओं के भीतर हैं।`;
      } else if (normLang === 'hinglish') {
        overall = `Is report ke sabhi ${tests.length} biomarkers normal reference range ke andar hain.`;
      } else {
        overall = `All ${tests.length} evaluated biomarkers in this report are within standard reference ranges.`;
      }
    } else {
      const names = abnormalTests.map((t) => t.name || t.testName).slice(0, 3).join(', ');
      if (normLang === 'hi') {
        overall = `इस रिपोर्ट में ${tests.length} में से ${abnormalTests.length} परीक्षण सामान्य सीमा से बाहर हैं (${names})। बाकी परिणाम सामान्य हैं।`;
      } else if (normLang === 'hinglish') {
        overall = `Is report me ${tests.length} me se ${abnormalTests.length} test results normal range se bahar hain (${names}). Baaki sab biomarkers normal hain.`;
      } else {
        overall = `In this report, ${abnormalTests.length} of ${tests.length} tests are outside standard ranges (${names}). Remaining biomarkers are within normal limits.`;
      }
    }
  }

  // Key takeaways
  const keyTakeaways = [];
  if (abnormalTests.length > 0) {
    if (normLang === 'hi') {
      keyTakeaways.push(`अपने डॉक्टर से परामर्श लें और असामान्य परिणामों (${abnormalTests.map((t) => t.name || t.testName).slice(0, 2).join(', ')}) पर चर्चा करें।`);
      keyTakeaways.push(`रिपोर्ट के आधार पर स्वयं कोई दवा शुरू या बंद न करें।`);
    } else if (normLang === 'hinglish') {
      keyTakeaways.push(`Doctor visit par abnormal values (${abnormalTests.map((t) => t.name || t.testName).slice(0, 2).join(', ')}) ko highlight karein.`);
      keyTakeaways.push(`Bina doctor ki salah ke khud koi medication start ya stop na karein.`);
    } else {
      keyTakeaways.push(`Share findings outside standard limits (${abnormalTests.map((t) => t.name || t.testName).slice(0, 2).join(', ')}) with your doctor.`);
      keyTakeaways.push(`Do not self-medicate or modify existing prescriptions based solely on report numbers.`);
    }
  } else {
    if (normLang === 'hi') {
      keyTakeaways.push(`सभी बायोमार्कर स्वस्थ सीमा में हैं। नियमित दिनचर्या और पौष्टिक आहार जारी रखें।`);
    } else if (normLang === 'hinglish') {
      keyTakeaways.push(`Sabhi biomarkers normal hain. Healthy lifestyle aur regular hydration continue rakhein.`);
    } else {
      keyTakeaways.push(`All tested markers are within normal limits. Maintain balanced nutrition and healthy habits.`);
    }
  }

  return {
    overall,
    abnormalCount: abnormalTests.length,
    normalCount: normalTests.length,
    unableCount: unableTests.length,
    keyTakeaways,
    normalFindings: {
      tests: normalTests.map((t) => t.name || t.testName),
      message: normLang === 'hi'
        ? `${normalTests.length} परीक्षण पूरी तरह सामान्य और संतुलित हैं।`
        : normLang === 'hinglish'
        ? `${normalTests.length} tests bilkul normal aur healthy range me hain.`
        : `${normalTests.length} tests are comfortably within normal limits.`,
    },
    discussionValues: unableTests.map((t) => ({
      name: t.name || t.testName,
      result: `${t.value} ${t.unit || ''}`.trim(),
      reason: normLang === 'hi' ? 'संदर्भ सीमा उल्लेखित नहीं' : normLang === 'hinglish' ? 'Reference range not specified' : 'Reference range not specified',
    })),
  };
}
