from pydantic import BaseModel, Field
from app.ai_agents.base import BaseAgent

class ImpactInput(BaseModel):
    incident_title: str
    incident_description: str
    proposed_interventions: str
    population_density: int

class ImpactOutput(BaseModel):
    estimated_co2_reduction_kg: float
    estimated_people_protected: int
    resolution_time_hours: float
    impact_summary: str

class ImpactAgent(BaseAgent[ImpactInput, ImpactOutput]):
    def __init__(self):
        super().__init__(
            system_instruction=(
                "You are the Environmental Impact Simulator. "
                "Estimate the positive impact of resolving this incident using the proposed interventions. "
                "Provide realistic numerical estimates for CO2 reduction and people protected based on urban demographics."
            )
        )
