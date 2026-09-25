import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, JSON, Boolean
from app.db.session import Base


class PreferencePair(Base):
    """
    Core Reinforcement Learning persistence model storing human preference votes
    and micro-tags from the Next.js A/B Swipe Arena for downstream DPO dataset generation.
    """
    __tablename__ = "preference_pairs"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    topic = Column(String(500), nullable=False)
    winning_text = Column(Text, nullable=False)
    losing_text = Column(Text, nullable=False)
    human_tags = Column(Text, nullable=True)  # JSON or comma-separated string
    created_at = Column(DateTime, default=datetime.utcnow)


class PairwiseComparison(Base):
    """
    Stores human preference decisions on pairs of AI-generated content.
    Provides direct serialization schema for Direct Preference Optimization (DPO).
    """
    __tablename__ = "pairwise_comparisons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    topic = Column(String(255), nullable=False)
    target_audience = Column(String(255), default="B2B Founders & Tech Leaders")
    
    candidate_a = Column(Text, nullable=False)
    candidate_b = Column(Text, nullable=False)
    
    # "candidate_a", "candidate_b", or "tie"
    chosen_id = Column(String(32), nullable=True)
    rejected_id = Column(String(32), nullable=True)
    
    chosen_content = Column(Text, nullable=True)
    rejected_content = Column(Text, nullable=True)
    
    # Micro-tags (e.g., ["too_corporate", "weak_hook", "hallucination"])
    micro_tags = Column(JSON, default=list)
    
    dwell_time_ms = Column(Integer, default=0)
    confidence_rating = Column(Integer, default=3)
    feedback_notes = Column(Text, nullable=True)
    
    # State tracking
    is_reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)


class PostLog(Base):
    """
    Stores finalized posts published or scheduled with stealth jitter.
    """
    __tablename__ = "post_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=False)
    platform = Column(String(50), default="LinkedIn")
    status = Column(String(50), default="SCHEDULED")  # SCHEDULED, PUBLISHED, FAILED
    
    scheduled_time = Column(DateTime, nullable=True)
    published_time = Column(DateTime, nullable=True)
    jitter_seconds_applied = Column(Float, default=0.0)
    
    # Live engagement tracking
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    reactions = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    calculated_reward = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class TelemetrySnapshot(Base):
    """
    Periodic snapshots of reward curves, win-rates, and micro-tag distributions.
    """
    __tablename__ = "telemetry_snapshots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    mean_reward_score = Column(Float, default=0.0)
    cumulative_votes = Column(Integer, default=0)
    a_win_rate = Column(Float, default=0.5)
    b_win_rate = Column(Float, default=0.5)
    tie_rate = Column(Float, default=0.0)
    
    tag_distribution = Column(JSON, default=dict)
