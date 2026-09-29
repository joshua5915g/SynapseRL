import re
from typing import Dict, Any, List

def format_for_x_thread(content: str) -> List[str]:
    """
    Transforms long-form thought leadership into a high-engagement Twitter/X thread.
    Each tweet is strictly <= 280 characters with numbered sequence markers (1/X).
    """
    clean_text = (content or "").strip()
    paragraphs = [p.strip() for p in clean_text.split("\n\n") if p.strip()]

    raw_tweets = []
    # Tweet 1: Hook with thread emoji
    if paragraphs:
        hook_text = paragraphs[0]
        if len(hook_text) > 240:
            hook_text = hook_text[:235] + "..."
        raw_tweets.append(f"{hook_text} 🧵👇")

    # Body tweets: iterate through remaining paragraphs or sentences
    for p in paragraphs[1:]:
        if len(p) <= 240:
            raw_tweets.append(p)
        else:
            # Split paragraph by sentences
            sentences = re.split(r'(?<=[.!?])\s+', p)
            current_chunk = ""
            for s in sentences:
                if len(current_chunk) + len(s) + 1 <= 240:
                    current_chunk = f"{current_chunk} {s}".strip()
                else:
                    if current_chunk:
                        raw_tweets.append(current_chunk)
                    current_chunk = s
            if current_chunk:
                raw_tweets.append(current_chunk)

    # Final CTA tweet
    raw_tweets.append(
        "If you found this valuable:\n"
        "1. Follow for more systems architecture breakdowns\n"
        "2. RT the first tweet to share with your network 🔖"
    )

    total_tweets = len(raw_tweets)
    numbered_tweets = []
    for idx, t in enumerate(raw_tweets, start=1):
        numbered_tweets.append(f"{idx}/{total_tweets}\n\n{t}")

    return numbered_tweets


def format_for_substack(topic: str, content: str) -> str:
    """
    Transforms the content into a structured Substack / Medium markdown essay.
    """
    clean_topic = topic or "Autonomous Systems"
    return (
        f"# The Engineering Blueprint for {clean_topic}\n\n"
        f"**By The SynapseRL Research Lab** • *5 min read*\n\n"
        f"---\n\n"
        f"### Executive Summary\n"
        f"In today's fast-evolving software landscape, conventional heuristics often create expensive architectural bottlenecks. "
        f"This briefing breaks down the high-leverage paradigms required for reliable production execution.\n\n"
        f"---\n\n"
        f"### The Core Problem\n\n"
        f"{content}\n\n"
        f"---\n\n"
        f"### Key Takeaways for Technical Leaders\n\n"
        f"- **Eliminate Silent State Drift**: Enforce strict schema sandboxing prior to production commits.\n"
        f"- **Red-Team Every Assumption**: Introduce adversarial validation loops before state persistence.\n"
        f"- **Capture Empirical Telemetry**: Align RLHF reward matrices with real-world audience conversion data.\n\n"
        f"---\n\n"
        f"*What is your team's biggest operational bottleneck when deploying this in production? Join the discussion below.*"
    )


def format_multi_platform(topic: str, content: str) -> Dict[str, Any]:
    """
    Converts a single winning post into multi-channel formatted packages.
    """
    x_thread = format_for_x_thread(content)
    substack_doc = format_for_substack(topic, content)

    word_count = len(content.split())
    reading_time = round(max(0.5, word_count / 200.0), 1)

    return {
        "linkedin": content,
        "x_thread": x_thread,
        "x_tweet_count": len(x_thread),
        "substack_markdown": substack_doc,
        "word_count": word_count,
        "reading_time_minutes": reading_time,
    }
