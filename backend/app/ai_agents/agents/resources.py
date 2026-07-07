from pydantic import BaseModel, Field
from typing import List, Dict
from app.ai_agents.base import BaseAgent
from app.ai_agents.agents.decision import ProposedAction

class ResourceInput(BaseModel):
    proposed_actions: List[ProposedAction]
    available_resources: List[Dict[str, str]]

class ResourceAllocation(BaseModel):
    action_type: str
    assigned_resource_id: str
    assigned_resource_name: str

class ResourceOutput(BaseModel):
    allocations: List[ResourceAllocation]
    unmet_needs: List[str]

class ResourceAgent(BaseAgent[ResourceInput, ResourceOutput]):
    def __init__(self):
        super().__init__(
            system_instruction=(
                "You are the Resource Optimization Agent. "
                "Map the proposed actions to the available municipal resources optimally. "
                "Output the allocations and any unmet needs if resources are insufficient."
            )
        )
