import pytest
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject, NameObject, ArrayObject, FloatObject
from app.services.pdf_service import PDFService
from reportlab.pdfgen import canvas
import tempfile
import os

def test_pdf_service_extract_text(tmp_path):
    # Create a small valid test PDF using reportlab or basic stream
    pdf_path = str(tmp_path / "test_report.pdf")
    c = canvas.Canvas(pdf_path)
    c.drawString(100, 750, "METROPOLIS DIAGNOSTICS")
    c.drawString(100, 720, "Patient: Sarah Jenkins | Date: Sep 02, 2026")
    c.drawString(100, 680, "Hemoglobin: 10.2 g/dL (Reference: 12.0 - 15.5)")
    c.drawString(100, 650, "Glucose Fasting: 92 mg/dL (Reference: 70 - 100)")
    c.drawString(100, 620, "ALT (SGPT): 48 U/L (Reference: 7 - 35)")
    c.save()

    extracted_text, is_scanned = PDFService.extract_text_from_pdf(pdf_path)

    assert not is_scanned
    assert "Hemoglobin" in extracted_text
    assert "10.2" in extracted_text
    assert "Glucose" in extracted_text
    assert "ALT" in extracted_text
