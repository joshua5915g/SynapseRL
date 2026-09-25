from typing import List


class RewardCalculatorService:
    """
    Computes heuristic reward delta based on human confidence, dwell time,
    and micro-tag penalties.
    """

    TAG_PENALTIES = {
        "too_corporate": -0.25,
        "weak_hook": -0.30,
        "hallucination": -0.50,
        "clunky_cta": -0.15,
        "too_wordy": -0.20,
        "high_signal": 0.40,
        "viral_potential": 0.50,
        "actionable": 0.35,
    }

    @classmethod
    def calculate_reward_delta(
        cls,
        chosen_id: str,
        confidence_rating: int,
        dwell_time_ms: int,
        micro_tags: List[str],
    ) -> float:
        if chosen_id == "tie":
            return 0.0

        # Base confidence scalar: 1 to 5 maps to 0.2 to 1.0
        confidence_scalar = confidence_rating / 5.0
        
        # Dwell time bonus (reader engaged longer than 3s)
        dwell_bonus = 0.1 if dwell_time_ms > 3000 else 0.0
        
        # Micro-tag adjustments
        tag_modifier = sum(cls.TAG_PENALTIES.get(tag, 0.0) for tag in micro_tags)
        
        base_reward = 0.5 * confidence_scalar + dwell_bonus + tag_modifier
        return round(max(-1.0, min(1.0, base_reward)), 3)
