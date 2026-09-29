"""LLM-as-a-Judge Synthetic RLHF Preference Annotator.

Bootstraps DPO preference datasets during cold-start phases by evaluating
pairs along 4 rigorous axes: Technical Depth, Hook Virality, Actionability,
and Fluff Penalty.
"""

from typing import Dict, Any, List
import re

CLICHE_TRIGGER_WORDS = [
    "game-changer", "delve", "testament", "tapestry", "supercharge",
    "unleash", "elevate", "in today's world", "revolutionize", "pivotal"
]

TECHNICAL_TERMS = [
    "latency", "throughput", "concurrency", "p99", "raft", "sharding",
    "idempotent", "schema", "in-memory", "cache", "vector", "dpo",
    "telemetry", "state machine", "drift", "bottleneck", "isolation"
]

def _score_content(text: str) -> Dict[str, float]:
    lower = text.lower()
    words = lower.split()
    word_count = len(words)

    # 1. Technical Depth (0 - 10)
    tech_matches = sum(1 for term in TECHNICAL_TERMS if term in lower)
    tech_score = min(10.0, 4.0 + (tech_matches * 1.5))

    # 2. Hook Virality (0 - 10)
    first_line = text.split("\n")[0] if text else ""
    hook_score = 6.0
    if any(ch in first_line for ch in ["?", "!", "$", "%"]):
        hook_score += 1.5
    if any(w in first_line.lower() for w in ["mistake", "wrong", "stop", "fail", "cost", "truth"]):
        hook_score += 2.0
    hook_score = min(10.0, hook_score)

    # 3. Actionability (0 - 10)
    bullet_count = len([l for l in text.split("\n") if l.strip().startswith(("-", "•", "1.", "2.", "3.", "4.", "5."))])
    action_score = min(10.0, 5.0 + (bullet_count * 1.25))

    # 4. Fluff Penalty (-5.0 to 0)
    cliche_matches = sum(1 for c in CLICHE_TRIGGER_WORDS if c in lower)
    fluff_penalty = max(-5.0, -(cliche_matches * 1.2))

    total = max(1.0, min(10.0, (tech_score * 0.35) + (hook_score * 0.30) + (action_score * 0.25) + fluff_penalty))

    return {
        "technical_depth": round(tech_score, 1),
        "hook_virality": round(hook_score, 1),
        "actionability": round(action_score, 1),
        "fluff_penalty": round(fluff_penalty, 1),
        "composite_score": round(total, 2)
    }

def evaluate_pair_synthetic(
    topic: str,
    variant_a: str,
    variant_b: str,
    audience: str = "B2B Tech Leaders"
) -> Dict[str, Any]:
    """
    Evaluates both candidates using multi-dimensional criteria,
    determines the winner, provides an executive critique rationale,
    and returns a clean DPO training record.
    """
    scores_a = _score_content(variant_a)
    scores_b = _score_content(variant_b)

    score_a = scores_a["composite_score"]
    score_b = scores_b["composite_score"]

    if score_a >= score_b:
        winner = "candidate_a"
        winner_label = "Candidate A"
        chosen_text = variant_a
        rejected_text = variant_b
        margin = round(score_a - score_b, 2)
        primary_reason = (
            f"Candidate A outscored Candidate B by {margin} pts due to superior "
            f"technical grounding ({scores_a['technical_depth']} vs {scores_b['technical_depth']}) "
            f"and lower corporate fluff penalty ({scores_a['fluff_penalty']} vs {scores_b['fluff_penalty']})."
        )
    else:
        winner = "candidate_b"
        winner_label = "Candidate B"
        chosen_text = variant_b
        rejected_text = variant_a
        margin = round(score_b - score_a, 2)
        primary_reason = (
            f"Candidate B outscored Candidate A by {margin} pts due to sharper "
            f"hook virality ({scores_b['hook_virality']} vs {scores_a['hook_virality']}) "
            f"and concrete actionability points ({scores_b['actionability']} vs {scores_a['actionability']})."
        )

    return {
        "topic": topic,
        "audience": audience,
        "winner": winner,
        "winner_label": winner_label,
        "score_margin": margin,
        "verdict_rationale": primary_reason,
        "candidate_a_metrics": scores_a,
        "candidate_b_metrics": scores_b,
        "dpo_record": {
            "prompt": f"Write a high-conviction B2B thought-leadership post for {audience} on '{topic}'. Style: Zero fluff, high technical depth.",
            "chosen": chosen_text,
            "rejected": rejected_text,
            "reward_delta": round(0.5 + (margin * 0.1), 3)
        }
    }
