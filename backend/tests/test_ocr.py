import os
import pytest
from PIL import Image, ImageDraw, ImageFont
from app.services.ocr_service import OCRService

def test_ocr_extract_text_from_image(tmp_path):
    # Generate a simple synthetic lab report image
    img = Image.new("RGB", (600, 200), color="white")
    draw = ImageDraw.Draw(img)
    draw.text((20, 30), "COMPLETE BLOOD COUNT", fill="black")
    draw.text((20, 80), "Hemoglobin: 10.2 g/dL (12.0 - 15.5)", fill="black")
    draw.text((20, 130), "Glucose: 92 mg/dL (70 - 100)", fill="black")

    test_img_path = str(tmp_path / "test_lab_scan.png")
    img.save(test_img_path)

    extracted_text, confidence = OCRService.extract_text_from_image(test_img_path)

    assert len(extracted_text) > 0
    assert confidence > 0.5
    # Should detect keywords
    assert "hemoglobin" in extracted_text.lower() or "glucose" in extracted_text.lower()
