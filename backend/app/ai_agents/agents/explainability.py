from pydantic import BaseModel
from app.ai_agents.base import BaseAgent

class ExplainabilityInput(BaseModel):
    vision_summary: str
    geo_vulnerability: float
    risk_priority: str
    decision_rationale: str

class ExplainabilityOutput(BaseModel):
    chain_of_thought_markdown: str

class ExplainabilityAgent(BaseAgent[ExplainabilityInput, ExplainabilityOutput]):
    def __init__(self):
        super().__init__(
            system_instruction=(
                "You are the Explainability Engine. "
                "Translate the technical AI pipeline inputs into a clear, "
                "human-readable Chain of Thought (CoT) markdown trace. "
                "Explain EXACTLY why the AI made this decision, citing the vision, geo, and risk metrics."
            )
        )
