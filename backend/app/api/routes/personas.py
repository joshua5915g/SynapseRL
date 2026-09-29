from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.services.persona_engine import (
    get_all_personas,
    get_persona_by_id,
    create_custom_persona,
    GhostwriterPersona,
)

router = APIRouter(prefix="/personas", tags=["Ghostwriter Personas & Brand Voice"])

@router.get("", response_model=List[GhostwriterPersona])
async def list_personas():
    """
    Returns available executive ghostwriter personas and voice profiles.
    """
    return get_all_personas()

@router.get("/{persona_id}", response_model=GhostwriterPersona)
async def get_persona(persona_id: str):
    persona = get_persona_by_id(persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    return persona

@router.post("", response_model=GhostwriterPersona)
async def add_custom_persona(payload: Dict[str, Any]):
    """
    Registers a custom ghostwriter persona with tone, keywords, and forbidden vocabulary.
    """
    return create_custom_persona(payload)
