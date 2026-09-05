# Medical Report Simplifier — Backend API Contract & Specification

**Base URL**: `http://localhost:8000`  
**API Prefix**: `/api/reports`  
**Interactive Docs**: `http://localhost:8000/docs` (Swagger UI) / `http://localhost:8000/redoc` (ReDoc)  
**Version**: `1.0.0`

---

## 1. Overview & Architectural Principles

The Medical Report Simplifier Backend is a specialized REST API engineered to convert dense clinical laboratory reports into clear, patient-friendly explanations without compromising scientific validity.

### Core Guarantees:
1. **Zero Hallucination**: Test values and reference ranges are strictly extracted from uploaded text/images. Missing or unstated ranges default to `null` and status `unable_to_determine`.
2. **Medical Safety**: No clinical diagnoses or drug recommendations are produced. All endpoints return the standardized medical disclaimer:
   > *"This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice. Always consult with a certified doctor."*
3. **Multi-Language Simplification**: Native support for **English**, **Hindi (हिंदी)**, and **Hinglish** (colloquial conversational Latin script).
4. **Three-Tier Explanations**: Every test is parsed into:
   - `Medical Term` (e.g., *Hemoglobin*, *Serum Creatinine*)
   - `Simple Meaning` (e.g., *Red blood cell protein that carries oxygen*)
   - `Easy Explanation` (Contextual explanation relative to normal/high/low status)

---

## 2. Global Status Codes & Enums

### Biomarker Status (`test_status`)
| Value | Meaning |
| :--- | :--- |
| `normal` | Value falls strictly within the specified numerical reference interval or matches qualitative negative/normal. |
| `high` | Value exceeds the upper reference limit. |
| `low` | Value is below the lower reference limit. |
| `unable_to_determine` | Reference range was absent in the report or value could not be numerically evaluated. |

### Languages (`language`)
| Value | Description |
| :--- | :--- |
| `english` | Clear, jargon-free standard English. |
| `hindi` | Native Devanagari Hindi (सरल हिंदी). |
| `hinglish` | Phonetic Hindi in English script with common everyday medical analogies. |

### Processing Status (`process_status`)
| Value | Description |
| :--- | :--- |
| `pending` | File uploaded, queued for OCR/parsing. |
| `processing` | Biomarkers currently being extracted and analyzed. |
| `completed` | Full extraction, classification, and explanation finished. |
| `failed` | Error during extraction, corrupted file, or unreadable document. |

---

## 3. Standard Error Structure

All 4xx and 5xx responses conform to a unified error payload:

```json
{
  "detail": {
    "error_code": "FILE_TOO_LARGE",
    "message": "File size exceeds 25 MB maximum allowed limit",
    "status_code": 413
  }
}
```

### Common HTTP Status Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created / uploaded.
- `400 Bad Request`: Empty report text, invalid parameters, or bad syntax.
- `404 Not Found`: Report ID does not exist.
- `413 Payload Too Large`: Uploaded file exceeds 25MB.
- `415 Unsupported Media Type`: File extension or MIME type not in `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.txt`.
- `422 Unprocessable Entity`: Validation failure on request body fields.
- `500 Internal Server Error`: Unexpected server or OCR engine fault.

---

## 4. Endpoints Specification

### 4.1 Health & Liveness

#### `GET /api/health`
Checks server and API status.

**Response `200 OK`**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-09-05T11:15:00.000000"
}
```

---

### 4.2 Upload File Report

#### `POST /api/reports/upload`
Uploads a medical report document (PDF, PNG, JPG, JPEG, WEBP, or TXT). Automatically performs OCR/PDF parsing, biomarker extraction, range analysis, and 3-language AI simplification.

- **Content-Type**: `multipart/form-data`
- **Form Parameters**:
  - `file` (*UploadFile*, required): Binary file data (max 25MB).
  - `language` (*string*, optional, default: `"english"`): Initial preferred language (`"english"`, `"hindi"`, `"hinglish"`).

**Example cURL**:
```bash
curl -X POST "http://localhost:8000/api/reports/upload" \
  -F "file=@cbc_blood_test.pdf" \
  -F "language=english"
```

**Response `201 Created`**:
```json
{
  "id": "rep_f47ac10b58cc4372a5670e02b2c3d479",
  "filename": "cbc_blood_test.pdf",
  "file_type": "pdf",
  "status": "completed",
  "created_at": "2026-09-05T11:15:30.123456",
  "message": "Report uploaded and processed successfully"
}
```

---

### 4.3 Upload Raw Text Report

#### `POST /api/reports/upload-text`
Accepts raw text or copied lab results directly, executing full extraction, reference range analysis, and multi-language explanation.

- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "raw_text": "COMPLETE BLOOD COUNT\nHemoglobin: 11.2 g/dL (Reference: 12.0 - 15.5)\nWBC: 7500 /uL (Reference: 4000 - 11000)\nPlatelets: 130000 /uL (Reference: 150000 - 450000)\nBlood Glucose Fasting: 142 mg/dL (Reference: 70 - 99)",
  "language": "english"
}
```

**Response `201 Created`**:
```json
{
  "id": "rep_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
  "filename": "raw_text_report.txt",
  "file_type": "text",
  "status": "completed",
  "created_at": "2026-09-05T11:16:00.000000",
  "message": "Text report received and processed successfully"
}
```

---

### 4.4 Get Report Details

#### `GET /api/reports/{report_id}`
Retrieves full structured report data, including all extracted biomarkers, classified status (`normal`, `high`, `low`), important clinical findings, and generated AI explanations.

- **Path Parameter**: `report_id` (*string*, e.g., `rep_f47ac10b58cc4372a5670e02b2c3d479`)
- **Query Parameter**: `language` (*string*, optional, default: `"english"`): Filter explanation to specified language (`"english"`, `"hindi"`, or `"hinglish"`).

**Example cURL**:
```bash
curl "http://localhost:8000/api/reports/rep_f47ac10b58cc4372a5670e02b2c3d479?language=english"
```

**Response `200 OK`**:
```json
{
  "id": "rep_f47ac10b58cc4372a5670e02b2c3d479",
  "filename": "cbc_blood_test.pdf",
  "file_type": "pdf",
  "status": "completed",
  "created_at": "2026-09-05T11:15:30.123456",
  "total_tests": 4,
  "normal_count": 1,
  "abnormal_count": 3,
  "tests": [
    {
      "id": 1,
      "test_name": "Hemoglobin",
      "value": "11.2",
      "numeric_value": 11.2,
      "unit": "g/dL",
      "reference_range": "12.0 - 15.5",
      "status": "low",
      "simple_meaning": "Protein in red blood cells that carries oxygen from your lungs to the rest of your body.",
      "explanation": "Your Hemoglobin level is slightly low (11.2 g/dL vs normal 12.0 - 15.5 g/dL). This may cause mild fatigue or tiredness.",
      "category": "Complete Blood Count"
    },
    {
      "id": 2,
      "test_name": "WBC",
      "value": "7500",
      "numeric_value": 7500.0,
      "unit": "/uL",
      "reference_range": "4000 - 11000",
      "status": "normal",
      "simple_meaning": "White Blood Cells are the immune system defense cells that fight against bacterial and viral infections.",
      "explanation": "Your WBC level is within the standard healthy reference range (7500 /uL vs normal 4000 - 11000 /uL).",
      "category": "Complete Blood Count"
    },
    {
      "id": 3,
      "test_name": "Platelets",
      "value": "130000",
      "numeric_value": 130000.0,
      "unit": "/uL",
      "reference_range": "150000 - 450000",
      "status": "low",
      "simple_meaning": "Tiny cell fragments that form blood clots to stop bleeding when you have a cut or injury.",
      "explanation": "Your Platelets level is slightly low (130000 /uL vs normal 150000 - 450000 /uL).",
      "category": "Complete Blood Count"
    },
    {
      "id": 4,
      "test_name": "Blood Glucose Fasting",
      "value": "142",
      "numeric_value": 142.0,
      "unit": "mg/dL",
      "reference_range": "70 - 99",
      "status": "high",
      "simple_meaning": "The amount of sugar in your bloodstream measured after fasting (not eating for 8-10 hours).",
      "explanation": "Your Blood Glucose Fasting level is higher than normal (142 mg/dL vs normal 70 - 99 mg/dL). High fasting glucose requires clinical follow-up.",
      "category": "Diabetes / Glucose"
    }
  ],
  "important_findings": [
    {
      "id": 1,
      "test_name": "Blood Glucose Fasting",
      "status": "high",
      "finding_text": "Blood Glucose Fasting is higher than normal range (142 mg/dL vs 70 - 99 mg/dL).",
      "severity": "abnormal"
    },
    {
      "id": 2,
      "test_name": "Hemoglobin",
      "status": "low",
      "finding_text": "Hemoglobin is slightly below normal range (11.2 g/dL vs 12.0 - 15.5 g/dL).",
      "severity": "abnormal"
    },
    {
      "id": 3,
      "test_name": "Platelets",
      "status": "low",
      "finding_text": "Platelets is slightly below normal range (130000 /uL vs 150000 - 450000 /uL).",
      "severity": "abnormal"
    }
  ],
  "explanation": {
    "id": 1,
    "language": "english",
    "summary": "Report contains 4 tests: 1 within normal ranges, and 3 outside standard reference bounds.",
    "key_takeaways": [
      "Blood Glucose Fasting is higher than normal (142 mg/dL)",
      "Hemoglobin is slightly low (11.2 g/dL)",
      "Platelets is slightly low (130000 /uL)"
    ],
    "questions_for_doctor": [
      "What steps should I take regarding my elevated Blood Glucose Fasting level?",
      "Do I need any dietary modifications or follow-up tests for low Hemoglobin?",
      "When should I repeat these laboratory investigations?"
    ],
    "disclaimer": "This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice. Always consult with a certified doctor."
  }
}
```

---

### 4.5 Dynamic Language Simplification

#### `POST /api/reports/{report_id}/simplify`
Regenerates the patient-friendly AI explanation and questions for the doctor in a new language without re-extracting or modifying raw biomarkers.

- **Path Parameter**: `report_id` (*string*)
- **Query Parameter**: `language` (*string*, required): `"english"`, `"hindi"`, or `"hinglish"`.

**Example cURL (Hindi request)**:
```bash
curl -X POST "http://localhost:8000/api/reports/rep_f47ac10b58cc4372a5670e02b2c3d479/simplify?language=hindi"
```

**Response `200 OK`**:
```json
{
  "id": 2,
  "language": "hindi",
  "summary": "रिपोर्ट में 4 परीक्षण हैं: 1 सामान्य श्रेणी में और 3 मानक संदर्भ से बाहर हैं।",
  "key_takeaways": [
    "Blood Glucose Fasting सामान्य से अधिक है (142 mg/dL)",
    "Hemoglobin थोड़ा कम है (11.2 g/dL)",
    "Platelets थोड़ा कम है (130000 /uL)"
  ],
  "questions_for_doctor": [
    "मेरे बढ़े हुए Blood Glucose Fasting स्तर के बारे में मुझे क्या कदम उठाने चाहिए?",
    "क्या कम Hemoglobin के लिए मुझे खान-पान में बदलाव या किसी अतिरिक्त जांच की आवश्यकता है?",
    "मुझे ये जांच दोबारा कब करवानी चाहिए?"
  ],
  "disclaimer": "This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice. Always consult with a certified doctor."
}
```

**Example cURL (Hinglish request)**:
```bash
curl -X POST "http://localhost:8000/api/reports/rep_f47ac10b58cc4372a5670e02b2c3d479/simplify?language=hinglish"
```

**Response `200 OK`**:
```json
{
  "id": 3,
  "language": "hinglish",
  "summary": "Aapki report me kul 4 tests hain: 1 normal range me hain, aur 3 reference limit se bahar hain.",
  "key_takeaways": [
    "Blood Glucose Fasting normal range se thoda high hai (142 mg/dL)",
    "Hemoglobin normal se thoda kam hai (11.2 g/dL)",
    "Platelets normal se thoda kam hai (130000 /uL)"
  ],
  "questions_for_doctor": [
    "Mere badhe huye Blood Glucose Fasting level ke liye mujhe kya precautions lene chahiye?",
    "Kya low Hemoglobin ke liye diet change ya koi supplement ki jarurat hai?",
    "Mujhe ye tests dobara kab karwane chahiye?"
  ],
  "disclaimer": "This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice. Always consult with a certified doctor."
}
```

---

### 4.6 List All Reports

#### `GET /api/reports/`
Returns a chronological list of previously uploaded reports with aggregated test counts.

- **Query Parameters**:
  - `limit` (*integer*, optional, default: `20`, max: `100`)
  - `offset` (*integer*, optional, default: `0`)

**Response `200 OK`**:
```json
[
  {
    "id": "rep_f47ac10b58cc4372a5670e02b2c3d479",
    "filename": "cbc_blood_test.pdf",
    "file_type": "pdf",
    "status": "completed",
    "created_at": "2026-09-05T11:15:30.123456",
    "total_tests": 4,
    "normal_count": 1,
    "abnormal_count": 3,
    "tests": [],
    "important_findings": [],
    "explanation": null
  }
]
```

---

### 4.7 Check Processing Status

#### `GET /api/reports/{report_id}/status`
Lightweight polling endpoint to verify background or asynchronous processing state.

**Response `200 OK`**:
```json
{
  "id": "rep_f47ac10b58cc4372a5670e02b2c3d479",
  "status": "completed",
  "total_tests": 4,
  "error_message": null
}
```

---

### 4.8 Delete Report

#### `DELETE /api/reports/{report_id}`
Permanently deletes the report record, extracted tests, findings, explanations, and any associated file from disk.

**Response `200 OK`**:
```json
{
  "success": true,
  "message": "Report rep_f47ac10b58cc4372a5670e02b2c3d479 deleted successfully"
}
```

---

## 5. Frontend Integration Mapping Guide

| Frontend UI Component | Backend Field / Endpoint | Example Usage / Rendering |
| :--- | :--- | :--- |
| **Stat Cards** (Total, Normal, Abnormal) | `total_tests`, `normal_count`, `abnormal_count` from `GET /api/reports/{id}` | `<StatCard count={report.abnormal_count} label="Abnormal Results" />` |
| **Test Results Table** | `tests[]` array | Map `test_name`, `value` + `unit`, `reference_range`, and `status` to table rows |
| **Status Badge** | `test.status` | Render green for `normal`, red for `high`, amber for `low`, gray for `unable_to_determine` |
| **3-Tier Explanation Drawer** | `test.test_name`, `test.simple_meaning`, `test.explanation` | Expandable row showing plain-English definition and personalized explanation |
| **Important Findings Box** | `important_findings[]` | Display high/low alerts with warning icons |
| **Language Toggle** | `POST /api/reports/{id}/simplify?language={lang}` | Switching tabs between English, हिंदी, Hinglish refreshes `report.explanation` |
| **Questions for Doctor** | `explanation.questions_for_doctor[]` | Checklist or cards for the user's next clinic visit |
| **Mandatory Disclaimer** | `explanation.disclaimer` | Footer banner displayed on all report views |
