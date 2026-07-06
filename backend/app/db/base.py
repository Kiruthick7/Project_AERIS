from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.db.models.user import User
from app.db.models.incident import Incident
from app.db.models.evidence import Evidence
from app.db.models.assessment import AIAssessment, Recommendation

