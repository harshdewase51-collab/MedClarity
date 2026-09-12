import pytest
from app.core.security import validate_file, sanitize_filename
from app.core.exceptions import InvalidFileFormatError, FileTooLargeError, EmptyReportError

def test_sanitize_filename():
    assert sanitize_filename("../../../etc/passwd.pdf") == "passwd.pdf"
    assert sanitize_filename("C:\\Windows\\System32\\report.pdf") == "report.pdf"
    assert sanitize_filename("My Blood Report! (1).pdf") == "My_Blood_Report___1_.pdf"

def test_validate_allowed_formats():
    for ext in ["pdf", "png", "jpg", "jpeg", "webp", "txt"]:
        name, clean_ext = validate_file(f"test_report.{ext}", 1024 * 50)
        assert clean_ext == ext

def test_validate_disallowed_formats():
    with pytest.raises(InvalidFileFormatError):
        validate_file("malicious.exe", 1024)

    with pytest.raises(InvalidFileFormatError):
        validate_file("archive.zip", 1024)

def test_validate_file_size_exceeded():
    # 30 MB is above 25 MB limit
    size_30mb = 30 * 1024 * 1024
    with pytest.raises(FileTooLargeError):
        validate_file("large_scan.pdf", size_30mb)

def test_validate_empty_file_zero_bytes():
    with pytest.raises(EmptyReportError):
        validate_file("empty_report.pdf", 0)

def test_file_service_upload_dir_local(monkeypatch):
    import os
    from app.services.file_service import FileService
    monkeypatch.delenv("VERCEL", raising=False)
    monkeypatch.delenv("VERCEL_ENV", raising=False)
    monkeypatch.delenv("AWS_LAMBDA_FUNCTION_NAME", raising=False)
    monkeypatch.delenv("LAMBDA_TASK_ROOT", raising=False)
    
    upload_dir = FileService.get_upload_dir()
    assert os.path.exists(upload_dir)
    assert "uploads" in upload_dir

def test_file_service_upload_dir_vercel(monkeypatch):
    import os
    from app.services.file_service import FileService
    monkeypatch.setenv("VERCEL", "1")
    
    upload_dir = FileService.get_upload_dir()
    assert upload_dir == "/tmp/medclarity_uploads"
    assert os.path.exists(upload_dir)
