import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class AIAssessment(Base):
    __tablename__ = "ai_assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False, unique=True)
    vision_analysis = Column(JSONB, default={})
    geo_context = Column(JSONB, default={})
    weather_data = Column(JSONB, default={})
    risk_score = Column(Float, default=0.0)
    priority_score = Column(Float, default=0.0)
    overall_confidence = Column(Float, default=0.0)
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())

    incident = relationship("Incident", back_populates="assessment")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False, unique=True)
    suggested_response = Column(String, nullable=False)
    reasoning = Column(String, nullable=False)
    expected_impact = Column(String)
    confidence_score = Column(Float, default=0.0)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    incident = relationship("Incident", back_populates="recommendation")
