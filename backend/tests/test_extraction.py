import pytest
from app.services.extractor_service import ExtractorService

def test_extract_structured_data_biomarkers():
    sample_report_text = """
    METROPOLIS HEALTHCARE LABS
    Patient Name: John Doe
    Date: 2026-08-15

    COMPLETE BLOOD COUNT & METABOLIC PANEL
    Hemoglobin: 13.5 g/dL (Reference: 12.0 - 15.5)
    WBC: 6500 /uL (Reference: 4000 - 11000)
    Platelets: 220000 /uL (Reference: 150000 - 450000)
    Fasting Blood Glucose: 95 mg/dL (Reference: 70 - 99)
    ALT: 28 U/L (Reference: < 40)
    Serum Creatinine: 0.9 mg/dL (Reference: 0.6 - 1.2)
    Total Cholesterol: 185 mg/dL (Reference: < 200)
    TSH: 2.1 mIU/L (Reference: 0.4 - 4.0)
    """

    data = ExtractorService.extract_structured_data(sample_report_text)
    
    assert data["reportName"] == "Complete Blood Count & Metabolic Panel"
    assert data["patientName"] == "John Doe"
    assert "METROPOLIS HEALTHCARE LABS" in data["labName"].upper()
    assert "2026-08-15" in data["reportDate"]

    tests = data["tests"]
    test_names = [t["testName"] for t in tests]
    assert "Hemoglobin" in test_names
    assert "WBC" in test_names
    assert "Platelets" in test_names
    assert "ALT" in test_names
    assert "Serum Creatinine" in test_names
    assert "Total Cholesterol" in test_names
    assert "TSH" in test_names

    # Verify numerical parsing and bounds
    hb = next(t for t in tests if t["testName"] == "Hemoglobin")
    assert hb["numericValue"] == 13.5
    assert hb["minRange"] == 12.0
    assert hb["maxRange"] == 15.5

    alt = next(t for t in tests if t["testName"] == "ALT")
    assert alt["numericValue"] == 28.0
    assert alt["maxRange"] == 40.0

def test_extract_missing_values_and_ranges():
    # Report line without reference range
    text_missing_range = "Hemoglobin: 14.2 g/dL"
    data = ExtractorService.extract_structured_data(text_missing_range)
    assert len(data["tests"]) == 1
    t = data["tests"][0]
    assert t["testName"] == "Hemoglobin"
    assert t["numericValue"] == 14.2
    assert t["referenceRange"] is None
    assert t["minRange"] is None
    assert t["maxRange"] is None

def test_extract_empty_or_whitespace_text():
    data = ExtractorService.extract_structured_data("   \n\n   ")
    assert data["tests"] == []
    assert data["reportDate"] is None
