from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class VoteRequest(BaseModel):
    """
    Validation schema for human preference vote submissions from the Next.js Arena.
    """
    topic: str = Field(..., description="Prompt/topic of the generated content")
    winning_text: str = Field(..., description="The chosen winning draft")
    losing_text: str = Field(..., description="The rejected losing draft")
    tags: List[str] = Field(default_factory=list, description="Micro-tags selected by the human reviewer")
    
    # Optional metadata
    dwell_time_ms: Optional[int] = Field(default=0, description="Review latency in milliseconds")
    confidence: Optional[int] = Field(default=4, description="Confidence score 1 to 5")
    feedback_notes: Optional[str] = Field(default=None, description="Optional qualitative feedback")


class VoteResponse(BaseModel):
    """
    Standard response payload upon recording a human preference vote.
    """
    status: str = "success"
    id: int
    message: str = "Human preference pair successfully persisted for DPO training."


class PreferencePairRead(BaseModel):
    """
    Schema for reading persisted preference pair records.
    """
    id: int
    topic: str
    winning_text: str
    losing_text: str
    human_tags: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
