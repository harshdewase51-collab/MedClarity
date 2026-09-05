import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Medical Report Simplifier"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Uploads & Storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg", "txt"]

    # Database
    DATABASE_URL: str = "sqlite:///./medical_reports.db"

    # AI Provider Settings
    AI_PROVIDER: str = "hybrid"  # "hybrid", "gemini", "openai", "rule_based"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    AI_MODEL_NAME: str = "gemini-1.5-flash"
    AI_TEMPERATURE: float = 0.2

    # Safety
    ENFORCE_SAFETY_DISCLAIMER: bool = True
    AUTO_CLEANUP_TEMP_FILES: bool = False

    DISCLAIMER_TEXT: str = (
        "This tool helps explain medical reports in simple language. "
        "It does not provide medical diagnosis or treatment advice."
    )

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
