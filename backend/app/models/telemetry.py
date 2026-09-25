from typing import List, Dict
from pydantic import BaseModel


class TimeSeriesPoint(BaseModel):
    timestamp: str
    reward_score: float
    impressions: int
    engagement_rate: float


class TelemetryMetricsResponse(BaseModel):
    total_reviewed: int
    total_pending: int
    a_win_rate: float
    b_win_rate: float
    mean_reward_score: float
    tag_distribution: Dict[str, int]
    reward_curve: List[TimeSeriesPoint]
    system_status: str


class SchedulePublishRequest(BaseModel):
    post_content: str
    platform: str = "LinkedIn"
    preferred_hour_offset: int = 1


class SchedulePublishResponse(BaseModel):
    status: str
    post_id: str
    scheduled_time: str
    jitter_seconds_applied: float
    anti_ban_risk_score: str
