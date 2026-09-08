/**
 * Offline Clinical Intelligence Engine for MedClarity
 * Fully client-side fallback that extracts biomarkers, matches clinical ranges,
 * determines organ impact, and generates plain-language explanations in En/Hi/Hinglish.
 * Ensures zero-block uptime even if network is severed or backend process drops.
 */

export const CLINICAL_BIOMARKER_DB = [
  {
    key: 'hemoglobin',
    names: ['hemoglobin', 'haemoglobin', 'hb'],
    category: 'blood',
    organ: 'Blood & Oxygen Transport',
    unit: 'g/dL',
    defaultMin: 12.0,
    defaultMax: 17.5,
    criticalLow: 8.0,
    criticalHigh: 20.0,
    descriptions: {
      en: {
        name: 'Hemoglobin (Hb)',
        meaning: 'The protein in red blood cells that carries vital oxygen from your lungs to the rest of your body.',
        low: 'Your hemoglobin is below standard range. This can cause fatigue, paleness, and shortness of breath (anemia).',
        high: 'Your hemoglobin is elevated. This may point to dehydration, smoking, high altitude, or increased red blood cell production.',
        normal: 'Hemoglobin is in the healthy range. Your red blood cells can carry oxygen effectively.',
        doctorQuestion: 'Could my hemoglobin level explain my energy levels, and do I need iron, B12, or folate testing?',
      },
      hi: {
        name: 'हीमोग्लोबिन (Hb)',
        meaning: 'लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो फेफड़ों से पूरे शरीर तक ऑक्सीजन पहुँचाता है।',
        low: 'हीमोग्लोबिन सामान्य से कम है। इससे थकान, कमजोरी और सांस फूलना (एनीमिया) हो सकता है।',
        high: 'हीमोग्लोबिन सामान्य से अधिक है। यह निर्जलीकरण (dehydration) या ऑक्सीजन की कमी का संकेत हो सकता है।',
        normal: 'हीमोग्लोबिन सामान्य सीमा में है। शरीर में ऑक्सीजन का संचार सुचारू रूप से हो रहा है।',
        doctorQuestion: 'क्या मेरी कमजोरी का संबंध हीमोग्लोबिन से है, और क्या मुझे आयरन या विटामिन की जांच करानी चाहिए?',
      },
      hinglish: {
        name: 'Hemoglobin (Hb)',
        meaning: 'Red blood cells ka wo protein jo lungs se pure body me oxygen deliver karta hai.',
        low: 'Hemoglobin normal se kam hai, jisse thakan, chakkar aur anemia ke lakshan aa sakte hain.',
        high: 'Hemoglobin thoda high hai. Ye dehydration ya body me oxygen demand badhne se ho sakta hai.',
        normal: 'Hemoglobin bilkul safe range me hai. Body me oxygen delivery normal hai.',
        doctorQuestion: 'Kya meri fatigue ka reason ye low hemoglobin hai, aur kya mujhe iron supplements chahiye?',
      },
    },
  },
  {
    key: 'fasting_glucose',
    names: ['fasting blood sugar', 'fbs', 'fasting glucose', 'glucose fasting', 'blood sugar fasting'],
    category: 'metabolic_pancreas',
    organ: 'Pancreas & Blood Sugar Metabolism',
    unit: 'mg/dL',
    defaultMin: 70,
    defaultMax: 100,
    criticalLow: 50,
    criticalHigh: 250,
    descriptions: {
      en: {
        name: 'Fasting Blood Glucose',
        meaning: 'The concentration of glucose (sugar) circulating in your bloodstream after fasting for 8 to 12 hours.',
        low: 'Your fasting blood sugar is low (hypoglycemia). This may cause dizziness, shakiness, or cold sweats.',
        high: 'Fasting blood sugar is above 100 mg/dL. Values between 100-125 indicate prediabetes; 126+ indicates diabetes.',
        normal: 'Your fasting blood sugar is within optimal limits, showing healthy insulin sensitivity.',
        doctorQuestion: 'Given my fasting glucose, should we follow up with an HbA1c test or dietary carbohydrate adjustments?',
      },
      hi: {
        name: 'फास्टिंग ब्लड शुगर',
        meaning: '8-12 घंटे उपवास (खाली पेट) रहने के बाद रक्त में ग्लूकोज (शर्करा) की मात्रा।',
        low: 'ब्लड शुगर सामान्य से कम है। इससे चक्कर और घबराहट हो सकती है।',
        high: 'फास्टिंग शुगर अधिक है। यह प्रीडायबिटीज या डायबिटीज का प्रारंभिक संकेत हो सकता है।',
        normal: 'फास्टिंग शुगर सामान्य सीमा में है। इन्सुलिन प्रणाली स्वस्थ है।',
        doctorQuestion: 'क्या मुझे HbA1c टेस्ट कराने की जरूरत है और डाइट में क्या बदलाव करने चाहिए?',
      },
      hinglish: {
        name: 'Fasting Blood Sugar',
        meaning: 'Overnight 8-12 hours fasting ke baad blood me sugar ka level.',
        low: 'Blood sugar normal se kam hai, jisse chakar ya weakness aa sakti hai.',
        high: 'Fasting blood sugar thoda high hai. Ye pre-diabetes ya insulin resistance ka sign ho sakta hai.',
        normal: 'Fasting blood sugar bilkul normal hai. Sugar balance healthy hai.',
        doctorQuestion: 'Kya is level ke liye mujhe HbA1c test ya sugar intake reduce karna chahiye?',
      },
    },
  },
  {
    key: 'hba1c',
    names: ['hba1c', 'glycated hemoglobin', 'glycosylated hemoglobin', 'a1c'],
    category: 'metabolic_pancreas',
    organ: 'Pancreas & Blood Sugar Metabolism',
    unit: '%',
    defaultMin: 4.0,
    defaultMax: 5.6,
    criticalLow: 3.5,
    criticalHigh: 10.0,
    descriptions: {
      en: {
        name: 'HbA1c (3-Month Blood Sugar)',
        meaning: 'Measures the average blood glucose concentration over the past 90 days.',
        low: 'HbA1c is below typical reference; usually rare, check with clinician.',
        high: 'Elevated HbA1c (5.7-6.4% prediabetes; >=6.5% diabetes). Indicates chronic sugar exposure.',
        normal: 'HbA1c is below 5.7%, representing healthy glycemic control over the past 3 months.',
        doctorQuestion: 'What target HbA1c should I aim for, and what lifestyle modifications will lower it most effectively?',
      },
      hi: {
        name: 'HbA1c (3 महीने का औसत शुगर)',
        meaning: 'पिछले 3 महीनों (90 दिनों) में रक्त शर्करा का औसत स्तर दर्शाता है।',
        low: 'HbA1c सामान्य से कम है।',
        high: 'HbA1c बढ़ा हुआ है (5.7-6.4% प्रीडायबिटीज, 6.5%+ डायबिटीज)। शर्करा का औसत स्तर अधिक रहा है।',
        normal: 'HbA1c 5.7% से कम है, जो उत्कृष्ट तीन-महीने के शुगर नियंत्रण को दर्शाता है।',
        doctorQuestion: 'HbA1c को सामान्य स्तर पर लाने के लिए कौन से आहार और व्यायाम उपयुक्त रहेंगे?',
      },
      hinglish: {
        name: 'HbA1c (3-Month Sugar Average)',
        meaning: 'Pichle 90 dinon ka average blood sugar level.',
        low: 'HbA1c normal range se kam hai.',
        high: 'HbA1c high hai (5.7 se upar pre-diabetes, 6.5 se upar diabetes). Long-term sugar control par dhyan dena zaroori hai.',
        normal: 'HbA1c optimal hai. Pichle 3 mahine me sugar control bahut accha raha hai.',
        doctorQuestion: 'HbA1c control karne ke liye kya lifestyle changes ya medications recommend karenge?',
      },
    },
  },
  {
    key: 'creatinine',
    names: ['creatinine', 'serum creatinine', 'creat'],
    category: 'kidneys',
    organ: 'Kidneys & Renal Filtration',
    unit: 'mg/dL',
    defaultMin: 0.6,
    defaultMax: 1.2,
    criticalLow: 0.3,
    criticalHigh: 4.0,
    descriptions: {
      en: {
        name: 'Serum Creatinine',
        meaning: 'A metabolic waste product from muscle breakdown that healthy kidneys continuously filter out into urine.',
        low: 'Low creatinine is usually benign, often seen with lower muscle mass or high hydration.',
        high: 'Elevated creatinine suggests the kidneys may be filtering waste less efficiently or dehydration is present.',
        normal: 'Serum creatinine is normal, reflecting healthy kidney filtration function.',
        doctorQuestion: 'Should we calculate my eGFR or check a urine protein test to further evaluate my kidney function?',
      },
      hi: {
        name: 'सीरम क्रिएटिनिन',
        meaning: 'मांसपेशियों के उपापचय से बना अपशिष्ट उत्पाद, जिसे स्वस्थ गुर्दे (किडनी) मूत्र के माध्यम से बाहर निकालते हैं।',
        low: 'क्रिएटिनिन कम होना आमतौर पर कोई समस्या नहीं है, यह मांसपेशियों के कम द्रव्यमान से जुड़ा हो सकता है।',
        high: 'क्रिएटिनिन का बढ़ना यह दर्शाता है कि गुर्दे कचरे को पूरी तरह से फिल्टर नहीं कर पा रहे हैं या पानी की कमी है।',
        normal: 'क्रिएटिनिन सामान्य है, जिससे पता चलता है कि गुर्दे का निस्पंदन कार्य स्वस्थ है।',
        doctorQuestion: 'क्या मुझे eGFR टेस्ट या किडनी की अतिरिक्त जांच कराने की आवश्यकता है?',
      },
      hinglish: {
        name: 'Serum Creatinine',
        meaning: 'Muscle breakdown se nikalne wala waste product jise healthy kidneys filter karke bahar nikaalti hain.',
        low: 'Creatinine low hona usually normal hota hai.',
        high: 'Creatinine high hona ye show karta hai ki kidneys filtering me strain le rahi hain ya dehydration hai.',
        normal: 'Creatinine level healthy hai. Kidney filtration functioning properly.',
        doctorQuestion: 'Creatinine level ke hisab se kya mera kidney function (eGFR) check karna chahiye?',
      },
    },
  },
  {
    key: 'alt',
    names: ['alt', 'sgpt', 'alanine aminotransferase', 'alanine transaminase'],
    category: 'liver',
    organ: 'Liver Function & Detoxification',
    unit: 'U/L',
    defaultMin: 7,
    defaultMax: 45,
    criticalLow: 0,
    criticalHigh: 250,
    descriptions: {
      en: {
        name: 'ALT (SGPT - Liver Enzyme)',
        meaning: 'An essential enzyme located primarily inside liver cells. When liver cells are inflamed or stressed, ALT leaks into the blood.',
        low: 'Low ALT is clinically normal and has no harmful diagnostic meaning.',
        high: 'Elevated ALT signals liver cell irritation, commonly due to fatty liver, medications, alcohol, or viral infection.',
        normal: 'ALT is within healthy limits, pointing to calm, uninflamed liver cells.',
        doctorQuestion: 'Could fatty liver, alcohol, or medications I take be contributing to my elevated liver enzymes?',
      },
      hi: {
        name: 'ALT (SGPT - लिवर एंजाइम)',
        meaning: 'लिवर कोशिकाओं में पाया जाने वाला प्रमुख एंजाइम। लिवर पर दबाव या सूजन होने पर यह रक्त में बढ़ जाता है।',
        low: 'कम ALT सामान्य है और कोई चिंता की बात नहीं है।',
        high: 'ALT बढ़ना लिवर में सूजन, फैटी लिवर या दवाओं के दुष्प्रभाव का संकेत हो सकता है।',
        normal: 'ALT सामान्य स्तर पर है। लिवर कोशिकाएं स्वस्थ हैं।',
        doctorQuestion: 'क्या यह फैटी लिवर या किसी दवा के प्रभाव के कारण है, और क्या लिवर अल्ट्रासाउंड की आवश्यकता है?',
      },
      hinglish: {
        name: 'ALT (SGPT - Liver Enzyme)',
        meaning: 'Liver cells ka enzyme. Agar liver me inflammation ya stress ho to ye blood me increase ho jata hai.',
        low: 'Low ALT bilkul normal hota hai.',
        high: 'ALT elevated hona fatty liver, heavy diet ya medications se liver strain ka sign ho sakta hai.',
        normal: 'ALT normal range me hai. Liver cells healthy hain.',
        doctorQuestion: 'Kya fatty liver ya dietary habits is elevated ALT ki wajah hain?',
      },
    },
  },
  {
    key: 'ast',
    names: ['ast', 'sgot', 'aspartate aminotransferase', 'aspartate transaminase'],
    category: 'liver',
    organ: 'Liver Function & Detoxification',
    unit: 'U/L',
    defaultMin: 8,
    defaultMax: 40,
    criticalLow: 0,
    criticalHigh: 250,
    descriptions: {
      en: {
        name: 'AST (SGOT - Liver & Tissue Enzyme)',
        meaning: 'An enzyme found in liver, heart, and muscle tissue. Evaluated alongside ALT to determine hepatic health.',
        low: 'Low AST is normal and healthy.',
        high: 'Elevated AST indicates cellular stress in liver or muscle tissues. Often interpreted as AST/ALT ratio.',
        normal: 'AST is in normal range, indicating good cellular integrity.',
        doctorQuestion: 'How does my AST relate to my ALT ratio, and what does this indicate about liver health?',
      },
      hi: {
        name: 'AST (SGOT - एंजाइम)',
        meaning: 'लिवर, हृदय और मांसपेशियों में मौजूद एंजाइम। लिवर स्वास्थ्य का आकलन करने के लिए इसे ALT के साथ देखा जाता है।',
        low: 'कम AST पूर्णतः सामान्य है।',
        high: 'AST का बढ़ना लिवर या मांसपेशियों पर दबाव का संकेत देता है।',
        normal: 'AST सामान्य सीमा में है।',
        doctorQuestion: 'क्या मुझे लिवर फंक्शन के लिए फॉलो-अप जांच करानी चाहिए?',
      },
      hinglish: {
        name: 'AST (SGOT - Enzyme)',
        meaning: 'Liver aur muscle tissues ka enzyme jo overall cellular integrity check karta hai.',
        low: 'Low AST safe hai.',
        high: 'AST high hona liver ya muscle strain indicate karta hai.',
        normal: 'AST healthy limits me hai.',
        doctorQuestion: 'AST aur ALT ratio ko dekhte hue kya mujhe further liver checkup ki zaroorat hai?',
      },
    },
  },
  {
    key: 'total_cholesterol',
    names: ['total cholesterol', 'cholesterol total', 'serum cholesterol'],
    category: 'heart_lipids',
    organ: 'Heart & Cardiovascular Lipids',
    unit: 'mg/dL',
    defaultMin: 125,
    defaultMax: 200,
    criticalLow: 90,
    criticalHigh: 350,
    descriptions: {
      en: {
        name: 'Total Cholesterol',
        meaning: 'The overall measure of blood fats including HDL (protective), LDL (arterial deposit risk), and VLDL.',
        low: 'Low total cholesterol is generally rare, sometimes linked with hyperthyroidism or malabsorption.',
        high: 'Total cholesterol above 200 mg/dL increases long-term risk of plaque buildup in arterial walls.',
        normal: 'Total cholesterol is under 200 mg/dL, supporting cardiovascular longevity.',
        doctorQuestion: 'What is my comprehensive lipid profile breakdown, and do I need statin therapy or dietary fiber changes?',
      },
      hi: {
        name: 'कुल कोलेस्ट्रॉल (Total Cholesterol)',
        meaning: 'रक्त में वसा की कुल मात्रा, जिसमें अच्छा (HDL) और खराब (LDL) दोनों कोलेस्ट्रॉल शामिल हैं।',
        low: 'बहुत कम कोलेस्ट्रॉल कभी-कभी पोषण की कमी से जुड़ा हो सकता है।',
        high: '200 mg/dL से अधिक कोलेस्ट्रॉल धमनियों में रुकावट और हृदय रोग का जोखिम बढ़ा सकता है।',
        normal: 'कुल कोलेस्ट्रॉल 200 से कम है, जो हृदय के लिए सुरक्षित है।',
        doctorQuestion: 'हृदय की सुरक्षा के लिए मुझे अपनी डाइट में क्या सुधार करना चाहिए?',
      },
      hinglish: {
        name: 'Total Cholesterol',
        meaning: 'Blood me total fats ka level, jisme good aur bad cholesterol shamil hain.',
        low: 'Low cholesterol safe range me count hota hai.',
        high: 'Total cholesterol 200 se upar hai, jisse arteries me plaque deposit hone ka risk rehta hai.',
        normal: 'Total cholesterol bilkul normal aur safe limit me hai.',
        doctorQuestion: 'Cholesterol balance maintain karne ke liye best lifestyle changes kya hain?',
      },
    },
  },
  {
    key: 'triglycerides',
    names: ['triglycerides', 'serum triglycerides', 'tg'],
    category: 'heart_lipids',
    organ: 'Heart & Cardiovascular Lipids',
    unit: 'mg/dL',
    defaultMin: 50,
    defaultMax: 150,
    criticalLow: 30,
    criticalHigh: 500,
    descriptions: {
      en: {
        name: 'Triglycerides',
        meaning: 'The most common type of fat in your body, directly influenced by dietary sugars, carbohydrates, and alcohol.',
        low: 'Low triglycerides are uncommon and typically benign.',
        high: 'Elevated triglycerides (>150 mg/dL) increase risk for cardiovascular disease and metabolic syndrome.',
        normal: 'Triglycerides are under 150 mg/dL, indicating efficient fat clearing from your bloodstream.',
        doctorQuestion: 'Would reducing refined carbohydrates and sugar be sufficient to lower my triglycerides back to ideal levels?',
      },
      hi: {
        name: 'ट्राइग्लिसराइड्स (Triglycerides)',
        meaning: 'रक्त में पाई जाने वाली वसा का मुख्य प्रकार, जो अत्यधिक मीठा और तैलीय भोजन करने से बढ़ता है।',
        low: 'कम ट्राइग्लिसराइड्स सामान्य माने जाते हैं।',
        high: 'ट्राइग्लिसराइड्स 150 से अधिक होना हृदय और रक्त वाहिकाओं पर दबाव डालता है।',
        normal: 'ट्राइग्लिसराइड्स सामान्य सीमा में हैं।',
        doctorQuestion: 'ट्राइग्लिसराइड्स को नियंत्रित रखने के लिए डाइट में क्या कम करना चाहिए?',
      },
      hinglish: {
        name: 'Triglycerides',
        meaning: 'Body me circulate hone wala fat jo sugar, carbs aur oily food se jaldi badhta hai.',
        low: 'Low triglycerides healthy hote hain.',
        high: 'Triglycerides high hain, jo heart and liver par excess fat storage show karta hai.',
        normal: 'Triglycerides bilkul controlled hain.',
        doctorQuestion: 'Sugar aur refined carbs cut down karke triglycerides kitne jaldi normal ho sakte hain?',
      },
    },
  },
  {
    key: 'wbc',
    names: ['wbc', 'white blood cells', 'total leukocyte count', 'tlc', 'white blood cell count'],
    category: 'blood',
    organ: 'Immune System & Defense',
    unit: '/cumm',
    defaultMin: 4000,
    defaultMax: 11000,
    criticalLow: 2000,
    criticalHigh: 30000,
    descriptions: {
      en: {
        name: 'White Blood Cells (WBC / TLC)',
        meaning: 'The immune defense cells that protect your body from infections, bacterial pathogens, and inflammation.',
        low: 'Low WBC count (leukopenia) makes you more susceptible to infections and points to marrow or viral causes.',
        high: 'High WBC count indicates the immune system is actively fighting an infection, injury, or systemic inflammation.',
        normal: 'WBC count is within normal limits, reflecting an active and balanced immune system.',
        doctorQuestion: 'Does my WBC count indicate an active infection or inflammation requiring antibiotic or antiviral treatment?',
      },
      hi: {
        name: 'श्वेत रक्त कोशिकाएं (WBC / TLC)',
        meaning: 'शरीर की रोग प्रतिरोधक (इम्यून) कोशिकाएं जो संक्रमण और बीमारियों से लड़ती हैं।',
        low: 'कम WBC रोग प्रतिरोधक क्षमता में कमी का संकेत दे सकता है।',
        high: 'बढ़ा हुआ WBC दर्शाता है कि शरीर में कोई संक्रमण या सूजन सक्रिय है।',
        normal: 'WBC संख्या सामान्य है। रोग प्रतिरोधक प्रणाली संतुलित है।',
        doctorQuestion: 'क्या बढ़ा हुआ WBC किसी मौजूदा संक्रमण की ओर संकेत कर रहा है?',
      },
      hinglish: {
        name: 'White Blood Cells (WBC / TLC)',
        meaning: 'Immune system ki fighter cells jo infections aur bacteria se body ko protect karti hain.',
        low: 'WBC low hona body ki immunity weak hona darshata hai.',
        high: 'WBC high hona kisi infection, allergy ya inflammation se ladne ka sign hai.',
        normal: 'WBC count bilkul balanced aur normal hai.',
        doctorQuestion: 'Kya is WBC count se koi infection verify hota hai jiske liye test chahiye?',
      },
    },
  },
  {
    key: 'platelets',
    names: ['platelet count', 'platelets', 'plt'],
    category: 'blood',
    organ: 'Blood & Clotting Integrity',
    unit: 'lakh/cumm',
    defaultMin: 1.5,
    defaultMax: 4.5,
    criticalLow: 0.5,
    criticalHigh: 8.0,
    descriptions: {
      en: {
        name: 'Platelet Count',
        meaning: 'Cell fragments essential for forming blood clots, stopping bleeding, and healing damaged blood vessels.',
        low: 'Low platelets (thrombocytopenia) elevate risk of easy bruising or bleeding (common in dengue, viral fevers).',
        high: 'High platelets may result from acute inflammation, iron deficiency, or bone marrow stimulation.',
        normal: 'Platelet count is healthy, ensuring proper blood clotting and wound recovery.',
        doctorQuestion: 'Are there any bleeding precautions or repeat counts required for my platelet level?',
      },
      hi: {
        name: 'प्लेटलेट्स (Platelet Count)',
        meaning: 'रक्त के थक्के जमाने वाली कोशिकाएं जो चोट लगने पर रक्तस्राव को रोकती हैं।',
        low: 'कम प्लेटलेट्स से ब्लीडिंग और नील पड़ने का खतरा रहता है (जैसे डेंगू या वायरल में)।',
        high: 'अधिक प्लेटलेट्स शरीर में किसी पुरानी सूजन या प्रतिक्रिया का परिणाम हो सकते हैं।',
        normal: 'प्लेटलेट काउंट सामान्य है। रक्त जमने की क्षमता स्वस्थ है।',
        doctorQuestion: 'क्या प्लेटलेट्स के स्तर पर नजर रखने के लिए दोबारा जांच जरूरी है?',
      },
      hinglish: {
        name: 'Platelets Count',
        meaning: 'Blood clot banane wali cells jo chot lagne par bleeding rokti hain.',
        low: 'Platelets kam hone se bleeding risk ya viral infection (jaise dengue) ka doubt rehta hai.',
        high: 'Platelets high hone par inflammation check karna chahiye.',
        normal: 'Platelets bilkul safe range me hain.',
        doctorQuestion: 'Kya platelets ki repeat counting ki zaroorat hai?',
      },
    },
  },
  {
    key: 'tsh',
    names: ['tsh', 'thyroid stimulating hormone', 'thyroid hormone'],
    category: 'thyroid',
    organ: 'Thyroid & Basal Metabolic Rate',
    unit: 'uIU/mL',
    defaultMin: 0.4,
    defaultMax: 4.5,
    criticalLow: 0.1,
    criticalHigh: 15.0,
    descriptions: {
      en: {
        name: 'Thyroid Stimulating Hormone (TSH)',
        meaning: 'A pituitary hormone that signals your thyroid gland to regulate metabolism, body temperature, and energy.',
        low: 'Low TSH suggests an overactive thyroid (hyperthyroidism), which can cause weight loss, palpitations, and anxiety.',
        high: 'High TSH suggests an underactive thyroid (hypothyroidism), which can cause sluggishness, weight gain, and dry skin.',
        normal: 'TSH is within optimal bounds, showing balanced thyroid-pituitary feedback.',
        doctorQuestion: 'Should we test Free T3 and Free T4 to get a complete picture of my thyroid gland function?',
      },
      hi: {
        name: 'थायरॉइड स्टिमुलेटिंग हार्मोन (TSH)',
        meaning: 'पिट्यूटरी ग्रंथि द्वारा जारी हार्मोन जो थायरॉइड को शरीर का मेटाबॉलिज्म नियंत्रित करने का निर्देश देता है।',
        low: 'कम TSH अतिसक्रिय थायरॉइड (Hyperthyroidism) का संकेत हो सकता है।',
        high: 'अधिक TSH सुस्त थायरॉइड (Hypothyroidism) का संकेत हो सकता है, जिससे वजन बढ़ना और सुस्ती आती है।',
        normal: 'TSH सामान्य है। थायरॉइड ग्रंथि सही से काम कर रही है।',
        doctorQuestion: 'क्या मुझे थायरॉइड के लिए Free T3 / Free T4 टेस्ट कराने की जरूरत है?',
      },
      hinglish: {
        name: 'TSH (Thyroid Stimulating Hormone)',
        meaning: 'Pituitary gland ka hormone jo thyroid ko body metabolism aur energy control karne bolta hai.',
        low: 'Low TSH hyperthyroid (overactive thyroid) indicate kar sakta hai.',
        high: 'High TSH hypothyroid (slow thyroid) ka sign hai, jisse weight gain aur thakan hoti hai.',
        normal: 'TSH bilkul normal aur balanced hai.',
        doctorQuestion: 'Kya mujhe Free T3/T4 test ya thyroid medicine consultation leni chahiye?',
      },
    },
  },
];

/**
 * Parses raw report text, extracts biomarkers matching our clinical database,
 * and generates structured diagnostic output.
 */
export function parseClinicalReportText(rawText, language = 'en') {
  if (!rawText || typeof rawText !== 'string') {
    return null;
  }

  const lang = ['hi', 'hindi'].includes(String(language).toLowerCase())
    ? 'hi'
    : ['hinglish'].includes(String(language).toLowerCase())
    ? 'hinglish'
    : 'en';

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const foundTests = [];
  const processedKeys = new Set();

  for (const biomarker of CLINICAL_BIOMARKER_DB) {
    let matchedValue = null;
    let matchedMin = biomarker.defaultMin;
    let matchedMax = biomarker.defaultMax;
    let matchedUnit = biomarker.unit;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      const hasName = biomarker.names.some((name) => {
        const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        return regex.test(lowerLine);
      });

      if (!hasName) continue;

      // Extract numeric values from line
      const numberMatches = line.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (numberMatches && numberMatches.length > 0) {
        const colonIndex = line.indexOf(':');
        let valCand = null;
        if (colonIndex !== -1) {
          const afterColon = line.slice(colonIndex + 1);
          const valMatch = afterColon.match(/[-+]?[0-9]*\.?[0-9]+/);
          if (valMatch) valCand = parseFloat(valMatch[0]);
        }
        if (valCand === null) {
          valCand = parseFloat(numberMatches[0]);
        }

        if (!isNaN(valCand)) {
          matchedValue = valCand;

          // Check if reference range is printed on the line
          const rangeMatch = line.match(/(\d+\.?\d*)\s*[-–—to]\s*(\d+\.?\d*)/i);
          if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
            const parsedMin = parseFloat(rangeMatch[1]);
            const parsedMax = parseFloat(rangeMatch[2]);
            if (!isNaN(parsedMin) && !isNaN(parsedMax) && parsedMin < parsedMax) {
              matchedMin = parsedMin;
              matchedMax = parsedMax;
            }
          }
          break; // Found match for this biomarker
        }
      }
    }

    if (matchedValue !== null && !processedKeys.has(biomarker.key)) {
      processedKeys.add(biomarker.key);

      // Determine status
      let status = 'normal';
      if (matchedValue < matchedMin) {
        status = 'low';
      } else if (matchedValue > matchedMax) {
        status = 'high';
      }

      const desc = biomarker.descriptions[lang] || biomarker.descriptions.en;
      const explanationText =
        status === 'low' ? desc.low : status === 'high' ? desc.high : desc.normal;

      foundTests.push({
        id: `offline_${biomarker.key}`,
        key: biomarker.key,
        name: desc.name,
        testName: desc.name,
        category: biomarker.category,
        organ: biomarker.organ,
        value: String(matchedValue),
        numericValue: matchedValue,
        unit: matchedUnit,
        min: matchedMin,
        max: matchedMax,
        minRange: matchedMin,
        maxRange: matchedMax,
        referenceRange: `${matchedMin} - ${matchedMax} ${matchedUnit}`.trim(),
        status,
        simpleMeaning: desc.meaning,
        simpleExplanation: explanationText,
        explanation: explanationText,
        doctorQuestion: desc.doctorQuestion,
      });
    }
  }

  // If no biomarkers could be parsed via regex (e.g. unrecognizable file structure),
  // return null so caller can handle gracefully.
  if (foundTests.length === 0) {
    return null;
  }

  const normalCount = foundTests.filter((t) => t.status === 'normal').length;
  const abnormalCount = foundTests.filter((t) => t.status !== 'normal').length;
  const overallStatus = abnormalCount > 0 ? 'attention' : 'normal';

  // Extract patient/lab details if present
  let labName = 'Diagnostic Laboratory Analysis';
  let patientName = 'Patient';
  for (const line of lines) {
    if (/lab|diagnostic|pathology|hospital|center/i.test(line) && line.length < 50) {
      labName = line.replace(/^[#*\-:\s]+/, '');
      break;
    }
  }
  for (const line of lines) {
    if (/patient|name\s*:/i.test(line)) {
      const p = line.split(':')[1];
      if (p && p.trim().length > 1) {
        patientName = p.trim();
        break;
      }
    }
  }

  // Generate localized overall summary
  let summary = '';
  if (lang === 'hi') {
    summary = abnormalCount === 0
      ? `आपके सभी ${foundTests.length} परीक्षण परिणाम सामान्य संदर्भ सीमा के भीतर हैं। महत्वपूर्ण अंग स्वस्थ कार्यप्रणाली दर्शाते हैं।`
      : `आपके विश्लेषण किए गए ${foundTests.length} परीक्षणों में से ${abnormalCount} परिणाम सामान्य सीमा से बाहर हैं, जिन पर डॉक्टर से परामर्श की सलाह दी जाती है।`;
  } else if (lang === 'hinglish') {
    summary = abnormalCount === 0
      ? `Aapke sabhi ${foundTests.length} test results normal range me hain. Body vitals healthy condition me hain.`
      : `Aapke ${foundTests.length} tests me se ${abnormalCount} tests normal limit se thode bahar hain. Doctor se review discuss karna recommended hai.`;
  } else {
    summary = abnormalCount === 0
      ? `All ${foundTests.length} evaluated clinical biomarkers are within standard healthy limits. Key body systems show reassuring physiological indicators.`
      : `Analysis identified ${abnormalCount} out of ${foundTests.length} biomarkers outside optimal target limits. Discussion with your physician is advised.`;
  }

  return {
    id: `offline_rep_${Date.now()}`,
    reportId: `offline_rep_${Date.now()}`,
    name: 'Clinical Laboratory Analysis',
    reportName: 'Clinical Laboratory Analysis',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    reportDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    labName,
    patientName,
    status: overallStatus,
    summary,
    totalTests: foundTests.length,
    normalCount,
    abnormalCount,
    tests: foundTests,
    importantFindings: foundTests
      .filter((t) => t.status !== 'normal')
      .map((t, idx) => ({
        id: `f_${idx}`,
        testName: t.name,
        value: t.value,
        unit: t.unit,
        referenceRange: t.referenceRange,
        status: t.status,
        explanation: t.explanation,
      })),
    disclaimer:
      'This tool helps explain medical reports in simple language. It is not a doctor and does not provide medical diagnosis or prescribe treatment. Always consult with a qualified healthcare professional for medical decisions.',
    isOfflineProcessed: true,
  };
}
