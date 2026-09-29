import re
from typing import Dict, Any, List, Optional
from app.services.llm_provider import generate_completion

CURIOSITY_TRIGGERS = [
    "mistake", "why", "secret", "never", "nobody talks about", "truth", 
    "unpopular opinion", "framework", "blueprint", "warning", "stealth",
    "hidden", "expensive", "stop", "myth", "real reason"
]

PAIN_TRIGGERS = [
    "fail", "loss", "burn", "waste", "danger", "broken", "cost", "risk",
    "stuck", "frustrat", "slow", "bottleneck", "debt", "crisis"
]

NUMBER_PATTERN = re.compile(r'(\d+[\.,]?\d*|\$\d+[kKmMbB]?|\d+x|\d+%)')

def calculate_hook_score(hook_text: str) -> Dict[str, Any]:
    """
    Computes an empirical 0-100 Virality Score for LinkedIn/X opening hooks.
    """
    text = (hook_text or "").strip()
    if not text:
        return {
            "score": 0,
            "grade": "F",
            "breakdown": {"curiosity": 0, "specificity": 0, "brevity": 0, "urgency": 0},
            "suggestions": ["Add a strong opening sentence."]
        }

    first_line = text.split("\n")[0].strip()
    words = first_line.split()
    word_count = len(words)
    char_count = len(first_line)
    lower = first_line.lower()

    # 1. Curiosity Gap (0-25)
    curiosity_matches = [w for w in CURIOSITY_TRIGGERS if w in lower]
    curiosity_score = min(25, len(curiosity_matches) * 12)

    # 2. Specificity & Numeric Anchors (0-25)
    num_matches = NUMBER_PATTERN.findall(first_line)
    specificity_score = min(25, len(num_matches) * 14)

    # 3. Brevity & LinkedIn 'See More' Cliffhanger (0-25)
    # Ideal hook is 8 to 22 words and under 130 chars
    if 8 <= word_count <= 22 and char_count <= 130:
        brevity_score = 25
    elif word_count < 8:
        brevity_score = 15
    elif word_count <= 30:
        brevity_score = 18
    else:
        brevity_score = 8

    # 4. Urgency & Pain-Point Polarity (0-25)
    pain_matches = [w for w in PAIN_TRIGGERS if w in lower]
    urgency_score = min(25, len(pain_matches) * 12)

    # Total Score
    total_score = min(100, curiosity_score + specificity_score + brevity_score + urgency_score)
    # Baseline floor for readable text
    if total_score < 40 and word_count >= 5:
        total_score = 45

    if total_score >= 85:
        grade = "S"
    elif total_score >= 75:
        grade = "A"
    elif total_score >= 60:
        grade = "B"
    elif total_score >= 45:
        grade = "C"
    else:
        grade = "D"

    suggestions = []
    if not num_matches:
        suggestions.append("Add a concrete numeric proof anchor (e.g. '$200k', '4.2x', '90%').")
    if not curiosity_matches:
        suggestions.append("Introduce an intellectual tension word ('mistake', 'why', 'unpopular opinion').")
    if char_count > 130:
        suggestions.append("Keep the first sentence under 130 characters so it fits before the LinkedIn '...see more' fold.")
    if not pain_matches:
        suggestions.append("Sharpen the stakes: mention what is wasted or at risk if ignored.")

    return {
        "score": total_score,
        "grade": grade,
        "first_line": first_line,
        "char_count": char_count,
        "word_count": word_count,
        "breakdown": {
            "curiosity": curiosity_score,
            "specificity": specificity_score,
            "brevity": brevity_score,
            "urgency": urgency_score,
        },
        "suggestions": suggestions,
    }


async def generate_alternative_hooks(
    topic: str,
    draft: Optional[str] = None,
    provider: str = "simulation"
) -> List[Dict[str, Any]]:
    """
    Generates 5 distinct viral hook archetypes with pre-calculated scores.
    """
    clean_topic = topic.strip() if topic else "Modern Systems"
    
    # Template archetypes
    archetypes = [
        {
            "archetype": "Contrarian Dollar Metric",
            "hook": f"Most teams scaling {clean_topic} are making a $200k architectural mistake before writing line 1.",
        },
        {
            "archetype": "Counter-Intuitive Truth",
            "hook": f"Unpopular opinion: 90% of what is published about {clean_topic} on LinkedIn is cargo-cult engineering.",
        },
        {
            "archetype": "Empirical Proof",
            "hook": f"We reduced failure rates by 74% when benchmarking {clean_topic}. Here is the exact 3-step breakdown:",
        },
        {
            "archetype": "The Executive Warning",
            "hook": f"If your engineering leadership is deploying {clean_topic} this quarter, stop and review this first.",
        },
        {
            "archetype": "Curiosity Cliffhanger",
            "hook": f"Why do top 1% systems engineers build {clean_topic} completely differently from everyone else?",
        },
    ]

    results = []
    for item in archetypes:
        metrics = calculate_hook_score(item["hook"])
        results.append({
            "archetype": item["archetype"],
            "hook": item["hook"],
            "score": metrics["score"],
            "grade": metrics["grade"],
            "breakdown": metrics["breakdown"],
        })

    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results
