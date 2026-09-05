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
                "english": "The protein inside red blood cells that carries oxygen.",
                "hindi": "लाल रक्त कोशिकाओं में मौजूद प्रोटीन जो ऑक्सीजन पहुंचाता है।",
                "hinglish": "Red blood cells ke andar ka protein jo oxygen carry karta hai."
            },
            "explanation": {
                "english": "Hemoglobin acts like a delivery vehicle carrying oxygen from your lungs to your muscles and organs. Lower levels mean your body gets less oxygen, which can cause fatigue or feeling tired.",
                "hindi": "हीमोग्लोबिन फेफड़ों से शरीर के सभी अंगों तक ऑक्सीजन पहुंचाने का काम करता है। इसकी कमी से शरीर को कम ऑक्सीजन मिलती है और कमजोरी या थकान लग सकती है।",
                "hinglish": "Hemoglobin ek delivery truck ki tarah oxygen ko lungs se puri body me deliver karta hai. Iski kami se energy low ya thakan lag sakti hai."
            }
        },
        "anemia": {
            "term": {
                "english": "Anemia",
                "hindi": "एनीमिया (खून की कमी)",
                "hinglish": "Anemia"
            },
            "meaning": {
                "english": "A condition related to a lower-than-expected amount of hemoglobin in the blood.",
                "hindi": "खून में सामान्य से कम हीमोग्लोबिन होने की स्थिति।",
                "hinglish": "Blood me normal se kam hemoglobin hone ki condition."
            },
            "explanation": {
                "english": "When your red blood cell or hemoglobin levels are low, your body tissues get less oxygen than they need for energy. This often causes sluggishness or mild tiredness during daily routines.",
                "hindi": "जब हीमोग्लोबिन कम होता है तो शरीर को ऊर्जा के लिए कम ऑक्सीजन मिलती है। इससे कमजोरी और थकान महसूस हो सकती है।",
                "hinglish": "Jab hemoglobin kam hota hai toh body ko kaam karne ke liye kam oxygen milti hai, jisse thakan ya weakness mehsoos hoti hai."
            }
        },
        "glucose": {
            "term": {
                "english": "Fasting Blood Glucose",
                "hindi": "फास्टिंग ब्लड ग्लूकोज (शुगर)",
                "hinglish": "Fasting Blood Glucose (Sugar)"
            },
            "meaning": {
                "english": "The level of energy sugar circulating in your blood after fasting.",
                "hindi": "रातभर खाली पेट रहने के बाद खून में शुगर का स्तर।",
                "hinglish": "Empty stomach rehne ke baad blood me sugar level."
            },
            "explanation": {
                "english": "Glucose is the fuel your cells use for power. Staying within normal limits means your body produces and uses insulin effectively to balance energy.",
                "hindi": "ग्लूकोज शरीर की कोशिकाओं को ऊर्जा देता है। सामान्य सीमा में रहने का मतलब है कि इंसुलिन ठीक से काम कर रहा है।",
                "hinglish": "Glucose body cells ka main fuel hai. Normal range me hone ka matlab hai ki aapka insulin response bilkul balanced hai."
            }
        },
        "alt": {
            "term": {
                "english": "Alanine Aminotransferase (ALT)",
                "hindi": "एलानिन एमिनोट्रांसफरेज (ALT)",
                "hinglish": "Alanine Aminotransferase (ALT)"
            },
            "meaning": {
                "english": "An enzyme produced primarily inside liver cells.",
                "hindi": "लीवर कोशिकाओं के भीतर बनने वाला एक महत्वपूर्ण एंजाइम।",
                "hinglish": "Liver cells ke andar banne wala ek enzyme."
            },
            "explanation": {
                "english": "When liver cells experience temporary stress, small amounts of ALT spill into the bloodstream. Mild elevations are very common and often resolve with lifestyle changes.",
                "hindi": "जब लीवर पर थोड़ा दबाव होता है, तो ALT खून में आ जाता है। हल्का बढ़ना काफी सामान्य है और अक्सर जीवनशैली सुधारने से ठीक हो जाता है।",
                "hinglish": "Jab liver par thoda load ya stress hota hai, toh ALT blood me release hota hai. Thoda elevated hona common hai aur diet se normal ho jata hai."
            }
        },
        "ast": {
            "term": {
                "english": "Aspartate Aminotransferase (AST)",
                "hindi": "एस्पार्टेट एमिनोट्रांसफरेज (AST)",
                "hinglish": "Aspartate Aminotransferase (AST)"
            },
            "meaning": {
                "english": "Another enzyme found in liver and heart muscle tissue.",
                "hindi": "लीवर और मांसपेशियों में पाया जाने वाला एंजाइम।",
                "hinglish": "Liver aur muscles me paya jane wala enzyme."
            },
            "explanation": {
                "english": "Doctors evaluate AST together with ALT to assess general liver health. Normal values are reassuring.",
                "hindi": "डॉक्टर लीवर के स्वास्थ्य का आकलन करने के लिए AST और ALT दोनों की एक साथ जांच करते हैं।",
                "hinglish": "Doctors liver health check karne ke liye AST aur ALT dono ko compare karte hain. Normal aana achha sign hai."
            }
        },
        "creatinine": {
            "term": {
                "english": "Serum Creatinine",
                "hindi": "सीरम क्रिएटिनिन (किडनी मार्कर)",
                "hinglish": "Serum Creatinine (Kidney Marker)"
            },
            "meaning": {
                "english": "A natural waste product from normal muscle breakdown that kidneys filter out.",
                "hindi": "मांसपेशियों के काम करने से बनने वाला अपशिष्ट जिसे किडनी साफ करती है।",
                "hinglish": "Muscles se banne wala waste product jo healthy kidney filter out karti hai."
            },
            "explanation": {
                "english": "Healthy kidneys continuously clear creatinine into urine. Normal blood creatinine levels indicate your kidneys are filtering wastes properly.",
                "hindi": "स्वस्थ किडनी लगातार क्रिएटिनिन को खून से बाहर निकालती है। इसका सामान्य स्तर बताता है कि किडनी ठीक से कचरा साफ कर रही है।",
                "hinglish": "Healthy kidney creatinine ko blood se filter karke bahar nikaalti hai. Normal level kidney healthy hone ka sign hai."
            }
        },
        "egfr": {
            "term": {
                "english": "Estimated GFR (Kidney Filtration Rate)",
                "hindi": "अनुमानित जीएफआर (किडनी फिल्टरेशन दर)",
                "hinglish": "Estimated GFR (Kidney Filtration Rate)"
            },
            "meaning": {
                "english": "A calculation showing how fast and efficiently your kidneys clean your blood.",
                "hindi": "यह माप कि आपकी किडनी कितनी तेजी से खून को साफ कर रही है।",
                "hinglish": "Ye calculation batata hai ki kidney kitni speed aur quality se blood saaf kar rahi hai."
            },
            "explanation": {
                "english": "A score above 90 indicates your kidneys are operating at peak filtration capacity without filtration strain.",
                "hindi": "90 से ऊपर का स्कोर दर्शाता है कि किडनी बहुत अच्छी तरह से काम कर रही है।",
                "hinglish": "90 se upar ka score batata hai ki kidney top performance me waste filter kar rahi hai."
            }
        },
        "wbc": {
            "term": {
                "english": "White Blood Cell Count (WBC)",
                "hindi": "श्वेत रक्त कोशिकाएं (WBC)",
                "hinglish": "White Blood Cell Count (WBC)"
            },
            "meaning": {
                "english": "Your immune system's primary defenders against infections.",
                "hindi": "संक्रमण और बीमारियों से लड़ने वाली शरीर की रक्षक कोशिकाएं।",
                "hinglish": "Infection aur bimariyo se ladne wali immune cells."
            },
            "explanation": {
                "english": "WBCs travel through your bloodstream to neutralize bacteria and viruses. Normal counts indicate balanced immune surveillance.",
                "hindi": "यह कोशिकाएं बैक्टीरिया और वायरस से लड़ती हैं। सामान्य स्तर बताता है कि कोई तीव्र संक्रमण नहीं है।",
                "hinglish": "WBCs bacteria aur viruses se ladti hain. Normal count matlab immune system balanced hai."
            }
        },
        "platelets": {
            "term": {
                "english": "Platelet Count",
                "hindi": "प्लेटलेट्स (Platelets)",
                "hinglish": "Platelet Count"
            },
            "meaning": {
                "english": "Tiny cell fragments in blood that create clots to prevent excess bleeding.",
                "hindi": "खून में मौजूद कोशिकाएं जो चोट लगने पर थक्का जमाकर खून बहने से रोकती हैं।",
                "hinglish": "Tiny cells jo cut lagne par blood clot banakar bleeding rokti hain."
            },
            "explanation": {
                "english": "When you get a cut or scrape, platelets group together to seal the leak. Normal counts keep clotting safe and effective.",
                "hindi": "चोट लगने पर प्लेटलेट्स आपस में जुड़कर रक्तस्राव रोकती हैं। सामान्य स्तर बहुत जरूरी है।",
                "hinglish": "Chot lagne par platelets blood flow ko rokte hain. Normal count body ke liye safe hota hai."
            }
        },
        "cholesterol": {
            "term": {
                "english": "Total Cholesterol",
                "hindi": "कुल कोलेस्ट्रॉल (Total Cholesterol)",
                "hinglish": "Total Cholesterol"
            },
            "meaning": {
                "english": "The total amount of fats circulating throughout your blood vessels.",
                "hindi": "रक्त में घूमने वाले कुल वसा की मात्रा।",
                "hinglish": "Blood vessels me circulate hone wale total fats."
            },
            "explanation": {
                "english": "Your body needs some cholesterol to build cell walls and hormones. Keeping it below 200 mg/dL protects your blood vessels and heart over time.",
                "hindi": "शरीर को कुछ कोलेस्ट्रॉल की जरूरत होती है। इसे 200 से कम रखना दिल और धमनियों के लिए सुरक्षित होता है।",
                "hinglish": "Body ko cell walls ke liye thoda cholesterol chahiye hota hai, lekin isko 200 se kam rakhna heart ke liye safe rehta hai."
            }
        },
        "ldl": {
            "term": {
                "english": "LDL Cholesterol ('Bad' Cholesterol)",
                "hindi": "एलडीएल कोलेस्ट्रॉल (खराब कोलेस्ट्रॉल)",
                "hinglish": "LDL Cholesterol ('Bad' Cholesterol)"
            },
            "meaning": {
                "english": "Fats that can collect inside arterial blood vessels over time.",
                "hindi": "वह वसा जो अधिक होने पर धमनियों में जमा हो सकती है।",
                "hinglish": "Wo fat jo zyaada hone par arteries me jama ho sakta hai."
            },
            "explanation": {
                "english": "Higher levels of LDL can slowly build plaque on artery walls. Maintaining lower LDL through diet and exercise preserves vascular elasticity.",
                "hindi": "एलडीएल अधिक होने से धमनियां सख्त हो सकती हैं। इसे कम रखना दिल के लिए फायदेमंद है।",
                "hinglish": "Zyada LDL arteries me jam kar blockages bana sakta hai. Healthy lifestyle se isko control me rakhna chahiye."
            }
        },
        "hdl": {
            "term": {
                "english": "HDL Cholesterol ('Good' Cholesterol)",
                "hindi": "एचडीएल कोलेस्ट्रॉल (अच्छा कोलेस्ट्रॉल)",
                "hinglish": "HDL Cholesterol ('Good' Cholesterol)"
            },
            "meaning": {
                "english": "Helpful scavenger cholesterol that carries extra fats back to the liver.",
                "hindi": "सुरक्षात्मक वसा जो अतिरिक्त कोलेस्ट्रॉल को साफ करती है।",
                "hinglish": "Protective fat jo extra cholesterol ko liver me bhej kar blood saaf karta hai."
            },
            "explanation": {
                "english": "HDL acts like a street sweeper, clearing surplus cholesterol from your blood. Higher numbers are protective for cardiovascular health.",
                "hindi": "एचडीएल धमनियों से अतिरिक्त वसा को हटाने में मदद करता है। इसका अधिक होना अच्छा है।",
                "hinglish": "HDL ek cleaner ki tarah kaam karta hai aur extra fat ko clear karta hai. High level heart ke liye achha hota hai."
            }
        },
        "tsh": {
            "term": {
                "english": "TSH (Thyroid Stimulating Hormone)",
                "hindi": "टीएसएच (थायरॉयड स्टिम्युलेटिंग हार्मोन)",
                "hinglish": "TSH (Thyroid Stimulating Hormone)"
            },
            "meaning": {
                "english": "The hormone signal from your brain instructing the thyroid how fast to work.",
                "hindi": "मस्तिष्क का संकेत जो थायरॉयड को ऊर्जा नियंत्रित करने का निर्देश देता है।",
                "hinglish": "Brain ka signal jo thyroid gland ko metabolism manage karne bolta hai."
            },
            "explanation": {
                "english": "Think of TSH like a thermostat. When the body needs more thyroid activity, the brain raises TSH to stimulate the thyroid gland.",
                "hindi": "टीएसएच एक थर्मोस्टेट की तरह है। जब शरीर को अधिक थायरॉयड की आवश्यकता होती है, टीएसएच बढ़ जाता है।",
                "hinglish": "TSH ek thermostat ki tarah hai. Jab thyroid ko boost chahiye hota hai, tab brain TSH raise karta hai."
            }
        },
        "vitamind": {
            "term": {
                "english": "Vitamin D (25-Hydroxy)",
                "hindi": "विटामिन डी (25-Hydroxy)",
                "hinglish": "Vitamin D (25-Hydroxy)"
            },
            "meaning": {
                "english": "An essential nutrient vital for calcium absorption, bone strength, and immunity.",
                "hindi": "हड्डियों की मजबूती और रोग-प्रतिरोधक क्षमता के लिए आवश्यक पोषक तत्व।",
                "hinglish": "Bones ki strength aur immunity ke liye zaroori nutrient."
            },
            "explanation": {
                "english": "Vitamin D helps your body absorb calcium from food. Lower levels are very common in people working indoors and easily improved with sun and supplements.",
                "hindi": "विटामिन डी कैल्शियम को सोखने में मदद करता है। इसकी कमी बहुत आम है और धूप या सप्लीमेंट्स से पूरी हो जाती है।",
                "hinglish": "Vitamin D body ko calcium absorb karne me help karta hai. Kam hona bahut common hai aur D3 supplements ya dhoop se normal ho jata hai."
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
        important_findings = report_data.get("importantFindings", [])
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
        """
        Optional external LLM enhancement (Gemini or OpenAI).
        Guarantees:
        1. Never exposes API keys.
        2. Strict 5-second timeout.
        3. Never logs sensitive medical content.
        4. Fails safely and gracefully to local clinical dictionary.
        """
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
            "Strict rules: "
            "1. NEVER give a medical diagnosis. "
            "2. NEVER recommend medicines or treatments. "
            "3. Provide: 'simple_summary' (concise paragraph in {lang_key}). "
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

        return None

    @classmethod
    def _find_knowledge_key(cls, test_name: str) -> Optional[str]:
        name_lower = (test_name or "").lower()
        if "hemo" in name_lower or "haemo" in name_lower or "hb" == name_lower:
            return "hemoglobin"
        if "anemia" in name_lower:
            return "anemia"
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
        return None

    @classmethod
    def _tailor_test_explanation(cls, test: Dict[str, Any], entry: Dict[str, Any], lang: str) -> str:
        status = test.get("status", TestStatus.NORMAL)
        val = test.get("value")
        unit = test.get("unit", "")
        ref = test.get("referenceRange", "")
        base_exp = entry["explanation"].get(lang, entry["explanation"]["english"])

        if status == TestStatus.LOW:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) सामान्य सीमा से कम है। {base_exp}"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) standard range se thoda low hai. {base_exp}"
            else:
                return f"Your result ({val} {unit}) is lower than the reference range. {base_exp}"

        elif status == TestStatus.HIGH:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) सामान्य सीमा से अधिक है। {base_exp}"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) standard range se thoda high hai. {base_exp}"
            else:
                return f"Your result ({val} {unit}) is higher than the reference range. {base_exp}"

        else:
            if lang == "hindi":
                return f"आपका परिणाम ({val} {unit}) सामान्य और स्वस्थ सीमा में है। {base_exp}"
            elif lang == "hinglish":
                return f"Aapka result ({val} {unit}) bilkul normal aur healthy range me hai. {base_exp}"
            else:
                return f"Your result ({val} {unit}) is within the healthy reference range. {base_exp}"

    @classmethod
    def _generate_ai_explanation_cards(cls, tests: List[Dict[str, Any]], lang: str) -> List[Dict[str, Any]]:
        cards = []
        seen = set()

        # Prioritize abnormal biomarkers first, then normal
        sorted_tests = sorted(tests, key=lambda t: 0 if t.get("status") != TestStatus.NORMAL else 1)

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

        # If Anemia was low hemoglobin, also include Anemia card
        has_low_hb = any("hemo" in (t.get("testName") or "").lower() and t.get("status") == TestStatus.LOW for t in tests)
        if has_low_hb and "anemia" not in seen:
            entry = cls.CLINICAL_KNOWLEDGE["anemia"]
            cards.insert(0, {
                "medicalTerm": entry["term"].get(lang, entry["term"]["english"]),
                "simpleMeaning": entry["meaning"].get(lang, entry["meaning"]["english"]),
                "easyExplanation": entry["explanation"].get(lang, entry["explanation"]["english"]),
                "relatedTest": "Hemoglobin (Low Result)"
            })

        return cards

    @classmethod
    def _generate_patient_summary(cls, tests: List[Dict[str, Any]], abnormal_count: int, lang: str) -> str:
        total = len(tests)
        abnormal_names = [t.get("testName") for t in tests if t.get("status") in (TestStatus.HIGH, TestStatus.LOW)]
        abnormal_str = ", ".join(abnormal_names[:3])

        if abnormal_count == 0:
            if lang == "hindi":
                return f"इस रिपोर्ट में जांचे गए सभी {total} बायोमार्कर सामान्य और स्वस्थ संदर्भ सीमा के भीतर हैं।"
            elif lang == "hinglish":
                return f"Is report me check kiye gaye sabhi {total} biomarkers bilkul normal aur healthy range me hain."
            else:
                return f"All {total} biomarkers evaluated in this report are within the standard healthy reference ranges."
        else:
            if lang == "hindi":
                return (
                    f"आपकी रिपोर्ट में कुल {total} में से {abnormal_count} परीक्षण सामान्य संदर्भ सीमा से बाहर हैं ({abnormal_str})। "
                    f"शेष परीक्षण सामान्य सीमा में हैं। इन परिणामों पर अपने डॉक्टर से चर्चा करें।"
                )
            elif lang == "hinglish":
                return (
                    f"Aapki report me total {total} me se {abnormal_count} biomarkers standard range se thode alag hain ({abnormal_str})। "
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
            return f"{name} के स्तर की नैदानिक जांच।"
        elif lang == "hinglish":
            return f"{name} level ki diagnostic testing."
        return f"Clinical biomarker test measuring {name}."

    @staticmethod
    def _default_explanation(test: Dict[str, Any], lang: str) -> str:
        val = test.get("value")
        unit = test.get("unit", "")
        status = test.get("status", TestStatus.NORMAL)
        if lang == "hindi":
            return f"रिपोर्ट में आपका स्तर {val} {unit} दर्ज किया गया है ({status})।"
        elif lang == "hinglish":
            return f"Aapka result {val} {unit} record kiya gaya hai ({status})।"
        return f"Your result is recorded as {val} {unit} with status {status}."
