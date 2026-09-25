from typing import Optional
from pydantic import BaseModel, Field


class GenerateABRequest(BaseModel):
    """
    Input schema for /api/rlhf/generate-ab endpoint.
    """
    topic: str = Field(..., min_length=3, description="Topic for B2B thought leadership content")
    tone_guidance: Optional[str] = Field(None, description="Optional tone and style instructions")


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
