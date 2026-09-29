"""API router for LLM-as-a-Judge synthetic RLHF bootstrapping."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.api.dependencies import get_db
from app.db import crud
from app.services.synthetic_judge import evaluate_pair_synthetic

router = APIRouter()

class SyntheticJudgeRequest(BaseModel):
    topic: str = Field(..., description="Topic of debate")
    variant_a: str = Field(..., description="Content of Candidate A")
    variant_b: str = Field(..., description="Content of Candidate B")
    audience: Optional[str] = Field("B2B Tech Leaders", description="Target audience")
    auto_record_dpo: Optional[bool] = Field(True, description="Automatically append pair to DPO training store")

class SyntheticBatchRequest(BaseModel):
    count: Optional[int] = Field(3, description="Number of synthetic pairs to simulate and annotate")

@router.post("/evaluate")
async def evaluate_pair_endpoint(
    req: SyntheticJudgeRequest,
    db: AsyncSession = Depends(get_db)
):
    result = evaluate_pair_synthetic(
        topic=req.topic,
        variant_a=req.variant_a,
        variant_b=req.variant_b,
        audience=req.audience or "B2B Tech Leaders"
    )

    if req.auto_record_dpo:
        pair = await crud.create_pair(
            db=db,
            topic=req.topic,
            target_audience=req.audience or "B2B Tech Leaders",
            candidate_a=req.variant_a,
            candidate_b=req.variant_b
        )
        await crud.record_vote(
            db=db,
            pair=pair,
            chosen_id=result["winner"],
            rejected_id="candidate_b" if result["winner"] == "candidate_a" else "candidate_a",
            micro_tags=["LLM Judge Auto-Annotation", "High Technical Depth"],
            dwell_time_ms=12000,
            confidence_rating=5,
            feedback_notes=result["verdict_rationale"]
        )

    return result

@router.post("/bootstrap-batch")
async def bootstrap_batch_endpoint(
    req: SyntheticBatchRequest,
    db: AsyncSession = Depends(get_db)
):
    sample_topics = [
        "Distributed Transaction Sagas vs Two-Phase Commit",
        "Why Multi-Tenant Vector Indexing Blows Up Memory",
        "The Real Cost of Microservices Sprawl in Early-Stage Series A",
        "Zero-Trust IAM for Multi-Cloud Kubernetes Clusters",
        "Deterministic LangGraph Workflows in Enterprise Production"
    ]
    annotated = []
    for i in range(min(req.count or 3, len(sample_topics))):
        topic = sample_topics[i]
        res = evaluate_pair_synthetic(
            topic=topic,
            variant_a=f"Most engineering leaders deploy {topic} without measuring silent state drift.\n\nHere are 3 rules:\n1. Isolate the consensus layer\n2. Enforce idempotent retry tokens\n3. Capture empirical latency telemetry.",
            variant_b=f"In today's fast-moving world, {topic} is truly a game-changer that will supercharge your team's synergy and revolutionize your operations.",
            audience="B2B CTOs & Engineering VPs"
        )
        dpo = res["dpo_record"]
        pair = await crud.create_pair(
            db=db,
            topic=topic,
            target_audience="B2B CTOs & Engineering VPs",
            candidate_a=dpo["chosen"],
            candidate_b=dpo["rejected"]
        )
        await crud.record_vote(
            db=db,
            pair=pair,
            chosen_id="candidate_a",
            rejected_id="candidate_b",
            micro_tags=["Cold-Start Synthetic Bootstrap", "Zero Corporate Fluff"],
            dwell_time_ms=15000,
            confidence_rating=5,
            feedback_notes=res["verdict_rationale"]
        )
        annotated.append({
            "topic": topic,
            "winner": res["winner_label"],
            "margin": res["score_margin"],
            "reward_delta": dpo["reward_delta"]
        })

    return {
        "status": "success",
        "bootstrapped_count": len(annotated),
        "pairs": annotated
    }
