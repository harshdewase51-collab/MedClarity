import os
import aiofiles
from typing import Tuple
from fastapi import UploadFile
from app.core.config import settings
from app.core.security import generate_report_id, validate_file

class FileService:
    @classmethod
    def get_upload_dir(cls) -> str:
        """
        Determines the target upload directory:
        - Uses /tmp/medclarity_uploads when running on Vercel / serverless environment
        - Preserves local development behavior using project's uploads/ directory
        Automatically ensures the directory exists with os.makedirs(..., exist_ok=True).
        """
        is_serverless = bool(
            os.environ.get("VERCEL")
            or os.environ.get("VERCEL_ENV")
            or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
            or os.environ.get("LAMBDA_TASK_ROOT")
        )
        if is_serverless:
            upload_dir = "/tmp/medclarity_uploads"
        else:
            upload_dir = getattr(settings, "UPLOAD_DIR", None) or os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                "uploads"
            )

        os.makedirs(upload_dir, exist_ok=True)
        return upload_dir

    @classmethod
    async def save_upload_file(cls, upload_file: UploadFile) -> Tuple[str, str, str, int]:
        """
        Saves uploaded file securely into UPLOAD_DIR.
        Returns: (report_id, filename, file_path, file_size_bytes)
        """
        report_id = generate_report_id()
        
        # Read content to check size
        content = await upload_file.read()
        file_size = len(content)
        
        sanitized_name, ext = validate_file(upload_file.filename, file_size)
        
        # Stored filename incorporates report_id to guarantee collision safety
        stored_filename = f"{report_id}_{sanitized_name}"
        upload_dir = cls.get_upload_dir()
        file_path = os.path.join(upload_dir, stored_filename)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)

        return report_id, sanitized_name, file_path, file_size

    @classmethod
    async def save_text_content(cls, text: str, report_name: str = "Pasted_Report.txt") -> Tuple[str, str, str, int]:
        """
        Saves raw pasted text as a temporary text report file.
        Returns: (report_id, filename, file_path, file_size_bytes)
        """
        report_id = generate_report_id()
        content_bytes = text.encode("utf-8")
        file_size = len(content_bytes)

        stored_filename = f"{report_id}_pasted_report.txt"
        upload_dir = cls.get_upload_dir()
        file_path = os.path.join(upload_dir, stored_filename)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content_bytes)

        return report_id, report_name, file_path, file_size

    @staticmethod
    def delete_file(file_path: str) -> bool:
        """Safely delete file if it exists"""
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                return True
        except Exception:
            pass
        return False
