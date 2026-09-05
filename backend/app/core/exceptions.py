from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

class MedicalSimplifierException(Exception):
    """Base exception for Medical Report Simplifier"""
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ReportNotFoundError(MedicalSimplifierException):
    def __init__(self, report_id: str):
        super().__init__(f"Report with ID '{report_id}' was not found.", status_code=404)

class InvalidFileFormatError(MedicalSimplifierException):
    def __init__(self, extension: str, allowed: list):
        super().__init__(
            f"Unsupported file format '.{extension}'. Allowed formats are: {', '.join(allowed)}.",
            status_code=400
        )

class FileTooLargeError(MedicalSimplifierException):
    def __init__(self, size_mb: float, max_mb: int):
        super().__init__(
            f"File size ({size_mb:.1f} MB) exceeds maximum allowed limit of {max_mb} MB.",
            status_code=413
        )

class EmptyReportError(MedicalSimplifierException):
    def __init__(self, message: str = "The submitted report content is empty or contains unreadable text."):
        super().__init__(message, status_code=422)

class ExtractionError(MedicalSimplifierException):
    def __init__(self, message: str):
        super().__init__(f"Data extraction failed: {message}", status_code=500)

async def medical_exception_handler(request: Request, exc: MedicalSimplifierException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "type": exc.__class__.__name__,
                "message": exc.message,
                "details": exc.details,
            }
        }
    )
