import re
from typing import Tuple, List
import pdfplumber
from pypdf import PdfReader

class PDFService:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Tuple[str, bool]:
        """
        Extracts clean text page-by-page from a PDF report.
        Returns: (extracted_text, is_scanned_or_insufficient)
        """
        extracted_pages: List[str] = []
        total_chars = 0

        try:
            # Primary: pdfplumber for layout & table preservation
            with pdfplumber.open(file_path) as pdf:
                for page_idx, page in enumerate(pdf.pages):
                    page_text = page.extract_text(layout=True) or ""
                    if not page_text.strip():
                        # Try without layout flag
                        page_text = page.extract_text() or ""
                    
                    cleaned_page = PDFService._clean_extracted_text(page_text)
                    if cleaned_page:
                        extracted_pages.append(f"--- Page {page_idx + 1} ---\n{cleaned_page}")
                        total_chars += len(cleaned_page)

        except Exception:
            # Secondary fallback: pypdf
            try:
                reader = PdfReader(file_path)
                for page_idx, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    cleaned_page = PDFService._clean_extracted_text(page_text)
                    if cleaned_page:
                        extracted_pages.append(f"--- Page {page_idx + 1} ---\n{cleaned_page}")
                        total_chars += len(cleaned_page)
            except Exception as fallback_err:
                return "", True

        full_text = "\n\n".join(extracted_pages).strip()
        num_pages = max(len(extracted_pages), 1)
        avg_chars_per_page = total_chars / num_pages

        # If very few characters extracted per page, it is likely a scanned image PDF
        is_scanned = avg_chars_per_page < 40 or total_chars < 50
        return full_text, is_scanned

    @staticmethod
    def _clean_extracted_text(text: str) -> str:
        """
        Cleans extraneous artifacts while preserving medical numbers, symbols, and units.
        """
        if not text:
            return ""
        
        # Replace non-breaking spaces and tabs with standard space
        text = text.replace('\xa0', ' ').replace('\t', '    ')
        
        # Normalize carriage returns
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        
        # Reduce more than 2 consecutive blank lines to 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        
        # Clean trailing whitespaces per line
        lines = [line.rstrip() for line in text.split('\n')]
        return '\n'.join(lines).strip()
