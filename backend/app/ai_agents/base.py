from typing import TypeVar, Generic, Type
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

InputType = TypeVar('InputType', bound=BaseModel)
OutputType = TypeVar('OutputType', bound=BaseModel)

class BaseAgent(Generic[InputType, OutputType]):
    """
    Base class for all Specialized AI Agents in the Environmental Intelligence Engine.
    Enforces deterministic Pydantic inputs and outputs.
    """
    def __init__(
        self, 
        model_name: str = "gemini-2.5-pro",
        system_instruction: str = "You are a specialized AI agent."
    ):
        self.model_name = model_name
        self.system_instruction = system_instruction
        # Note: the new google-genai sdk uses GEMINI_API_KEY from environment natively,
        # but we can explicitly pass it if needed.
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
    def _get_output_schema(self) -> Type[OutputType]:
        """
        Extract the OutputType from the generic type arguments.
        Subclasses must define their generic types e.g. class VisionAgent(BaseAgent[InputSchema, OutputSchema]):
        """
        orig_bases = getattr(self.__class__, '__orig_bases__', [])
        for base in orig_bases:
            if getattr(base, '__origin__', None) is BaseAgent:
                return base.__args__[1]
        raise TypeError("Could not determine OutputType schema.")

    def generate(self, input_data: InputType) -> OutputType:
        """
        Executes the agent logic, returning a validated OutputType object.
        """
        output_schema = self._get_output_schema()
        
        prompt = self.format_prompt(input_data)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    response_mime_type="application/json",
                    response_schema=output_schema,
                    temperature=0.1, # Keep it highly deterministic
                ),
            )
            # The google-genai sdk currently parses JSON if a schema is provided and parses into a dict or Pydantic.
            # Usually response.parsed returns the typed pydantic model.
            if response.parsed:
                 return response.parsed
                 
            # Fallback if parsed isn't populated automatically but we have text
            import json
            data = json.loads(response.text)
            return output_schema(**data)
            
        except Exception as e:
            logger.error(f"Agent execution failed: {e}")
            raise

    def format_prompt(self, input_data: InputType) -> str:
        """
        Default prompt formatter. Subclasses can override to inject image parts or custom text.
        """
        return f"Input Data:\n{input_data.model_dump_json()}"
