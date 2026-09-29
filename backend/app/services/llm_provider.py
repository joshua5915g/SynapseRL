import os
import json
import logging
import asyncio
from typing import Optional, Dict, Any, List
import httpx
from app.config import settings

logger = logging.getLogger("SynapseRL.LLMProvider")

AVAILABLE_PROVIDERS = [
    {
        "id": "simulation",
        "name": "Deterministic Simulation (No API Key Required)",
        "models": ["synapse-adversarial-v1", "synapse-adversarial-fast"],
        "is_configured": True,
    },
    {
        "id": "openai",
        "name": "OpenAI",
        "models": ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
        "is_configured": bool(os.getenv("OPENAI_API_KEY")),
    },
    {
        "id": "anthropic",
        "name": "Anthropic Claude",
        "models": ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
        "is_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
    },
    {
        "id": "gemini",
        "name": "Google Gemini",
        "models": ["gemini-1.5-pro", "gemini-1.5-flash"],
        "is_configured": bool(os.getenv("GEMINI_API_KEY")),
    },
    {
        "id": "ollama",
        "name": "Local Ollama",
        "models": ["llama3.2", "mistral", "qwen2.5"],
        "is_configured": True,
    },
]


async def call_openai(
    prompt: str,
    system_prompt: Optional[str] = None,
    model: str = "gpt-4o",
    temperature: float = 0.7,
) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY not found in environment.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 1200,
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()


async def call_anthropic(
    prompt: str,
    system_prompt: Optional[str] = None,
    model: str = "claude-3-5-sonnet-20241022",
    temperature: float = 0.7,
) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in environment.")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    payload: Dict[str, Any] = {
        "model": model,
        "max_tokens": 1200,
        "temperature": temperature,
        "messages": [{"role": "user", "content": prompt}],
    }
    if system_prompt:
        payload["system"] = system_prompt

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["content"][0]["text"].strip()


async def call_gemini(
    prompt: str,
    system_prompt: Optional[str] = None,
    model: str = "gemini-1.5-flash",
    temperature: float = 0.7,
) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    contents = []
    if system_prompt:
        contents.append({"role": "user", "parts": [{"text": f"SYSTEM INSTRUCTION: {system_prompt}"}]})
    contents.append({"role": "user", "parts": [{"text": prompt}]})

    payload = {
        "contents": contents,
        "generationConfig": {"temperature": temperature, "maxOutputTokens": 1200},
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


async def call_ollama(
    prompt: str,
    system_prompt: Optional[str] = None,
    model: str = "llama3.2",
    temperature: float = 0.7,
) -> str:
    base_url = getattr(settings, "OLLAMA_BASE_URL", "http://localhost:11434")
    url = f"{base_url}/api/generate"
    full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt

    payload = {
        "model": model,
        "prompt": full_prompt,
        "stream": False,
        "options": {"temperature": temperature},
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "").strip()


async def generate_completion(
    prompt: str,
    system_prompt: Optional[str] = None,
    provider: str = "simulation",
    model: Optional[str] = None,
    temperature: float = 0.7,
    fallback_text: Optional[str] = None,
) -> str:
    """
    Unified multi-provider generation engine with graceful fallback to simulation.
    """
    prov = (provider or "simulation").lower()
    selected_model = model or "default"

    try:
        if prov == "openai":
            return await call_openai(prompt, system_prompt, model or "gpt-4o", temperature)
        elif prov == "anthropic":
            return await call_anthropic(prompt, system_prompt, model or "claude-3-5-sonnet-20241022", temperature)
        elif prov == "gemini":
            return await call_gemini(prompt, system_prompt, model or "gemini-1.5-flash", temperature)
        elif prov == "ollama":
            return await call_ollama(prompt, system_prompt, model or "llama3.2", temperature)
    except Exception as exc:
        logger.warning(f"Live provider '{prov}' failed ({exc}). Falling back to simulation mode.")

    # Simulated fallback
    if fallback_text:
        return fallback_text
    
    # Generic intelligent fallback
    await asyncio.sleep(0.2)
    return (
        f"Most leaders fail when approaching this domain because they rely on conventional assumptions.\n\n"
        f"Here is the high-leverage framework:\n"
        f"1. Continuous Feedback Loops (Capturing empirical telemetry)\n"
        f"2. Adversarial Red-Teaming (Eliminating corporate fluff before distribution)\n"
        f"3. Strict Validation Guardrails (Zero silent execution errors)\n\n"
        f"The outcome: 4.8x higher audience engagement and authentic brand authority."
    )
