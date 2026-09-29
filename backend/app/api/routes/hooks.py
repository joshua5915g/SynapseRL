from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.services.hook_analyzer import calculate_hook_score, generate_alternative_hooks

router = APIRouter(prefix="/hooks", tags=["Hook Optimizer & Virality Scorer"])

class HookScoreRequest(BaseModel):
    text: str

class HookGenerateRequest(BaseModel):
    topic: str
    draft: Optional[str] = None
    provider: Optional[str] = "simulation"

@router.post("/score")
async def score_hook(payload: HookScoreRequest):
    """
    Evaluates opening hook virality against curiosity, metrics, brevity, and pain triggers.
    """
    result = calculate_hook_score(payload.text)
    return {"status": "success", "data": result}

@router.post("/generate")
async def generate_hooks(payload: HookGenerateRequest):
    """
    Generates 5 distinct high-performing hook archetypes with algorithmic virality scores.
    """
    hooks = await generate_alternative_hooks(
        topic=payload.topic,
        draft=payload.draft,
        provider=payload.provider or "simulation"
    )
    return {"status": "success", "hooks": hooks}
