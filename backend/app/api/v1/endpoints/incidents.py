from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_X, ST_Y
from app.api import deps
from app.db.models.incident import Incident
from app.db.models.user import User
from app.domain.incident import IncidentCreate, IncidentResponse

router = APIRouter()

@router.post("/", response_model=IncidentResponse, status_code=201)
def create_incident(
    *,
    db: Session = Depends(deps.get_db),
    incident_in: IncidentCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new incident.
    """
    # Create GeoAlchemy WKTElement for PostGIS
    point = WKTElement(f'POINT({incident_in.longitude} {incident_in.latitude})', srid=4326)
    
    incident = Incident(
        title=incident_in.title,
        description=incident_in.description,
        location=point,
        reporter_id=current_user.id,
        status="Submitted"
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # Trigger Environmental Intelligence Engine Pipeline
    from app.ai_agents.orchestrator import process_incident_pipeline
    process_incident_pipeline.delay(str(incident.id))
    
    # Return response mapped with lon/lat
    response_data = incident.__dict__.copy()
    response_data["longitude"] = incident_in.longitude
    response_data["latitude"] = incident_in.latitude
    return response_data

@router.get("/", response_model=List[IncidentResponse])
def read_incidents(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    lat: Optional[float] = Query(None, description="Latitude for spatial filtering"),
    lon: Optional[float] = Query(None, description="Longitude for spatial filtering"),
    radius_km: Optional[float] = Query(5.0, description="Radius in kilometers"),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve incidents. Optionally filter by geographic radius.
    """
    query = db.query(Incident, ST_X(Incident.location).label("longitude"), ST_Y(Incident.location).label("latitude"))
    
    if lat is not None and lon is not None:
        # Cast to geography for accurate distance calculation in meters
        point_wkt = f'SRID=4326;POINT({lon} {lat})'
        query = query.filter(
            func.ST_DWithin(
                func.cast(Incident.location, func.geometry()),
                func.ST_GeomFromEWKT(point_wkt),
                radius_km * 1000 / 111320.0  # Approx degree conversion for simple MVP mapping, proper way is casting to geography
            )
        )
    
    results = query.offset(skip).limit(limit).all()
    
    # Map the tuple results to Response model
    incidents = []
    for inc, lng, lt in results:
        data = inc.__dict__.copy()
        data["longitude"] = lng
        data["latitude"] = lt
        incidents.append(data)
        
    return incidents

@router.get("/{id}", response_model=IncidentResponse)
def read_incident(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get incident by ID.
    """
    result = db.query(Incident, ST_X(Incident.location).label("longitude"), ST_Y(Incident.location).label("latitude")).filter(Incident.id == id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    inc, lng, lt = result
    data = inc.__dict__.copy()
    data["longitude"] = lng
    data["latitude"] = lt
    return data
