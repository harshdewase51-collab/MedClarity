from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.report import (
    ReportUploadResponse,
    ReportStatusResponse,
    ReportResponse,
    ReportSimplifyRequest,
    TextUploadRequest,
    ReportLanguage
)
from app.controllers.report_controller import ReportController

router = APIRouter(prefix="/reports", tags=["Medical Reports"])

@router.post(
    "/upload",
    response_model=ReportUploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Medical Report File (PDF / Image)"
)
async def upload_report(
    file: UploadFile = File(..., description="PDF document or image scan (PNG, JPG)"),
    db: Session = Depends(get_db)
):
    """
    Receives a medical report file, validates format and size,
    and returns a unique report ID for processing.
    """
    return await ReportController.upload_report_file(file, db)

@router.post(
    "/upload-text",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Paste Raw Medical Report Text"
)
async def upload_text(
    payload: TextUploadRequest,
    db: Session = Depends(get_db)
):
    """
    Directly processes pasted raw laboratory text and returns
    structured results with simple explanations.
    """
    return await ReportController.upload_report_text(
        text=payload.text,
        report_name=payload.reportName or "Pasted Medical Report",
        language=payload.language or ReportLanguage.ENGLISH,
        db=db
    )

@router.post(
    "/{report_id}/process",
    response_model=ReportResponse,
    summary="Extract & Process Uploaded Report"
)
def process_report(
    report_id: str,
    language: ReportLanguage = ReportLanguage.ENGLISH,
    db: Session = Depends(get_db)
):
    """
    Executes extraction (PDF parsing or OCR), biomarker analysis,
    and AI simple explanations on an uploaded report.
    """
    return ReportController.process_report(report_id, language, db)

@router.post(
    "/{report_id}/analyze",
    response_model=ReportResponse,
    summary="Analyze Extracted Biomarkers"
)
def analyze_report(
    report_id: str,
    language: ReportLanguage = ReportLanguage.ENGLISH,
    db: Session = Depends(get_db)
):
    """
    Re-runs reference range comparisons and finding classification.
    """
    return ReportController.process_report(report_id, language, db)

@router.post(
    "/{report_id}/simplify",
    response_model=ReportResponse,
    summary="Generate Simplified Explanations in Specified Language"
)
def simplify_report(
    report_id: str,
    payload: ReportSimplifyRequest,
    db: Session = Depends(get_db)
):
    """
    Translates medical terminology and results into simple language
    in the requested language: English, Hindi, or Hinglish.
    """
    return ReportController.process_report(report_id, payload.language, db)

@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    summary="Get Detailed Report Results"
)
def get_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns full analyzed report with tests, reference ranges,
    findings, AI explanations, and medical disclaimer.
    """
    return ReportController.get_report(report_id, db)

@router.get(
    "/{report_id}/status",
    response_model=ReportStatusResponse,
    summary="Check Report Processing Status"
)
def get_report_status(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns lightweight pipeline status (uploaded, analyzing, simplified, failed).
    """
    return ReportController.get_report_status(report_id, db)

@router.delete(
    "/{report_id}",
    summary="Delete Report"
)
def delete_report(
    report_id: str,
    db: Session = Depends(get_db)
):
    """
    Deletes the report and deletes any associated local upload files.
    """
    return ReportController.delete_report(report_id, db)

@router.get(
    "",
    response_model=List[ReportResponse],
    summary="List All Reports (History)"
)
def list_reports(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Lists previously analyzed reports for the frontend history view.
    """
    return ReportController.list_reports(db, limit)
