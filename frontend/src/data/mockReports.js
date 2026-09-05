// Multilingual mock medical report data for Medical Report Simplifier
// Languages supported: English ('en'), Hindi ('hi'), Hinglish ('hinglish')

export const mockReports = [
  {
    id: 'rep-001',
    name: 'Complete Blood Count (CBC) & Metabolic Panel',
    shortName: 'CBC & Metabolic Panel',
    date: 'Sep 02, 2026',
    rawDate: '2026-09-02',
    labName: 'Metropolis Diagnostics & Health Lab',
    orderingPhysician: 'Dr. Arvind Kulkarni, MD',
    patientName: 'Sarah Jenkins',
    patientAge: 38,
    patientGender: 'Female',
    status: 'attention', // 'normal' | 'attention'
    totalTests: 6,
    normalCount: 4,
    abnormalCount: 2,
    fileName: 'CBC_Metabolic_Sept2026.pdf',
    fileSize: '1.4 MB',

    // Multilingual executive summaries
    summary: {
      en: "Your blood test indicates good blood sugar balance, normal electrolytes, and healthy kidney function. However, your Hemoglobin is slightly lower than standard levels (indicating mild anemia), and your ALT liver enzyme is mildly elevated.",
      hi: "आपकी रक्त जांच रिपोर्ट के अनुसार आपका ब्लड शुगर, इलेक्ट्रोलाइट्स और किडनी पूरी तरह स्वस्थ हैं। हालांकि, आपका हीमोग्लोबिन सामान्य से थोड़ा कम है (हल्के एनीमिया का संकेत) और लीवर एंजाइम (ALT) थोड़ा बढ़ा हुआ है।",
      hinglish: "Aapki blood report me blood sugar, electrolytes aur kidney bilkul healthy hain. Lekin Hemoglobin normal se thoda low hai (mild anemia ka sign) aur ALT liver enzyme thoda elevated hai.",
    },

    // Important Findings outside the normal reference range
    importantFindings: [
      {
        id: 'f-1',
        testName: 'Hemoglobin (Hb)',
        value: '10.2',
        unit: 'g/dL',
        referenceRange: '12.0 – 15.5 g/dL',
        status: 'low',
        medicalTerm: 'Mild Anemia',
        explanation: {
          en: 'Your red blood cells carry less oxygen than usual. This is a common and usually treatable condition that can cause you to feel tired or sluggish.',
          hi: 'आपके खून में लाल रक्त कोशिकाएं सामान्य से कम ऑक्सीजन पहुंचा रही हैं। यह एक सामान्य स्थिति है जिससे आपको कमजोरी या थकान लग सकती है।',
          hinglish: 'Aapke red blood cells body ko normal se kam oxygen deliver kar rahe hain. Is wajah se thakan ya energy low feel ho sakti hai.',
        },
      },
      {
        id: 'f-2',
        testName: 'ALT (Alanine Aminotransferase)',
        value: '48',
        unit: 'U/L',
        referenceRange: '7 – 35 U/L',
        status: 'high',
        medicalTerm: 'Mild Liver Enzyme Elevation',
        explanation: {
          en: 'ALT is an enzyme found inside liver cells. Mild elevations often happen due to recent medications, temporary stress, or dietary factors.',
          hi: 'ALT एक एंजाइम है जो लीवर कोशिकाओं में होता है। दवाओं, तनाव या खान-पान के कारण यह थोड़ा बढ़ सकता है।',
          hinglish: 'ALT ek liver enzyme hai. Kisi dawai, temporary stress ya diet ki wajah se yeh thoda badh sakta hai.',
        },
      },
    ],

    // Core AI Simple Explanations (Medical Term -> Simple Meaning -> Easy Explanation)
    aiExplanations: [
      {
        id: 'term-1',
        medicalTerm: {
          en: 'Anemia (Low Hemoglobin)',
          hi: 'एनीमिया (कम हीमोग्लोबिन)',
          hinglish: 'Anemia (Low Hemoglobin)',
        },
        simpleMeaning: {
          en: 'A lower-than-expected amount of oxygen-carrying protein in the blood.',
          hi: 'खून में ऑक्सीजन ले जाने वाले प्रोटीन (हीमोग्लोबिन) की कमी।',
          hinglish: 'Blood me oxygen deliver karne wale protein ki kami hona.',
        },
        easyExplanation: {
          en: 'Hemoglobin acts like a delivery truck transporting oxygen from your lungs to your muscles and brain. When it is low, your body works harder to get oxygen, which explains why you might feel tired or easily exhausted.',
          hi: 'हीमोग्लोबिन आपके फेफड़ों से शरीर की मांसपेशियों तक ऑक्सीजन पहुंचाने वाली गाड़ी की तरह काम करता है। कम होने पर शरीर को मेहनत करनी पड़ती है और थकान होती है।',
          hinglish: 'Hemoglobin ek delivery truck ki tarah oxygen ko body me ghumata hai. Jab yeh kam hota hai toh body ko thoda extra zor lagana padta hai, jisse thakan lagti hai.',
        },
        relatedTest: 'Hemoglobin (Hb)',
      },
      {
        id: 'term-2',
        medicalTerm: {
          en: 'Alanine Aminotransferase (ALT)',
          hi: 'एलानिन एमिनोट्रांसफरेज (ALT)',
          hinglish: 'Alanine Aminotransferase (ALT)',
        },
        simpleMeaning: {
          en: 'An enzyme produced primarily inside liver cells.',
          hi: 'लीवर कोशिकाओं में बनने वाला एक विशेष एंजाइम।',
          hinglish: 'Liver cells ke andar banne wala ek natural enzyme.',
        },
        easyExplanation: {
          en: 'When liver cells experience temporary irritation or workload, tiny amounts of ALT leak into your bloodstream. A result of 48 U/L is only mildly elevated and is very commonly reversible.',
          hi: 'जब लीवर कोशिकाओं पर थोड़ा दबाव होता है, तो ALT खून में आ जाता है। 48 U/L का स्तर हल्का बढ़ा हुआ है और खानपान सुधारने से अक्सर सामान्य हो जाता है।',
          hinglish: 'Jab liver par halka stress ya load hota hai, tab ALT blood me release hota hai. 48 U/L ka level halka elevated hai aur lifestyle se normal ho jata hai.',
        },
        relatedTest: 'ALT (SGPT)',
      },
      {
        id: 'term-3',
        medicalTerm: {
          en: 'Fasting Blood Glucose',
          hi: 'फास्टिंग ब्लड ग्लूकोज (शुगर)',
          hinglish: 'Fasting Blood Glucose (Sugar)',
        },
        simpleMeaning: {
          en: 'The amount of sugar in your bloodstream after an overnight fast.',
          hi: 'रातभर खाली पेट रहने के बाद खून में शुगर की मात्रा।',
          hinglish: 'Raat bhar empty stomach rehne ke baad blood me sugar level.',
        },
        easyExplanation: {
          en: 'Glucose provides your cells with energy. A value of 92 mg/dL is within the ideal healthy range (70–100 mg/dL), confirming that your insulin response is working properly.',
          hi: 'ग्लूकोज शरीर को ऊर्जा देता है। 92 mg/dL बिल्कुल स्वस्थ स्तर है, जो दर्शाता है कि इंसुलिन ठीक से काम कर रहा है।',
          hinglish: 'Glucose body ko energy deta hai. 92 mg/dL ideal healthy range me hai, matlab aapka sugar control bilkul perfect hai.',
        },
        relatedTest: 'Fasting Glucose',
      },
      {
        id: 'term-4',
        medicalTerm: {
          en: 'Estimated GFR (eGFR)',
          hi: 'अनुमानित जीएफआर (किडनी फिल्टरेशन दर)',
          hinglish: 'Estimated GFR (Kidney Filtration Rate)',
        },
        simpleMeaning: {
          en: 'A score showing how efficiently your kidneys clean your blood.',
          hi: 'किडनी द्वारा खून को साफ करने की कार्यक्षमता का माप।',
          hinglish: 'Kidney kitni achhi tarah waste filter kar rahi hai uska score.',
        },
        easyExplanation: {
          en: 'Your kidneys filter out toxins 24/7. An eGFR of 96 mL/min indicates excellent, healthy kidney function with zero filtration impairment.',
          hi: 'आपकी किडनी लगातार कचरा बाहर निकालती है। 96 का स्तर बताता है कि आपकी किडनी बहुत बेहतरीन तरीके से काम कर रही है।',
          hinglish: 'Kidney continuously waste filter karti hai. 96 ka score batata hai ki kidney filtration top shape me hai.',
        },
        relatedTest: 'eGFR',
      },
    ],

    // Individual test items with clear status indicators
    tests: [
      {
        id: 't-1',
        name: 'Hemoglobin (Hb)',
        medicalTerm: 'Hemoglobin',
        value: '10.2',
        numericValue: 10.2,
        unit: 'g/dL',
        referenceRange: '12.0 – 15.5 g/dL',
        min: 12.0,
        max: 15.5,
        status: 'low',
        simpleMeaning: {
          en: 'Oxygen-carrying protein in red blood cells',
          hi: 'लाल रक्त कोशिकाओं में ऑक्सीजन ले जाने वाला प्रोटीन',
          hinglish: 'Red blood cells me oxygen carry karne wala protein',
        },
        explanation: {
          en: 'Result (10.2 g/dL) is below the standard minimum of 12.0. Can cause mild fatigue or tiredness.',
          hi: 'परिणाम (10.2) सामान्य न्यूनतम 12.0 से कम है। इससे हल्की कमजोरी महसूस हो सकती है।',
          hinglish: 'Result (10.2) normal limit 12.0 se thoda kam hai. Isse halki thakan feel ho sakti hai.',
        },
      },
      {
        id: 't-2',
        name: 'Fasting Blood Glucose',
        medicalTerm: 'Blood Sugar',
        value: '92',
        numericValue: 92,
        unit: 'mg/dL',
        referenceRange: '70 – 100 mg/dL',
        min: 70,
        max: 100,
        status: 'normal',
        simpleMeaning: {
          en: 'Energy sugar circulating in bloodstream',
          hi: 'खून में मौजूद ऊर्जा देने वाली शुगर',
          hinglish: 'Blood me present energy sugar',
        },
        explanation: {
          en: 'Normal result! Shows healthy glucose regulation without signs of diabetes.',
          hi: 'सामान्य परिणाम! दर्शाता है कि शरीर में शुगर नियंत्रण बिल्कुल स्वस्थ है।',
          hinglish: 'Normal result! Sugar regulation healthy hai, diabetes ka koi sign nahi hai.',
        },
      },
      {
        id: 't-3',
        name: 'White Blood Cell (WBC)',
        medicalTerm: 'Leukocytes',
        value: '6.8',
        numericValue: 6.8,
        unit: '×10³/µL',
        referenceRange: '4.5 – 11.0 ×10³/µL',
        min: 4.5,
        max: 11.0,
        status: 'normal',
        simpleMeaning: {
          en: 'Infection-fighting immune cells',
          hi: 'संक्रमण से लड़ने वाली रोग-प्रतिरोधक कोशिकाएं',
          hinglish: 'Infection se ladne wali immune cells',
        },
        explanation: {
          en: 'Normal count. Indicates immune system is in balanced surveillance with no active acute infection.',
          hi: 'सामान्य स्तर। दर्शाता है कि प्रतिरक्षा प्रणाली संतुलित है और कोई गंभीर संक्रमण नहीं है।',
          hinglish: 'Normal count. Immune system balanced hai aur koi acute infection nahi hai.',
        },
      },
      {
        id: 't-4',
        name: 'Platelet Count',
        medicalTerm: 'Thrombocytes',
        value: '242',
        numericValue: 242,
        unit: '×10³/µL',
        referenceRange: '150 – 450 ×10³/µL',
        min: 150,
        max: 450,
        status: 'normal',
        simpleMeaning: {
          en: 'Cells that help blood clot to stop bleeding',
          hi: 'खून का थक्का जमाकर रक्तस्राव रोकने वाली कोशिकाएं',
          hinglish: 'Cut lagne par blood clot banane wali cells',
        },
        explanation: {
          en: 'Normal result. Blood clots appropriately without excess risk of abnormal bleeding.',
          hi: 'सामान्य परिणाम। चोट लगने पर खून का थक्का सामान्य गति से जमता है।',
          hinglish: 'Normal result. Blood clotting mechanism bilkul theek hai.',
        },
      },
      {
        id: 't-5',
        name: 'Alanine Aminotransferase (ALT)',
        medicalTerm: 'Liver Enzyme',
        value: '48',
        numericValue: 48,
        unit: 'U/L',
        referenceRange: '7 – 35 U/L',
        min: 7,
        max: 35,
        status: 'high',
        simpleMeaning: {
          en: 'Enzyme produced inside liver cells',
          hi: 'लीवर कोशिकाओं द्वारा बनाया जाने वाला एंजाइम',
          hinglish: 'Liver cells ke andar ka protein enzyme',
        },
        explanation: {
          en: 'Mildly elevated above 35 U/L. Often temporary; commonly caused by medications or diet.',
          hi: '35 से थोड़ा ऊपर। अक्सर सामान्य कारणों जैसे दवाओं या खान-पान से बढ़ता है।',
          hinglish: '35 se thoda high hai. Aksar kisi dawai ya diet ki wajah se temporarily badh jata hai.',
        },
      },
      {
        id: 't-6',
        name: 'Serum Creatinine',
        medicalTerm: 'Renal Waste Marker',
        value: '0.82',
        numericValue: 0.82,
        unit: 'mg/dL',
        referenceRange: '0.60 – 1.10 mg/dL',
        min: 0.60,
        max: 1.10,
        status: 'normal',
        simpleMeaning: {
          en: 'Waste filtered by kidneys from muscle use',
          hi: 'मांसपेशियों द्वारा उत्पन्न अपशिष्ट जिसे किडनी साफ करती है',
          hinglish: 'Muscles se nikalne wala waste jo kidney saaf karti hai',
        },
        explanation: {
          en: 'Normal level. Indicates your kidneys are filtering waste properly.',
          hi: 'सामान्य स्तर। दर्शाता है कि आपकी किडनी ठीक से कचरा साफ कर रही है।',
          hinglish: 'Normal level. Kidneys waste ko sahi tarah se filter kar rahi hain.',
        },
      },
      {
        id: 't-7',
        name: 'Vitamin D (25-Hydroxy)',
        medicalTerm: 'Vitamin D',
        value: '22',
        numericValue: 22,
        unit: 'ng/mL',
        referenceRange: 'Not Specified in Report',
        min: null,
        max: null,
        status: 'unable_to_determine',
        simpleMeaning: {
          en: 'Nutrient vital for bone calcium absorption and immune health',
          hi: 'हड्डियों की मजबूती और रोग-प्रतिरोधक क्षमता के लिए आवश्यक विटामिन',
          hinglish: 'Bones ki strength aur immunity ke liye zaroori nutrient',
        },
        explanation: {
          en: 'No reference interval was provided on the lab sheet. Discuss this level with your physician to determine if supplementation is needed.',
          hi: 'लैब रिपोर्ट में संदर्भ सीमा नहीं दी गई थी। अपने डॉक्टर से इस परिणाम पर परामर्श लें।',
          hinglish: 'Lab report me reference range nahi di gayi thi. Apne doctor se consult karein.',
        },
      },
    ],
  },
  {
    id: 'rep-002',
    name: 'Comprehensive Lipid & Cholesterol Profile',
    shortName: 'Lipid & Cholesterol',
    date: 'Aug 18, 2026',
    rawDate: '2026-08-18',
    labName: 'Apex Pathology Screening',
    orderingPhysician: 'Dr. Meera Sharma, MD',
    patientName: 'Sarah Jenkins',
    patientAge: 38,
    patientGender: 'Female',
    status: 'attention',
    totalTests: 4,
    normalCount: 2,
    abnormalCount: 2,
    fileName: 'Cardio_Lipid_Aug2026.pdf',
    fileSize: '980 KB',

    summary: {
      en: "Your good HDL cholesterol and triglycerides are in a protective healthy range. However, your Total Cholesterol and LDL ('bad') cholesterol are borderline elevated.",
      hi: "आपकी अच्छी (HDL) कोलेस्ट्रॉल और ट्राइग्लिसराइड्स सामान्य और सुरक्षित स्तर पर हैं। हालांकि, कुल कोलेस्ट्रॉल और खराब (LDL) कोलेस्ट्रॉल थोड़ा बढ़ा हुआ है।",
      hinglish: "Aapka good cholesterol (HDL) aur triglycerides safe limit me hain. Lekin Total Cholesterol aur bad cholesterol (LDL) borderline high hain.",
    },

    importantFindings: [
      {
        id: 'f-201',
        testName: 'LDL Cholesterol ("Bad" Cholesterol)',
        value: '138',
        unit: 'mg/dL',
        referenceRange: '< 100 mg/dL',
        status: 'high',
        medicalTerm: 'Elevated Low-Density Lipoprotein',
        explanation: {
          en: 'Higher amounts of LDL can gradually deposit plaque along blood vessel walls over time.',
          hi: 'LDL की अधिकता धीरे-धीरे रक्त धमनियों की दीवारों पर जम सकती है।',
          hinglish: 'LDL badhne se blood vessels ki walls par dheere-dheere fat jama ho sakta hai.',
        },
      },
      {
        id: 'f-202',
        testName: 'Total Cholesterol',
        value: '218',
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'high',
        medicalTerm: 'Hypercholesterolemia (Mild)',
        explanation: {
          en: 'Slightly above the recommended 200 threshold; often responds well to regular exercise and less saturated fat.',
          hi: '200 की सीमा से थोड़ा अधिक; नियमित व्यायाम और स्वस्थ खान-पान से अक्सर सामान्य हो जाता है।',
          hinglish: '200 se thoda upar hai; regular walk aur healthy diet se control me aa jata hai.',
        },
      },
    ],

    aiExplanations: [
      {
        id: 'term-201',
        medicalTerm: {
          en: 'LDL Cholesterol ("Bad" Cholesterol)',
          hi: 'एलडीएल कोलेस्ट्रॉल (खराब कोलेस्ट्रॉल)',
          hinglish: 'LDL Cholesterol ("Bad" Cholesterol)',
        },
        simpleMeaning: {
          en: 'A type of fatty particle that carries cholesterol through blood vessels.',
          hi: 'एक प्रकार का वसा जो धमनियों में कोलेस्ट्रॉल ले जाता है।',
          hinglish: 'Fat particles jo blood vessels me cholesterol le jate hain.',
        },
        easyExplanation: {
          en: 'When there is too much LDL, it can leave behind fatty deposits inside your arteries. Lowering it through diet protects your long-term heart health.',
          hi: 'जब एलडीएल बहुत अधिक हो जाता है, तो यह धमनियों में जम सकता है। इसे कम करने से हृदय स्वस्थ रहता है।',
          hinglish: 'Zyada LDL arteries me jam sakta hai. Isko diet aur exercise se kam rakhna dil ke liye achha hota hai.',
        },
        relatedTest: 'LDL Cholesterol',
      },
    ],

    tests: [
      {
        id: 't-201',
        name: 'Total Cholesterol',
        medicalTerm: 'Cholesterol',
        value: '218',
        numericValue: 218,
        unit: 'mg/dL',
        referenceRange: '< 200 mg/dL',
        min: 120,
        max: 200,
        status: 'high',
        simpleMeaning: {
          en: 'Total fats circulating in blood',
          hi: 'खून में कुल वसा की मात्रा',
          hinglish: 'Blood me total circulating fat',
        },
        explanation: {
          en: 'Borderline elevated (ideal is below 200 mg/dL).',
          hi: 'सामान्य से थोड़ा अधिक (200 से कम होना चाहिए)।',
          hinglish: 'Thoda elevated hai (ideal <200 hona chahiye).',
        },
      },
      {
        id: 't-202',
        name: 'LDL Cholesterol ("Bad")',
        medicalTerm: 'Low-Density Lipoprotein',
        value: '138',
        numericValue: 138,
        unit: 'mg/dL',
        referenceRange: '< 100 mg/dL',
        min: 50,
        max: 100,
        status: 'high',
        simpleMeaning: {
          en: 'Cholesterol that can build up in arteries',
          hi: 'धमनियों में जमने वाला खराब कोलेस्ट्रॉल',
          hinglish: 'Arteries me deposit hone wala cholesterol',
        },
        explanation: {
          en: 'At 138 mg/dL, this is in the borderline elevated range.',
          hi: '138 mg/dL थोड़ा बढ़ा हुआ माना जाता है।',
          hinglish: '138 mg/dL borderline high category me aata hai.',
        },
      },
      {
        id: 't-203',
        name: 'HDL Cholesterol ("Good")',
        medicalTerm: 'High-Density Lipoprotein',
        value: '56',
        numericValue: 56,
        unit: 'mg/dL',
        referenceRange: '> 50 mg/dL',
        min: 50,
        max: 90,
        status: 'normal',
        simpleMeaning: {
          en: 'Helpful scavenger cholesterol that protects the heart',
          hi: 'सुरक्षात्मक कोलेस्ट्रॉल जो हृदय की रक्षा करता है',
          hinglish: 'Protective cholesterol jo blood saaf karta hai',
        },
        explanation: {
          en: 'Good level! Values above 50 provide cardiovascular protection.',
          hi: 'बहुत अच्छा स्तर! 50 से अधिक स्तर दिल की रक्षा करता है।',
          hinglish: 'Great level! 50 se upar heart ke liye protective hota hai.',
        },
      },
      {
        id: 't-204',
        name: 'Triglycerides',
        medicalTerm: 'Blood Fats',
        value: '120',
        numericValue: 120,
        unit: 'mg/dL',
        referenceRange: '< 150 mg/dL',
        min: 40,
        max: 150,
        status: 'normal',
        simpleMeaning: {
          en: 'Stored energy fats from food calories',
          hi: 'भोजन से बनने वाला वसा का सामान्य रूप',
          hinglish: 'Food calories se banne wala fat',
        },
        explanation: {
          en: 'Normal result! Healthy carbohydrate and calorie metabolism.',
          hi: 'सामान्य परिणाम! पाचन और ऊर्जा संतुलित है।',
          hinglish: 'Normal result! Calorie aur fat metabolism theek hai.',
        },
      },
    ],
  },
  {
    id: 'rep-003',
    name: 'Thyroid & Vitamin Health Panel',
    shortName: 'Thyroid & Vitamins',
    date: 'Jul 14, 2026',
    rawDate: '2026-07-14',
    labName: 'CarePlus Diagnostic Centers',
    orderingPhysician: 'Dr. Rajiv Sen, MD',
    patientName: 'Sarah Jenkins',
    patientAge: 38,
    patientGender: 'Female',
    status: 'attention',
    totalTests: 3,
    normalCount: 1,
    abnormalCount: 2,
    fileName: 'Thyroid_Vitamins_July2026.pdf',
    fileSize: '1.1 MB',

    summary: {
      en: "Active Free T4 thyroid hormone is normal, but TSH is slightly elevated. Vitamin D is below the recommended threshold.",
      hi: "सक्रिय थायरॉयड हार्मोन (Free T4) सामान्य है, लेकिन TSH थोड़ा बढ़ा हुआ है। विटामिन D अनुशंसित स्तर से कम है।",
      hinglish: "Active Free T4 hormone normal hai, lekin TSH thoda high hai. Vitamin D standard level se kam hai.",
    },

    importantFindings: [
      {
        id: 'f-301',
        testName: 'TSH (Thyroid Stimulating Hormone)',
        value: '5.4',
        unit: 'mIU/L',
        referenceRange: '0.40 – 4.50 mIU/L',
        status: 'high',
        medicalTerm: 'Mildly Elevated TSH',
        explanation: {
          en: 'Your brain is sending slightly stronger signals to encourage your thyroid gland to produce hormone.',
          hi: 'मस्तिष्क थायरॉयड ग्रंथि को अधिक काम करने का संकेत भेज रहा है।',
          hinglish: 'Brain thyroid gland ko thoda zyaada active hone ke signal bhej raha hai.',
        },
      },
      {
        id: 'f-302',
        testName: 'Vitamin D (25-Hydroxy)',
        value: '22',
        unit: 'ng/mL',
        referenceRange: '30 – 100 ng/mL',
        status: 'low',
        medicalTerm: 'Vitamin D Insufficiency',
        explanation: {
          en: 'Below the recommended 30 ng/mL level. Very common; readily improved with sunlight or supplements.',
          hi: '30 ng/mL से कम। बहुत सामान्य है और धूप या सप्लीमेंट्स से ठीक हो जाता है।',
          hinglish: '30 se kam hai. Bahut common hai aur D3 supplements ya dhoop se normal ho jata hai.',
        },
      },
    ],

    aiExplanations: [
      {
        id: 'term-301',
        medicalTerm: {
          en: 'TSH (Thyroid Stimulating Hormone)',
          hi: 'टीएसएच (थायरॉयड स्टिम्युलेटिंग हार्मोन)',
          hinglish: 'TSH (Thyroid Stimulating Hormone)',
        },
        simpleMeaning: {
          en: 'A signal from the brain directing your thyroid how fast to run your body metabolism.',
          hi: 'मस्तिष्क का संदेश जो थायरॉयड को शरीर की गति नियंत्रित करने को कहता है।',
          hinglish: 'Brain ka message jo body ke metabolism rate ko control karta hai.',
        },
        easyExplanation: {
          en: 'Think of TSH like a thermostat. When room temperature is slightly cool, the thermostat turns on. A reading of 5.4 mIU/L means your pituitary is prompting your thyroid a bit more.',
          hi: 'टीएसएच एक थर्मोस्टेट की तरह है। जब थायरॉयड थोड़ा धीमा होता है, मस्तिष्क टीएसएच बढ़ाकर उसे जगाने की कोशिश करता है।',
          hinglish: 'TSH ek thermostat ki tarah hai. Thyroid ko thoda support dene ke liye brain TSH release karta hai.',
        },
        relatedTest: 'TSH',
      },
    ],

    tests: [
      {
        id: 't-301',
        name: 'TSH (Thyroid Stimulating Hormone)',
        medicalTerm: 'Thyroid Signal',
        value: '5.4',
        numericValue: 5.4,
        unit: 'mIU/L',
        referenceRange: '0.40 – 4.50 mIU/L',
        min: 0.4,
        max: 4.5,
        status: 'high',
        simpleMeaning: {
          en: 'Brain signal controlling thyroid activity',
          hi: 'थायरॉयड को नियंत्रित करने वाला मस्तिष्क का हार्मोन',
          hinglish: 'Brain ka hormone jo thyroid ko signal deta hai',
        },
        explanation: {
          en: 'Slightly high at 5.4 mIU/L.',
          hi: '5.4 पर थोड़ा बढ़ा हुआ।',
          hinglish: '5.4 par thoda high hai.',
        },
      },
      {
        id: 't-302',
        name: 'Free T4 (Thyroxine)',
        medicalTerm: 'Active Thyroid Hormone',
        value: '1.15',
        numericValue: 1.15,
        unit: 'ng/dL',
        referenceRange: '0.80 – 1.80 ng/dL',
        min: 0.8,
        max: 1.8,
        status: 'normal',
        simpleMeaning: {
          en: 'Active energy-regulating hormone',
          hi: 'सक्रिय ऊर्जा हार्मोन',
          hinglish: 'Active metabolism hormone',
        },
        explanation: {
          en: 'Normal! You have sufficient active thyroid hormone in circulation.',
          hi: 'सामान्य! खून में पर्याप्त सक्रिय हार्मोन मौजूद है।',
          hinglish: 'Normal! Active hormone ki koi kami nahi hai.',
        },
      },
      {
        id: 't-303',
        name: 'Vitamin D, 25-Hydroxy',
        medicalTerm: 'Bone & Immune Vitamin',
        value: '22',
        numericValue: 22,
        unit: 'ng/mL',
        referenceRange: '30 – 100 ng/mL',
        min: 30,
        max: 100,
        status: 'low',
        simpleMeaning: {
          en: 'Essential vitamin for bone strength and immunity',
          hi: 'हड्डियों और रोग-प्रतिरोधक क्षमता के लिए आवश्यक विटामिन',
          hinglish: 'Bones aur immunity ke liye zaroori vitamin',
        },
        explanation: {
          en: 'At 22 ng/mL, this is considered insufficient (<30 ng/mL).',
          hi: '22 ng/mL पर यह कम माना जाता है।',
          hinglish: '22 ng/mL insufficient category me hai.',
        },
      },
    ],
  },
];

// Sample raw pasted text users can test with 1-click
export const samplePastedReportText = `COMPLETE BLOOD COUNT & METABOLIC PANEL
Patient: Sarah Jenkins (Age: 38, Female)
Date: Sep 02, 2026 | Lab: Metropolis Diagnostics
Ordering Doctor: Dr. Arvind Kulkarni, MD

Test Results:
- Hemoglobin (Hb): 10.2 g/dL (Reference: 12.0 - 15.5 g/dL) -> [LOW]
- Fasting Blood Glucose: 92 mg/dL (Reference: 70 - 100 mg/dL) -> [NORMAL]
- White Blood Cell (WBC): 6.8 x10^3/uL (Reference: 4.5 - 11.0) -> [NORMAL]
- Platelet Count: 242 x10^3/uL (Reference: 150 - 450) -> [NORMAL]
- Alanine Aminotransferase (ALT): 48 U/L (Reference: 7 - 35 U/L) -> [HIGH]
- Serum Creatinine: 0.82 mg/dL (Reference: 0.60 - 1.10 mg/dL) -> [NORMAL]

Notes: Mild microcytic anemia pattern noted. Liver transaminases mildly elevated.`;

// Overall statistics
export const mockSummaryStats = {
  totalReports: 3,
  totalTestsAnalyzed: 13,
  normalResultsCount: 7,
  abnormalResultsCount: 6,
  lastUpdated: 'Sep 02, 2026',
};
