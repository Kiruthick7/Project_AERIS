from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models.incident import Incident

class GeoInput(BaseModel):
    incident_id: str
    latitude: float
    longitude: float

class GeoOutput(BaseModel):
    distance_to_nearest_school_meters: float
    distance_to_nearest_hospital_meters: float
    wind_vector_intersection: bool
    vulnerability_score: float

class GeoIntelligenceEngine:
    """
    Pure algorithmic spatial engine (No LLM).
    Extracts contextual vulnerability metrics from PostGIS.
    """
    def execute(self, input_data: GeoInput, db: Session) -> GeoOutput:
        # For MVP, we mock the PostGIS query since we don't have schools/hospitals tables yet.
        # A real implementation would do:
        # db.query(func.ST_Distance(Incident.location, School.location)).first()
        
        # Heuristic mock logic based on coordinates
        mock_distance_school = 1200.0 if input_data.latitude > 0 else 400.0
        mock_distance_hospital = 2500.0
        
        # Calculate vulnerability: closer = more vulnerable
        v_score = 1.0
        if mock_distance_school < 500:
            v_score += 1.5
        if mock_distance_hospital < 1000:
            v_score += 0.5
            
        return GeoOutput(
            distance_to_nearest_school_meters=mock_distance_school,
            distance_to_nearest_hospital_meters=mock_distance_hospital,
            wind_vector_intersection=True,
            vulnerability_score=v_score
        )
