from typing import Dict, Any, List
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.exceptions import ReportNotFoundError
from app.core.config import settings
from app.models.report import Report
from app.schemas.report import (
    ProcessStatus,
    ReportLanguage,
    ReportUploadResponse,
    ReportStatusResponse,
    ReportResponse
)
from app.services.file_service import FileService
from app.services.pipeline_service import PipelineService

class ReportController:
    @staticmethod
    async def upload_report_file(file: UploadFile, db: Session) -> ReportUploadResponse:
        """Handles multipart file upload and creates initial DB entry"""
        report_id, filename, file_path, file_size = await FileService.save_upload_file(file)
        
        db_report = Report(
            id=report_id,
            filename=filename,
            file_type=filename.split('.')[-1].lower() if '.' in filename else "bin",
            file_path=file_path,
            status=ProcessStatus.UPLOADED.value
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        return ReportUploadResponse(
            reportId=report_id,
            filename=filename,
            fileType=db_report.file_type,
            fileSizeBytes=file_size,
            status=ProcessStatus.UPLOADED,
            message="Report uploaded successfully and ready for analysis."
        )

    @staticmethod
    async def upload_report_text(text: str, report_name: str, language: ReportLanguage, db: Session) -> Dict[str, Any]:
        """Handles pasted report text, saves file, and runs the simplification pipeline"""
        report_id, filename, file_path, file_size = await FileService.save_text_content(text, report_name)

        db_report = Report(
            id=report_id,
            filename=filename,
            file_type="txt",
            file_path=file_path,
            raw_text=text,
            status=ProcessStatus.UPLOADED.value
        )
        db.add(db_report)
        db.commit()

        # Run complete pipeline
        return PipelineService.process_and_simplify(
            report_id=report_id,
            db=db,
            language=language,
            custom_text=text
        )

    @staticmethod
    def process_report(report_id: str, language: ReportLanguage, db: Session) -> Dict[str, Any]:
        """Runs the extraction, analysis, and simplification pipeline"""
        return PipelineService.process_and_simplify(
            report_id=report_id,
            db=db,
            language=language
        )

    @staticmethod
    def get_report(report_id: str, db: Session) -> Dict[str, Any]:
        """Fetches complete report details including tests, findings, and explanations"""
        db_report = db.query(Report).filter(Report.id == report_id).first()
        if not db_report:
            raise ReportNotFoundError(report_id)
        
        # If report is still in uploaded state, process it
        if db_report.status == ProcessStatus.UPLOADED.value:
            return PipelineService.process_and_simplify(report_id, db)

        return PipelineService.format_report_response(db_report)

    @staticmethod
    def get_report_status(report_id: str, db: Session) -> ReportStatusResponse:
        """Fetches lightweight report status and test counts"""
        db_report = db.query(Report).filter(Report.id == report_id).first()
        if not db_report:
            raise ReportNotFoundError(report_id)

        return ReportStatusResponse(
            reportId=db_report.id,
            filename=db_report.filename,
            status=ProcessStatus(db_report.status) if db_report.status in ProcessStatus._value2member_map_ else ProcessStatus.UPLOADED,
            language=db_report.language,
            totalTests=db_report.total_tests,
            normalCount=db_report.normal_count,
            abnormalCount=db_report.abnormal_count,
            createdAt=db_report.created_at.isoformat() if db_report.created_at else "",
            updatedAt=db_report.updated_at.isoformat() if db_report.updated_at else ""
        )

    @staticmethod
    def delete_report(report_id: str, db: Session) -> Dict[str, Any]:
        """Deletes a report and associated storage files"""
        db_report = db.query(Report).filter(Report.id == report_id).first()
        if not db_report:
            raise ReportNotFoundError(report_id)

        if db_report.file_path:
            FileService.delete_file(db_report.file_path)

        db.delete(db_report)
        db.commit()

        return {
            "success": True,
            "message": f"Report '{report_id}' and associated files were deleted successfully."
        }

    @staticmethod
    def list_reports(db: Session, limit: int = 50) -> List[Dict[str, Any]]:
        """Returns all reports for historical archiving"""
        reports = db.query(Report).order_by(Report.created_at.desc()).limit(limit).all()
        return [PipelineService.format_report_response(r) for r in reports]
