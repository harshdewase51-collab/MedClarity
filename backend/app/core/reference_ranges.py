"""
Centralized Standard Clinical Laboratory Reference Ranges.
Strictly educational and non-diagnostic.
Supports the 6 core clinical laboratory panels:
1. Complete Blood Count (CBC)
2. Blood Sugar / Metabolic Panel
3. Liver Function Tests (LFT)
4. Kidney Function Tests (KFT / RFT)
5. Lipid Profile
6. Thyroid Function Panel
Plus standard electrolytes and essential vitamins.
"""

from typing import Optional, Dict, Any, List
import re

STANDARD_PANELS = {
    # ==========================================
    # 1. Complete Blood Count (CBC)
    # ==========================================
    "hemoglobin": {
        "aliases": ["hemoglobin", "hb", "hgb", "haemoglobin"],
        "display": "12.0 - 15.5 g/dL",
        "min": 12.0,
        "max": 15.5,
        "unit": "g/dL",
        "allowed_units": ["g/dl", "g/l", "gm/dl", "gm%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "wbc": {
        "aliases": ["wbc", "white blood cell", "white blood cells", "white blood cell count", "total leukocyte count", "tlc"],
        "display": "4.0 - 11.0 x10^3/µL",
        "min": 4.0,
        "max": 11.0,
        "unit": "x10^3/µL",
        "allowed_units": ["x10^3/µl", "x10^3/ul", "10^3/µl", "10^3/ul", "/µl", "/ul", "cells/mcl", "thou/ul", "k/ul", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "platelets": {
        "aliases": ["platelet count", "platelets", "platelet", "plt"],
        "display": "150 - 450 x10^3/µL",
        "min": 150.0,
        "max": 450.0,
        "unit": "x10^3/µL",
        "allowed_units": ["x10^3/µl", "x10^3/ul", "10^3/µl", "10^3/ul", "/µl", "/ul", "lakh/cumm", "k/ul", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "rbc": {
        "aliases": ["rbc", "red blood cell", "red blood cells", "red blood cell count", "erythrocyte count"],
        "display": "4.0 - 5.9 x10^6/µL",
        "min": 4.0,
        "max": 5.9,
        "unit": "x10^6/µL",
        "allowed_units": ["x10^6/µl", "x10^6/ul", "10^6/µl", "10^6/ul", "mil/ul", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "hematocrit": {
        "aliases": ["hematocrit", "hct", "pcv", "packed cell volume"],
        "display": "36.0 - 50.0 %",
        "min": 36.0,
        "max": 50.0,
        "unit": "%",
        "allowed_units": ["%", "vol%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "mcv": {
        "aliases": ["mcv", "mean corpuscular volume"],
        "display": "80.0 - 100.0 fL",
        "min": 80.0,
        "max": 100.0,
        "unit": "fL",
        "allowed_units": ["fl", "µm3", "um3", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "mch": {
        "aliases": ["mch", "mean corpuscular hemoglobin"],
        "display": "27.0 - 33.0 pg",
        "min": 27.0,
        "max": 33.0,
        "unit": "pg",
        "allowed_units": ["pg", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "mchc": {
        "aliases": ["mchc", "mean corpuscular hemoglobin concentration"],
        "display": "32.0 - 36.0 g/dL",
        "min": 32.0,
        "max": 36.0,
        "unit": "g/dL",
        "allowed_units": ["g/dl", "gm/dl", "%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "rdw": {
        "aliases": ["rdw", "red cell distribution width", "rdw-cv"],
        "display": "11.5 - 14.5 %",
        "min": 11.5,
        "max": 14.5,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "neutrophils": {
        "aliases": ["neutrophils", "neutrophil", "segs", "polymorphs"],
        "display": "40 - 75 %",
        "min": 40.0,
        "max": 75.0,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "lymphocytes": {
        "aliases": ["lymphocytes", "lymphocyte", "lymphs"],
        "display": "20 - 45 %",
        "min": 20.0,
        "max": 45.0,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "monocytes": {
        "aliases": ["monocytes", "monocyte"],
        "display": "2 - 10 %",
        "min": 2.0,
        "max": 10.0,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "eosinophils": {
        "aliases": ["eosinophils", "eosinophil", "eos"],
        "display": "1 - 6 %",
        "min": 1.0,
        "max": 6.0,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },
    "basophils": {
        "aliases": ["basophils", "basophil"],
        "display": "0 - 2 %",
        "min": 0.0,
        "max": 2.0,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Complete Blood Count (CBC)"
    },

    # ==========================================
    # 2. Blood Sugar / Metabolic Panel
    # ==========================================
    "glucose_fasting": {
        "aliases": ["fasting blood glucose", "fasting glucose", "blood glucose fasting", "glucose fasting", "fbs", "fasting blood sugar"],
        "display": "70 - 99 mg/dL",
        "min": 70.0,
        "max": 99.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Blood Sugar / Metabolic"
    },
    "glucose_generic": {
        "aliases": ["blood glucose", "glucose", "random blood sugar", "rbs"],
        "display": "70 - 140 mg/dL",
        "min": 70.0,
        "max": 140.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Blood Sugar / Metabolic"
    },
    "glucose_postprandial": {
        "aliases": ["postprandial glucose", "ppbs", "post prandial blood sugar", "postprandial blood glucose"],
        "display": "< 140 mg/dL",
        "min": 0.0,
        "max": 140.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Blood Sugar / Metabolic"
    },
    "hba1c": {
        "aliases": ["hba1c", "glycated hemoglobin", "glycosylated hemoglobin", "a1c"],
        "display": "< 5.7 %",
        "min": 4.0,
        "max": 5.6,
        "unit": "%",
        "allowed_units": ["%", ""],
        "panel": "Blood Sugar / Metabolic"
    },

    # ==========================================
    # 3. Liver Function Tests (LFT)
    # ==========================================
    "alt": {
        "aliases": ["alanine aminotransferase", "alt", "sgpt", "alanine transaminase"],
        "display": "7 - 56 U/L",
        "min": 7.0,
        "max": 56.0,
        "unit": "U/L",
        "allowed_units": ["u/l", "iu/l", "units/l", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "ast": {
        "aliases": ["aspartate aminotransferase", "ast", "sgot", "aspartate transaminase"],
        "display": "8 - 48 U/L",
        "min": 8.0,
        "max": 48.0,
        "unit": "U/L",
        "allowed_units": ["u/l", "iu/l", "units/l", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "bilirubin_total": {
        "aliases": ["total bilirubin", "bilirubin total", "serum bilirubin", "bilirubin"],
        "display": "0.2 - 1.2 mg/dL",
        "min": 0.2,
        "max": 1.2,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "bilirubin_direct": {
        "aliases": ["direct bilirubin", "conjugated bilirubin"],
        "display": "0.0 - 0.3 mg/dL",
        "min": 0.0,
        "max": 0.3,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "alp": {
        "aliases": ["alkaline phosphatase", "alp", "alk phos"],
        "display": "44 - 147 U/L",
        "min": 44.0,
        "max": 147.0,
        "unit": "U/L",
        "allowed_units": ["u/l", "iu/l", "units/l", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "total_protein": {
        "aliases": ["total protein", "serum protein", "protein total"],
        "display": "6.0 - 8.3 g/dL",
        "min": 6.0,
        "max": 8.3,
        "unit": "g/dL",
        "allowed_units": ["g/dl", "gm/dl", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "albumin": {
        "aliases": ["albumin", "serum albumin"],
        "display": "3.5 - 5.0 g/dL",
        "min": 3.5,
        "max": 5.0,
        "unit": "g/dL",
        "allowed_units": ["g/dl", "gm/dl", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "globulin": {
        "aliases": ["globulin", "serum globulin"],
        "display": "2.0 - 3.5 g/dL",
        "min": 2.0,
        "max": 3.5,
        "unit": "g/dL",
        "allowed_units": ["g/dl", "gm/dl", ""],
        "panel": "Liver Function Panel (LFT)"
    },
    "ag_ratio": {
        "aliases": ["a/g ratio", "albumin globulin ratio", "ag ratio"],
        "display": "1.0 - 2.2",
        "min": 1.0,
        "max": 2.2,
        "unit": "",
        "allowed_units": ["", "ratio"],
        "panel": "Liver Function Panel (LFT)"
    },

    # ==========================================
    # 4. Kidney Function Tests (KFT / RFT)
    # ==========================================
    "creatinine": {
        "aliases": ["serum creatinine", "creatinine", "creat"],
        "display": "0.7 - 1.3 mg/dL",
        "min": 0.7,
        "max": 1.3,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Kidney Function Panel (KFT)"
    },
    "bun": {
        "aliases": ["blood urea nitrogen", "bun", "urea"],
        "display": "7.0 - 20.0 mg/dL",
        "min": 7.0,
        "max": 20.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Kidney Function Panel (KFT)"
    },
    "uric_acid": {
        "aliases": ["serum uric acid", "uric acid"],
        "display": "3.5 - 7.2 mg/dL",
        "min": 3.5,
        "max": 7.2,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Kidney Function Panel (KFT)"
    },
    "egfr": {
        "aliases": ["egfr", "estimated gfr", "glomerular filtration rate"],
        "display": "> 90 mL/min/1.73m2",
        "min": 90.0,
        "max": None,
        "unit": "mL/min/1.73m2",
        "allowed_units": ["ml/min/1.73m2", "ml/min", ""],
        "panel": "Kidney Function Panel (KFT)"
    },

    # ==========================================
    # 5. Lipid Profile
    # ==========================================
    "cholesterol_total": {
        "aliases": ["total cholesterol", "cholesterol total", "cholesterol"],
        "display": "< 200 mg/dL",
        "min": 0.0,
        "max": 200.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Lipid Profile"
    },
    "triglycerides": {
        "aliases": ["triglycerides", "triglyceride", "tg"],
        "display": "< 150 mg/dL",
        "min": 0.0,
        "max": 150.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Lipid Profile"
    },
    "hdl": {
        "aliases": ["hdl cholesterol", "hdl", "high-density lipoprotein"],
        "display": "> 40 mg/dL",
        "min": 40.0,
        "max": None,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Lipid Profile"
    },
    "ldl": {
        "aliases": ["ldl cholesterol", "ldl", "low-density lipoprotein"],
        "display": "< 100 mg/dL",
        "min": 0.0,
        "max": 100.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Lipid Profile"
    },
    "vldl": {
        "aliases": ["vldl cholesterol", "vldl"],
        "display": "5 - 30 mg/dL",
        "min": 5.0,
        "max": 30.0,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mg%", ""],
        "panel": "Lipid Profile"
    },

    # ==========================================
    # 6. Thyroid Function Panel
    # ==========================================
    "tsh": {
        "aliases": ["tsh", "thyroid stimulating hormone", "ultrasensitive tsh"],
        "display": "0.45 - 4.5 µIU/mL",
        "min": 0.45,
        "max": 4.5,
        "unit": "µIU/mL",
        "allowed_units": ["µiu/ml", "uiu/ml", "miu/l", "miu/ml", "u/l", ""],
        "panel": "Thyroid Function Panel"
    },
    "freet3": {
        "aliases": ["free t3", "ft3"],
        "display": "2.0 - 4.4 pg/mL",
        "min": 2.0,
        "max": 4.4,
        "unit": "pg/mL",
        "allowed_units": ["pg/ml", "pmol/l", ""],
        "panel": "Thyroid Function Panel"
    },
    "freet4": {
        "aliases": ["free t4", "ft4"],
        "display": "0.8 - 1.8 ng/dL",
        "min": 0.8,
        "max": 1.8,
        "unit": "ng/dL",
        "allowed_units": ["ng/dl", "pmol/l", ""],
        "panel": "Thyroid Function Panel"
    },
    "total_t3": {
        "aliases": ["total t3", "t3 total", "triiodothyronine"],
        "display": "80 - 200 ng/dL",
        "min": 80.0,
        "max": 200.0,
        "unit": "ng/dL",
        "allowed_units": ["ng/dl", "nmol/l", ""],
        "panel": "Thyroid Function Panel"
    },
    "total_t4": {
        "aliases": ["total t4", "t4 total", "thyroxine"],
        "display": "5.0 - 12.0 µg/dL",
        "min": 5.0,
        "max": 12.0,
        "unit": "µg/dL",
        "allowed_units": ["µg/dl", "ug/dl", "nmol/l", ""],
        "panel": "Thyroid Function Panel"
    },

    # ==========================================
    # Essential Vitamins & Electrolytes
    # ==========================================
    "vitamind": {
        "aliases": ["vitamin d", "vitamin d3", "25-oh vitamin d", "25-hydroxy vitamin d"],
        "display": "30.0 - 100.0 ng/mL",
        "min": 30.0,
        "max": 100.0,
        "unit": "ng/mL",
        "allowed_units": ["ng/ml", "nmol/l", ""],
        "panel": "Vitamins & Minerals"
    },
    "calcium": {
        "aliases": ["serum calcium", "calcium", "ca"],
        "display": "8.5 - 10.5 mg/dL",
        "min": 8.5,
        "max": 10.5,
        "unit": "mg/dL",
        "allowed_units": ["mg/dl", "mmol/l", ""],
        "panel": "Electrolytes & Minerals"
    },
    "potassium": {
        "aliases": ["serum potassium", "potassium", "k"],
        "display": "3.5 - 5.0 mmol/L",
        "min": 3.5,
        "max": 5.0,
        "unit": "mmol/L",
        "allowed_units": ["mmol/l", "meq/l", ""],
        "panel": "Electrolytes & Minerals"
    },
    "sodium": {
        "aliases": ["serum sodium", "sodium", "na"],
        "display": "135 - 145 mmol/L",
        "min": 135.0,
        "max": 145.0,
        "unit": "mmol/L",
        "allowed_units": ["mmol/l", "meq/l", ""],
        "panel": "Electrolytes & Minerals"
    },
}


def normalize_test_key(test_name: str) -> Optional[str]:
    """Matches a biomarker name to its standard clinical panel key."""
    if not test_name:
        return None
    raw = test_name.strip().lower()
    # Normalize punctuation and extra spaces
    cleaned = re.sub(r'[\(\)\[\]:,.-]', ' ', raw)
    cleaned = ' '.join(cleaned.split())

    # Direct alias matching
    for key, data in STANDARD_PANELS.items():
        for alias in data["aliases"]:
            if alias == cleaned or alias == raw:
                return key

    # Substring / boundary matching
    for key, data in STANDARD_PANELS.items():
        for alias in data["aliases"]:
            if len(alias) >= 3 and alias in cleaned:
                # Disambiguate generic glucose vs fasting
                if key == "glucose_generic" and ("fasting" in cleaned or "fbs" in cleaned):
                    return "glucose_fasting"
                if key == "bilirubin_total" and "direct" in cleaned:
                    return "bilirubin_direct"
                return key

    return None


def get_standard_reference_range(test_name: str, unit: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Returns the standardized clinical reference range for a biomarker if available
    and unit-compatible.
    Returns None if biomarker is unknown or has incompatible unit.
    """
    key = normalize_test_key(test_name)
    if not key or key not in STANDARD_PANELS:
        return None

    entry = STANDARD_PANELS[key]

    # Check unit compatibility
    norm_unit = (unit or "").strip().lower()
    allowed = entry["allowed_units"]
    
    # If a unit was supplied, ensure it matches allowed units
    if norm_unit and allowed and norm_unit not in allowed:
        # Check partial match (e.g. "g/dl" vs "g/dL")
        if not any(a in norm_unit for a in allowed if a):
            return None

    return {
        "display": entry["display"],
        "min": entry["min"],
        "max": entry["max"],
        "unit": entry["unit"],
        "panel": entry["panel"],
        "is_standard_fallback": True
    }
