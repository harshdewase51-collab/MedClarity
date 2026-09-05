import os
import re
import uuid
from typing import Tuple
from app.core.config import settings
from app.core.exceptions import InvalidFileFormatError, FileTooLargeError, EmptyReportError

def generate_report_id() -> str:
    """Generate a clean collision-resistant report ID"""
    return f"rep_{uuid.uuid4().hex[:12]}"

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal and special character injection
    """
    # Remove any directory path components
    basename = os.path.basename(filename)
    # Replace non-alphanumeric characters (except dots, underscores, dashes)
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', basename)
    # Prevent hidden files
    clean_name = clean_name.lstrip('.')
    return clean_name or "medical_report"

def validate_file(filename: str, file_size_bytes: int) -> Tuple[str, str]:
    """
    Validate file extension and size against configured boundaries.
    Returns (sanitized_name, extension)
    """
    if file_size_bytes <= 0:
        raise EmptyReportError("The uploaded file is empty (0 bytes).")

    clean_name = sanitize_filename(filename)
    ext = clean_name.split('.')[-1].lower() if '.' in clean_name else ''

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise InvalidFileFormatError(ext, settings.ALLOWED_EXTENSIONS)

    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_bytes:
        raise FileTooLargeError(file_size_bytes / (1024 * 1024), settings.MAX_FILE_SIZE_MB)

    return clean_name, ext
