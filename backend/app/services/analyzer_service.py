from typing import List, Dict, Any, Tuple, Optional
from app.schemas.report import TestStatus
from app.core.reference_ranges import get_standard_reference_range

class AnalyzerService:
    @classmethod
    def analyze_report_tests(cls, tests: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], int, int, str]:
        """
        Evaluates each test value against its reference range following Priority A -> B -> C:
        - Priority A: If report contains a reference range, ALWAYS use the exact extracted range.
        - Priority B: If report does NOT contain a range, use standardized clinical reference knowledge.
        - Priority C: If safe range cannot be determined (unsupported test/unit), keep 'Unable to determine'.
        
        Returns: (analyzed_tests, important_findings, normal_count, abnormal_count, overall_status)
        """
        analyzed_tests: List[Dict[str, Any]] = []
        important_findings: List[Dict[str, Any]] = []
        normal_count = 0
        abnormal_count = 0

        for test in tests:
            test_copy = dict(test)
            test_name = test_copy.get("testName") or test_copy.get("name") or "Biomarker"
            val = test_copy.get("numericValue")
            val_str = str(test_copy.get("value", ""))
            unit = test_copy.get("unit", "")
            ref_str = test_copy.get("referenceRange")
            min_r = test_copy.get("minRange")
            max_r = test_copy.get("maxRange")

            # -------------------------------------------------------------
            # Reference Range Priority Resolution
            # -------------------------------------------------------------
            # Priority A: Report-provided range exists and has bounds or qualitative text
            has_report_range = bool(ref_str and (min_r is not None or max_r is not None or "negative" in str(ref_str).lower()))

            if not has_report_range:
                # Priority B: Consult centralized clinical knowledge base
                standard_ref = get_standard_reference_range(test_name, unit)
                if standard_ref:
                    test_copy["referenceRange"] = standard_ref["display"]
                    test_copy["minRange"] = standard_ref["min"]
                    test_copy["maxRange"] = standard_ref["max"]
                    if not test_copy.get("unit") or test_copy.get("unit") == "":
                        test_copy["unit"] = standard_ref["unit"]
                        unit = standard_ref["unit"]
                    min_r = standard_ref["min"]
                    max_r = standard_ref["max"]
                    ref_str = standard_ref["display"]
                else:
                    # Priority C: Missing context or unsupported test -> Keep unable to determine
                    test_copy["referenceRange"] = ref_str  # None or unparseable
                    test_copy["minRange"] = None
                    test_copy["maxRange"] = None

            # Calculate clinical status strictly
            status = cls.classify_test_status(
                val=val,
                val_str=val_str,
                min_r=min_r,
                max_r=max_r,
                ref_str=ref_str
            )
            test_copy["status"] = status

            if status == TestStatus.NORMAL:
                normal_count += 1
            elif status in (TestStatus.HIGH, TestStatus.LOW):
                abnormal_count += 1
                # Add to Important Findings with strictly safe, non-diagnostic note
                finding = {
                    "testName": test_name,
                    "value": test_copy.get("value"),
                    "unit": unit,
                    "referenceRange": test_copy.get("referenceRange"),
                    "status": status,
                    "medicalTerm": test_name,
                    "explanation": cls._generate_calm_finding_note(
                        test_name=test_name,
                        status=status,
                        val=test_copy.get("value"),
                        unit=unit,
                        ref_range=test_copy.get("referenceRange")
                    )
                }
                important_findings.append(finding)

            analyzed_tests.append(test_copy)

        overall_status = "attention" if abnormal_count > 0 else "normal"
        return analyzed_tests, important_findings, normal_count, abnormal_count, overall_status

    @staticmethod
    def classify_test_status(
        val: Any,
        val_str: str,
        min_r: Any,
        max_r: Any,
        ref_str: Any
    ) -> TestStatus:
        """
        Strict, non-speculative classification against reported reference range.
        Never guesses a reference range if absent.
        """
        # Textual qualitative matching (e.g. 'Negative' vs 'Negative')
        val_lower = val_str.strip().lower()
        if ref_str and isinstance(ref_str, str):
            ref_lower = ref_str.strip().lower()
            if "negative" in ref_lower and "negative" in val_lower:
                return TestStatus.NORMAL
            if "negative" in ref_lower and "positive" in val_lower:
                return TestStatus.HIGH

        # Numeric comparison
        if val is None or not isinstance(val, (int, float)):
            return TestStatus.UNABLE_TO_DETERMINE

        # If reference range is absent or unparseable, return unable_to_determine
        if min_r is None and max_r is None:
            return TestStatus.UNABLE_TO_DETERMINE

        # Both min and max present: e.g. 12.0 - 15.5
        if min_r is not None and max_r is not None:
            if val < min_r:
                return TestStatus.LOW
            elif val > max_r:
                return TestStatus.HIGH
            else:
                return TestStatus.NORMAL

        # Only upper limit: e.g. < 200, <= 140
        if max_r is not None and min_r is None:
            if val > max_r:
                return TestStatus.HIGH
            else:
                return TestStatus.NORMAL

        # Only lower limit: e.g. > 40, >= 90
        if min_r is not None and max_r is None:
            if val < min_r:
                return TestStatus.LOW
            else:
                return TestStatus.NORMAL

        return TestStatus.UNABLE_TO_DETERMINE

    @staticmethod
    def _generate_calm_finding_note(test_name: str, status: TestStatus, val: Any, unit: str, ref_range: Optional[str]) -> str:
        """
        Generates calm, objective, non-alarming finding description.
        Strictly educational: NEVER issues a diagnosis or treatment advice.
        """
        direction = "below" if status == TestStatus.LOW else "above"
        range_text = f" (reference range: {ref_range})" if ref_range else ""
        return (
            f"Your result for {test_name} ({val} {unit}) is {direction} the reference range{range_text}. "
            f"Discuss this result with a qualified healthcare professional to evaluate in context of your overall health."
        )
