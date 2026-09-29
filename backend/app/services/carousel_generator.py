"""LinkedIn Document Carousel & Slide Deck Generator Service.

Transforms B2B thought-leadership articles into high-retention 4:5 vertical
slide decks optimized for LinkedIn document uploads (which drive 3-5x dwell time).
"""

from typing import List, Dict, Any
import re

def _clean_text(text: str) -> str:
    # Strip markdown bold/italic tags for cleaner slide titles
    cleaned = re.sub(r'[*_#`]', '', text)
    return cleaned.strip()

def decompose_into_slides(topic: str, content: str) -> List[Dict[str, Any]]:
    """
    Deconstructs a post into 5-6 structured carousel cards:
    1. Cover / Hook Card
    2. The Problem / Industry Trap
    3. The Paradigm Shift
    4. Implementation Mechanics
    5. Action Checklist
    6. Discussion & CTA
    """
    lines = [l.strip() for l in content.split("\n") if l.strip()]
    hook = lines[0] if lines else f"Why {topic} is broken"
    body_paragraphs = lines[1:] if len(lines) > 1 else lines

    # Try to extract key takeaways or bullet points
    bullets = [l for l in body_paragraphs if l.startswith(("-", "•", "1.", "2.", "3.", "4.", "5."))]
    non_bullets = [l for l in body_paragraphs if not l.startswith(("-", "•", "1.", "2.", "3.", "4.", "5."))]

    problem_text = non_bullets[0] if len(non_bullets) > 0 else "Conventional industry playbooks prioritize superficial metrics over real technical resilience."
    framework_text = non_bullets[1] if len(non_bullets) > 1 else (non_bullets[0] if non_bullets else "Adopt automated feedback loops and zero-fluff validation.")
    mechanics_text = non_bullets[2] if len(non_bullets) > 2 else "Enforce strict isolation, verify telemetry at runtime, and eliminate manual drift."

    checklist_items = []
    if bullets:
        checklist_items = [_clean_text(b) for b in bullets[:4]]
    else:
        checklist_items = [
            "Audit silent assumptions before writing code",
            "Replace static heuristics with empirical telemetry",
            "Enforce adversarial red-teaming in your review cycle",
            "Track high-signal metrics over vanity engagement"
        ]

    slides = [
        {
            "slide_number": 1,
            "type": "cover",
            "badge": "EXECUTIVE ARCHITECTURE BRIEF",
            "title": _clean_text(hook),
            "subtitle": f"A tactical deep-dive into {topic} for engineering leaders.",
            "footer": "Swipe to explore ➔"
        },
        {
            "slide_number": 2,
            "type": "problem",
            "badge": "THE ROOT FAILURE MODE",
            "title": "The Industry Trap",
            "content": _clean_text(problem_text),
            "footer": "Why legacy approaches crumble at scale"
        },
        {
            "slide_number": 3,
            "type": "framework",
            "badge": "PARADIGM SHIFT",
            "title": "The Mental Model",
            "content": _clean_text(framework_text),
            "footer": "Step 1: Invert the system architecture"
        },
        {
            "slide_number": 4,
            "type": "mechanics",
            "badge": "PRODUCTION PLAYBOOK",
            "title": "Core Mechanics",
            "content": _clean_text(mechanics_text),
            "footer": "Tactical execution principles"
        },
        {
            "slide_number": 5,
            "type": "checklist",
            "badge": "HIGH-CONVICTION CHECKLIST",
            "title": "The 4-Point Audit",
            "items": checklist_items,
            "footer": "Immediate action items for your team"
        },
        {
            "slide_number": 6,
            "type": "cta",
            "badge": "EXECUTIVE FORUM",
            "title": "Where does your stack sit?",
            "content": f"How is your engineering team tackling {topic}? Drop your thoughts or architecture challenges in the comments below.",
            "footer": "Follow for daily high-conviction systems insights"
        }
    ]

    return slides

def generate_carousel_html(topic: str, slides: List[Dict[str, Any]], theme: str = "stealth") -> str:
    """
    Generates a print-ready HTML page styled for 1080x1350 4:5 vertical LinkedIn document carousels.
    Can be printed directly to PDF with zero margin to create LinkedIn Carousel documents.
    """
    # Themes
    theme_styles = {
        "stealth": {
            "bg": "#090d16",
            "card_bg": "#0f172a",
            "border": "#1e293b",
            "primary": "#38bdf8",
            "badge": "#0284c7",
            "text": "#f8fafc",
            "subtext": "#94a3b8"
        },
        "emerald": {
            "bg": "#06130e",
            "card_bg": "#0c2017",
            "border": "#134e38",
            "primary": "#34d399",
            "badge": "#059669",
            "text": "#f0fdf4",
            "subtext": "#86efac"
        },
        "indigo": {
            "bg": "#0a0a1f",
            "card_bg": "#121235",
            "border": "#2c2a63",
            "primary": "#818cf8",
            "badge": "#4f46e5",
            "text": "#f5f3ff",
            "subtext": "#a5b4fc"
        }
    }
    t = theme_styles.get(theme, theme_styles["stealth"])

    slides_html = ""
    for s in slides:
        items_html = ""
        if "items" in s and s["items"]:
            items_html = "<ul style='margin-top: 24px; padding-left: 20px; line-height: 1.8;'>" + "".join(
                f"<li style='margin-bottom: 12px; font-size: 20px; color: {t['text']};'><strong>✓</strong> {it}</li>"
                for it in s["items"]
            ) + "</ul>"

        content_html = f"<p style='font-size: 22px; line-height: 1.6; color: {t['text']}; margin-top: 24px;'>{s.get('content', '')}</p>" if s.get("content") else ""
        subtitle_html = f"<p style='font-size: 22px; line-height: 1.5; color: {t['subtext']}; margin-top: 16px;'>{s.get('subtitle', '')}</p>" if s.get("subtitle") else ""

        slides_html += f"""
        <div class="slide">
            <div class="slide-inner">
                <div class="header">
                    <span class="badge">{s['badge']}</span>
                    <span class="page-num">{s['slide_number']} / {len(slides)}</span>
                </div>
                <div class="body">
                    <h2 class="title">{s['title']}</h2>
                    {subtitle_html}
                    {content_html}
                    {items_html}
                </div>
                <div class="footer">
                    <span class="brand">SYNAPSE<span style="color: {t['primary']}">RL</span></span>
                    <span class="footer-note">{s['footer']}</span>
                </div>
            </div>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{topic} - LinkedIn Carousel Deck</title>
    <style>
        @page {{
            size: 1080px 1350px;
            margin: 0;
        }}
        * {{
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }}
        body {{
            background-color: {t['bg']};
            color: {t['text']};
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }}
        .slide {{
            width: 1080px;
            height: 1350px;
            page-break-after: always;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 80px;
            background: radial-gradient(circle at top right, {t['card_bg']}, {t['bg']});
        }}
        .slide-inner {{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border: 2px solid {t['border']};
            border-radius: 36px;
            padding: 70px;
            background: {t['card_bg']};
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .badge {{
            background: {t['badge']};
            color: #ffffff;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 2px;
            padding: 8px 18px;
            border-radius: 9999px;
            text-transform: uppercase;
        }}
        .page-num {{
            font-size: 16px;
            font-weight: 700;
            color: {t['subtext']};
            font-family: monospace;
        }}
        .body {{
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 40px 0;
        }}
        .title {{
            font-size: 44px;
            font-weight: 800;
            line-height: 1.25;
            letter-spacing: -0.02em;
            color: {t['text']};
        }}
        .footer {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid {t['border']};
            padding-top: 28px;
        }}
        .brand {{
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
        }}
        .footer-note {{
            font-size: 16px;
            color: {t['subtext']};
            font-weight: 500;
        }}
    </style>
</head>
<body>
    {slides_html}
</body>
</html>
"""
    return html
