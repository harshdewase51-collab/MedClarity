import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import MedicalSimplifierException, medical_exception_handler
from app.database.session import init_db
from app.routes import reports

# Initialize SQLite database schema
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown events"""
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Medical Report Simplifier API — Converts complex laboratory test reports "
        "and medical terminology into simple, patient-friendly plain language."
    ),
    lifespan=lifespan
)

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handler
app.add_exception_handler(MedicalSimplifierException, medical_exception_handler)

# Include API routes
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
@app.get("/api", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    from app.services.file_service import FileService
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "aiProvider": settings.AI_PROVIDER,
        "uploadDir": FileService.get_upload_dir()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
