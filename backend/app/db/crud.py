from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.db.models import PairwiseComparison, PostLog, TelemetrySnapshot


async def create_pair(
    db: AsyncSession,
    topic: str,
    target_audience: str,
    candidate_a: str,
    candidate_b: str,
) -> PairwiseComparison:
    pair = PairwiseComparison(
        topic=topic,
        target_audience=target_audience,
        candidate_a=candidate_a,
        candidate_b=candidate_b,
        is_reviewed=False,
    )
    db.add(pair)
    await db.commit()
    await db.refresh(pair)
    return pair


async def get_next_unreviewed_pair(db: AsyncSession) -> Optional[PairwiseComparison]:
    query = (
        select(PairwiseComparison)
        .where(PairwiseComparison.is_reviewed == False)
        .order_by(PairwiseComparison.created_at.asc())
        .limit(1)
    )
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_pair_by_id(db: AsyncSession, pair_id: str) -> Optional[PairwiseComparison]:
    query = select(PairwiseComparison).where(PairwiseComparison.id == pair_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def record_vote(
    db: AsyncSession,
    pair: PairwiseComparison,
    chosen_id: str,
    rejected_id: Optional[str],
    micro_tags: List[str],
    dwell_time_ms: int,
    confidence_rating: int,
    feedback_notes: Optional[str] = None,
) -> PairwiseComparison:
    pair.chosen_id = chosen_id
    pair.rejected_id = rejected_id
    
    if chosen_id == "candidate_a":
        pair.chosen_content = pair.candidate_a
        pair.rejected_content = pair.candidate_b
    elif chosen_id == "candidate_b":
        pair.chosen_content = pair.candidate_b
        pair.rejected_content = pair.candidate_a
    else:
        pair.chosen_content = None
        pair.rejected_content = None

    pair.micro_tags = micro_tags
    pair.dwell_time_ms = dwell_time_ms
    pair.confidence_rating = confidence_rating
    pair.feedback_notes = feedback_notes
    pair.is_reviewed = True
    pair.reviewed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(pair)
    return pair


async def get_all_reviewed_pairs(db: AsyncSession, limit: int = 1000) -> List[PairwiseComparison]:
    query = (
        select(PairwiseComparison)
        .where(PairwiseComparison.is_reviewed == True)
        .order_by(desc(PairwiseComparison.reviewed_at))
        .limit(limit)
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_telemetry_stats(db: AsyncSession) -> Dict[str, Any]:
    total_reviewed_query = select(func.count(PairwiseComparison.id)).where(PairwiseComparison.is_reviewed == True)
    total_unreviewed_query = select(func.count(PairwiseComparison.id)).where(PairwiseComparison.is_reviewed == False)
    
    total_reviewed = (await db.execute(total_reviewed_query)).scalar() or 0
    total_pending = (await db.execute(total_unreviewed_query)).scalar() or 0

    # Win-rates
    a_wins_query = select(func.count(PairwiseComparison.id)).where(
        PairwiseComparison.is_reviewed == True,
        PairwiseComparison.chosen_id == "candidate_a"
    )
    b_wins_query = select(func.count(PairwiseComparison.id)).where(
        PairwiseComparison.is_reviewed == True,
        PairwiseComparison.chosen_id == "candidate_b"
    )
    
    a_wins = (await db.execute(a_wins_query)).scalar() or 0
    b_wins = (await db.execute(b_wins_query)).scalar() or 0
    
    a_win_rate = (a_wins / total_reviewed) if total_reviewed > 0 else 0.5
    b_win_rate = (b_wins / total_reviewed) if total_reviewed > 0 else 0.5

    # Collect micro-tag frequency
    reviewed_pairs = await get_all_reviewed_pairs(db, limit=200)
    tag_counts: Dict[str, int] = {}
    for p in reviewed_pairs:
        if p.micro_tags:
            for tag in p.micro_tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

    return {
        "total_reviewed": total_reviewed,
        "total_pending": total_pending,
        "a_win_rate": round(a_win_rate, 3),
        "b_win_rate": round(b_win_rate, 3),
        "a_wins": a_wins,
        "b_wins": b_wins,
        "tag_counts": tag_counts,
    }


async def create_post_log(
    db: AsyncSession,
    content: str,
    platform: str,
    scheduled_time: datetime,
    jitter_seconds: float,
) -> PostLog:
    log = PostLog(
        content=content,
        platform=platform,
        status="SCHEDULED",
        scheduled_time=scheduled_time,
        jitter_seconds_applied=jitter_seconds,
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log


async def get_recent_posts(db: AsyncSession, limit: int = 10) -> List[PostLog]:
    query = select(PostLog).order_by(desc(PostLog.created_at)).limit(limit)
    result = await db.execute(query)
    return list(result.scalars().all())
