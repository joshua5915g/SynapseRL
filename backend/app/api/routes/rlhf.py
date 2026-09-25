from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db
from app.models.rlhf import VoteRequest, VoteResponse, PairResponse, DPOExportResponse, DPOItem
from app.services.reward_calculator import RewardCalculatorService
from app.services.dpo_formatter import DPOFormatterService
from app.db import crud

router = APIRouter(prefix="/rlhf", tags=["RLHF Engine"])


@router.get("/next-pair", response_model=PairResponse)
async def get_next_pair(db: AsyncSession = Depends(get_db)):
    """
    Returns the next pending unreviewed candidate pair for the human swipe arena.
    """
    pair = await crud.get_next_unreviewed_pair(db)
    if not pair:
        # If no pairs exist, automatically create a starter candidate pair
        starter_pair = await crud.create_pair(
            db=db,
            topic="Agentic AI Workflows in Enterprise SaaS",
            target_audience="CTOs & VPs of Engineering",
            candidate_a=(
                "🔥 The Contrarian Take on Agentic AI:\n\n"
                "Stop building monolithic prompts for mission-critical SaaS.\n\n"
                "90% of autonomous agent failures happen because one model is responsible for both generation AND validation.\n\n"
                "The fix? An Adversarial Dual-Agent Architecture:\n"
                "• Agent 1 (The Executor): Drafts domain solutions with strict Pydantic constraints.\n"
                "• Agent 2 (The Red Team): Validates edge cases and flags corporate fluff before state commits.\n"
                "• RLHF Buffer: All discrepancies route to a human A/B arena for DPO fine-tuning.\n\n"
                "Bookmark this framework before your next sprint."
            ),
            candidate_b=(
                "📐 The Engineering Blueprint for Agentic AI:\n\n"
                "Most multi-agent architectures fail at scale because of unmonitored agent drift.\n\n"
                "Here is how we stabilized our enterprise pipeline:\n"
                "• Continuous RLHF Calibration with Pairwise Preference logging\n"
                "• Automated DPO Fine-Tuning triggers on feedback thresholds\n"
                "• Jittered stealth dispatch queues to maintain distribution integrity\n\n"
                "Full architectural teardown in the comments below. 👇"
            ),
        )
        pair = starter_pair

    return PairResponse(
        id=pair.id,
        topic=pair.topic,
        target_audience=pair.target_audience,
        candidate_a=pair.candidate_a,
        candidate_b=pair.candidate_b,
        is_reviewed=pair.is_reviewed,
        created_at=pair.created_at.isoformat(),
    )


@router.post("/vote", response_model=VoteResponse)
async def submit_vote(
    payload: VoteRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Records a human preference decision (Winner, Loser, Micro-tags, Dwell Time)
    and updates the DPO preference dataset.
    """
    pair = await crud.get_pair_by_id(db, payload.pair_id)
    if not pair:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pair comparison with ID '{payload.pair_id}' not found.",
        )

    # Compute reward delta
    reward_delta = RewardCalculatorService.calculate_reward_delta(
        chosen_id=payload.chosen_id,
        confidence_rating=payload.confidence_rating,
        dwell_time_ms=payload.dwell_time_ms,
        micro_tags=payload.micro_tags,
    )

    # Record vote in DB
    updated_pair = await crud.record_vote(
        db=db,
        pair=pair,
        chosen_id=payload.chosen_id,
        rejected_id=payload.rejected_id,
        micro_tags=payload.micro_tags,
        dwell_time_ms=payload.dwell_time_ms,
        confidence_rating=payload.confidence_rating,
        feedback_notes=payload.feedback_notes,
    )

    # Check if more pairs remain
    next_pair = await crud.get_next_unreviewed_pair(db)
    stats = await crud.get_telemetry_stats(db)

    return VoteResponse(
        status="success",
        vote_id=updated_pair.id,
        reward_delta=reward_delta,
        dpo_pair_recorded=bool(updated_pair.chosen_content and updated_pair.rejected_content),
        total_pairs_reviewed=stats["total_reviewed"],
        next_pair_available=next_pair is not None,
    )


@router.get("/dpo-export", response_model=DPOExportResponse)
async def export_dpo_dataset(db: AsyncSession = Depends(get_db)):
    """
    Exports all labeled pairwise comparisons formatted for Direct Preference Optimization (DPO).
    """
    reviewed_pairs = await crud.get_all_reviewed_pairs(db)
    formatted_data = DPOFormatterService.format_comparisons_for_dpo(reviewed_pairs)
    
    dpo_items = [
        DPOItem(
            pair_id=item["pair_id"],
            prompt=item["prompt"],
            chosen=item["chosen"],
            rejected=item["rejected"],
            micro_tags=item["micro_tags"],
        )
        for item in formatted_data
    ]

    return DPOExportResponse(
        total_pairs=len(dpo_items),
        data=dpo_items,
    )
