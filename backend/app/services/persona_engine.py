from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class GhostwriterPersona(BaseModel):
    id: str
    name: str
    role_title: str
    bio: str
    tone_characteristics: List[str]
    preferred_keywords: List[str]
    forbidden_words: List[str]
    hook_archetype: str
    signature_cta: str
    is_custom: bool = False

PRESET_PERSONAS: List[GhostwriterPersona] = [
    GhostwriterPersona(
        id="contrarian_vc",
        name="The Contrarian VC",
        role_title="General Partner @ Frontier Fund",
        bio="Challenges consensus assumptions, focuses on asymmetric leverage, unit economics, and capital efficiency.",
        tone_characteristics=["Provocative", "High-conviction", "Analytical", "Direct"],
        preferred_keywords=["Asymmetry", "Moat", "Capital efficiency", "Consensus trap", "Power law"],
        forbidden_words=["Thrilled to announce", "Humbled", "In today's fast-paced world", "Synergy"],
        hook_archetype="Dollar-value loss or consensus myth debunking",
        signature_cta="What is your highest-conviction bet this quarter?",
        is_custom=False,
    ),
    GhostwriterPersona(
        id="systems_architect",
        name="The Deep-Tech Systems Architect",
        role_title="Principal Staff Distributed Systems Engineer",
        bio="Engineering purist obsessed with deterministic pipelines, p99 latencies, and zero silent state drift.",
        tone_characteristics=["Technical", "Architectural", "Zero-fluff", "Structured"],
        preferred_keywords=["State drift", "Idempotency", "Pydantic sandboxing", "Deterministic execution", "Failure modes"],
        forbidden_words=["Game-changer", "Revolutionary", "Paradigm shift", "Delve into"],
        hook_archetype="Production post-mortem or multi-layer architectural blueprint",
        signature_cta="Where is your biggest state bottleneck in production today?",
        is_custom=False,
    ),
    GhostwriterPersona(
        id="hypergrowth_cmo",
        name="The Hyper-Growth B2B CMO",
        role_title="Chief Marketing & Growth Officer",
        bio="Laser-focused on pipeline velocity, distribution moats, buyer psychology, and dark social loops.",
        tone_characteristics=["Energetic", "Strategic", "Metric-driven", "Audience-first"],
        preferred_keywords=["Distribution flywheel", "Pipeline velocity", "Buyer friction", "Category creation", "Dwell time"],
        forbidden_words=["Excited to share", "Please like and share", "Thought leadership piece"],
        hook_archetype="Shocking pipeline conversion metric vs conventional belief",
        signature_cta="How are you fixing your buyer friction before Q4?",
        is_custom=False,
    ),
    GhostwriterPersona(
        id="bootstrapped_builder",
        name="The Bootstrapped SaaS Builder",
        role_title="Solo Founder & Systems Engineer",
        bio="Radical transparency, real revenue metrics, cash-flow discipline, and aggressive shipping velocity.",
        tone_characteristics=["Raw", "Authentic", "Pragmatic", "Concise"],
        preferred_keywords=["Cash-flow positive", "Zero VC hype", "Ship in 48h", "Customer-funded", "Real margins"],
        forbidden_words=["Series A announcement", "Unicorn", "Blitzscaling"],
        hook_archetype="Real numbers, transparent revenue breakdown, hard lessons",
        signature_cta="Bookmark this if you are building without outside capital.",
        is_custom=False,
    ),
]

# In-memory store for custom created personas
_custom_personas_store: Dict[str, GhostwriterPersona] = {}

def get_all_personas() -> List[GhostwriterPersona]:
    """
    Returns presets and any runtime custom personas.
    """
    return PRESET_PERSONAS + list(_custom_personas_store.values())

def get_persona_by_id(persona_id: str) -> Optional[GhostwriterPersona]:
    for p in PRESET_PERSONAS:
        if p.id == persona_id:
            return p
    return _custom_personas_store.get(persona_id)

def create_custom_persona(data: Dict[str, Any]) -> GhostwriterPersona:
    p_id = data.get("id") or ("custom_" + data.get("name", "persona").lower().replace(" ", "_"))
    persona = GhostwriterPersona(
        id=p_id,
        name=data.get("name", "Custom Ghostwriter"),
        role_title=data.get("role_title", "Thought Leader"),
        bio=data.get("bio", "Custom voice profile"),
        tone_characteristics=data.get("tone_characteristics", ["Conviction", "Clarity"]),
        preferred_keywords=data.get("preferred_keywords", []),
        forbidden_words=data.get("forbidden_words", []),
        hook_archetype=data.get("hook_archetype", "Contrarian hook"),
        signature_cta=data.get("signature_cta", "Let me know your thoughts in the comments."),
        is_custom=True,
    )
    _custom_personas_store[p_id] = persona
    return persona

def build_persona_guidance(persona_id: str, custom_tone: Optional[str] = None) -> str:
    """
    Translates a persona profile into concrete system prompt guidance for SME/Hacker agents.
    """
    persona = get_persona_by_id(persona_id)
    if not persona:
        return custom_tone or "High conviction B2B thought leadership"

    guidance = (
        f"Adopt the persona of '{persona.name}' ({persona.role_title}). "
        f"Voice Profile: {persona.bio}. "
        f"Tone style: {', '.join(persona.tone_characteristics)}. "
        f"Preferred vocabulary to weave in naturally: {', '.join(persona.preferred_keywords)}. "
        f"FORBIDDEN WORDS (strictly avoid): {', '.join(persona.forbidden_words)}. "
        f"Preferred Hook Style: {persona.hook_archetype}. "
        f"Signature CTA closing: '{persona.signature_cta}'."
    )
    if custom_tone:
        guidance += f" Extra guidance: {custom_tone}"
    return guidance
