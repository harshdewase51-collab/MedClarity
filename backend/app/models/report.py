import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(64), primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(32), nullable=False)
    file_path = Column(String(512), nullable=True)
    raw_text = Column(Text, nullable=True)
    status = Column(String(32), default="uploaded", index=True)

    report_name = Column(String(255), default="Laboratory Medical Report")
    report_date = Column(String(64), nullable=True)
    lab_name = Column(String(255), nullable=True)
    patient_name = Column(String(255), nullable=True)
    summary = Column(Text, nullable=True)
    language = Column(String(32), default="english")
    overall_status = Column(String(32), default="normal")

    total_tests = Column(Integer, default=0)
    normal_count = Column(Integer, default=0)
    abnormal_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    tests = relationship("TestResult", back_populates="report", cascade="all, delete-orphan")
    important_findings = relationship("ImportantFinding", back_populates="report", cascade="all, delete-orphan")
    ai_explanations = relationship("AIExplanation", back_populates="report", cascade="all, delete-orphan")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(String(64), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    
    test_name = Column(String(255), nullable=False)
    value = Column(String(64), nullable=False)
    numeric_value = Column(Float, nullable=True)
    unit = Column(String(64), default="")
    reference_range = Column(String(128), nullable=True)
    min_range = Column(Float, nullable=True)
    max_range = Column(Float, nullable=True)
    status = Column(String(32), default="unable_to_determine")
    
    medical_term = Column(String(255), nullable=True)
    simple_meaning = Column(Text, nullable=True)
    simple_explanation = Column(Text, nullable=True)

    report = relationship("Report", back_populates="tests")

class ImportantFinding(Base):
    __tablename__ = "important_findings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(String(64), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    
    test_name = Column(String(255), nullable=False)
    value = Column(String(64), nullable=False)
    unit = Column(String(64), default="")
    reference_range = Column(String(128), nullable=True)
    status = Column(String(32), nullable=False)
    medical_term = Column(String(255), nullable=True)
    explanation = Column(Text, nullable=False)

    report = relationship("Report", back_populates="important_findings")

class AIExplanation(Base):
    __tablename__ = "ai_explanations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(String(64), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False, index=True)
    
    medical_term = Column(String(255), nullable=False)
    simple_meaning = Column(Text, nullable=False)
    easy_explanation = Column(Text, nullable=False)
    related_test = Column(String(255), nullable=True)

    report = relationship("Report", back_populates="ai_explanations")
