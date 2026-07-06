import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Evidence(Base):
    __tablename__ = "evidences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"), nullable=False)
    file_url = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    metadata_json = Column(JSONB, default={})
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    incident = relationship("Incident", back_populates="evidences")
