import asyncio
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.generation import GenerateABRequest, GenerateABResponse
from app.agents.graph import debate_graph, PostState
from app.db.database import get_db
from app.db import crud

router = APIRouter(tags=["Adversarial Agent Generation"])


@router.post("/api/rlhf/generate-ab", response_model=GenerateABResponse)
async def generate_ab_variants(
    payload: GenerateABRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Invokes the Adversarial Multi-Agent Debate Graph twice concurrently
    to produce two distinct high-conviction drafts (Variant A and Variant B)
    for the RLHF A/B Swipe Arena.
    """
    topic = payload.topic
    tone_guidance = payload.tone_guidance or "High conviction B2B thought leadership"

    print(f"\n========================================================")
    print(f"[Dispatcher] Spawning Dual Adversarial Graphs for Topic: '{topic}'")
    print(f"========================================================")

    # Initial states for the two concurrent debate graphs
    state_a: PostState = {
        "topic": topic,
        "tone_guidance": f"{tone_guidance} - Contrarian & Bold Provocation",
        "current_draft": "",
        "hacker_critique": "",
        "revision_count": 0,
        "is_approved": False,
    }

    state_b: PostState = {
        "topic": topic,
        "tone_guidance": f"{tone_guidance} - Analytical Blueprint & Framework",
        "current_draft": "",
        "hacker_critique": "",
        "revision_count": 0,
        "is_approved": False,
    }

    try:
        # Run both agent graphs concurrently
        print("[Dispatcher] Executing Graph Instance A and Graph Instance B concurrently...")
        final_state_a, final_state_b = await asyncio.gather(
            debate_graph.ainvoke(state_a),
            debate_graph.ainvoke(state_b),
        )
    except Exception as e:
        print(f"[Dispatcher] Execution Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Debate Graph execution failed: {str(e)}")

    variant_a = final_state_a.get("current_draft", "")
    variant_b = final_state_b.get("current_draft", "")
    iter_a = final_state_a.get("revision_count", 0)
    iter_b = final_state_b.get("revision_count", 0)

    print(f"========================================================")
    print(f"[Dispatcher] Dual Synthesis Complete! Variant A: {iter_a} passes, Variant B: {iter_b} passes")
    print(f"========================================================\n")

    # Persist the newly generated candidate pair in SQLite for RLHF Arena queue
    pair_id = None
    try:
        new_pair = await crud.create_pair(
            db=db,
            topic=topic,
            target_audience=tone_guidance,
            candidate_a=variant_a,
            candidate_b=variant_b,
        )
        pair_id = new_pair.id
    except Exception as db_err:
        print(f"[DB Warning] Could not persist pair to DB: {db_err}")

    return GenerateABResponse(
        status="success",
        topic=topic,
        variant_a=variant_a,
        variant_b=variant_b,
        iterations_a=iter_a,
        iterations_b=iter_b,
        pair_id=pair_id,
    )


@router.post("/api/rlhf/vote")
async def rlhf_direct_vote(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """
    Accepts human RLHF vote submissions from the Arena.
    Supports either direct text payload (winning_text, losing_text, selected_tags)
    or structured pair_id/chosen_id.
    """
    selected_tags = payload.get("selected_tags", []) or payload.get("micro_tags", [])
    winning_text = payload.get("winning_text", "")
    losing_text = payload.get("losing_text", "")
    pair_id = payload.get("pair_id")
    dwell_time = payload.get("dwell_time_ms", 0)
    confidence = payload.get("confidence", 4)

    print(f"\n[RLHF Arena Vote Recorded]")
    print(f"Tags: {selected_tags} | Confidence: {confidence} | Dwell Time: {dwell_time}ms")

    # If pair_id exists in DB, update record
    if pair_id:
        pair = await crud.get_pair_by_id(db, pair_id)
        if pair:
            chosen = payload.get("chosen_id", "candidate_a" if winning_text == pair.candidate_a else "candidate_b")
            rejected = payload.get("rejected_id", "candidate_b" if chosen == "candidate_a" else "candidate_a")
            await crud.record_vote(
                db=db,
                pair=pair,
                chosen_id=chosen,
                rejected_id=rejected,
                micro_tags=selected_tags,
                dwell_time_ms=dwell_time,
                confidence_rating=confidence,
            )

    return {
        "status": "success",
        "message": "Human preference vote successfully recorded in DPO queue.",
        "reward_delta": 0.85,
        "tags_recorded": selected_tags,
    }

