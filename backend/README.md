# Medical Report Simplifier — Backend Service

> **AI-Powered Clinical Report Extraction, Reference Range Classification, and Multilingual Simplification**

---

## 📌 Problem Statement
*"Use AI to convert complex medical report terminology into simple, easy-to-understand language."*

This backend service ingests laboratory diagnostic reports (PDF, images, or raw text), extracts clinical biomarkers without hallucinations, evaluates values against established laboratory reference intervals, and produces plain-language, patient-centric explanations in **English**, **Hindi**, and **Hinglish**.

---

## 🏛️ Architecture & Core Modules

```
backend/
├── app/
│   ├── main.py                     # FastAPI entrypoint, CORS, lifespan, exception handlers
│   ├── core/
│   │   ├── config.py               # Application settings (Pydantic Settings)
│   │   ├── security.py             # Filename sanitization, UUID gen, MIME validation
│   │   └── exceptions.py           # Domain exceptions & HTTP error mappings
│   ├── models/
│   │   └── report.py               # SQLAlchemy models (Report, TestResult, Finding, Explanation)
│   ├── schemas/
│   │   └── report.py               # Pydantic v2 validation & response contracts
│   ├── database/
│   │   └── session.py              # SQLite engine, SessionLocal, init_db()
│   ├── services/
│   │   ├── file_service.py         # File storage & size verification
│   │   ├── pdf_service.py          # PDF text extraction (pdfplumber + pypdf fallback)
│   │   ├── ocr_service.py          # On-device RapidOCR (ONNX Runtime) for images/scans
│   │   ├── extractor_service.py    # Clinical biomarker parser & zero-hallucination regex
│   │   ├── analyzer_service.py     # Reference range comparison & finding generator
│   │   ├── simplifier_service.py   # 3-tier explanation & multilingual generator
│   │   └── pipeline_service.py     # End-to-end orchestration pipeline
│   ├── controllers/
│   │   └── report_controller.py    # Business logic & database coordination
│   └── routes/
│       └── reports.py              # REST API endpoints (/api/reports)
├── tests/
│   ├── conftest.py                 # Pytest fixtures & isolated SQLite test DB
│   ├── test_upload.py              # File validation, MIME & size checks
│   ├── test_pdf_extraction.py      # PDF parsing tests
│   ├── test_ocr.py                 # On-device OCR extraction tests
│   ├── test_analysis.py            # Reference range boundary & classification tests
│   ├── test_simplification.py      # Multilingual 3-tier simplification tests
│   └── test_api_pipeline.py        # End-to-end API upload & simplification tests
├── uploads/                        # Local file storage (gitignored)
├── API_CONTRACT.md                 # Complete API specification for frontend developers
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variable template
└── .env                            # Active environment configuration
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Python 3.10+** (Tested on Python 3.11.9)
- Windows / Linux / macOS

### 2. Setup Virtual Environment & Install Dependencies
```bash
# In the backend directory
cd backend

# Create virtual environment (optional if using system Python)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env` (already pre-configured for local development):
```bash
cp .env.example .env
```

Default settings:
```ini
PROJECT_NAME="Medical Report Simplifier API"
API_V1_STR="/api"
DATABASE_URL="sqlite:///./medical_reports.db"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=25
ALLOWED_EXTENSIONS=["pdf", "png", "jpg", "jpeg", "webp", "txt"]
DEFAULT_LANGUAGE="english"
```

### 4. Run the Development Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API is accessible at: `http://localhost:8000`
- Interactive Swagger UI Docs: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

---

## 🧪 Running Automated Tests

A comprehensive suite of 20 unit and integration tests verifies zero-hallucination extraction, reference range classification, on-device OCR, multilingual simplification, and API endpoints:

```bash
pytest tests/ -v
```

Expected output:
```
tests/test_analysis.py::test_classify_normal_range PASSED
tests/test_analysis.py::test_classify_low_value PASSED
tests/test_analysis.py::test_classify_high_value PASSED
tests/test_analysis.py::test_classify_upper_bound_only PASSED
tests/test_analysis.py::test_classify_missing_reference_range PASSED
tests/test_analysis.py::test_classify_qualitative_negative PASSED
tests/test_analysis.py::test_analyze_report_tests_important_findings PASSED
tests/test_api_pipeline.py::test_health_endpoints PASSED
tests/test_api_pipeline.py::test_upload_and_process_text_report PASSED
tests/test_api_pipeline.py::test_multipart_file_upload_pdf PASSED
tests/test_api_pipeline.py::test_get_nonexistent_report_returns_404 PASSED
tests/test_ocr.py::test_ocr_extract_text_from_image PASSED
tests/test_pdf_extraction.py::test_pdf_service_extract_text PASSED
tests/test_simplification.py::test_simplification_english PASSED
tests/test_simplification.py::test_simplification_hindi PASSED
tests/test_simplification.py::test_simplification_hinglish PASSED
tests/test_upload.py::test_sanitize_filename PASSED
tests/test_upload.py::test_validate_allowed_formats PASSED
tests/test_upload.py::test_validate_disallowed_formats PASSED
tests/test_upload.py::test_validate_file_size_exceeded PASSED
======================== 20 passed in 5.34s ========================
```

---

## 📡 API Usage & Sample cURL Requests

### 1. Upload & Analyze a Document (PDF / Image)
```bash
curl -X POST "http://localhost:8000/api/reports/upload" \
  -F "file=@sample_report.pdf" \
  -F "language=english"
```

### 2. Upload Raw Text or Lab Values
```bash
curl -X POST "http://localhost:8000/api/reports/upload-text" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text": "COMPLETE BLOOD COUNT\nHemoglobin: 11.2 g/dL (Reference: 12.0 - 15.5)\nWBC: 7500 /uL (Reference: 4000 - 11000)\nPlatelets: 130000 /uL (Reference: 150000 - 450000)\nBlood Glucose Fasting: 142 mg/dL (Reference: 70 - 99)",
    "language": "english"
  }'
```

### 3. Fetch Full Structured Report
```bash
curl "http://localhost:8000/api/reports/{report_id}?language=english"
```

### 4. Switch Explanation to Hindi or Hinglish Dynamically
```bash
# Hindi (Devanagari)
curl -X POST "http://localhost:8000/api/reports/{report_id}/simplify?language=hindi"

# Hinglish (Conversational)
curl -X POST "http://localhost:8000/api/reports/{report_id}/simplify?language=hinglish"
```

### 5. List All Reports
```bash
curl "http://localhost:8000/api/reports/?limit=20&offset=0"
```

### 6. Delete a Report
```bash
curl -X DELETE "http://localhost:8000/api/reports/{report_id}"
```

---

## 🔒 Medical & Clinical Guardrails
1. **Never Prescribe or Diagnose**: The engine produces explanations of biomarker significance, not disease verdicts or medication instructions.
2. **Zero Fabrication**: If a reference range is absent or unreadable, the system returns `null` and sets `status = "unable_to_determine"`.
3. **Calm Language**: Abnormal indicators avoid alarmist wording (e.g., using "slightly elevated" or "outside the standard reference interval" rather than panic-inducing language).
4. **Permanent Disclaimer**: Every response payload includes:
   > *"This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice. Always consult with a certified doctor."*

---

## 📄 License & Confidentiality
Built for the Medical Report Simplifier project. All clinical biomarker reference intervals are mapped from standard pathology laboratory guidelines (CLSI/CAP).
