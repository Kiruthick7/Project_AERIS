import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from app.db.base import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    status = Column(String, default="Submitted", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    soft_deleted_at = Column(DateTime(timezone=True), nullable=True)

    reporter = relationship("User")
    evidences = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    assessment = relationship("AIAssessment", back_populates="incident", uselist=False)
    recommendation = relationship("Recommendation", back_populates="incident", uselist=False)
