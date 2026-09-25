import random
import numpy as np
from datetime import datetime, timedelta
from typing import Tuple
from app.config import settings


class StealthPublisherService:
    """
    Simulates LinkedIn publishing queues with mathematical jitter (Gaussian/Poisson)
    to prevent repetitive bot cadence and avoid platform shadow-banning.
    """

    @staticmethod
    def calculate_jittered_schedule(preferred_hour_offset: int = 1) -> Tuple[datetime, float]:
        """
        Calculates execution time adding Box-Muller Gaussian jitter.
        """
        base_time = datetime.utcnow() + timedelta(hours=preferred_hour_offset)
        
        # Mean jitter from settings with standard deviation of 12 seconds
        mu = float(settings.STEALTH_JITTER_BASE_SECONDS)
        sigma = 12.0
        
        # Sample Gaussian jitter and clamp to positive values
        jitter_seconds = max(5.0, float(np.random.normal(loc=mu, scale=sigma)))
        jitter_seconds = min(jitter_seconds, float(settings.STEALTH_JITTER_MAX_SECONDS))
        
        scheduled_time = base_time + timedelta(seconds=jitter_seconds)
        return scheduled_time, round(jitter_seconds, 2)

    @staticmethod
    def calculate_anti_ban_risk_score(jitter_seconds: float) -> str:
        if jitter_seconds > 10.0:
            return "LOW (Optimal Evasion Profile)"
        elif jitter_seconds > 5.0:
            return "MODERATE"
        return "ELEVATED"
