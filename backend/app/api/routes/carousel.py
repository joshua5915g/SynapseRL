"""API router for LinkedIn Document Carousel generation."""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.services.carousel_generator import decompose_into_slides, generate_carousel_html

router = APIRouter()

class CarouselRequest(BaseModel):
    topic: str = Field(..., description="Topic of the article")
    content: str = Field(..., description="Full text draft of the article")
    theme: Optional[str] = Field("stealth", description="Visual theme: stealth, emerald, or indigo")

class CarouselResponse(BaseModel):
    topic: str
    theme: str
    slides: List[Dict[str, Any]]
    total_slides: int
    printable_html: str

@router.post("/generate", response_model=CarouselResponse)
async def generate_carousel_endpoint(req: CarouselRequest):
    slides = decompose_into_slides(req.topic, req.content)
    html = generate_carousel_html(req.topic, slides, req.theme or "stealth")
    return CarouselResponse(
        topic=req.topic,
        theme=req.theme or "stealth",
        slides=slides,
        total_slides=len(slides),
        printable_html=html
    )
