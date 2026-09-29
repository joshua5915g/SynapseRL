"""API router for predictive smart scheduler and engagement heatmap."""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.services.smart_scheduler import get_heatmap_matrix, calculate_optimal_slot, get_scheduled_queue

router = APIRouter()

class AutoSlotRequest(BaseModel):
    topic: str = Field(..., description="Post topic")
    content: str = Field(..., description="Post draft content")
    timezone: Optional[str] = Field("US/Eastern", description="Target executive timezone")

@router.get("/heatmap")
async def get_heatmap_endpoint():
    return get_heatmap_matrix()

@router.get("/queue")
async def get_queue_endpoint():
    return {"queue": get_scheduled_queue()}

@router.post("/auto-slot")
async def auto_slot_endpoint(req: AutoSlotRequest):
    slot = calculate_optimal_slot(req.topic, req.content, req.timezone or "US/Eastern")
    return {
        "status": "success",
        "message": "Post successfully slotted into smart publishing queue",
        "slot": slot
    }
