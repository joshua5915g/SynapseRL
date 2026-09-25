from typing import List, Optional
from pydantic import BaseModel, Field


class VoteRequest(BaseModel):
    """
    JSON API contract for submitting human preference votes from the RLHF Swipe Arena.
    """
    pair_id: str = Field(..., description="UUID of the PairwiseComparison record")
    chosen_id: str = Field(..., description="'candidate_a', 'candidate_b', or 'tie'")
    rejected_id: Optional[str] = Field(None, description="The unselected candidate ID")
    micro_tags: List[str] = Field(default_factory=list, description="List of qualitative tags like 'too_corporate'")
    dwell_time_ms: int = Field(default=0, description="Dwell time in milliseconds before user decided")
    confidence_rating: int = Field(default=3, ge=1, le=5, description="Confidence score from 1 to 5")
    feedback_notes: Optional[str] = Field(None, description="Optional qualitative reviewer notes")


class VoteResponse(BaseModel):
    status: str
    vote_id: str
    reward_delta: float
    dpo_pair_recorded: bool
    total_pairs_reviewed: int
    next_pair_available: bool


class PairResponse(BaseModel):
    id: str
    topic: str
    target_audience: str
    candidate_a: str
    candidate_b: str
    is_reviewed: bool
    created_at: str

    class Config:
        from_attributes = True


class DPOItem(BaseModel):
    prompt: str
    chosen: str
    rejected: str
    micro_tags: List[str]
    pair_id: str


class DPOExportResponse(BaseModel):
    total_pairs: int
    data: List[DPOItem]
