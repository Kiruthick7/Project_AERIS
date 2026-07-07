from pydantic import BaseModel
from typing import List

class EHIIInput(BaseModel):
    ward_id: str
    active_critical_incidents: int
    active_high_incidents: int
    resolved_incidents_today: int
    wind_stagnation_multiplier: float

class EHIOutput(BaseModel):
    ward_id: str
    ehi_score: float

class EnvironmentalHealthIndexEngine:
    """
    Algorithmic Environmental Health Index (EHI) calculator.
    0-100 score. 100 is perfect.
    """
    def execute(self, input_data: EHIIInput) -> EHIOutput:
        base_score = 100.0
        
        # Deductions
        deductions = (input_data.active_critical_incidents * 10) + (input_data.active_high_incidents * 5)
        
        # Modifiers
        deductions *= input_data.wind_stagnation_multiplier
        
        # Recovery
        recovery = input_data.resolved_incidents_today * 5
        
        final_score = max(min(base_score - deductions + recovery, 100.0), 0.0)
        
        return EHIOutput(ward_id=input_data.ward_id, ehi_score=final_score)
