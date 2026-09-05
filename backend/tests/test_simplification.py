import pytest
from app.schemas.report import ReportLanguage, TestStatus
from app.services.simplifier_service import SimplifierService

def test_simplification_english():
    mock_data = {
        "tests": [
            {
                "testName": "Hemoglobin",
                "value": "10.2",
                "unit": "g/dL",
                "referenceRange": "12.0 - 15.5",
                "status": TestStatus.LOW
            },
            {
                "testName": "Fasting Blood Glucose",
                "value": "92",
                "unit": "mg/dL",
                "referenceRange": "70 - 100",
                "status": TestStatus.NORMAL
            }
        ],
        "importantFindings": [],
        "abnormalCount": 1,
        "normalCount": 1
    }

    result = SimplifierService.simplify_report(mock_data, language=ReportLanguage.ENGLISH)

    assert result["language"] == "english"
    assert "disclaimer" in result
    assert "This tool helps explain medical reports" in result["disclaimer"]
    assert len(result["tests"]) == 2
    assert result["tests"][0]["medicalTerm"] is not None
    assert result["tests"][0]["simpleMeaning"] is not None
    assert result["tests"][0]["simpleExplanation"] is not None

    # Verify 3-tier explanation cards structure
    assert len(result["aiExplanations"]) >= 1
    card = result["aiExplanations"][0]
    assert "medicalTerm" in card
    assert "simpleMeaning" in card
    assert "easyExplanation" in card

def test_simplification_hindi():
    mock_data = {
        "tests": [
            {
                "testName": "Hemoglobin",
                "value": "10.2",
                "unit": "g/dL",
                "referenceRange": "12.0 - 15.5",
                "status": TestStatus.LOW
            }
        ],
        "importantFindings": [],
        "abnormalCount": 1,
        "normalCount": 0
    }

    result = SimplifierService.simplify_report(mock_data, language=ReportLanguage.HINDI)

    assert result["language"] == "hindi"
    card = result["aiExplanations"][0]
    # Check for Devanagari Hindi text
    assert "हीमोग्लोबिन" in card["medicalTerm"] or "एनीमिया" in card["medicalTerm"]
    assert len(card["easyExplanation"]) > 10

def test_simplification_hinglish():
    mock_data = {
        "tests": [
            {
                "testName": "Hemoglobin",
                "value": "10.2",
                "unit": "g/dL",
                "referenceRange": "12.0 - 15.5",
                "status": TestStatus.LOW
            }
        ],
        "importantFindings": [],
        "abnormalCount": 1,
        "normalCount": 0
    }

    result = SimplifierService.simplify_report(mock_data, language=ReportLanguage.HINGLISH)

    assert result["language"] == "hinglish"
    card = result["aiExplanations"][0]
    assert "oxygen" in card["easyExplanation"].lower() or "blood" in card["easyExplanation"].lower()
