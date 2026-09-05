import pytest
from app.schemas.report import TestStatus
from app.services.analyzer_service import AnalyzerService

def test_classify_normal_range():
    # Value inside reference range 13.0 - 17.0
    status = AnalyzerService.classify_test_status(
        val=14.5, val_str="14.5", min_r=13.0, max_r=17.0, ref_str="13.0 - 17.0"
    )
    assert status == TestStatus.NORMAL

def test_classify_low_value():
    # Value below min range 12.0
    status = AnalyzerService.classify_test_status(
        val=10.2, val_str="10.2", min_r=12.0, max_r=15.5, ref_str="12.0 - 15.5"
    )
    assert status == TestStatus.LOW

def test_classify_high_value():
    # Value above max range 35
    status = AnalyzerService.classify_test_status(
        val=48.0, val_str="48", min_r=7.0, max_r=35.0, ref_str="7 - 35"
    )
    assert status == TestStatus.HIGH

def test_classify_upper_bound_only():
    # Total cholesterol < 200
    normal_status = AnalyzerService.classify_test_status(
        val=180.0, val_str="180", min_r=None, max_r=200.0, ref_str="< 200"
    )
    assert normal_status == TestStatus.NORMAL

    high_status = AnalyzerService.classify_test_status(
        val=225.0, val_str="225", min_r=None, max_r=200.0, ref_str="< 200"
    )
    assert high_status == TestStatus.HIGH

def test_classify_missing_reference_range():
    # ZERO HALLUCINATION RULE: Never assume range when report does not provide one
    status = AnalyzerService.classify_test_status(
        val=95.0, val_str="95", min_r=None, max_r=None, ref_str=None
    )
    assert status == TestStatus.UNABLE_TO_DETERMINE

def test_classify_qualitative_negative():
    status = AnalyzerService.classify_test_status(
        val=None, val_str="Negative", min_r=None, max_r=None, ref_str="Negative"
    )
    assert status == TestStatus.NORMAL

def test_analyze_report_tests_important_findings():
    tests = [
        {"testName": "Hemoglobin", "value": "10.2", "numericValue": 10.2, "unit": "g/dL", "minRange": 12.0, "maxRange": 15.5, "referenceRange": "12.0 - 15.5"},
        {"testName": "Glucose Fasting", "value": "92", "numericValue": 92.0, "unit": "mg/dL", "minRange": 70.0, "maxRange": 100.0, "referenceRange": "70 - 100"},
        {"testName": "ALT", "value": "48", "numericValue": 48.0, "unit": "U/L", "minRange": 7.0, "maxRange": 35.0, "referenceRange": "7 - 35"},
    ]

    analyzed, findings, normal_cnt, abnormal_cnt, overall_stat = AnalyzerService.analyze_report_tests(tests)

    assert normal_cnt == 1
    assert abnormal_cnt == 2
    assert overall_stat == "attention"
    assert len(findings) == 2
    assert findings[0]["testName"] == "Hemoglobin"
    assert findings[0]["status"] == TestStatus.LOW
    assert findings[1]["testName"] == "ALT"
    assert findings[1]["status"] == TestStatus.HIGH
