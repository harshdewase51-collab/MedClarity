import os
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import EmptyReportError, ExtractionError
from app.schemas.report import ReportLanguage, ProcessStatus, TestStatus
from app.models.report import Report, TestResult, ImportantFinding, AIExplanation
from app.services.pdf_service import PDFService
from app.services.ocr_service import OCRService
from app.services.extractor_service import ExtractorService
from app.services.analyzer_service import AnalyzerService
from app.services.simplifier_service import SimplifierService

class PipelineService:
    @classmethod
    def extract_text(cls, file_path: str, file_type: str) -> str:
        """
        Step 1: Extract text from PDF, image, or text file.
        Automatically invokes OCR when PDF is image-based/scanned.
        """
        ext = file_type.lower().lstrip('.')
        if ext == 'txt':
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()

        elif ext == 'pdf':
            text, is_scanned = PDFService.extract_text_from_pdf(file_path)
            if is_scanned or len(text.strip()) < 40:
                # Scanned PDF: invoke OCR engine on page images
                ocr_text, conf = OCRService.extract_text_from_scanned_pdf(file_path)
                if ocr_text.strip():
                    return ocr_text
            return text

        elif ext in ('png', 'jpg', 'jpeg', 'webp'):
            ocr_text, conf = OCRService.extract_text_from_image(file_path)
            return ocr_text

        else:
            raise ExtractionError(f"Unsupported file type for extraction: {file_type}")

    @classmethod
    def process_and_simplify(
        cls,
        report_id: str,
        db: Session,
        language: ReportLanguage = ReportLanguage.ENGLISH,
        custom_text: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full end-to-end processing pipeline:
        Extraction -> Analysis -> AI Simplification -> Database Storage
        """
        db_report = db.query(Report).filter(Report.id == report_id).first()
        if not db_report:
            raise ExtractionError(f"Report '{report_id}' not found in database.")

        # 1. Extract text if not already available
        raw_text = custom_text or db_report.raw_text
        if not raw_text and db_report.file_path and os.path.exists(db_report.file_path):
            raw_text = cls.extract_text(db_report.file_path, db_report.file_type)

        if not raw_text or not raw_text.strip():
            db_report.status = ProcessStatus.FAILED.value
            db.commit()
            raise EmptyReportError("Could not extract legible text from the medical report. Please ensure the document is clear and properly oriented.")

        db_report.raw_text = raw_text
        db_report.status = ProcessStatus.ANALYZING.value
        db.commit()

        # 2. Medical Data Extraction
        extracted_data = ExtractorService.extract_structured_data(raw_text)

        # 3. Reference Range Analysis
        analyzed_tests, findings, normal_cnt, abnormal_cnt, overall_stat = AnalyzerService.analyze_report_tests(
            extracted_data.get("tests", [])
        )

        # 4. AI Simplification
        data_for_simplification = {
            "tests": analyzed_tests,
            "importantFindings": findings,
            "abnormalCount": abnormal_cnt,
            "normalCount": normal_cnt
        }
        simplified_output = SimplifierService.simplify_report(data_for_simplification, language=language)

        # 5. Update Database Record
        db_report.report_name = extracted_data.get("reportName", db_report.report_name)
        db_report.report_date = extracted_data.get("reportDate", db_report.report_date)
        db_report.lab_name = extracted_data.get("labName", db_report.lab_name)
        db_report.patient_name = extracted_data.get("patientName", db_report.patient_name)
        db_report.summary = simplified_output.get("summary")
        db_report.language = language.value
        db_report.overall_status = overall_stat
        db_report.total_tests = len(analyzed_tests)
        db_report.normal_count = normal_cnt
        db_report.abnormal_count = abnormal_cnt
        db_report.status = ProcessStatus.SIMPLIFIED.value

        # Clear previous related entries if re-simplifying
        db.query(TestResult).filter(TestResult.report_id == report_id).delete()
        db.query(ImportantFinding).filter(ImportantFinding.report_id == report_id).delete()
        db.query(AIExplanation).filter(AIExplanation.report_id == report_id).delete()

        # Insert Test Results
        for t in simplified_output.get("tests", []):
            status_val = t.get("status")
            status_str = status_val.value if isinstance(status_val, TestStatus) else str(status_val)
            test_row = TestResult(
                report_id=report_id,
                test_name=t.get("testName", "Unknown Test"),
                value=str(t.get("value", "")),
                numeric_value=t.get("numericValue"),
                unit=t.get("unit", ""),
                reference_range=t.get("referenceRange"),
                min_range=t.get("minRange"),
                max_range=t.get("maxRange"),
                status=status_str,
                medical_term=t.get("medicalTerm"),
                simple_meaning=t.get("simpleMeaning"),
                simple_explanation=t.get("simpleExplanation")
            )
            db.add(test_row)

        # Insert Important Findings
        for f in findings:
            status_val = f.get("status")
            status_str = status_val.value if isinstance(status_val, TestStatus) else str(status_val)
            finding_row = ImportantFinding(
                report_id=report_id,
                test_name=f.get("testName", ""),
                value=str(f.get("value", "")),
                unit=f.get("unit", ""),
                reference_range=f.get("referenceRange"),
                status=status_str,
                medical_term=f.get("medicalTerm"),
                explanation=f.get("explanation", "")
            )
            db.add(finding_row)

        # Insert AI Explanations
        for exp in simplified_output.get("aiExplanations", []):
            exp_row = AIExplanation(
                report_id=report_id,
                medical_term=exp.get("medicalTerm", ""),
                simple_meaning=exp.get("simpleMeaning", ""),
                easy_explanation=exp.get("easyExplanation", ""),
                related_test=exp.get("relatedTest")
            )
            db.add(exp_row)

        db.commit()
        db.refresh(db_report)

        return cls.format_report_response(db_report)

    @classmethod
    def format_report_response(cls, db_report: Report) -> Dict[str, Any]:
        """Converts database models into frontend-ready JSON structure"""
        tests_list = [
            {
                "id": str(t.id),
                "testName": t.test_name,
                "value": t.value,
                "numericValue": t.numeric_value,
                "unit": t.unit,
                "referenceRange": t.reference_range,
                "minRange": t.min_range,
                "maxRange": t.max_range,
                "status": t.status,
                "medicalTerm": t.medical_term,
                "simpleMeaning": t.simple_meaning,
                "simpleExplanation": t.simple_explanation
            }
            for t in db_report.tests
        ]

        findings_list = [
            {
                "id": str(f.id),
                "testName": f.test_name,
                "value": f.value,
                "unit": f.unit,
                "referenceRange": f.reference_range,
                "status": f.status,
                "medicalTerm": f.medical_term,
                "explanation": f.explanation
            }
            for f in db_report.important_findings
        ]

        explanations_list = [
            {
                "id": str(e.id),
                "medicalTerm": e.medical_term,
                "simpleMeaning": e.simple_meaning,
                "easyExplanation": e.easy_explanation,
                "relatedTest": e.related_test
            }
            for e in db_report.ai_explanations
        ]

        from app.core.config import settings
        return {
            "reportId": db_report.id,
            "reportName": db_report.report_name,
            "reportDate": db_report.report_date,
            "labName": db_report.lab_name,
            "patientName": db_report.patient_name,
            "status": db_report.overall_status,
            "summary": db_report.summary or "",
            "totalTests": db_report.total_tests,
            "normalCount": db_report.normal_count,
            "abnormalCount": db_report.abnormal_count,
            "tests": tests_list,
            "importantFindings": findings_list,
            "aiExplanations": explanations_list,
            "language": db_report.language,
            "disclaimer": settings.DISCLAIMER_TEXT,
            "createdAt": db_report.created_at.isoformat() if db_report.created_at else "",
            "updatedAt": db_report.updated_at.isoformat() if db_report.updated_at else ""
        }
