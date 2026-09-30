"""
SynapseRL Algorithm Velocity Predictor & Dwell Heatmap Engine.
Simulates first-60-minute social platform distribution (LinkedIn/X),
detects mobile & desktop '...see more' fold drop-offs, and calculates dwell retention.
"""

import re
from typing import Dict, Any, List


class VelocityPredictorService:
    def __init__(self):
        self.mobile_fold_chars = 150
        self.desktop_fold_chars = 220

    def analyze_velocity(self, content: str) -> Dict[str, Any]:
        text = content.strip()
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        words = re.findall(r"\b[A-Za-z0-9'-]+\b", text)
        word_count = len(words)
        char_count = len(text)

        # 1. Fold Detection
        mobile_cutoff = min(self.mobile_fold_chars, char_count)
        desktop_cutoff = min(self.desktop_fold_chars, char_count)
        
        above_fold_mobile = text[:mobile_cutoff]
        above_fold_desktop = text[:desktop_cutoff]

        # 2. Hook Virality & Scroll-Stop Calculation
        hook_triggers = [
            "most", "never", "$", "%", "mistake", "secret", "why", "stop",
            "framework", "how", "revealed", "cut", "truth", "blueprint", "failed"
        ]
        first_line = lines[0] if lines else ""
        hook_matches = sum(1 for trigger in hook_triggers if trigger in first_line.lower())
        
        # Numbers or contrarian stats in first 2 lines
        has_stats = bool(re.search(r"\d+([.,]\d+)?(%|\$|x|k|M)?", first_line))
        
        scroll_stop_score = 65
        if hook_matches > 0:
            scroll_stop_score += min(hook_matches * 10, 25)
        if has_stats:
            scroll_stop_score += 10
        if len(first_line) < 90 and len(first_line) > 20:
            scroll_stop_score += 5
        scroll_stop_score = min(scroll_stop_score, 98)

        # 3. Dwell Friction & Readability
        # Paragraphs should be short (1-3 sentences) for mobile feeds
        long_paragraphs = [p for p in paragraphs if len(p.split(". ")) > 3 or len(p) > 280]
        dwell_penalty = len(long_paragraphs) * 6
        base_dwell = 88 - dwell_penalty
        dwell_retention_score = max(min(base_dwell, 96), 45)

        # 4. Comment & Debate Propensity
        question_marks = text.count("?")
        has_polarizing = any(w in text.lower() for w in ["agree", "disagree", "unpopular opinion", "thoughts", "what do you think", "versus", "myth"])
        comment_propensity = 55
        if question_marks > 0:
            comment_propensity += 20
        if has_polarizing:
            comment_propensity += 15
        comment_propensity = min(comment_propensity, 95)

        # 5. Composite Velocity Index (0-100)
        # Weighted: 40% Scroll Stop, 35% Dwell Retention, 25% Comment Propensity
        velocity_index = round(
            (scroll_stop_score * 0.40) + (dwell_retention_score * 0.35) + (comment_propensity * 0.25)
        )

        # 6. Paragraph Retention Curve
        retention_curve = []
        current_retention = 100
        for i, p in enumerate(paragraphs[:6]):
            decay = 12 if len(p) > 200 else 6
            current_retention = max(current_retention - decay, 35)
            retention_curve.append({
                "paragraph_index": i + 1,
                "preview": p[:60] + "..." if len(p) > 60 else p,
                "estimated_retention_pct": current_retention,
                "char_length": len(p)
            })

        # 7. Actionable Directives
        directives = []
        if len(first_line) > 130:
            directives.append("Shorten your opening hook below 90 characters to avoid getting cut off mid-sentence on iOS/Android.")
        if not has_stats:
            directives.append("Add a concrete metric or dollar impact in the first 2 lines to boost scroll-stop rate.")
        if long_paragraphs:
            directives.append(f"Split {len(long_paragraphs)} wall-of-text paragraph(s) into single-sentence punchy lines.")
        if question_marks == 0:
            directives.append("End with a specific, polarizing question to trigger the first-hour algorithm comment flywheel.")
        if not directives:
            directives.append("Optimal mobile cadence detected. Prime candidate for high velocity distribution.")

        return {
            "velocity_index": velocity_index,
            "scroll_stop_score": scroll_stop_score,
            "dwell_retention_score": dwell_retention_score,
            "comment_propensity": comment_propensity,
            "mobile_fold_char": mobile_cutoff,
            "desktop_fold_char": desktop_cutoff,
            "above_fold_mobile": above_fold_mobile,
            "above_fold_desktop": above_fold_desktop,
            "below_fold_text": text[desktop_cutoff:],
            "word_count": word_count,
            "estimated_read_time_sec": max(round(word_count / 3.8), 5),
            "retention_curve": retention_curve,
            "actionable_directives": directives,
            "algorithm_tier": (
                "Tier S (Exponential Velocity)" if velocity_index >= 88
                else "Tier A (High Distribution)" if velocity_index >= 75
                else "Tier B (Average Reach)" if velocity_index >= 60
                else "Tier C (High Drop-off Risk)"
            )
        }


velocity_service = VelocityPredictorService()
