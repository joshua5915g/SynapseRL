"""
FastAPI Routes for First 60 Minutes Algorithm Velocity Predictor & Dwell Heatmap.
"""

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from app.services.velocity_predictor import velocity_service

router = APIRouter(prefix="/velocity", tags=["Velocity Predictor"])


class VelocityPredictRequest(BaseModel):
    content: str = Field(..., description="Post content text to analyze for algorithm fold and velocity")


@router.post("/predict")
async def predict_velocity(payload: VelocityPredictRequest):
    """Predicts scroll-stop velocity, mobile/desktop fold cutoffs, and dwell retention curve."""
    if not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    results = velocity_service.analyze_velocity(payload.content)
    return {"status": "success", "data": results}
