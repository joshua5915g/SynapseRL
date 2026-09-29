import random
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.models import PostLog, TelemetrySnapshot, PairwiseComparison

def compute_empirical_reward(
    impressions: int,
    reactions: int,
    comments: int,
    reposts: int,
    clicks: int
) -> float:
    """
    Computes a normalized empirical reward score (0.0 to 10.0) based on B2B LinkedIn algorithmic weights:
    - Comments: 4x weight (high algorithmic amplification signal)
    - Reposts: 6x weight (reach exponent)
    - Clicks/Dwell: 2x weight (dwell retention)
    - Reactions: 1.5x weight
    """
    if impressions <= 0:
        return 0.0

    raw_engagement_score = (
        (reactions * 1.5) +
        (comments * 4.0) +
        (reposts * 6.0) +
        (clicks * 2.0)
    )
    engagement_rate = (raw_engagement_score / impressions) * 100.0
    # Normalize typical LinkedIn engagement rates (2% - 8%) into 0-10 scale
    normalized_reward = round(min(10.0, max(0.5, (engagement_rate / 6.0) * 10.0)), 2)
    return normalized_reward


async def ingest_post_telemetry(
    db: AsyncSession,
    post_id: str,
    impressions: int,
    reactions: int,
    comments: int,
    reposts: int,
    clicks: int
) -> Dict[str, Any]:
    """
    Ingests actual metrics for a published post and updates the reward model.
    """
    stmt = select(PostLog).where(PostLog.id == post_id)
    result = await db.execute(stmt)
    post = result.scalars().first()

    if not post:
        # Create an entry if missing
        post = PostLog(
            id=post_id,
            content="[Ingested Post Content]",
            status="PUBLISHED",
            published_time=datetime.utcnow(),
        )
        db.add(post)

    post.impressions = impressions
    post.reactions = reactions
    post.shares = reposts
    post.clicks = clicks
    post.calculated_reward = compute_empirical_reward(impressions, reactions, comments, reposts, clicks)
    post.status = "PUBLISHED"
    if not post.published_time:
        post.published_time = datetime.utcnow()

    await db.commit()
    await db.refresh(post)

    return {
        "post_id": post.id,
        "impressions": post.impressions,
        "reactions": post.reactions,
        "reposts": post.shares,
        "clicks": post.clicks,
        "calculated_reward": post.calculated_reward,
        "status": post.status,
    }


async def simulate_audience_traffic(db: AsyncSession) -> Dict[str, Any]:
    """
    Simulates realistic organic B2B LinkedIn distribution across published/scheduled posts.
    """
    stmt = select(PostLog).order_by(desc(PostLog.created_at)).limit(10)
    result = await db.execute(stmt)
    posts = result.scalars().all()

    updated = []
    if not posts:
        # Seed 3 posts if none exist
        seed_topics = [
            "Adversarial Multi-Agent State Drift in Production",
            "Why Most Enterprise DPO Pipelines Fail",
            "The Death of Low-Effort B2B LinkedIn Thought Leadership"
        ]
        for topic in seed_topics:
            p = PostLog(
                content=f"Most teams building {topic} are making a $200k mistake before writing line 1.\n\nHere is our 3-layer architecture:",
                status="PUBLISHED",
                published_time=datetime.utcnow() - timedelta(hours=random.randint(2, 48)),
                jitter_seconds_applied=random.uniform(10.0, 45.0),
            )
            db.add(p)
            posts.append(p)
        await db.commit()

    for post in posts:
        impressions = random.randint(1200, 18500)
        reactions = int(impressions * random.uniform(0.015, 0.045))
        comments = int(impressions * random.uniform(0.005, 0.018))
        reposts = int(impressions * random.uniform(0.002, 0.009))
        clicks = int(impressions * random.uniform(0.01, 0.035))

        reward = compute_empirical_reward(impressions, reactions, comments, reposts, clicks)
        post.impressions = impressions
        post.reactions = reactions
        post.shares = reposts
        post.clicks = clicks
        post.calculated_reward = reward
        post.status = "PUBLISHED"

        updated.append({
            "id": post.id,
            "topic_preview": post.content[:60] + "...",
            "impressions": impressions,
            "reactions": reactions,
            "comments": comments,
            "reposts": reposts,
            "clicks": clicks,
            "empirical_reward": reward,
        })

    # Log telemetry snapshot
    avg_reward = round(sum(p["empirical_reward"] for p in updated) / len(updated), 2)
    snapshot = TelemetrySnapshot(
        mean_reward_score=avg_reward,
        cumulative_votes=len(updated) * 4,
        a_win_rate=0.62,
        b_win_rate=0.38,
        tag_distribution={"high_signal": 14, "technical_depth": 11, "strong_hook": 9},
    )
    db.add(snapshot)
    await db.commit()

    return {
        "status": "success",
        "posts_simulated": len(updated),
        "mean_empirical_reward": avg_reward,
        "items": updated,
    }
