from typing import Optional
from pydantic import BaseModel, Field


class GenerateABRequest(BaseModel):
    """
    Input schema for /api/rlhf/generate-ab endpoint.
    """
    topic: str = Field(..., min_length=3, description="Topic for B2B thought leadership content")
    tone_guidance: Optional[str] = Field(None, description="Optional tone and style instructions")
    llm_provider: Optional[str] = Field(default="simulation", description="Selected LLM provider (simulation, openai, anthropic, gemini, ollama)")
    llm_model: Optional[str] = Field(default=None, description="Selected model identifier")
    persona_id: Optional[str] = Field(default=None, description="Selected Ghostwriter Persona ID")
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=1.5, description="Sampling temperature")



class GenerateABResponse(BaseModel):
    """
    Output schema containing two distinct generated variants for the A/B Swipe Arena.
    """
    status: str
    topic: str
    variant_a: str
    variant_b: str
    iterations_a: int
    iterations_b: int
    pair_id: Optional[str] = None
    provider_used: Optional[str] = "simulation"
    drafts_a: Optional[list[str]] = None
    critiques_a: Optional[list[str]] = None
    drafts_b: Optional[list[str]] = None
    critiques_b: Optional[list[str]] = None


class RLHFDirectVoteRequest(BaseModel):
    """
    Input schema for /api/rlhf/vote endpoint supporting direct winner/loser text and micro-tags.
    """
    winning_text: Optional[str] = None
    losing_text: Optional[str] = None
    selected_tags: list[str] = Field(default_factory=list)
    pair_id: Optional[str] = None
    chosen_id: Optional[str] = None
    rejected_id: Optional[str] = None
    dwell_time_ms: int = 0
    confidence: int = 4



# Backward compatibility schemas
class GenerateRequest(BaseModel):
    topic: str = Field(..., description="Core subject matter topic for content generation")
    target_audience: str = Field(default="B2B Tech Leaders & Engineers", description="Intended audience persona")
    max_iterations: int = Field(default=2, ge=1, le=5, description="Max adversarial debate cycles")


class GenerateResponse(BaseModel):
    pair_id: str
    topic: str
    target_audience: str
    iteration_count: int
    critique_feedback: str
    hook_score: float
    cringe_score: float
    candidate_a: str
    candidate_b: str
    status: str
