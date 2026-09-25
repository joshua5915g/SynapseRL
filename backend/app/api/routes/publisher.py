from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db
from app.models.telemetry import SchedulePublishRequest, SchedulePublishResponse
from app.services.stealth_publisher import StealthPublisherService
from app.db import crud

router = APIRouter(prefix="/publish", tags=["Stealth Publisher"])


@router.post("/schedule", response_model=SchedulePublishResponse)
async def schedule_stealth_post(
    payload: SchedulePublishRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Schedules post publishing applying randomized Gaussian jitter
    to avoid bot detection and algorithmic shadow-banning.
    """
    scheduled_time, jitter_seconds = StealthPublisherService.calculate_jittered_schedule(
        preferred_hour_offset=payload.preferred_hour_offset
    )
    risk_score = StealthPublisherService.calculate_anti_ban_risk_score(jitter_seconds)

    post_log = await crud.create_post_log(
        db=db,
        content=payload.post_content,
        platform=payload.platform,
        scheduled_time=scheduled_time,
        jitter_seconds=jitter_seconds,
    )

    return SchedulePublishResponse(
        status="SCHEDULED_WITH_JITTER",
        post_id=post_log.id,
        scheduled_time=scheduled_time.isoformat(),
        jitter_seconds_applied=jitter_seconds,
        anti_ban_risk_score=risk_score,
    )
