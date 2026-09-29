"""API router for LLM-as-a-Judge synthetic RLHF bootstrapping."""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.synthetic_judge import evaluate_pair_synthetic
from app.services.rlhf import rlhf_service

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
async def evaluate_pair_endpoint(req: SyntheticJudgeRequest):
    result = evaluate_pair_synthetic(
        topic=req.topic,
        variant_a=req.variant_a,
        variant_b=req.variant_b,
        audience=req.audience or "B2B Tech Leaders"
    )

    if req.auto_record_dpo:
        dpo = result["dpo_record"]
        await rlhf_service.record_preference(
            pair_id=f"synth-{req.topic[:16].strip().replace(' ', '-').lower()}",
            prompt=dpo["prompt"],
            chosen=dpo["chosen"],
            rejected=dpo["rejected"],
            dwell_time_ms=12000
        )

    return result

@router.post("/bootstrap-batch")
async def bootstrap_batch_endpoint(req: SyntheticBatchRequest):
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
        await rlhf_service.record_preference(
            pair_id=f"batch-synth-{i+1}",
            prompt=dpo["prompt"],
            chosen=dpo["chosen"],
            rejected=dpo["rejected"],
            dwell_time_ms=15000
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
