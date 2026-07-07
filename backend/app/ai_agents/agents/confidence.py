from pydantic import BaseModel
from app.ai_agents.agents.vision import VisionOutput

class ConfidenceInput(BaseModel):
    vision_output: VisionOutput
    reporter_elo: float
    gps_match: bool

class ConfidenceOutput(BaseModel):
    aggregated_confidence: float

class IncidentConfidenceEngine:
    """
    Algorithmic confidence aggregator.
    Aggregates LLM vision confidence, citizen trust, and geospatial integrity.
    """
    def execute(self, input_data: ConfidenceInput) -> ConfidenceOutput:
        # Calculate base average from vision entities
        if input_data.vision_output.entities:
            vision_conf = sum(e.confidence for e in input_data.vision_output.entities) / len(input_data.vision_output.entities)
        else:
            vision_conf = 0.5
            
        # Trust multiplier
        # 1000 ELO = 1.0 multiplier. 500 ELO = 0.5 multiplier.
        trust_multiplier = min(max(input_data.reporter_elo / 1000.0, 0.1), 1.5)
        
        # GPS Integrity
        gps_multiplier = 1.0 if input_data.gps_match else 0.7
        
        final_conf = min(vision_conf * trust_multiplier * gps_multiplier, 1.0)
        
        return ConfidenceOutput(aggregated_confidence=final_conf * 100.0)
