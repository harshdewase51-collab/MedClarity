from typing import List, Dict, Any, Tuple
from app.schemas.report import TestStatus

class AnalyzerService:
    @classmethod
    def analyze_report_tests(cls, tests: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], int, int, str]:
        """
        Evaluates each test value against its reported reference range.
        Returns: (analyzed_tests, important_findings, normal_count, abnormal_count, overall_status)
        """
        analyzed_tests: List[Dict[str, Any]] = []
        important_findings: List[Dict[str, Any]] = []
        normal_count = 0
        abnormal_count = 0

        for test in tests:
            status = cls.classify_test_status(
                val=test.get("numericValue"),
                val_str=str(test.get("value", "")),
                min_r=test.get("minRange"),
                max_r=test.get("maxRange"),
                ref_str=test.get("referenceRange")
            )

            test_copy = dict(test)
            test_copy["status"] = status

            if status == TestStatus.NORMAL:
                normal_count += 1
            elif status in (TestStatus.HIGH, TestStatus.LOW):
                abnormal_count += 1
                # Add to Important Findings
                finding = {
                    "testName": test_copy.get("testName"),
                    "value": test_copy.get("value"),
                    "unit": test_copy.get("unit", ""),
                    "referenceRange": test_copy.get("referenceRange"),
                    "status": status,
                    "medicalTerm": test_copy.get("testName"),
                    "explanation": cls._generate_calm_finding_note(
                        test_name=test_copy.get("testName"),
                        status=status,
                        val=test_copy.get("value"),
                        unit=test_copy.get("unit", ""),
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

        # Both min and max present: e.g. 13 - 17
        if min_r is not None and max_r is not None:
            if val < min_r:
                return TestStatus.LOW
            elif val > max_r:
                return TestStatus.HIGH
            else:
                return TestStatus.NORMAL

        # Only upper limit: e.g. < 200
        if max_r is not None and min_r is None:
            if val > max_r:
                return TestStatus.HIGH
            else:
                return TestStatus.NORMAL

        # Only lower limit: e.g. > 50
        if min_r is not None and max_r is None:
            if val < min_r:
                return TestStatus.LOW
            else:
                return TestStatus.NORMAL

        return TestStatus.UNABLE_TO_DETERMINE

    @staticmethod
    def _generate_calm_finding_note(test_name: str, status: TestStatus, val: Any, unit: str, ref_range: str) -> str:
        """
        Generates calm, objective, non-alarming finding description.
        Never issues a diagnosis.
        """
        direction = "below" if status == TestStatus.LOW else "above"
        range_text = f" (standard reference: {ref_range})" if ref_range else ""
        return (
            f"Your result for {test_name} ({val} {unit}) is {direction} the reference range mentioned in the report{range_text}. "
            f"Discuss this biomarker with your physician to evaluate in context of your overall health."
        )
