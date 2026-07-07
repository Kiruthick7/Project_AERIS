from pydantic import BaseModel, Field
from typing import List
from app.ai_agents.base import BaseAgent

class DecisionInput(BaseModel):
    incident_title: str
    incident_description: str
    priority_level: str
    vulnerability_score: float

class ProposedAction(BaseModel):
    action_type: str = Field(description="E.g., Dispatch, Monitor, Investigate")
    description: str = Field(description="Detailed description of the action")
    required_resource_type: str = Field(description="E.g., Water Cannon, Cleanup Crew, Inspection Team")

class DecisionOutput(BaseModel):
    actions: List[ProposedAction]
    rationale: str

class DecisionAgent(BaseAgent[DecisionInput, DecisionOutput]):
    def __init__(self):
        super().__init__(
            system_instruction=(
                "You are the Municipal Decision Agent. "
                "Based on the incident details and priority, formulate a precise action plan. "
                "Determine the types of resources needed to resolve the incident safely."
            )
        )
