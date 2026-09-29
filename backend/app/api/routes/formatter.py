from fastapi import APIRouter
from pydantic import BaseModel
from app.services.platform_formatter import format_multi_platform

router = APIRouter(prefix="/format", tags=["Multi-Platform Formatter"])

class FormatRequest(BaseModel):
    topic: str
    content: str

@router.post("/multi-platform")
async def format_content(payload: FormatRequest):
    """
    Reformats a thought-leadership post for LinkedIn, X (Twitter) Thread, and Substack markdown.
    """
    res = format_multi_platform(topic=payload.topic, content=payload.content)
    return {"status": "success", "data": res}
