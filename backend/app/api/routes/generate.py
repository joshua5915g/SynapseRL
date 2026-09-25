from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db
from app.models.generation import GenerateRequest, GenerateResponse, GenerateABRequest, GenerateABResponse
from app.agents.graph import debate_graph, PostState
from app.db import crud
import asyncio

router = APIRouter(prefix="/generate", tags=["Agent Generation"])


@router.post("/ab", response_model=GenerateABResponse)
async def generate_candidate_ab(
    payload: GenerateABRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Invokes the Adversarial Multi-Agent Debate Graph twice concurrently
    to produce Variant A and Variant B.
    """
    topic = payload.topic
    tone_guidance = payload.tone_guidance or "High conviction B2B thought leadership"

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

    final_state_a, final_state_b = await asyncio.gather(
        debate_graph.ainvoke(state_a),
        debate_graph.ainvoke(state_b),
    )

    variant_a = final_state_a.get("current_draft", "")
    variant_b = final_state_b.get("current_draft", "")

    # Save to SQLite pair comparison
    await crud.create_pair(
        db=db,
        topic=topic,
        target_audience=tone_guidance,
        candidate_a=variant_a,
        candidate_b=variant_b,
    )

    return GenerateABResponse(
        status="success",
        topic=topic,
        variant_a=variant_a,
        variant_b=variant_b,
        iterations_a=final_state_a.get("revision_count", 0),
        iterations_b=final_state_b.get("revision_count", 0),
    )


@router.post("", response_model=GenerateResponse)
async def generate_candidate_pair(
    payload: GenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Legacy generation endpoint.
    """
    topic = payload.topic
    state: PostState = {
        "topic": topic,
        "tone_guidance": payload.target_audience,
        "current_draft": "",
        "hacker_critique": "",
        "revision_count": 0,
        "is_approved": False,
    }

    final_state = await debate_graph.ainvoke(state)
    draft = final_state.get("current_draft", "")

    candidate_a = f"🔥 {draft}"
    candidate_b = f"📐 {draft}"

    pair_record = await crud.create_pair(
        db=db,
        topic=payload.topic,
        target_audience=payload.target_audience,
        candidate_a=candidate_a,
        candidate_b=candidate_b,
    )

    return GenerateResponse(
        pair_id=pair_record.id,
        topic=payload.topic,
        target_audience=payload.target_audience,
        iteration_count=final_state.get("revision_count", 1),
        critique_feedback=final_state.get("hacker_critique", "Approved"),
        hook_score=9.0,
        cringe_score=1.5,
        candidate_a=candidate_a,
        candidate_b=candidate_b,
        status="READY_FOR_ARENA",
    )
