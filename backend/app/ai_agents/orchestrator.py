import logging
from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.db.models.incident import Incident
from app.db.models.user import User
from app.db.models.assessment import AIAssessment, Recommendation

# Agents
from app.ai_agents.agents.vision import VisionAgent, VisionInput
from app.ai_agents.agents.geo import GeoIntelligenceEngine, GeoInput
from app.ai_agents.agents.confidence import IncidentConfidenceEngine, ConfidenceInput
from app.ai_agents.agents.risk import DynamicRiskEngine, RiskInput
from app.ai_agents.agents.decision import DecisionAgent, DecisionInput
from app.ai_agents.agents.resources import ResourceAgent, ResourceInput
from app.ai_agents.agents.explainability import ExplainabilityAgent, ExplainabilityInput

logger = logging.getLogger(__name__)

@celery_app.task(name="app.ai_agents.orchestrator.process_incident_pipeline")
def process_incident_pipeline(incident_id: str):
    """
    Executes the DAG of AI Agents for a given incident.
    """
    db = SessionLocal()
    try:
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            logger.error(f"Incident {incident_id} not found.")
            return

        reporter = db.query(User).filter(User.id == incident.reporter_id).first()
        reporter_elo = reporter.reputation_score if reporter else 1000.0

        # Step 1: Vision Agent
        vision_agent = VisionAgent()
        vision_out = vision_agent.generate(VisionInput(
            image_url=None, # Mocking image for now until storage is linked
            description=incident.description or incident.title
        ))

        # Step 2: Geo Intelligence Engine
        geo_engine = GeoIntelligenceEngine()
        # In MVP, PostGIS coordinates need to be fetched via a query that unpacks them.
        # Since this is a background task, we just use dummy coords if WKB is hard to unpack without func
        # We will mock the coordinates for the pipeline execution.
        geo_out = geo_engine.execute(GeoInput(
            incident_id=str(incident.id),
            latitude=12.97, # Mock
            longitude=77.59 # Mock
        ), db)

        # Step 3: Confidence Engine
        conf_engine = IncidentConfidenceEngine()
        conf_out = conf_engine.execute(ConfidenceInput(
            vision_output=vision_out,
            reporter_elo=reporter_elo,
            gps_match=True # Mock security check
        ))

        # Step 4: Risk Engine
        risk_engine = DynamicRiskEngine()
        risk_out = risk_engine.execute(RiskInput(
            severity_score=vision_out.severity_score,
            vulnerability_score=geo_out.vulnerability_score,
            hours_since_report=0.1
        ))

        # Step 5: Decision Agent
        decision_agent = DecisionAgent()
        decision_out = decision_agent.generate(DecisionInput(
            incident_title=incident.title,
            incident_description=incident.description or "",
            priority_level=risk_out.priority_level,
            vulnerability_score=geo_out.vulnerability_score
        ))

        # Step 6: Resource Agent
        resource_agent = ResourceAgent()
        mocked_resources = [
            {"id": "R1", "type": "Water Cannon", "status": "Available"},
            {"id": "R2", "type": "Cleanup Crew", "status": "Available"},
            {"id": "R3", "type": "Inspection Team", "status": "Busy"}
        ]
        resource_out = resource_agent.generate(ResourceInput(
            proposed_actions=decision_out.actions,
            available_resources=mocked_resources
        ))

        # Step 7: Explainability Agent
        explain_agent = ExplainabilityAgent()
        explain_out = explain_agent.generate(ExplainabilityInput(
            vision_summary=vision_out.summary,
            geo_vulnerability=geo_out.vulnerability_score,
            risk_priority=risk_out.priority_level,
            decision_rationale=decision_out.rationale
        ))

        # Step 8: Save to Database
        assessment = AIAssessment(
            incident_id=incident.id,
            confidence_score=conf_out.aggregated_confidence,
            priority_score=risk_out.dynamic_risk_score,
            analysis_details=explain_out.chain_of_thought_markdown
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        for alloc in resource_out.allocations:
            rec = Recommendation(
                assessment_id=assessment.id,
                action_type=alloc.action_type,
                description=f"Assigned {alloc.assigned_resource_name}"
            )
            db.add(rec)
            
        incident.status = "AI Assessed"
        db.commit()

        logger.info(f"Successfully processed pipeline for incident {incident_id}")

    except Exception as e:
        logger.error(f"Pipeline failed for {incident_id}: {e}")
        db.rollback()
    finally:
        db.close()
