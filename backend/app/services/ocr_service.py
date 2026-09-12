import os
import re
from typing import List, Tuple
from PIL import Image
import pdfplumber

class OCRService:
    _engine = None

    @classmethod
    def get_engine(cls):
        """Lazy initialization of RapidOCR engine"""
        if cls._engine is None:
            from rapidocr_onnxruntime import RapidOCR
            cls._engine = RapidOCR()
        return cls._engine

    @classmethod
    def extract_text_from_image(cls, image_path: str) -> Tuple[str, float]:
        """
        Runs on-device OCR on an image file (PNG, JPG, JPEG).
        Returns: (extracted_text, average_confidence)
        """
        engine = cls.get_engine()
        result, elapse_list = engine(image_path)

        if not result:
            return "", 0.0

        lines: List[str] = []
        confidences: List[float] = []

        for item in result:
            # item format: [box_coordinates, text, confidence_score]
            if len(item) >= 3:
                text = str(item[1]).strip()
                conf = float(item[2])
                if text:
                    lines.append(text)
                    confidences.append(conf)

        avg_conf = sum(confidences) / max(len(confidences), 1)
        raw_text = "\n".join(lines)
        cleaned_text = cls._clean_ocr_text(raw_text)

        return cleaned_text, avg_conf

    @classmethod
    def extract_text_from_scanned_pdf(cls, pdf_path: str, max_pages: int = 5) -> Tuple[str, float]:
        """
        Renders pages of a scanned PDF into images and executes OCR.
        """
        extracted_pages: List[str] = []
        total_conf = 0.0
        pages_processed = 0

        try:
            with pdfplumber.open(pdf_path) as pdf:
                for idx, page in enumerate(pdf.pages[:max_pages]):
                    # Render page to image
                    pil_image = page.to_image(resolution=200).original
                    is_serverless = bool(
                        os.environ.get("VERCEL")
                        or os.environ.get("VERCEL_ENV")
                        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
                        or os.environ.get("LAMBDA_TASK_ROOT")
                    )
                    temp_dir = "/tmp" if is_serverless else os.path.dirname(pdf_path) or "/tmp"
                    clean_basename = re.sub(r'[^a-zA-Z0-9_-]', '_', os.path.basename(pdf_path))
                    temp_img_path = os.path.join(temp_dir, f"{clean_basename}_temp_p{idx}.png")
                    try:
                        pil_image.save(temp_img_path)
                        text, conf = cls.extract_text_from_image(temp_img_path)
                        if text:
                            extracted_pages.append(f"--- Page {idx + 1} (OCR) ---\n{text}")
                            total_conf += conf
                            pages_processed += 1
                    finally:
                        if os.path.exists(temp_img_path):
                            try:
                                os.remove(temp_img_path)
                            except Exception:
                                pass
        except Exception as e:
            return "", 0.0

        full_text = "\n\n".join(extracted_pages).strip()
        avg_conf = total_conf / max(pages_processed, 1)
        return full_text, avg_conf

    @staticmethod
    def _clean_ocr_text(text: str) -> str:
        """
        Normalizes common OCR character confusions in medical contexts.
        """
        if not text:
            return ""

        # Normalize common medical units
        text = re.sub(r'(?i)\bg\s*/\s*dl\b', 'g/dL', text)
        text = re.sub(r'(?i)\bmg\s*/\s*dl\b', 'mg/dL', text)
        text = re.sub(r'(?i)\bu\s*/\s*l\b', 'U/L', text)
        text = re.sub(r'(?i)\bmmol\s*/\s*l\b', 'mmol/L', text)
        text = re.sub(r'(?i)\bng\s*/\s*ml\b', 'ng/mL', text)
        text = re.sub(r'(?i)\bmiu\s*/\s*l\b', 'mIU/L', text)
        text = re.sub(r'(?i)\bpg\s*/\s*ml\b', 'pg/mL', text)

        # Fix dash symbols in reference ranges (e.g. "12 . 0 - 15 . 5" -> "12.0 - 15.5")
        text = re.sub(r'(\d+)\s*\.\s*(\d+)', r'\1.\2', text)
        text = re.sub(r'(\d+)\s*[-–—]\s*(\d+)', r'\1 - \2', text)

        return text.strip()
