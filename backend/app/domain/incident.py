from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class LocationBase(BaseModel):
    longitude: float
    latitude: float

class IncidentCreate(BaseModel):
    title: str = Field(..., example="Illegal garbage burning")
    description: Optional[str] = None
    longitude: float = Field(..., example=77.5946)
    latitude: float = Field(..., example=12.9716)

class IncidentResponse(BaseModel):
    id: UUID
    reporter_id: UUID
    title: str
    description: Optional[str]
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    # We will compute these or return them as raw fields
    longitude: Optional[float] = None
    latitude: Optional[float] = None

    class Config:
        from_attributes = True
