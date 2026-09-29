from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from app.api.dependencies import get_db
from app.services.analytics_ingestion import ingest_post_telemetry, simulate_audience_traffic

router = APIRouter(prefix="/analytics", tags=["Audience Analytics & Empirical RL"])

class IngestMetricsRequest(BaseModel):
    post_id: str
    impressions: int
    reactions: int
    comments: int
    reposts: int
    clicks: int

@router.post("/ingest")
async def ingest_metrics(
    payload: IngestMetricsRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Ingests live organic engagement metrics for a post to compute the empirical reward.
    """
    res = await ingest_post_telemetry(
        db=db,
        post_id=payload.post_id,
        impressions=payload.impressions,
        reactions=payload.reactions,
        comments=payload.comments,
        reposts=payload.reposts,
        clicks=payload.clicks,
    )
    return {"status": "success", "data": res}

@router.post("/simulate")
async def simulate_engagement(
    db: AsyncSession = Depends(get_db),
):
    """
    Simulates realistic 24-hour LinkedIn organic distribution and updates empirical reward curves.
    """
    res = await simulate_audience_traffic(db=db)
    return res
