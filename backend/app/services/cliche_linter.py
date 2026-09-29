import re
from typing import Dict, Any, List

AI_CLICHE_RULES = [
    {"pattern": r"\bdelve\b", "phrase": "delve", "suggestion": "explore / analyze / examine", "severity": "HIGH"},
    {"pattern": r"\btapestry\b", "phrase": "tapestry", "suggestion": "system / complex landscape", "severity": "HIGH"},
    {"pattern": r"\btestament\b", "phrase": "testament", "suggestion": "proof / evidence", "severity": "HIGH"},
    {"pattern": r"\bgame[- ]changer\b", "phrase": "game-changer", "suggestion": "fundamental shift / high-leverage fix", "severity": "HIGH"},
    {"pattern": r"in today'?s (fast-paced|dynamic|rapidly evolving) world", "phrase": "in today's fast-paced world", "suggestion": "delete completely; start directly with the problem", "severity": "HIGH"},
    {"pattern": r"\bwithout further ado\b", "phrase": "without further ado", "suggestion": "delete opening filler", "severity": "HIGH"},
    {"pattern": r"\brevolutionize\b", "phrase": "revolutionize", "suggestion": "improve / automate / speed up", "severity": "MEDIUM"},
    {"pattern": r"\btransformative\b", "phrase": "transformative", "suggestion": "effective / high-ROI", "severity": "MEDIUM"},
    {"pattern": r"\bunlock(ing)?\b", "phrase": "unlock", "suggestion": "enabling / achieving", "severity": "MEDIUM"},
    {"pattern": r"\bfoster(ing)?\b", "phrase": "foster", "suggestion": "build / scale / encourage", "severity": "MEDIUM"},
    {"pattern": r"\bsynergy\b", "phrase": "synergy", "suggestion": "alignment / joint efficiency", "severity": "HIGH"},
    {"pattern": r"\bthrilled to announce\b", "phrase": "thrilled to announce", "suggestion": "delete self-congratulatory opener", "severity": "HIGH"},
    {"pattern": r"\bhumbled and honored\b", "phrase": "humbled and honored", "suggestion": "state facts without virtue-signaling", "severity": "HIGH"},
    {"pattern": r"\bmove the needle\b", "phrase": "move the needle", "suggestion": "drive 15%+ conversion / increase revenue", "severity": "LOW"},
    {"pattern": r"\bat the end of the day\b", "phrase": "at the end of the day", "suggestion": "ultimately / the core takeaway is", "severity": "LOW"},
    {"pattern": r"\bdouble down\b", "phrase": "double down", "suggestion": "reinvest / focus resources", "severity": "LOW"},
    {"pattern": r"\bcircle back\b", "phrase": "circle back", "suggestion": "follow up / revisit", "severity": "LOW"},
    {"pattern": r"\brealm\b", "phrase": "realm", "suggestion": "domain / sector / discipline", "severity": "MEDIUM"},
    {"pattern": r"\bbeacon\b", "phrase": "beacon", "suggestion": "standard / benchmark", "severity": "MEDIUM"},
]

EMOJI_PATTERN = re.compile(r'[\U00010000-\U0010ffff]', flags=re.UNICODE)

def audit_content_authenticity(text: str) -> Dict[str, Any]:
    """
    Scans text for AI buzzwords, corporate cringe tropes, and computes Human Authenticity Index.
    """
    clean_text = text or ""
    detected = []
    penalty = 0

    lower_text = clean_text.lower()
    for rule in AI_CLICHE_RULES:
        matches = list(re.finditer(rule["pattern"], lower_text, flags=re.IGNORECASE))
        if matches:
            weight = 15 if rule["severity"] == "HIGH" else 8 if rule["severity"] == "MEDIUM" else 4
            penalty += weight * len(matches)
            detected.append({
                "phrase": rule["phrase"],
                "occurrences": len(matches),
                "severity": rule["severity"],
                "suggestion": rule["suggestion"],
            })

    # Count emojis
    emojis = EMOJI_PATTERN.findall(clean_text)
    emoji_count = len(emojis)
    if emoji_count > 4:
        penalty += (emoji_count - 4) * 5

    authenticity_score = max(10, 100 - penalty)
    
    if authenticity_score >= 90:
        grade = "S (Human-Crafted)"
        status = "AUTHENTIC"
    elif authenticity_score >= 75:
        grade = "A (Low Fluff)"
        status = "PASS"
    elif authenticity_score >= 60:
        grade = "B (Mild AI Tropes)"
        status = "WARNING"
    else:
        grade = "F (High Corporate Cringe)"
        status = "CRINGE_ALERT"

    # Surgical De-fluff rewrite
    de_fluffed = clean_text
    for rule in AI_CLICHE_RULES:
        if rule["severity"] == "HIGH":
            # Replace high severity cliches with cleaner synonyms
            sub_target = rule["suggestion"].split(" / ")[0]
            if "delete" in sub_target.lower():
                de_fluffed = re.sub(rule["pattern"], "", de_fluffed, flags=re.IGNORECASE)
            else:
                de_fluffed = re.sub(rule["pattern"], sub_target, de_fluffed, flags=re.IGNORECASE)

    # Clean up double spaces caused by deletion
    de_fluffed = re.sub(r'  +', ' ', de_fluffed).strip()

    return {
        "authenticity_score": authenticity_score,
        "grade": grade,
        "status": status,
        "cliches_detected": detected,
        "total_cliches": len(detected),
        "emoji_count": emoji_count,
        "de_fluffed_text": de_fluffed,
    }
