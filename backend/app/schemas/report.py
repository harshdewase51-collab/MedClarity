from typing import List, Optional, Union, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field

class TestStatus(str, Enum):
    __test__ = False
    NORMAL = "normal"
    HIGH = "high"
    LOW = "low"
    UNABLE_TO_DETERMINE = "unable_to_determine"

class ReportLanguage(str, Enum):
    ENGLISH = "english"
    HINDI = "hindi"
    HINGLISH = "hinglish"

class ProcessStatus(str, Enum):
    UPLOADED = "uploaded"
    EXTRACTING = "extracting"
    ANALYZING = "analyzing"
    SIMPLIFIED = "simplified"
    FAILED = "failed"

class TestResultSchema(BaseModel):
    __test__ = False
    id: Optional[str] = None
    testName: str = Field(..., description="Name of the clinical biomarker or lab test")
    value: Union[float, str] = Field(..., description="Reported result value")
    numericValue: Optional[float] = None
    unit: str = Field(default="", description="Measurement unit (e.g. g/dL, mg/dL)")
    referenceRange: Optional[str] = Field(default=None, description="Reported reference range (e.g. 13-17 g/dL)")
    minRange: Optional[float] = None
    maxRange: Optional[float] = None
    status: TestStatus = Field(default=TestStatus.UNABLE_TO_DETERMINE)
    medicalTerm: Optional[str] = None
    simpleMeaning: Optional[str] = None
    simpleExplanation: Optional[str] = None

class ImportantFindingSchema(BaseModel):
    id: Optional[str] = None
    testName: str
    value: Union[float, str]
    unit: str
    referenceRange: Optional[str] = None
    status: TestStatus
    medicalTerm: Optional[str] = None
    explanation: str

class AIExplanationSchema(BaseModel):
    id: Optional[str] = None
    medicalTerm: str = Field(..., description="Complex medical term or test concept")
    simpleMeaning: str = Field(..., description="1-sentence plain meaning")
    easyExplanation: str = Field(..., description="Everyday patient-friendly analogy or explanation")
    relatedTest: Optional[str] = None

class ReportUploadResponse(BaseModel):
    success: bool = True
    reportId: str
    filename: str
    fileType: str
    fileSizeBytes: int
    status: ProcessStatus
    message: str

class ReportStatusResponse(BaseModel):
    reportId: str
    filename: str
    status: ProcessStatus
    language: str
    totalTests: int = 0
    normalCount: int = 0
    abnormalCount: int = 0
    createdAt: str
    updatedAt: str

class ReportSimplifyRequest(BaseModel):
    language: ReportLanguage = Field(default=ReportLanguage.ENGLISH, description="Requested output language")

class TextUploadRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Raw medical report text to analyze")
    reportName: Optional[str] = "Pasted Medical Report"
    language: Optional[ReportLanguage] = ReportLanguage.ENGLISH

class ReportResponse(BaseModel):
    reportId: str
    reportName: str
    reportDate: Optional[str] = None
    labName: Optional[str] = None
    patientName: Optional[str] = None
    status: str = "normal"
    summary: str
    totalTests: int
    normalCount: int
    abnormalCount: int
    tests: List[TestResultSchema]
    importantFindings: List[ImportantFindingSchema]
    aiExplanations: List[AIExplanationSchema]
    language: str
    disclaimer: str
    createdAt: str
    updatedAt: str
