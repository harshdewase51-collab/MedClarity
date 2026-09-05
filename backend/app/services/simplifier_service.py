import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.core.config import settings
from app.schemas.report import ReportLanguage, TestStatus

logger = logging.getLogger("medical_simplifier")

class SimplifierService:
    """
    Hybrid AI Clinical Simplification Service.
    - Primary Foundation: Fast, deterministic, offline Clinical Knowledge Base
      (zero hallucinations, zero external dependency, instant execution).
    - Optional Enhancement: External LLM integration (Google Gemini / OpenAI)
      when API keys are present in the environment, with strict safety timeouts,
      medical guardrails, and seamless fallback to the local knowledge base.
    Supports English, Hindi, and Hinglish with zero-diagnostic guardrails.
    """

    # Comprehensive clinical knowledge base for laboratory biomarkers
    CLINICAL_KNOWLEDGE = {
        "hemoglobin": {
            "term": {
                "english": "Hemoglobin (Hb)",
                "hindi": "हीमोग्लोबिन (Hemoglobin)",
                "hinglish": "Hemoglobin (Hb)"
            },
            "meaning": {
                "english": "The protein inside red blood cells that carries oxygen from your lungs to the rest of your body.",
                "hindi": "लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो फेफड़ों से पूरे शरीर तक ऑक्सीजन पहुंचाता है।",
                "hinglish": "Red blood cells ke andar ka protein jo lungs se oxygen puri body me deliver karta hai."
            },
            "explanation": {
                "english": "Hemoglobin transports oxygen to organs and muscles. When levels fall outside reference ranges, your doctor can help determine contributing factors such as hydration, nutrition, or physical activity.",
                "hindi": "हीमोग्लोबिन शरीर के सभी अंगों तक ऑक्सीजन पहुंचाता है। संदर्भ सीमा से बाहर होने पर अपने डॉक्टर से परामर्श करें।",
                "hinglish": "Hemoglobin oxygen deliver karta hai. Reference range se bahar hone par apne doctor se discuss karein."
            }
        },
        "bilirubin": {
            "term": {
                "english": "Total Bilirubin",
                "hindi": "टोटल बिलीरुबिन (Bilirubin)",
                "hinglish": "Total Bilirubin"
            },
            "meaning": {
                "english": "A yellowish pigment formed during the normal recycling of red blood cells, processed by the liver.",
                "hindi": "लाल रक्त कोशिकाओं के सामान्य पुनर्चक्रण से बनने वाला पीला पित्त वर्णक जो लिवर द्वारा संसाधित होता है।",
                "hinglish": "Red blood cells ke normal breakdown se banne wala yellow pigment jise liver process karta hai."
            },
            "explanation": {
                "english": "Bilirubin is processed in the liver and eliminated in bile. Results within reference ranges indicate expected physiological processing.",
                "hindi": "बिलीरुबिन लिवर द्वारा संसाधित होकर बाहर निकलता है। सामान्य स्तर संतुलित लिवर कार्यप्रणाली का संकेत देते हैं।",
                "hinglish": "Bilirubin liver ke through process hota hai. Reference range me hona balanced liver processing show karta hai."
            }
        },
        "alp": {
            "term": {
                "english": "Alkaline Phosphatase (ALP)",
                "hindi": "एल्कलाइन फॉस्फेटेज (ALP)",
                "hinglish": "Alkaline Phosphatase (ALP)"
            },
            "meaning": {
                "english": "An enzyme found in liver bile ducts and active bone tissues.",
                "hindi": "लिवर की पित्त नलियों और हड्डियों के ऊतकों में पाया जाने वाला एंजाइम।",
                "hinglish": "Liver bile ducts aur bone tissues me paya jane wala enzyme."
            },
            "explanation": {
                "english": "ALP helps assess bile drainage and bone metabolism. Values within range indicate standard enzymatic activity.",
                "hindi": "एएलपी पित्त नलिकाओं और हड्डियों के स्वास्थ्य का आकलन करने में मदद करता है।",
                "hinglish": "ALP bile duct drainage aur bone metabolism ko evaluate karta hai."
            }
        },
        "bun": {
            "term": {
                "english": "Blood Urea Nitrogen (BUN)",
                "hindi": "ब्लड यूरिया नाइट्रोजन (BUN)",
                "hinglish": "Blood Urea Nitrogen (BUN)"
            },
            "meaning": {
                "english": "A normal byproduct formed from dietary protein breakdown and filtered out by the kidneys.",
                "hindi": "भोजन में प्रोटीन के पाचन से बनने वाला अपशिष्ट, जिसे स्वस्थ किडनियां छानकर बाहर निकालती हैं।",
                "hinglish": "Protein metabolism se release hone wala waste product jise kidney filter karti hai."
            },
            "explanation": {
                "english": "Kidneys continually filter urea into urine. Values within reference ranges reflect balanced protein intake and filtration.",
                "hindi": "किडनी लगातार यूरिया को रक्त से छानती है। सामान्य सीमा संतुलित प्रोटीन स्तर दर्शाती है।",
                "hinglish": "Kidney continuous blood se urea filter karti hai. Normal range balanced kidney filtration indicate karti hai."
            }
        },
        "uricacid": {
            "term": {
                "english": "Serum Uric Acid",
                "hindi": "सीरम यूरिक एसिड (Uric Acid)",
                "hinglish": "Serum Uric Acid"
            },
            "meaning": {
                "english": "A natural compound created when your body breaks down purines found in foods and cells.",
                "hindi": "भोजन और कोशिकाओं में प्यूरिन तत्वों के टूटने से बनने वाला प्राकृतिक यौगिक।",
                "hinglish": "Purine-rich foods ke breakdown se banne wala byproduct jo urine ke through filter hota hai."
            },
            "explanation": {
                "english": "Uric acid dissolves in blood, passes through kidneys, and is excreted in urine. Levels within range reflect balanced clearance.",
                "hindi": "यूरिक एसिड रक्त में घुलकर किडनी द्वारा बाहर निकलता है। सामान्य स्तर संतुलित निष्कासन दर्शाते हैं।",
                "hinglish": "Uric acid normal range me hone se joints aur filtration balance maintain rehta hai."
            }
        },
        "triglycerides": {
            "term": {
                "english": "Triglycerides",
                "hindi": "ट्राइग्लिसराइड्स (Triglycerides)",
                "hinglish": "Triglycerides"
            },
            "meaning": {
                "english": "The most common form of stored chemical fat in blood vessels converted from unused calories.",
                "hindi": "शरीर में ऊर्जा के लिए संचित वसा का सबसे आम प्रकार जो अतिरिक्त कैलोरी से बनता है।",
                "hinglish": "Body me stored fat jo unused calories se generate hota hai."
            },
            "explanation": {
                "english": "Triglycerides store unused energy for between meals. Numbers within reference bounds reflect balanced dietary fat metabolism.",
                "hindi": "ट्राइग्लिसराइड्स भोजन के बीच ऊर्जा प्रदान करते हैं। सामान्य सीमा संतुलित वसा चयापचय दर्शाती है।",
                "hinglish": "Triglycerides reference range me hone se healthy lipid metabolism reflect hota hai."
            }
        },
        "hba1c": {
            "term": {
                "english": "HbA1c (Glycated Hemoglobin)",
                "hindi": "एचबीए1सी (HbA1c)",
                "hinglish": "HbA1c (Glycated Hemoglobin)"
            },
            "meaning": {
                "english": "A metric reflecting your average blood sugar levels over the past 2 to 3 months.",
                "hindi": "पिछले 2 से 3 महीनों के औसत ब्लड शुगर स्तर का विश्वसनीय पैमाना।",
                "hinglish": "Pichle 2-3 months ke average blood sugar levels ka reliable marker."
            },
            "explanation": {
                "english": "Glucose naturally attaches to hemoglobin in red blood cells. Numbers within reference limits indicate steady glucose balance.",
                "hindi": "ग्लूकोज स्वाभाविक रूप से हीमोग्लोबिन से जुड़ता है। सामान्य स्तर स्थिर शर्करा संतुलन दर्शाते हैं।",
                "hinglish": "Glucose hemoglobin se attach hota hai. Normal range steady sugar balance reflect karti hai."
            }
        },
        "freet3": {
            "term": {
                "english": "Free T3 (Triiodothyronine)",
                "hindi": "फ्री टी3 (Free T3)",
                "hinglish": "Free T3"
            },
            "meaning": {
                "english": "The active circulating thyroid hormone regulating daily cellular energy consumption.",
                "hindi": "सक्रिय थायरॉइड हार्मोन जो कोशिकाओं की ऊर्जा खपत को नियंत्रित करता है।",
                "hinglish": "Active thyroid hormone jo body ke energy consumption ko control karta hai."
            },
            "explanation": {
                "english": "Free T3 influences body temperature, heart rate, and metabolic rhythm. Values within range indicate balanced hormone availability.",
                "hindi": "फ्री टी3 शरीर के मेटाबॉलिज्म को नियंत्रित करता है। सामान्य स्तर संतुलित हार्मोन उपलब्धता दर्शाते हैं।",
                "hinglish": "Free T3 metabolic rhythm ko regulate karta hai. Normal range hormonal balance show karti hai."
            }
        },
        "freet4": {
            "term": {
                "english": "Free T4 (Thyroxine)",
                "hindi": "फ्री टी4 (Free T4)",
                "hinglish": "Free T4"
            },
            "meaning": {
                "english": "The main storage thyroid hormone converted into active T3 as needed by your body tissues.",
                "hindi": "मुख्य थायरॉइड हार्मोन जो आवश्यकतानुसार सक्रिय टी3 में परिवर्तित होता है।",
                "hinglish": "Primary thyroid hormone jo tissues ki demand par active T3 me convert hota hai."
            },
            "explanation": {
                "english": "Free T4 levels reflect thyroid production capability. Values within reference ranges indicate expected thyroid gland output.",
                "hindi": "फ्री टी4 थायरॉइड ग्रंथि की कार्यक्षमता को दर्शाता है। सामान्य सीमा संतुलित उत्पादन इंगित करती है।",
                "hinglish": "Free T4 hormone level body metabolic rate aur stamina maintain rakhta hai."
            }
        },
        "glucose": {
            "term": {
                "english": "Fasting Blood Glucose",
                "hindi": "फास्टिंग ब्लड ग्लूकोज (शुगर)",
                "hinglish": "Fasting Blood Glucose (Sugar)"
            },
            "meaning": {
                "english": "The concentration of circulating sugar in blood measured after an overnight fast.",
                "hindi": "खाली पेट रहने के बाद खून में घूमने वाले ग्लूकोज (शर्करा) का स्तर।",
                "hinglish": "Overnight empty stomach rehne ke baad blood me circulating sugar ka level."
            },
            "explanation": {
                "english": "Your body breaks down carbohydrates into glucose for cellular energy. Your glucose result should be reviewed against the reference range shown in the report.",
                "hindi": "शरीर ऊर्जा के लिए कार्बोहाइड्रेट को ग्लूकोज में बदलता है। अपने परिणाम की समीक्षा रिपोर्ट में दी गई संदर्भ सीमा के अनुसार करें।",
                "hinglish": "Body energy ke liye carbohydrates ko glucose me convert karti hai. Result reference range ke context me evaluate karein."
            }
        },
        "alt": {
            "term": {
                "english": "ALT (Alanine Aminotransferase)",
                "hindi": "एएलटी (Alanine Aminotransferase)",
                "hinglish": "ALT (SGPT)"
            },
            "meaning": {
                "english": "An enzyme primarily located inside liver cells, measured to assess liver cell integrity.",
                "hindi": "लिवर कोशिकाओं में पाया जाने वाला एंजाइम, जो लिवर स्वास्थ्य से जुड़ा होता है।",
                "hinglish": "Liver cells ke andar banne wala enzyme jo liver health indicate karta hai."
            },
            "explanation": {
                "english": "When liver cells work harder or experience temporary strain, ALT can be released into blood. Discuss any out-of-range value with your doctor.",
                "hindi": "लिवर पर अस्थायी तनाव होने पर एएलटी रक्त में आ सकता है। सीमा से बाहर होने पर चिकित्सक से परामर्श करें।",
                "hinglish": "Temporary stress ya dietary factors se ALT release ho sakta hai. Range se alag hone par doctor se discuss karein."
            }
        },
        "ast": {
            "term": {
                "english": "AST (Aspartate Aminotransferase)",
                "hindi": "एएसटी (Aspartate Aminotransferase)",
                "hinglish": "AST (SGOT)"
            },
            "meaning": {
                "english": "An enzyme found in liver, heart, and muscle tissue released during cellular stress.",
                "hindi": "लिवर और मांसपेशियों की कोशिकाओं में पाया जाने वाला एंजाइम।",
                "hinglish": "Liver aur muscle tissues me paya jane wala enzyme."
            },
            "explanation": {
                "english": "Doctors evaluate AST and ALT together to assess liver enzymes. Your result should be evaluated alongside other liver markers.",
                "hindi": "चिकित्सक लिवर स्वास्थ्य का आकलन करने के लिए एएसटी और एएलटी की एक साथ समीक्षा करते हैं।",
                "hinglish": "Doctors liver health evaluate karne ke liye AST aur ALT dono ko compare karte hain."
            }
        },
        "creatinine": {
            "term": {
                "english": "Serum Creatinine",
                "hindi": "सीरम क्रिएटिनिन",
                "hinglish": "Serum Creatinine"
            },
            "meaning": {
                "english": "A waste product produced by muscle metabolism and filtered out of blood by kidneys.",
                "hindi": "मांसपेशियों के सामान्य काम से बनने वाला अपशिष्ट, जिससे किडनी की कार्यक्षमता मापी जाती है।",
                "hinglish": "Muscles se nikalne wala natural waste product jise kidney filter karti hai."
            },
            "explanation": {
                "english": "Healthy kidneys filter creatinine continuously into urine. Your result reflects filtration balance relative to the report's reference range.",
                "hindi": "किडनी लगातार क्रिएटिनिन को छानकर बाहर निकालती है। आपका परिणाम रिपोर्ट की संदर्भ सीमा के अनुसार देखा जाना चाहिए।",
                "hinglish": "Kidney creatinine ko blood se filter karti hai. Result ko reference range ke mutabiq review karein."
            }
        },
        "egfr": {
            "term": {
                "english": "eGFR (Estimated GFR)",
                "hindi": "ई-जीएफआर (eGFR)",
                "hinglish": "eGFR"
            },
            "meaning": {
                "english": "A calculated estimate of how efficiently kidneys filter waste from the bloodstream.",
                "hindi": "किडनी द्वारा रक्त को छानने की दक्षता का अनुमानित पैमाना।",
                "hinglish": "Kidney ke blood filtration rate ka calculated estimate."
            },
            "explanation": {
                "english": "eGFR evaluates filtration rate based on creatinine, age, and biological factors. Numbers above 90 represent standard clearance efficiency.",
                "hindi": "ई-जीएफआर क्रिएटिनिन और आयु के आधार पर निस्पंदन दर का आकलन करता है।",
                "hinglish": "eGFR filtration rate ko estimate karta hai. 90 se upar standard clearance reflect hoti hai."
            }
        },
        "wbc": {
            "term": {
                "english": "WBC (White Blood Cells)",
                "hindi": "श्वेत रक्त कणिकाएं (WBC)",
                "hinglish": "White Blood Cells (WBC)"
            },
            "meaning": {
                "english": "Immune defense cells that protect the body against pathogens and infections.",
                "hindi": "इम्यून सिस्टम की सुरक्षा कोशिकाएं जो संक्रमण से शरीर की रक्षा करती हैं।",
                "hinglish": "Body ki immune defense cells jo infections se ladne me madad karti hain."
            },
            "explanation": {
                "english": "White blood cells defend against viruses and bacteria. Fluctuations can reflect routine immune responses, exercise, or inflammation.",
                "hindi": "श्वेत रक्त कोशिकाएं रोगाणुओं से लड़ती हैं। शारीरिक व्यायाम या सामान्य बदलावों से इनकी संख्या बदल सकती है।",
                "hinglish": "WBC immune system ki frontline cells hain. Normal range balanced immune defense indicate karti hai."
            }
        },
        "platelets": {
            "term": {
                "english": "Platelet Count",
                "hindi": "प्लेटलेट काउंट (Platelets)",
                "hinglish": "Platelet Count"
            },
            "meaning": {
                "english": "Small cell fragments that clump together to clot blood and prevent bleeding.",
                "hindi": "खून में मौजूद सूक्ष्म कण जो चोट लगने पर थक्का बनाकर रक्तस्राव रोकते हैं।",
                "hinglish": "Chote cell fragments jo cut lagne par blood clot bana kar bleeding rokte hain."
            },
            "explanation": {
                "english": "Platelets prevent excess bleeding by sealing microscopic blood vessel tears. Values within range indicate standard clotting balance.",
                "hindi": "प्लेटलेट्स रक्त के थक्के बनाने में मदद करते हैं ताकि रक्तस्राव न हो।",
                "hinglish": "Platelets blood clotting mechanism ko maintain rakhte hain."
            }
        },
        "ldl": {
            "term": {
                "english": "LDL Cholesterol",
                "hindi": "एलडीएल कोलेस्ट्रॉल",
                "hinglish": "LDL Cholesterol"
            },
            "meaning": {
                "english": "Low-density lipoprotein particles carrying cholesterol through blood vessels.",
                "hindi": "कम घनत्व वाला लिपोप्रोटीन जो रक्त में कोलेस्ट्रॉल ले जाता है।",
                "hinglish": "Low-density lipoprotein jo blood vessels me travel karta hai."
            },
            "explanation": {
                "english": "Elevated LDL over long periods can accumulate on artery walls. Reviewing LDL alongside HDL provides a clear lipid overview.",
                "hindi": "लंबे समय तक अधिक रहने पर एलडीएल धमनियों में जमा हो सकता है। चिकित्सक से लिपिड प्रोफाइल की समीक्षा करें।",
                "hinglish": "LDL cholesterol level ko reference range ke andar rakhna cardiovascular health ke liye zaroori hai."
            }
        },
        "hdl": {
            "term": {
                "english": "HDL Cholesterol",
                "hindi": "एचडीएल कोलेस्ट्रॉल",
                "hinglish": "HDL Cholesterol"
            },
            "meaning": {
                "english": "High-density lipoprotein particles that carry surplus cholesterol back to the liver.",
                "hindi": "उच्च घनत्व वाला सुरक्षात्मक लिपोप्रोटीन जो अतिरिक्त कोलेस्ट्रॉल को लिवर में वापस ले जाता है।",
                "hinglish": "Protective lipoprotein jo excess cholesterol ko liver wapas transport karta hai."
            },
            "explanation": {
                "english": "HDL acts as a scavenger carrying surplus fats away from blood vessel walls back to the liver for clearance.",
                "hindi": "एचडीएल अतिरिक्त वसा को धमनियों से हटाकर लिवर में वापस भेजता है।",
                "hinglish": "HDL surplus fats ko arteries se clear karke liver me bhejta hai."
            }
        },
        "cholesterol": {
            "term": {
                "english": "Total Cholesterol",
                "hindi": "टोटल कोलेस्ट्रॉल",
                "hinglish": "Total Cholesterol"
            },
            "meaning": {
                "english": "The cumulative measurement of all lipid and fat substances in your blood.",
                "hindi": "रक्त में प्रवाहित होने वाले कुल वसा (फैट्स) की समग्र मात्रा।",
                "hinglish": "Blood me travel karne wale total fats aur lipids ka sum."
            },
            "explanation": {
                "english": "Cholesterol is vital for cell membranes and hormone synthesis. Maintaining results within reference thresholds supports vascular health.",
                "hindi": "कोलेस्ट्रॉल कोशिकाओं और हार्मोन निर्माण के लिए आवश्यक है। सामान्य सीमा संवहनी स्वास्थ्य का समर्थन करती है।",
                "hinglish": "Cholesterol cell membranes aur hormones ke liye zaroori hai. Range ke andar hona healthy hai."
            }
        },
        "tsh": {
            "term": {
                "english": "TSH (Thyroid Stimulating Hormone)",
                "hindi": "टीएसएच (Thyroid Stimulating Hormone)",
                "hinglish": "TSH"
            },
            "meaning": {
                "english": "A pituitary hormone signaling the thyroid gland on how actively to produce metabolism hormones.",
                "hindi": "मस्तिष्क से निकलने वाला हार्मोन जो थायरॉइड को चयापचय नियंत्रित करने का निर्देश देता है।",
                "hinglish": "Pituitary gland ka hormone jo thyroid gland ko metabolism regulate karne ka signal deta hai."
            },
            "explanation": {
                "english": "TSH guides your metabolism speed. Values within reference range reflect balanced communication between brain and thyroid.",
                "hindi": "टीएसएच शरीर के चयापचय की गति को नियंत्रित करता है। सामान्य स्तर संतुलित थायरॉइड गतिविधि दर्शाते हैं।",
                "hinglish": "TSH metabolism rate manage karta hai. Reference range me hona balanced thyroid signal reflect karta hai."
            }
        },
        "vitamind": {
            "term": {
                "english": "Vitamin D (25-Hydroxy)",
                "hindi": "विटामिन डी (Vitamin D)",
                "hinglish": "Vitamin D"
            },
            "meaning": {
                "english": "An essential nutrient vital for calcium absorption, bone strength, and immune balance.",
                "hindi": "कैल्शियम अवशोषण, हड्डियों की मजबूती और प्रतिरक्षा के लिए आवश्यक पोषक तत्व।",
                "hinglish": "Calcium absorb karne aur bone strength ke liye zaroori sunshine nutrient."
            },
            "explanation": {
                "english": "Vitamin D helps your digestive tract absorb dietary calcium. Values within reference bounds support bone density and wellness.",
                "hindi": "विटामिन डी हड्डियों के घनत्व और प्रतिरक्षा संतुलन को बनाए रखने में मदद करता है।",
                "hinglish": "Vitamin D healthy bones aur immune balance ke liye essential hai."
            }
        }
    }

    @classmethod
    def simplify_report(
        cls,
        report_data: Dict[str, Any],
        language: ReportLanguage = ReportLanguage.ENGLISH
    ) -> Dict[str, Any]:
        """
        Generates simple, plain-language explanations for tests, terms, and findings in requested language.
        Strictly adheres to medical safety rules (no diagnoses, no prescriptions).
        """
        lang_key = cls._resolve_lang_key(language)
        tests = report_data.get("tests", [])
        abnormal_count = report_data.get("abnormalCount", 0)

        # 1. Generate individual test explanations & terms
        enriched_tests = []
        for t in tests:
            t_copy = dict(t)
            matched_key = cls._find_knowledge_key(t_copy.get("testName", ""))
            
            if matched_key and matched_key in cls.CLINICAL_KNOWLEDGE:
                entry = cls.CLINICAL_KNOWLEDGE[matched_key]
                t_copy["medicalTerm"] = entry["term"].get(lang_key, entry["term"]["english"])
                t_copy["simpleMeaning"] = entry["meaning"].get(lang_key, entry["meaning"]["english"])
                t_copy["simpleExplanation"] = cls._tailor_test_explanation(t_copy, entry, lang_key)
            else:
                t_copy["medicalTerm"] = t_copy.get("testName")
                t_copy["simpleMeaning"] = cls._default_meaning(t_copy.get("testName"), lang_key)
                t_copy["simpleExplanation"] = cls._default_explanation(t_copy, lang_key)

            enriched_tests.append(t_copy)

        # 2. Generate 3-Tier AI Explanations List (Medical Term -> Simple Meaning -> Easy Explanation)
        ai_explanations = cls._generate_ai_explanation_cards(enriched_tests, lang_key)

        # 3. Generate Multilingual Report Summary
        summary = cls._generate_patient_summary(enriched_tests, abnormal_count, lang_key)

        # 4. Optional External LLM Enhancement (if API keys are configured)
        llm_enhanced = cls._query_llm_if_configured(enriched_tests, lang_key)
        if llm_enhanced and isinstance(llm_enhanced, dict):
            llm_summary = llm_enhanced.get("simple_summary") or llm_enhanced.get("summary")
            if llm_summary and isinstance(llm_summary, str) and len(llm_summary) > 20:
                summary = llm_summary

        return {
            "summary": summary,
            "tests": enriched_tests,
            "aiExplanations": ai_explanations,
            "language": language.value,
            "disclaimer": settings.DISCLAIMER_TEXT
        }

    @classmethod
    def _query_llm_if_configured(cls, tests: List[Dict[str, Any]], lang_key: str) -> Optional[Dict[str, Any]]:
        gemini_key = getattr(settings, "GEMINI_API_KEY", "") or os.getenv("GEMINI_API_KEY", "")
        openai_key = getattr(settings, "OPENAI_API_KEY", "") or os.getenv("OPENAI_API_KEY", "")

        if not gemini_key and not openai_key:
            return None

        anonymized_payload = [
            {
                "test": t.get("testName"),
                "value": t.get("value"),
                "unit": t.get("unit"),
                "range": t.get("referenceRange"),
                "status": str(t.get("status"))
            }
            for t in tests[:8]
        ]

        system_instruction = (
            f"You are a medical laboratory report explainer. Target language: {lang_key}. "
            "Explain test results in simple patient-friendly language. "
            "Strict safety constraints: "
            "1. NEVER make disease diagnoses (do NOT say 'you have [disease]' or 'no signs of [disease]'). "
            "2. NEVER recommend medicines, treatments, or prescriptions. "
            "3. State objectively whether values fall within or outside reference ranges. "
            "4. Provide: 'simple_summary' (concise paragraph in {lang_key} advising consultation with a healthcare provider). "
            "Return valid JSON only."
        )

        try:
            if openai_key:
                with httpx.Client(timeout=5.0) as client:
                    resp = client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {openai_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": getattr(settings, "AI_MODEL_NAME", "gpt-4o-mini"),
                            "messages": [
                                {"role": "system", "content": system_instruction},
                                {"role": "user", "content": json.dumps(anonymized_payload)}
                            ],
                            "response_format": {"type": "json_object"},
                            "temperature": 0.2
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        content = data["choices"][0]["message"]["content"]
                        return json.loads(content)

            elif gemini_key:
                model_name = getattr(settings, "AI_MODEL_NAME", "gemini-1.5-flash")
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                prompt_text = f"{system_instruction}\n\nData:\n{json.dumps(anonymized_payload)}"
                with httpx.Client(timeout=5.0) as client:
                    resp = client.post(
                        url,
                        headers={"Content-Type": "application/json"},
                        json={
                            "contents": [{"parts": [{"text": prompt_text}]}],
                            "generationConfig": {
                                "temperature": 0.2,
                                "responseMimeType": "application/json"
                            }
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        text_part = data["candidates"][0]["content"]["parts"][0]["text"]
                        return json.loads(text_part)

        except Exception as e:
            logger.debug(f"External LLM call skipped or failed, using local dictionary: {e}")
            return None

    @classmethod
    def _find_knowledge_key(cls, test_name: str) -> Optional[str]:
        name_lower = (test_name or "").lower()
        if "hemo" in name_lower or "haemo" in name_lower or "hb" == name_lower:
            return "hemoglobin"
        if "glucose" in name_lower or "sugar" in name_lower:
            return "glucose"
        if "alt" in name_lower or "sgpt" in name_lower or "alanine" in name_lower:
            return "alt"
        if "ast" in name_lower or "sgot" in name_lower or "aspartate" in name_lower:
            return "ast"
        if "creatinine" in name_lower:
            return "creatinine"
        if "egfr" in name_lower or "gfr" in name_lower:
            return "egfr"
        if "wbc" in name_lower or "white blood" in name_lower or "leuko" in name_lower:
            return "wbc"
        if "platelet" in name_lower:
            return "platelets"
        if "ldl" in name_lower:
            return "ldl"
        if "hdl" in name_lower:
            return "hdl"
        if "cholesterol" in name_lower:
            return "cholesterol"
        if "tsh" in name_lower or "thyroid" in name_lower:
            return "tsh"
        if "vitamin d" in name_lower or "25-oh" in name_lower or "25-hydroxy" in name_lower:
            return "vitamind"
        if "bilirubin" in name_lower:
            return "bilirubin"
        if "alp" in name_lower or "alkaline" in name_lower:
            return "alp"
        if "bun" in name_lower or "blood urea" in name_lower or "urea" in name_lower:
            return "bun"
        if "uric" in name_lower:
            return "uricacid"
        if "triglyceride" in name_lower:
            return "triglycerides"
        if "hba1c" in name_lower or "a1c" in name_lower or "glycated" in name_lower:
            return "hba1c"
        if "free t3" in name_lower or "ft3" in name_lower:
            return "freet3"
        if "free t4" in name_lower or "ft4" in name_lower:
            return "freet4"
        return None

    @classmethod
    def _tailor_test_explanation(cls, test: Dict[str, Any], entry: Dict[str, Any], lang: str) -> str:
        status = test.get("status", TestStatus.NORMAL)
        val = test.get("value")
        unit = test.get("unit", "")
        base_exp = entry["explanation"].get(lang, entry["explanation"]["english"])

        if status == TestStatus.LOW:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) संदर्भ सीमा से कम है। {base_exp} इस परिणाम पर अपने डॉक्टर से चर्चा करें।"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) reference range se thoda low hai. {base_exp} Apne doctor se discuss karein."
            else:
                return f"Your result ({val} {unit}) is below the reference range. {base_exp} Discuss this result with your healthcare professional."

        elif status == TestStatus.HIGH:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) संदर्भ सीमा से अधिक है। {base_exp} इस परिणाम पर अपने डॉक्टर से चर्चा करें।"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) reference range se thoda high hai. {base_exp} Apne doctor se discuss karein."
            else:
                return f"Your result ({val} {unit}) is above the reference range. {base_exp} Discuss this result with your healthcare professional."

        elif status == TestStatus.UNABLE_TO_DETERMINE:
            if lang == "hindi":
                return f"आपका परिणाम {val} {unit} दर्ज किया गया है। संदर्भ सीमा उपलब्ध न होने के कारण इसका मूल्यांकन चिकित्सक से कराएं।"
            elif lang == "hinglish":
                return f"Aapka result {val} {unit} hai. Reference range na hone ki wajah se apne doctor se consult karein."
            else:
                return f"Your result is {val} {unit}. A reference range was not available for this test. Consult your healthcare professional for evaluation."

        else:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) सामान्य संदर्भ सीमा के भीतर है। {base_exp}"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) standard reference range ke andar hai. {base_exp}"
            else:
                return f"Your result ({val} {unit}) is within the standard reference range shown in the report. {base_exp}"

    @classmethod
    def _generate_ai_explanation_cards(cls, tests: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
        cards = []
        seen = set()

        # Prioritize abnormal biomarkers first, then normal
        sorted_tests = sorted(tests, key=lambda t: 0 if t.get("status") in (TestStatus.HIGH, TestStatus.LOW) else 1)

        for t in sorted_tests:
            key = cls._find_knowledge_key(t.get("testName", ""))
            if key and key in cls.CLINICAL_KNOWLEDGE and key not in seen:
                entry = cls.CLINICAL_KNOWLEDGE[key]
                cards.append({
                    "medicalTerm": entry["term"].get(lang, entry["term"]["english"]),
                    "simpleMeaning": entry["meaning"].get(lang, entry["meaning"]["english"]),
                    "easyExplanation": entry["explanation"].get(lang, entry["explanation"]["english"]),
                    "relatedTest": t.get("testName")
                })
                seen.add(key)

        return cards

    @classmethod
    def _generate_patient_summary(cls, tests: List[Dict[str, Any]], abnormal_count: int, lang: str) -> str:
        total = len(tests)
        abnormal_names = [t.get("testName") for t in tests if t.get("status") in (TestStatus.HIGH, TestStatus.LOW)]
        abnormal_str = ", ".join(abnormal_names[:3])

        if abnormal_count == 0:
            if lang == "hindi":
                return f"इस रिपोर्ट में मूल्यांकित सभी {total} परीक्षण सामान्य संदर्भ सीमाओं के भीतर हैं।"
            elif lang == "hinglish":
                return f"Is report me check kiye gaye sabhi {total} biomarkers bilkul normal aur healthy range me hain."
            else:
                return f"All {total} biomarkers evaluated in this report are within the standard healthy reference ranges."
        else:
            if lang == "hindi":
                return (
                    f"आपकी रिपोर्ट में कुल {total} में से {abnormal_count} परीक्षण सामान्य संदर्भ सीमा से बाहर हैं ({abnormal_str})। "
                    f"शेष परीक्षण सामान्य सीमा में हैं। इन निष्कर्षों पर अपने डॉक्टर से चर्चा करें।"
                )
            elif lang == "hinglish":
                return (
                    f"Aapki report me total {total} me se {abnormal_count} biomarkers standard range se thode alag hain ({abnormal_str}). "
                    f"Baqi sabhi tests normal hain. In findings par apne doctor se baat karein."
                )
            else:
                return (
                    f"In this report, {abnormal_count} of {total} test results are outside standard reference ranges ({abnormal_str}). "
                    f"The remaining biomarkers are within normal limits. Discuss these specific findings with your healthcare provider."
                )

    @staticmethod
    def _resolve_lang_key(lang: ReportLanguage) -> str:
        if lang == ReportLanguage.HINDI:
            return "hindi"
        if lang == ReportLanguage.HINGLISH:
            return "hinglish"
        return "english"

    @staticmethod
    def _default_meaning(name: str, lang: str) -> str:
        if lang == "hindi":
            return f"{name} के स्तर को मापने वाला प्रयोगशाला परीक्षण।"
        elif lang == "hinglish":
            return f"{name} level ko measure karne wala routine lab test."
        return f"Clinical biomarker measuring {name}."

    @staticmethod
    def _default_explanation(test: Dict[str, Any], lang: str) -> str:
        val = test.get("value")
        unit = test.get("unit", "")
        status = test.get("status", TestStatus.NORMAL)
        if lang == "hindi":
            return f"रिपोर्ट में आपका परिणाम {val} {unit} दर्ज है ({status})। चिकित्सक से परामर्श करें।"
        elif lang == "hinglish":
            return f"Aapka result {val} {unit} record kiya gaya hai ({status}). Doctor se consult karein."
        return f"Your result is recorded as {val} {unit} with status {status}. Consult your healthcare professional."
