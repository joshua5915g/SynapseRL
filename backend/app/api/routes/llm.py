from fastapi import APIRouter
from app.services.llm_provider import AVAILABLE_PROVIDERS
import os

router = APIRouter(prefix="/llm", tags=["LLM Configuration"])

@router.get("/providers")
async def get_providers():
    """
    Returns list of supported LLM providers and whether API keys are detected.
    """
    updated_providers = []
    for p in AVAILABLE_PROVIDERS:
        configured = False
        if p["id"] == "simulation":
            configured = True
        elif p["id"] == "openai":
            configured = bool(os.getenv("OPENAI_API_KEY"))
        elif p["id"] == "anthropic":
            configured = bool(os.getenv("ANTHROPIC_API_KEY"))
        elif p["id"] == "gemini":
            configured = bool(os.getenv("GEMINI_API_KEY"))
        elif p["id"] == "ollama":
            configured = True

        updated_providers.append({
            **p,
            "is_configured": configured,
        })
    return {"status": "success", "providers": updated_providers}
