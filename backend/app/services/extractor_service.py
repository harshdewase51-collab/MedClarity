import re
from typing import List, Dict, Any, Optional, Tuple

class ExtractorService:
    # Common laboratory biomarkers regex dictionary
    KNOWN_BIOMARKERS = [
        # Hematology / CBC
        "Hemoglobin", "Hb", "Haemoglobin", "WBC", "White Blood Cell", "White Blood Cells",
        "RBC", "Red Blood Cell", "Red Blood Cells", "Platelet Count", "Platelets",
        "Hematocrit", "HCT", "MCV", "MCH", "MCHC", "RDW", "Neutrophils", "Lymphocytes",
        "Monocytes", "Eosinophils", "Basophils",
        
        # Metabolic & Blood Sugar
        "Fasting Blood Glucose", "Fasting Glucose", "Blood Glucose", "Glucose Fasting", "Glucose",
        "HbA1c", "Glycated Hemoglobin", "Postprandial Glucose", "PPBS", "Random Blood Sugar",
        
        # Liver Function (LFT)
        "Alanine Aminotransferase", "ALT", "SGPT", "Aspartate Aminotransferase", "AST", "SGOT",
        "Alkaline Phosphatase", "ALP", "Total Bilirubin", "Direct Bilirubin", "Indirect Bilirubin",
        "Total Protein", "Albumin", "Globulin", "A/G Ratio", "GGT",
        
        # Kidney Function (KFT / RFT)
        "Serum Creatinine", "Creatinine", "Blood Urea Nitrogen", "BUN", "Urea",
        "eGFR", "Estimated GFR", "Glomerular Filtration Rate", "Uric Acid", "Serum Uric Acid",
        
        # Electrolytes & Minerals
        "Sodium", "Potassium", "Chloride", "Calcium", "Phosphorus", "Magnesium",
        
        # Lipid Profile
        "Total Cholesterol", "Cholesterol", "Triglycerides", "HDL Cholesterol", "HDL",
        "LDL Cholesterol", "LDL", "VLDL Cholesterol", "VLDL", "Non-HDL Cholesterol",
        
        # Thyroid & Hormones
        "TSH", "Thyroid Stimulating Hormone", "Free T3", "Free T4", "Total T3", "Total T4",
        "FSH", "Follicle Stimulating Hormone", "Prolactin", "LH", "Luteinizing Hormone",
        "Testosterone", "Total Testosterone", "Free Testosterone", "Estradiol", "Estrogen",
        "Progesterone", "Cortisol", "DHEA-S", "PSA", "Total PSA",
        
        # Vitamins & Inflammation
        "Vitamin D", "Vitamin D3", "Vitamin D, 25-Hydroxy", "25-OH Vitamin D",
        "Vitamin B12", "Ferritin", "Iron", "TIBC", "ESR", "CRP", "C-Reactive Protein"
    ]

    DISALLOWED_WORDS = (
        r'(?i)\b(?:page|patient|doctor|date|phone|lab|sample|address|floor|road|'
        r'nagpur|enclave|opp|school|hospital|ph\b|tel\b|www\b|http|verified|authorised|'
        r'interpretation|notes|method|technology|comment|investigation|finding|'
        r'biological|reference|specimen|collection|release|adequacy|affiliation|'
        r'dr\b|mrs\b|mr\b|md\b|ms\b|cmia|clia|eia|elisa|sm\b|end of|centre|center|dhruv|'
        r'laxminagar|ramdaspeth|follicular|luteal|mid-cycle|midcycle|ovulatory|ovulation|'
        r'phase|peak|post-menopausal|pre-menopausal|postmenopausal|premenopausal|'
        r'menopause|menopausal|adult male|adult female|male|female|trimester|'
        r'pregnancy|pediatric|children|interval|cutoff|cut-off|normal values)\b'
    )

    @classmethod
    def _is_valid_test_name(cls, name: str) -> bool:
        if not name:
            return False
        clean = name.strip(" :-|*#\t").strip()
        if len(clean) < 2 or len(clean) > 45:
            return False
        # Must have at least 2 alphabetic characters
        letters = sum(1 for c in clean if c.isalpha())
        if letters < 2:
            return False
        # Cannot be pure numbers or numbers with hyphens/comparison
        if re.match(r'^[0-9.<>=\s\-~]+$', clean):
            return False
        # Cannot end with comparison or preposition words
        if re.search(r'(?i)\b(?:to|from|than|below|above|ref|range|approx|phase|peak)\b\s*$', clean):
            return False
        # Disallow noise words
        if re.search(cls.DISALLOWED_WORDS, clean):
            return False
        return True

    @classmethod
    def extract_structured_data(cls, raw_text: str) -> Dict[str, Any]:
        """
        Parses raw text into structured medical report metadata and test results.
        Enforces strict zero-hallucination rule: never fabricates missing values or ranges.
        """
        if not raw_text or not raw_text.strip():
            return {
                "reportName": "Medical Report",
                "reportDate": None,
                "labName": None,
                "patientName": None,
                "tests": []
            }

        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        
        metadata = cls._extract_metadata(lines, raw_text)
        tests = cls._extract_biomarker_tests(lines)

        return {
            "reportName": metadata.get("reportName", "Diagnostic Laboratory Report"),
            "reportDate": metadata.get("reportDate"),
            "labName": metadata.get("labName"),
            "patientName": metadata.get("patientName"),
            "tests": tests
        }

    @classmethod
    def _extract_metadata(cls, lines: List[str], full_text: str) -> Dict[str, Any]:
        """Extracts patient name, report date, and lab name from header text"""
        metadata = {
            "reportName": "Laboratory Medical Report",
            "reportDate": None,
            "labName": None,
            "patientName": None
        }

        # Date regex patterns
        date_pattern = r'(?i)\b(?:date|collected|reported|sample date)?[:\s\uff1a]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\b'
        date_match = re.search(date_pattern, full_text)
        if date_match:
            metadata["reportDate"] = date_match.group(1).strip()

        # Patient name pattern (supports standard : and full-width colon ：)
        patient_match = re.search(r'(?i)\bpatient(?:\s*name)?\s*[:\uff1a\t]+\s*([A-Za-z.\s]{2,40})', full_text)
        if patient_match:
            raw_p = patient_match.group(1).strip()
            # Clean off trailing words like Date, Age, Gender if merged
            raw_p = re.split(r'(?i)\b(?:date|age|gender|ref|sample)\b', raw_p)[0].strip()
            if len(raw_p) >= 2:
                metadata["patientName"] = raw_p

        # Lab name pattern
        lab_match = re.search(r'(?i)\b([A-Za-z0-9\s&]+(?:Diagnostics|Laboratory|Laboratories|Pathology|Hospital|Health Lab|Clinical Lab|Labs|Lab))\b', full_text)
        if lab_match:
            metadata["labName"] = lab_match.group(1).strip()

        # Panel title inference
        if re.search(r'(?i)\bcomplete blood count\b|\bcbc\b', full_text) and re.search(r'(?i)\bmetabolic\b', full_text):
            metadata["reportName"] = "Complete Blood Count & Metabolic Panel"
        elif re.search(r'(?i)\bcomplete blood count\b|\bcbc\b', full_text):
            metadata["reportName"] = "Complete Blood Count (CBC)"
        elif re.search(r'(?i)\blipid profile\b|\bcholesterol\b', full_text):
            metadata["reportName"] = "Comprehensive Lipid Profile"
        elif re.search(r'(?i)\bthyroid\b|\btsh\b', full_text):
            metadata["reportName"] = "Thyroid Function Panel"
        elif re.search(r'(?i)\bfollicle\b|\bfsh\b|\bprolactin\b|\bhormone\b', full_text):
            metadata["reportName"] = "Hormone & Endocrine Evaluation Report"
        elif re.search(r'(?i)\brenal\b|\bkidney\b', full_text):
            metadata["reportName"] = "Renal Function Panel"
        elif re.search(r'(?i)\bliver function\b|\blft\b', full_text):
            metadata["reportName"] = "Liver Function Panel"

        return metadata

    @classmethod
    def _extract_biomarker_tests(cls, lines: List[str]) -> List[Dict[str, Any]]:
        """
        Parses test results line by line using clinical regex extraction.
        Supports both single-line and multiline tabular extraction.
        """
        tests: List[Dict[str, Any]] = []
        seen_names = set()
        consumed_indices = set()

        sorted_markers = sorted(cls.KNOWN_BIOMARKERS, key=len, reverse=True)

        for idx, line in enumerate(lines):
            if idx in consumed_indices:
                continue

            line_clean = line.strip()
            # Ignore divider lines and header titles
            if line_clean.startswith("---") or re.match(r'(?i)^test\s+(?:name|result)', line_clean):
                continue

            clean_marker_line = re.sub(r'^[\s*#\-•]+', '', line_clean).strip()
            matched = False

            # 1. Known Biomarkers Matching
            for marker in sorted_markers:
                # Check if this line starts with or cleanly contains the marker
                if re.search(rf'^{re.escape(marker)}\b', clean_marker_line, re.IGNORECASE) or \
                   re.search(rf'\b({re.escape(marker)})\b[:\s\t|]+[0-9.]+', line_clean, re.IGNORECASE):
                    
                    # Try single-line match first
                    regex = re.compile(
                        rf'\b({re.escape(marker)})\b'
                        r'[:\s\t|]+'
                        r'([0-9.]+|Negative|Positive|Normal)'
                        r'(?:\s*([a-zA-Z0-9/%^µuL-]+(?:\^3/[µu]L|\^6/[µu]L)?))?'
                        r'(?:.*?'
                        r'(?:ref(?:erence)?[:\s]*)?'
                        r'[\(\[]?'
                        r'([<>]?\s*[0-9.]+\s*(?:[-–—~]|to)\s*[0-9.]+|[<>=]+\s*[0-9.]+)'
                        r'[\)\]]?)?',
                        re.IGNORECASE
                    )
                    m = regex.search(line_clean)
                    
                    if m:
                        test_name = m.group(1).strip()
                        val_str = m.group(2).strip()
                        unit = (m.group(3) or "").strip()
                        ref_str = (m.group(4) or "").strip() if m.group(4) else None

                        if not ref_str:
                            ref_search = re.search(
                                r'(?:ref(?:erence)?(?:\s*range)?[:\s]*)?[\(\[]?([<>]?\s*\d+(?:\.\d+)?\s*(?:[-–—~]|to)\s*\d+(?:\.\d+)?|[<>=]+\s*\d+(?:\.\d+)?)[\)\]]?',
                                line_clean[m.end(2):],
                                re.IGNORECASE
                            )
                            if ref_search:
                                ref_str = ref_search.group(1).strip()

                        if test_name.lower() not in seen_names:
                            min_r, max_r = cls._parse_range_bounds(ref_str)
                            numeric_val = cls._parse_float(val_str)
                            tests.append({
                                "testName": test_name,
                                "value": val_str,
                                "numericValue": numeric_val,
                                "unit": unit,
                                "referenceRange": ref_str,
                                "minRange": min_r,
                                "maxRange": max_r,
                                "rawLine": line_clean
                            })
                            seen_names.add(test_name.lower())
                            matched = True
                            break

                    # Multiline match: Value is on the next line (e.g. scanned tabular reports like SAimom.pdf)
                    elif idx + 1 < len(lines):
                        next_line = lines[idx + 1].strip()
                        m_val_next = re.match(r'^([0-9.]+)(?:\s*([a-zA-Z0-9/%^µuL-]+))?$', next_line)
                        if m_val_next:
                            val_str = m_val_next.group(1)
                            unit = m_val_next.group(2) or ""
                            ref_str = None
                            consumed_indices.add(idx + 1)

                            # Scan subsequent lines for reference range and consume phase/interval/method lines
                            for j in range(idx + 2, min(idx + 16, len(lines))):
                                sub_line = lines[j].strip()
                                # Stop if another test marker begins
                                if any(re.match(rf'^[*\s]*{re.escape(k)}\b', sub_line, re.IGNORECASE) for k in sorted_markers):
                                    break
                                
                                # Check if line is part of reference ranges, phases, methods, or demographic intervals
                                is_phase_or_subrange = bool(
                                    re.search(r'(?i)\b(?:phase|peak|menopausal|post-menopausal|adult|male|female|cmia|clia|eia|elisa|method|biological|ref|interpretation|comment)\b', sub_line) or
                                    re.match(r'^[0-9.<>=\s\-~to]+(?:\s*[a-zA-Z0-9/%^µuL-]+)?$', sub_line) or
                                    re.search(r':\s*[0-9.]+', sub_line)
                                )
                                if is_phase_or_subrange:
                                    consumed_indices.add(j)

                                m_ref = re.search(r'([<>]?\s*[0-9.]+\s*(?:[-–—~]|to)\s*[0-9.]+|[<>=]+\s*[0-9.]+)(?:\s*([a-zA-Z0-9/%^µuL-]+))?', sub_line)
                                if m_ref:
                                    # Pick the first range or prefer female/post-menopausal specific range
                                    if not ref_str or "post-menopausal" in sub_line.lower() or "female" in sub_line.lower():
                                        ref_str = m_ref.group(1)
                                        if not unit and m_ref.group(2):
                                            unit = m_ref.group(2)

                            if marker.lower() not in seen_names:
                                min_r, max_r = cls._parse_range_bounds(ref_str)
                                numeric_val = cls._parse_float(val_str)
                                tests.append({
                                    "testName": marker,
                                    "value": val_str,
                                    "numericValue": numeric_val,
                                    "unit": unit,
                                    "referenceRange": ref_str,
                                    "minRange": min_r,
                                    "maxRange": max_r,
                                    "rawLine": f"{line_clean} | {next_line}"
                                })
                                seen_names.add(marker.lower())
                                matched = True
                                break

            # 2. Generic Regex Matching (fallback for non-dictionary tests)
            if not matched:
                generic_regex = re.compile(
                    r'^(?P<name>[A-Za-z0-9\s/(),.-]+?)'
                    r'[:\t\s|]+'
                    r'(?P<value>\d+(?:\.\d+)?|Negative|Positive|Normal)'
                    r'(?:\s+(?P<unit>[a-zA-Z0-9/%^µuL-]+(?:\^3/[µu]L|\^6/[µu]L)?))?'
                    r'(?:.*?'
                    r'(?:ref(?:erence)?[:\s]*)?'
                    r'[\(\[]?'
                    r'(?P<range>[<>]?\s*\d+(?:\.\d+)?\s*(?:[-–—~]|to)\s*\d+(?:\.\d+)?|[<>=]+\s*\d+(?:\.\d+)?)'
                    r'[\)\]]?)?',
                    re.IGNORECASE
                )
                m_gen = generic_regex.search(line_clean)
                if m_gen:
                    t_name = m_gen.group("name").strip(" :-|*#\t")
                    val_str = m_gen.group("value").strip()
                    unit = (m_gen.group("unit") or "").strip()
                    ref_str = m_gen.group("range").strip() if m_gen.group("range") else None

                    # Strict filter: Must be a genuine test name, not a phase, interval, or address
                    if cls._is_valid_test_name(t_name):
                        if t_name.lower() not in seen_names:
                            min_r, max_r = cls._parse_range_bounds(ref_str)
                            numeric_val = cls._parse_float(val_str)
                            tests.append({
                                "testName": t_name,
                                "value": val_str,
                                "numericValue": numeric_val,
                                "unit": unit,
                                "referenceRange": ref_str,
                                "minRange": min_r,
                                "maxRange": max_r,
                                "rawLine": line_clean
                            })
                            seen_names.add(t_name.lower())

        return tests

    @staticmethod
    def _parse_float(val: str) -> Optional[float]:
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _parse_range_bounds(ref_range: Optional[str]) -> Tuple[Optional[float], Optional[float]]:
        if not ref_range:
            return None, None

        # Two bounds: e.g. 12.0 - 15.5, 12.0–15.5, 12.0 to 15.5
        m_two = re.search(r'(\d+(?:\.\d+)?)\s*(?:[-–—~]|to)\s*(\d+(?:\.\d+)?)', ref_range, re.IGNORECASE)
        if m_two:
            try:
                return float(m_two.group(1)), float(m_two.group(2))
            except ValueError:
                pass

        # Upper bound only: e.g. < 200, <= 140, < 5.7
        m_upper = re.search(r'[<=]+\s*(\d+(?:\.\d+)?)', ref_range)
        if m_upper:
            try:
                return 0.0, float(m_upper.group(1))
            except ValueError:
                pass

        # Lower bound only: e.g. > 60, >= 50
        m_lower = re.search(r'[>=]+\s*(\d+(?:\.\d+)?)', ref_range)
        if m_lower:
            try:
                return float(m_lower.group(1)), None
            except ValueError:
                pass

        return None, None
