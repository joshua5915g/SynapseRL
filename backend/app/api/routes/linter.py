from fastapi import APIRouter
from pydantic import BaseModel
from app.services.cliche_linter import audit_content_authenticity

router = APIRouter(prefix="/linter", tags=["Cringe Hunter & Authenticity Linter"])

class LinterAuditRequest(BaseModel):
    text: str

@router.post("/audit")
async def audit_text(payload: LinterAuditRequest):
    """
    Scans text for AI buzzwords, corporate clichés, and generates clean de-fluffed output.
    """
    result = audit_content_authenticity(payload.text)
    return {"status": "success", "data": result}
