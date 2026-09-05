import os
import aiofiles
from typing import Tuple
from fastapi import UploadFile
from app.core.config import settings
from app.core.security import generate_report_id, validate_file

class FileService:
    @staticmethod
    async def save_upload_file(upload_file: UploadFile) -> Tuple[str, str, str, int]:
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
        file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)

        return report_id, sanitized_name, file_path, file_size

    @staticmethod
    async def save_text_content(text: str, report_name: str = "Pasted_Report.txt") -> Tuple[str, str, str, int]:
        """
        Saves raw pasted text as a temporary text report file.
        Returns: (report_id, filename, file_path, file_size_bytes)
        """
        report_id = generate_report_id()
        content_bytes = text.encode("utf-8")
        file_size = len(content_bytes)

        stored_filename = f"{report_id}_pasted_report.txt"
        file_path = os.path.join(settings.UPLOAD_DIR, stored_filename)

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
