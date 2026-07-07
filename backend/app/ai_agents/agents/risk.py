from pydantic import BaseModel
import time

class RiskInput(BaseModel):
    severity_score: int
    vulnerability_score: float
    hours_since_report: float

class RiskOutput(BaseModel):
    dynamic_risk_score: float
    priority_level: str

class DynamicRiskEngine:
    """
    Time-Decaying Risk Formula (TDRF).
    Calculates real-time priority based on time-decay, severity, and vulnerability.
    """
    def execute(self, input_data: RiskInput) -> RiskOutput:
        import math
        
        # Risk = (Base_Severity * Vulnerability_Factor) / e^(Time_Since_Report * 0.1)
        # However, for an incident, risk usually goes UP over time if ignored for certain types.
        # But if it's a minor thing, priority might decay. 
        # For this civic app, let's say risk escalates slightly over time if unresolved.
        # TDRF: Risk = (Severity * Vulnerability) * e^(Hours * 0.05)
        
        base = float(input_data.severity_score) * input_data.vulnerability_score
        time_multiplier = math.exp(input_data.hours_since_report * 0.05)
        
        risk_score = base * time_multiplier
        
        if risk_score >= 15.0:
            level = "Critical"
        elif risk_score >= 10.0:
            level = "High"
        elif risk_score >= 5.0:
            level = "Medium"
        else:
            level = "Low"
            
        return RiskOutput(
            dynamic_risk_score=risk_score,
            priority_level=level
        )
