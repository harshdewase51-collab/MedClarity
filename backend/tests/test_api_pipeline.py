import pytest
import io
from fastapi.testclient import TestClient
from reportlab.pdfgen import canvas
from app.main import app
from app.schemas.report import ReportLanguage, TestStatus

client = TestClient(app)

SAMPLE_REPORT_TEXT = """
METROPOLIS DIAGNOSTICS & HEALTH LAB
Patient: Sarah Jenkins (Age: 38, Female)
Date: Sep 02, 2026 | Doctor: Dr. Arvind Kulkarni, MD

COMPLETE BLOOD COUNT & METABOLIC PANEL
Hemoglobin: 10.2 g/dL (Reference: 12.0 - 15.5 g/dL)
Fasting Blood Glucose: 92 mg/dL (Reference: 70 - 100 mg/dL)
White Blood Cell (WBC): 6.8 x10^3/uL (Reference: 4.5 - 11.0)
Platelet Count: 242 x10^3/uL (Reference: 150 - 450)
Alanine Aminotransferase (ALT): 48 U/L (Reference: 7 - 35 U/L)
Serum Creatinine: 0.82 mg/dL (Reference: 0.60 - 1.10 mg/dL)
"""

def test_health_endpoints():
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["status"] == "online"

    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

def test_upload_and_process_text_report():
    # 1. Upload & immediately process via /api/reports/upload-text
    payload = {
        "text": SAMPLE_REPORT_TEXT,
        "reportName": "Test CBC Report",
        "language": "english"
    }
    response = client.post("/api/reports/upload-text", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert "reportId" in data
    report_id = data["reportId"]
    assert data["reportName"] == "Complete Blood Count & Metabolic Panel"
    assert data["status"] == "attention"
    assert data["totalTests"] >= 5
    assert data["abnormalCount"] >= 2  # Hemoglobin (10.2 < 12.0) and ALT (48 > 35)
    assert data["normalCount"] >= 3

    # Check tests
    tests_by_name = {t["testName"].lower(): t for t in data["tests"]}
    assert "hemoglobin" in tests_by_name or any("hemo" in k for k in tests_by_name)
    
    # Check important findings
    assert len(data["importantFindings"]) >= 2

    # Check AI explanations
    assert len(data["aiExplanations"]) >= 2
    assert "medicalTerm" in data["aiExplanations"][0]
    assert "simpleMeaning" in data["aiExplanations"][0]
    assert "easyExplanation" in data["aiExplanations"][0]

    # Check disclaimer
    assert "disclaimer" in data
    assert "This tool helps explain medical reports" in data["disclaimer"]

    # 2. Get status via GET /api/reports/{id}/status
    res_status = client.get(f"/api/reports/{report_id}/status")
    assert res_status.status_code == 200
    status_data = res_status.json()
    assert status_data["reportId"] == report_id
    assert status_data["status"] == "simplified"

    # 3. Simplify in Hindi via POST /api/reports/{id}/simplify
    res_hindi = client.post(f"/api/reports/{report_id}/simplify", json={"language": "hindi"})
    assert res_hindi.status_code == 200
    hindi_data = res_hindi.json()
    assert hindi_data["language"] == "hindi"
    assert any("हीमोग्लोबिन" in exp["medicalTerm"] or "एनीमिया" in exp["medicalTerm"] for exp in hindi_data["aiExplanations"])

    # 4. Simplify in Hinglish via POST /api/reports/{id}/simplify
    res_hinglish = client.post(f"/api/reports/{report_id}/simplify", json={"language": "hinglish"})
    assert res_hinglish.status_code == 200
    hinglish_data = res_hinglish.json()
    assert hinglish_data["language"] == "hinglish"

    # 5. Retrieve report via GET /api/reports/{id}
    res_get = client.get(f"/api/reports/{report_id}")
    assert res_get.status_code == 200
    assert res_get.json()["reportId"] == report_id

    # 6. List all reports via GET /api/reports
    res_list = client.get("/api/reports")
    assert res_list.status_code == 200
    reports_list = res_list.json()
    assert len(reports_list) >= 1
    assert any(r["reportId"] == report_id for r in reports_list)

    # 7. Delete report via DELETE /api/reports/{id}
    res_delete = client.delete(f"/api/reports/{report_id}")
    assert res_delete.status_code == 200
    assert res_delete.json()["success"] is True

    # 8. Verify 404 after deletion
    res_after = client.get(f"/api/reports/{report_id}")
    assert res_after.status_code == 404

def test_multipart_file_upload_pdf(tmp_path):
    # Generate a sample PDF file
    pdf_buffer = io.BytesIO()
    c = canvas.Canvas(pdf_buffer)
    c.drawString(100, 750, "CAREPLUS DIAGNOSTIC LABS")
    c.drawString(100, 720, "Patient: Sarah Jenkins | Date: Aug 18, 2026")
    c.drawString(100, 680, "Total Cholesterol: 218 mg/dL (Reference: < 200 mg/dL)")
    c.drawString(100, 650, "HDL Cholesterol: 56 mg/dL (Reference: > 50 mg/dL)")
    c.drawString(100, 620, "Triglycerides: 120 mg/dL (Reference: < 150 mg/dL)")
    c.save()
    pdf_bytes = pdf_buffer.getvalue()

    # Upload via POST /api/reports/upload
    files = {"file": ("Cardio_Lipid_Panel.pdf", pdf_bytes, "application/pdf")}
    res_upload = client.post("/api/reports/upload", files=files)
    assert res_upload.status_code == 201
    upload_data = res_upload.json()
    report_id = upload_data["reportId"]
    assert upload_data["status"] == "uploaded"

    # Process via POST /api/reports/{id}/process
    res_process = client.post(f"/api/reports/{report_id}/process?language=english")
    assert res_process.status_code == 200
    proc_data = res_process.json()
    assert proc_data["reportId"] == report_id
    assert proc_data["totalTests"] >= 2
    assert proc_data["abnormalCount"] >= 1  # Total cholesterol 218 > 200
    assert len(proc_data["importantFindings"]) >= 1

    # Cleanup
    client.delete(f"/api/reports/{report_id}")

def test_get_nonexistent_report_returns_404():
    response = client.get("/api/reports/rep_nonexistent_12345")
    assert response.status_code == 404
    assert response.json()["success"] is False

def test_multipart_file_upload_image_png():
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (600, 200), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.text((20, 50), "Glucose: 105 mg/dL (Reference: 70 - 99)", fill=(0, 0, 0))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    png_bytes = img_byte_arr.getvalue()

    files = {"file": ("blood_glucose_scan.png", png_bytes, "image/png")}
    res_upload = client.post("/api/reports/upload", files=files)
    assert res_upload.status_code == 201
    report_id = res_upload.json()["reportId"]

    # Process image report
    res_proc = client.post(f"/api/reports/{report_id}/process?language=english")
    assert res_proc.status_code == 200
    data = res_proc.json()
    assert data["reportId"] == report_id

    # Clean up
    client.delete(f"/api/reports/{report_id}")

def test_upload_empty_file_fails():
    files = {"file": ("empty_report.pdf", b"", "application/pdf")}
    res = client.post("/api/reports/upload", files=files)
    assert res.status_code == 422
    assert res.json()["success"] is False
    assert "empty" in res.json()["error"]["message"].lower()
