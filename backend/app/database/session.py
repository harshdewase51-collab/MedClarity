import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

def _resolve_database_url() -> str:
    url = settings.DATABASE_URL
    is_serverless = bool(
        os.environ.get("VERCEL")
        or os.environ.get("VERCEL_ENV")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or os.environ.get("LAMBDA_TASK_ROOT")
    )
    if is_serverless and "sqlite" in url and ":memory:" not in url:
        # Route relative SQLite database paths to /tmp to prevent read-only filesystem errors
        tmp_db = "/tmp/medical_reports.db"
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        src_db = os.path.join(base_dir, "medical_reports.db")
        if not os.path.exists(tmp_db) and os.path.exists(src_db):
            try:
                shutil.copy2(src_db, tmp_db)
            except Exception:
                pass
        return f"sqlite:///{tmp_db}"
    return url

db_url = _resolve_database_url()

# SQLite connection configuration with thread safety check
engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """FastAPI dependency for database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    from app.models import report
    Base.metadata.create_all(bind=engine)
